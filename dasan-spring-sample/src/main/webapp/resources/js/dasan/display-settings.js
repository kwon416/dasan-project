/**
 * 글자·화면 설정 모달 스크립트
 * KRDS 라디오 버튼 컴포넌트 기반
 * 참조: https://www.krds.go.kr/html/site/component/component_06_01.html
 *
 * 기능:
 * - 화면 크기(zoom) 조정: 90%, 100%, 110%, 130%, 150%
 * - 화면 모드: 기본(밝은 배경) / 선명하게(어두운 배경) / 시스템 설정
 * - localStorage를 통한 설정 저장/복원
 * - 실시간 미리보기
 */

(function() {
    'use strict';

    // 설정 키
    var STORAGE_KEY = 'dasan-display-settings';

    // 기본 설정
    var DEFAULT_SETTINGS = {
        zoom: 1,
        scale: 'md',
        mode: 'light'
    };

    // 현재 설정
    var currentSettings = Object.assign({}, DEFAULT_SETTINGS);

    // DOM 요소 참조
    var modal = null;
    var modalBack = null;
    var modalContent = null;
    var openButton = null;
    var closeButtons = null;
    var resetButton = null;
    var zoomRadios = null;
    var modeRadios = null;

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
        closeButtons = modal.querySelectorAll('.btn-modal-close, .btn-close-x, .close-modal');
        resetButton = document.getElementById('display-settings-reset');

        // KRDS 라디오 버튼
        zoomRadios = modal.querySelectorAll('input[name="zoom-scale"]');
        modeRadios = modal.querySelectorAll('input[name="display-mode"]');

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

        // 닫기 버튼들
        closeButtons.forEach(function(btn) {
            btn.addEventListener('click', closeModal);
        });

        // 배경 클릭으로 닫기
        if (modalBack) {
            modalBack.addEventListener('click', closeModal);
        }

        // 초기화 버튼
        if (resetButton) {
            resetButton.addEventListener('click', resetSettings);
        }

        // 화면 크기 라디오 버튼 (실시간 적용)
        zoomRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    var zoom = parseFloat(this.value);
                    var scale = this.getAttribute('data-adjust-scale');
                    currentSettings.zoom = zoom;
                    currentSettings.scale = scale;
                    applyZoom(zoom);
                    saveSettings();
                }
            });
        });

        // 화면 모드 라디오 버튼 (실시간 적용)
        modeRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    var mode = this.getAttribute('data-mode');
                    currentSettings.mode = mode;
                    applyMode(mode);
                    saveSettings();
                }
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

        // UI 업데이트
        updateUI(currentSettings);

        // 모달 열기 애니메이션
        modal.classList.add('in');

        requestAnimationFrame(function() {
            modal.classList.add('shown');
            if (modalBack) {
                modalBack.classList.add('in');
            }
        });

        // body 스크롤 방지
        document.body.style.overflow = 'hidden';

        // 첫 번째 라디오 버튼으로 포커스 이동
        var firstRadio = modal.querySelector('input[type="radio"]:checked');
        if (firstRadio) {
            firstRadio.focus();
        } else if (modalContent) {
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

        modal.classList.remove('shown');

        if (modalBack) {
            modalBack.classList.remove('in');
        }

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
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * 설정 초기화
     */
    function resetSettings() {
        currentSettings = Object.assign({}, DEFAULT_SETTINGS);
        updateUI(currentSettings);
        applySettings(currentSettings);
        saveSettings();

        // 기본 옵션으로 포커스 이동
        var defaultZoom = modal.querySelector('#zoom-md');
        if (defaultZoom) {
            defaultZoom.focus();
        }
    }

    /**
     * 설정 적용
     */
    function applySettings(settings) {
        applyZoom(settings.zoom);
        applyMode(settings.mode);
    }

    /**
     * 화면 크기 적용
     */
    function applyZoom(zoom) {
        document.documentElement.style.setProperty('--krds-zoom-current', zoom);
        document.body.style.zoom = zoom;
    }

    /**
     * 화면 모드 적용
     */
    function applyMode(mode) {
        var html = document.documentElement;

        if (mode === 'high-contrast') {
            html.setAttribute('data-krds-mode', 'high-contrast');
        } else if (mode === 'system') {
            // 시스템 설정 따르기
            html.setAttribute('data-krds-mode', 'theme');
        } else {
            // 기본 (밝은 배경)
            html.removeAttribute('data-krds-mode');
        }
    }

    /**
     * UI 업데이트
     */
    function updateUI(settings) {
        // 화면 크기 라디오 버튼 업데이트
        zoomRadios.forEach(function(radio) {
            var scale = radio.getAttribute('data-adjust-scale');
            radio.checked = (scale === settings.scale);
        });

        // 화면 모드 라디오 버튼 업데이트
        modeRadios.forEach(function(radio) {
            var mode = radio.getAttribute('data-mode');
            radio.checked = (mode === settings.mode);
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

    // 전역 API 노출
    window.DasanDisplaySettings = {
        open: openModal,
        close: closeModal,
        reset: resetSettings,
        getSettings: function() {
            return Object.assign({}, currentSettings);
        }
    };

})();
