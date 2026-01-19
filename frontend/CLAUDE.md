# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

다산콜재단120 민원공개시스템 프론트엔드 프로토타입 - Next.js 기반 민원 데이터 시각화 및 분석 시스템

## 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 실행
npm run lint
```

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript (strict mode)
- **스타일링**: Tailwind CSS v4
- **React**: v19
- **UI 컴포넌트**: shadcn/ui (New York 스타일, Neutral 베이스 색상)
- **차트**: Recharts
- **지도**: Leaflet + react-leaflet
- **유틸리티**: date-fns, xlsx, file-saver, html2canvas, lucide-react

## 아키텍처

### 프로젝트 구조

```
frontend/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Header/Footer 포함)
│   ├── page.tsx                # 메인 대시보드 (/)
│   ├── globals.css             # 전역 스타일 (Tailwind + shadcn/ui)
│   ├── call-issue/page.tsx     # 콜 이슈 - 키워드 검색 및 추세 분석
│   ├── complaint/
│   │   ├── region/page.tsx     # 지역별 - 서울 지도 시각화
│   │   └── period/page.tsx     # 기간별 - 시계열 분석
│   └── admin/page.tsx          # 관리자 - 통계 및 로그
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트 (자동 생성)
│   ├── layout/                 # Header, Footer, Sidebar
│   ├── charts/                 # Recharts 기반 차트 컴포넌트
│   │   ├── DailyComplaintChart.tsx
│   │   ├── DistrictPieChart.tsx
│   │   ├── HourlyChart.tsx
│   │   ├── WeekdayChart.tsx
│   │   ├── MonthlyChart.tsx
│   │   ├── TopComplaintsTable.tsx
│   │   └── WordCloud.tsx
│   ├── maps/                   # Leaflet 지도 컴포넌트
│   │   └── SeoulMap.tsx
│   └── common/                 # 공통 컴포넌트
│       ├── DataStatusCard.tsx
│       └── DownloadButtons.tsx
├── data/                       # 샘플 JSON 데이터
│   ├── districts.json          # 서울시 25개 자치구
│   ├── complaints.json         # 민원 샘플 데이터
│   ├── keywords.json           # 키워드 및 이슈
│   └── seoul-geojson.json      # 서울시 경계 GeoJSON
├── hooks/                      # 커스텀 React 훅
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── lib/                        # 유틸리티 (utils.ts)
└── types/                      # TypeScript 타입 정의
    └── index.ts
```

### 경로 별칭
- `@/*` → 프로젝트 루트 기준 (tsconfig.json 설정)

## UI/UX 가이드

### shadcn/ui (현재 사용 중)
- **문서**: https://ui.shadcn.com
- **스타일**: New York
- **베이스 색상**: Neutral
- **CSS 변수**: 활성화

#### 설치된 컴포넌트 (`components/ui/`)
- **레이아웃**: card, dialog, tabs, skeleton
- **네비게이션**: navigation-menu, breadcrumb
- **입력**: button, input, select, calendar
- **표시**: table, badge, alert, tooltip
- **피드백**: sonner (토스트 알림)
- **차트**: chart (Recharts 래퍼)
- **기타**: dropdown-menu

#### 컴포넌트 추가 방법
```bash
npx shadcn@latest add [컴포넌트명]
```

### KRDS (정부 표준 디자인 시스템) - 참조용
- **스토리북**: https://krds.js.org/?path=/docs/introduction--docs
- **가이드 문서**: https://www.krds.go.kr

### 주요 컴포넌트 계층
1. 레이아웃: 헤더(Header), 푸터(Footer), 사이드바(Sidebar)
2. 네비게이션: NavigationMenu, Breadcrumb
3. 입력 컨트롤: Button, Input, Select, Calendar
4. 피드백: Dialog, Sonner(Toast), Skeleton

## 주요 기능별 라이브러리

### 지도 (민원 지도)
- **Leaflet** + Choropleth Map 사용
- 서울시 구/동별 경계 매핑
- 참조: https://leafletjs.com/examples/choropleth/

### 데이터 시각화
- 시계열 그래프, 바 차트: Recharts 권장
- 워드클라우드: react-wordcloud 권장
- 연관어 분석 네트워크: D3.js 권장

### 데이터 다운로드
- Excel: xlsx 라이브러리
- 그래프 이미지: html2canvas

### 검색
- Elasticsearch를 통한 유사도 검색

## 화면별 핵심 요구사항

### 메인 (/)
- 데이터 현황 대시보드 (수집 기간, 업데이트 시각, 데이터 크기)
- 일별 민원 건수 차트
- 기관별(구별) 현황 Top10 차트
- 오늘의 이슈 워드클라우드
- 오늘의 민원 Top10 테이블

### 콜 이슈 (/call-issue)
- 실시간 키워드 검색
- 검색 결과 리스트
- 키워드 상세 모달 (발생 추이 차트, 기간 선택, 다운로드)

### 지역별 (/complaint/region)
- Leaflet 기반 서울시 지도
- 구/동 단위 민원 건수 표시
- 좌측 패널: 기간 선택, 구 리스트

### 기간별 (/complaint/period)
- 키워드별 일간 발생량 시계열 그래프
- 계절/요일/시간대별 분석

## 데이터 형식

샘플 데이터는 JSON 형태로 서울시 구별 데이터 구성:

```json
{
  "districts": [
    {
      "code": "11680",
      "name": "강남구",
      "complaints": { "교통·주차": 1250, "도로·시설물": 890 },
      "coordinates": { "lat": 37.5172, "lng": 127.0473 }
    }
  ]
}
```

### 민원 분류 카테고리
교통·주차, 도로·시설물, 환경·청소, 건축·주택, 복지·보건, 세무·요금, 안전·재난, 문화·관광, 교육·청소년, 민원행정, 기타
