export function ProgressRing({
  value,
  max,
  size = 128,
}: {
  value: number;
  max: number;
  size?: number;
}) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;
  return (
    <div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", display: "block" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="progress-ring-track"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="progress-ring-fill"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke="#B70035"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="font-poppins font-bold text-2xl text-indigo-600">
          {value}
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          /{max} EC
        </span>
      </div>
    </div>
  );
}
