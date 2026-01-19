'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MonthlyData {
  month: string;
  count: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyData[];
  height?: number;
}

export function MonthlyTrendChart({ data, height = 200 }: MonthlyTrendChartProps) {
  // Calculate trend data
  const chartData = data.map((item, index) => {
    const prevCount = index > 0 ? data[index - 1].count : item.count;
    const change = item.count - prevCount;
    const changePercent = prevCount > 0 ? ((change / prevCount) * 100).toFixed(1) : '0';

    return {
      ...item,
      change,
      changePercent: parseFloat(changePercent),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
  });

  const avg = data.reduce((sum, d) => sum + d.count, 0) / data.length;
  const maxMonth = data.reduce((max, d) => (d.count > max.count ? d : max), data[0]);
  const minMonth = data.reduce((min, d) => (d.count < min.count ? d : min), data[0]);

  // Calculate overall trend (first half vs second half)
  const firstHalf = data.slice(0, 6).reduce((sum, d) => sum + d.count, 0);
  const secondHalf = data.slice(6).reduce((sum, d) => sum + d.count, 0);
  const overallTrend = secondHalf > firstHalf ? 'up' : secondHalf < firstHalf ? 'down' : 'stable';
  const trendPercent = Math.abs(((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-xs text-muted-foreground">최고</div>
          <div className="font-bold text-green-600">{maxMonth.month}</div>
          <div className="text-xs">{maxMonth.count.toLocaleString()}건</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <div className="text-xs text-muted-foreground">최저</div>
          <div className="font-bold text-red-600">{minMonth.month}</div>
          <div className="text-xs">{minMonth.count.toLocaleString()}건</div>
        </div>
        <div className={`text-center p-2 rounded-lg ${
          overallTrend === 'up' ? 'bg-amber-50' : overallTrend === 'down' ? 'bg-blue-50' : 'bg-muted'
        }`}>
          <div className="text-xs text-muted-foreground">연간 추세</div>
          <div className={`font-bold flex items-center justify-center gap-1 ${
            overallTrend === 'up' ? 'text-amber-600' : overallTrend === 'down' ? 'text-blue-600' : 'text-muted-foreground'
          }`}>
            {overallTrend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : overallTrend === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            {trendPercent}%
          </div>
          <div className="text-xs">{overallTrend === 'up' ? '증가' : overallTrend === 'down' ? '감소' : '유지'}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10 }}
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
              formatter={(value: number, name: string) => {
                if (name === 'count') return [value.toLocaleString() + '건', '민원 건수'];
                return [value, name];
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm text-xs">
                      <div className="font-medium mb-1">{label}</div>
                      <div className="flex items-center gap-2">
                        <span>민원 건수:</span>
                        <span className="font-semibold">{item.count.toLocaleString()}건</span>
                      </div>
                      {item.change !== 0 && (
                        <div className={`flex items-center gap-1 mt-1 ${
                          item.trend === 'up' ? 'text-red-500' : 'text-blue-500'
                        }`}>
                          {item.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>전월 대비 {item.changePercent > 0 ? '+' : ''}{item.changePercent}%</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={avg}
              stroke="#9CA3AF"
              strokeDasharray="5 5"
              label={{ value: '평균', position: 'right', fontSize: 10, fill: '#9CA3AF' }}
            />
            <Bar
              dataKey="count"
              fill="#0033A0"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
