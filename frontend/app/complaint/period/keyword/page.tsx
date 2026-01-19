'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DailyComplaintChart } from '@/components/charts';
import { DownloadButtons } from '@/components/common/DownloadButtons';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';

// Import sample data
import keywordsData from '@/data/keywords.json';

interface Keyword {
  id: string;
  text: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  relatedKeywords: string[];
}

function KeywordSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);

  // URL에서 기간 정보 가져오기
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  // 기간 정보가 없으면 메인 페이지로 리다이렉트
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

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKeywordId, setExpandedKeywordId] = useState<string | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // 키워드 필터링
  const filteredKeywords = (keywordsData.topKeywords as Keyword[]).filter((keyword) =>
    keyword.text.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // 확장된 키워드
  const expandedKeyword = useMemo(() => {
    if (!expandedKeywordId) return null;
    return filteredKeywords.find((k) => k.id === expandedKeywordId) || null;
  }, [expandedKeywordId, filteredKeywords]);

  const handleKeywordClick = (keyword: Keyword) => {
    if (expandedKeywordId === keyword.id) {
      setExpandedKeywordId(null);
    } else {
      setExpandedKeywordId(keyword.id);
    }
  };

  // 검색어 하이라이트
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

  // 트렌드 아이콘
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  // 키워드별 일별 추이 데이터 생성
  const generateDailyTrendData = useMemo(() => {
    if (!expandedKeyword || !dateRange) return [];

    const { from, to } = dateRange;
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const baseCount = expandedKeyword.count / 30;

    const data = [];
    for (let i = 0; i < diffDays; i++) {
      const date = new Date(from);
      date.setDate(from.getDate() + i);
      data.push({
        date: date.toISOString(),
        totalCount: Math.floor(baseCount * (0.5 + Math.random())),
        displayLabel: format(date, 'M/d', { locale: ko }),
      });
    }
    return data;
  }, [expandedKeyword, dateRange]);

  if (!dateRange) {
    return null;
  }

  const dateRangeText = `${format(dateRange.from, 'yyyy년 M월 d일', { locale: ko })} ~ ${format(dateRange.to, 'yyyy년 M월 d일', { locale: ko })}`;

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
          <h1 className="text-2xl font-bold">키워드 검색</h1>
          <p className="text-muted-foreground">
            선택한 기간 동안의 키워드별 민원 발생 추이를 분석합니다.
          </p>
        </div>
      </div>

      {/* 선택된 기간 표시 */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <CalendarDays className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">
          분석 기간: {dateRangeText}
        </span>
        <Button
          variant="link"
          size="sm"
          className="text-blue-600 h-auto p-0 ml-auto"
          onClick={() => router.push('/complaint/period')}
        >
          기간 변경
        </Button>
      </div>

      {/* 검색바 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="키워드를 입력하세요 (예: 불법주차, 도로파손, 소음...)"
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

      {/* 검색 결과 */}
      <Card>
        <CardHeader className="pb-2">
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
                        'grid grid-cols-[auto_1fr_auto_1fr_auto] gap-4 px-4 py-3 cursor-pointer hover:bg-muted/50 items-center',
                        isExpanded && 'bg-muted/30'
                      )}
                      onClick={() => handleKeywordClick(keyword)}
                    >
                      {/* 트렌드 아이콘 */}
                      <div>{getTrendIcon(keyword.trend)}</div>

                      {/* 키워드명 */}
                      <div className="font-medium">
                        {highlightKeyword(keyword.text, debouncedQuery)}
                      </div>

                      {/* 건수 */}
                      <div className="text-right text-sm font-medium">
                        {keyword.count.toLocaleString()}건
                      </div>

                      {/* 연관 키워드 */}
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

                      {/* 확장 아이콘 */}
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* 확장 콘텐츠 */}
                    {isExpanded && expandedKeyword && (
                      <div className="border-t border-dashed bg-muted/10 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-[#0033A0]">
                            "{expandedKeyword.text}" 발생 추이
                          </h3>
                          <DownloadButtons
                            data={generateDailyTrendData.map((d) => ({
                              날짜: d.displayLabel,
                              민원건수: d.totalCount,
                            }))}
                            filename={`keyword-${expandedKeyword.text}-${fromParam}-${toParam}`}
                            chartRef={chartRef}
                          />
                        </div>

                        {/* 차트 */}
                        <div ref={chartRef}>
                          <DailyComplaintChart
                            data={generateDailyTrendData}
                            height={280}
                            showCard={false}
                            tooltipLabel="날짜"
                          />
                        </div>

                        {/* 통계 요약 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 bg-white rounded-lg border">
                            <div className="text-xs text-muted-foreground">총 민원 건수</div>
                            <div className="text-lg font-bold text-[#0033A0]">
                              {generateDailyTrendData.reduce((sum, d) => sum + d.totalCount, 0).toLocaleString()}건
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <div className="text-xs text-muted-foreground">일 평균</div>
                            <div className="text-lg font-bold">
                              {Math.round(generateDailyTrendData.reduce((sum, d) => sum + d.totalCount, 0) / generateDailyTrendData.length).toLocaleString()}건
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <div className="text-xs text-muted-foreground">최대</div>
                            <div className="text-lg font-bold text-red-600">
                              {Math.max(...generateDailyTrendData.map(d => d.totalCount)).toLocaleString()}건
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <div className="text-xs text-muted-foreground">최소</div>
                            <div className="text-lg font-bold text-blue-600">
                              {Math.min(...generateDailyTrendData.map(d => d.totalCount)).toLocaleString()}건
                            </div>
                          </div>
                        </div>

                        {/* 연관 키워드 */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
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
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>검색 결과가 없습니다.</p>
              <p className="text-sm mt-1">다른 키워드로 검색해 보세요.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KeywordSearchLoading() {
  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-12 w-full" />
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
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KeywordSearchPage() {
  return (
    <Suspense fallback={<KeywordSearchLoading />}>
      <KeywordSearchContent />
    </Suspense>
  );
}
