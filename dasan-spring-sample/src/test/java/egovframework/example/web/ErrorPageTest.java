package egovframework.example.web;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 에러 페이지 KRDS 스타일 테스트
 *
 * KRDS 공식 에러 페이지 구조:
 * 1. .g-wrap.err - 에러 페이지 래퍼
 * 2. .heading-error - 에러 제목
 * 3. .info-txt.ac - 가운데 정렬된 안내 텍스트
 * 4. .pc-line - PC에서 줄바꿈
 * 5. 메인으로 돌아가기 버튼 (KRDS 버튼 스타일)
 */
@DisplayName("에러 페이지 KRDS 스타일 테스트")
class ErrorPageTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private static final String BASE_URL = "http://localhost:8080";

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--window-size=1280,800");
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        // 존재하지 않는 페이지로 접근하여 에러 페이지 테스트
        driver.get(BASE_URL + "/nonexistent-page-for-error-test.do");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Nested
    @DisplayName("1. KRDS 에러 페이지 구조 테스트")
    class ErrorPageStructureTests {

        @Test
        @DisplayName("에러 페이지에 g-wrap.err 래퍼가 존재해야 한다")
        void testErrorWrapperExists() {
            // Given/When
            WebElement errorWrapper = driver.findElement(By.cssSelector(".g-wrap.err"));

            // Then
            assertNotNull(errorWrapper, "g-wrap.err 래퍼가 존재해야 합니다");
        }

        @Test
        @DisplayName("에러 페이지에 heading-error 클래스의 제목이 있어야 한다")
        void testHeadingErrorExists() {
            // Given/When
            WebElement heading = driver.findElement(By.cssSelector(".heading-error"));

            // Then
            assertNotNull(heading, "heading-error 클래스의 제목이 존재해야 합니다");
            assertFalse(heading.getText().isEmpty(), "제목 텍스트가 비어있지 않아야 합니다");
        }

        @Test
        @DisplayName("에러 페이지에 info-txt 클래스의 안내 텍스트가 있어야 한다")
        void testInfoTextExists() {
            // Given/When
            WebElement infoText = driver.findElement(By.cssSelector(".info-txt"));

            // Then
            assertNotNull(infoText, "info-txt 클래스의 안내 텍스트가 존재해야 합니다");
            assertTrue(infoText.getAttribute("class").contains("ac"),
                "info-txt는 ac(가운데 정렬) 클래스를 포함해야 합니다");
        }

        @Test
        @DisplayName("에러 안내 텍스트에 pc-line 클래스가 사용되어야 한다")
        void testPcLineClassUsed() {
            // Given/When
            java.util.List<WebElement> pcLines = driver.findElements(By.cssSelector(".pc-line"));

            // Then
            assertFalse(pcLines.isEmpty(), "pc-line 클래스가 사용되어야 합니다");
        }
    }

    @Nested
    @DisplayName("2. 네비게이션 버튼 테스트")
    class NavigationButtonTests {

        @Test
        @DisplayName("메인으로 돌아가기 버튼이 존재해야 한다")
        void testHomeButtonExists() {
            // Given/When
            WebElement homeButton = driver.findElement(By.cssSelector(".g-wrap.err a.krds-btn"));

            // Then
            assertNotNull(homeButton, "메인으로 돌아가기 버튼이 존재해야 합니다");
        }

        @Test
        @DisplayName("메인 버튼이 KRDS 버튼 스타일을 사용해야 한다")
        void testHomeButtonUsesKrdsStyle() {
            // Given/When
            WebElement homeButton = driver.findElement(By.cssSelector(".g-wrap.err a.krds-btn"));
            String buttonClass = homeButton.getAttribute("class");

            // Then
            assertTrue(buttonClass.contains("krds-btn"), "KRDS 버튼 클래스를 사용해야 합니다");
            assertTrue(buttonClass.contains("primary") || buttonClass.contains("solid"),
                "primary 또는 solid 스타일을 사용해야 합니다");
        }

        @Test
        @DisplayName("메인 버튼 클릭 시 메인 페이지로 이동해야 한다")
        void testHomeButtonNavigatesToMain() {
            // Given
            WebElement homeButton = driver.findElement(By.cssSelector(".g-wrap.err a.krds-btn"));
            String href = homeButton.getAttribute("href");

            // Then
            assertTrue(href.contains("main.do"), "버튼이 main.do로 연결되어야 합니다");
        }
    }

    @Nested
    @DisplayName("3. 접근성 테스트")
    class AccessibilityTests {

        @Test
        @DisplayName("에러 페이지에 lang=ko 속성이 설정되어야 한다")
        void testLangAttribute() {
            // Given/When
            WebElement html = driver.findElement(By.tagName("html"));
            String lang = html.getAttribute("lang");

            // Then
            assertEquals("ko", lang, "html lang 속성이 ko로 설정되어야 합니다");
        }

        @Test
        @DisplayName("에러 제목이 h1 태그를 사용해야 한다")
        void testHeadingIsH1() {
            // Given/When
            WebElement heading = driver.findElement(By.cssSelector(".heading-error"));

            // Then
            assertEquals("h1", heading.getTagName().toLowerCase(),
                "에러 제목은 h1 태그를 사용해야 합니다");
        }

        @Test
        @DisplayName("페이지에 viewport meta 태그가 설정되어야 한다")
        void testViewportMetaTag() {
            // Given/When
            WebElement viewportMeta = driver.findElement(
                By.cssSelector("meta[name='viewport']"));

            // Then
            assertNotNull(viewportMeta, "viewport meta 태그가 존재해야 합니다");
            String content = viewportMeta.getAttribute("content");
            assertTrue(content.contains("width=device-width"),
                "viewport가 반응형으로 설정되어야 합니다");
        }
    }

    @Nested
    @DisplayName("4. KRDS CSS 연결 테스트")
    class KrdsCssConnectionTests {

        @Test
        @DisplayName("KRDS CSS 파일이 연결되어야 한다")
        void testKrdsCssLinked() {
            // Given/When
            java.util.List<WebElement> links = driver.findElements(
                By.cssSelector("link[rel='stylesheet']"));

            // Then
            boolean hasKrdsCss = links.stream()
                .anyMatch(link -> {
                    String href = link.getAttribute("href");
                    return href != null && href.contains("krds");
                });

            assertTrue(hasKrdsCss, "KRDS CSS 파일이 연결되어야 합니다");
        }
    }
}
