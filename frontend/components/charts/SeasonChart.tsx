'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface SeasonData {
  season: string;
  count: number;
  months: string;
}

interface SeasonChartProps {
  data: SeasonData[];
  height?: number;
}

const SEASON_COLORS = {
  '봄': '#10B981', // green
  '여름': '#F59E0B', // amber
  '가을': '#EF4444', // red
  '겨울': '#3B82F6', // blue
};

export function SeasonChart({ data, height = 200 }: SeasonChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const maxSeason = data.reduce((max, item) => (item.count > max.count ? item : max), data[0]);

  const chartData = data.map((item) => ({
    ...item,
    percentage: ((item.count / total) * 100).toFixed(1),
    color: SEASON_COLORS[item.season as keyof typeof SEASON_COLORS] || '#6B7280',
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
              dataKey="count"
              nameKey="season"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()}건 (${((value / total) * 100).toFixed(1)}%)`,
                name,
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {chartData.map((item) => (
          <div
            key={item.season}
            className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
              item.season === maxSeason.season ? 'bg-muted ring-1 ring-primary/20' : ''
            }`}
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{item.season}</div>
              <div className="text-xs text-muted-foreground">{item.months}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-semibold">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
