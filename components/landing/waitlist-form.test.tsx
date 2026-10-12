import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WaitlistForm } from "@/components/landing/waitlist-form";
import { waitlistFormContent as copy } from "@/lib/content";
import { MAX_EMAIL_LENGTH, WaitlistError } from "@/lib/waitlist";

function getEmailInput() {
  return screen.getByLabelText(copy.inputLabel);
}

function getSubmitButton() {
  return screen.getByRole("button", { name: copy.submitLabel });
}

function getForm() {
  const form = getEmailInput().closest("form");
  if (!form) throw new Error("WaitlistForm rendered no <form>");
  return form;
}

function getErrorRegion() {
  const id = getEmailInput().getAttribute("aria-describedby") ?? "";
  const region = document.getElementById(id);
  if (!region) throw new Error(`No error region with id "${id}"`);
  return region;
}

/** A promise whose settlement the test controls. */
function deferred() {
  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("WaitlistForm", () => {
  describe("accessibility", () => {
    it("labels the email input and configures it for email entry", () => {
      render(<WaitlistForm />);
      const input = getEmailInput();

      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveAttribute("autocomplete", "email");
      expect(input).toHaveAttribute("name", "email");
      expect(input).not.toHaveAttribute("aria-invalid");
    });

    it("does not cap the input length, so the too-long message is reachable", () => {
      render(<WaitlistForm />);
      expect(getEmailInput()).not.toHaveAttribute("maxlength");
    });

    it("links a polite, initially empty error region to the input", () => {
      render(<WaitlistForm />);
      const region = getErrorRegion();

      expect(region).toHaveAttribute("aria-live", "polite");
      expect(region).toBeEmptyDOMElement();
    });

    it("gives each instance unique ids so labels never collide", () => {
      render(
        <>
          <WaitlistForm />
          <WaitlistForm />
        </>,
      );
      const [first, second] = screen.getAllByLabelText(copy.inputLabel);

      expect(first.id).not.toBe(second.id);
      expect(first.getAttribute("aria-describedby")).not.toBe(
        second.getAttribute("aria-describedby"),
      );
    });

    it("disables native validation so the inline message is used", () => {
      render(<WaitlistForm />);
      expect(getForm()).toHaveAttribute("novalidate");
    });
  });

  describe("validation errors", () => {
    it("shows the empty error when submitted blank", async () => {
      const user = userEvent.setup();
      const onJoin = vi.fn().mockResolvedValue(undefined);
      render(<WaitlistForm onJoin={onJoin} />);

      await user.click(getSubmitButton());

      expect(getErrorRegion()).toHaveTextContent(
        copy.errors[WaitlistError.Empty],
      );
      expect(getEmailInput()).toHaveAttribute("aria-invalid", "true");
      expect(onJoin).not.toHaveBeenCalled();
    });

    it("treats whitespace-only input as empty", async () => {
      const user = userEvent.setup();
      render(<WaitlistForm />);

      await user.type(getEmailInput(), "    ");
      await user.click(getSubmitButton());

      expect(getErrorRegion()).toHaveTextContent(
        copy.errors[WaitlistError.Empty],
      );
    });

    it("shows the malformed error for an invalid address", async () => {
      const user = userEvent.setup();
      const onJoin = vi.fn().mockResolvedValue(undefined);
      render(<WaitlistForm onJoin={onJoin} />);

      await user.type(getEmailInput(), "budi@satuporto");
      await user.click(getSubmitButton());

      expect(getErrorRegion()).toHaveTextContent(
        copy.errors[WaitlistError.Malformed],
      );
      expect(onJoin).not.toHaveBeenCalled();
    });

    it("shows the too-long error for an address over the limit", () => {
      const onJoin = vi.fn().mockResolvedValue(undefined);
      render(<WaitlistForm onJoin={onJoin} />);
      const domain = "@example.com";
      const tooLong = `${"a".repeat(MAX_EMAIL_LENGTH + 1 - domain.length)}${domain}`;

      fireEvent.change(getEmailInput(), { target: { value: tooLong } });
      fireEvent.submit(getForm());

      expect(getErrorRegion()).toHaveTextContent(
        copy.errors[WaitlistError.TooLong],
      );
      expect(onJoin).not.toHaveBeenCalled();
    });

    it("validates when the form is submitted with Enter", async () => {
      const user = userEvent.setup();
      render(<WaitlistForm />);

      await user.type(getEmailInput(), "nope{Enter}");

      expect(getErrorRegion()).toHaveTextContent(
        copy.errors[WaitlistError.Malformed],
      );
    });

    it("re-inserts the message on a repeated failed submit so it is announced again", async () => {
      const user = userEvent.setup();
      render(<WaitlistForm />);

      await user.type(getEmailInput(), "nope{Enter}");
      const firstMessage = getErrorRegion().firstElementChild;
      await user.type(getEmailInput(), "{Enter}");
      const secondMessage = getErrorRegion().firstElementChild;

      expect(firstMessage).not.toBeNull();
      expect(secondMessage).toHaveTextContent(
        copy.errors[WaitlistError.Malformed],
      );
      expect(secondMessage).not.toBe(firstMessage);
      expect(firstMessage).not.toBeInTheDocument();
    });

    it("clears the error as soon as the user edits the input", async () => {
      const user = userEvent.setup();
      render(<WaitlistForm />);

      await user.type(getEmailInput(), "nope{Enter}");
      expect(getErrorRegion()).not.toBeEmptyDOMElement();

      await user.type(getEmailInput(), "@");

      expect(getErrorRegion()).toBeEmptyDOMElement();
      expect(getEmailInput()).not.toHaveAttribute("aria-invalid");
    });

    it("keeps what the user typed after an error", async () => {
      const user = userEvent.setup();
      render(<WaitlistForm />);

      await user.type(getEmailInput(), "budi@satuporto");
      await user.click(getSubmitButton());

      expect(getEmailInput()).toHaveValue("budi@satuporto");
    });
  });

  describe("successful submission", () => {
    it("sends the normalized address and shows the confirmation", async () => {
      const user = userEvent.setup();
      const onJoin = vi.fn().mockResolvedValue(undefined);
      render(<WaitlistForm onJoin={onJoin} />);

      await user.type(getEmailInput(), "  Budi@SatuPorto.Biz.ID ");
      await user.click(getSubmitButton());

      expect(onJoin).toHaveBeenCalledTimes(1);
      expect(onJoin).toHaveBeenCalledWith("budi@satuporto.biz.id");
      const confirmation = screen.getByRole("group", {
        name: copy.successTitle,
      });
      expect(confirmation).toHaveAccessibleDescription(
        copy.successBody("budi@satuporto.biz.id"),
      );
    });

    it("replaces the form and announces once, by moving focus to the confirmation", async () => {
      const user = userEvent.setup();
      render(<WaitlistForm />);

      await user.type(getEmailInput(), "budi@satuporto.biz.id");
      await user.click(getSubmitButton());

      expect(screen.queryByLabelText(copy.inputLabel)).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      const confirmation = screen.getByRole("group", {
        name: copy.successTitle,
      });
      expect(confirmation).toHaveFocus();
      // No live region repeats what focus already announces.
      expect(confirmation.closest("[aria-live]")).toBeNull();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("works with the default handler, which makes no network call", async () => {
      const user = userEvent.setup();
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      render(<WaitlistForm />);

      await user.type(getEmailInput(), "budi@satuporto.biz.id");
      await user.click(getSubmitButton());

      expect(await screen.findByText(copy.successTitle)).toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("wraps a very long address instead of overflowing", async () => {
      const user = userEvent.setup();
      const longLocalPartLength = 80;
      const longEmail = `${"a".repeat(longLocalPartLength)}@example.com`;
      render(<WaitlistForm />);

      await user.type(getEmailInput(), longEmail);
      await user.click(getSubmitButton());

      expect(screen.getByText(copy.successBody(longEmail))).toHaveClass(
        "break-words",
      );
    });
  });

  describe("while submitting", () => {
    it("marks the button disabled and the form busy", async () => {
      const user = userEvent.setup();
      const pending = deferred();
      render(<WaitlistForm onJoin={() => pending.promise} />);

      await user.type(getEmailInput(), "budi@satuporto.biz.id");
      await user.click(getSubmitButton());

      const busyButton = screen.getByRole("button", {
        name: copy.submittingLabel,
      });
      expect(busyButton).toHaveAttribute("aria-disabled", "true");
      expect(getForm()).toHaveAttribute("aria-busy", "true");

      await act(async () => pending.resolve());
    });

    it("ignores further submits until the first one settles", async () => {
      const pending = deferred();
      const onJoin = vi.fn().mockReturnValue(pending.promise);
      render(<WaitlistForm onJoin={onJoin} />);

      fireEvent.change(getEmailInput(), {
        target: { value: "budi@satuporto.biz.id" },
      });
      fireEvent.submit(getForm());
      fireEvent.submit(getForm());
      fireEvent.submit(getForm());

      expect(onJoin).toHaveBeenCalledTimes(1);

      await act(async () => pending.resolve());
      expect(screen.getByText(copy.successTitle)).toBeInTheDocument();
    });

    it("keeps focus on the button, shows a retry message and re-enables it when saving fails", async () => {
      const user = userEvent.setup();
      const pending = deferred();
      render(<WaitlistForm onJoin={() => pending.promise} />);

      await user.type(getEmailInput(), "budi@satuporto.biz.id");
      await user.click(getSubmitButton());
      const busyButton = screen.getByRole("button", {
        name: copy.submittingLabel,
      });
      expect(busyButton).toHaveFocus();
      // Browsers blur a natively disabled button (jsdom does not), so the
      // busy button must stay focusable: aria-disabled, never `disabled`.
      expect(busyButton).not.toHaveAttribute("disabled");

      await act(async () => pending.reject(new Error("offline")));

      expect(getErrorRegion()).toHaveTextContent(
        copy.errors[WaitlistError.SubmitFailed],
      );
      expect(getSubmitButton()).toHaveFocus();
      expect(getSubmitButton()).not.toHaveAttribute("aria-disabled", "true");
      expect(getSubmitButton()).toBeEnabled();
      expect(getEmailInput()).toHaveValue("budi@satuporto.biz.id");
      expect(getEmailInput()).not.toHaveAttribute("aria-invalid");
    });
  });
});
