# DASAN 민원 데이터 공개 시스템 백엔드 API 모듈

**작성일**: 2026년 1월 19일
**프레임워크**: eGovFramework 4.3.0 (Spring Boot 2.7.18)
**PRD 문서**: `docs/dasan_prd.md`
**DDL 스키마**: `DATABASE/dasan_ddl.sql`

---

## 1. 모듈 개요

DASAN 민원 데이터 공개 시스템의 백엔드 REST API 모듈입니다.
실시간 민원 키워드, 지역별/기간별 분석, 시각화 및 다운로드 기능을 제공합니다.

### 1.1 기능 요구사항 매핑

| REQ No. | 기능 | 담당 모듈 | 상태 |
|---------|------|----------|------|
| SFR-003 | 전체 민원 데이터 건수 안내 | `dashboard` | 미구현 |
| SFR-004 | 키워드 기준 민원 데이터 조회 | `complaint` | 미구현 |
| SFR-005 | 특정 키워드 최신 발생 추이 | `complaint` | 미구현 |
| SFR-006 | 키워드 기준 민원 지도 시각화 | `region` | 미구현 |
| SFR-007 | 자치구·행정동 단위 분석 | `region` | 미구현 |
| SFR-008 | 핵심 키워드 요약 및 추이 | `complaint` | 미구현 |
| SFR-009 | 민원 발생 빈도 분석 | `frequency` | 미구현 |
| SFR-010 | 데이터 다운로드 | `download` | 미구현 |
| SFR-011 | 연관 키워드 워드클라우드 | `keyword` | 미구현 |
| SFR-012 | 키워드 연관어 분석 | `keyword` | 미구현 |
| ECR-005 | 관리자 로그 조회 | `statistics` | 미구현 |
| SFR-001 | 메뉴별 활용 통계 | `statistics` | 미구현 |

---

## 2. 패키지 구조

```
egovframework.dasan/
├── common/                           # 공통 컴포넌트
│   └── DasanComDefaultVO.java        # 페이징/검색 공통 VO
│
├── dashboard/                        # SFR-003: 대시보드
│   ├── web/
│   │   └── DasanDashboardApiController.java
│   ├── service/
│   │   ├── DasanDashboardService.java
│   │   ├── impl/DasanDashboardServiceImpl.java
│   │   ├── DashboardStatsVO.java
│   │   └── DashboardSearchVO.java
│   └── dao/
│       └── DasanDashboardDAO.java
│
├── complaint/                        # SFR-004, 005, 008: 민원 조회/추이
│   ├── web/
│   │   └── DasanComplaintApiController.java
│   ├── service/
│   │   ├── DasanComplaintService.java
│   │   ├── impl/DasanComplaintServiceImpl.java
│   │   ├── ComplaintVO.java
│   │   ├── ComplaintSearchVO.java
│   │   ├── ComplaintTrendVO.java
│   │   └── KeywordSummaryVO.java
│   └── dao/
│       └── DasanComplaintDAO.java
│
├── region/                           # SFR-006, 007: 지역 분석
│   ├── web/
│   │   └── DasanRegionApiController.java
│   ├── service/
│   │   ├── DasanRegionService.java
│   │   ├── impl/DasanRegionServiceImpl.java
│   │   ├── RegionStatsVO.java
│   │   ├── GuAnalysisVO.java
│   │   ├── DongAnalysisVO.java
│   │   └── RegionSearchVO.java
│   └── dao/
│       └── DasanRegionDAO.java
│
├── frequency/                        # SFR-009: 빈도 분석
│   ├── web/
│   │   └── DasanFrequencyApiController.java
│   ├── service/
│   │   ├── DasanFrequencyService.java
│   │   ├── impl/DasanFrequencyServiceImpl.java
│   │   ├── MonthlyFrequencyVO.java
│   │   ├── WeekdayFrequencyVO.java
│   │   ├── HourlyFrequencyVO.java
│   │   ├── SeasonalFrequencyVO.java
│   │   └── FrequencySearchVO.java
│   └── dao/
│       └── DasanFrequencyDAO.java
│
├── keyword/                          # SFR-011, 012: 키워드 분석
│   ├── web/
│   │   └── DasanKeywordApiController.java
│   ├── service/
│   │   ├── DasanKeywordService.java
│   │   ├── impl/DasanKeywordServiceImpl.java
│   │   ├── WordCloudVO.java
│   │   ├── RelatedKeywordVO.java
│   │   └── KeywordSearchVO.java
│   └── dao/
│       └── DasanKeywordDAO.java
│
├── download/                         # SFR-010: 다운로드
│   ├── web/
│   │   └── DasanDownloadApiController.java
│   ├── service/
│   │   ├── DasanDownloadService.java
│   │   ├── impl/DasanDownloadServiceImpl.java
│   │   └── DownloadRequestVO.java
│   └── dao/
│       └── DasanDownloadDAO.java
│
└── statistics/                       # SFR-001, ECR-005: 통계/로그
    ├── web/
    │   └── DasanStatisticsApiController.java
    ├── service/
    │   ├── DasanStatisticsService.java
    │   ├── impl/DasanStatisticsServiceImpl.java
    │   ├── MenuUsageVO.java
    │   ├── AccessLogVO.java
    │   └── StatisticsSearchVO.java
    └── dao/
        └── DasanStatisticsDAO.java
```

