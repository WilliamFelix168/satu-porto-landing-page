"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import {
  focusRingClassName,
  outlineGlassButtonClassName,
} from "@/components/landing/button-styles";
import { pageContainerClassName } from "@/components/landing/landing-section";
import { Logo } from "@/components/landing/logo";
import { NavLinkList } from "@/components/landing/nav-link-list";
import { WaitlistLink } from "@/components/landing/waitlist-link";
import { navbarContent, SectionId, sectionHref } from "@/lib/content";
import { cn } from "@/lib/utils";

const ESCAPE_KEY = "Escape";

const navLinkClassName = cn(
  "rounded-md text-sm text-zinc-400 transition-colors hover:text-white",
  focusRingClassName,
);

/** Sticky top bar: logo, section links, waitlist button and a mobile menu. */
export function Navbar() {
  const menuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== ESCAPE_KEY) return;
      setIsMenuOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <nav aria-label={navbarContent.primaryNavLabel}>
        <div
          className={cn(
            pageContainerClassName,
            "flex h-navbar items-center justify-between gap-4",
          )}
        >
          <a
            href={sectionHref(SectionId.Top)}
            aria-label={navbarContent.homeLabel}
            onClick={closeMenu}
            className={cn("rounded-lg", focusRingClassName)}
          >
            <Logo />
          </a>

          <NavLinkList
            className="hidden items-center gap-8 md:flex"
            linkClassName={navLinkClassName}
          />

          <WaitlistLink
            className={cn(outlineGlassButtonClassName, "hidden md:inline-flex")}
          >
            {navbarContent.joinWaitlistLabel}
          </WaitlistLink>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={
              isMenuOpen
                ? navbarContent.closeMenuLabel
                : navbarContent.openMenuLabel
            }
            onClick={() => setIsMenuOpen((open) => !open)}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden",
              focusRingClassName,
            )}
          >
            {isMenuOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>

        <div
          id={menuId}
          hidden={!isMenuOpen}
          className="border-t border-white/10 bg-black/90 md:hidden"
        >
          <div className={cn(pageContainerClassName, "pt-2 pb-6")}>
            <NavLinkList
              className="flex flex-col"
              linkClassName={cn(
                navLinkClassName,
                "flex min-h-11 items-center text-base",
              )}
              onNavigate={closeMenu}
            />
            <WaitlistLink
              onNavigate={closeMenu}
              className={cn(outlineGlassButtonClassName, "mt-4 h-11 w-full")}
            >
              {navbarContent.joinWaitlistLabel}
            </WaitlistLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
