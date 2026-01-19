# CLAUDE.md - 기술 스택 및 개발 가이드

## 프로젝트 개요
다산콜재단120 민원공개시스템 프로토타입

## 기술 스택

### Frontend Framework
- **Next.js 14+** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안정성 확보

### UI 라이브러리
- **Material-UI (MUI) v5** - UI 컴포넌트 라이브러리
- **Lucide Icons** - 아이콘 세트
- **Emotion** - CSS-in-JS 스타일링

### 차트 및 시각화
- **Recharts** - 시계열 그래프, 바 차트
- **react-wordcloud** - 워드클라우드 시각화
- **D3.js** - 연관어 분석 네트워크 그래프

### 지도
- **Naver Maps API** - 민원 지도 표시
- **react-naver-maps** - React 래퍼 컴포넌트

### 데이터 처리
- **JSON** - 샘플 데이터 형식 (서울시 구별 민원 데이터)
- **date-fns** - 날짜 처리
- **file-saver** - 파일 다운로드 (CSV, Excel)
- **xlsx** - Excel 파일 생성
- **html2canvas** - 그래프 이미지 다운로드

### 상태 관리
- **React Context API** - 전역 상태 관리
- **React Query (TanStack Query)** - 서버 상태 관리

## 프로젝트 구조

```
dasan120/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 메인 화면 (대시보드)
│   │   ├── region/             # 지역별 화면
│   │   ├── period/             # 기간별 화면
│   │   └── admin/              # 관리자 화면
│   ├── components/
│   │   ├── common/             # 공통 컴포넌트
│   │   ├── charts/             # 차트 컴포넌트
│   │   ├── maps/               # 지도 컴포넌트
│   │   └── layout/             # 레이아웃 컴포넌트
│   ├── data/                   # 샘플 JSON 데이터
│   ├── hooks/                  # 커스텀 훅
│   ├── types/                  # TypeScript 타입 정의
│   ├── utils/                  # 유틸리티 함수
│   └── theme/                  # MUI 테마 설정
├── public/
│   └── logo/                   # 로고 이미지
├── CLAUDE.md                   # 기술 스택 문서
├── PRD.md                      # 요구사항 정의서
└── package.json
```

## 주요 화면 구성

### 1. 메인 화면 (/)
- 데이터 현황 대시보드
- 키워드 검색 기능
- 최신 다빈도 민원 표시

### 2. 지역별 화면 (/region)
- 네이버 지도 기반 민원 지도
- 자치구/행정동별 집계

### 3. 기간별 화면 (/period)
- 시계열 그래프
- 계절/요일/시간대별 분석

### 4. 관리자 화면 (/admin)
- 로그 조회
- 활용 통계

## 민원 분류 카테고리
- 교통·주차
- 도로·시설물
- 환경·청소
- 건축·주택
- 복지·보건
- 세무·요금
- 안전·재난
- 문화·관광
- 교육·청소년
- 민원행정
- 기타

## 공통 기능
- 데이터 다운로드 (CSV, Excel, 이미지)
- 워드클라우드
- 연관어 분석

## 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm run start
```

## 참조 템플릿
- UI 템플릿: `Modernize-Nextjs-Free-main UI/` 폴더
- 라이브 데모: https://modernize-nextjs-free.vercel.app/

## 데이터 형식 예시

```json
{
  "districts": [
    {
      "code": "11680",
      "name": "강남구",
      "complaints": {
        "교통·주차": 1250,
        "도로·시설물": 890,
        "환경·청소": 720
      },
      "coordinates": {
        "lat": 37.5172,
        "lng": 127.0473
      }
    }
  ]
}
```
