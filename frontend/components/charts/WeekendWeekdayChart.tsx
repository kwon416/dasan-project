'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface WeekdayData {
  weekday: string;
  count: number;
}

interface WeekendWeekdayChartProps {
  data: WeekdayData[];
  height?: number;
}

export function WeekendWeekdayChart({ data, height = 200 }: WeekendWeekdayChartProps) {
  const weekdayNames = ['월', '화', '수', '목', '금'];
  const weekendNames = ['토', '일'];

  const weekdayTotal = data
    .filter((d) => weekdayNames.includes(d.weekday))
    .reduce((sum, d) => sum + d.count, 0);
  const weekendTotal = data
    .filter((d) => weekendNames.includes(d.weekday))
    .reduce((sum, d) => sum + d.count, 0);

  const weekdayAvg = weekdayTotal / 5;
  const weekendAvg = weekendTotal / 2;
  const totalAvg = data.reduce((sum, d) => sum + d.count, 0) / data.length;

  const chartData = data.map((item) => ({
    ...item,
    isWeekend: weekendNames.includes(item.weekday),
    displayName: item.weekday + '요일',
  }));

  const ratio = (weekdayAvg / weekendAvg).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-xs text-muted-foreground">평일 평균</div>
          <div className="font-bold text-blue-600">{Math.round(weekdayAvg).toLocaleString()}건</div>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded-lg">
          <div className="text-xs text-muted-foreground">주말 평균</div>
          <div className="font-bold text-orange-600">{Math.round(weekendAvg).toLocaleString()}건</div>
        </div>
        <div className="text-center p-2 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">평일/주말 비율</div>
          <div className="font-bold">{ratio}배</div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="weekday"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={(value) => (value / 1000).toFixed(0) + 'k'}
            />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString() + '건', '민원 건수']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <ReferenceLine
              y={totalAvg}
              stroke="#9CA3AF"
              strokeDasharray="5 5"
              label={{ value: '평균', position: 'right', fontSize: 10, fill: '#9CA3AF' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isWeekend ? '#F97316' : '#3B82F6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span>평일</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span>주말</span>
        </div>
      </div>
    </div>
  );
}
