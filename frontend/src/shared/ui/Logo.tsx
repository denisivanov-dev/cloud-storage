interface Props {
  size?: number
  variant?: "default" | "transparent"
}

export function Logo({ size = 56, variant = "default" }: Props) {
  const wrapperClass =
    variant === "default"
      ? "bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 rounded-xl flex items-center justify-center"
      : "flex items-center justify-center"

  return (
    <div
      className={wrapperClass}
      style={{ width: size, height: size }}
    >
      <svg
        className="text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        width={size * 0.8}
        height={size * 0.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 15a4 4 0 014-4h1a5 5 0 019.584 1.828A3.5 3.5 0 0118.5 19H7a4 4 0 01-4-4z"
        />
      </svg>
    </div>
  )
}