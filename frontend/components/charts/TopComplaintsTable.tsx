'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TopComplaint {
  rank: number;
  title: string;
  category?: string;
  count: number;
  trend?: string;
}

interface TopComplaintsTableProps {
  data: TopComplaint[];
  title?: string;
  timestamp?: string;
}

export function TopComplaintsTable({
  data,
  title = '오늘의 민원 Top10',
  timestamp,
}: TopComplaintsTableProps) {
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              기준: {formatTime(timestamp)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">순위</TableHead>
              <TableHead>키워드</TableHead>
              <TableHead className="w-[100px] text-right">건수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.rank}>
                <TableCell className="font-medium">{item.rank}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell className="text-right font-medium">
                  {item.count.toLocaleString()}건
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
