import { ArrowUpRight } from "lucide-react";

import { focusRingClassName } from "@/components/landing/button-styles";
import { pageContainerClassName } from "@/components/landing/landing-section";
import { Logo } from "@/components/landing/logo";
import { NavLinkList } from "@/components/landing/nav-link-list";
import { footerContent, footerLinks } from "@/lib/content";
import { cn } from "@/lib/utils";

const footerLinkClassName = cn(
  "rounded-md transition-colors hover:text-white",
  focusRingClassName,
);

export function Footer() {
  const { credit } = footerContent;

  return (
    <footer className="border-t border-white/10">
      <div
        className={cn(
          pageContainerClassName,
          "flex flex-col gap-6 py-10 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between",
        )}
      >
        <Logo />
        <NavLinkList
          links={footerLinks}
          className="flex flex-wrap gap-x-6 gap-y-2"
          linkClassName={footerLinkClassName}
        />
        <div className="flex flex-col gap-1 md:items-end">
          <p>
            {footerContent.copyright} {footerContent.madeIn}
          </p>
          <a
            href={credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              footerLinkClassName,
              "inline-flex w-fit items-center gap-1",
            )}
          >
            {credit.label}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />{" "}
            <span className="sr-only">{credit.newTabHint}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
