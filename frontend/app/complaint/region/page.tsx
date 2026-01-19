'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/layout/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, eachMonthOfInterval, eachWeekOfInterval, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { DateRange, ComplaintCategory, GeoJSONCollection, HangJeongDongCollection } from '@/types';

// Import sample data
import districtsData from '@/data/districts.json';
import seoulGeoData from '@/data/seoul-geojson.json';
import hangJeongDongGeoData from '@/data/seoul-HangJeongDong-geojson.json';

// Cast the GeoJSON data to the proper type
const typedGeoData = seoulGeoData as unknown as GeoJSONCollection;
const typedHangJeongDongData = hangJeongDongGeoData as unknown as HangJeongDongCollection;

// 차트 색상 (Top 5용)
const CHART_COLORS = [
  '#0033A0', // 1위 - 진한 파랑
  '#2563eb', // 2위 - 파랑
  '#059669', // 3위 - 초록
  '#d97706', // 4위 - 주황
  '#dc2626', // 5위 - 빨강
];

// 추세선 데이터 생성 함수
const generateTrendData = (
  categories: { category: string; count: number }[],
  dateRange: DateRange,
  seed: number
) => {
  const top5 = categories.slice(0, 5);
  const { from, to } = dateRange;

  if (!from || !to) return [];

  // 기간에 따라 간격 결정
  const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

  let intervals: Date[];
  let formatStr: string;

  if (diffDays <= 31) {
    // 1개월 이하: 일별
    intervals = eachDayOfInterval({ start: from, end: to });
    formatStr = 'M/d';
  } else if (diffDays <= 90) {
    // 3개월 이하: 주별
    intervals = eachWeekOfInterval({ start: from, end: to });
    formatStr = 'M/d';
  } else {
    // 그 이상: 월별
    intervals = eachMonthOfInterval({ start: from, end: to });
    formatStr = 'yy.M월';
  }

  // 시드 기반 일관된 랜덤 생성
  const seededRandom = (s: number, idx: number) => {
    const x = Math.sin(s + idx * 1000) * 10000;
    return x - Math.floor(x);
  };

  return intervals.map((date, idx) => {
    const dataPoint: Record<string, string | number> = {
      date: format(date, formatStr, { locale: ko }),
    };

    top5.forEach((cat, catIdx) => {
      // 기본값에 변동폭 추가 (±30%)
      const baseValue = cat.count / intervals.length;
      const variation = 0.7 + seededRandom(seed + catIdx, idx) * 0.6;
      dataPoint[cat.category] = Math.round(baseValue * variation);
    });

    return dataPoint;
  });
};

// 행정동별 샘플 민원 데이터 생성 (실제 데이터 연동 전 테스트용)
const generateDongComplaints = (dongName: string, districtTotal: number) => {
  // 동 이름을 기반으로 일관된 랜덤 시드 생성
  const seed = dongName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const categories: ComplaintCategory[] = [
    '교통·주차', '도로·시설물', '환경·청소', '건축·주택', '복지·보건',
    '세무·요금', '안전·재난', '문화·관광', '교육·청소년', '민원행정', '기타'
  ];

  // 구 전체 대비 비율로 동의 민원 총량 계산 (5~15%)
  const dongRatio = (random(5, 15) / 100);
  const dongTotal = Math.floor(districtTotal * dongRatio);

  const complaints: Record<string, number> = {};
  let remaining = dongTotal;

  categories.forEach((cat, idx) => {
    if (idx === categories.length - 1) {
      complaints[cat] = remaining;
    } else {
      const ratio = random(5, 20) / 100;
      const count = Math.floor(dongTotal * ratio);
      complaints[cat] = count;
      remaining -= count;
    }
  });

  return {
    total: dongTotal,
    complaints
  };
};

