'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DownloadButtons } from '@/components/common/DownloadButtons';
import {
  ArrowLeft,
  CalendarDays,
  Calendar,
  Clock,
  CalendarRange,
  Snowflake,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Import sample data
import keywordsData from '@/data/keywords.json';

// Top5 키워드와 색상 (연한 톤)
const TOP5_KEYWORDS = ['불법주차', '도로파손', '쓰레기투기', '소음민원', '가로등고장'];
const KEYWORD_COLORS: Record<string, string> = {
  '불법주차': '#5B97FF',
  '도로파손': '#FF6B6B',
  '쓰레기투기': '#6FCF97',
  '소음민원': '#FFA94D',
  '가로등고장': '#A78BFA',
};

function Top5StatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);

  // URL에서 기간 정보
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  useEffect(() => {
    if (!fromParam || !toParam) {
      router.replace('/complaint/period');
    }
  }, [fromParam, toParam, router]);

  const dateRange = useMemo(() => {
    if (!fromParam || !toParam) return null;
    return {
      from: parseISO(fromParam),
      to: parseISO(toParam),
    };
  }, [fromParam, toParam]);

  // 데이터 변환
  const monthlyData = useMemo(() => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    return months.map((month, idx) => {
      const dataPoint: Record<string, string | number> = { month };
      TOP5_KEYWORDS.forEach((keyword) => {
        const stats = keywordsData.keywordMonthlyStats[keyword as keyof typeof keywordsData.keywordMonthlyStats];
        if (stats) dataPoint[keyword] = stats[idx].count;
      });
      return dataPoint;
    });
  }, []);

  const hourlyData = useMemo(() => {
    return Array.from({ length: 24 }, (_, hour) => {
      const dataPoint: Record<string, string | number> = { hour: `${hour}시` };
      TOP5_KEYWORDS.forEach((keyword) => {
        const stats = keywordsData.keywordHourlyStats[keyword as keyof typeof keywordsData.keywordHourlyStats];
        if (stats) dataPoint[keyword] = stats[hour].count;
      });
      return dataPoint;
    });
  }, []);

  const weekdayData = useMemo(() => {
    const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
    return weekdays.map((weekday, idx) => {
      const dataPoint: Record<string, string | number> = { weekday };
      TOP5_KEYWORDS.forEach((keyword) => {
        const stats = keywordsData.keywordWeekdayStats[keyword as keyof typeof keywordsData.keywordWeekdayStats];
        if (stats) dataPoint[keyword] = stats[idx].count;
      });
      return dataPoint;
    });
  }, []);

  const seasonData = useMemo(() => {
    const seasons = ['봄', '여름', '가을', '겨울'];
    return seasons.map((season, idx) => {
      const dataPoint: Record<string, string | number> = { season };
      TOP5_KEYWORDS.forEach((keyword) => {
        const stats = keywordsData.keywordSeasonStats[keyword as keyof typeof keywordsData.keywordSeasonStats];
        if (stats) dataPoint[keyword] = stats[idx].count;
      });
      return dataPoint;
    });
  }, []);

  // 키워드별 총합 계산 (레이더 차트용)
  const keywordTotals = useMemo(() => {
    return TOP5_KEYWORDS.map((keyword) => {
      const monthlyStats = keywordsData.keywordMonthlyStats[keyword as keyof typeof keywordsData.keywordMonthlyStats];
      const total = monthlyStats?.reduce((sum, m) => sum + m.count, 0) || 0;
      return {
        keyword,
        total,
        color: KEYWORD_COLORS[keyword],
      };
    }).sort((a, b) => b.total - a.total);
  }, []);

  // 다운로드 데이터
  const getDownloadData = (): Record<string, Record<string, unknown>[]> => ({
    월별: monthlyData,
    시간대별: hourlyData,
    요일별: weekdayData,
    계절별: seasonData,
  });

  if (!dateRange) return null;

  const dateRangeText = `${format(dateRange.from, 'yyyy년 M월 d일', { locale: ko })} ~ ${format(dateRange.to, 'yyyy년 M월 d일', { locale: ko })}`;

  // 커스텀 범례 컴포넌트
  const KeywordLegend = () => (
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      {TOP5_KEYWORDS.map((keyword) => (
        <div key={keyword} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: KEYWORD_COLORS[keyword] }}
          />
          <span className="text-sm font-medium">{keyword}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/complaint/period')}
              className="gap-1 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Top5 키워드 통계</h1>
          <p className="text-muted-foreground">
            선택한 기간 동안 가장 많이 발생한 Top5 키워드를 비교 분석합니다.
          </p>
        </div>
        <DownloadButtons
          data={getDownloadData()}
          filename={`top5-stats-${fromParam}-${toParam}`}
          chartRef={chartRef}
        />
      </div>

      {/* 선택된 기간 */}
      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
        <CalendarDays className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          분석 기간: {dateRangeText}
        </span>
        <Button
          variant="link"
          size="sm"
          className="text-green-600 h-auto p-0 ml-auto"
          onClick={() => router.push('/complaint/period')}
        >
          기간 변경
        </Button>
      </div>

      {/* Top5 키워드 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {keywordTotals.map((item, idx) => (
          <Card key={item.keyword} className="overflow-hidden">
            <div
              className="h-1"
              style={{ backgroundColor: item.color }}
            />
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className="text-white text-xs"
                  style={{ backgroundColor: item.color }}
                >
                  {idx + 1}위
                </Badge>
              </div>
              <div className="font-semibold text-sm mb-1">{item.keyword}</div>
              <div className="text-lg font-bold" style={{ color: item.color }}>
                {item.total.toLocaleString()}건
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 차트 그리드 */}
      <div ref={chartRef} className="space-y-6">
        {/* 월별 추세 - 그룹드 바 차트 */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  월별 추세 비교
                </CardTitle>
                <CardDescription>
                  Top5 키워드의 월별 민원 발생량 비교
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <KeywordLegend />
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v.toLocaleString()} />
                <Tooltip
                  formatter={(value: number, name: string) => [value.toLocaleString() + '건', name]}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                {TOP5_KEYWORDS.map((keyword) => (
                  <Bar
                    key={keyword}
                    dataKey={keyword}
                    fill={KEYWORD_COLORS[keyword]}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 시간대별 분포 - 스택드 에어리어 차트 */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  시간대별 분포
                </CardTitle>
                <CardDescription>
                  24시간 기준 키워드별 민원 접수 패턴
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <KeywordLegend />
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={hourlyData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v.toLocaleString()} />
                <Tooltip
                  formatter={(value: number, name: string) => [value.toLocaleString() + '건', name]}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                {TOP5_KEYWORDS.map((keyword) => (
                  <Area
                    key={keyword}
                    type="monotone"
                    dataKey={keyword}
                    stackId="1"
                    stroke={KEYWORD_COLORS[keyword]}
                    fill={KEYWORD_COLORS[keyword]}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 하단 2열 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 요일별 패턴 - 레이더 차트 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-orange-600" />
                요일별 패턴
              </CardTitle>
              <CardDescription>
                요일별 키워드 분포 비교
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeywordLegend />
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={weekdayData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="weekday" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  {TOP5_KEYWORDS.map((keyword) => (
                    <Radar
                      key={keyword}
                      name={keyword}
                      dataKey={keyword}
                      stroke={KEYWORD_COLORS[keyword]}
                      fill={KEYWORD_COLORS[keyword]}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip
                    formatter={(value: number, name: string) => [value.toLocaleString() + '건', name]}
                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 계절별 패턴 - 도넛 차트들 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-purple-600" />
                계절별 분포
              </CardTitle>
              <CardDescription>
                계절별 키워드 구성 비율
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {['봄', '여름', '가을', '겨울'].map((season) => {
                  const seasonIdx = ['봄', '여름', '가을', '겨울'].indexOf(season);
                  const pieData = TOP5_KEYWORDS.map((keyword) => {
                    const stats = keywordsData.keywordSeasonStats[keyword as keyof typeof keywordsData.keywordSeasonStats];
                    return {
                      name: keyword,
                      value: stats?.[seasonIdx]?.count || 0,
                      color: KEYWORD_COLORS[keyword],
                    };
                  });
                  const total = pieData.reduce((sum, d) => sum + d.value, 0);

                  return (
                    <div key={season} className="text-center">
                      <div className="text-sm font-medium mb-2">{season}</div>
                      <ResponsiveContainer width="100%" height={120}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              `${value.toLocaleString()}건 (${((value / total) * 100).toFixed(1)}%)`,
                              name
                            ]}
                            contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="text-xs text-muted-foreground">
                        총 {total.toLocaleString()}건
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 키워드별 상세 비교표 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              키워드별 상세 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">키워드</th>
                    <th className="text-right py-3 px-4 font-medium">총 건수</th>
                    <th className="text-right py-3 px-4 font-medium">피크 월</th>
                    <th className="text-right py-3 px-4 font-medium">피크 시간</th>
                    <th className="text-right py-3 px-4 font-medium">피크 요일</th>
                    <th className="text-right py-3 px-4 font-medium">피크 계절</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordTotals.map((item) => {
                    const monthlyStats = keywordsData.keywordMonthlyStats[item.keyword as keyof typeof keywordsData.keywordMonthlyStats];
                    const hourlyStats = keywordsData.keywordHourlyStats[item.keyword as keyof typeof keywordsData.keywordHourlyStats];
                    const weekdayStats = keywordsData.keywordWeekdayStats[item.keyword as keyof typeof keywordsData.keywordWeekdayStats];
                    const seasonStats = keywordsData.keywordSeasonStats[item.keyword as keyof typeof keywordsData.keywordSeasonStats];

                    const peakMonth = monthlyStats?.reduce((max, m) => m.count > max.count ? m : max);
                    const peakHour = hourlyStats?.reduce((max, h) => h.count > max.count ? h : max);
                    const peakWeekday = weekdayStats?.reduce((max, w) => w.count > max.count ? w : max);
                    const peakSeason = seasonStats?.reduce((max, s) => s.count > max.count ? s : max);

                    return (
                      <tr key={item.keyword} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium">{item.keyword}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-semibold" style={{ color: item.color }}>
                          {item.total.toLocaleString()}건
                        </td>
                        <td className="text-right py-3 px-4">{peakMonth?.month}</td>
                        <td className="text-right py-3 px-4">{peakHour?.hour}시</td>
                        <td className="text-right py-3 px-4">{peakWeekday?.weekday}요일</td>
                        <td className="text-right py-3 px-4">{peakSeason?.season}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Top5StatsLoading() {
  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

export default function Top5StatsPage() {
  return (
    <Suspense fallback={<Top5StatsLoading />}>
      <Top5StatsContent />
    </Suspense>
  );
}
