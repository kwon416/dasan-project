# CLAUDE.md - DASAN 민원 데이터 공개 시스템 프론트엔드

이 파일은 Claude Code (claude.ai/code)가 프론트엔드 개발 시 참고할 가이드를 제공합니다.

---

## 1. 프로젝트 개요

DASAN 민원 데이터 공개 시스템의 프론트엔드 애플리케이션입니다. 서울시 도봉구 민원 데이터를 시각화하여 시민들이 쉽게 접근하고 활용할 수 있도록 합니다.

### 기술 스택

- **React 18**: UI 라이브러리
- **Vite + SWC**: 빌드 도구
- **React Router v6**: 라우팅
- **krds-react / krds-uiux**: 한국형 디자인 시스템 (대한민국 정부 표준)
- **recharts**: 차트 시각화
- **react-simple-maps + d3-geo**: 지도 시각화
- **react-wordcloud**: 워드클라우드
- **react-force-graph-2d**: 키워드 네트워크 시각화

---

## 2. 빌드 및 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 빌드 로컬 미리보기
npm run preview

# 린터 실행
npm run lint

# 테스트 실행 (watch 모드)
npm run test

# 테스트 실행 (단일 실행)
npm run test:run
```

---

## 3. PRD 요구사항 매핑

| PRD ID | 요구사항 | 구현 컴포넌트 |
|--------|----------|---------------|
| SFR-003 | 대시보드 메인 화면 | `EgovComplaintMain.jsx` |
| SFR-004 | 키워드 검색 기능 | `EgovComplaintMain.jsx`, `EgovComplaintSearch.jsx` |
| SFR-005 | 검색 결과 표시 | `EgovComplaintSearch.jsx` |
| SFR-006 | 자치구별 분석 (지도) | `EgovComplaintMap.jsx` |
| SFR-007 | 행정동별 분석 (지도) | `EgovComplaintMap.jsx` |
| SFR-008 | 시계열 추이 분석 | `EgovComplaintTrend.jsx` |
| SFR-009 | 빈도 분석 | `EgovComplaintFrequency.jsx` |
| SFR-011 | 워드클라우드 | `EgovComplaintKeyword.jsx` |
| SFR-012 | 연관어 분석 | `EgovComplaintKeyword.jsx` |
| ECR-005 | 관리자 로그 조회 | `EgovAdminComplaintLog.jsx` |
| SFR-001 | 활용 통계 | `EgovAdminComplaintStats.jsx` |

---

## 4. 신규 페이지 컴포넌트

### 사용자 페이지 (src/pages/complaint/)

| 파일명 | PRD | 설명 |
|--------|-----|------|
| `EgovComplaintMain.jsx` | SFR-003, 004, 005 | 대시보드 메인 페이지 (검색, 주요 통계, 미리보기) |
| `EgovComplaintSearch.jsx` | SFR-004, 005 | 키워드 검색 결과 페이지 |
| `EgovComplaintMap.jsx` | SFR-006, 007 | 지도 기반 자치구/행정동 분석 페이지 |
| `EgovComplaintTrend.jsx` | SFR-008 | 시계열 추이 분석 페이지 (일별/월별/연도별) |
| `EgovComplaintFrequency.jsx` | SFR-009 | 빈도 분석 페이지 (민원 유형별, 시간대별) |
| `EgovComplaintKeyword.jsx` | SFR-011, 012 | 워드클라우드 및 연관어 네트워크 분석 페이지 |

### 관리자 페이지 (src/pages/admin/complaint/)

| 파일명 | PRD | 설명 |
|--------|-----|------|
| `EgovAdminComplaintLog.jsx` | ECR-005 | 사용자 활동 로그 조회/검색 페이지 |
| `EgovAdminComplaintStats.jsx` | SFR-001 | 시스템 활용 통계 대시보드 |

---

## 5. 신규 공통 컴포넌트

### 차트 컴포넌트 (src/components/chart/)

| 컴포넌트 | 설명 |
|----------|------|
| `EgovLineChart.jsx` | 시계열 추이를 표시하는 라인 차트 |
| `EgovBarChart.jsx` | 빈도/비교 분석을 위한 막대 차트 |
| `EgovPieChart.jsx` | 비율 분석을 위한 파이/도넛 차트 |
| `EgovHeatmapChart.jsx` | 시간대별 히트맵 차트 |
| `EgovChartContainer.jsx` | 차트 공통 래퍼 (제목, 다운로드 버튼 포함) |

### 지도 컴포넌트 (src/components/map/)

| 컴포넌트 | 설명 |
|----------|------|
| `EgovSeoulMap.jsx` | 서울시 자치구/행정동 지도 시각화 |
| `EgovMapTooltip.jsx` | 지도 영역 호버 시 표시되는 툴팁 |
| `EgovMapLegend.jsx` | 지도 색상 범례 |

### 시각화 컴포넌트 (src/components/visualization/)

| 컴포넌트 | 설명 |
|----------|------|
| `EgovWordCloud.jsx` | 키워드 빈도 기반 워드클라우드 |
| `EgovKeywordNetwork.jsx` | 연관어 네트워크 그래프 |

### UI 컴포넌트 (src/components/)

| 컴포넌트 | 설명 |
|----------|------|
| `EgovDataCard.jsx` | 주요 통계를 표시하는 카드 컴포넌트 |
| `EgovDateRangePicker.jsx` | 기간 선택 컴포넌트 (일별/월별/연도별) |
| `EgovDownloadButton.jsx` | CSV/Excel/이미지 다운로드 버튼 |
| `EgovKeywordInput.jsx` | 키워드 검색 입력 컴포넌트 |
| `EgovRegionSelector.jsx` | 자치구/행정동 선택 드롭다운 |
| `EgovLoadingSpinner.jsx` | 데이터 로딩 상태 표시 |

---

## 6. krds-react 디자인 시스템 활용 가이드

### 사용 가능한 krds-react 컴포넌트 (참고)

**레이아웃**
- `Container`: 콘텐츠 컨테이너
- `Row`, `Col`: 그리드 시스템

**폼 요소**
- `Input`: 텍스트 입력
- `Select`: 드롭다운 선택
- `Button`: 버튼 (primary, secondary, outline 등)
- `DatePicker`: 날짜 선택

**네비게이션**
- `Tab`: 탭 메뉴
- `Pagination`: 페이지네이션
- `Breadcrumb`: 경로 표시

**피드백**
- `Alert`: 알림 메시지
- `Modal`: 모달 다이얼로그
- `Toast`: 토스트 알림

### CSS 변수 활용

```css
/* 기본 색상 */
--krds-color-primary: #0d6efd;
--krds-color-secondary: #6c757d;
--krds-color-success: #198754;
--krds-color-danger: #dc3545;
--krds-color-warning: #ffc107;
--krds-color-info: #0dcaf0;

