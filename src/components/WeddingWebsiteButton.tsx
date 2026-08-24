const WEDDING_WEBSITE_URL = 'https://withjoy.com/naveed-and-samha/'

export const WeddingWebsiteButton = () => (
  <a
    href={WEDDING_WEBSITE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="fab"
    aria-label="Open our official wedding website (opens in a new tab)"
  >
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="3.8"
        ry="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3.7 8.5h16.6M3.7 15.5h16.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  </a>
)
