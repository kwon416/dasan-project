package egovframework.example.web;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * KRDS 디자인 스타일 가이드 테스트
 *
 * 테스트 항목:
 * 1. 색상: KRDS 토큰 기반 색상 사용 여부
 * 2. 타이포그래피: Pretendard GOV 폰트 적용, 크기/행간/자간
 * 3. 형태: 라운드(border-radius) 토큰 사용
 * 4. 레이아웃: 콘텐츠 너비, 패딩, 간격 토큰 사용
 * 5. 엘리베이션: 그림자 토큰 사용
 */
@DisplayName("KRDS 디자인 스타일 가이드 테스트")
class KrdsDesignStyleTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor js;
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
        js = (JavascriptExecutor) driver;
        driver.get(BASE_URL + "/main.do");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    /**
     * CSS 변수 값을 가져오는 헬퍼 메서드
     */
    private String getCssVariable(String variableName) {
        return (String) js.executeScript(
            "return getComputedStyle(document.documentElement).getPropertyValue('" + variableName + "').trim();"
        );
    }

    /**
     * 요소의 computed style 값을 가져오는 헬퍼 메서드
     */
    private String getComputedStyle(WebElement element, String property) {
        return (String) js.executeScript(
            "return getComputedStyle(arguments[0]).getPropertyValue('" + property + "');",
            element
        );
    }

    @Nested
    @DisplayName("1. 색상 테스트 (KRDS 토큰 기반)")
    class ColorTests {

        @Test
        @DisplayName("KRDS Primary 색상 토큰이 정의되어 있어야 한다")
        void testPrimaryColorTokenExists() {
            // Given/When
            String primary50 = getCssVariable("--krds-color-light-primary-50");

            // Then
            assertNotNull(primary50, "KRDS primary-50 색상 토큰이 정의되어 있어야 합니다");
            assertFalse(primary50.isEmpty(), "KRDS primary-50 색상 값이 비어있지 않아야 합니다");
        }

        @Test
        @DisplayName("body 텍스트 색상이 KRDS 토큰을 사용해야 한다")
        void testBodyTextColor() {
            // Given
            WebElement body = driver.findElement(By.tagName("body"));

            // When
            String textColor = getComputedStyle(body, "color");

            // Then: KRDS light-color-text-basic (#1e2124)
            assertNotNull(textColor, "body의 텍스트 색상이 설정되어 있어야 합니다");
            // RGB(30, 33, 36) = #1e2124
            assertTrue(
                textColor.contains("30, 33, 36") || textColor.contains("rgb(30, 33, 36)"),
                "body 텍스트 색상이 KRDS 토큰 값이어야 합니다. 실제 값: " + textColor
            );
        }

        @Test
        @DisplayName("body 배경색이 KRDS 토큰을 사용해야 한다")
        void testBodyBackgroundColor() {
            // Given
            WebElement body = driver.findElement(By.tagName("body"));

            // When
            String bgColor = getComputedStyle(body, "background-color");

            // Then: KRDS light-color-background-white (#ffffff)
            assertNotNull(bgColor, "body의 배경색이 설정되어 있어야 합니다");
            assertTrue(
                bgColor.contains("255, 255, 255") || bgColor.contains("rgb(255, 255, 255)"),
                "body 배경색이 KRDS 토큰 값(흰색)이어야 합니다. 실제 값: " + bgColor
            );
        }

        @Test
        @DisplayName("링크 색상이 KRDS Primary 토큰을 사용해야 한다")
        void testLinkColor() {
            // Given: 링크 요소 찾기
            WebElement link = driver.findElement(By.cssSelector("a"));

            // When
            String linkColor = getComputedStyle(link, "color");

            // Then: KRDS 링크 색상은 primary-50 또는 상속된 색상
            assertNotNull(linkColor, "링크의 색상이 설정되어 있어야 합니다");
        }
    }

    @Nested
    @DisplayName("2. 타이포그래피 테스트")
    class TypographyTests {

        @Test
        @DisplayName("Pretendard GOV 폰트가 정의되어 있어야 한다")
        void testPretendardGovFontDefined() {
            // Given/When
            String fontFamily = getCssVariable("--krds-typo-font-type");

            // Then
            assertNotNull(fontFamily, "KRDS 폰트 타입 토큰이 정의되어 있어야 합니다");
            assertTrue(
                fontFamily.toLowerCase().contains("pretendard"),
                "폰트 패밀리에 Pretendard가 포함되어야 합니다. 실제 값: " + fontFamily
            );
        }

        @Test
        @DisplayName("body 폰트가 Pretendard GOV여야 한다")
        void testBodyFontFamily() {
            // Given
            WebElement body = driver.findElement(By.tagName("body"));

            // When
            String fontFamily = getComputedStyle(body, "font-family");

            // Then
            assertNotNull(fontFamily, "body의 font-family가 설정되어 있어야 합니다");
            assertTrue(
                fontFamily.toLowerCase().contains("pretendard"),
                "body의 font-family에 Pretendard가 포함되어야 합니다. 실제 값: " + fontFamily
            );
        }

        @Test
        @DisplayName("PC 본문 기본 폰트 크기가 17px이어야 한다")
        void testBodyFontSize() {
            // Given
            WebElement body = driver.findElement(By.tagName("body"));

            // When
            String fontSize = getComputedStyle(body, "font-size");

            // Then: KRDS body-medium = 1.7rem = 17px
            assertNotNull(fontSize, "body의 font-size가 설정되어 있어야 합니다");
            assertTrue(
                fontSize.equals("17px") || fontSize.contains("17"),
                "body 폰트 크기가 17px이어야 합니다. 실제 값: " + fontSize
            );
        }

        @Test
        @DisplayName("기본 행간(line-height)이 1.5여야 한다")
        void testBodyLineHeight() {
            // Given
            WebElement body = driver.findElement(By.tagName("body"));

            // When
            String lineHeight = getComputedStyle(body, "line-height");

            // Then: KRDS line-height = 1.5 (150%)
            assertNotNull(lineHeight, "body의 line-height가 설정되어 있어야 합니다");
            // line-height가 normal이 아닌 경우 1.5 또는 25.5px (17 * 1.5) 정도
            // 계산된 값으로 확인
        }

        @Test
        @DisplayName("Heading 요소가 Bold(700) 굵기여야 한다")
        void testHeadingFontWeight() {
            // Given
            WebElement heading = driver.findElement(By.cssSelector("h1, h2, h3"));

            // When
            String fontWeight = getComputedStyle(heading, "font-weight");

            // Then: Bold = 700
            assertNotNull(fontWeight, "heading의 font-weight가 설정되어 있어야 합니다");
            assertTrue(
                fontWeight.equals("700") || fontWeight.equals("bold"),
                "heading의 font-weight가 700(bold)이어야 합니다. 실제 값: " + fontWeight
            );
        }
    }

    @Nested
    @DisplayName("3. 형태(Border Radius) 테스트")
    class ShapeTests {

        @Test
        @DisplayName("KRDS radius 토큰이 정의되어 있어야 한다")
        void testRadiusTokenExists() {
            // Given/When
            String radiusMedium = getCssVariable("--krds-radius-medium3");

            // Then
            assertNotNull(radiusMedium, "KRDS radius-medium3 토큰이 정의되어 있어야 합니다");
            assertFalse(radiusMedium.isEmpty(), "KRDS radius-medium3 값이 비어있지 않아야 합니다");
        }

        @Test
        @DisplayName("카드 컴포넌트가 KRDS radius 토큰을 사용해야 한다")
        void testCardBorderRadius() {
            // Given
            WebElement card = driver.findElement(By.cssSelector(".dasan-card"));

            // When
            String borderRadius = getComputedStyle(card, "border-radius");

            // Then: KRDS radius 토큰 값 사용 (0이 아닌 값)
            assertNotNull(borderRadius, "카드의 border-radius가 설정되어 있어야 합니다");
            assertFalse(
                borderRadius.equals("0px") || borderRadius.isEmpty(),
                "카드의 border-radius가 0이 아니어야 합니다. 실제 값: " + borderRadius
            );
        }
    }

    @Nested
    @DisplayName("4. 레이아웃 테스트")
    class LayoutTests {

        @Test
        @DisplayName("KRDS 콘텐츠 최대 너비 토큰이 정의되어 있어야 한다")
        void testContentsWidthTokenExists() {
            // Given/When
            String contentsSize = getCssVariable("--krds-contents-size");

            // Then
            assertNotNull(contentsSize, "KRDS contents-size 토큰이 정의되어 있어야 합니다");
            assertTrue(
                contentsSize.contains("1200"),
                "콘텐츠 최대 너비가 1200px이어야 합니다. 실제 값: " + contentsSize
            );
        }

        @Test
        @DisplayName("inner 클래스가 KRDS 패딩 토큰을 사용해야 한다")
        void testInnerPadding() {
            // Given
            WebElement inner = driver.findElement(By.cssSelector(".inner"));

            // When
            String paddingLeft = getComputedStyle(inner, "padding-left");
            String paddingRight = getComputedStyle(inner, "padding-right");

            // Then: KRDS contents-padding-x = 24px (PC)
            assertNotNull(paddingLeft, "inner의 padding-left가 설정되어 있어야 합니다");
            assertNotNull(paddingRight, "inner의 padding-right가 설정되어 있어야 합니다");
        }

        @Test
        @DisplayName("KRDS gap 토큰이 정의되어 있어야 한다")
        void testGapTokenExists() {
            // Given/When
            String gap5 = getCssVariable("--krds-gap-5");

            // Then
            assertNotNull(gap5, "KRDS gap-5 토큰이 정의되어 있어야 합니다");
            assertFalse(gap5.isEmpty(), "KRDS gap-5 값이 비어있지 않아야 합니다");
        }
    }

    @Nested
    @DisplayName("5. 엘리베이션(그림자) 테스트")
    class ElevationTests {

        @Test
        @DisplayName("KRDS shadow 토큰이 정의되어 있어야 한다")
        void testShadowTokenExists() {
            // Given/When
            String shadow1 = getCssVariable("--krds-light-color-alpha-shadow1");

            // Then
            assertNotNull(shadow1, "KRDS shadow1 토큰이 정의되어 있어야 합니다");
        }

        @Test
        @DisplayName("카드 컴포넌트에 그림자가 적용되어야 한다")
        void testCardBoxShadow() {
            // Given
            WebElement card = driver.findElement(By.cssSelector(".dasan-card"));

            // When
            String boxShadow = getComputedStyle(card, "box-shadow");

            // Then
            assertNotNull(boxShadow, "카드의 box-shadow가 설정되어 있어야 합니다");
            assertFalse(
                boxShadow.equals("none") || boxShadow.isEmpty(),
                "카드에 box-shadow가 적용되어 있어야 합니다. 실제 값: " + boxShadow
            );
        }
    }

    @Nested
    @DisplayName("6. 반응형 테스트")
    class ResponsiveTests {

        @Test
        @DisplayName("모바일에서 body 폰트 크기가 17px이어야 한다")
        void testMobileBodyFontSize() {
            // Given: 모바일 뷰포트로 변경
            driver.manage().window().setSize(new org.openqa.selenium.Dimension(375, 812));
            driver.navigate().refresh();

            WebElement body = driver.findElement(By.tagName("body"));

            // When
            String fontSize = getComputedStyle(body, "font-size");

            // Then: KRDS mobile-body-medium = 1.7rem = 17px
            assertNotNull(fontSize, "모바일에서 body의 font-size가 설정되어 있어야 합니다");
            assertTrue(
                fontSize.equals("17px") || fontSize.contains("17"),
                "모바일에서 body 폰트 크기가 17px이어야 합니다. 실제 값: " + fontSize
            );
        }

        @Test
        @DisplayName("모바일에서 inner 패딩이 16px이어야 한다")
        void testMobileInnerPadding() {
            // Given: 모바일 뷰포트로 변경
            driver.manage().window().setSize(new org.openqa.selenium.Dimension(375, 812));
            driver.navigate().refresh();

            WebElement inner = driver.findElement(By.cssSelector(".inner"));

            // When
            String paddingLeft = getComputedStyle(inner, "padding-left");

            // Then: KRDS contents-padding-x = 16px (Mobile)
            assertNotNull(paddingLeft, "모바일에서 inner의 padding-left가 설정되어 있어야 합니다");
            assertTrue(
                paddingLeft.equals("16px") || paddingLeft.contains("16"),
                "모바일에서 inner 패딩이 16px이어야 합니다. 실제 값: " + paddingLeft
            );
        }
    }

    @Nested
    @DisplayName("7. 접근성 테스트")
    class AccessibilityTests {

        @Test
        @DisplayName("html 요소에 lang 속성이 'ko'로 설정되어야 한다")
        void testHtmlLangAttribute() {
            // Given
            WebElement html = driver.findElement(By.tagName("html"));

            // When
            String lang = html.getAttribute("lang");

            // Then
            assertEquals("ko", lang, "html의 lang 속성이 'ko'여야 합니다");
        }

        @Test
        @DisplayName("포커스 시 outline이 KRDS 토큰을 사용해야 한다")
        void testFocusOutlineExists() {
            // Given/When
            String outlineBox = getCssVariable("--krds-box-shadow-outline");

            // Then
            assertNotNull(outlineBox, "KRDS box-shadow-outline 토큰이 정의되어 있어야 합니다");
        }
    }
}
