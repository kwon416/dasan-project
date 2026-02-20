/**
 * 모바일 사이드바 메뉴 스크립트
 * KRDS 모바일 메뉴 컴포넌트 기반
 *
 * 기능:
 * - 전체메뉴 버튼 클릭으로 사이드바 열기
 * - 닫기 버튼, 배경 클릭, ESC 키로 사이드바 닫기
 * - 접근성 지원 (aria-expanded, 포커스 관리)
 */

(function() {
    'use strict';

    // DOM 요소 참조
    var sidebar = null;
    var gnbWrap = null;
    var openButton = null;
    var closeButton = null;
    var previousFocusElement = null;

    /**
     * 초기화
     */
    function init() {
        // DOM 요소 캐싱
        sidebar = document.getElementById('mobile-nav');
        if (!sidebar) {
            console.warn('mobile-nav not found');
            return;
        }

        gnbWrap = sidebar.querySelector('.gnb-wrap');
        openButton = document.querySelector('.btn-navi.all');
        closeButton = document.getElementById('close-nav');

        if (!openButton) {
            console.warn('btn-navi.all not found');
            return;
        }

        // 초기 aria-expanded 설정
        openButton.setAttribute('aria-expanded', 'false');

        // 이벤트 바인딩
        bindEvents();
    }

    /**
     * 이벤트 바인딩
     */
    function bindEvents() {
        // 열기 버튼
        if (openButton) {
            openButton.addEventListener('click', openSidebar);
        }

        // 닫기 버튼
        if (closeButton) {
            closeButton.addEventListener('click', closeSidebar);
        }

        // 배경 클릭으로 닫기 (사이드바 자체 클릭)
        if (sidebar) {
            sidebar.addEventListener('click', function(e) {
                // gnb-wrap 외부 클릭 시 닫기 (배경 영역)
                if (e.target === sidebar) {
                    closeSidebar();
                }
            });
        }

        // ESC 키로 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen()) {
                closeSidebar();
            }
        });
    }

    /**
     * 사이드바 열기
     */
    function openSidebar() {
        if (!sidebar) return;

        // 현재 포커스 요소 저장
        previousFocusElement = document.activeElement;

        // 사이드바 열기 클래스 추가
        sidebar.classList.add('is-open');

        // 약간의 지연 후 배경 딤 추가 (애니메이션 효과)
        requestAnimationFrame(function() {
            sidebar.classList.add('is-backdrop');
        });

        // body 스크롤 방지
        document.body.style.overflow = 'hidden';

        // gnb-wrap에 포커스 이동
        if (gnbWrap) {
            gnbWrap.focus();
        }

        // aria-expanded 업데이트
        if (openButton) {
            openButton.setAttribute('aria-expanded', 'true');
        }
    }

    /**
     * 사이드바 닫기
     */
    function closeSidebar() {
        if (!sidebar) return;

        // 사이드바 닫기 클래스 제거
        sidebar.classList.remove('is-open');
        sidebar.classList.remove('is-backdrop');

        // body 스크롤 복원
        document.body.style.overflow = '';

        // 이전 포커스로 복귀
        if (previousFocusElement) {
            previousFocusElement.focus();
        }

        // aria-expanded 업데이트
        if (openButton) {
            openButton.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * 사이드바 열림 상태 확인
     */
    function isOpen() {
        return sidebar && sidebar.classList.contains('is-open');
    }

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 전역 API 노출
    window.DasanMobileSidebar = {
        open: openSidebar,
        close: closeSidebar,
        isOpen: isOpen
    };

})();
