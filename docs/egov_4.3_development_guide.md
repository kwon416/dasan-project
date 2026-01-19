# 전자정부프레임워크 4.3 Spring Boot 개발 표준 가이드

**작성일**: 2026년 1월 18일  
**프레임워크**: eGovFramework 4.3.0  
**기술 스택**: Spring Boot 2.7.18, Spring 5.3.37, MyBatis 3.5.x, JDK 8~17

---

## 📋 목차
1. [기술 환경 사양](#기술-환경-사양)
2. [필수 아키텍처 구조](#필수-아키텍처-구조)
3. [패키지 구조 및 네이밍 규칙](#패키지-구조-및-네이밍-규칙)
4. [코딩 스타일 가이드](#코딩-스타일-가이드)
5. [Bean 등록 및 의존성 주입](#bean-등록-및-의존성-주입)
6. [Controller 작성 규칙](#controller-작성-규칙)
7. [Service 작성 규칙](#service-작성-규칙)
8. [DAO/Repository 작성 규칙](#daorepository-작성-규칙)
9. [MyBatis 설정 및 SQL 매핑](#mybatis-설정-및-sql-매핑)
10. [공통 컴포넌트 활용](#공통-컴포넌트-활용)
11. [보안 및 감리 대응](#보안-및-감리-대응)
12. [개발 환경 설정](#개발-환경-설정)

---

## 기술 환경 사양

### 개발 환경
| 항목 | 사양 | 비고 |
|------|------|------|
| IDE | Eclipse 4.31.0 (2024-03) 이상 | eGovFrame 전용 플러그인 필요 |
| JDK | **JDK 17 이상** | 개발 환경 필수 |
| 빌드 도구 | Maven 3.6.0 이상 | Maven 기반 프로젝트 구성 |
| 서버 | Tomcat 9.0 이상 | Servlet 3.1 이상 지원 필요 |

### 실행 환경
| 항목 | 사양 | 비고 |
|------|------|------|
| JDK | **JDK 8 이상** (권장: JDK 11~17) | 운영 환경 |
| Spring | 5.3.37 | Spring Boot 2.7.18 기반 |
| Spring Boot | 2.7.18 | Spring Boot 호환성 강화 |
| MyBatis | 3.5.10 이상 | SQL 매핑 프레임워크 |
| Servlet | 3.1 이상 | JavaEE 7 이상 필수 |

---

## 필수 아키텍처 구조

전자정부프레임워크는 **5-계층 MVC 아키텍처**를 강제합니다.

### 계층별 구조

```
┌─────────────────────────────────────┐
│   Presentation Layer (View)         │
│   (JSP, HTML, JSON Response)        │
└─────────────────────────────────────┘
            ↓ HTTP Request ↑
┌─────────────────────────────────────┐
│   Controller Layer                  │
│   (@Controller, @RestController)    │
│   - 요청 수신 및 유효성 검사        │
│   - Service 호출                    │
│   - 응답 반환                       │
└─────────────────────────────────────┘
            ↓ Method Call ↑
┌─────────────────────────────────────┐
│   Service Layer                     │
│   (@Service, interface + Impl)      │
│   - 비즈니스 로직 처리              │
│   - 트랜잭션 관리                   │
│   - 데이터 가공                     │
└─────────────────────────────────────┘
            ↓ Method Call ↑
┌─────────────────────────────────────┐
│   DAO/Repository Layer              │
│   (@Repository, Mapper Interface)   │
│   - 데이터베이스 접근               │
│   - SQL 실행 (MyBatis)              │
│   - VO/DTO 반환                     │
└─────────────────────────────────────┘
            ↓ JDBC ↑
┌─────────────────────────────────────┐
│   Database                          │
│   (Oracle, MySQL, PostgreSQL)       │
└─────────────────────────────────────┘
```

### **핵심 규칙 (필수)**

1. **Controller는 Service를 호출해야 하고, DAO를 직접 호출할 수 없음**
   - ❌ DAO를 직접 호출하는 경우: 전자정부프레임워크 위반
   - ✅ Service 인터페이스를 통한 호출만 허용

2. **각 계층은 명확히 분리되어야 함**
   - 비즈니스 로직은 Service에만 존재
   - 데이터 접근 로직은 DAO에만 존재
   - Controller는 흐름 제어만 담당

3. **Service 계층은 트랜잭션 경계**
   - `@Transactional` 적용 위치
   - 여러 DAO 호출 시 원자성 보장

---

## 패키지 구조 및 네이밍 규칙

### 표준 패키지 구조

```
com.example.project/
├── config/                          # Spring Boot 설정 클래스
│   ├── AppConfig.java
│   ├── SecurityConfig.java
│   ├── DatabaseConfig.java
│   └── WebConfig.java
│
├── web/
│   ├── board/
│   │   ├── controller/              # Controller 계층
│   │   │   └── BoardController.java
│   │   ├── service/                 # Service 계층
│   │   │   ├── BoardService.java    # 인터페이스
│   │   │   └── BoardServiceImpl.java # 구현체
│   │   └── dao/                     # DAO/Repository 계층
│   │       ├── BoardDAO.java        # (iBatis 방식)
│   │       ├── BoardMapper.java     # (MyBatis Mapper 방식)
│   │       └── BoardRepository.java # (Spring Data JPA 방식)
│   │
│   └── user/
│       ├── controller/
│       │   └── UserController.java
│       ├── service/
│       │   ├── UserService.java
│       │   └── UserServiceImpl.java
│       └── dao/
│           └── UserMapper.java
│
├── common/
│   ├── service/
│   │   ├── BaseService.java         # 공통 서비스
│   │   └── BaseServiceImpl.java
│   ├── dao/
│   │   └── BaseDAO.java             # 공통 DAO
│   └── util/
│       ├── StringUtil.java
│       ├── DateUtil.java
│       └── CryptUtil.java           # 암호화 유틸
│
├── vo/                              # Value Object (DTO)
│   ├── BoardVO.java
│   └── UserVO.java
│
├── exception/
│   ├── BusinessException.java
│   └── DataAccessException.java
│
├── mapper/                          # MyBatis XML 매핑 파일
│   ├── BoardMapper.xml
│   └── UserMapper.xml
│
├── properties/
│   └── message.properties           # 메시지 외부화
│
└── Application.java                 # Spring Boot Main Class
```

### 네이밍 규칙 (MUST FOLLOW)

| 대상 | 규칙 | 예시 | 비고 |
|------|------|------|------|
| **패키지** | 소문자, 점(.) 구분 | `com.example.web.board` | Java convention |
| **Controller** | PascalCase + `Controller` | `BoardController` | `@Controller`, `@RestController` |
| **Service Interface** | PascalCase | `BoardService` | 인터페이스 |
| **Service Impl** | Interface명 + `Impl` | `BoardServiceImpl` | `@Service` 적용 |
| **DAO/Mapper** | 도메인명 + `DAO` 또는 `Mapper` | `BoardDAO`, `BoardMapper` | `@Repository` 또는 `@Mapper` |
| **VO/DTO** | 도메인명 + `VO` 또는 `DTO` | `BoardVO`, `BoardDTO` | 데이터 전달 객체 |
| **메서드 (public)** | camelCase | `selectBoardList()` | CRUD 기반 |
| **메서드 (private)** | camelCase | `validateBoardData()` | 언더스코어 사용 금지 |
| **상수** | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` | `static final` |
| **변수** | camelCase | `boardId`, `isValid` | 약자 피하기 |
| **boolean 변수** | `is`, `has`, `can` prefix | `isActive`, `hasError` | 명확한 의미 |

### CRUD 메서드 네이밍 규칙 (표준)

```java
// DAO/Mapper
select[Entity]() / select[Entity]ById() / select[Entity]List()
insert[Entity]()
update[Entity]()
delete[Entity]()

// 예시
BoardDAO {
    selectBoardList()           // 목록 조회
    selectBoardById(int id)     // 상세 조회
    selectBoardByCondition()    // 조건 조회
    insertBoard(BoardVO board)  // 생성
    updateBoard(BoardVO board)  // 수정
    deleteBoard(int id)         // 삭제
    countBoard()                // 개수 카운트
}

// Service (선택적 - 비즈니스 맥락)
BoardService {
    getAllBoards()              // 전체 목록
    getBoardDetail(int id)      // 상세 조회
    createBoard(BoardVO board)  // 생성
    modifyBoard(BoardVO board)  // 수정
    removeBoard(int id)         // 삭제
}
```

---

## 코딩 스타일 가이드

### 1. 들여쓰기 및 포맷팅

```java
// ✅ 올바른 방식
// 들여쓰기: 공백 4칸 (TAB 사용 금지)
public class BoardController {
    private static final Logger LOGGER = LoggerFactory.getLogger(BoardController.class);
    
    private BoardService boardService;
    
    @GetMapping("/board")
    public String getBoard(Model model) {
        List<BoardVO> list = boardService.getBoardList();
        model.addAttribute("list", list);
        return "board/list";
    }
}
```

**규칙**:
- 들여쓰기는 **공백 4칸** (절대 TAB 사용 금지)
- 한 줄 최대 길이: **100자**
- 클래스와 메서드 사이: **1줄 공백**
- 메서드 내부 로직 사이: **1~2줄 공백**으로 논리적 그룹화

### 2. 주석 작성 규칙

```java
/**
 * 게시판 목록을 조회합니다.
 * 
 * @param pageNum 페이지 번호
 * @param keyword 검색 키워드
 * @return 게시판 목록
 * @throws BusinessException 비즈니스 로직 오류
 */
@GetMapping("/list")
public List<BoardVO> getBoardList(@RequestParam int pageNum, 
                                  @RequestParam(required = false) String keyword) {
    // 유효성 검사
    if (pageNum < 1) {
        pageNum = 1;
    }
    
    // Service 호출
    return boardService.getBoardList(pageNum, keyword);
}
```

**규칙**:
- 클래스, public 메서드는 **JavaDoc 필수**
- 파라미터, 반환값, 예외는 `@param`, `@return`, `@throws` 사용
- 구현부 복잡한 로직은 **단일 줄 주석** 추가

### 3. NULL 처리

```java
// ✅ 올바른 방식
public BoardVO getBoardDetail(int boardId) {
    BoardVO board = boardDAO.selectBoardById(boardId);
    
    // null 체크 (Optional 또는 null check)
    if (board == null) {
        throw new BusinessException("게시판을 찾을 수 없습니다.");
    }
    
    return board;
}
```

---

## Bean 등록 및 의존성 주입

### Spring Boot 기반 Bean 등록

```java
// ✅ Annotation 기반 Bean 등록 (권장)
@Service("boardService")
public class BoardServiceImpl implements BoardService {
    
    private final BoardDAO boardDAO;
    
    // 생성자 주입 (권장)
    public BoardServiceImpl(BoardDAO boardDAO) {
        this.boardDAO = boardDAO;
    }
}

@Repository("boardDAO")
public class BoardDAO extends EgovAbstractDAO {
    
    private static final String NAMESPACE = "board.";
    
    public List<BoardVO> selectBoardList() {
        return (List<BoardVO>) list(NAMESPACE + "selectBoardList");
    }
}
```

**규칙**:
- **생성자 주입** 필수 (테스트 용이, 불변성)
- 필드 주입은 금지 (테스트 어려움)
- `@Qualifier`로 구현체 명시

### 트랜잭션 관리

```java
// ✅ Service 계층에서 @Transactional 선언
@Service
@Transactional(readOnly = false)
public class BoardServiceImpl implements BoardService {
    
    @Override
    @Transactional(readOnly = true)
    public BoardVO getBoardDetail(int boardId) {
        return boardDAO.selectBoardById(boardId);
    }
    
    @Override
    @Transactional(readOnly = false)
    public int createBoard(BoardVO board) {
        return boardDAO.insertBoard(board);
    }
}
```

**규칙**:
- `@Transactional`은 **Service 계층에만** 적용
- 쓰기 작업: `readOnly = false`
- 읽기 작업: `readOnly = true`

---

## Controller 작성 규칙

```java
/**
 * 게시판 관리 컨트롤러
 */
@RestController
@RequestMapping("/api/board")
@Slf4j
public class BoardController {
    
    private final BoardService boardService;
    
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }
    
    /**
     * 게시판 목록을 조회합니다.
     */
    @GetMapping
    public ResponseEntity<List<BoardVO>> getBoardList(
        @RequestParam(defaultValue = "1") int pageNum,
        @RequestParam(defaultValue = "10") int pageSize) {
        
        List<BoardVO> list = boardService.getBoardList(pageNum, pageSize);
        return ResponseEntity.ok(list);
    }
    
    /**
     * 게시판 상세 정보를 조회합니다.
     */
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardVO> getBoardDetail(@PathVariable int boardId) {
        BoardVO board = boardService.getBoardDetail(boardId);
        if (board == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(board);
    }
    
    /**
     * 새로운 게시판을 생성합니다.
     */
    @PostMapping
    public ResponseEntity<Integer> createBoard(@RequestBody @Valid BoardVO board) {
        int boardId = boardService.createBoard(board);
        return ResponseEntity.status(HttpStatus.CREATED).body(boardId);
    }
}
```

**규칙**:
- `@RestController` 또는 `@Controller` 필수
- 파라미터 유효성 검사 (`@Valid`)
- HTTP 상태 코드 명시적 반환

---

## Service 작성 규칙

```java
public interface BoardService {
    List<BoardVO> getBoardList(int pageNum, int pageSize);
    BoardVO getBoardDetail(int boardId);
    int createBoard(BoardVO board);
    void updateBoard(BoardVO board);
    void deleteBoard(int boardId);
}

@Service("boardService")
@Transactional(readOnly = false)
@Slf4j
public class BoardServiceImpl implements BoardService {
    
    private final BoardDAO boardDAO;
    
    public BoardServiceImpl(BoardDAO boardDAO) {
        this.boardDAO = boardDAO;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BoardVO> getBoardList(int pageNum, int pageSize) {
        if (pageNum < 1) {
            pageNum = 1;
        }
        int offset = (pageNum - 1) * pageSize;
        return boardDAO.selectBoardList(offset, pageSize);
    }
    
    @Override
    @Transactional(readOnly = false)
    public int createBoard(BoardVO board) {
        if (board == null || board.getTitle() == null) {
            throw new BusinessException("필수 정보가 없습니다.");
        }
        board.setCreatedDate(LocalDateTime.now());
        return boardDAO.insertBoard(board);
    }
}
```

**규칙**:
- **인터페이스와 구현체 분리** (필수)
- `@Service` 어노테이션 사용
- `@Transactional`은 **Service 계층에만** 적용
- 파라미터 유효성 검사
- 비즈니스 예외 처리

---

## DAO/Repository 작성 규칙

### MyBatis Mapper Interface (권장)

```java
@Mapper
public interface BoardMapper {
    
    @Select("SELECT * FROM TB_BOARD LIMIT #{offset}, #{pageSize}")
    List<BoardVO> selectBoardList(
        @Param("offset") int offset,
        @Param("pageSize") int pageSize);
    
    @Select("SELECT * FROM TB_BOARD WHERE board_id = #{boardId}")
    BoardVO selectBoardById(@Param("boardId") int boardId);
    
    @Insert("INSERT INTO TB_BOARD (title, content, author, created_date) " +
            "VALUES (#{title}, #{content}, #{author}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "boardId")
    int insertBoard(BoardVO board);
    
    @Update("UPDATE TB_BOARD SET title = #{title}, content = #{content} WHERE board_id = #{boardId}")
    int updateBoard(BoardVO board);
    
    @Delete("DELETE FROM TB_BOARD WHERE board_id = #{boardId}")
    int deleteBoard(@Param("boardId") int boardId);
}
```

**규칙**:
- `@Mapper` 어노테이션 필수
- `@Param` 명시 (파라미터 명확화)
- SQL 반환값 명시 (resultType, resultMap)

---

## MyBatis XML 매핑 (권장 방식)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.web.board.dao.BoardMapper">
    
    <resultMap id="boardResultMap" type="BoardVO">
        <id column="board_id" property="boardId" />
        <result column="title" property="title" />
        <result column="content" property="content" />
        <result column="created_date" property="createdDate" />
    </resultMap>
    
    <select id="selectBoardList" resultMap="boardResultMap">
        <![CDATA[
            SELECT * FROM TB_BOARD
            WHERE 1=1
        ]]>
        <if test="keyword != null">
            AND title LIKE CONCAT('%', #{keyword}, '%')
        </if>
        LIMIT #{offset}, #{pageSize}
    </select>
    
    <select id="selectBoardById" parameterType="int" resultMap="boardResultMap">
        SELECT * FROM TB_BOARD WHERE board_id = #{boardId}
    </select>
    
    <insert id="insertBoard" parameterType="BoardVO" useGeneratedKeys="true" keyProperty="boardId">
        INSERT INTO TB_BOARD (title, content, author, created_date)
        VALUES (#{title}, #{content}, #{author}, NOW())
    </insert>
    
</mapper>
```

---

## 공통 컴포넌트 활용

### ID 생성 (EgovIdGnrService)

```java
@Service
public class BoardServiceImpl implements BoardService {
    
    private final EgovIdGnrService idGnrService;
    
    public int createBoard(BoardVO board) {
        String boardId = idGnrService.getNextStringId("BOARD");
        board.setBoardId(Integer.parseInt(boardId));
        return boardDAO.insertBoard(board);
    }
}
```

### 로깅 (SLF4J + Logback)

```java
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BoardServiceImpl implements BoardService {
    
    public void createBoard(BoardVO board) {
        log.info("Board creation started. Title: {}", board.getTitle());
        try {
            boardDAO.insertBoard(board);
            log.info("Board created successfully");
        } catch (Exception e) {
            log.error("Board creation failed", e);
            throw new DataAccessException("게시판 생성에 실패했습니다.");
        }
    }
}
```

---

## 보안 및 감리 대응

### 1. XSS (Cross-Site Scripting) 방지

```java
import org.owasp.encoder.Encode;

@RestController
public class BoardController {
    
    @GetMapping("/board/{id}")
    public ResponseEntity<BoardVO> getBoard(@PathVariable int id) {
        BoardVO board = boardService.getBoardDetail(id);
        board.setTitle(Encode.forHtml(board.getTitle()));
        return ResponseEntity.ok(board);
    }
}
```

### 2. SQL Injection 방지

```java
// ✅ MyBatis PreparedStatement (자동)
<select id="selectByTitle" parameterType="String">
    SELECT * FROM TB_BOARD WHERE title = #{title}
</select>

// ❌ 피해야 할 방식
String query = "SELECT * FROM TB_BOARD WHERE title = '" + title + "'";
```

### 3. CSRF 방지

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        return http.build();
    }
}
```

---

## 개발 환경 설정

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/egov_db?characterEncoding=UTF-8&serverTimezone=UTC
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  mvc:
    view:
      prefix: /WEB-INF/jsp/
      suffix: .jsp
  
  servlet:
    multipart:
      max-file-size: 10MB

mybatis:
  mapper-locations: classpath:mapper/**/*.xml
  type-aliases-package: com.example.web
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: true

logging:
  level:
    root: INFO
    egovframework: DEBUG
    com.example: DEBUG

server:
  port: 8080
```

---

## 📌 필수 규칙 요약

| 항목 | 규칙 | 중요도 |
|------|------|--------|
| **아키텍처** | 5계층 MVC 구조 준수 | 🔴 필수 |
| **Controller** | Service만 호출, DAO 직접 호출 금지 | 🔴 필수 |
| **Service** | 인터페이스+구현체, @Transactional | 🔴 필수 |
| **DAO** | @Mapper, SQL은 XML | 🔴 필수 |
| **들여쓰기** | 공백 4칸 (TAB 금지) | 🟡 중요 |
| **NULL 처리** | null 체크 필수 | 🔴 필수 |
| **생성자 주입** | @Autowired 필드 주입 금지 | 🔴 필수 |
| **XSS 방지** | HTML 인코딩 | 🔴 필수 |
| **SQL Injection** | PreparedStatement (MyBatis) | 🔴 필수 |
| **로깅** | SLF4J/Logback | 🟡 중요 |

---

**마지막 수정**: 2026-01-18  
**버전**: 1.0
