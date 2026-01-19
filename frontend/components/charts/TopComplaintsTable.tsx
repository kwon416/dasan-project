'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TopComplaint {
  rank: number;
  title: string;
  category: string;
  count: number;
  trend: string;
}

interface TopComplaintsTableProps {
  data: TopComplaint[];
  title?: string;
}

export function TopComplaintsTable({
  data,
  title = '오늘의 민원 Top10',
}: TopComplaintsTableProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '교통·주차': 'bg-blue-100 text-blue-800',
      '도로·시설물': 'bg-orange-100 text-orange-800',
      '환경·청소': 'bg-green-100 text-green-800',
      '건축·주택': 'bg-purple-100 text-purple-800',
      '복지·보건': 'bg-pink-100 text-pink-800',
      '세무·요금': 'bg-yellow-100 text-yellow-800',
      '안전·재난': 'bg-red-100 text-red-800',
      '문화·관광': 'bg-cyan-100 text-cyan-800',
      '교육·청소년': 'bg-indigo-100 text-indigo-800',
      '민원행정': 'bg-slate-100 text-slate-800',
      '기타': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">순위</TableHead>
              <TableHead>민원 유형</TableHead>
              <TableHead>분류</TableHead>
              <TableHead className="text-right">건수</TableHead>
              <TableHead className="w-[50px]">추세</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.rank}>
                <TableCell className="font-medium">{item.rank}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getCategoryColor(item.category)}>
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.count.toLocaleString()}건
                </TableCell>
                <TableCell>{getTrendIcon(item.trend)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
