"use client";

import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { primaryGlowButtonClassName } from "@/components/landing/button-styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { waitlistFormContent as copy } from "@/lib/content";
import { cn } from "@/lib/utils";
import { validateEmail, WaitlistError, WaitlistStatus } from "@/lib/waitlist";

type FormState =
  | { status: WaitlistStatus.Idle }
  | { status: WaitlistStatus.Submitting }
  | { status: WaitlistStatus.Invalid; error: WaitlistError }
  | { status: WaitlistStatus.Success; email: string };

/** Stand-in until a backend exists: accepts every valid address locally. */
async function acceptLocally(): Promise<void> {}

interface WaitlistFormProps {
  /**
   * Stores a validated, normalized address. Rejecting shows a retry message.
   * Defaults to a local no-op, so no network request is made today.
   */
  onJoin?: (email: string) => Promise<void>;
  className?: string;
}

/** Email capture shared by the hero and the bottom call to action. */
export function WaitlistForm({
  onJoin = acceptLocally,
  className,
}: WaitlistFormProps) {
  const baseId = useId();
  const inputId = `${baseId}-email`;
  const errorId = `${baseId}-error`;
  const successTitleId = `${baseId}-success-title`;
  const successBodyId = `${baseId}-success-body`;

  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>({
    status: WaitlistStatus.Idle,
  });
  // Bumped on every failed submit so a repeated, identical message is
  // re-inserted into the live region and announced again.
  const [errorAttempt, setErrorAttempt] = useState(0);
  const successRef = useRef<HTMLDivElement>(null);

  const isSubmitting = state.status === WaitlistStatus.Submitting;
  const error = state.status === WaitlistStatus.Invalid ? state.error : null;
  // A failed save is not the address's fault, so the input stays valid.
  const isInputInvalid = error !== null && error !== WaitlistError.SubmitFailed;

  useEffect(() => {
    // The form unmounts on success, so hand focus to the confirmation.
    if (state.status === WaitlistStatus.Success) {
      successRef.current?.focus();
    }
  }, [state.status]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    if (state.status === WaitlistStatus.Invalid) {
      setState({ status: WaitlistStatus.Idle });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const result = validateEmail(email);
    if (result.status === WaitlistStatus.Invalid) {
      setState(result);
      setErrorAttempt((attempt) => attempt + 1);
      return;
    }

    setState({ status: WaitlistStatus.Submitting });
    try {
      await onJoin(result.email);
      setState({ status: WaitlistStatus.Success, email: result.email });
    } catch {
      setState({
        status: WaitlistStatus.Invalid,
        error: WaitlistError.SubmitFailed,
      });
      setErrorAttempt((attempt) => attempt + 1);
    }
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      {state.status === WaitlistStatus.Success ? null : (
        <form
          noValidate
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor={inputId} className="sr-only">
            {copy.inputLabel}
          </label>
          <Input
            id={inputId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder={copy.placeholder}
            value={email}
            onChange={handleChange}
            aria-invalid={isInputInvalid ? true : undefined}
            aria-describedby={errorId}
            className="h-12 rounded-full border-white/10 bg-white/[0.04] px-5 text-base text-white placeholder:text-zinc-400 focus-visible:border-emerald-400/60 focus-visible:ring-emerald-400/30 sm:flex-1 md:text-base"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            // Keeps focus on the button while it is busy, so a failed save
            // does not drop keyboard users back to the top of the page.
            focusableWhenDisabled
            className={cn(primaryGlowButtonClassName, "shrink-0")}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="motion-safe:animate-spin"
                />
                {copy.submittingLabel}
              </>
            ) : (
              <>
                {copy.submitLabel}
                <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
        </form>
      )}

      <p
        id={errorId}
        aria-live="polite"
        className={cn(
          "text-sm text-rose-300",
          error ? "mt-3 px-5 text-left" : "sr-only",
        )}
      >
        {error ? <span key={errorAttempt}>{copy.errors[error]}</span> : null}
      </p>

      {state.status === WaitlistStatus.Success ? (
        // Announced once, by moving focus here (the form it replaces is
        // gone), rather than also through a live region.
        <div
          ref={successRef}
          tabIndex={-1}
          role="group"
          aria-labelledby={successTitleId}
          aria-describedby={successBodyId}
          className="flex items-start gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60"
        >
          <CircleCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-emerald-300"
          />
          <div className="min-w-0">
            <p id={successTitleId} className="font-semibold text-white">
              {copy.successTitle}
            </p>
            <p
              id={successBodyId}
              className="mt-1 text-sm break-words text-zinc-300"
            >
              {copy.successBody(state.email)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