/* 간격 */
--krds-spacing-1: 0.25rem;
--krds-spacing-2: 0.5rem;
--krds-spacing-3: 1rem;
--krds-spacing-4: 1.5rem;
--krds-spacing-5: 3rem;

/* 타이포그래피 */
--krds-font-size-sm: 0.875rem;
--krds-font-size-base: 1rem;
--krds-font-size-lg: 1.125rem;
--krds-font-size-xl: 1.25rem;
```

---

## 7. API 서비스 레이어 구조

### 민원 데이터 API (src/api/services/complaint/)

| 파일명 | 설명 |
|--------|------|
| `dashboard.js` | 대시보드 요약 데이터 조회 |
| `search.js` | 키워드 검색 API |
| `map.js` | 지도 시각화용 지역별 데이터 |
| `trend.js` | 시계열 추이 데이터 |
| `frequency.js` | 빈도 분석 데이터 |
| `keyword.js` | 워드클라우드/연관어 데이터 |
| `download.js` | CSV/Excel/이미지 다운로드 처리 |

### 관리자 API (src/api/services/admin/)

| 파일명 | 설명 |
|--------|------|
| `log.js` | 활동 로그 조회/검색 |
| `stats.js` | 시스템 활용 통계 조회 |

### API 호출 패턴

기존 `requestFetch` 함수 패턴을 따릅니다:

```javascript
import * as EgovNet from "@/api/egovFetch";

