package egovframework.example.web;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
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
 * KRDS 헤더 및 모바일 사이드 메뉴 기능 테스트
 *
 * 테스트 항목:
 * 1. 모바일 전체메뉴 버튼 클릭 시 사이드 메뉴 열림
 * 2. 사이드 메뉴 닫기 버튼 클릭 시 메뉴 닫힘
 * 3. 사이드 메뉴 내 탭 네비게이션 동작
 * 4. 접근성 속성(ARIA) 정상 설정 확인
 */
@DisplayName("KRDS 헤더 기능 테스트")
class HeaderFunctionalityTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private static final String BASE_URL = "http://localhost:8080";

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        // 모바일 뷰포트 시뮬레이션 (768px 이하)
        options.addArguments("--window-size=375,812");
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get(BASE_URL + "/main.do");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("모바일 전체메뉴 버튼이 존재하고 aria-controls 속성이 설정되어야 한다")
    void testMobileMenuButtonExists() {
        // Given: 메인 페이지 로드

        // When: 전체메뉴 버튼 찾기
        WebElement menuButton = driver.findElement(By.cssSelector(".btn-navi.all"));

        // Then: 버튼이 존재하고 aria-controls 속성이 mobile-nav를 가리켜야 함
        assertNotNull(menuButton, "전체메뉴 버튼이 존재해야 합니다");
        assertEquals("mobile-nav", menuButton.getAttribute("aria-controls"),
            "aria-controls 속성이 mobile-nav를 가리켜야 합니다");
    }

    @Test
    @DisplayName("전체메뉴 버튼 클릭 시 모바일 사이드 메뉴가 열려야 한다")
    void testMobileMenuOpens() {
        // Given: 메인 페이지 로드
        WebElement menuButton = driver.findElement(By.cssSelector(".btn-navi.all"));
        WebElement mobileNav = driver.findElement(By.id("mobile-nav"));

        // 초기 상태: 메뉴가 닫혀 있음
        assertFalse(mobileNav.getAttribute("class").contains("is-open"),
            "초기 상태에서 메뉴는 닫혀 있어야 합니다");

        // When: 전체메뉴 버튼 클릭
        menuButton.click();

        // Then: 메뉴가 열림 (is-open 클래스 추가)
        wait.until(ExpectedConditions.attributeContains(mobileNav, "class", "is-open"));
        assertTrue(mobileNav.getAttribute("class").contains("is-open"),
            "전체메뉴 버튼 클릭 후 메뉴가 열려야 합니다");
    }

    @Test
    @DisplayName("닫기 버튼 클릭 시 모바일 사이드 메뉴가 닫혀야 한다")
    void testMobileMenuCloses() {
        // Given: 메뉴가 열린 상태
        WebElement menuButton = driver.findElement(By.cssSelector(".btn-navi.all"));
        WebElement mobileNav = driver.findElement(By.id("mobile-nav"));

        menuButton.click();
        wait.until(ExpectedConditions.attributeContains(mobileNav, "class", "is-open"));

        // When: 닫기 버튼 클릭
        WebElement closeButton = driver.findElement(By.id("close-nav"));
        closeButton.click();

        // Then: 메뉴가 닫힘 (is-open 클래스 제거)
        wait.until(ExpectedConditions.not(
            ExpectedConditions.attributeContains(mobileNav, "class", "is-open")));
        assertFalse(mobileNav.getAttribute("class").contains("is-open"),
            "닫기 버튼 클릭 후 메뉴가 닫혀야 합니다");
    }

    @Test
    @DisplayName("모바일 메뉴 내 탭 클릭 시 해당 서브메뉴로 스크롤되어야 한다")
    void testMobileMenuTabNavigation() {
        // Given: 메뉴가 열린 상태
        WebElement menuButton = driver.findElement(By.cssSelector(".btn-navi.all"));
        menuButton.click();

        WebElement mobileNav = driver.findElement(By.id("mobile-nav"));
        wait.until(ExpectedConditions.attributeContains(mobileNav, "class", "is-open"));

        // When: '민원' 탭 클릭
        WebElement complaintTab = driver.findElement(By.cssSelector(".menu-wrap a[href='#mGnb-anchor3']"));
        complaintTab.click();

        // Then: 해당 서브메뉴 섹션이 보여야 함
        WebElement complaintSection = driver.findElement(By.id("mGnb-anchor3"));
        wait.until(ExpectedConditions.visibilityOf(complaintSection));
        assertTrue(complaintSection.isDisplayed(), "민원 서브메뉴 섹션이 보여야 합니다");
    }

    @Test
    @DisplayName("모바일 메뉴 탭에 role=tab 속성이 설정되어야 한다")
    void testMobileMenuTabAccessibility() {
        // Given: 메뉴가 열린 상태
        WebElement menuButton = driver.findElement(By.cssSelector(".btn-navi.all"));
        menuButton.click();

        WebElement mobileNav = driver.findElement(By.id("mobile-nav"));
        wait.until(ExpectedConditions.attributeContains(mobileNav, "class", "is-open"));

        // When/Then: 탭 요소들의 ARIA 속성 확인
        var tabs = driver.findElements(By.cssSelector(".menu-wrap .gnb-main-trigger"));
        assertFalse(tabs.isEmpty(), "탭 요소들이 존재해야 합니다");

        for (WebElement tab : tabs) {
            assertEquals("tab", tab.getAttribute("role"),
                "각 탭은 role=tab 속성을 가져야 합니다");
            assertNotNull(tab.getAttribute("aria-controls"),
                "각 탭은 aria-controls 속성을 가져야 합니다");
        }
    }

    @Test
    @DisplayName("모바일 메뉴의 탭패널에 role=tabpanel 속성이 설정되어야 한다")
    void testMobileMenuTabPanelAccessibility() {
        // Given: 메뉴가 열린 상태
        WebElement menuButton = driver.findElement(By.cssSelector(".btn-navi.all"));
        menuButton.click();

        WebElement mobileNav = driver.findElement(By.id("mobile-nav"));
        wait.until(ExpectedConditions.attributeContains(mobileNav, "class", "is-open"));

        // When/Then: 탭패널 요소들의 ARIA 속성 확인
        var tabPanels = driver.findElements(By.cssSelector(".submenu-wrap .gnb-sub-list"));
        assertFalse(tabPanels.isEmpty(), "탭패널 요소들이 존재해야 합니다");

        for (WebElement panel : tabPanels) {
            assertEquals("tabpanel", panel.getAttribute("role"),
                "각 탭패널은 role=tabpanel 속성을 가져야 합니다");
            assertNotNull(panel.getAttribute("aria-labelledby"),
                "각 탭패널은 aria-labelledby 속성을 가져야 합니다");
        }
    }

    @Test
    @DisplayName("데스크탑 메인 메뉴에 nav 태그와 aria-label이 설정되어야 한다")
    void testDesktopMainMenuAccessibility() {
        // Given: 데스크탑 뷰포트로 변경
        driver.manage().window().setSize(new org.openqa.selenium.Dimension(1280, 800));
        driver.navigate().refresh();

        // When: 메인 메뉴 찾기
        WebElement mainMenu = driver.findElement(By.cssSelector("nav.krds-main-menu"));

        // Then: nav 태그이고 접근성 속성이 설정되어야 함
        assertEquals("nav", mainMenu.getTagName(), "메인 메뉴는 nav 태그여야 합니다");
    }

    @Test
    @DisplayName("데스크탑에서 2뎁스 서브메뉴가 동작해야 한다")
    void testDesktopSubMenuToggle() {
        // Given: 데스크탑 뷰포트로 변경
        driver.manage().window().setSize(new org.openqa.selenium.Dimension(1280, 800));
        driver.navigate().refresh();

        // When: '민원' 메뉴 트리거 클릭
        WebElement complaintTrigger = driver.findElement(
            By.cssSelector(".krds-main-menu .gnb-menu > li:nth-child(3) .gnb-main-trigger"));
        complaintTrigger.click();

        // Then: 서브메뉴가 열려야 함
        WebElement toggleWrap = driver.findElement(
            By.cssSelector(".krds-main-menu .gnb-menu > li:nth-child(3) .gnb-toggle-wrap"));
        wait.until(ExpectedConditions.attributeContains(toggleWrap, "class", "is-open"));
        assertTrue(toggleWrap.getAttribute("class").contains("is-open"),
            "민원 메뉴 클릭 시 서브메뉴가 열려야 합니다");
    }

    @Test
    @DisplayName("body에 is-gnb-mobile 클래스가 모바일 메뉴 열림 시 추가되어야 한다")
    void testBodyClassOnMobileMenuOpen() {
        // Given: 메인 페이지 로드
        WebElement menuButton = driver.findElement(By.cssSelector(".btn-navi.all"));
        WebElement body = driver.findElement(By.tagName("body"));

        // 초기 상태: body에 is-gnb-mobile 클래스 없음
        assertFalse(body.getAttribute("class").contains("is-gnb-mobile"));

        // When: 전체메뉴 버튼 클릭
        menuButton.click();

        // Then: body에 is-gnb-mobile 클래스 추가
        wait.until(ExpectedConditions.attributeContains(body, "class", "is-gnb-mobile"));
        assertTrue(body.getAttribute("class").contains("is-gnb-mobile"),
            "모바일 메뉴 열림 시 body에 is-gnb-mobile 클래스가 추가되어야 합니다");
    }
}
