'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  month?: string;
  hour?: number;
  weekday?: string;
  [key: string]: number | string | undefined;
}

interface KeywordTrendChartProps {
  data: DataPoint[];
  keywords: string[];
  xDataKey: string;
  height?: number;
  showLegend?: boolean;
}

const COLORS = [
  '#0033A0', // 파랑
  '#E53935', // 빨강
  '#43A047', // 초록
  '#FB8C00', // 주황
  '#8E24AA', // 보라
];

export function KeywordTrendChart({
  data,
  keywords,
  xDataKey,
  height = 280,
  showLegend = true,
}: KeywordTrendChartProps) {
  const formatXAxis = (value: string | number) => {
    if (xDataKey === 'hour') {
      return `${value}시`;
    }
    return String(value);
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey={xDataKey}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
          tickFormatter={formatXAxis}
        />
        <YAxis
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            value.toLocaleString() + '건',
            name,
          ]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelFormatter={(label) => formatXAxis(label)}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="circle"
            iconSize={8}
          />
        )}
        {keywords.map((keyword, index) => (
          <Line
            key={keyword}
            type="monotone"
            dataKey={keyword}
            name={keyword}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS[index % COLORS.length] }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
