# Spring + Tomcat 프로젝트 가이드

이 문서는 Spring Boot와 전통적인 Spring + Tomcat 프로젝트의 차이점과 개발 방법을 설명합니다.

## Spring Boot vs Spring + Tomcat (이 프로젝트)

### 핵심 차이점

| 구분 | Spring Boot | Spring + Tomcat (이 프로젝트) |
|------|-------------|------------------------------|
| **설정 방식** | 자동 설정 (Auto Configuration) | XML 기반 수동 설정 |
| **내장 서버** | 내장 Tomcat (JAR 실행) | 외장 Tomcat에 WAR 배포 |
| **실행 방법** | `java -jar app.jar` | Tomcat 서버에 WAR 배포 |
| **설정 파일** | `application.yml` / `application.properties` | 여러 개의 XML 파일 |
| **의존성 관리** | Starter 패키지 | 개별 의존성 직접 관리 |
| **컴포넌트 스캔** | `@SpringBootApplication` | XML `<context:component-scan>` |

### 설정 파일 비교

**Spring Boot의 경우:**
```java
@SpringBootApplication  // 이 하나로 모든 설정 자동화
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**이 프로젝트의 경우:**
```
src/main/resources/egovframework/spring/
├── context-common.xml        # 컴포넌트 스캔, 메시지
├── context-datasource.xml    # DB 연결
├── context-mapper.xml        # MyBatis 설정
├── context-transaction.xml   # 트랜잭션 AOP
└── ...

WEB-INF/config/
└── dispatcher-servlet.xml    # Spring MVC 설정

WEB-INF/web.xml               # 웹 애플리케이션 진입점
```

---

## 애플리케이션 시작 흐름

### Spring Boot
```
main() 메서드 실행
       ↓
내장 Tomcat 자동 시작
       ↓
@SpringBootApplication → 자동 설정
```

### 이 프로젝트 (Spring + Tomcat)
```
외부 Tomcat 서버 시작
       ↓
web.xml 읽기 (진입점)
       ↓
ContextLoaderListener → context-*.xml 로드 (Service, Mapper)
       ↓
DispatcherServlet → dispatcher-servlet.xml 로드 (Controller)
```

---

## web.xml - 모든 것의 시작점

```xml
<!-- 1단계: Spring 컨텍스트 로딩 (Service, Mapper, DB 등) -->
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath*:egovframework/spring/context-*.xml</param-value>
</context-param>
<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>

<!-- 2단계: DispatcherServlet (Controller 처리) -->
<servlet>
    <servlet-name>action</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/config/.../dispatcher-servlet.xml</param-value>
    </init-param>
</servlet>

<!-- 3단계: URL 매핑 (*.do 패턴만 Spring이 처리) -->
<servlet-mapping>
    <servlet-name>action</servlet-name>
    <url-pattern>*.do</url-pattern>
</servlet-mapping>
```

**핵심 포인트**:
- **Spring Boot**: 모든 URL을 기본 처리 (`/`)
- **이 프로젝트**: `*.do` 패턴만 Spring이 처리 (나머지는 JSP/정적파일 직접 접근)

---

## 컴포넌트 스캔 분리 (매우 중요!)

```xml
<!-- context-common.xml: Service, Mapper, Repository 스캔 -->
<context:component-scan base-package="egovframework">
    <context:exclude-filter type="annotation"
        expression="org.springframework.stereotype.Controller" />
</context:component-scan>

<!-- dispatcher-servlet.xml: Controller만 스캔 -->
<context:component-scan base-package="egovframework">
    <context:include-filter type="annotation"
        expression="org.springframework.stereotype.Controller"/>
    <context:exclude-filter type="annotation"
        expression="org.springframework.stereotype.Service"/>
    <context:exclude-filter type="annotation"
        expression="org.springframework.stereotype.Repository"/>
</context:component-scan>
```

**왜 분리하는가?**
- **Root Context** (context-*.xml): 비즈니스 로직, DB 접근 (공유됨)
- **Servlet Context** (dispatcher-servlet.xml): 웹 관련 빈만 (웹 요청별 생성)

---

## 요청 처리 흐름 (전체 그림)

```
HTTP 요청: GET /egovSampleList.do
        │
        ▼
