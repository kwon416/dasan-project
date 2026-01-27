# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

eGovFrame 4.3.0 기반 Spring MVC 샘플 프로젝트입니다. 계층형 아키텍처(Controller-Service-Mapper)와 MyBatis SQL 매핑을 사용합니다.

- **Java 버전**: 1.8
- **프레임워크**: Spring 5.3.37 + eGovFrame RTE 4.3.0
- **빌드**: Maven
- **패키징**: WAR
- **데이터베이스**: HSQL (기본/테스트), MySQL, Oracle 지원

## 빌드 및 실행 명령어

```bash
# 프로젝트 빌드
mvn clean install

# 테스트 실행
mvn test

# 단일 테스트 실행
mvn test -Dtest=ClassName#methodName

# WAR 패키징
mvn clean package
```

빌드 결과물: `target/dasan-spring-sample-1.0.0.war`

## 아키텍처

### 계층 구조

```
Controller (web/)
    ↓ @Autowired
Service Interface (service/)
    ↓ implements
ServiceImpl (service/impl/) extends EgovAbstractServiceImpl
    ↓ @Mapper
MyBatis Mapper Interface (service/impl/)
    ↓ XML 매핑
SQL Mapper XML (resources/egovframework/sqlmap/)
```

### 주요 패키지

| 패키지 | 역할 |
|--------|------|
| `egovframework.example.sample.web` | REST Controller (*.do 매핑) |
| `egovframework.example.sample.service` | Service 인터페이스, VO 클래스 |
| `egovframework.example.sample.service.impl` | Service 구현체, MyBatis Mapper |
| `egovframework.example.cmmn` | 공통 유틸리티, 예외 핸들러 |

### Spring 설정 파일 (resources/egovframework/spring/)

| 파일 | 용도 |
|------|------|
| `context-common.xml` | 컴포넌트 스캔, 메시지 소스 |
| `context-datasource.xml` | 데이터소스 설정 (DB 타입 변경 시 수정) |
| `context-mapper.xml` | MyBatis SqlSessionFactory 설정 |
| `context-transaction.xml` | 트랜잭션 AOP 설정 |

### URL 매핑

모든 요청은 `*.do` 패턴으로 매핑됩니다 (`web.xml` 참조).

## 새 기능 추가 패턴

### 1. VO 클래스 생성

```java
// service/NewVO.java
public class NewVO extends SampleDefaultVO {
    private String field1;
    private String field2;
    // Lombok @Data 사용 권장
}
```

### 2. Service 인터페이스 및 구현체

```java
// service/NewService.java
public interface NewService {
    void insertNew(NewVO vo) throws Exception;
}

// service/impl/NewServiceImpl.java
@Service
public class NewServiceImpl extends EgovAbstractServiceImpl implements NewService {
    @Resource(name = "newMapper")
    private NewMapper newMapper;
}
```

### 3. MyBatis Mapper

```java
// service/impl/NewMapper.java
@Mapper("newMapper")
public interface NewMapper {
    void insertNew(NewVO vo);
}
```

```xml
<!-- resources/egovframework/sqlmap/example/mappers/New_SQL.xml -->
<mapper namespace="egovframework.example.sample.service.impl.NewMapper">
    <insert id="insertNew">
        INSERT INTO NEW_TABLE ...
    </insert>
</mapper>
```

### 4. Controller

```java
// web/NewController.java
@Controller
@RequiredArgsConstructor
public class NewController {
    private final NewService newService;

    @GetMapping("/newList.do")
    public String list(Model model) { ... }
}
```

## 트랜잭션

`context-transaction.xml`에서 AOP로 관리됩니다:
- **포인트컷**: `egovframework.example.sample..impl.*Impl.*`
- **롤백 정책**: 모든 Exception에서 롤백

## 데이터베이스 변경

`context-datasource.xml`에서 데이터소스를 변경합니다. MySQL/Oracle 설정이 주석으로 제공되어 있습니다.

SQL 스크립트 위치: `src/main/resources/db/sampledb.sql`

## 테스트

- **프레임워크**: JUnit 5
- **UI 테스트**: Selenium 4.13.0
- **병렬 실행**: 2 스레드 (`maven-surefire-plugin`)

테스트 파일 위치: `src/test/java/` (파일명 패턴: `*Test.java`)