// Dynamic import for the map to avoid SSR issues
const SeoulMapSimple = dynamic(
  () => import('@/components/maps/SeoulMapSimple').then((mod) => mod.SeoulMapSimple),
  {
    loading: () => (
      <div className="h-[500px] w-full rounded-lg bg-muted flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function RegionPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedDong, setSelectedDong] = useState<string | null>(null);
  const [selectedDongCode, setSelectedDongCode] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });

  // Get selected district data
  const selectedDistrictData = useMemo(() => {
    if (!selectedDistrict) return null;
    return districtsData.districts.find((d) => d.code === selectedDistrict);
  }, [selectedDistrict]);

  // 행정동 선택 핸들러 (지도에서 호출됨)
  const handleDongSelect = useCallback((dongName: string, dongCode?: string) => {
    if (!dongName || dongName === '') {
      setSelectedDong(null);
      setSelectedDongCode(null);
    } else {
      setSelectedDong(dongName);
      setSelectedDongCode(dongCode || null);
    }
  }, []);

  // 자치구 선택 시 행정동 선택 초기화
  const handleDistrictSelect = useCallback((code: string) => {
    setSelectedDistrict(code);
    setSelectedDong(null);
    setSelectedDongCode(null);
  }, []);

  // 선택된 행정동 데이터 생성
  const selectedDongData = useMemo(() => {
    if (!selectedDong || !selectedDistrictData) return null;
    return generateDongComplaints(selectedDong, selectedDistrictData.totalComplaints);
  }, [selectedDong, selectedDistrictData]);

  // 선택된 행정동의 카테고리 데이터
  const dongCategoryData = useMemo(() => {
    if (!selectedDongData) return [];
    return Object.entries(selectedDongData.complaints)
      .map(([category, count]) => ({
        category: category as ComplaintCategory,
        count: count as number,
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedDongData]);

  // Format districts for sidebar
  const sidebarDistricts = districtsData.districts.map((d) => ({
    code: d.code,
    name: d.name,
    totalComplaints: d.totalComplaints,
  }));

  // Get category data for selected district
  const categoryData = useMemo(() => {
    if (!selectedDistrictData) return [];
    return Object.entries(selectedDistrictData.complaints)
      .map(([category, count]) => ({
        category: category as ComplaintCategory,
        count: count as number,
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedDistrictData]);

  // 자치구 Top5 추세 데이터
  const districtTrendData = useMemo(() => {
    if (!categoryData.length) return [];
    const seed = selectedDistrict ? parseInt(selectedDistrict, 10) : 0;
    return generateTrendData(categoryData, dateRange, seed);
  }, [categoryData, dateRange, selectedDistrict]);

  // 행정동 Top5 추세 데이터
  const dongTrendData = useMemo(() => {
    if (!dongCategoryData.length || !selectedDong) return [];
    const seed = selectedDong.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return generateTrendData(dongCategoryData, dateRange, seed);
  }, [dongCategoryData, dateRange, selectedDong]);

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
    <div className="container px-4 py-6">
      {/* 페이지 제목 */}
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold">지역별 민원 현황</h1>
        <p className="text-muted-foreground">
          서울시 25개 자치구별 민원 현황을 지도에서 확인합니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 사이드바 */}
        <Sidebar
          districts={sidebarDistricts}
          selectedDistrict={selectedDistrict}
          hoveredDistrict={hoveredDistrict ?? undefined}
          onDistrictSelect={handleDistrictSelect}
          onDistrictHover={setHoveredDistrict}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          showDatePicker={true}
          showDistrictList={true}
        />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 space-y-6">
          {/* 지도 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                서울시 민원 지도
                {selectedDistrictData && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedDistrictData.name} 선택됨
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SeoulMapSimple
                geoData={typedGeoData}
                districts={districtsData.districts}
                hangJeongDongData={typedHangJeongDongData}
                selectedDistrict={selectedDistrict}
                hoveredDistrict={hoveredDistrict ?? undefined}
                onDistrictClick={handleDistrictSelect}
                onDistrictHover={setHoveredDistrict}
                onHangJeongDongSelect={handleDongSelect}
              />
            </CardContent>
          </Card>

          {/* 선택된 행정동 상세 정보 (행정동 선택 시) */}
          {selectedDistrictData && selectedDong && selectedDongData && (
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <span className="text-orange-600">{selectedDong}</span>
                    <span className="text-muted-foreground font-normal">행정동 민원 현황</span>
                    <span className="text-2xl font-bold text-orange-600 ml-2">
                      {selectedDongData.total.toLocaleString()}건
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      구 대비 {((selectedDongData.total / selectedDistrictData.totalComplaints) * 100).toFixed(1)}%
                    </span>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      {selectedDistrictData.name}
                    </Badge>
                    <button
                      onClick={() => {
                        setSelectedDong(null);
                        setSelectedDongCode(null);
                      }}
                      className="text-xs text-orange-600 hover:text-orange-800 underline"
                    >
                      구 전체 보기
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 왼쪽: Top 5 민원 표 */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Top 5 민원 분류</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px] text-center">순위</TableHead>
                          <TableHead>분류</TableHead>
                          <TableHead className="text-right w-[100px]">건수</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dongCategoryData.slice(0, 5).map(({ category, count }, index) => (
                          <TableRow key={category}>
                            <TableCell className="text-center font-bold">
                              <span
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs"
                                style={{ backgroundColor: CHART_COLORS[index] }}
                              >
                                {index + 1}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getCategoryColor(category)}>
                                {category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {count.toLocaleString()}건
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 오른쪽: 기간별 추세 그래프 */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Top 5 민원 추세 (누적)</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dongTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e5e5' }}
                          />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e5e5' }}
                            width={50}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e5e5',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                            formatter={(value: number, name: string) => [
                              `${value.toLocaleString()}건`,
                              name,
                            ]}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                            iconType="rect"
                            iconSize={10}
                          />
                          {dongCategoryData.slice(0, 5).reverse().map(({ category }, index) => {
                            const colorIndex = 4 - index;
                            return (
                              <Area
                                key={category}
                                type="monotone"
                                dataKey={category}
                                stackId="1"
                                stroke={CHART_COLORS[colorIndex]}
                                fill={CHART_COLORS[colorIndex]}
                                fillOpacity={0.7}
                              />
                            );
                          })}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 선택된 자치구 상세 정보 (행정동 미선택 시) */}
          {selectedDistrictData && !selectedDong && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <span className="text-[#0033A0]">{selectedDistrictData.name}</span>
                    <span className="text-muted-foreground font-normal">민원 현황</span>
                    <span className="text-2xl font-bold text-[#0033A0] ml-2">
                      {selectedDistrictData.totalComplaints.toLocaleString()}건
                    </span>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    지도에서 행정동을 선택하면 상세 현황을 볼 수 있습니다
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 왼쪽: Top 5 민원 표 */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Top 5 민원 분류</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px] text-center">순위</TableHead>
                          <TableHead>분류</TableHead>
                          <TableHead className="text-right w-[100px]">건수</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.slice(0, 5).map(({ category, count }, index) => (
                          <TableRow key={category}>
                            <TableCell className="text-center font-bold">
                              <span
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs"
                                style={{ backgroundColor: CHART_COLORS[index] }}
                              >
                                {index + 1}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getCategoryColor(category)}>
                                {category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {count.toLocaleString()}건
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 오른쪽: 기간별 추세 그래프 */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Top 5 민원 추세 (누적)</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={districtTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e5e5' }}
                          />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e5e5' }}
                            width={50}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e5e5',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                            formatter={(value: number, name: string) => [
                              `${value.toLocaleString()}건`,
                              name,
                            ]}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                            iconType="rect"
                            iconSize={10}
                          />
                          {categoryData.slice(0, 5).reverse().map(({ category }, index) => {
                            const colorIndex = 4 - index;
                            return (
                              <Area
                                key={category}
                                type="monotone"
                                dataKey={category}
                                stackId="1"
                                stroke={CHART_COLORS[colorIndex]}
                                fill={CHART_COLORS[colorIndex]}
                                fillOpacity={0.7}
                              />
                            );
                          })}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 전체 현황 (자치구 미선택 시) */}
          {!selectedDistrictData && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  서울시 전체 민원 요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">총 자치구</p>
                    <p className="text-2xl font-bold">25개</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">총 민원</p>
                    <p className="text-2xl font-bold">
                      {districtsData.districts
                        .reduce((sum, d) => sum + d.totalComplaints, 0)
                        .toLocaleString()}건
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">최다 민원구</p>
                    <p className="text-2xl font-bold">
                      {
                        districtsData.districts.reduce((max, d) =>
                          d.totalComplaints > max.totalComplaints ? d : max
                        ).name
                      }
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">평균 민원</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        districtsData.districts.reduce(
                          (sum, d) => sum + d.totalComplaints,
                          0
                        ) / 25
                      ).toLocaleString()}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
