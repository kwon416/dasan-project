/**
 * 다산콜 공통 유틸리티 함수
 * @description 여러 페이지에서 공통으로 사용하는 유틸리티 함수 모음
 */
var DasanUtils = (function() {
    'use strict';

    return {
        /**
         * 숫자에 천단위 콤마 추가
         * @param {number|string} num - 포맷할 숫자
         * @returns {string} 콤마가 추가된 문자열
         */
        formatNumber: function(num) {
            if (num === null || num === undefined) return '0';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        /**
         * 날짜를 ISO 형식으로 포맷 (YYYY-MM-DD)
         * @param {Date|string} date - 포맷할 날짜
         * @returns {string} YYYY-MM-DD 형식 문자열
         */
        formatDateISO: function(date) {
            var d = date instanceof Date ? date : new Date(date);
            if (isNaN(d.getTime())) return '';
            var year = d.getFullYear();
            var month = String(d.getMonth() + 1).padStart(2, '0');
            var day = String(d.getDate()).padStart(2, '0');
            return year + '-' + month + '-' + day;
        },

        /**
         * 날짜를 표시 형식으로 포맷 (YYYY.MM.DD)
         * @param {Date|string} date - 포맷할 날짜
         * @returns {string} YYYY.MM.DD 형식 문자열
         */
        formatDateDisplay: function(date) {
            var d = date instanceof Date ? date : new Date(date);
            if (isNaN(d.getTime())) return '';
            var year = d.getFullYear();
            var month = String(d.getMonth() + 1).padStart(2, '0');
            var day = String(d.getDate()).padStart(2, '0');
            return year + '.' + month + '.' + day;
        },

        /**
         * 날짜를 한글 표시 형식으로 포맷 (YYYY년 M월 D일)
         * @param {Date|string} date - 포맷할 날짜
         * @returns {string} 한글 형식 문자열
         */
        formatDateKorean: function(date) {
            var d = date instanceof Date ? date : new Date(date);
            if (isNaN(d.getTime())) return '';
            return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일';
        },

        /**
         * YYYY.MM.DD 문자열을 Date 객체로 파싱
         * @param {string} dateStr - 파싱할 날짜 문자열
         * @returns {Date|null} Date 객체 또는 null
         */
        parseDate: function(dateStr) {
            if (!dateStr) return null;
            var parts = dateStr.split('.');
            if (parts.length !== 3) return null;
            var year = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10);
            var day = parseInt(parts[2], 10);

            // 유효성 검증
            if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
            if (month < 1 || month > 12) return null;
            if (day < 1 || day > 31) return null;
            if (year < 1900 || year > 2100) return null;

            var date = new Date(year, month - 1, day);
            // 실제 날짜 유효성 검증 (예: 2월 30일 방지)
            if (date.getMonth() !== month - 1) return null;

            return date;
        },

        /**
         * HTML 이스케이프 처리 (XSS 방지)
         * @param {string} str - 이스케이프할 문자열
         * @returns {string} 이스케이프된 문자열
         */
        escapeHtml: function(str) {
            if (!str) return '';
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        },

        /**
         * 검색어 하이라이팅 (XSS 안전)
         * @param {string} text - 원본 텍스트
         * @param {string} query - 검색어
         * @returns {string} 하이라이팅된 HTML
         */
        highlightText: function(text, query) {
            if (!query || !query.trim()) return this.escapeHtml(text);

            var safeText = this.escapeHtml(text);
            var safeQuery = this.escapeHtml(query);
            var escapedQuery = safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var regex = new RegExp('(' + escapedQuery + ')', 'gi');
            return safeText.replace(regex, '<span class="highlight">$1</span>');
        },

        /**
         * 정규식 특수문자 이스케이프
         * @param {string} str - 이스케이프할 문자열
         * @returns {string} 이스케이프된 문자열
         */
        escapeRegex: function(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        /**
         * 두 날짜 사이의 일수 계산
         * @param {Date} startDate - 시작일
         * @param {Date} endDate - 종료일
         * @returns {number} 일수
         */
        getDaysBetween: function(startDate, endDate) {
            var oneDay = 24 * 60 * 60 * 1000;
            return Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
        },

        /**
         * 디바운스 함수
         * @param {Function} func - 실행할 함수
         * @param {number} wait - 대기 시간 (ms)
         * @returns {Function} 디바운스된 함수
         */
        debounce: function(func, wait) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        },

        /**
         * Context Path 가져오기
         * @returns {string} Context Path
         */
        getContextPath: function() {
            var path = window.location.pathname;
            var contextPath = path.substring(0, path.indexOf('/', 1));
            return contextPath || '';
        }
    };
})();

