'use client';

const LEGEND_ITEMS = [
  { color: '#08306b', label: '1~5위', desc: '상위' },
  { color: '#2171b5', label: '6~10위', desc: '' },
  { color: '#4292c6', label: '11~15위', desc: '' },
  { color: '#6baed6', label: '16~20위', desc: '' },
  { color: '#c6dbef', label: '21~25위', desc: '하위' },
];

export function SeoulMapLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-border">
      <p className="text-xs font-medium mb-2 text-foreground">민원 건수 순위</p>
      <div className="space-y-1">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.color} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
            {item.desc && (
              <span className="text-[10px] text-muted-foreground/60">({item.desc})</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-400" />
          <span className="text-xs text-muted-foreground">선택</span>
        </div>
      </div>
    </div>
  );
}
