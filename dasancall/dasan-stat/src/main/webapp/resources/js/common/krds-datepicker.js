/**
 * KRDS DatePicker 공통 모듈
 * region.do 기준으로 통합된 날짜 선택 UI
 *
 * 사용처:
 * - region.do (지역별 분석)
 * - period.do (기간별 분석)
 * - callIssue.do (콜 이슈)
 *
 * 사용법:
 * var datePicker = KrdsDatePicker.init({
 *     startInputId: 'start-date',
 *     endInputId: 'end-date',
 *     quickPeriodSelector: '.quick-period-selector',
 *     quickPeriods: [
 *         { key: '1week', label: '최근 1주', days: 7 },
 *         { key: '1month', label: '최근 1개월', days: 30 }
 *     ],
 *     defaultPeriod: '1week',
 *     onDateChange: function(startDate, endDate) {
 *         console.log('날짜 변경:', startDate, endDate);
 *     }
 * });
 */

var KrdsDatePicker = (function() {
    'use strict';

    // ========================================
    // 기본 설정
    // ========================================
    var DEFAULT_OPTIONS = {
        startInputId: null,
        endInputId: null,
        quickPeriodSelector: null,
        quickPeriods: [
            { key: '1week', label: '최근 1주', days: 7 },
            { key: '1month', label: '최근 1개월', days: 30 }
        ],
        defaultPeriod: '1week',
        dateFormat: 'YYYY.MM.DD',
        onDateChange: null,
        container: null  // 동적 생성 시 사용할 컨테이너
    };

    // 인스턴스 저장소
    var instances = {};
    var instanceCounter = 0;

    // ========================================
    // 유틸리티 함수
    // ========================================

    /**
     * 날짜를 YYYY.MM.DD 형식으로 포맷
     */
    function formatDateDisplay(date) {
        if (!date) return '';
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '.' + month + '.' + day;
    }

    /**
     * YYYY.MM.DD 문자열을 Date 객체로 파싱
     */
    function parseDate(dateStr) {
        if (!dateStr) return null;
        var parts = dateStr.split('.');
        if (parts.length !== 3) return null;
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var day = parseInt(parts[2], 10);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
        return new Date(year, month, day);
    }

    /**
     * 옵션 병합
     */
    function mergeOptions(defaults, options) {
        var result = {};
        for (var key in defaults) {
            result[key] = options && options.hasOwnProperty(key) ? options[key] : defaults[key];
        }
        return result;
    }

    // ========================================
    // 캘린더 HTML 생성
    // ========================================

    /**
     * 캘린더 HTML 생성
     */
    function generateCalendarHTML(year, month) {
        var weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        var monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month + 1, 0);
        var startDay = firstDay.getDay();
        var daysInMonth = lastDay.getDate();

        var today = new Date();
        var todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        var html = '<div class="krds-calendar-wrap" aria-label="달력">';

        // Header
        html += '<div class="krds-calendar-head">';
        html += '<button type="button" class="btn-cal-move prev"><span class="sr-only">이전 달</span></button>';
        html += '<div class="krds-calendar-switch-wrap">';
        html += '<span class="krds-calendar-title">' + year + '년 ' + monthNames[month] + '월</span>';
        html += '</div>';
        html += '<button type="button" class="btn-cal-move next"><span class="sr-only">다음 달</span></button>';
        html += '</div>';

        // Body
        html += '<div class="krds-calendar-body"><div class="krds-calendar-table-wrap">';
        html += '<table class="krds-calendar-tbl"><caption>' + year + '년 ' + monthNames[month] + '월</caption>';
        html += '<thead><tr>';
        weekdays.forEach(function(day) {
            html += '<th>' + day + '</th>';
        });
        html += '</tr></thead><tbody>';

        var day = 1;
        for (var i = 0; i < 6; i++) {
            html += '<tr>';
            for (var j = 0; j < 7; j++) {
                if (i === 0 && j < startDay) {
                    html += '<td class="old"><button type="button" class="btn-set-date" disabled><span></span></button></td>';
                } else if (day > daysInMonth) {
                    html += '<td class="new"><button type="button" class="btn-set-date" disabled><span></span></button></td>';
                } else {
                    var dateStr = year + '-' + (month + 1) + '-' + day;
                    var isToday = dateStr === todayStr;
                    var classes = '';
                    if (j === 0) classes += ' day-off';
                    if (isToday) classes += ' today';

                    html += '<td class="' + classes + '" data-date="' + year + '.' + String(month + 1).padStart(2, '0') + '.' + String(day).padStart(2, '0') + '">';
                    html += '<button type="button" class="btn-set-date"><span>' + day + '</span></button></td>';
                    day++;
                }
            }
            html += '</tr>';
            if (day > daysInMonth) break;
        }

        html += '</tbody></table></div></div>';

        // Footer
        html += '<div class="krds-calendar-footer"><div class="krds-calendar-btn-wrap">';
        html += '<button type="button" class="krds-btn small text btn-cal-today">오늘</button>';
        html += '<button type="button" class="krds-btn small tertiary btn-cal-cancel">취소</button>';
        html += '<button type="button" class="krds-btn small primary btn-cal-confirm">확인</button>';
        html += '</div></div>';

        html += '</div>';
        return html;
    }

    // ========================================
    // DatePicker 인스턴스 클래스
    // ========================================

    function DatePickerInstance(options) {
        this.id = 'krds-datepicker-' + (++instanceCounter);
        this.options = mergeOptions(DEFAULT_OPTIONS, options);
        this.startDate = null;
        this.endDate = null;
        this.selectedDate = null;
        this.currentCalendarInput = null;

        this._init();
    }

    DatePickerInstance.prototype = {
        /**
         * 초기화
         */
        _init: function() {
            var self = this;

            // 초기 날짜 설정
            var today = new Date();
            var defaultDays = 7;

            // 기본 기간에서 일수 찾기
            if (this.options.defaultPeriod && this.options.quickPeriods) {
                for (var i = 0; i < this.options.quickPeriods.length; i++) {
                    if (this.options.quickPeriods[i].key === this.options.defaultPeriod) {
                        defaultDays = this.options.quickPeriods[i].days;
                        break;
                    }
                }
            }

            var startDate = new Date(today);
            startDate.setDate(startDate.getDate() - defaultDays + 1);

            this.startDate = startDate;
            this.endDate = today;

            // input 요소 찾기
            var startInput = document.getElementById(this.options.startInputId);
            var endInput = document.getElementById(this.options.endInputId);

            if (startInput) {
                startInput.value = formatDateDisplay(this.startDate);
            }
            if (endInput) {
                endInput.value = formatDateDisplay(this.endDate);
            }

            // 캘린더 버튼 이벤트
            this._initCalendarButtons();

            // 빠른 선택 버튼 이벤트
            this._initQuickPeriodButtons();

            // 외부 클릭 시 캘린더 닫기
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.calendar-conts') && !e.target.closest('.krds-calendar-area')) {
                    self._closeAllCalendars();
                }
            });
        },

        /**
         * 캘린더 버튼 초기화
         */
        _initCalendarButtons: function() {
            var self = this;

            // 시작일 캘린더 버튼
            var startInput = document.getElementById(this.options.startInputId);
            if (startInput) {
                var startCalendarBtn = startInput.parentElement.querySelector('.form-btn-datepicker');
                if (startCalendarBtn) {
                    startCalendarBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._openCalendar(startInput);
                    });
                }
            }

            // 종료일 캘린더 버튼
            var endInput = document.getElementById(this.options.endInputId);
            if (endInput) {
                var endCalendarBtn = endInput.parentElement.querySelector('.form-btn-datepicker');
                if (endCalendarBtn) {
                    endCalendarBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._openCalendar(endInput);
                    });
                }
            }
        },

        /**
         * 빠른 선택 버튼 초기화
         */
        _initQuickPeriodButtons: function() {
            var self = this;

            if (!this.options.quickPeriodSelector) return;

            // 쉼표로 구분된 여러 셀렉터 지원
            var selectors = this.options.quickPeriodSelector.split(',').map(function(s) { return s.trim(); });
            var containers = [];

            selectors.forEach(function(selector) {
                var el = document.querySelector(selector);
                if (el) containers.push(el);
            });

            if (containers.length === 0) return;

            containers.forEach(function(container) {
                // 라디오 버튼 형식 (KRDS Chip)
                var radios = container.querySelectorAll('input[type="radio"]');
                radios.forEach(function(radio) {
                    radio.addEventListener('change', function() {
                        if (this.checked) {
                            var period = this.getAttribute('data-period');
                            self._applyQuickPeriod(period);
                        }
                    });
                });

                // 버튼 형식 (text button)
                var buttons = container.querySelectorAll('button[data-period]');
                buttons.forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var period = this.getAttribute('data-period');

                        // 모든 컨테이너의 버튼 활성 상태 업데이트
                        containers.forEach(function(c) {
                            c.querySelectorAll('button[data-period]').forEach(function(b) {
                                b.classList.remove('active');
                            });
                        });
                        this.classList.add('active');

                        self._applyQuickPeriod(period);
                    });
                });
            });
        },

        /**
         * 캘린더 열기
         */
        _openCalendar: function(input) {
            var self = this;
            this.currentCalendarInput = input;

            // 기존 캘린더 닫기
            this._closeAllCalendars();

            // 캘린더 영역 확인 또는 생성
            var calendarConts = input.closest('.calendar-conts');
            var calendarArea = calendarConts.querySelector('.krds-calendar-area');

            if (!calendarArea) {
                calendarArea = document.createElement('div');
                calendarArea.className = 'krds-calendar-area';
                calendarConts.appendChild(calendarArea);
            }

            // 현재 input 값에서 날짜 파싱
            var currentDate = parseDate(input.value) || new Date();

            // 캘린더 HTML 생성
            calendarArea.innerHTML = generateCalendarHTML(currentDate.getFullYear(), currentDate.getMonth());

            // 이벤트 바인딩
            this._bindCalendarEvents(calendarArea, input);

            // 열기
            calendarArea.classList.add('open');
        },

        /**
         * 캘린더 이벤트 바인딩
         */
        _bindCalendarEvents: function(calendarArea, input) {
            var self = this;
            this.selectedDate = null;

            // input에 이미 값이 있으면 해당 날짜를 하이라이트
            if (input.value) {
                var currentValue = input.value;
                var targetTd = calendarArea.querySelector('td[data-date="' + currentValue + '"]');
                if (targetTd) {
                    targetTd.classList.add('selected');
                    this.selectedDate = currentValue;
                }
            }

            // 이전/다음 달
            var prevBtn = calendarArea.querySelector('.btn-cal-move.prev');
            var nextBtn = calendarArea.querySelector('.btn-cal-move.next');

            if (prevBtn) {
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._changeCalendarMonth(calendarArea, input, -1);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self._changeCalendarMonth(calendarArea, input, 1);
                });
            }

            // 날짜 선택
            calendarArea.addEventListener('click', function(e) {
                var dateBtn = e.target.closest('.btn-set-date');
                if (dateBtn && !dateBtn.disabled) {
                    var td = dateBtn.closest('td');
                    var date = td.dataset.date;
                    if (date) {
                        // 기존 선택 제거
                        calendarArea.querySelectorAll('td.selected').forEach(function(el) {
                            el.classList.remove('selected');
                        });
                        td.classList.add('selected');
                        self.selectedDate = date;
                    }
                }
            });

            // 오늘 버튼
            var todayBtn = calendarArea.querySelector('.btn-cal-today');
            if (todayBtn) {
                todayBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var today = new Date();
                    input.value = formatDateDisplay(today);
                    calendarArea.classList.remove('open');
                    self._updateDateState();
                });
            }

            // 취소 버튼
            var cancelBtn = calendarArea.querySelector('.btn-cal-cancel');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    calendarArea.classList.remove('open');
                });
            }

            // 확인 버튼
            var confirmBtn = calendarArea.querySelector('.btn-cal-confirm');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (self.selectedDate) {
                        input.value = self.selectedDate;
                        self._updateDateState();
                    }
                    calendarArea.classList.remove('open');
                });
            }
        },

        /**
         * 캘린더 월 변경
         */
        _changeCalendarMonth: function(calendarArea, input, delta) {
            var titleEl = calendarArea.querySelector('.krds-calendar-title');
            var match = titleEl.textContent.match(/(\d+)년\s*(\d+)월/);
            if (match) {
                var year = parseInt(match[1]);
                var month = parseInt(match[2]) - 1 + delta;

                if (month < 0) {
                    month = 11;
                    year--;
                } else if (month > 11) {
                    month = 0;
                    year++;
                }

                calendarArea.innerHTML = generateCalendarHTML(year, month);
                this._bindCalendarEvents(calendarArea, input);
            }
        },

        /**
         * 모든 캘린더 닫기
         */
        _closeAllCalendars: function() {
            document.querySelectorAll('.krds-calendar-area.open').forEach(function(cal) {
                cal.classList.remove('open');
            });
        },

        /**
         * 빠른 기간 적용
         */
        _applyQuickPeriod: function(periodKey) {
            var today = new Date();
            var startDate = new Date(today);
            var days = 7;

            // 기간 일수 찾기
            for (var i = 0; i < this.options.quickPeriods.length; i++) {
                if (this.options.quickPeriods[i].key === periodKey) {
                    days = this.options.quickPeriods[i].days;
                    break;
                }
            }

            startDate.setDate(startDate.getDate() - days + 1);

            var startInput = document.getElementById(this.options.startInputId);
            var endInput = document.getElementById(this.options.endInputId);

            if (startInput && endInput) {
                startInput.value = formatDateDisplay(startDate);
                endInput.value = formatDateDisplay(today);
                this.startDate = startDate;
                this.endDate = today;

                // 콜백 호출
                if (typeof this.options.onDateChange === 'function') {
                    this.options.onDateChange(this.startDate, this.endDate);
                }
            }
        },

        /**
         * 날짜 상태 업데이트
         */
        _updateDateState: function() {
            var startInput = document.getElementById(this.options.startInputId);
            var endInput = document.getElementById(this.options.endInputId);

            if (startInput && startInput.value) {
                this.startDate = parseDate(startInput.value);
            }

            if (endInput && endInput.value) {
                this.endDate = parseDate(endInput.value);
            }

            // 시작일이 종료일보다 큰 경우 조정
            if (this.startDate && this.endDate && this.startDate > this.endDate) {
                // 현재 변경된 input에 따라 다른 input 조정
                if (this.currentCalendarInput === startInput) {
                    endInput.value = formatDateDisplay(this.startDate);
                    this.endDate = this.startDate;
                } else {
                    startInput.value = formatDateDisplay(this.endDate);
                    this.startDate = this.endDate;
                }
            }

            // 콜백 호출
            if (typeof this.options.onDateChange === 'function') {
                this.options.onDateChange(this.startDate, this.endDate);
            }
        },

        /**
         * 날짜 범위 가져오기
         */
        getDateRange: function() {
            return {
                startDate: this.startDate,
                endDate: this.endDate
            };
        },

        /**
         * 날짜 범위 설정하기
         */
        setDateRange: function(startDate, endDate) {
            this.startDate = startDate;
            this.endDate = endDate;

            var startInput = document.getElementById(this.options.startInputId);
            var endInput = document.getElementById(this.options.endInputId);

            if (startInput) {
                startInput.value = formatDateDisplay(startDate);
            }
            if (endInput) {
                endInput.value = formatDateDisplay(endDate);
            }

            // 콜백 호출
            if (typeof this.options.onDateChange === 'function') {
                this.options.onDateChange(this.startDate, this.endDate);
            }
        },

        /**
         * 빠른 선택 적용
         */
        applyQuickPeriod: function(periodKey) {
            this._applyQuickPeriod(periodKey);
        },

        /**
         * 정리
         */
        destroy: function() {
            // 캘린더 영역 제거
            this._closeAllCalendars();

            // 인스턴스 제거
            delete instances[this.id];
        }
    };

    // ========================================
    // Public API
    // ========================================

    return {
        /**
         * DatePicker 초기화
         * @param {Object} options - 설정 옵션
         * @returns {DatePickerInstance} - DatePicker 인스턴스
         */
        init: function(options) {
            var instance = new DatePickerInstance(options);
            instances[instance.id] = instance;
            return instance;
        },

        /**
         * 동적 HTML 생성 (callIssue.do 같은 동적 컨텐츠용)
         * @param {Object} options - 설정 옵션
         * @returns {String} - HTML 문자열
         */
        generateHTML: function(options) {
            options = mergeOptions(DEFAULT_OPTIONS, options);

            var today = new Date();
            var startDate = new Date(today);

            // 기본 기간 설정
            var defaultDays = 1; // 오늘
            if (options.defaultPeriod === 'week') {
                defaultDays = 7;
            } else if (options.defaultPeriod && options.quickPeriods) {
                for (var i = 0; i < options.quickPeriods.length; i++) {
                    if (options.quickPeriods[i].key === options.defaultPeriod) {
                        defaultDays = options.quickPeriods[i].days;
                        break;
                    }
                }
            }

            if (defaultDays > 1) {
                startDate.setDate(startDate.getDate() - defaultDays + 1);
            }

            var datepickerId = options.id || 'dynamic-datepicker-' + (++instanceCounter);
            var html = '<div class="inline-datepicker krds-datepicker" id="' + datepickerId + '" data-datepicker-id="' + datepickerId + '">';

            // 날짜 입력 필드
            html += '<div class="form-conts calendar-conts">';
            html += '  <div class="calendar-input">';
            html += '    <input type="text" id="' + options.startInputId + '" class="krds-input small datepicker date-from" value="' + formatDateDisplay(startDate) + '" placeholder="YYYY.MM.DD" readonly>';
            html += '    <button type="button" class="krds-btn small icon form-btn-datepicker">';
            html += '      <span class="sr-only">시작일 선택</span>';
            html += '      <i class="svg-icon ico-calendar"></i>';
            html += '    </button>';
            html += '  </div>';
            html += '</div>';

            html += '<span class="date-separator">~</span>';

            html += '<div class="form-conts calendar-conts">';
            html += '  <div class="calendar-input">';
            html += '    <input type="text" id="' + options.endInputId + '" class="krds-input small datepicker date-to" value="' + formatDateDisplay(today) + '" placeholder="YYYY.MM.DD" readonly>';
            html += '    <button type="button" class="krds-btn small icon form-btn-datepicker">';
            html += '      <span class="sr-only">종료일 선택</span>';
            html += '      <i class="svg-icon ico-calendar"></i>';
            html += '    </button>';
            html += '  </div>';
            html += '</div>';

            // 빠른 선택 버튼 (KRDS radio chip 스타일)
            if (options.quickPeriods && options.quickPeriods.length > 0) {
                var radioName = 'quick-period-' + datepickerId;
                html += '<div class="krds-check-area quick-period-selector">';
                options.quickPeriods.forEach(function(period, index) {
                    var isActive = (options.defaultPeriod === period.key) ||
                                   (options.defaultPeriod === 'today' && period.key === 'today') ||
                                   (index === 0 && !options.defaultPeriod);
                    var radioId = 'period-' + period.key + '-' + datepickerId;
                    html += '<div class="krds-form-chip">';
                    html += '  <input type="radio" class="radio" name="' + radioName + '" id="' + radioId + '" data-period="' + period.key + '"' + (isActive ? ' checked' : '') + '>';
                    html += '  <label class="krds-form-chip-outline" for="' + radioId + '">' + period.label + '</label>';
                    html += '</div>';
                });
                html += '</div>';
            }

            html += '</div>';

            return html;
        },

        /**
         * 동적으로 생성된 DatePicker 초기화
         * @param {String|HTMLElement} container - 컨테이너 요소 또는 선택자
         * @param {Object} options - 설정 옵션
         * @returns {DatePickerInstance} - DatePicker 인스턴스
         */
        initDynamic: function(container, options) {
            if (typeof container === 'string') {
                container = document.querySelector(container);
            }
            if (!container) return null;

            var datepickerEl = container.querySelector('.krds-datepicker');
            if (!datepickerEl) return null;

            // input ID 자동 감지
            var startInput = datepickerEl.querySelector('.date-from');
            var endInput = datepickerEl.querySelector('.date-to');

            options = mergeOptions(DEFAULT_OPTIONS, options || {});
            if (startInput) options.startInputId = startInput.id;
            if (endInput) options.endInputId = endInput.id;

            // 빠른 선택 버튼이 있으면 셀렉터 설정
            var quickBtns = datepickerEl.querySelector('.quick-period-selector, .quick-period-btns');
            if (quickBtns && datepickerEl.id) {
                options.quickPeriodSelector = '#' + datepickerEl.id + ' .quick-period-selector, #' + datepickerEl.id + ' .quick-period-btns';
            }

            return this.init(options);
        },

        /**
         * 날짜 범위 가져오기
         * @param {DatePickerInstance} instance - DatePicker 인스턴스
         * @returns {Object} - { startDate, endDate }
         */
        getDateRange: function(instance) {
            if (instance && typeof instance.getDateRange === 'function') {
                return instance.getDateRange();
            }
            return null;
        },

        /**
         * 날짜 범위 설정
         * @param {DatePickerInstance} instance - DatePicker 인스턴스
         * @param {Date} startDate - 시작일
         * @param {Date} endDate - 종료일
         */
        setDateRange: function(instance, startDate, endDate) {
            if (instance && typeof instance.setDateRange === 'function') {
                instance.setDateRange(startDate, endDate);
            }
        },

        /**
         * 빠른 선택 적용
         * @param {DatePickerInstance} instance - DatePicker 인스턴스
         * @param {String} periodKey - 기간 키 (예: '1week', '1month')
         */
        applyQuickPeriod: function(instance, periodKey) {
            if (instance && typeof instance.applyQuickPeriod === 'function') {
                instance.applyQuickPeriod(periodKey);
            }
        },

        /**
         * 인스턴스 정리
         * @param {DatePickerInstance} instance - DatePicker 인스턴스
         */
        destroy: function(instance) {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        },

        /**
         * 날짜 포맷 유틸리티
         */
        formatDateDisplay: formatDateDisplay,
        parseDate: parseDate
    };

})();

// AMD/CommonJS 호환
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KrdsDatePicker;
} else if (typeof define === 'function' && define.amd) {
    define(function() { return KrdsDatePicker; });
}
