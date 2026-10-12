import { navLinks, type NavLink } from "@/lib/content";

interface NavLinkListProps {
  /** Links to show; defaults to the main section links. */
  links?: readonly NavLink[];
  /** Classes for the `<ul>`, e.g. the layout direction and gaps. */
  className?: string;
  /** Classes for each `<a>`. */
  linkClassName?: string;
  /** Runs when any link is chosen, e.g. to close a menu. */
  onNavigate?: () => void;
}

/** The section links, shared by the desktop nav, the mobile menu and the footer. */
export function NavLinkList({
  links = navLinks,
  className,
  linkClassName,
  onNavigate,
}: NavLinkListProps) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} onClick={onNavigate} className={linkClassName}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
