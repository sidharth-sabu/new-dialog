import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// Blue sparkle/shuriken magic icon for the search input
export const SparkleIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 5L13.75 10.25L19 12L13.75 13.75L12 19L10.25 13.75L5 12L10.25 10.25L12 5Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Channel/trending icon for classify actions
export const ChannelIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="4" y="15" width="4" height="4" rx="0.5" fill="currentColor" />
    <rect x="7" y="8" width="4" height="4" rx="0.5" fill="currentColor" />
    <rect x="13" y="12" width="4" height="4" rx="0.5" fill="currentColor" />
    <rect x="16" y="5" width="4" height="4" rx="0.5" fill="currentColor" />
    <path
      d="M6 17L9 10L15 14L18 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Zap/lightning icon for auto analysis
export const ZapIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13 3L6 14H12L11 21L18 10H12L13 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Page/document icon for requirements doc
export const PageIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 5C6 4.44772 6.44772 4 7 4H13.5L18 8.5V19C18 19.5523 17.5523 20 17 20H7C6.44772 20 6 19.5523 6 19V5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 4V9H18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 11H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Masonry/grid icon for visualize metrics
export const MasonryIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="5" y="5" width="5" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="5" y="15" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="14" y="5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="14" y="12" width="5" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
  </svg>
)

// Compass/target icon for interview
export const CompassIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

// Folder icon
export const FolderIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 8C5 7.44772 5.44772 7 6 7H10L12 9H18C18.5523 9 19 9.44772 19 10V17C19 17.5523 18.5523 18 18 18H6C5.44772 18 5 17.5523 5 17V8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 8V6.5C5 6.22386 5.22386 6 5.5 6H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

// More/dots icon
export const MoreIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

// Zendesk logo icon
export const ZendeskIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M11 8V18L4 8H11Z" fill="currentColor" />
    <path d="M13 16V6L20 16H13Z" fill="currentColor" />
  </svg>
)

// Zapier lightning icon
export const ZapierIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13 3L4 14H12L11 21L20 10H12L13 3Z"
      fill="currentColor"
    />
  </svg>
)

// Intercom icon
export const IntercomIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
    <path d="M8 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
