# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고할 가이드를 제공합니다.

## 프로젝트 개요

이 프로젝트는 전자정부 표준프레임워크(eGovFrame) 4.3.0을 기반으로 한 풀스택 웹 애플리케이션으로, 민원 관리 시스템("dasan-complaints")을 구현합니다. 프론트엔드와 백엔드가 분리된 아키텍처를 따릅니다:

- **백엔드**: Spring Boot 기반 REST API (`dasan-complaints/`)
- **프론트엔드**: React + Vite SPA (`egovframe-template-simple-react-main/`)

## 빌드 및 개발 명령어

### 백엔드 (dasan-complaints/)

백엔드는 Maven 기반 Spring Boot 애플리케이션입니다 (Java 1.8).

```bash
# 프로젝트 빌드
cd dasan-complaints
mvn clean install

# 애플리케이션 실행 (기본 포트: 8080)
mvn spring-boot:run

# 테스트 실행
mvn test

# JAR 패키징
mvn clean package
```

**중요**: 최종 산출물의 이름은 `sht_webapp.jar`입니다 (pom.xml의 finalName 참조).

### 프론트엔드 (egovframe-template-simple-react-main/)

프론트엔드는 Vite를 빌드 도구로 사용하며 React 18을 사용합니다.

```bash
# 의존성 설치
cd egovframe-template-simple-react-main
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

## 아키텍처

### 백엔드 아키텍처

**패키지 구조**:
- `egovframework.com` - 공통/공유 컴포넌트 및 설정
  - `egovframework.com.cmm` - 공통 유틸리티, 필터, 핸들러
  - `egovframework.com.config` - Spring 설정 클래스
  - `egovframework.com.jwt` - JWT 인증 로직
  - `egovframework.com.security` - 보안 설정
  - `egovframework.com.sns` - 소셜 로그인 연동 (네이버, 카카오)
- `egovframework.let` - 비즈니스 로직 모듈
  - `egovframework.let.cop.bbs` - 게시판 시스템
  - `egovframework.let.cop.com` - 게시판 사용 관리
  - `egovframework.let.cop.smt.sim` - 일정 관리
  - `egovframework.let.main` - 메인 페이지 로직
  - `egovframework.let.uat.esm` - 사이트 관리자
  - `egovframework.let.uat.uia` - 사용자 인증
  - `egovframework.let.uss.umt` - 회원 관리
  - `egovframework.let.utl` - 유틸리티

**계층형 아키텍처**:
- **Controller** (`web/` 패키지) - REST API 엔드포인트 (Spring `@RestController`)
- **Service** (`service/` 패키지) - 비즈니스 로직 인터페이스 및 구현체
- **DAO** (MyBatis) - `resources/egovframework/mapper/`의 XML 매퍼를 통한 데이터베이스 접근

**주요 기술 스택**:
- Spring Boot 2.x (eGovFrame Boot Starter Parent 4.3.0 사용)
- MyBatis를 통한 SQL 매핑 (MySQL, Oracle, HSQL, Altibase, Tibero, Cubrid 지원)
- JWT 인증 (io.jsonwebtoken:jjwt:0.9.1)
- Springdoc OpenAPI (Swagger UI) - `/swagger-ui.html`에서 제공
- Lombok을 통한 보일러플레이트 코드 감소

**데이터베이스 설정**:
- `application.properties`의 `Globals.DbType`으로 데이터베이스 타입 제어 (기본값: hsql)
- 각 DB 벤더별 SQL 스크립트가 `DATABASE/` 디렉토리에 제공됨
- MyBatis 매퍼 XML이 데이터베이스 타입별로 구성됨 (예: `*_SQL_mysql.xml`, `*_SQL_oracle.xml`)

### 프론트엔드 아키텍처

**디렉토리 구조**:
- `src/pages/` - 기능별로 구성된 페이지 컴포넌트
  - `about/` - 사이트 소개 페이지
  - `admin/` - 관리자 페이지 (게시판, 일정, 회원관리)
  - `inform/` - 알림 페이지 (공지사항, 갤러리)
  - `intro/` - 소개/안내 페이지
  - `login/` - 로그인 및 회원가입
  - `main/` - 메인 랜딩 페이지
  - `support/` - 지원 페이지
- `src/components/` - 재사용 가능한 UI 컴포넌트 (Egov 접두사)
- `src/routes/` - React Router 설정
- `src/api/` - API 클라이언트 함수
- `src/config/` - 설정 파일
- `src/hooks/` - 커스텀 React 훅
- `src/utils/` - 유틸리티 함수

**라우팅**: 모든 라우트는 `src/routes/index.jsx`에서 React Router v6를 사용하여 설정됩니다.

**API 통신**: 백엔드 URL은 `.env.development`의 `VITE_APP_EGOV_CONTEXT_URL`에서 설정됩니다.

**빌드 설정**: 빠른 빌드를 위해 Vite와 SWC를 사용합니다. 경로 별칭 `@` → `/src`가 설정되어 있습니다.

## 설정 파일

### 백엔드 설정

**주요 설정 파일**: `dasan-complaints/src/main/resources/application.properties`

설정해야 할 주요 항목:
- `Globals.DbType` - 데이터베이스 타입 (hsql/mysql/oracle/altibase/tibero/cubrid)
- `Globals.mysql.*` - MySQL 연결 정보
- `Globals.fileStorePath` - 파일 업로드 디렉토리 (기본값: `./files`)
- `Globals.Allow.Origin` - CORS 허용 오리진 (기본값: `http://localhost:3000`)
- `Globals.jwt.secret` - JWT 서명 시크릿 (기본값 "egovframe"에서 반드시 변경 필요)
- `Globals.crypto.algoritm` - 암호화 키 (기본값 "egovframe"에서 반드시 변경 필요)
- `Sns.naver.*` / `Sns.kakao.*` - 소셜 로그인 인증 정보
- `server.port` - 서버 포트 (기본값: 8080)
- `server.servlet.context-path` - 컨텍스트 경로 (기본값: `/`)

