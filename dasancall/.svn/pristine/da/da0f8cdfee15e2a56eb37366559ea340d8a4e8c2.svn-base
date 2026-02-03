/**
 * 키워드 검색 페이지 스크립트
 * @requires DasanUtils (dasan-utils.js)
 * @requires DasanDownload (dasan-download.js)
 */
(function() {
    'use strict';

    // 유틸리티 함수 - DasanUtils 모듈 사용
    function highlightText(text, query) {
        return DasanUtils.highlightText(text, query);
    }

    // 샘플 키워드 데이터
    const keywordsData = [
        { id: 'kw1', text: '불법주차', count: 4523, trend: 'up', relatedKeywords: ['주정차', '견인', '단속', '아파트'] },
        { id: 'kw2', text: '도로파손', count: 3891, trend: 'stable', relatedKeywords: ['포장', '보수', '싱크홀', '균열'] },
        { id: 'kw3', text: '쓰레기투기', count: 3456, trend: 'up', relatedKeywords: ['무단투기', '음식물', '재활용', '수거'] },
        { id: 'kw4', text: '소음민원', count: 3210, trend: 'up', relatedKeywords: ['층간소음', '공사소음', '야간소음', '생활소음'] },
        { id: 'kw5', text: '가로등고장', count: 2890, trend: 'down', relatedKeywords: ['LED', '점등', '교체', '어두움'] },
        { id: 'kw6', text: '신호등', count: 2654, trend: 'stable', relatedKeywords: ['고장', '설치요청', '시간조정', '보행신호'] },
        { id: 'kw7', text: '보도블록', count: 2432, trend: 'stable', relatedKeywords: ['파손', '교체', '침하', '정비'] },
        { id: 'kw8', text: '악취', count: 2187, trend: 'up', relatedKeywords: ['음식물', '하수구', '음식점', '축사'] },
        { id: 'kw9', text: '건축소음', count: 1956, trend: 'down', relatedKeywords: ['공사', '야간', '진동', '분진'] },
        { id: 'kw10', text: '노점상', count: 1823, trend: 'stable', relatedKeywords: ['무허가', '단속', '위생', '통행방해'] }
    ];

    // URL에서 기간 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    const toParam = urlParams.get('to');

    // 기간 정보가 없으면 기본값 설정
    let dateRange = {
        from: fromParam ? new Date(fromParam) : new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: toParam ? new Date(toParam) : new Date()
    };

    // 현재 차트 인스턴스
    let currentChart = null;
    let expandedKeywordId = null;
    let currentTrendData = null;

    // DOM 요소
    const searchInput = document.getElementById('keyword-search');
    const clearBtn = document.getElementById('btn-clear-search');
    const keywordList = document.getElementById('keyword-list');
    const resultTitle = document.getElementById('result-title');
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');
    const periodDisplay = document.getElementById('period-display');

    // 초기화
    function init() {
        updatePeriodDisplay();
        renderKeywordList(keywordsData);
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

    // 이벤트 바인딩
    function bindEvents() {
        // 검색 입력
        let debounceTimer;
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            clearBtn.style.display = query ? 'flex' : 'none';

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function() {
                filterKeywords(query);
            }, 300);
        });

        // 검색어 지우기
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            filterKeywords('');
            searchInput.focus();
        });

        // 문서 클릭 시 드롭다운 닫기
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.download-dropdown')) {
                closeAllDownloadMenus();
            }
        });
    }

    // 키워드 필터링
    function filterKeywords(query) {
        const filtered = keywordsData.filter(function(kw) {
            return kw.text.toLowerCase().includes(query.toLowerCase());
        });

        if (query) {
            resultTitle.textContent = '"' + query + '" 검색 결과 (' + filtered.length + '건)';
        } else {
            resultTitle.textContent = '인기 키워드 Top10';
        }

        renderKeywordList(filtered, query);
    }

    // 키워드 리스트 렌더링
    function renderKeywordList(keywords, highlightQuery) {
        keywordList.innerHTML = '';

        if (keywords.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        keywords.forEach(function(keyword, index) {
            const isExpanded = expandedKeywordId === keyword.id;

            // 키워드 아이템
            const item = document.createElement('div');
            item.className = 'keyword-item' + (isExpanded ? ' expanded' : '');
            item.dataset.keywordId = keyword.id;

            // XSS 안전한 하이라이팅 사용
            const highlightedText = highlightText(keyword.text, highlightQuery);

            item.innerHTML =
                '<div class="keyword-info">' +
                    '<span class="keyword-text">' + highlightedText + '</span>' +
                '</div>' +
                '<div class="keyword-meta">' +
                    '<span class="keyword-count">' + keyword.count.toLocaleString() + '건</span>' +
                    '<svg class="keyword-expand-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="m6 9 6 6 6-6"/>' +
                    '</svg>' +
                '</div>';

            item.addEventListener('click', function() {
                toggleKeywordDetail(keyword);
            });

            keywordList.appendChild(item);

            // 상세 영역
            const detail = document.createElement('div');
            detail.className = 'keyword-detail' + (isExpanded ? ' show' : '');
            detail.id = 'detail-' + keyword.id;
            detail.innerHTML = createDetailHTML(keyword);
            keywordList.appendChild(detail);

            // 확장된 키워드면 차트 렌더링 및 이벤트 바인딩
            if (isExpanded) {
                setTimeout(function() {
                    renderChart(keyword, 'chart-' + keyword.id);
                    bindDetailEvents(detail, keyword);
                }, 100);
            }
        });
    }

    // 정규식 이스케이프
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 상세 영역 HTML 생성
    function createDetailHTML(keyword) {
        return '<div class="keyword-detail-header">' +
            '<h3 class="keyword-detail-title">"' + keyword.text + '" 발생 추이</h3>' +
            '<div class="keyword-detail-actions">' +
                '<div class="download-dropdown">' +
                    '<button type="button" class="krds-btn small secondary btn-download-toggle">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
                            '<polyline points="7 10 12 15 17 10"></polyline>' +
                            '<line x1="12" y1="15" x2="12" y2="3"></line>' +
                        '</svg>' +
                        '다운로드' +
                    '</button>' +
                    '<div class="download-menu">' +
                        '<button type="button" class="download-menu-item" data-type="csv">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>' +
                                '<polyline points="14 2 14 8 20 8"></polyline>' +
                            '</svg>' +
                            'CSV 다운로드' +
                        '</button>' +
                        '<button type="button" class="download-menu-item" data-type="excel">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>' +
                                '<polyline points="14 2 14 8 20 8"></polyline>' +
                            '</svg>' +
                            'Excel 다운로드' +
                        '</button>' +
                        '<button type="button" class="download-menu-item" data-type="image">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>' +
                                '<circle cx="8.5" cy="8.5" r="1.5"></circle>' +
                                '<polyline points="21 15 16 10 5 21"></polyline>' +
                            '</svg>' +
                            '이미지 다운로드' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="chart-container" id="chart-container-' + keyword.id + '">' +
            '<canvas id="chart-' + keyword.id + '"></canvas>' +
        '</div>' +
        '<div class="stats-grid" id="stats-' + keyword.id + '">' +
            '<!-- 통계는 차트 렌더링 후 업데이트 -->' +
        '</div>';
    }

    // 상세 영역 이벤트 바인딩
    function bindDetailEvents(detail, keyword) {
        // 다운로드 토글 버튼
        const toggleBtn = detail.querySelector('.btn-download-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleDownloadMenu(this);
            });
        }

        // 다운로드 메뉴 아이템
        const menuItems = detail.querySelectorAll('.download-menu-item');
        menuItems.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const type = this.dataset.type;
                handleDownload(type, keyword);
                closeAllDownloadMenus();
            });
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
    function handleDownload(type, keyword) {
        if (!currentTrendData || currentTrendData.length === 0) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        const filename = 'keyword-' + keyword.text + '-' + formatDateISO(new Date());

        switch (type) {
            case 'csv':
                downloadCSV(currentTrendData, filename);
                break;
            case 'excel':
                downloadExcel(currentTrendData, filename);
                break;
            case 'image':
                downloadImage(keyword.id, filename);
                break;
        }
    }

    // 다운로드 함수들 - DasanDownload 모듈 사용
    function downloadCSV(data, filename) {
        DasanDownload.downloadCSV(data, filename, {
            headers: ['날짜', '민원건수'],
            keys: ['label', 'count']
        });
    }

    function downloadExcel(data, filename) {
        DasanDownload.downloadExcel(data, filename, {
            headers: ['날짜', '민원건수'],
            keys: ['label', 'count'],
            sheetName: '키워드추세'
        });
    }

    function downloadImage(keywordId, filename) {
        const chartContainer = document.getElementById('chart-container-' + keywordId);
        if (!chartContainer) return;
        DasanDownload.downloadImage(chartContainer, filename);
    }

    // 유틸리티 함수 - DasanUtils 모듈 사용
    function formatDateISO(date) {
        return DasanUtils.formatDateISO(date);
    }

    // 키워드 상세 토글
    function toggleKeywordDetail(keyword) {
        const wasExpanded = expandedKeywordId === keyword.id;

        // 모든 상세 영역 닫기
        document.querySelectorAll('.keyword-item').forEach(function(el) {
            el.classList.remove('expanded');
        });
        document.querySelectorAll('.keyword-detail').forEach(function(el) {
            el.classList.remove('show');
        });

        // 이전에 확장되어 있지 않았으면 새로 열기
        if (!wasExpanded) {
            expandedKeywordId = keyword.id;
            const item = document.querySelector('.keyword-item[data-keyword-id="' + keyword.id + '"]');
            const detail = document.getElementById('detail-' + keyword.id);

            if (item && detail) {
                item.classList.add('expanded');
                detail.classList.add('show');

                // 차트 렌더링 및 이벤트 바인딩
                setTimeout(function() {
                    renderChart(keyword, 'chart-' + keyword.id);
                    bindDetailEvents(detail, keyword);
                }, 100);
            }
        } else {
            expandedKeywordId = null;
            currentTrendData = null;
        }
    }

    // 일별 추이 데이터 생성 (샘플)
    function generateTrendData(keyword) {
        const data = [];
        const diffTime = Math.abs(dateRange.to - dateRange.from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const baseCount = keyword.count / 30;

        for (let i = 0; i < diffDays; i++) {
            const date = new Date(dateRange.from);
            date.setDate(dateRange.from.getDate() + i);
            data.push({
                date: date,
                label: (date.getMonth() + 1) + '/' + date.getDate(),
                count: Math.floor(baseCount * (0.5 + Math.random()))
            });
        }
        return data;
    }

    // 차트 렌더링
    function renderChart(keyword, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const trendData = generateTrendData(keyword);
        currentTrendData = trendData;

        // 기존 차트 제거
        if (currentChart) {
            currentChart.destroy();
        }

        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.map(function(d) { return d.label; }),
                datasets: [{
                    label: keyword.text + ' 민원 건수',
                    data: trendData.map(function(d) { return d.count; }),
                    borderColor: '#0033A0',
                    backgroundColor: 'rgba(0, 51, 160, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#fff',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toLocaleString() + '건';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f0f0f0'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        // 통계 업데이트
        updateStats(keyword.id, trendData);
    }

    // 통계 업데이트
    function updateStats(keywordId, trendData) {
        const statsEl = document.getElementById('stats-' + keywordId);
        if (!statsEl) return;

        const total = trendData.reduce(function(sum, d) { return sum + d.count; }, 0);
        const avg = Math.round(total / trendData.length);
        const max = Math.max.apply(null, trendData.map(function(d) { return d.count; }));
        const min = Math.min.apply(null, trendData.map(function(d) { return d.count; }));

        statsEl.innerHTML =
            '<div class="stat-item">' +
                '<span class="stat-label">총 민원 건수</span>' +
                '<span class="stat-value primary">' + total.toLocaleString() + '건</span>' +
            '</div>' +
            '<div class="stat-item">' +
                '<span class="stat-label">일 평균</span>' +
                '<span class="stat-value">' + avg.toLocaleString() + '건</span>' +
            '</div>' +
            '<div class="stat-item">' +
                '<span class="stat-label">최대</span>' +
                '<span class="stat-value danger">' + max.toLocaleString() + '건</span>' +
            '</div>' +
            '<div class="stat-item">' +
                '<span class="stat-label">최소</span>' +
                '<span class="stat-value info">' + min.toLocaleString() + '건</span>' +
            '</div>';
    }

    // DOM 로드 후 초기화
    document.addEventListener('DOMContentLoaded', init);

})();
