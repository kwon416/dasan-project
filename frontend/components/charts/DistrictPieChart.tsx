'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DistrictData {
  name: string;
  value: number;
}

interface DistrictPieChartProps {
  data: DistrictData[];
  title?: string;
  height?: number;
}

interface TooltipPayload {
  name: string;
  value: number;
}

const COLORS = [
  '#0033A0',
  '#1E5FC2',
  '#3D7BE4',
  '#5B97FF',
  '#2E8B57',
  '#FF6B6B',
  '#FFA94D',
  '#A78BFA',
  '#38BDF8',
  '#94A3B8',
];

// Custom tooltip component moved outside
function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].value.toLocaleString()}건
        </p>
      </div>
    );
  }
  return null;
}

export function DistrictPieChart({
  data,
  title = '기관별 현황 Top10',
  height = 300,
}: DistrictPieChartProps) {
  // 상위 9개 + 나머지를 "기타"로 합침
  const top9Data = data.slice(0, 9);
  const restData = data.slice(9);
  const otherValue = restData.reduce((sum, item) => sum + item.value, 0);

  const chartData = otherValue > 0
    ? [...top9Data, { name: '기타', value: otherValue }]
    : top9Data;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="40%"
              cy="50%"
              outerRadius={110}
              innerRadius={55}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => <span className="text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
