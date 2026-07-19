/**
 * KINETIC spark — a 4-point concave star in Ferrari red.
 * The signature accent mark; use it sparingly (one per section max).
 */
export default function Spark({
  className,
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 0c.4 6.2 5.4 11.2 11.6 11.6v.8C17.4 12.8 12.4 17.8 12 24h-.8C10.8 17.8 5.8 12.8-.4 12.4v-.8C5.8 11.2 10.8 6.2 11.2 0h.8Z"
        transform="translate(0.4 0)"
        fill="var(--color-accent)"
      />
    </svg>
  );
}
