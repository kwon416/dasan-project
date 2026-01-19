'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';

interface HourlyData {
  hour: number;
  count: number;
}

interface HourlyDistributionChartProps {
  data: HourlyData[];
  height?: number;
}

export function HourlyDistributionChart({ data, height = 200 }: HourlyDistributionChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    displayHour: `${item.hour}시`,
    period:
      item.hour >= 9 && item.hour < 18
        ? 'business'
        : item.hour >= 18 || item.hour < 6
        ? 'night'
        : 'morning',
  }));

  const totalCount = data.reduce((sum, d) => sum + d.count, 0);
  const businessHours = data
    .filter((d) => d.hour >= 9 && d.hour < 18)
    .reduce((sum, d) => sum + d.count, 0);
  const peakHour = data.reduce((max, d) => (d.count > max.count ? d : max), data[0]);
  const lowestHour = data.reduce((min, d) => (d.count < min.count ? d : min), data[0]);

  const businessPercent = ((businessHours / totalCount) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <div className="text-xs text-muted-foreground">피크 시간</div>
          <div className="font-bold text-red-600">{peakHour.hour}시</div>
          <div className="text-xs">{peakHour.count.toLocaleString()}건</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-xs text-muted-foreground">최저 시간</div>
          <div className="font-bold text-blue-600">{lowestHour.hour}시</div>
          <div className="text-xs">{lowestHour.count.toLocaleString()}건</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-xs text-muted-foreground">업무시간 비율</div>
          <div className="font-bold text-green-600">{businessPercent}%</div>
          <div className="text-xs">9시~18시</div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={formattedData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0033A0" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0033A0" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            {/* Business hours highlight */}
            <ReferenceArea
              x1="9시"
              x2="17시"
              fill="#10B981"
              fillOpacity={0.1}
              stroke="none"
            />
            <XAxis
              dataKey="displayHour"
              tick={{ fontSize: 9 }}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString() + '건', '민원 건수']}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0033A0"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHourly)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time Period Legend */}
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
          <span>업무시간 (9~18시)</span>
        </div>
      </div>
    </div>
  );
}
