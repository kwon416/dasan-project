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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 글자·화면 설정 모달 기능 테스트
 *
 * 테스트 항목:
 * 1. 헤더에 "글자·화면 설정" 버튼이 존재해야 한다
 * 2. 버튼 클릭 시 모달이 열려야 한다
 * 3. 모달 내에 화면 크기 조정 옵션이 있어야 한다
 * 4. 화면 크기 선택 시 zoom 스타일이 적용되어야 한다
 * 5. 모달 닫기 버튼이 동작해야 한다
 * 6. 접근성 속성이 올바르게 설정되어야 한다
 */
@DisplayName("글자·화면 설정 모달 테스트")
class DisplaySettingsModalTest {

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

    @Nested
    @DisplayName("1. 버튼 존재 테스트")
    class ButtonExistenceTests {

        @Test
        @DisplayName("헤더에 글자·화면 설정 버튼이 존재해야 한다")
        void testDisplaySettingsButtonExists() {
            // Given/When
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));

            // Then
            assertNotNull(settingsButton, "글자·화면 설정 버튼이 존재해야 합니다");
            assertTrue(settingsButton.isDisplayed(), "버튼이 화면에 보여야 합니다");
        }

        @Test
        @DisplayName("버튼에 적절한 aria-label이 설정되어야 한다")
        void testButtonAriaLabel() {
            // Given/When
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            String ariaLabel = settingsButton.getAttribute("aria-label");

            // Then
            assertNotNull(ariaLabel, "aria-label이 설정되어 있어야 합니다");
            assertTrue(ariaLabel.contains("설정"), "aria-label에 '설정'이 포함되어야 합니다");
        }

        @Test
        @DisplayName("버튼에 aria-haspopup=dialog가 설정되어야 한다")
        void testButtonAriaHaspopup() {
            // Given/When
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            String ariaHaspopup = settingsButton.getAttribute("aria-haspopup");

            // Then
            assertEquals("dialog", ariaHaspopup,
                "aria-haspopup이 'dialog'로 설정되어야 합니다");
        }
    }

    @Nested
    @DisplayName("2. 모달 열기/닫기 테스트")
    class ModalOpenCloseTests {

        @Test
        @DisplayName("버튼 클릭 시 모달이 열려야 한다")
        void testModalOpensOnClick() {
            // Given
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            WebElement modal = driver.findElement(By.id("display-settings-modal"));

            // 초기 상태: 모달이 보이지 않음
            assertFalse(modal.getAttribute("class").contains("shown"),
                "초기 상태에서 모달은 닫혀 있어야 합니다");

            // When
            settingsButton.click();

            // Then
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));
            assertTrue(modal.getAttribute("class").contains("shown"),
                "버튼 클릭 후 모달이 열려야 합니다");
        }

        @Test
        @DisplayName("닫기 버튼 클릭 시 모달이 닫혀야 한다")
        void testModalClosesOnCloseButtonClick() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: 닫기 버튼 클릭 (푸터 또는 X 버튼)
            WebElement closeButton = modal.findElement(By.cssSelector(".btn-modal-close, .btn-close-x"));
            closeButton.click();

            // Then
            wait.until(ExpectedConditions.not(
                ExpectedConditions.attributeContains(modal, "class", "shown")));
            assertFalse(modal.getAttribute("class").contains("shown"),
                "닫기 버튼 클릭 후 모달이 닫혀야 합니다");
        }

        @Test
        @DisplayName("ESC 키 입력 시 모달이 닫혀야 한다")
        void testModalClosesOnEscKey() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: ESC 키 입력
            WebElement modalContent = modal.findElement(By.cssSelector(".modal-content"));
            modalContent.sendKeys(org.openqa.selenium.Keys.ESCAPE);

            // Then
            wait.until(ExpectedConditions.not(
                ExpectedConditions.attributeContains(modal, "class", "shown")));
            assertFalse(modal.getAttribute("class").contains("shown"),
                "ESC 키 입력 후 모달이 닫혀야 합니다");
        }
    }

    @Nested
    @DisplayName("3. 화면 크기 조정 옵션 테스트 (KRDS 라디오 버튼)")
    class ZoomOptionsTests {

        @Test
        @DisplayName("모달 내에 화면 크기 조정 라디오 버튼이 있어야 한다")
        void testZoomOptionsExist() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: KRDS 라디오 버튼 - input[name="zoom-scale"]
            List<WebElement> zoomRadios = modal.findElements(
                By.cssSelector("input[name='zoom-scale']"));

            // Then
            assertTrue(zoomRadios.size() >= 5, "최소 5개의 화면 크기 옵션이 있어야 합니다");
        }

        @Test
        @DisplayName("기본 선택된 옵션은 100% (md)여야 한다")
        void testDefaultZoomIs100Percent() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: KRDS 라디오 버튼 - checked 상태인 것
            WebElement selectedRadio = modal.findElement(
                By.cssSelector("input[name='zoom-scale']:checked"));

            // Then: data-adjust-scale="md" 또는 value="1"
            assertTrue(
                "md".equals(selectedRadio.getAttribute("data-adjust-scale")) ||
                "1".equals(selectedRadio.getAttribute("value")),
                "기본 선택된 옵션은 100% (md)여야 합니다");
        }

        @Test
        @DisplayName("화면 크기 옵션 선택 시 body zoom 스타일이 변경되어야 한다")
        void testZoomOptionSelectionChangesBodyZoom() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: xlg (130%) 라디오 버튼 선택
            WebElement largeRadio = modal.findElement(
                By.cssSelector("input[name='zoom-scale'][data-adjust-scale='xlg']"));
            js.executeScript("arguments[0].click();", largeRadio);

            // Then: body zoom 스타일이 1.3으로 변경되어야 함
            String bodyZoom = (String) js.executeScript(
                "return document.body.style.zoom;");
            assertEquals("1.3", bodyZoom, "body zoom이 1.3으로 설정되어야 합니다");
        }
    }

    @Nested
    @DisplayName("5. 화면 모드 변경 테스트")
    class DisplayModeTests {

        @Test
        @DisplayName("모달 내에 화면 모드 라디오 버튼이 있어야 한다")
        void testDisplayModeOptionsExist() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: 화면 모드 라디오 버튼
            List<WebElement> modeRadios = modal.findElements(
                By.cssSelector("input[name='display-mode']"));

            // Then: 최소 3개 옵션 (밝은 배경, 어두운 배경, 시스템 설정)
            assertTrue(modeRadios.size() >= 3, "최소 3개의 화면 모드 옵션이 있어야 합니다");
        }

        @Test
        @DisplayName("기본 화면 모드는 light여야 한다")
        void testDefaultModeIsLight() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: 선택된 모드 라디오 버튼
            WebElement selectedMode = modal.findElement(
                By.cssSelector("input[name='display-mode']:checked"));

            // Then: data-mode="light"
            assertEquals("light", selectedMode.getAttribute("data-mode"),
                "기본 화면 모드는 light여야 합니다");
        }

        @Test
        @DisplayName("high-contrast 모드 선택 시 html에 data-krds-mode 속성이 설정되어야 한다")
        void testHighContrastModeAddsAttribute() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: high-contrast 모드 선택
            WebElement highContrastRadio = modal.findElement(
                By.cssSelector("input[name='display-mode'][data-mode='high-contrast']"));
            js.executeScript("arguments[0].click();", highContrastRadio);

            // Then: html에 data-krds-mode="high-contrast" 속성이 설정되어야 함
            WebElement html = driver.findElement(By.tagName("html"));
            String krdsMode = html.getAttribute("data-krds-mode");
            assertEquals("high-contrast", krdsMode,
                "high-contrast 모드 선택 시 data-krds-mode='high-contrast'가 설정되어야 합니다");
        }

        @Test
        @DisplayName("high-contrast 모드에서 hero 섹션 배경색이 변경되어야 한다")
        void testHeroSectionChangesInHighContrastMode() {
            // Given: hero 섹션의 초기 배경색 확인
            WebElement heroSection = driver.findElement(By.cssSelector(".hero-section"));
            String initialBgColor = (String) js.executeScript(
                "return window.getComputedStyle(arguments[0]).getPropertyValue('background');",
                heroSection);

            // 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: high-contrast 모드 선택
            WebElement highContrastRadio = modal.findElement(
                By.cssSelector("input[name='display-mode'][data-mode='high-contrast']"));
            js.executeScript("arguments[0].click();", highContrastRadio);

            // 잠시 대기 (스타일 적용)
            try { Thread.sleep(300); } catch (InterruptedException e) {}

            // Then: hero 섹션의 배경색이 변경되어야 함
            String newBgColor = (String) js.executeScript(
                "return window.getComputedStyle(arguments[0]).getPropertyValue('background');",
                heroSection);
            assertNotEquals(initialBgColor, newBgColor,
                "high-contrast 모드에서 hero 섹션의 배경색이 변경되어야 합니다");
        }
    }

    @Nested
    @DisplayName("4. 닫기 버튼 스타일 테스트")
    class CloseButtonStyleTests {

        @Test
        @DisplayName("푸터 닫기 버튼이 btn-close 클래스를 사용하지 않아야 한다")
        void testFooterCloseButtonNotUseBtnClose() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: 푸터 닫기 버튼 찾기
            WebElement footerCloseButton = modal.findElement(
                By.cssSelector(".modal-footer-btns .krds-btn.primary"));

            // Then: btn-close 클래스가 없어야 함 (KRDS에서 position: absolute를 적용하기 때문)
            String buttonClass = footerCloseButton.getAttribute("class");
            assertFalse(buttonClass.contains("btn-close"),
                "푸터 닫기 버튼은 btn-close 클래스를 사용하면 안 됩니다 (KRDS position: absolute 충돌)");
        }

        @Test
        @DisplayName("푸터 닫기 버튼이 btn-modal-close 클래스를 사용해야 한다")
        void testFooterCloseButtonUsesBtnModalClose() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: 푸터 닫기 버튼 찾기
            WebElement footerCloseButton = modal.findElement(
                By.cssSelector(".modal-footer-btns .btn-modal-close"));

            // Then: 버튼이 존재해야 함
            assertNotNull(footerCloseButton, "푸터에 btn-modal-close 클래스를 가진 버튼이 있어야 합니다");
        }

        @Test
        @DisplayName("푸터 닫기 버튼이 position absolute가 아니어야 한다")
        void testFooterCloseButtonNotAbsolutePosition() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: 푸터 닫기 버튼의 position 스타일 확인
            WebElement footerCloseButton = modal.findElement(
                By.cssSelector(".modal-footer-btns .krds-btn.primary"));
            String position = (String) js.executeScript(
                "return window.getComputedStyle(arguments[0]).getPropertyValue('position');",
                footerCloseButton);

            // Then: position이 absolute가 아니어야 함
            assertNotEquals("absolute", position,
                "푸터 닫기 버튼은 position: absolute가 아니어야 합니다");
        }
    }

    @Nested
    @DisplayName("5. 접근성 테스트")
    class AccessibilityTests {

        @Test
        @DisplayName("모달에 role=dialog가 설정되어야 한다")
        void testModalRoleDialog() {
            // Given/When
            WebElement modal = driver.findElement(By.id("display-settings-modal"));

            // Then
            assertEquals("dialog", modal.getAttribute("role"),
                "모달에 role=dialog가 설정되어야 합니다");
        }

        @Test
        @DisplayName("모달에 aria-modal=true가 설정되어야 한다")
        void testModalAriaModal() {
            // Given/When
            WebElement modal = driver.findElement(By.id("display-settings-modal"));

            // Then
            assertEquals("true", modal.getAttribute("aria-modal"),
                "모달에 aria-modal=true가 설정되어야 합니다");
        }

        @Test
        @DisplayName("모달에 aria-labelledby가 설정되어야 한다")
        void testModalAriaLabelledby() {
            // Given/When
            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            String ariaLabelledby = modal.getAttribute("aria-labelledby");

            // Then
            assertNotNull(ariaLabelledby, "aria-labelledby가 설정되어야 합니다");

            // labelledby가 가리키는 요소가 존재하는지 확인
            WebElement titleElement = driver.findElement(By.id(ariaLabelledby));
            assertNotNull(titleElement, "aria-labelledby가 가리키는 요소가 존재해야 합니다");
        }
    }
}
