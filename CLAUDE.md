# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

다산콜재단120 민원공개시스템 - 전자정부 표준프레임워크(eGovFrame) 4.3.0 기반 풀스택 웹 애플리케이션

### 프로젝트 구조

```
dasan-project/
├── frontend/                 # Next.js 프로토타입 (UI 참조용)
├── dasancall/                # SVN 관리 - eGovFrame 백엔드 (팀 공유)
│   └── dasan-stat/           # 통계 서비스 WAR (실제 배포 대상)
│       └── src/main/webapp/  # 프론트엔드 코드 위치 (JSP, CSS, JS)
├── dasan-spring-sample/      # 샘플 Spring 프로젝트
└── docs/                     # 개발 가이드 문서
```

**중요**:
- `dasancall/` 폴더는 SVN으로 팀과 공유하는 워크스페이스입니다. CLAUDE 관련 파일 생성 금지
- `frontend/`는 UI 프로토타입으로, 이 코드를 `dasancall/dasan-stat/src/main/webapp/`으로 JSP/CSS/JS로 변환하여 옮길 예정

## 빌드 및 개발 명령어

### 프로토타입 UI 확인 (frontend/)

```bash
cd frontend
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
```

### 실제 배포 빌드 (dasancall/dasan-stat/)

eGovFrame 4.3.0 기반 Maven WAR 프로젝트 (Java 1.8, MariaDB)

```bash
cd dasancall/dasan-stat
mvn clean install    # 빌드
mvn test             # 테스트 실행
```

**산출물**: `dasan-stat-1.0.0.war` (Tomcat 배포용)
## 아키텍처

### 프론트엔드 프로토타입 (frontend/) → webapp으로 이전 예정

**프로토타입 기술 스택** (참조용):
- Next.js 16 (App Router) + TypeScript
- React 19 + Tailwind CSS v4
- shadcn/ui, Recharts (차트), Leaflet (지도)

**프로토타입 → JSP 변환 매핑**:
```
frontend/app/page.tsx           → webapp/WEB-INF/jsp/main/main.jsp
frontend/app/complaint/region/  → webapp/WEB-INF/jsp/complaint/region.jsp
frontend/app/complaint/period/  → webapp/WEB-INF/jsp/complaint/period.jsp
frontend/components/charts/     → webapp/resources/js/charts/
frontend/components/maps/       → webapp/resources/js/maps/
```

### 실제 배포 대상 (dasancall/dasan-stat/src/main/webapp/)

```
webapp/
├── css/                      # 스타일시트
├── images/                   # 이미지 리소스
├── resources/                # 정적 리소스 (JS, 외부 라이브러리)
├── common/                   # 공통 include 파일
├── index.jsp                 # 진입점
└── WEB-INF/
    ├── jsp/                  # JSP 뷰 파일
    ├── config/               # Spring 설정
    ├── lib/                  # JAR 라이브러리
    └── web.xml               # 서블릿 설정
```

### 백엔드 - dasan-stat (dasancall/dasan-stat/)

**계층형 아키텍처** (eGovFrame 표준):
- **Controller** (`web/` 패키지) - 웹 요청 처리
- **Service** (`service/` 패키지) - 비즈니스 로직
- **DAO** (MyBatis) - `resources/dasan/sqlmap/mappers/`

**주요 패키지**:
- `egovframework.example` - eGovFrame 샘플 코드
- `kr.or.dasancall` - 다산콜 커스텀 비즈니스 로직
  - `service/` - MainService, DashboardVO
  - `web/` - MainController

**기술 스택**:
- eGovFrame 4.3.0 + Spring 5.3.37
- MyBatis (MariaDB)
- Lombok

## 설정 파일

### dasan-stat (dasancall/dasan-stat/)

**Spring XML 설정**: `src/main/resources/dasan/spring/`
- `context-datasource.xml` - MariaDB 데이터소스
- `context-mapper.xml` - MyBatis 매퍼 설정
- `context-transaction.xml` - 트랜잭션 관리

**웹 설정**: `src/main/webapp/WEB-INF/`
- `web.xml` - 서블릿 설정
- `config/` - 추가 설정 파일

## 개발 패턴

### 프로토타입 UI 개발 (frontend/)

1. `frontend/app/{route}/page.tsx` 생성
2. 필요한 컴포넌트를 `components/` 하위에 추가
3. shadcn/ui 컴포넌트 추가: `npx shadcn@latest add [컴포넌트명]`

### JSP 페이지 추가 (webapp/)

1. `webapp/WEB-INF/jsp/{feature}/` 폴더에 JSP 파일 생성
2. CSS는 `webapp/css/`에, JS는 `webapp/resources/js/`에 추가
3. Controller에서 뷰 이름 반환 (예: `return "feature/page"`)

### 백엔드 API 추가 (dasan-stat)

1. `kr.or.dasancall.web/` 패키지에 Controller 생성
2. `kr.or.dasancall.service/` 패키지에 Service 인터페이스/구현체 작성
3. `resources/dasan/sqlmap/mappers/`에 MyBatis 매퍼 XML 생성
4. VO/DTO 클래스는 `service/` 패키지에 추가

### UI 라이브러리 참조

- **shadcn/ui**: https://ui.shadcn.com
- **KRDS (정부 표준 디자인)**: https://www.krds.go.kr, https://krds.js.org
- **Leaflet Choropleth**: https://leafletjs.com/examples/choropleth/

## 민원 데이터 분류

교통·주차, 도로·시설물, 환경·청소, 건축·주택, 복지·보건, 세무·요금, 안전·재난, 문화·관광, 교육·청소년, 민원행정, 기타

## 중요 참고사항

- **SVN 관리**: `dasancall/` 폴더는 팀 공유 - CLAUDE 관련 파일 생성 금지
- **개발 흐름**: `frontend/` 프로토타입 → `webapp/` JSP/CSS/JS로 변환
- **프레임워크**: eGovFrame 4.3.0 (대한민국 정부 표준프레임워크)
- **IDE 설정**: Lombok 플러그인 필요
