type ProgressDotsProps = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 items-center" aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full h-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: i === current ? 22 : 8,
            background:
              i < current ? "#B8E3D1" : i === current ? "#4B3F72" : "rgba(75,63,114,0.18)",
          }}
        />
      ))}
    </div>
  );
}
