import { Database, Clock, Calendar, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DataStatus } from '@/types';

interface DataStatusCardProps {
  status: DataStatus;
}

export function DataStatusCard({ status }: DataStatusCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = [
    {
      icon: Calendar,
      label: '수집 기간',
      value: `${formatDate(status.collectionPeriod.start)} ~ ${formatDate(status.collectionPeriod.end)}`,
    },
    {
      icon: Clock,
      label: '최종 업데이트',
      value: formatDateTime(status.lastUpdated),
    },
    {
      icon: Database,
      label: '전체 데이터',
      value: `${status.totalRecords.toLocaleString()}건`,
    },
    {
      icon: Building2,
      label: '대상 자치구',
      value: `${status.totalDistricts}개`,
    },
  ];

  return (
    <Card className="bg-gradient-to-r from-[#0033A0]/5 to-[#0033A0]/10 border-[#0033A0]/20">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0033A0]/10">
                <stat.icon className="h-4 w-4 text-[#0033A0]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-medium">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
