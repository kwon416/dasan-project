'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CalendarIcon,
  Search,
  TrendingUp,
  ArrowRight,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PeriodPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // 기간 선택 완료 여부
  const isDateSelected = dateRange.from && dateRange.to;

  // 빠른 기간 선택
  const handleQuickSelect = (type: 'week' | 'month' | '3months' | 'year') => {
    const today = new Date();
    const from = new Date(today);

    switch (type) {
      case 'week':
        from.setDate(today.getDate() - 7);
        break;
      case 'month':
        from.setMonth(today.getMonth() - 1);
        break;
      case '3months':
        from.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        from.setFullYear(today.getFullYear() - 1);
        break;
    }

    setDateRange({ from, to: today });
  };

  // 하위 페이지로 이동
  const navigateTo = (path: string) => {
    if (!dateRange.from || !dateRange.to) return;

    const params = new URLSearchParams({
      from: format(dateRange.from, 'yyyy-MM-dd'),
      to: format(dateRange.to, 'yyyy-MM-dd'),
    });

    router.push(`/complaint/period/${path}?${params.toString()}`);
  };

  // 선택된 기간 표시 텍스트
  const getDateRangeText = () => {
    if (!dateRange.from || !dateRange.to) return null;

    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${format(dateRange.from, 'yyyy년 M월 d일', { locale: ko })} ~ ${format(dateRange.to, 'yyyy년 M월 d일', { locale: ko })} (${diffDays + 1}일)`;
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* 페이지 제목 */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">기간별 민원 분석</h1>
        <p className="text-muted-foreground">
          분석할 기간을 선택한 후 원하는 분석 유형을 선택하세요.
        </p>
      </div>

      {/* 기간 선택 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            분석 기간 선택
          </CardTitle>
          <CardDescription>
            민원 데이터를 분석할 기간을 선택해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 빠른 선택 버튼 */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center mr-2">빠른 선택:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect('week')}
            >
              최근 1주일
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect('month')}
            >
              최근 1개월
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect('3months')}
            >
              최근 3개월
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect('year')}
            >
              최근 1년
            </Button>
          </div>

          {/* 달력 선택 */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 시작일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[180px] justify-start text-left font-normal',
                    !dateRange.from && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from
                    ? format(dateRange.from, 'yyyy년 M월 d일', { locale: ko })
                    : '시작일 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                  disabled={(date) => dateRange.to ? date > dateRange.to : false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-muted-foreground">~</span>

            {/* 종료일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[180px] justify-start text-left font-normal',
                    !dateRange.to && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to
                    ? format(dateRange.to, 'yyyy년 M월 d일', { locale: ko })
                    : '종료일 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                  disabled={(date) => dateRange.from ? date < dateRange.from : false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 선택된 기간 표시 */}
          {isDateSelected && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                선택된 기간: {getDateRangeText()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 분석 유형 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 키워드 검색 카드 */}
        <Card
          className={cn(
            'transition-all',
            isDateSelected
              ? 'hover:border-blue-300 hover:shadow-md cursor-pointer'
              : 'opacity-60'
          )}
          onClick={() => isDateSelected && navigateTo('keyword')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-3 rounded-lg',
                isDateSelected ? 'bg-blue-100' : 'bg-gray-100'
              )}>
                <Search className={cn(
                  'w-6 h-6',
                  isDateSelected ? 'text-blue-600' : 'text-gray-400'
                )} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">키워드 검색</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  특정 키워드를 검색하여 선택한 기간 동안의 민원 발생 추이를 분석합니다.
                </p>
                <Button
                  disabled={!isDateSelected}
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('keyword');
                  }}
                >
                  키워드 검색하기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top5 통계 카드 */}
        <Card
          className={cn(
            'transition-all',
            isDateSelected
              ? 'hover:border-green-300 hover:shadow-md cursor-pointer'
              : 'opacity-60'
          )}
          onClick={() => isDateSelected && navigateTo('top5')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-3 rounded-lg',
                isDateSelected ? 'bg-green-100' : 'bg-gray-100'
              )}>
                <TrendingUp className={cn(
                  'w-6 h-6',
                  isDateSelected ? 'text-green-600' : 'text-gray-400'
                )} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Top5 키워드 통계</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  선택한 기간 동안 가장 많이 발생한 Top5 키워드의 통계를 비교 분석합니다.
                </p>
                <Button
                  disabled={!isDateSelected}
                  variant="outline"
                  className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('top5');
                  }}
                >
                  Top5 통계 보기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 안내 메시지 */}
      {!isDateSelected && (
        <div className="text-center py-8 text-muted-foreground">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">분석할 기간을 먼저 선택해주세요.</p>
        </div>
      )}
    </div>
  );
}