// GET 요청 예시
const fetchDashboardData = (params, onSuccess, onError) => {
  const url = "/api/complaint/dashboard" + EgovNet.getQueryString(params);
  const requestOptions = {
    method: "GET",
    headers: { "Content-type": "application/json" },
  };
  EgovNet.requestFetch(url, requestOptions, onSuccess, onError);
};

// POST 요청 예시
const searchKeyword = (body, onSuccess, onError) => {
  const url = "/api/complaint/search";
  const requestOptions = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  };
  EgovNet.requestFetch(url, requestOptions, onSuccess, onError);
};
```

---

## 8. URL 상수 확장 (src/constants/url.js)

기존 URL 상수에 다음 항목을 추가합니다:

```javascript
// COMPLAINT (민원 데이터 공개)
COMPLAINT: "/complaint",                           // 민원 데이터 공개 메인
COMPLAINT_SEARCH: "/complaint/search",             // 검색 결과
COMPLAINT_MAP: "/complaint/map",                   // 지도 분석
COMPLAINT_TREND: "/complaint/trend",               // 추이 분석
COMPLAINT_FREQUENCY: "/complaint/frequency",       // 빈도 분석
COMPLAINT_KEYWORD: "/complaint/keyword",           // 키워드 분석

// ADMIN - COMPLAINT (관리자 - 민원 관리)
ADMIN_COMPLAINT: "/admin/complaint",               // 관리자 민원 메인
ADMIN_COMPLAINT_LOG: "/admin/complaint/log",       // 로그 조회
ADMIN_COMPLAINT_STATS: "/admin/complaint/stats",   // 활용 통계
```

---

## 9. 추가 라이브러리

다음 라이브러리를 설치해야 합니다:

```bash
npm install recharts date-fns react-simple-maps d3-geo topojson-client react-wordcloud react-force-graph-2d xlsx file-saver html-to-image
```

| 라이브러리 | 용도 |
|-----------|------|
| `recharts` | 차트 시각화 (라인, 바, 파이, 히트맵) |
| `date-fns` | 날짜 처리 유틸리티 |
| `react-simple-maps` | 지도 시각화 기반 |
| `d3-geo` | 지리 데이터 투영 |
| `topojson-client` | TopoJSON 데이터 처리 |
| `react-wordcloud` | 워드클라우드 생성 |
| `react-force-graph-2d` | 네트워크 그래프 (연관어) |
| `xlsx` | Excel 파일 생성 |
| `file-saver` | 파일 다운로드 처리 |
| `html-to-image` | 차트/시각화 이미지 저장 |

---

## 10. 개발 우선순위 (7단계)

### Phase 1: 핵심 인프라
- [ ] URL 상수 추가 (`src/constants/url.js`)
- [ ] 라우팅 설정 (`src/routes/index.jsx`)
- [ ] API 서비스 구조 생성
- [ ] 헤더 네비게이션 메뉴 추가 (`src/components/EgovHeader.jsx`)
- [ ] 좌측 네비게이션 컴포넌트 생성 (`src/components/leftmenu/EgovLeftNavComplaint.jsx`)

### Phase 2: 대시보드 + 검색
- [ ] `EgovComplaintMain.jsx` - 메인 대시보드 페이지
- [ ] `EgovComplaintSearch.jsx` - 검색 결과 페이지
- [ ] `EgovDataCard.jsx` - 통계 카드 컴포넌트
- [ ] `EgovKeywordInput.jsx` - 키워드 검색 입력
- [ ] `EgovLoadingSpinner.jsx` - 로딩 상태

### Phase 3: 차트 시각화
- [ ] `EgovChartContainer.jsx` - 차트 래퍼
- [ ] `EgovLineChart.jsx` - 라인 차트
- [ ] `EgovBarChart.jsx` - 막대 차트
- [ ] `EgovComplaintTrend.jsx` - 추이 분석 페이지
- [ ] `EgovComplaintFrequency.jsx` - 빈도 분석 페이지

### Phase 4: 지도 시각화
- [ ] 서울시 TopoJSON 데이터 준비
- [ ] `EgovSeoulMap.jsx` - 지도 컴포넌트
- [ ] `EgovMapTooltip.jsx` - 지도 툴팁
- [ ] `EgovMapLegend.jsx` - 지도 범례
- [ ] `EgovComplaintMap.jsx` - 지도 분석 페이지

### Phase 5: 키워드 분석
- [ ] `EgovWordCloud.jsx` - 워드클라우드
- [ ] `EgovKeywordNetwork.jsx` - 연관어 네트워크
- [ ] `EgovComplaintKeyword.jsx` - 키워드 분석 페이지

### Phase 6: 관리자 기능
- [ ] `EgovAdminComplaintLog.jsx` - 로그 조회 페이지
- [ ] `EgovAdminComplaintStats.jsx` - 활용 통계 페이지
- [ ] 관리자 좌측 메뉴 업데이트

### Phase 7: 테스트 및 마무리
- [ ] 단위 테스트 작성
- [ ] 통합 테스트
- [ ] 반응형 디자인 검증
- [ ] 접근성 검증

---

## 11. 테스트 전략

### Vitest 단위 테스트

테스트 파일은 각 컴포넌트와 동일한 폴더에 위치합니다:

```
src/
├── components/
│   ├── EgovDataCard.jsx
│   └── EgovDataCard.test.jsx
├── pages/complaint/
│   ├── EgovComplaintMain.jsx
│   └── EgovComplaintMain.test.jsx
```

### 테스트 범위

| 카테고리 | 테스트 항목 |
|----------|-------------|
| 컴포넌트 | 렌더링, props 처리, 이벤트 핸들링 |
| 차트 | 데이터 매핑, 축 레이블, 툴팁 표시 |
| 지도 | 지역 클릭 이벤트, 색상 매핑, 툴팁 |
| API | 요청/응답 처리, 에러 핸들링 |
| 유틸리티 | 날짜 포맷, 숫자 포맷, 데이터 변환 |

---

## 12. 폴더 구조 최종안

```
src/
├── api/
│   ├── egovFetch.js                 # 기존 API 유틸리티
│   └── services/
│       ├── complaint/               # [신규] 민원 데이터 API
│       │   ├── dashboard.js
│       │   ├── search.js
│       │   ├── map.js
│       │   ├── trend.js
│       │   ├── frequency.js
│       │   ├── keyword.js
│       │   └── download.js
│       └── admin/                   # [신규] 관리자 API
│           ├── log.js
│           └── stats.js
├── components/
│   ├── chart/                       # [신규] 차트 컴포넌트
│   │   ├── EgovLineChart.jsx
│   │   ├── EgovBarChart.jsx
│   │   ├── EgovPieChart.jsx
│   │   ├── EgovHeatmapChart.jsx
│   │   └── EgovChartContainer.jsx
│   ├── map/                         # [신규] 지도 컴포넌트
│   │   ├── EgovSeoulMap.jsx
│   │   ├── EgovMapTooltip.jsx
│   │   └── EgovMapLegend.jsx
│   ├── visualization/               # [신규] 시각화 컴포넌트
│   │   ├── EgovWordCloud.jsx
│   │   └── EgovKeywordNetwork.jsx
│   ├── leftmenu/
│   │   ├── EgovLeftNavComplaint.jsx # [신규] 민원 좌측 메뉴
│   │   └── ... (기존 파일들)
│   ├── EgovDataCard.jsx             # [신규]
│   ├── EgovDateRangePicker.jsx      # [신규]
│   ├── EgovDownloadButton.jsx       # [신규]
│   ├── EgovKeywordInput.jsx         # [신규]
│   ├── EgovRegionSelector.jsx       # [신규]
│   ├── EgovLoadingSpinner.jsx       # [신규]
│   └── ... (기존 파일들)
├── pages/
│   ├── complaint/                   # [신규] 민원 데이터 공개 페이지
│   │   ├── EgovComplaintMain.jsx
│   │   ├── EgovComplaintSearch.jsx
│   │   ├── EgovComplaintMap.jsx
│   │   ├── EgovComplaintTrend.jsx
│   │   ├── EgovComplaintFrequency.jsx
│   │   └── EgovComplaintKeyword.jsx
│   └── admin/
│       ├── complaint/               # [신규] 관리자 민원 관리
│       │   ├── EgovAdminComplaintLog.jsx
│       │   └── EgovAdminComplaintStats.jsx
│       └── ... (기존 폴더들)
├── constants/
│   └── url.js                       # URL 상수 확장
├── data/                            # [신규] 정적 데이터
│   └── seoul-topo.json              # 서울시 TopoJSON
└── utils/                           # [신규] 유틸리티 확장
    ├── chartUtils.js                # 차트 관련 유틸리티
    ├── mapUtils.js                  # 지도 관련 유틸리티
    └── downloadUtils.js             # 다운로드 관련 유틸리티
