'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Clock, Database, Building2 } from 'lucide-react';
import {
  DailyComplaintChart,
  DistrictPieChart,
  WordCloud,
  TopComplaintsTable,
} from '@/components/charts';

// Import sample data
import districtsData from '@/data/districts.json';
import complaintsData from '@/data/complaints.json';
import keywordsData from '@/data/keywords.json';

export default function HomePage() {
  const router = useRouter();

  // Process data for charts
  const districtChartData = districtsData.districts
    .map((d) => ({
      name: d.name,
      value: d.totalComplaints,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const handleWordClick = (word: string) => {
    router.push(`/call-issue?q=${encodeURIComponent(word)}`);
  };

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

  const dataStatus = districtsData.dataStatus;

  const stats = [
    {
      icon: Calendar,
      label: '수집 기간',
      value: `${formatDate(dataStatus.collectionPeriod.start)} 부터`,
    },
    {
      icon: Clock,
      label: '최종 업데이트',
      value: formatDateTime(dataStatus.lastUpdated),
    },
    {
      icon: Database,
      label: '전체 데이터',
      value: `${dataStatus.totalRecords.toLocaleString()}건`,
    },
    {
      icon: Building2,
      label: '월 데이터',
      value: `${dataStatus.monthlyRecords.toLocaleString()}건`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0033A0] to-[#0033A0]/80 text-white">
        <div className="container px-4 py-12 md:py-16">
          <div className="space-y-8">
            {/* 제목 및 설명 */}
            <div className="space-y-3">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">
              Hello, 다산!

              </h1>

            </div>

            {/* 데이터 현황 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3"
                >
                  <div className="p-2 rounded-lg bg-white/20">
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">{stat.label}</p>
                    <p className="text-sm font-medium">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 콘텐츠 영역 */}
      <div className="container px-4 pb-6 space-y-6">
        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 일별 민원 건수 */}
          <DailyComplaintChart data={complaintsData.dailyStats} />

          {/* 기관별 현황 Top10 */}
          <DistrictPieChart data={districtChartData} />
        </div>

        {/* 하단 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 오늘의 이슈 워드클라우드 */}
          <WordCloud
            words={keywordsData.todayIssues}
            title="오늘의 이슈 키워드"
            timestamp={keywordsData.todayIssuesTimestamp}
            onWordClick={handleWordClick}
          />

          {/* 오늘의 민원 Top10 테이블 */}
          <TopComplaintsTable
            data={complaintsData.todayTopComplaints}
            timestamp={complaintsData.todayTopComplaintsTimestamp}
          />
        </div>
      </div>
    </div>
  );
}
