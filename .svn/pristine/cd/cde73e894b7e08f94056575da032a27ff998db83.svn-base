/**
 * 다산콜 다운로드 유틸리티
 * @description CSV, Excel, 이미지 다운로드 공통 기능
 * @requires XLSX (Excel 다운로드용)
 * @requires html2canvas (이미지 다운로드용)
 */
var DasanDownload = (function() {
    'use strict';

    /**
     * Blob을 파일로 저장
     * @param {Blob} blob - 저장할 Blob
     * @param {string} filename - 파일명
     */
    function saveFile(blob, filename) {
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    /**
     * 현재 날짜를 파일명용 문자열로 반환
     * @returns {string} YYYYMMDD 형식
     */
    function getDateSuffix() {
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        return year + month + day;
    }

    return {
        /**
         * 데이터를 CSV 파일로 다운로드
         * @param {Array} data - 데이터 배열 [{label: '', value: ''}, ...]
         * @param {string} filename - 파일명 (확장자 제외)
         * @param {Object} options - 옵션
         * @param {Array} options.headers - 헤더 배열 ['날짜', '건수']
         * @param {Array} options.keys - 데이터 키 배열 ['label', 'value']
         */
        downloadCSV: function(data, filename, options) {
            options = options || {};
            var headers = options.headers || ['항목', '값'];
            var keys = options.keys || ['label', 'value'];

            var csvContent = headers.join(',') + '\n';

            data.forEach(function(row) {
                var values = keys.map(function(key) {
                    var val = row[key];
                    // 쉼표나 줄바꿈이 포함된 경우 따옴표로 감싸기
                    if (typeof val === 'string' && (val.indexOf(',') !== -1 || val.indexOf('\n') !== -1)) {
                        return '"' + val.replace(/"/g, '""') + '"';
                    }
                    return val;
                });
                csvContent += values.join(',') + '\n';
            });

            var blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            var fullFilename = filename + '_' + getDateSuffix() + '.csv';
            saveFile(blob, fullFilename);
        },

        /**
         * 데이터를 Excel 파일로 다운로드
         * @param {Array} data - 데이터 배열
         * @param {string} filename - 파일명 (확장자 제외)
         * @param {Object} options - 옵션
         * @param {string} options.sheetName - 시트명
         * @param {Array} options.headers - 헤더 배열
         * @param {Array} options.keys - 데이터 키 배열
         */
        downloadExcel: function(data, filename, options) {
            if (typeof XLSX === 'undefined') {
                console.error('XLSX 라이브러리가 로드되지 않았습니다.');
                return false;
            }

            options = options || {};
            var sheetName = options.sheetName || 'Data';
            var headers = options.headers || ['항목', '값'];
            var keys = options.keys || ['label', 'value'];

            // 헤더 행 추가
            var wsData = [headers];

            // 데이터 행 추가
            data.forEach(function(row) {
                var values = keys.map(function(key) {
                    return row[key];
                });
                wsData.push(values);
            });

            var ws = XLSX.utils.aoa_to_sheet(wsData);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, sheetName);

            var fullFilename = filename + '_' + getDateSuffix() + '.xlsx';
            XLSX.writeFile(wb, fullFilename);
            return true;
        },

        /**
         * 다중 시트 Excel 파일로 다운로드
         * @param {Array} sheets - 시트 배열 [{name: '', data: [], headers: [], keys: []}, ...]
         * @param {string} filename - 파일명 (확장자 제외)
         */
        downloadExcelMultiSheet: function(sheets, filename) {
            if (typeof XLSX === 'undefined') {
                console.error('XLSX 라이브러리가 로드되지 않았습니다.');
                return false;
            }

            var wb = XLSX.utils.book_new();

            sheets.forEach(function(sheet) {
                var headers = sheet.headers || ['항목', '값'];
                var keys = sheet.keys || ['label', 'value'];
                var wsData = [headers];

                sheet.data.forEach(function(row) {
                    var values = keys.map(function(key) {
                        return row[key];
                    });
                    wsData.push(values);
                });

                var ws = XLSX.utils.aoa_to_sheet(wsData);
                XLSX.utils.book_append_sheet(wb, ws, sheet.name || 'Sheet');
            });

            var fullFilename = filename + '_' + getDateSuffix() + '.xlsx';
            XLSX.writeFile(wb, fullFilename);
            return true;
        },

        /**
         * DOM 요소를 이미지로 다운로드
         * @param {string|HTMLElement} element - 요소 ID 또는 DOM 요소
         * @param {string} filename - 파일명 (확장자 제외)
         * @param {Object} options - html2canvas 옵션
         */
        downloadImage: function(element, filename, options) {
            if (typeof html2canvas === 'undefined') {
                console.error('html2canvas 라이브러리가 로드되지 않았습니다.');
                return false;
            }

            var targetElement = typeof element === 'string'
                ? document.getElementById(element)
                : element;

            if (!targetElement) {
                console.error('다운로드할 요소를 찾을 수 없습니다.');
                return false;
            }

            var defaultOptions = {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                logging: false
            };

            var mergedOptions = Object.assign({}, defaultOptions, options || {});

            html2canvas(targetElement, mergedOptions).then(function(canvas) {
                canvas.toBlob(function(blob) {
                    var fullFilename = filename + '_' + getDateSuffix() + '.png';
                    saveFile(blob, fullFilename);
                }, 'image/png');
            }).catch(function(error) {
                console.error('이미지 생성 실패:', error);
            });

            return true;
        },

        /**
         * 차트를 이미지로 다운로드 (ECharts용)
         * @param {Object} chart - ECharts 인스턴스
         * @param {string} filename - 파일명 (확장자 제외)
         * @param {Object} options - 옵션
         */
        downloadChartImage: function(chart, filename, options) {
            if (!chart || typeof chart.getDataURL !== 'function') {
                console.error('유효한 ECharts 인스턴스가 아닙니다.');
                return false;
            }

            options = options || {};
            var pixelRatio = options.pixelRatio || 2;
            var backgroundColor = options.backgroundColor || '#ffffff';

            var url = chart.getDataURL({
                type: 'png',
                pixelRatio: pixelRatio,
                backgroundColor: backgroundColor
            });

            var link = document.createElement('a');
            link.href = url;
            link.download = filename + '_' + getDateSuffix() + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        },

        /**
         * Blob 저장 함수 (외부 사용용)
         */
        saveFile: saveFile,

        /**
         * 날짜 접미사 생성 함수 (외부 사용용)
         */
        getDateSuffix: getDateSuffix
    };
})();

// AMD/CommonJS 호환
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DasanDownload;
} else if (typeof define === 'function' && define.amd) {
    define(function() { return DasanDownload; });
}