```

---

## 13. 구현 시 주의사항

### 기존 패턴 준수

1. **컴포넌트 명명**: 모든 컴포넌트는 `Egov` 접두사 사용
2. **API 호출**: `requestFetch` 함수 사용 (`@/api/egovFetch.js`)
3. **라우팅**: `URL` 상수 사용 (`@/constants/url.js`)
4. **상태 코드**: `CODE` 상수 사용 (`@/constants/code.js`)
5. **세션 관리**: `getSessionItem`, `setSessionItem` 사용 (`@/utils/storage.js`)

### krds-react 컴포넌트 우선 활용

- 커스텀 UI 작성 전 krds-react에서 제공하는 컴포넌트 확인
- krds CSS 변수를 활용하여 일관된 스타일 유지

### 데이터베이스 테이블 연동

백엔드 API와 연동 시 다음 테이블 구조 참고:
- `tb_real_complaint_summary`: 실시간 민원 요약
- `tb_real_keyword_count`: 키워드 빈도
- `tb_real_region_stats`: 지역별 통계
- `tb_bach_trend_daily`: 일별 추이 (배치)
- `tb_bach_trend_monthly`: 월별 추이 (배치)

### 반응형 디자인

- 모바일 (< 768px), 태블릿 (768px ~ 1024px), 데스크톱 (> 1024px) 대응
- 차트와 지도는 컨테이너 크기에 반응하도록 구현
- krds 브레이크포인트 활용

---

## 14. 핵심 참조 파일

개발 시 다음 파일들의 패턴을 참고합니다:

| 파일 | 참고 내용 |
|------|-----------|
| `src/routes/index.jsx` | 라우팅 패턴, 권한 체크 |
| `src/pages/inform/notice/EgovNoticeList.jsx` | 리스트 페이지 패턴, 검색, 페이징 |
| `src/api/egovFetch.js` | API 호출 패턴 |
| `src/components/EgovHeader.jsx` | 헤더 메뉴 구조, 권한별 표시 |
| `src/components/leftmenu/EgovLeftNavInform.jsx` | 좌측 네비게이션 패턴 |
| `src/constants/url.js` | URL 상수 정의 패턴 |
| `src/constants/code.js` | 코드 상수 정의 패턴 |

---

## 15. 빠른 시작 가이드

### 새로운 페이지 추가하기

1. `src/constants/url.js`에 URL 상수 추가
2. `src/pages/{feature}/` 폴더에 페이지 컴포넌트 생성
3. `src/routes/index.jsx`에 라우트 등록
4. `src/components/EgovHeader.jsx`에 메뉴 링크 추가
5. 필요시 좌측 네비게이션 컴포넌트 생성/수정

### 새로운 API 서비스 추가하기

1. `src/api/services/{feature}/` 폴더에 서비스 파일 생성
2. `requestFetch` 패턴을 따르는 함수 작성
3. 페이지 컴포넌트에서 import하여 사용

### 새로운 컴포넌트 추가하기

1. `src/components/` 또는 하위 폴더에 컴포넌트 생성
2. `Egov` 접두사 사용
3. PropTypes 또는 TypeScript 타입 정의
4. 테스트 파일 함께 생성 (`*.test.jsx`)

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2026-01-19 | 1.0.0 | 최초 작성 - 프론트엔드 개발 가이드 |
