package egovframework.example.web;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 모바일 사이드바 메뉴 테스트
 * KRDS 모바일 메뉴 컴포넌트 기반
 */
@DisplayName("모바일 사이드바 테스트")
public class MobileSidebarTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor js;
    private static final String BASE_URL = "http://localhost:8080";
    private static final int MOBILE_WIDTH = 375;
    private static final int MOBILE_HEIGHT = 667;

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driver = new ChromeDriver(options);
        // 모바일 화면 크기로 설정
        driver.manage().window().setSize(new Dimension(MOBILE_WIDTH, MOBILE_HEIGHT));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        js = (JavascriptExecutor) driver;
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Nested
    @DisplayName("사이드바 열기 테스트")
    class SidebarOpenTests {

        @Test
        @DisplayName("전체메뉴 버튼 클릭 시 사이드바가 열려야 한다")
        void shouldOpenSidebarWhenMenuButtonClicked() {
            driver.get(BASE_URL + "/main.do");

            // 전체메뉴 버튼 찾기
            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));

            // 버튼 클릭
            menuButton.click();

            // 사이드바가 열렸는지 확인
            WebElement sidebar = driver.findElement(By.id("mobile-nav"));
            wait.until(ExpectedConditions.attributeContains(sidebar, "class", "is-open"));

            assertTrue(sidebar.getAttribute("class").contains("is-open"),
                "사이드바에 is-open 클래스가 있어야 합니다");
        }

        @Test
        @DisplayName("사이드바 열림 시 배경 딤 레이어가 표시되어야 한다")
        void shouldShowBackdropWhenSidebarOpened() {
            driver.get(BASE_URL + "/main.do");

            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));
            menuButton.click();

            WebElement sidebar = driver.findElement(By.id("mobile-nav"));
            wait.until(ExpectedConditions.attributeContains(sidebar, "class", "is-backdrop"));

            assertTrue(sidebar.getAttribute("class").contains("is-backdrop"),
                "사이드바에 is-backdrop 클래스가 있어야 합니다");
        }

        @Test
        @DisplayName("사이드바 열림 시 body 스크롤이 비활성화되어야 한다")
        void shouldDisableBodyScrollWhenSidebarOpened() {
            driver.get(BASE_URL + "/main.do");

            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));
            menuButton.click();

            // body의 overflow 스타일 확인
            String bodyOverflow = (String) js.executeScript(
                "return document.body.style.overflow;"
            );

            assertEquals("hidden", bodyOverflow, "body의 overflow가 hidden이어야 합니다");
        }
    }

    @Nested
    @DisplayName("사이드바 닫기 테스트")
    class SidebarCloseTests {

        @Test
        @DisplayName("닫기 버튼 클릭 시 사이드바가 닫혀야 한다")
        void shouldCloseSidebarWhenCloseButtonClicked() {
            driver.get(BASE_URL + "/main.do");

            // 사이드바 열기
            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));
            menuButton.click();

            WebElement sidebar = driver.findElement(By.id("mobile-nav"));
            wait.until(ExpectedConditions.attributeContains(sidebar, "class", "is-open"));

            // 닫기 버튼 클릭
            WebElement closeButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.id("close-nav")
            ));
            closeButton.click();

            // 사이드바가 닫혔는지 확인 (is-open 클래스가 제거됨)
            wait.until(ExpectedConditions.not(
                ExpectedConditions.attributeContains(sidebar, "class", "is-open")
            ));

            assertFalse(sidebar.getAttribute("class").contains("is-open"),
                "사이드바에 is-open 클래스가 없어야 합니다");
        }

        @Test
        @DisplayName("배경 클릭 시 사이드바가 닫혀야 한다")
        void shouldCloseSidebarWhenBackdropClicked() {
            driver.get(BASE_URL + "/main.do");

            // 사이드바 열기
            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));
            menuButton.click();

            WebElement sidebar = driver.findElement(By.id("mobile-nav"));
            wait.until(ExpectedConditions.attributeContains(sidebar, "class", "is-open"));

            // 배경(::after pseudo element) 클릭 - 사이드바 왼쪽 영역 클릭
            js.executeScript(
                "var sidebar = document.getElementById('mobile-nav');" +
                "var event = new MouseEvent('click', {" +
                "  bubbles: true," +
                "  cancelable: true," +
                "  clientX: 10," +  // 왼쪽 가장자리 (배경 영역)
                "  clientY: 300" +
                "});" +
                "sidebar.dispatchEvent(event);"
            );

            // 사이드바가 닫혔는지 확인
            wait.until(ExpectedConditions.not(
                ExpectedConditions.attributeContains(sidebar, "class", "is-open")
            ));

            assertFalse(sidebar.getAttribute("class").contains("is-open"),
                "배경 클릭 시 사이드바가 닫혀야 합니다");
        }

        @Test
        @DisplayName("ESC 키 입력 시 사이드바가 닫혀야 한다")
        void shouldCloseSidebarWhenEscapeKeyPressed() {
            driver.get(BASE_URL + "/main.do");

            // 사이드바 열기
            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));
            menuButton.click();

            WebElement sidebar = driver.findElement(By.id("mobile-nav"));
            wait.until(ExpectedConditions.attributeContains(sidebar, "class", "is-open"));

            // ESC 키 입력
            js.executeScript(
                "document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));"
            );

            // 사이드바가 닫혔는지 확인
            wait.until(ExpectedConditions.not(
                ExpectedConditions.attributeContains(sidebar, "class", "is-open")
            ));

            assertFalse(sidebar.getAttribute("class").contains("is-open"),
                "ESC 키 입력 시 사이드바가 닫혀야 합니다");
        }

        @Test
        @DisplayName("사이드바 닫힘 시 body 스크롤이 복원되어야 한다")
        void shouldRestoreBodyScrollWhenSidebarClosed() {
            driver.get(BASE_URL + "/main.do");

            // 사이드바 열기
            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));
            menuButton.click();

            WebElement sidebar = driver.findElement(By.id("mobile-nav"));
            wait.until(ExpectedConditions.attributeContains(sidebar, "class", "is-open"));

            // 닫기 버튼 클릭
            WebElement closeButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.id("close-nav")
            ));
            closeButton.click();

            // 닫힘 대기
            wait.until(ExpectedConditions.not(
                ExpectedConditions.attributeContains(sidebar, "class", "is-open")
            ));

            // body의 overflow 스타일 확인
            String bodyOverflow = (String) js.executeScript(
                "return document.body.style.overflow;"
            );

            assertTrue(bodyOverflow == null || bodyOverflow.isEmpty(),
                "body의 overflow가 복원되어야 합니다");
        }
    }

    @Nested
    @DisplayName("접근성 테스트")
    class AccessibilityTests {

        @Test
        @DisplayName("사이드바 열림 시 gnb-wrap에 포커스가 이동해야 한다")
        void shouldFocusGnbWrapWhenSidebarOpened() {
            driver.get(BASE_URL + "/main.do");

            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));
            menuButton.click();

            WebElement sidebar = driver.findElement(By.id("mobile-nav"));
            wait.until(ExpectedConditions.attributeContains(sidebar, "class", "is-open"));

            // 포커스된 요소 확인
            WebElement focusedElement = driver.switchTo().activeElement();
            String focusedClass = focusedElement.getAttribute("class");

            assertTrue(focusedClass != null && focusedClass.contains("gnb-wrap"),
                "gnb-wrap에 포커스가 있어야 합니다");
        }

        @Test
        @DisplayName("전체메뉴 버튼에 aria-expanded 속성이 올바르게 설정되어야 한다")
        void shouldHaveCorrectAriaExpandedAttribute() {
            driver.get(BASE_URL + "/main.do");

            WebElement menuButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector(".btn-navi.all")
            ));

            // 초기 상태: aria-expanded="false"
            String initialAriaExpanded = menuButton.getAttribute("aria-expanded");
            assertEquals("false", initialAriaExpanded, "초기 aria-expanded는 false여야 합니다");

            // 사이드바 열기
            menuButton.click();

            WebElement sidebar = driver.findElement(By.id("mobile-nav"));
            wait.until(ExpectedConditions.attributeContains(sidebar, "class", "is-open"));

            // 열린 상태: aria-expanded="true"
            String openAriaExpanded = menuButton.getAttribute("aria-expanded");
            assertEquals("true", openAriaExpanded, "열린 상태의 aria-expanded는 true여야 합니다");

            // 닫기
            WebElement closeButton = driver.findElement(By.id("close-nav"));
            closeButton.click();

            wait.until(ExpectedConditions.not(
                ExpectedConditions.attributeContains(sidebar, "class", "is-open")
            ));

            // 닫힌 상태: aria-expanded="false"
            String closedAriaExpanded = menuButton.getAttribute("aria-expanded");
            assertEquals("false", closedAriaExpanded, "닫힌 상태의 aria-expanded는 false여야 합니다");
        }
    }
}