---

## 3. API 엔드포인트 명세

### 3.1 대시보드 API (`/api/dasan/dashboard`)

| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|----------|
| GET | `/stats` | 전체 민원 현황 조회 | - |
| GET | `/summary` | 수집 기간/업데이트 시각 | - |

### 3.2 민원 조회 API (`/api/dasan/complaint`)

| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|----------|
| GET | `/search` | 키워드 검색 목록 | `keyword`, `pageIndex`, `pageSize` |
| GET | `/trend/hourly` | 24시간 추이 | `keyword` |
| GET | `/trend/weekly` | 1주일 추이 | `keyword` |
| GET | `/trend/daily` | 일간 추이 | `keyword`, `startDate`, `endDate` |
| GET | `/keyword/summary` | 키워드 요약 | `limit` |
| GET | `/keyword/trend` | 키워드 일간 추이 | `keyword`, `days` |

### 3.3 지역 분석 API (`/api/dasan/region`)

| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|----------|
| GET | `/map` | 지도 시각화 데이터 | `keyword`, `year`, `month` |
| GET | `/gu` | 자치구별 집계 | `keyword`, `year`, `month` |
| GET | `/gu/{guName}` | 자치구 상세 | `keyword`, `year`, `month` |
| GET | `/dong` | 행정동별 집계 | `keyword`, `gu`, `year`, `month` |
| GET | `/pattern` | 지역별 패턴 분석 | `keyword` |

### 3.4 빈도 분석 API (`/api/dasan/frequency`)

| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|----------|
| GET | `/monthly` | 월별 패턴 | `keyword`, `year` |
| GET | `/weekday` | 요일별 패턴 | `keyword` |
| GET | `/hourly` | 시간대별 패턴 | `keyword` |
| GET | `/seasonal` | 계절별 패턴 | `keyword`, `year` |
| GET | `/combined` | 복합 빈도 분석 | `keyword` |

### 3.5 키워드 분석 API (`/api/dasan/keyword`)

| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|----------|
| GET | `/wordcloud` | 워드클라우드 데이터 | `limit`, `year`, `month` |
| GET | `/related` | 연관어 분석 | `keyword`, `limit` |
| GET | `/network` | 키워드 네트워크 | `keyword`, `depth` |
| GET | `/top` | 상위 키워드 | `limit`, `period` |

### 3.6 다운로드 API (`/api/dasan/download`)

| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|----------|
| GET | `/csv` | CSV 다운로드 | `type`, `keyword`, `startDate`, `endDate` |
| GET | `/excel` | Excel 다운로드 | `type`, `keyword`, `startDate`, `endDate` |
| GET | `/image` | 차트 이미지 | `chartType`, `keyword` |

### 3.7 통계/로그 API (`/api/dasan/statistics`)

| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|----------|
| GET | `/menu` | 메뉴별 통계 | `startDate`, `endDate` |
| GET | `/visitors` | 이용자 수 | `startDate`, `endDate` |
| GET | `/views` | 조회수 | `menuId`, `startDate`, `endDate` |
| GET | `/downloads` | 다운로드 로그 | `startDate`, `endDate` |
| POST | `/log` | 로그 기록 | `menuId`, `actionType` |

---

## 4. 데이터베이스 테이블 (DDL)

### 4.1 실시간 데이터 테이블

```sql
-- 실시간 수신 원본 테이블
tb_real_time (
    real_time_seq BIGINT PRIMARY KEY,
    yy VARCHAR(4),      -- 연도
    mm VARCHAR(2),      -- 월
    dd VARCHAR(2),      -- 일
    hh VARCHAR(2),      -- 시
    keyword VARCHAR(50),
    call_id VARCHAR(50)
)

-- 요일별 집계 테이블 (월~일)
tb_real_mon, tb_real_tue, tb_real_wed, tb_real_thu,
tb_real_fri, tb_real_sat, tb_real_sun (
    *_seq BIGINT PRIMARY KEY,
    keyword VARCHAR(50),
    count INT
)
```

### 4.2 배치 데이터 테이블

```sql
-- 배치 상담 원본 테이블
tb_bach_consultation (
    bach_consultation_seq BIGINT PRIMARY KEY,
    yy VARCHAR(4),
    mm VARCHAR(2),
    dd VARCHAR(2),
    hh VARCHAR(2),
    wk VARCHAR(1),      -- 요일
    gu VARCHAR(50),     -- 자치구
    dong VARCHAR(50),   -- 행정동
    keyword VARCHAR(50),
    call_id VARCHAR(50)
)

-- 월별 집계 테이블 (1월~12월)
tb_bach_1m ~ tb_bach_12m (
    bach_*m_seq BIGINT PRIMARY KEY,
    yy VARCHAR(4),
    mm VARCHAR(2),
    dd VARCHAR(2),
    hh VARCHAR(2),
    wk VARCHAR(1),
    gu VARCHAR(50),
    dong VARCHAR(50),
    keyword VARCHAR(50),
    count INT
)
```

