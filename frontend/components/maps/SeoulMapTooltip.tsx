'use client';

interface SeoulMapTooltipProps {
  name: string;
  complaints: number;
  rank?: number;
  x: number;
  y: number;
}

export function SeoulMapTooltip({ name, complaints, rank, x, y }: SeoulMapTooltipProps) {
  return (
    <div
      className="absolute pointer-events-none z-50 bg-white px-3 py-2 rounded-lg shadow-lg border border-border"
      style={{
        left: x + 12,
        top: y - 10,
      }}
    >
      <div className="flex items-center gap-2">
        <p className="font-semibold text-sm text-foreground">{name}</p>
        {rank && (
          <span className="bg-[#0033A0] text-white text-xs px-1.5 py-0.5 rounded font-medium">
            {rank}위
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">
        민원: <span className="font-medium text-foreground">{complaints.toLocaleString()}건</span>
      </p>
    </div>
  );
}
