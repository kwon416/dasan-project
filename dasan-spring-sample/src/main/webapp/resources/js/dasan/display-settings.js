/**
 * 글자·화면 설정 모달 스크립트
 * KRDS 모달 + 화면 크기 조정 컴포넌트 기반
 *
 * 기능:
 * - 화면 크기(zoom) 조정: 90%, 100%, 110%, 130%, 150%
 * - 화면 모드: 일반 모드 / 선명한 화면(High Contrast)
 * - localStorage를 통한 설정 저장/복원
 */

(function() {
    'use strict';

    // 설정 키
    var STORAGE_KEY = 'dasan-display-settings';

    // 기본 설정
    var DEFAULT_SETTINGS = {
        zoom: 1,
        mode: 'light'
    };

    // 현재 설정 (임시 저장용)
    var currentSettings = Object.assign({}, DEFAULT_SETTINGS);
    var tempSettings = Object.assign({}, DEFAULT_SETTINGS);

    // DOM 요소 참조
    var modal = null;
    var modalBack = null;
    var modalContent = null;
    var openButton = null;
    var closeButton = null;
    var resetButton = null;
    var applyButton = null;
    var zoomOptions = null;
    var modeOptions = null;

    // 이전 포커스 요소 저장
    var previousFocusElement = null;

    /**
     * 초기화
     */
    function init() {
        // DOM 요소 캐싱
        modal = document.getElementById('display-settings-modal');
        if (!modal) {
            console.warn('display-settings-modal not found');
            return;
        }

        modalBack = modal.querySelector('.modal-back');
        modalContent = modal.querySelector('.modal-content');
        openButton = document.querySelector('.btn-display-settings');
        closeButton = modal.querySelector('.btn-close');
        resetButton = document.getElementById('display-settings-reset');
        applyButton = document.getElementById('display-settings-apply');
        zoomOptions = modal.querySelectorAll('.zoom-option');
        modeOptions = modal.querySelectorAll('.mode-option');

        // 저장된 설정 불러오기
        loadSettings();

        // 설정 적용
        applySettings(currentSettings);
        updateUI(currentSettings);

        // 이벤트 바인딩
        bindEvents();
    }

    /**
     * 이벤트 바인딩
     */
    function bindEvents() {
        // 열기 버튼
        if (openButton) {
            openButton.addEventListener('click', openModal);
        }

        // 닫기 버튼
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        // 배경 클릭으로 닫기
        if (modalBack) {
            modalBack.addEventListener('click', closeModal);
        }

        // 초기화 버튼
        if (resetButton) {
            resetButton.addEventListener('click', resetSettings);
        }

        // 적용 버튼
        if (applyButton) {
            applyButton.addEventListener('click', confirmSettings);
        }

        // 화면 크기 옵션
        zoomOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                selectZoomOption(this);
            });

            // 키보드 탐색
            option.addEventListener('keydown', function(e) {
                handleOptionKeydown(e, zoomOptions, selectZoomOption);
            });
        });

        // 화면 모드 옵션
        modeOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                selectModeOption(this);
            });

            // 키보드 탐색
            option.addEventListener('keydown', function(e) {
                handleOptionKeydown(e, modeOptions, selectModeOption);
            });
        });

        // ESC 키로 모달 닫기
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // 포커스 트랩
        modal.addEventListener('keydown', trapFocus);
    }

    /**
     * 모달 열기
     */
    function openModal() {
        if (!modal) return;

        // 현재 포커스 요소 저장
        previousFocusElement = document.activeElement;

        // 임시 설정 초기화
        tempSettings = Object.assign({}, currentSettings);
        updateUI(tempSettings);

        // 모달 열기 애니메이션
        modal.classList.add('in');

        // 약간의 딜레이 후 shown 클래스 추가 (애니메이션 효과)
        requestAnimationFrame(function() {
            modal.classList.add('shown');
            if (modalBack) {
                modalBack.classList.add('in');
            }
        });

        // body 스크롤 방지
        document.body.style.overflow = 'hidden';

        // 모달 콘텐츠로 포커스 이동
        if (modalContent) {
            modalContent.focus();
        }

        // 열기 버튼 상태 업데이트
        if (openButton) {
            openButton.setAttribute('aria-expanded', 'true');
        }
    }

    /**
     * 모달 닫기
     */
    function closeModal() {
        if (!modal) return;

        // 모달 닫기
        modal.classList.remove('shown');

        if (modalBack) {
            modalBack.classList.remove('in');
        }

        // 애니메이션 완료 후 클래스 제거
        setTimeout(function() {
            modal.classList.remove('in');
        }, 300);

        // body 스크롤 복원
        document.body.style.overflow = '';

        // 이전 포커스로 복귀
        if (previousFocusElement) {
            previousFocusElement.focus();
        }

        // 열기 버튼 상태 업데이트
        if (openButton) {
            openButton.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * 포커스 트랩
     */
    function trapFocus(e) {
        if (e.key !== 'Tab') return;

        var focusableElements = modal.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        var firstElement = focusableElements[0];
        var lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * 화면 크기 옵션 선택
     */
    function selectZoomOption(option) {
        var zoom = parseFloat(option.getAttribute('data-zoom'));

        // 활성 상태 업데이트
        zoomOptions.forEach(function(opt) {
            opt.classList.remove('active');
            opt.setAttribute('aria-checked', 'false');
        });

        option.classList.add('active');
        option.setAttribute('aria-checked', 'true');

        // 임시 설정 업데이트
        tempSettings.zoom = zoom;

        // 실시간 미리보기
        previewZoom(zoom);
    }

    /**
     * 화면 모드 옵션 선택
     */
    function selectModeOption(option) {
        var mode = option.getAttribute('data-mode');

        // 활성 상태 업데이트
        modeOptions.forEach(function(opt) {
            opt.classList.remove('active');
            opt.setAttribute('aria-checked', 'false');
        });

        option.classList.add('active');
        option.setAttribute('aria-checked', 'true');

        // 임시 설정 업데이트
        tempSettings.mode = mode;

        // 실시간 미리보기
        previewMode(mode);
    }

    /**
     * 옵션 키보드 탐색 핸들러
     */
    function handleOptionKeydown(e, options, selectFn) {
        var currentIndex = Array.from(options).indexOf(document.activeElement);
        var newIndex = currentIndex;

        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                selectFn(options[currentIndex]);
                return;
            default:
                return;
        }

        options[newIndex].focus();
    }

    /**
     * 화면 크기 미리보기
     */
    function previewZoom(zoom) {
        document.documentElement.style.setProperty('--krds-zoom-current', zoom);
        document.body.style.zoom = zoom;
    }

    /**
     * 화면 모드 미리보기
     */
    function previewMode(mode) {
        if (mode === 'high-contrast') {
            document.documentElement.setAttribute('data-krds-mode', 'high-contrast');
        } else {
            document.documentElement.removeAttribute('data-krds-mode');
        }
    }

    /**
     * 설정 초기화
     */
    function resetSettings() {
        tempSettings = Object.assign({}, DEFAULT_SETTINGS);
        updateUI(tempSettings);
        previewZoom(tempSettings.zoom);
        previewMode(tempSettings.mode);
    }

    /**
     * 설정 확정 (적용 버튼)
     */
    function confirmSettings() {
        currentSettings = Object.assign({}, tempSettings);
        saveSettings();
        closeModal();
    }

    /**
     * 설정 적용
     */
    function applySettings(settings) {
        previewZoom(settings.zoom);
        previewMode(settings.mode);
    }

    /**
     * UI 업데이트
     */
    function updateUI(settings) {
        // 화면 크기 옵션 업데이트
        zoomOptions.forEach(function(option) {
            var zoom = parseFloat(option.getAttribute('data-zoom'));
            if (zoom === settings.zoom) {
                option.classList.add('active');
                option.setAttribute('aria-checked', 'true');
            } else {
                option.classList.remove('active');
                option.setAttribute('aria-checked', 'false');
            }
        });

        // 화면 모드 옵션 업데이트
        modeOptions.forEach(function(option) {
            var mode = option.getAttribute('data-mode');
            if (mode === settings.mode) {
                option.classList.add('active');
                option.setAttribute('aria-checked', 'true');
            } else {
                option.classList.remove('active');
                option.setAttribute('aria-checked', 'false');
            }
        });
    }

    /**
     * 설정 저장 (localStorage)
     */
    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
        } catch (e) {
            console.warn('Failed to save display settings:', e);
        }
    }

    /**
     * 설정 불러오기 (localStorage)
     */
    function loadSettings() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                currentSettings = Object.assign({}, DEFAULT_SETTINGS, parsed);
            }
        } catch (e) {
            console.warn('Failed to load display settings:', e);
            currentSettings = Object.assign({}, DEFAULT_SETTINGS);
        }
    }

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 전역 API 노출 (선택적)
    window.DasanDisplaySettings = {
        open: openModal,
        close: closeModal,
        reset: resetSettings,
        apply: confirmSettings,
        getSettings: function() {
            return Object.assign({}, currentSettings);
        }
    };

})();
