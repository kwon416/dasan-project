/**
 * Top5 키워드 통계 페이지 스크립트
 */
(function() {
    'use strict';

    // Top5 키워드와 색상
    const TOP5_KEYWORDS = ['불법주차', '도로파손', '쓰레기투기', '소음민원', '가로등고장'];
    const KEYWORD_COLORS = {
        '불법주차': '#5B97FF',
        '도로파손': '#FF6B6B',
        '쓰레기투기': '#6FCF97',
        '소음민원': '#FFA94D',
        '가로등고장': '#A78BFA'
    };

    // 샘플 데이터
    const keywordMonthlyStats = {
        '불법주차': [
            { month: '1월', count: 320 }, { month: '2월', count: 295 }, { month: '3월', count: 385 },
            { month: '4월', count: 410 }, { month: '5월', count: 425 }, { month: '6월', count: 398 },
            { month: '7월', count: 456 }, { month: '8월', count: 489 }, { month: '9월', count: 412 },
            { month: '10월', count: 378 }, { month: '11월', count: 312 }, { month: '12월', count: 243 }
        ],
        '도로파손': [
            { month: '1월', count: 456 }, { month: '2월', count: 423 }, { month: '3월', count: 312 },
            { month: '4월', count: 278 }, { month: '5월', count: 256 }, { month: '6월', count: 234 },
            { month: '7월', count: 298 }, { month: '8월', count: 345 }, { month: '9월', count: 312 },
            { month: '10월', count: 289 }, { month: '11월', count: 334 }, { month: '12월', count: 354 }
        ],
        '쓰레기투기': [
            { month: '1월', count: 212 }, { month: '2월', count: 198 }, { month: '3월', count: 267 },
            { month: '4월', count: 312 }, { month: '5월', count: 345 }, { month: '6월', count: 389 },
            { month: '7월', count: 423 }, { month: '8월', count: 456 }, { month: '9월', count: 367 },
            { month: '10월', count: 289 }, { month: '11월', count: 234 }, { month: '12월', count: 164 }
        ],
        '소음민원': [
            { month: '1월', count: 189 }, { month: '2월', count: 176 }, { month: '3월', count: 234 },
            { month: '4월', count: 289 }, { month: '5월', count: 312 }, { month: '6월', count: 356 },
            { month: '7월', count: 398 }, { month: '8월', count: 412 }, { month: '9월', count: 334 },
            { month: '10월', count: 267 }, { month: '11월', count: 198 }, { month: '12월', count: 145 }
        ],
        '가로등고장': [
            { month: '1월', count: 312 }, { month: '2월', count: 289 }, { month: '3월', count: 234 },
            { month: '4월', count: 198 }, { month: '5월', count: 187 }, { month: '6월', count: 176 },
            { month: '7월', count: 189 }, { month: '8월', count: 198 }, { month: '9월', count: 223 },
            { month: '10월', count: 267 }, { month: '11월', count: 312 }, { month: '12월', count: 305 }
        ]
    };

    const keywordHourlyStats = {
        '불법주차': [
            { hour: 0, count: 12 }, { hour: 1, count: 8 }, { hour: 2, count: 5 }, { hour: 3, count: 3 },
            { hour: 4, count: 2 }, { hour: 5, count: 5 }, { hour: 6, count: 18 }, { hour: 7, count: 45 },
            { hour: 8, count: 78 }, { hour: 9, count: 112 }, { hour: 10, count: 134 }, { hour: 11, count: 145 },
            { hour: 12, count: 98 }, { hour: 13, count: 123 }, { hour: 14, count: 134 }, { hour: 15, count: 112 },
            { hour: 16, count: 98 }, { hour: 17, count: 89 }, { hour: 18, count: 78 }, { hour: 19, count: 67 },
            { hour: 20, count: 56 }, { hour: 21, count: 45 }, { hour: 22, count: 34 }, { hour: 23, count: 23 }
        ],
        '도로파손': [
            { hour: 0, count: 5 }, { hour: 1, count: 3 }, { hour: 2, count: 2 }, { hour: 3, count: 1 },
            { hour: 4, count: 2 }, { hour: 5, count: 8 }, { hour: 6, count: 23 }, { hour: 7, count: 56 },
            { hour: 8, count: 89 }, { hour: 9, count: 123 }, { hour: 10, count: 145 }, { hour: 11, count: 156 },
            { hour: 12, count: 112 }, { hour: 13, count: 134 }, { hour: 14, count: 145 }, { hour: 15, count: 123 },
            { hour: 16, count: 98 }, { hour: 17, count: 78 }, { hour: 18, count: 56 }, { hour: 19, count: 45 },
            { hour: 20, count: 34 }, { hour: 21, count: 23 }, { hour: 22, count: 15 }, { hour: 23, count: 8 }
        ],
        '쓰레기투기': [
            { hour: 0, count: 23 }, { hour: 1, count: 18 }, { hour: 2, count: 12 }, { hour: 3, count: 8 },
            { hour: 4, count: 5 }, { hour: 5, count: 12 }, { hour: 6, count: 34 }, { hour: 7, count: 67 },
            { hour: 8, count: 89 }, { hour: 9, count: 98 }, { hour: 10, count: 112 }, { hour: 11, count: 123 },
            { hour: 12, count: 89 }, { hour: 13, count: 98 }, { hour: 14, count: 112 }, { hour: 15, count: 98 },
            { hour: 16, count: 89 }, { hour: 17, count: 78 }, { hour: 18, count: 67 }, { hour: 19, count: 78 },
            { hour: 20, count: 89 }, { hour: 21, count: 78 }, { hour: 22, count: 56 }, { hour: 23, count: 34 }
        ],
        '소음민원': [
            { hour: 0, count: 34 }, { hour: 1, count: 28 }, { hour: 2, count: 23 }, { hour: 3, count: 18 },
            { hour: 4, count: 12 }, { hour: 5, count: 8 }, { hour: 6, count: 15 }, { hour: 7, count: 23 },
            { hour: 8, count: 45 }, { hour: 9, count: 67 }, { hour: 10, count: 89 }, { hour: 11, count: 98 },
            { hour: 12, count: 78 }, { hour: 13, count: 89 }, { hour: 14, count: 98 }, { hour: 15, count: 89 },
            { hour: 16, count: 78 }, { hour: 17, count: 67 }, { hour: 18, count: 89 }, { hour: 19, count: 112 },
            { hour: 20, count: 134 }, { hour: 21, count: 145 }, { hour: 22, count: 112 }, { hour: 23, count: 67 }
        ],
        '가로등고장': [
            { hour: 0, count: 45 }, { hour: 1, count: 34 }, { hour: 2, count: 23 }, { hour: 3, count: 18 },
            { hour: 4, count: 12 }, { hour: 5, count: 23 }, { hour: 6, count: 45 }, { hour: 7, count: 34 },
            { hour: 8, count: 56 }, { hour: 9, count: 78 }, { hour: 10, count: 89 }, { hour: 11, count: 98 },
            { hour: 12, count: 78 }, { hour: 13, count: 89 }, { hour: 14, count: 98 }, { hour: 15, count: 89 },
            { hour: 16, count: 78 }, { hour: 17, count: 89 }, { hour: 18, count: 112 }, { hour: 19, count: 145 },
            { hour: 20, count: 178 }, { hour: 21, count: 156 }, { hour: 22, count: 123 }, { hour: 23, count: 78 }
        ]
    };

    const keywordWeekdayStats = {
        '불법주차': [
            { weekday: '월', count: 712 }, { weekday: '화', count: 734 }, { weekday: '수', count: 698 },
            { weekday: '목', count: 678 }, { weekday: '금', count: 645 }, { weekday: '토', count: 534 }, { weekday: '일', count: 522 }
        ],
        '도로파손': [
            { weekday: '월', count: 623 }, { weekday: '화', count: 645 }, { weekday: '수', count: 612 },
            { weekday: '목', count: 598 }, { weekday: '금', count: 567 }, { weekday: '토', count: 423 }, { weekday: '일', count: 423 }
        ],
        '쓰레기투기': [
            { weekday: '월', count: 567 }, { weekday: '화', count: 578 }, { weekday: '수', count: 556 },
            { weekday: '목', count: 534 }, { weekday: '금', count: 512 }, { weekday: '토', count: 356 }, { weekday: '일', count: 353 }
        ],
        '소음민원': [
            { weekday: '월', count: 456 }, { weekday: '화', count: 478 }, { weekday: '수', count: 467 },
            { weekday: '목', count: 445 }, { weekday: '금', count: 423 }, { weekday: '토', count: 489 }, { weekday: '일', count: 452 }
        ],
        '가로등고장': [
            { weekday: '월', count: 412 }, { weekday: '화', count: 423 }, { weekday: '수', count: 398 },
            { weekday: '목', count: 389 }, { weekday: '금', count: 367 }, { weekday: '토', count: 445 }, { weekday: '일', count: 456 }
        ]
    };

    const keywordSeasonStats = {
        '불법주차': [
            { season: '봄', count: 1220 }, { season: '여름', count: 1343 },
            { season: '가을', count: 1102 }, { season: '겨울', count: 858 }
        ],
        '도로파손': [
            { season: '봄', count: 846 }, { season: '여름', count: 877 },
            { season: '가을', count: 935 }, { season: '겨울', count: 1233 }
        ],
        '쓰레기투기': [
            { season: '봄', count: 924 }, { season: '여름', count: 1268 },
            { season: '가을', count: 890 }, { season: '겨울', count: 574 }
        ],
        '소음민원': [
            { season: '봄', count: 835 }, { season: '여름', count: 1166 },
            { season: '가을', count: 799 }, { season: '겨울', count: 510 }
        ],
        '가로등고장': [
            { season: '봄', count: 619 }, { season: '여름', count: 563 },
            { season: '가을', count: 802 }, { season: '겨울', count: 906 }
        ]
    };

    // URL에서 기간 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    const toParam = urlParams.get('to');

    let dateRange = {
        from: fromParam ? new Date(fromParam) : new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: toParam ? new Date(toParam) : new Date()
    };

    // 차트 인스턴스
    const charts = {};

    // DOM 요소
    const periodDisplay = document.getElementById('period-display');
    const top5Cards = document.getElementById('top5-cards');
    const keywordLegend = document.getElementById('keyword-legend');
    const statsTableBody = document.getElementById('stats-table-body');

    // 초기화
    function init() {
        updatePeriodDisplay();
        renderTop5Cards();
        renderLegend();
        renderAllCharts();
        renderStatsTable();
        bindEvents();
    }

    // 기간 표시 업데이트
    function updatePeriodDisplay() {
        const fromStr = formatDate(dateRange.from);
        const toStr = formatDate(dateRange.to);
        periodDisplay.textContent = fromStr + ' ~ ' + toStr;
    }

    // 날짜 포맷
    function formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return year + '년 ' + month + '월 ' + day + '일';
    }

    // Top5 카드 렌더링
    function renderTop5Cards() {
        const totals = getKeywordTotals();
        top5Cards.innerHTML = '';

        totals.forEach(function(item, index) {
            const card = document.createElement('div');
            card.className = 'top5-card';
            card.innerHTML =
                '<div class="top5-card-bar" style="background-color: ' + item.color + '"></div>' +
                '<div class="top5-card-body">' +
                    '<span class="top5-card-rank" style="background-color: ' + item.color + '">' + (index + 1) + '위</span>' +
                    '<div class="top5-card-keyword">' + item.keyword + '</div>' +
                    '<div class="top5-card-count" style="color: ' + item.color + '">' + item.total.toLocaleString() + '건</div>' +
                '</div>';
            top5Cards.appendChild(card);
        });
    }

    // 키워드별 총합 계산
    function getKeywordTotals() {
        return TOP5_KEYWORDS.map(function(keyword) {
            const monthlyStats = keywordMonthlyStats[keyword];
            const total = monthlyStats.reduce(function(sum, m) { return sum + m.count; }, 0);
            return {
                keyword: keyword,
                total: total,
                color: KEYWORD_COLORS[keyword]
            };
        }).sort(function(a, b) { return b.total - a.total; });
    }

    // 범례 렌더링
    function renderLegend() {
        keywordLegend.innerHTML = '';
        TOP5_KEYWORDS.forEach(function(keyword) {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML =
                '<div class="legend-color" style="background-color: ' + KEYWORD_COLORS[keyword] + '"></div>' +
                '<span class="legend-text">' + keyword + '</span>';
            keywordLegend.appendChild(item);
        });
    }

    // 모든 차트 렌더링
    function renderAllCharts() {
        renderMonthlyChart();
        renderHourlyChart();
        renderWeekdayChart();
        renderSeasonChart();
    }

    // 월별 추세 차트
    function renderMonthlyChart() {
        const ctx = document.getElementById('monthly-chart').getContext('2d');
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

        const datasets = TOP5_KEYWORDS.map(function(keyword) {
            return {
                label: keyword,
                data: keywordMonthlyStats[keyword].map(function(d) { return d.count; }),
                backgroundColor: KEYWORD_COLORS[keyword],
                borderRadius: 2
            };
        });

        charts.monthly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#fff',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + '건';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f0f0f0' },
                        ticks: {
                            callback: function(value) { return value.toLocaleString(); }
                        }
                    }
                }
            }
        });
    }

    // 시간대별 분포 차트
    function renderHourlyChart() {
        const ctx = document.getElementById('hourly-chart').getContext('2d');
        const hours = Array.from({ length: 24 }, function(_, i) { return i + '시'; });

        const datasets = TOP5_KEYWORDS.map(function(keyword) {
            return {
                label: keyword,
                data: keywordHourlyStats[keyword].map(function(d) { return d.count; }),
                borderColor: KEYWORD_COLORS[keyword],
                backgroundColor: KEYWORD_COLORS[keyword] + '99',
                fill: true,
                tension: 0.4
            };
        });

        charts.hourly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#fff',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + '건';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            maxRotation: 0,
                            callback: function(value, index) {
                                return index % 3 === 0 ? this.getLabelForValue(value) : '';
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        grid: { color: '#f0f0f0' },
                        ticks: {
                            callback: function(value) { return value.toLocaleString(); }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }

    // 요일별 패턴 차트
    function renderWeekdayChart() {
        const ctx = document.getElementById('weekday-chart').getContext('2d');
        const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

        const datasets = TOP5_KEYWORDS.map(function(keyword) {
            return {
                label: keyword,
                data: keywordWeekdayStats[keyword].map(function(d) { return d.count; }),
                borderColor: KEYWORD_COLORS[keyword],
                backgroundColor: KEYWORD_COLORS[keyword] + '33',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true
            };
        });

        charts.weekday = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: weekdays,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#fff',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r.toLocaleString() + '건';
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: { color: '#e0e0e0' },
                        pointLabels: { font: { size: 12 } },
                        ticks: {
                            stepSize: 200,
                            callback: function(value) { return value.toLocaleString(); }
                        }
                    }
                }
            }
        });
    }

    // 계절별 분포 차트
    function renderSeasonChart() {
        const ctx = document.getElementById('season-chart').getContext('2d');
        const seasons = ['봄', '여름', '가을', '겨울'];

        const datasets = TOP5_KEYWORDS.map(function(keyword) {
            return {
                label: keyword,
                data: keywordSeasonStats[keyword].map(function(d) { return d.count; }),
                backgroundColor: KEYWORD_COLORS[keyword],
                borderRadius: 4
            };
        });

        charts.season = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: seasons,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#fff',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.x.toLocaleString() + '건';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: '#f0f0f0' },
                        ticks: {
                            callback: function(value) { return value.toLocaleString(); }
                        }
                    },
                    y: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 통계 테이블 렌더링
    function renderStatsTable() {
        const totals = getKeywordTotals();
        statsTableBody.innerHTML = '';

        totals.forEach(function(item) {
            const keyword = item.keyword;
            const monthlyStats = keywordMonthlyStats[keyword];
            const hourlyStats = keywordHourlyStats[keyword];
            const weekdayStats = keywordWeekdayStats[keyword];
            const seasonStats = keywordSeasonStats[keyword];

            const peakMonth = monthlyStats.reduce(function(max, m) {
                return m.count > max.count ? m : max;
            });
            const peakHour = hourlyStats.reduce(function(max, h) {
                return h.count > max.count ? h : max;
            });
            const peakWeekday = weekdayStats.reduce(function(max, w) {
                return w.count > max.count ? w : max;
            });
            const peakSeason = seasonStats.reduce(function(max, s) {
                return s.count > max.count ? s : max;
            });

            const row = document.createElement('tr');
            row.innerHTML =
                '<td>' +
                    '<div class="keyword-cell">' +
                        '<div class="keyword-color-dot" style="background-color: ' + item.color + '"></div>' +
                        '<span class="keyword-name">' + keyword + '</span>' +
                    '</div>' +
                '</td>' +
                '<td class="text-right count-cell" style="color: ' + item.color + '">' + item.total.toLocaleString() + '건</td>' +
                '<td class="text-right">' + peakMonth.month + '</td>' +
                '<td class="text-right">' + peakHour.hour + '시</td>' +
                '<td class="text-right">' + peakWeekday.weekday + '요일</td>' +
                '<td class="text-right">' + peakSeason.season + '</td>';
            statsTableBody.appendChild(row);
        });
    }

    // 이벤트 바인딩
    function bindEvents() {
        // 다운로드 토글
        const toggleBtn = document.getElementById('download-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleDownloadMenu(this);
            });
        }

        // 다운로드 메뉴 아이템
        const menuItems = document.querySelectorAll('.download-menu-item');
        menuItems.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const type = this.dataset.type;
                handleDownload(type);
                closeAllDownloadMenus();
            });
        });

        // 문서 클릭 시 드롭다운 닫기
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.download-dropdown')) {
                closeAllDownloadMenus();
            }
        });
    }

    // 다운로드 메뉴 토글
    function toggleDownloadMenu(btn) {
        const dropdown = btn.closest('.download-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('open');
        }
    }

    // 모든 다운로드 메뉴 닫기
    function closeAllDownloadMenus() {
        const dropdowns = document.querySelectorAll('.download-dropdown.open');
        dropdowns.forEach(function(dropdown) {
            dropdown.classList.remove('open');
        });
    }

    // 다운로드 처리
    function handleDownload(type) {
        const filename = 'top5-stats-' + formatDateISO(dateRange.from) + '-' + formatDateISO(dateRange.to);

        switch (type) {
            case 'csv':
                downloadCSV(filename);
                break;
            case 'excel':
                downloadExcel(filename);
                break;
            case 'image':
                downloadImage(filename);
                break;
        }
    }

    // CSV 다운로드 (페이지 특화 로직)
    function downloadCSV(filename) {
        let csvContent = '키워드,1월,2월,3월,4월,5월,6월,7월,8월,9월,10월,11월,12월,총합\n';
        TOP5_KEYWORDS.forEach(function(keyword) {
            const stats = keywordMonthlyStats[keyword];
            const total = stats.reduce(function(sum, m) { return sum + m.count; }, 0);
            csvContent += keyword + ',' + stats.map(function(s) { return s.count; }).join(',') + ',' + total + '\n';
        });

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        DasanDownload.saveFile(blob, filename + '_' + DasanDownload.getDateSuffix() + '.csv');
    }

    // Excel 다운로드 (페이지 특화 로직 - 다중 시트)
    function downloadExcel(filename) {
        if (typeof XLSX === 'undefined') {
            alert('Excel 다운로드 기능을 사용할 수 없습니다.');
            return;
        }

        const wb = XLSX.utils.book_new();

        // 월별 시트
        const monthlyHeaders = ['키워드', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '총합'];
        const monthlyData = [monthlyHeaders];
        TOP5_KEYWORDS.forEach(function(keyword) {
            const stats = keywordMonthlyStats[keyword];
            const total = stats.reduce(function(sum, m) { return sum + m.count; }, 0);
            monthlyData.push([keyword].concat(stats.map(function(s) { return s.count; })).concat([total]));
        });
        const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyData);
        XLSX.utils.book_append_sheet(wb, wsMonthly, '월별');

        // 시간대별 시트
        const hourlyHeaders = ['키워드'].concat(Array.from({ length: 24 }, function(_, i) { return i + '시'; }));
        const hourlyData = [hourlyHeaders];
        TOP5_KEYWORDS.forEach(function(keyword) {
            const stats = keywordHourlyStats[keyword];
            hourlyData.push([keyword].concat(stats.map(function(s) { return s.count; })));
        });
        const wsHourly = XLSX.utils.aoa_to_sheet(hourlyData);
        XLSX.utils.book_append_sheet(wb, wsHourly, '시간대별');

        // 요일별 시트
        const weekdayHeaders = ['키워드', '월', '화', '수', '목', '금', '토', '일'];
        const weekdayData = [weekdayHeaders];
        TOP5_KEYWORDS.forEach(function(keyword) {
            const stats = keywordWeekdayStats[keyword];
            weekdayData.push([keyword].concat(stats.map(function(s) { return s.count; })));
        });
        const wsWeekday = XLSX.utils.aoa_to_sheet(weekdayData);
        XLSX.utils.book_append_sheet(wb, wsWeekday, '요일별');

        // 계절별 시트
        const seasonHeaders = ['키워드', '봄', '여름', '가을', '겨울'];
        const seasonData = [seasonHeaders];
        TOP5_KEYWORDS.forEach(function(keyword) {
            const stats = keywordSeasonStats[keyword];
            seasonData.push([keyword].concat(stats.map(function(s) { return s.count; })));
        });
        const wsSeason = XLSX.utils.aoa_to_sheet(seasonData);
        XLSX.utils.book_append_sheet(wb, wsSeason, '계절별');

        XLSX.writeFile(wb, filename + '_' + DasanDownload.getDateSuffix() + '.xlsx');
    }

    // 이미지 다운로드 - DasanDownload 모듈 사용
    function downloadImage(filename) {
        const chartSection = document.querySelector('.chart-section');
        if (!chartSection) return;
        DasanDownload.downloadImage(chartSection, filename);
    }

    // 유틸리티 함수 - DasanUtils 모듈 사용
    function formatDateISO(date) {
        return DasanUtils.formatDateISO(date);
    }

    // DOM 로드 후 초기화
    document.addEventListener('DOMContentLoaded', init);

})();
