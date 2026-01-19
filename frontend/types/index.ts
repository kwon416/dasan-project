// 민원 관련 타입 정의

// 민원 카테고리
export type ComplaintCategory =
  | '교통·주차'
  | '도로·시설물'
  | '환경·청소'
  | '건축·주택'
  | '복지·보건'
  | '세무·요금'
  | '안전·재난'
  | '문화·관광'
  | '교육·청소년'
  | '민원행정'
  | '기타';

// 자치구 정보
export interface District {
  code: string;
  name: string;
  complaints: Record<ComplaintCategory, number>;
  totalComplaints: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// 민원 데이터
export interface Complaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  districtCode: string;
  districtName: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed';
  keywords: string[];
}

// 키워드 데이터
export interface Keyword {
  id: string;
  text: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  relatedKeywords: string[];
}

// 일별 민원 통계
export interface DailyStats {
  date: string;
  totalCount: number;
  byCategory: Record<ComplaintCategory, number>;
}

// 시간대별 통계
export interface HourlyStats {
  hour: number;
  count: number;
}

// 요일별 통계
export interface WeekdayStats {
  weekday: string;
  count: number;
}

// 월별 통계
export interface MonthlyStats {
  month: string;
  count: number;
}

// 데이터 현황
export interface DataStatus {
  collectionPeriod: {
    start: string;
    end: string;
  };
  lastUpdated: string;
  totalRecords: number;
  totalDistricts: number;
}

// 관리자 활동 로그
export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

// 메뉴 클릭 통계
export interface MenuStats {
  menuName: string;
  path: string;
  clickCount: number;
  lastAccessed: string;
}

// 검색 결과
export interface SearchResult {
  keyword: string;
  totalCount: number;
  complaints: Complaint[];
  dailyTrend: DailyStats[];
}

// GeoJSON 타입
export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    code: string;
    name: string;
    name_eng: string;
    base_year?: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// 행정동 GeoJSON 타입
export interface HangJeongDongFeature {
  type: 'Feature';
  properties: {
    adm_nm: string;      // 전체 이름 (예: "서울특별시 종로구 사직동")
    adm_cd: string;      // 행정동 코드
    adm_cd2: string;     // 행정동 코드2
    sgg: string;         // 시군구 코드
    sido: string;        // 시도 코드
    sidonm: string;      // 시도명
    sggnm: string;       // 시군구명 (구 이름)
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface HangJeongDongCollection {
  type: 'FeatureCollection';
  name?: string;
  crs?: {
    type: string;
    properties: { name: string };
  };
  features: HangJeongDongFeature[];
}

// 차트 데이터 타입
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// 기간 선택 타입
export interface DateRange {
  from: Date;
  to: Date;
}