---

## 5. 개발 규칙

### 5.1 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| Controller | `Dasan{기능}ApiController` | `DasanDashboardApiController` |
| Service Interface | `Dasan{기능}Service` | `DasanDashboardService` |
| Service Impl | `Dasan{기능}ServiceImpl` | `DasanDashboardServiceImpl` |
| DAO | `Dasan{기능}DAO` | `DasanDashboardDAO` |
| VO | `{기능}VO` / `{기능}SearchVO` | `DashboardStatsVO` |

### 5.2 계층별 패턴

**Controller**:
```java
@RestController
@RequestMapping("/api/dasan/{module}")
@Tag(name = "Dasan{Module}ApiController", description = "{모듈} API")
@Slf4j
public class Dasan{Module}ApiController {

    private final Dasan{Module}Service service;

    public Dasan{Module}ApiController(Dasan{Module}Service service) {
        this.service = service;
    }

    @GetMapping("/{endpoint}")
    @Operation(summary = "기능 설명")
    public ResultVO method(@RequestParam ...) {
        ResultVO resultVO = new ResultVO();
        // Service 호출
        resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
        resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
        return resultVO;
    }
}
```

**Service Interface**:
```java
public interface Dasan{Module}Service {
    List<{VO}> select{List}({SearchVO} searchVO) throws Exception;
    {VO} select{Detail}({SearchVO} searchVO) throws Exception;
}
```

**Service Implementation**:
```java
@Service("dasan{Module}Service")
@Slf4j
public class Dasan{Module}ServiceImpl implements Dasan{Module}Service {

    private final Dasan{Module}DAO dao;

    public Dasan{Module}ServiceImpl(Dasan{Module}DAO dao) {
        this.dao = dao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<{VO}> select{List}({SearchVO} searchVO) throws Exception {
        return dao.select{List}(searchVO);
    }
}
```

**DAO**:
```java
@Repository("dasan{Module}DAO")
public class Dasan{Module}DAO extends EgovAbstractMapper {

    public List<{VO}> select{List}({SearchVO} searchVO) throws Exception {
        return selectList("Dasan{Module}DAO.select{List}", searchVO);
    }
}
```

### 5.3 MyBatis 매퍼 패턴

**위치**: `src/main/resources/egovframework/mapper/dasan/`

**파일 네이밍**: `Dasan{Module}_SQL_mysql.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="Dasan{Module}DAO">

    <resultMap id="{result}Map" type="egovframework.dasan.{module}.service.{VO}">
        <result property="javaField" column="DB_COLUMN"/>
    </resultMap>

    <select id="select{List}" parameterType="{SearchVO}" resultMap="{result}Map">
        SELECT ...
        FROM tb_...
        WHERE 1=1
        <if test="keyword != null and keyword != ''">
            AND keyword LIKE CONCAT('%', #{keyword}, '%')
        </if>
        LIMIT #{recordCountPerPage} OFFSET #{firstIndex}
    </select>

</mapper>
```

---

## 6. 구현 우선순위

### Phase 1: 기반 구축
1. ✅ CLAUDE.md 문서 작성
2. ⬜ 공통 VO (`DasanComDefaultVO`)
3. ⬜ 대시보드 모듈 (`dashboard`)
4. ⬜ 민원 조회 기본 (`complaint` - 검색, 목록)

### Phase 2: 핵심 분석
5. ⬜ 민원 추이 (`complaint` - 24시간, 1주일)
6. ⬜ 키워드 요약 (`complaint` - 요약, 추이)
7. ⬜ 지역 분석 (`region`)

### Phase 3: 고급 분석
8. ⬜ 빈도 분석 (`frequency`)
9. ⬜ 키워드 분석 (`keyword`)

### Phase 4: 유틸리티
10. ⬜ 다운로드 (`download`)
11. ⬜ 통계/로그 (`statistics`)

---

## 7. 참조 파일

| 목적 | 파일 경로 |
|------|----------|
| Controller 패턴 | `let/cop/bbs/web/EgovBBSManageApiController.java` |
| Service 패턴 | `let/cop/bbs/service/impl/EgovBBSManageServiceImpl.java` |
| DAO 패턴 | `let/cop/bbs/service/impl/BBSManageDAO.java` |
| VO 패턴 | `let/cop/bbs/service/BoardVO.java` |
| MyBatis 패턴 | `mapper/let/cop/bbs/EgovBoard_SQL_mysql.xml` |
| DDL | `DATABASE/dasan_ddl.sql` |

---

## 8. 테스트 방법

1. **Swagger UI**: `http://localhost:8080/swagger-ui.html`
2. **단위 테스트**: `src/test/java/egovframework/dasan/`
3. **API 테스트 도구**: Postman, curl

---

## 9. 변경 이력

| 날짜 | 버전 | 내용 | 작성자 |
|------|------|------|--------|
| 2026-01-19 | 1.0 | 초기 계획 문서 작성 | Claude |