/**
 * 날짜 검증 및 처리 유틸리티
 * @description DatePicker와 함께 사용하는 날짜 검증 및 포맷 함수 모음
 */
var DasanDateValidator = (function() {
    'use strict';

    return {
        /**
         * 날짜 범위 유효성 검증
         * @param {Date} startDate - 시작일
         * @param {Date} endDate - 종료일
         * @param {Object} options - 검증 옵션
         * @param {number} options.maxDays - 최대 허용 일수 (기본: 365)
         * @param {boolean} options.allowSameDay - 동일 날짜 허용 여부 (기본: true)
         * @param {boolean} options.allowFutureDate - 미래 날짜 허용 여부 (기본: false)
         * @returns {Object} { valid: boolean, message: string, code: string }
         */
        validateDateRange: function(startDate, endDate, options) {
            options = options || {};
            var maxDays = options.maxDays || 365;
            var allowSameDay = options.allowSameDay !== false;
            var allowFutureDate = options.allowFutureDate === true;

            // 필수 입력 검증
            if (!startDate || !endDate) {
                return {
                    valid: false,
                    message: '시작일과 종료일을 선택해주세요.',
                    code: 'REQUIRED'
                };
            }

            // Date 객체 검증
            if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
                return {
                    valid: false,
                    message: '올바른 날짜 형식이 아닙니다.',
                    code: 'INVALID_FORMAT'
                };
            }

            // NaN 검증
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return {
                    valid: false,
                    message: '유효하지 않은 날짜입니다.',
                    code: 'INVALID_DATE'
                };
            }

            // 날짜 정규화 (시간 제거)
            var normalizedStart = new Date(startDate);
            var normalizedEnd = new Date(endDate);
            normalizedStart.setHours(0, 0, 0, 0);
            normalizedEnd.setHours(0, 0, 0, 0);

            // 날짜 순서 검증
            if (normalizedStart > normalizedEnd) {
                return {
                    valid: false,
                    message: '시작일은 종료일보다 이전이어야 합니다.',
                    code: 'INVALID_ORDER'
                };
            }

            // 동일 날짜 검증
            if (!allowSameDay && normalizedStart.getTime() === normalizedEnd.getTime()) {
                return {
                    valid: false,
                    message: '시작일과 종료일은 달라야 합니다.',
                    code: 'SAME_DATE'
                };
            }

            // 최대 기간 검증
            var days = this.calculateDays(normalizedStart, normalizedEnd);
            if (days > maxDays) {
                return {
                    valid: false,
                    message: '조회 기간은 최대 ' + maxDays + '일까지 선택 가능합니다.',
                    code: 'MAX_PERIOD_EXCEEDED'
                };
            }

            // 미래 날짜 검증
            if (!allowFutureDate) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                if (normalizedEnd > today) {
                    return {
                        valid: false,
                        message: '미래 날짜는 선택할 수 없습니다.',
                        code: 'FUTURE_DATE'
                    };
                }
            }

            return {
                valid: true,
                code: 'SUCCESS',
                days: days
            };
        },

        /**
         * 기간 계산 (일수)
         * @param {Date} startDate - 시작일
         * @param {Date} endDate - 종료일
         * @returns {number} 일수 (시작일과 종료일 포함)
         */
        calculateDays: function(startDate, endDate) {
            var start = new Date(startDate);
            var end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            var diffTime = Math.abs(end - start);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        },

        /**
         * 날짜 포맷 (YYYY-MM-DD)
         * @param {Date} date - 포맷할 날짜
         * @returns {string} YYYY-MM-DD 형식 문자열
         */
        formatDate: function(date) {
            if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
            var year = date.getFullYear();
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var day = String(date.getDate()).padStart(2, '0');
            return year + '-' + month + '-' + day;
        },

        /**
         * 날짜 포맷 (YYYY.MM.DD) - 표시용
         * @param {Date} date - 포맷할 날짜
         * @returns {string} YYYY.MM.DD 형식 문자열
         */
        formatDateDisplay: function(date) {
            if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
            var year = date.getFullYear();
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var day = String(date.getDate()).padStart(2, '0');
            return year + '.' + month + '.' + day;
        },

        /**
         * YYYY.MM.DD 문자열을 Date 객체로 파싱
         * @param {string} dateStr - 파싱할 날짜 문자열 (YYYY.MM.DD 또는 YYYY-MM-DD)
         * @returns {Date|null} Date 객체 또는 null
         */
        parseDate: function(dateStr) {
            if (!dateStr) return null;

            // 구분자 통일 (. 또는 -)
            var separator = dateStr.indexOf('.') > -1 ? '.' : '-';
            var parts = dateStr.split(separator);

            if (parts.length !== 3) return null;

            var year = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10);
            var day = parseInt(parts[2], 10);

            // 유효성 검증
            if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
            if (month < 1 || month > 12) return null;
            if (day < 1 || day > 31) return null;
            if (year < 1900 || year > 2100) return null;

            var date = new Date(year, month - 1, day);

            // 실제 날짜 유효성 검증 (예: 2월 30일 방지)
            if (date.getMonth() !== month - 1) return null;

            return date;
        },

        /**
         * 날짜가 오늘인지 확인
         * @param {Date} date - 확인할 날짜
         * @returns {boolean} 오늘 여부
         */
        isToday: function(date) {
            if (!date || !(date instanceof Date)) return false;
            var today = new Date();
            return date.getFullYear() === today.getFullYear() &&
                   date.getMonth() === today.getMonth() &&
                   date.getDate() === today.getDate();
        },

        /**
         * 날짜가 과거인지 확인
         * @param {Date} date - 확인할 날짜
         * @returns {boolean} 과거 날짜 여부
         */
        isPast: function(date) {
            if (!date || !(date instanceof Date)) return false;
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);
            return checkDate < today;
        },

        /**
         * 날짜가 미래인지 확인
         * @param {Date} date - 확인할 날짜
         * @returns {boolean} 미래 날짜 여부
         */
        isFuture: function(date) {
            if (!date || !(date instanceof Date)) return false;
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);
            return checkDate > today;
        },

        /**
         * N일 전 날짜 계산
         * @param {number} days - 일수
         * @param {Date} baseDate - 기준 날짜 (기본: 오늘)
         * @returns {Date} 계산된 날짜
         */
        subtractDays: function(days, baseDate) {
            var date = baseDate ? new Date(baseDate) : new Date();
            date.setDate(date.getDate() - days);
            return date;
        },

        /**
         * N일 후 날짜 계산
         * @param {number} days - 일수
         * @param {Date} baseDate - 기준 날짜 (기본: 오늘)
         * @returns {Date} 계산된 날짜
         */
        addDays: function(days, baseDate) {
            var date = baseDate ? new Date(baseDate) : new Date();
            date.setDate(date.getDate() + days);
            return date;
        }
    };
})();

// AMD/CommonJS 호환
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DasanUtils;
} else if (typeof define === 'function' && define.amd) {
    define(function() { return DasanUtils; });
}
