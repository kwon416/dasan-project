'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  CalendarIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DailyComplaintChart } from '@/components/charts';
import { DownloadButtons } from '@/components/common/DownloadButtons';
import { useDebounce } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Import sample data
import keywordsData from '@/data/keywords.json';
import complaintsData from '@/data/complaints.json';

interface Keyword {
  id: string;
  text: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  relatedKeywords: string[];
}

function CallIssueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [expandedKeywordId, setExpandedKeywordId] = useState<string | null>(null);
  const [periodType, setPeriodType] = useState<'today' | 'week'>('today');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(),
  });

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Filter keywords based on search
  const filteredKeywords = (keywordsData.topKeywords as Keyword[]).filter((keyword) =>
    keyword.text.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Get currently expanded keyword
  const expandedKeyword = useMemo(() => {
    if (!expandedKeywordId) return null;
    return filteredKeywords.find((k) => k.id === expandedKeywordId) || null;
  }, [expandedKeywordId, filteredKeywords]);

  // Update URL when search changes
  useEffect(() => {
    if (debouncedQuery) {
      router.replace(`/call-issue?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false });
    } else {
      router.replace('/call-issue', { scroll: false });
    }
  }, [debouncedQuery, router]);

  const handleKeywordClick = (keyword: Keyword) => {
    if (expandedKeywordId === keyword.id) {
      setExpandedKeywordId(null);
    } else {
      setExpandedKeywordId(keyword.id);
    }
  };

  const handleQuickDateSelect = (type: 'today' | 'week') => {
    const today = new Date();
    setPeriodType(type);
    if (type === 'today') {
      setDateRange({ from: today, to: today });
    } else {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      setDateRange({ from: weekAgo, to: today });
    }
  };

  // 검색어 하이라이트 함수
  const highlightKeyword = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <strong key={index} className="text-primary font-bold">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  // Generate mock trend data for the expanded keyword
  const generateTrendData = useMemo(() => {
    if (!expandedKeyword) return [];
    const baseCount = expandedKeyword.count / 20;

    if (periodType === 'today') {
      // 오늘: 24시간 시간별 데이터 생성
      const now = new Date();
      const hourlyData = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now);
        hour.setHours(now.getHours() - i, 0, 0, 0);
        hourlyData.push({
          date: hour.toISOString(),
          totalCount: Math.floor((baseCount / 24) * (0.5 + Math.random() * 1.5)),
          displayLabel: `${hour.getHours()}시`,
        });
      }
      return hourlyData;
    } else {
      // 일주일: 7일간 요일별 데이터 생성
      const today = new Date();
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dayOfWeek = weekdays[day.getDay()];
        const monthDay = `${day.getMonth() + 1}/${day.getDate()}`;
        weeklyData.push({
          date: day.toISOString(),
          totalCount: Math.floor(baseCount * (0.6 + Math.random() * 0.8)),
          displayLabel: `${monthDay}(${dayOfWeek})`,
        });
      }
      return weeklyData;
    }
  }, [expandedKeyword, periodType]);

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* 페이지 제목 */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">콜 이슈</h1>
        <p className="text-muted-foreground">
          민원 키워드를 검색하고 추세를 분석합니다.
        </p>
      </div>

      {/* 검색바 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="키워드를 입력하세요 (예: 불법주차, 도로파손, 쓰레기...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 검색 결과 또는 전체 키워드 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {debouncedQuery
              ? `"${debouncedQuery}" 검색 결과 (${filteredKeywords.length}건)`
              : '인기 키워드 Top10'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredKeywords.length > 0 ? (
            <div className="divide-y">
              {filteredKeywords.map((keyword) => {
                const isExpanded = expandedKeywordId === keyword.id;
                return (
                  <div key={keyword.id}>
                    {/* 키워드 로우 */}
                    <div
                      className={cn(
                        'grid grid-cols-[1fr_auto_1fr_auto] gap-4 px-4 py-3 cursor-pointer hover:bg-muted/50 items-center',
                        isExpanded && 'bg-muted/30'
                      )}
                      onClick={() => handleKeywordClick(keyword)}
                    >
                      <div className="font-medium">{highlightKeyword(keyword.text, debouncedQuery)}</div>
                      <div className="text-right text-sm">
                        {keyword.count.toLocaleString()}건
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {keyword.relatedKeywords.slice(0, 3).map((related) => (
                          <Badge
                            key={related}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery(related);
                            }}
                          >
                            {related}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* 아코디언 확장 콘텐츠 */}
                    {isExpanded && expandedKeyword && (
                      <div className="border-t border-dashed bg-muted/10 p-4 space-y-4">
                        {/* 헤더: 키워드명 */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-[#0033A0]">
                            {expandedKeyword.text}
                          </h3>
                        </div>

                        {/* 차트 영역 */}
                        <Card>
                          <CardContent className="p-4 space-y-4">
                            {/* 컨트롤 바 */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="text-sm font-medium border px-3 py-1.5">
                                키워드 발생추이
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                {/* 기간 선택 */}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs gap-1"
                                    >
                                      <CalendarIcon className="h-3 w-3" />
                                      {dateRange.from
                                        ? format(dateRange.from, 'yyyy/MM/dd', { locale: ko })
                                        : '시작일'}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={dateRange.from}
                                      onSelect={(date) =>
                                        setDateRange((prev) => ({ ...prev, from: date }))
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>

                                <span className="text-muted-foreground">~</span>

                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs gap-1"
                                    >
                                      <CalendarIcon className="h-3 w-3" />
                                      {dateRange.to
                                        ? format(dateRange.to, 'yyyy/MM/dd', { locale: ko })
                                        : '종료일'}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={dateRange.to}
                                      onSelect={(date) =>
                                        setDateRange((prev) => ({ ...prev, to: date }))
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>

                                {/* 빠른 선택 버튼 */}
                                <div className="flex border rounded-md overflow-hidden">
                                  <Button
                                    variant={periodType === 'today' ? 'default' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                      'h-8 text-xs rounded-none border-r px-3',
                                      periodType === 'today' && 'bg-[#0033A0] hover:bg-[#0033A0]/90'
                                    )}
                                    onClick={() => handleQuickDateSelect('today')}
                                  >
                                    오늘
                                  </Button>
                                  <Button
                                    variant={periodType === 'week' ? 'default' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                      'h-8 text-xs rounded-none px-3',
                                      periodType === 'week' && 'bg-[#0033A0] hover:bg-[#0033A0]/90'
                                    )}
                                    onClick={() => handleQuickDateSelect('week')}
                                  >
                                    일주일
                                  </Button>
                                </div>

                                {/* 다운로드 버튼 */}
                                <DownloadButtons
                                  data={generateTrendData.map((d) => ({
                                    날짜: d.date,
                                    민원건수: d.totalCount,
                                  }))}
                                  filename={`keyword-${expandedKeyword.text}`}
                                  chartRef={chartRef}
                                />
                              </div>
                            </div>

                            {/* 차트 */}
                            <div ref={chartRef}>
                              <DailyComplaintChart
                                data={generateTrendData}
                                height={280}
                                showCard={false}
                                tooltipLabel={periodType === 'today' ? '시간' : '날짜'}
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* 연관 키워드 */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">연관 키워드:</span>
                          {expandedKeyword.relatedKeywords.map((related) => (
                            <Badge
                              key={related}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                              onClick={() => {
                                setExpandedKeywordId(null);
                                setSearchQuery(related);
                              }}
                            >
                              {related}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              검색 결과가 없습니다. 다른 키워드로 검색해 보세요.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CallIssueLoading() {
  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CallIssuePage() {
  return (
    <Suspense fallback={<CallIssueLoading />}>
      <CallIssueContent />
    </Suspense>
  );
}
