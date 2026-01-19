'use client';

import { Eye, Users, Download } from 'lucide-react';
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
import { DailyComplaintChart } from '@/components/charts';

// Sample admin data
const usageStats = {
  totalViews: 15234,
  uniqueUsers: 3456,
  totalDownloads: 892,
  avgSessionDuration: '4분 32초',
};

const menuStats = [
  { menuName: '메인 대시보드', path: '/', clickCount: 5234, lastAccessed: '2024-12-20T10:30:00' },
  { menuName: '콜 이슈', path: '/call-issue', clickCount: 3891, lastAccessed: '2024-12-20T10:28:00' },
  { menuName: '지역별 민원', path: '/complaint/region', clickCount: 3456, lastAccessed: '2024-12-20T10:25:00' },
  { menuName: '기간별 분석', path: '/complaint/period', clickCount: 2123, lastAccessed: '2024-12-20T10:20:00' },
  { menuName: '관리자', path: '/admin', clickCount: 530, lastAccessed: '2024-12-20T10:30:00' },
];

const activityLogs = [
  { id: '1', action: '키워드 검색', ip: '192.168.1.45', timestamp: '2024-12-20T10:30:00', details: '키워드: 불법주차' },
  { id: '2', action: '데이터 다운로드', ip: '10.0.0.128', timestamp: '2024-12-20T10:28:00', details: 'Excel 형식, 지역별 데이터' },
  { id: '3', action: '지도 조회', ip: '192.168.1.45', timestamp: '2024-12-20T10:25:00', details: '강남구 선택' },
  { id: '4', action: '페이지 접속', ip: '172.16.0.55', timestamp: '2024-12-20T10:20:00', details: '메인 대시보드' },
  { id: '5', action: '키워드 검색', ip: '192.168.2.101', timestamp: '2024-12-20T10:15:00', details: '키워드: 도로파손' },
  { id: '6', action: '기간 설정', ip: '10.0.0.128', timestamp: '2024-12-20T10:10:00', details: '2024-01-01 ~ 2024-12-31' },
  { id: '7', action: '데이터 다운로드', ip: '192.168.1.200', timestamp: '2024-12-20T10:05:00', details: 'CSV 형식, 키워드 데이터' },
  { id: '8', action: '지도 조회', ip: '172.16.0.55', timestamp: '2024-12-20T10:00:00', details: '송파구 선택' },
];

const dailyVisitors = [
  { date: '2024-12-01', totalCount: 245 },
  { date: '2024-12-02', totalCount: 312 },
  { date: '2024-12-03', totalCount: 289 },
  { date: '2024-12-04', totalCount: 367 },
  { date: '2024-12-05', totalCount: 421 },
  { date: '2024-12-06', totalCount: 356 },
  { date: '2024-12-07', totalCount: 198 },
  { date: '2024-12-08', totalCount: 176 },
  { date: '2024-12-09', totalCount: 434 },
  { date: '2024-12-10', totalCount: 478 },
  { date: '2024-12-11', totalCount: 445 },
  { date: '2024-12-12', totalCount: 467 },
  { date: '2024-12-13', totalCount: 334 },
  { date: '2024-12-14', totalCount: 212 },
  { date: '2024-12-15', totalCount: 185 },
  { date: '2024-12-16', totalCount: 523 },
  { date: '2024-12-17', totalCount: 589 },
  { date: '2024-12-18', totalCount: 456 },
  { date: '2024-12-19', totalCount: 467 },
  { date: '2024-12-20', totalCount: 334 },
];

export default function AdminPage() {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      '키워드 검색': 'bg-blue-100 text-blue-800',
      '데이터 다운로드': 'bg-green-100 text-green-800',
      '지도 조회': 'bg-purple-100 text-purple-800',
      '페이지 접속': 'bg-gray-100 text-gray-800',
      '기간 설정': 'bg-orange-100 text-orange-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* 페이지 제목 */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <p className="text-muted-foreground">
          시스템 이용 현황 및 활동 로그를 확인합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 키워드 조회수</p>
                <p className="text-2xl font-bold">{usageStats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">오늘 방문자</p>
                <p className="text-2xl font-bold">{usageStats.uniqueUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">다운로드 수</p>
                <p className="text-2xl font-bold">{usageStats.totalDownloads.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 이용 통계 섹션 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">이용 통계</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 일별 방문자 차트 */}
          <DailyComplaintChart
            data={dailyVisitors}
            title="일별 방문자 수"
            height={300}
          />

          {/* 메뉴별 클릭 현황 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">메뉴별 이용 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>메뉴</TableHead>
                    <TableHead className="text-right">클릭 수</TableHead>
                    <TableHead>최근 접속</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuStats.map((menu) => (
                    <TableRow key={menu.path}>
                      <TableCell className="font-medium">{menu.menuName}</TableCell>
                      <TableCell className="text-right">
                        {menu.clickCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(menu.lastAccessed)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 활동 로그 섹션 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">활동 로그</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">최근 활동 로그</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>시간</TableHead>
                  <TableHead>활동</TableHead>
                  <TableHead>IP 주소</TableHead>
                  <TableHead>상세 내용</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