┌───────────────────────────┐
│   web.xml 필터 체인        │
│   - encodingFilter (UTF-8) │
│   - HTMLTagFilter (XSS방지)│
└───────────┬───────────────┘
            │ *.do 패턴 매칭
            ▼
┌───────────────────────────┐
│   DispatcherServlet       │
│   (Front Controller)      │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│   HandlerMapping          │
│   @GetMapping 찾기        │
└───────────┬───────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│   EgovSampleController.selectSampleList()              │
│   ├── sampleService.selectSampleList() 호출            │
│   │       │                                            │
│   │       ▼                                            │
│   │   EgovSampleServiceImpl                            │
│   │       ├── sampleDAO.selectSampleList() 호출        │
│   │       │       │                                    │
│   │       │       ▼                                    │
│   │       │   SampleMapper (MyBatis)                   │
│   │       │       │                                    │
│   │       │       ▼                                    │
│   │       │   EgovSample_Sample_SQL.xml 실행           │
│   │       │       │                                    │
│   │       │       ▼                                    │
│   │       │   Database (HSQL)                          │
│   │       │                                            │
│   │       ◀── List<SampleVO> 반환                      │
│   │                                                    │
│   ├── model.addAttribute("resultList", list)           │
│   └── return "sample/egovSampleList" (View 이름)       │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────┐
│   ViewResolver            │
│   prefix + viewName + suffix │
│   /WEB-INF/jsp/egovframework/example/sample/egovSampleList.jsp │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│   JSP 렌더링              │
│   JSTL로 resultList 출력  │
└───────────┬───────────────┘
            │
            ▼
      HTTP Response (HTML)
```

---

## 계층별 코드 패턴

### Controller (web 패키지)

```java
@Controller
@RequiredArgsConstructor  // Lombok: 생성자 주입
public class EgovSampleController {

    private final EgovSampleService sampleService;  // 인터페이스에 의존

    @GetMapping("/egovSampleList.do")  // URL 매핑
    public String selectSampleList(
            @ModelAttribute("searchVO") SampleDefaultVO searchVO,  // 폼 데이터 바인딩
            ModelMap model) throws Exception {

        List<?> sampleList = sampleService.selectSampleList(searchVO);
        model.addAttribute("resultList", sampleList);  // JSP에서 ${resultList}로 접근

        return "sample/egovSampleList";  // View 이름 반환
    }
}
```

### Service Interface (service 패키지)

```java
public interface EgovSampleService {
    List<?> selectSampleList(SampleDefaultVO searchVO) throws Exception;
    // 인터페이스 기반 설계 (DIP 원칙)
}
```

### Service Implementation (service/impl 패키지)

```java
@Service  // 빈 등록
@RequiredArgsConstructor
public class EgovSampleServiceImpl extends EgovAbstractServiceImpl
                                   implements EgovSampleService {

    private final SampleMapper sampleDAO;  // MyBatis Mapper 주입

    @Override
    public List<?> selectSampleList(SampleDefaultVO searchVO) throws Exception {
        return sampleDAO.selectSampleList(searchVO);  // Mapper 호출
    }
}
```

### MyBatis Mapper (service/impl 패키지)

```java
@Mapper  // eGovFrame MyBatis Mapper 어노테이션
public interface SampleMapper {
    List<?> selectSampleList(SampleDefaultVO searchVO) throws Exception;
    // 메서드 이름이 XML의 id와 매칭됨
}
```

### SQL Mapper XML (resources/egovframework/sqlmap/)

```xml
<mapper namespace="egovframework.example.sample.service.impl.SampleMapper">
    <!--
        namespace = Mapper 인터페이스 전체 경로
        id = Mapper 인터페이스의 메서드 이름
    -->
    <select id="selectSampleList" parameterType="searchVO" resultType="egovMap">
        SELECT ID, NAME, DESCRIPTION
        FROM SAMPLE
        WHERE 1=1
        <if test="searchKeyword != null and searchKeyword != ''">
            AND NAME LIKE '%' || #{searchKeyword} || '%'
        </if>
        LIMIT #{recordCountPerPage} OFFSET #{firstIndex}
    </select>
