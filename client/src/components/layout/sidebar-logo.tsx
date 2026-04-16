const SidebarLogo = () => (
  <svg
    width="40"
    height="38"
    viewBox="0 0 40 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Project Hub logo"
  >
    {/* Outer left dark triangle */}
    <path d="M0 34L20 0L6.6667 36L0 34Z" fill="#9E9BF5" />
    {/* Inner left triangle */}
    <path d="M6.6667 34L13.3334 36L20.0001 0L6.6667 34Z" fill="#D0CFFC" />
    {/* Center column */}
    <path
      d="M13.3333 36L19.9999 38L26.6666 36L19.9999 0L13.3333 36Z"
      fill="#EDEDFC"
    />
    {/* Inner right triangle */}
    <path d="M26.6667 36L33.3333 34L20 0L26.6667 36Z" fill="#D0CFFC" />
    {/* Outer right dark triangle */}
    <path d="M40 34L20 0L33.3333 36L40 34Z" fill="#9E9BF5" />
  </svg>
);

export default SidebarLogo;