### 프론트엔드 설정

**개발 환경**: `.env.development`
**프로덕션 환경**: `.env.production`

주요 설정 항목:
- `VITE_APP_EGOV_CONTEXT_URL` - 백엔드 API URL (예: `localhost:8080`)
- `VITE_APP_NAVER_CLIENTID` / `VITE_APP_NAVER_CALLBACKURL` - 네이버 로그인
- `VITE_APP_KAKAO_CLIENTID` / `VITE_APP_KAKAO_CALLBACKURL` - 카카오 로그인

## 데이터베이스 설정

SQL 스크립트는 `dasan-complaints/DATABASE/`에 있습니다:
- DDL 파일: `all_sht_ddl_{database}.sql`
- 초기 데이터: `all_sht_data_{database}.sql`
- 커스텀 스키마: `dasan_ddl.sql`

백엔드를 실행하기 전에 사용하는 데이터베이스에 맞는 DDL과 데이터 스크립트를 실행하세요.

## 인증

시스템은 JWT 기반 인증을 사용합니다:
1. `/api/login` (또는 소셜 로그인 엔드포인트)를 통해 로그인
2. 응답으로 JWT 토큰 반환
3. 토큰을 클라이언트 측에 저장하고 이후 요청에 포함
4. 기본 관리자 계정: `admin` / `1`

소셜 로그인은 다음에서 등록이 필요합니다:
- [네이버 개발자 센터](https://developers.naver.com/main/)
- [카카오 개발자 센터](https://developers.kakao.com/)

## API 문서

Swagger UI는 백엔드 실행 시 다음 주소에서 확인 가능합니다: `http://localhost:8080/swagger-ui.html`

## 일반적인 개발 패턴

### 백엔드 API 엔드포인트 추가하기

1. 적절한 `web/` 패키지에 REST 컨트롤러 생성 (`ApiController` 확장)
2. `service/` 패키지에 서비스 인터페이스와 구현체 작성
3. `resources/egovframework/mapper/`에 각 데이터베이스 타입별 MyBatis 매퍼 XML 생성
4. 필요시 `service/` 패키지에 VO/DTO 클래스 추가

### 프론트엔드 페이지 추가하기

1. `src/pages/{feature}/`에 페이지 컴포넌트 생성
2. `src/routes/index.jsx`에 라우트 등록
3. `src/api/`에 API 클라이언트 함수 추가
4. 필요시 `EgovHeader.jsx` 또는 `EgovLeftNav.jsx`에서 네비게이션 업데이트

### 파일 업로드

백엔드는 `EgovFileMngApiController`를 통해 파일 업로드를 제공합니다. 파일은 `Globals.fileStorePath`에 설정된 경로에 저장됩니다.

허용되는 확장자는 `Globals.fileUpload.Extensions`에서 설정합니다 (기본값: `.gif.jpg.jpeg.png.xls.xlsx`)

## 테스트

**백엔드**: `src/test/`의 JUnit 테스트. Selenium 기반 UI 테스트 포함.

**프론트엔드**: Vitest를 사용한 유닛 테스트. 테스트 파일: `*.test.js` 또는 `*.test.jsx`

## 중요 참고사항

- 이 프로젝트는 대한민국 정부 표준을 기반으로 하는 eGovFrame 4.3.0 프로젝트입니다
- 백엔드는 데이터베이스별 SQL을 통해 여러 데이터베이스 벤더를 지원합니다
- 프론트엔드 개발을 위해 CORS가 활성화되어 있습니다 (`application.properties`에서 설정)
- 소셜 로그인 기능은 외부 API 인증 정보가 필요합니다
- 보안 키(`Globals.jwt.secret`, `Globals.crypto.algoritm`)는 프로덕션에서 반드시 기본값에서 변경해야 합니다
- 프로젝트는 Lombok을 사용하므로 IDE에 Lombok 플러그인이 설치되어 있어야 합니다
