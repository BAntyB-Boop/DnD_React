// The Starbound Codex sigil — shared brand mark used by SiteNav and the Preloader.
export interface SigilIconProps {
  className?: string;
}

export const SigilIcon = ({ className = "h-4 w-4" }: SigilIconProps) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 1v6M12 17v6M1 12h6M17 12h6" />
  </svg>
);
