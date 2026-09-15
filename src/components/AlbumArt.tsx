/** Solid-color album art placeholder — broadside style: 0 radius, grayscale */
export function AlbumArt({
  color,
  size,
  title,
  className = "",
}: {
  color?: string;
  size: number;
  title?: string;
  className?: string;
}) {
  const bg =
    color ||
    `hsl(${Math.abs(hashCode(title || "")) % 360}, 40%, 25%)`;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: `linear-gradient(135deg, ${bg}, ${adjustColor(bg, -20)})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "grayscale(1) contrast(1.05)",
        borderRadius: 0,
      }}
      title={title}
      aria-label={title || "Album art"}
    >
      <svg
        width={size * 0.35}
        height={size * 0.35}
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </div>
  );
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function adjustColor(hex: string, amount: number): string {
  if (!hex.startsWith("#")) return hex;
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
