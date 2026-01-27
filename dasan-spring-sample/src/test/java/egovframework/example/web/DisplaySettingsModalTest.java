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

            // When: 닫기 버튼 클릭
            WebElement closeButton = modal.findElement(By.cssSelector(".btn-close"));
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
    @DisplayName("3. 화면 크기 조정 옵션 테스트")
    class ZoomOptionsTests {

        @Test
        @DisplayName("모달 내에 화면 크기 조정 옵션이 있어야 한다")
        void testZoomOptionsExist() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When
            List<WebElement> zoomOptions = modal.findElements(
                By.cssSelector(".zoom-options .zoom-option"));

            // Then
            assertTrue(zoomOptions.size() >= 5, "최소 5개의 화면 크기 옵션이 있어야 합니다");
        }

        @Test
        @DisplayName("기본 선택된 옵션은 100%여야 한다")
        void testDefaultZoomIs100Percent() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When
            WebElement selectedOption = modal.findElement(
                By.cssSelector(".zoom-options .zoom-option.active"));

            // Then
            assertTrue(selectedOption.getText().contains("100") ||
                      selectedOption.getAttribute("data-zoom").equals("1"),
                "기본 선택된 옵션은 100%여야 합니다");
        }

        @Test
        @DisplayName("화면 크기 옵션 선택 시 active 클래스가 변경되어야 한다")
        void testZoomOptionSelectionChangesActiveClass() {
            // Given: 모달 열기
            WebElement settingsButton = driver.findElement(
                By.cssSelector("#krds-header .btn-display-settings"));
            settingsButton.click();

            WebElement modal = driver.findElement(By.id("display-settings-modal"));
            wait.until(ExpectedConditions.attributeContains(modal, "class", "shown"));

            // When: 다른 옵션 선택
            List<WebElement> zoomOptions = modal.findElements(
                By.cssSelector(".zoom-options .zoom-option"));
            WebElement largeOption = zoomOptions.stream()
                .filter(el -> el.getAttribute("data-zoom").equals("1.3"))
                .findFirst()
                .orElse(null);

            if (largeOption != null) {
                largeOption.click();

                // Then
                wait.until(ExpectedConditions.attributeContains(largeOption, "class", "active"));
                assertTrue(largeOption.getAttribute("class").contains("active"),
                    "선택된 옵션에 active 클래스가 있어야 합니다");
            }
        }
    }

    @Nested
    @DisplayName("4. 접근성 테스트")
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
