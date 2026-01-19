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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyData {
  date: string;
  totalCount: number;
  displayLabel?: string;
}

interface DailyComplaintChartProps {
  data: DailyData[];
  title?: string;
  height?: number;
  showCard?: boolean;
  tooltipLabel?: string;
}

export function DailyComplaintChart({
  data,
  title = '일별 민원 건수',
  height = 300,
  showCard = true,
  tooltipLabel = '날짜',
}: DailyComplaintChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: item.displayLabel || new Date(item.date).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip
          formatter={(value: number) => [value.toLocaleString() + '건', '민원 건수']}
          labelFormatter={(label) => `${tooltipLabel}: ${label}`}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalCount"
          name="민원 건수"
          stroke="#0033A0"
          strokeWidth={2}
          dot={{ fill: '#0033A0', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#0033A0' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  if (!showCard) {
    return chart;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>{chart}</CardContent>
    </Card>
  );
}