</mapper>
```

---

## Spring Boot와의 어노테이션 비교

| 기능 | Spring Boot | 이 프로젝트 |
|------|-------------|-------------|
| 진입점 | `@SpringBootApplication` | web.xml |
| 설정 | `@Configuration` 클래스 | XML 파일 |
| 컴포넌트 스캔 | `@ComponentScan` | `<context:component-scan>` |
| DB 설정 | `application.yml` | `context-datasource.xml` |
| 트랜잭션 | `@EnableTransactionManagement` | `context-transaction.xml` |
| MyBatis | `@MapperScan` | `context-mapper.xml` |

---

## 개발 워크플로우

**새 기능 추가 시:**

```
1. VO 생성 (service/)
   └── SampleDefaultVO 상속 (페이징 지원)

2. Service 인터페이스 (service/)
   └── 메서드 시그니처 정의

3. Service 구현체 (service/impl/)
   └── @Service 어노테이션
   └── EgovAbstractServiceImpl 상속

4. Mapper 인터페이스 (service/impl/)
   └── @Mapper 어노테이션

5. SQL XML (resources/egovframework/sqlmap/)
   └── namespace = Mapper 전체 경로
   └── id = 메서드 이름

6. Controller (web/)
   └── @Controller 어노테이션
   └── @GetMapping/@PostMapping("*.do")

7. JSP (WEB-INF/jsp/)
   └── JSTL로 데이터 출력
```

---

## 실행 방법

### Spring Boot
```bash
mvn spring-boot:run
# 또는
java -jar app.jar
```

### 이 프로젝트
```bash
# 1. WAR 빌드
mvn clean package

# 2. Tomcat 서버에 배포
#    target/dasan-spring-sample-1.0.0.war → tomcat/webapps/

# 3. Tomcat 시작
#    tomcat/bin/startup.sh (Linux) 또는 startup.bat (Windows)

# 4. 브라우저 접근
#    http://localhost:8080/dasan-spring-sample-1.0.0/egovSampleList.do
```

### Eclipse/eGovFrame IDE에서
1. 프로젝트 우클릭 → Run As → Run on Server
2. Tomcat 서버 선택
3. 자동 배포 및 실행

---

## 프로젝트 구조

```
dasan-spring-sample/
├── src/main/java/egovframework/example/
│   ├── cmmn/                          # 공통 컴포넌트
│   │   ├── web/                       # 웹 관련 공통
│   │   │   ├── EgovBindingInitializer.java
│   │   │   └── EgovImgPaginationRenderer.java
│   │   ├── EgovSampleExcepHndlr.java
│   │   └── EgovSampleOthersExcepHndlr.java
│   │
│   └── sample/                        # 샘플 모듈
│       ├── service/                   # 서비스 인터페이스 및 VO
│       │   ├── impl/                  # 서비스 구현체 및 Mapper
│       │   │   ├── EgovSampleServiceImpl.java
│       │   │   └── SampleMapper.java
│       │   ├── EgovSampleService.java
│       │   ├── SampleDefaultVO.java
│       │   └── SampleVO.java
│       └── web/                       # Controller
│           └── EgovSampleController.java
│
├── src/main/resources/
│   ├── egovframework/
│   │   ├── spring/                    # Spring 설정 XML
│   │   │   ├── context-common.xml
│   │   │   ├── context-datasource.xml
│   │   │   ├── context-mapper.xml
│   │   │   └── context-transaction.xml
│   │   ├── message/                   # i18n 메시지
│   │   └── sqlmap/example/mappers/    # MyBatis SQL XML
│   │       └── EgovSample_Sample_SQL.xml
│   └── log4j2.xml
│
├── src/main/webapp/
│   ├── WEB-INF/
│   │   ├── web.xml                    # 웹 애플리케이션 설정
│   │   ├── config/.../dispatcher-servlet.xml  # MVC 설정
│   │   └── jsp/                       # JSP 뷰
│   └── index.jsp
│
└── pom.xml                            # Maven 설정
```
