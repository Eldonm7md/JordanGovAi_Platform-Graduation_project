interface CrestProps {
  size?: number;
  color?: string;
}

export default function Crest({ size = 38, color = "var(--color-primary)" }: CrestProps) {
  const dots = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    return { x: 20 + Math.cos(a) * 9, y: 20 + Math.sin(a) * 9 };
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="20" cy="20" r="13" fill="none" stroke={color} strokeWidth="1" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.5" fill={color} />
      ))}
      <circle cx="20" cy="20" r="2.5" fill={color} />
    </svg>
  );
}
