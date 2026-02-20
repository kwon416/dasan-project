/**
 * 기간별 분석 페이지 JavaScript
 * - 기간 선택 기능 (공통 모듈 사용)
 * - 빠른 선택 버튼
 * - 분석 유형 네비게이션
 */

(function() {
    'use strict';

    // ========================================
    // 상수 및 설정
    // ========================================
    var QUICK_PERIODS = [
        { key: '1week', label: '1주', days: 7 },
        { key: '1month', label: '1개월', days: 30 },
        { key: '3months', label: '3개월', days: 90 },
        { key: '1year', label: '1년', days: 365 }
    ];

    // 상태 관리
    var state = {
        startDate: null,
        endDate: null,
        selectedPeriod: '1month',
        selectedAnalysisType: null,
        datePicker: null  // DatePicker 인스턴스
    };

    // ========================================
    // 유틸리티 함수
    // ========================================

    /**
     * 날짜를 YYYY.MM.DD 형식으로 포맷 (표시용)
     * @deprecated DasanDateValidator.formatDateDisplay 사용
     */
    function formatDateDisplay(date) {
        return DasanDateValidator.formatDateDisplay(date);
    }

    /**
     * 날짜를 YYYY-MM-DD 형식으로 포맷 (서버 전송용)
     * @deprecated DasanDateValidator.formatDate 사용
     */
    function formatDate(date) {
        return DasanDateValidator.formatDate(date);
    }

    /**
     * 기간 계산 (일수)
     * @deprecated DasanDateValidator.calculateDays 사용
     */
    function calculateDays(startDate, endDate) {
        return DasanDateValidator.calculateDays(startDate, endDate);
    }

    /**
     * 컨텍스트 경로 가져오기
     */
    function getContextPath() {
        var path = window.location.pathname;
        var contextPath = path.substring(0, path.indexOf('/', 1));
        return contextPath || '';
    }

    // ========================================
    // 기간 선택 (공통 모듈 사용)
    // ========================================

    /**
     * 기간 선택 초기화
     */
    function initDatePicker() {
        try {
            // KrdsDatePicker 모듈 존재 확인
            if (typeof KrdsDatePicker === 'undefined') {
                console.error('[DatePicker] KrdsDatePicker 모듈을 찾을 수 없습니다.');
                showDatePickerError('날짜 선택 기능을 불러올 수 없습니다. 페이지를 새로고침해주세요.');
                return null;
            }

            // Input 요소 존재 확인
            var startInput = document.getElementById('period-start-date');
            var endInput = document.getElementById('period-end-date');

            if (!startInput || !endInput) {
                console.error('[DatePicker] 날짜 입력 필드를 찾을 수 없습니다.');
                showDatePickerError('날짜 선택 UI를 초기화할 수 없습니다.');
                return null;
            }

            // DatePicker 초기화
            state.datePicker = KrdsDatePicker.init({
                startInputId: 'period-start-date',
                endInputId: 'period-end-date',
                quickPeriodSelector: null, // 빠른 선택은 별도 버튼으로 처리
                quickPeriods: QUICK_PERIODS,
                defaultPeriod: '1month',
                onDateChange: function(startDate, endDate) {
                    if (!startDate || !endDate) {
                        console.warn('[DatePicker] 유효하지 않은 날짜:', { startDate: startDate, endDate: endDate });
                        return;
                    }

                    state.startDate = startDate;
                    state.endDate = endDate;

                    // 빠른 선택 버튼 비활성화
                    clearQuickSelectActive();

                    // 표시 업데이트
                    updatePeriodDisplay();

                    console.log('[DatePicker] 날짜 변경:', formatDate(startDate), '~', formatDate(endDate));
                }
            });

            if (!state.datePicker) {
                throw new Error('DatePicker 초기화 실패');
            }

            // 초기 상태 동기화
            var dateRange = state.datePicker.getDateRange();
            if (dateRange && dateRange.startDate && dateRange.endDate) {
                state.startDate = dateRange.startDate;
                state.endDate = dateRange.endDate;

                // 초기 표시 업데이트
                updatePeriodDisplay();

                console.log('[DatePicker] 초기화 완료');
            } else {
                throw new Error('DatePicker 날짜 범위를 가져올 수 없습니다');
            }

            return state.datePicker;

        } catch (error) {
            console.error('[DatePicker] 초기화 중 오류:', error);
            showDatePickerError('날짜 선택 기능 초기화에 실패했습니다. 페이지를 새로고침해주세요.');
            return null;
        }
    }

    /**
     * DatePicker 에러 메시지 표시
     * @param {string} message - 에러 메시지
     */
    function showDatePickerError(message) {
        var container = document.querySelector('.period-custom-section');
        if (!container) {
            console.error('[DatePicker] 에러 메시지를 표시할 컨테이너를 찾을 수 없습니다.');
            // 대체 컨테이너 시도
            container = document.querySelector('.period-select-card');
        }

        if (!container) return;

        // 기존 에러 메시지 제거
        var existingError = container.querySelector('.datepicker-error-message');
        if (existingError) {
            existingError.remove();
        }

        // 에러 메시지 생성
        var errorEl = document.createElement('div');
        errorEl.className = 'datepicker-error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: var(--dasan-danger, #dc2626); font-size: 1.3rem; padding: 0.8rem 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.4rem; margin-top: 1rem;';
        errorEl.setAttribute('role', 'alert');

        // 컨테이너 하단에 추가
        container.appendChild(errorEl);

        // 5초 후 자동 제거
        setTimeout(function() {
            if (errorEl && errorEl.parentNode) {
                errorEl.remove();
            }
        }, 5000);
    }

    /**
     * 빠른 선택 버튼 초기화 (KRDS 라디오 칩)
     */
    function initQuickSelectButtons() {
        var radioButtons = document.querySelectorAll('input[name="rdo_period_quick"]');

        radioButtons.forEach(function(radio) {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    var period = this.getAttribute('data-period');
                    state.selectedPeriod = period;

                    // 공통 모듈로 기간 적용
                    if (state.datePicker) {
                        state.datePicker.applyQuickPeriod(period);
                    } else {
                        applyQuickPeriodFallback(period);
                    }
                }
            });
        });

        // 기본값이 이미 checked 속성으로 설정되어 있으므로 초기 날짜 적용
        var checkedRadio = document.querySelector('input[name="rdo_period_quick"]:checked');
        if (checkedRadio) {
            var period = checkedRadio.getAttribute('data-period');
            state.selectedPeriod = period;
            if (state.datePicker) {
                state.datePicker.applyQuickPeriod(period);
            } else {
                applyQuickPeriodFallback(period);
            }
        }
    }

    /**
     * 빠른 선택 버튼 비활성화 (KRDS 라디오 칩)
     */
    function clearQuickSelectActive() {
        var radioButtons = document.querySelectorAll('input[name="rdo_period_quick"]');
        radioButtons.forEach(function(radio) {
            radio.checked = false;
        });
        state.selectedPeriod = null;
    }

    /**
     * 빠른 기간 적용 (폴백용)
     */
    function applyQuickPeriodFallback(periodKey) {
        var today = new Date();
        var startDate = new Date(today);
        var days = 30;

        // 기간 일수 찾기
        for (var i = 0; i < QUICK_PERIODS.length; i++) {
            if (QUICK_PERIODS[i].key === periodKey) {
                days = QUICK_PERIODS[i].days;
                break;
            }
        }

        startDate.setDate(startDate.getDate() - days + 1);

        state.startDate = startDate;
        state.endDate = today;

        // 표시 업데이트
        updatePeriodDisplay();
    }

    /**
     * 기간 표시 업데이트
     */
    function updatePeriodDisplay() {
        var rangeEl = document.getElementById('period-range');

        if (rangeEl && state.startDate && state.endDate) {
            rangeEl.textContent = formatDateDisplay(state.startDate) + ' ~ ' + formatDateDisplay(state.endDate);
        }
    }

    // ========================================
    // 분석 유형 선택
    // ========================================

    /**
     * 분석 유형 카드 초기화
     */
    function initAnalysisTypeCards() {
        var cards = document.querySelectorAll('.analysis-type-card');

        cards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                // 버튼 클릭이 아닌 카드 클릭 시
                if (!e.target.closest('.krds-btn')) {
                    var analysisType = this.getAttribute('data-analysis-type');
                    selectAnalysisType(analysisType);
                }
            });
        });

        // 분석 시작 버튼
        var startButtons = document.querySelectorAll('.analysis-start-btn');
        startButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var analysisType = this.getAttribute('data-analysis-type');
                startAnalysis(analysisType);
            });
        });
    }

    /**
     * 분석 유형 선택
     */
    function selectAnalysisType(analysisType) {
        state.selectedAnalysisType = analysisType;

        var cards = document.querySelectorAll('.analysis-type-card');
        cards.forEach(function(card) {
            var cardType = card.getAttribute('data-analysis-type');
            if (cardType === analysisType) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    /**
     * 분석 시작
     */
    function startAnalysis(analysisType) {
        if (!state.startDate || !state.endDate) {
            alert('기간을 선택해주세요.');
            return;
        }

        var contextPath = getContextPath();
        var startDateStr = formatDate(state.startDate);
        var endDateStr = formatDate(state.endDate);

        var url = '';

        switch (analysisType) {
            case 'keyword':
                url = contextPath + '/complaint/keyword.do';
                break;
            case 'top5':
                url = contextPath + '/complaint/top5.do';
                break;
            default:
                console.warn('알 수 없는 분석 유형:', analysisType);
                return;
        }

        url += '?from=' + startDateStr + '&to=' + endDateStr;

        console.log('분석 시작:', url);
        // 페이지 이동
        window.location.href = url;
    }

    // ========================================
    // 접근성
    // ========================================

    /**
     * 키보드 접근성 초기화
     */
    function initKeyboardAccessibility() {
        // 분석 유형 카드 키보드 접근성
        var cards = document.querySelectorAll('.analysis-type-card');
        cards.forEach(function(card) {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');

            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var analysisType = this.getAttribute('data-analysis-type');
                    startAnalysis(analysisType);
                }
            });
        });
    }

    // ========================================
    // 폼 유효성 검증
    // ========================================

    /**
     * 날짜 유효성 검증
     * @deprecated DasanDateValidator.validateDateRange 사용
     */
    function validateDates() {
        return DasanDateValidator.validateDateRange(state.startDate, state.endDate, {
            maxDays: 365,
            allowFutureDate: false
        });
    }

    /**
     * 날짜 입력 유효성 검증 핸들러
     * 공통 모듈에서 날짜 변경 시 호출되므로, onDateChange 콜백에서 처리
     */
    function setupDateValidation() {
        // 공통 모듈 사용 시 onDateChange 콜백에서 유효성 검증이 자동으로 처리됨
        // 추가적인 UI 표시가 필요한 경우만 여기서 처리

        var startInput = document.getElementById('period-start-date');
        var endInput = document.getElementById('period-end-date');

        if (!startInput || !endInput) return;

        // 에러 메시지 요소 생성 (필요 시)
        function showDateError(message) {
            var errorEl = document.getElementById('date-error-message');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.id = 'date-error-message';
                errorEl.className = 'date-error-message';
                errorEl.setAttribute('role', 'alert');
                errorEl.style.cssText = 'color: var(--dasan-danger); font-size: 1.3rem; margin-top: var(--krds-gap-2);';
                var container = startInput.closest('.period-custom-section');
                if (container) {
                    container.appendChild(errorEl);
                }
            }

            if (message) {
                errorEl.textContent = message;
                errorEl.style.display = 'block';
            } else {
                errorEl.style.display = 'none';
            }
        }

        // 유효성 검증 및 에러 표시
        function validateAndShowError() {
            var validation = validateDates();
            showDateError(validation.valid ? null : validation.message);
        }

        // 상태 변경 감시 (주기적으로 확인하지 않고, 날짜가 변경될 때 호출)
        window.validatePeriodDates = validateAndShowError;
    }

    // ========================================
    // 초기화
    // ========================================

    /**
     * 페이지 초기화
     */
    function init() {
        console.log('기간별 분석 페이지 초기화');

        // 기간 선택 초기화
        initDatePicker();
        initQuickSelectButtons();

        // 분석 유형 카드 초기화
        initAnalysisTypeCards();

        // 접근성 초기화
        initKeyboardAccessibility();

        // 날짜 유효성 검증
        setupDateValidation();
    }

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
