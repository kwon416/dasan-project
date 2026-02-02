/**
 * 콜 이슈 페이지 JavaScript
 * 키워드 검색 및 추세 분석
 */

var CallIssuePage = {
    // ========================================
    // 상태 관리
    // ========================================
    state: {
        searchQuery: '',
        expandedKeywordId: null,
        periodType: 'today', // 'today' | 'week'
        dateRange: {
            from: new Date(),
            to: new Date()
        },
        keywords: [],           // 전체 키워드 데이터
        filteredKeywords: [],   // 필터링된 키워드
        trendChart: null,       // ECharts 인스턴스
        debounceTimer: null     // 디바운스 타이머
    },

    // ========================================
    // 초기화
    // ========================================
    init: function() {
        var self = this;

        // 초기 데이터 설정
        if (typeof initialKeywords !== 'undefined' && initialKeywords.length > 0) {
            this.state.keywords = initialKeywords;
        } else {
            // 샘플 데이터 (백엔드 연동 전)
            this.state.keywords = this.getSampleKeywords();
        }

        this.state.filteredKeywords = this.state.keywords.slice();

        // 이벤트 바인딩
        this.bindEvents();

        // 초기 렌더링
        this.renderKeywordList();

        // URL 파라미터에서 검색어 확인
        var urlParams = new URLSearchParams(window.location.search);
        var queryParam = urlParams.get('q');
        if (queryParam) {
            document.getElementById('keyword-search').value = queryParam;
            this.handleSearch(queryParam);
        }
    },

    // ========================================
    // 이벤트 바인딩
    // ========================================
    bindEvents: function() {
        var self = this;

        // 검색 입력
        var searchInput = document.getElementById('keyword-search');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                self.handleSearchInput(e.target.value);
            });

            // Enter 키 처리
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    self.handleSearch(e.target.value);
                }
            });
        }

        // 검색어 지우기 버튼
        var clearBtn = document.getElementById('btn-clear-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                self.handleSearchInput('');
                searchInput.focus();
            });
        }

        // 키워드 목록 클릭 이벤트 위임
        var keywordList = document.getElementById('keyword-list');
        if (keywordList) {
            keywordList.addEventListener('click', function(e) {
                var keywordRow = e.target.closest('.keyword-row');
                if (keywordRow) {
                    var keywordId = keywordRow.dataset.keywordId;
                    self.handleKeywordClick(keywordId);
                }

                // 빠른 날짜 선택 버튼
                var quickDateBtn = e.target.closest('.quick-date-btn');
                if (quickDateBtn) {
                    var periodType = quickDateBtn.dataset.period;
                    self.handleQuickDateSelect(periodType);
                }

                // 다운로드 버튼
                var downloadBtn = e.target.closest('.btn-download-toggle');
                if (downloadBtn) {
                    self.toggleDownloadMenu(downloadBtn);
                }

                // 다운로드 메뉴 아이템
                var downloadItem = e.target.closest('.download-menu-item');
                if (downloadItem) {
                    var downloadType = downloadItem.dataset.type;
                    self.handleDownload(downloadType);
                }
            });
        }

        // 문서 클릭 시 드롭다운 닫기
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.download-dropdown')) {
                self.closeAllDownloadMenus();
            }
        });
    },

    // ========================================
    // 검색 처리
    // ========================================
    handleSearchInput: function(query) {
        var self = this;
        var clearBtn = document.getElementById('btn-clear-search');

        // 지우기 버튼 표시/숨김
        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? 'flex' : 'none';
        }

        // 디바운스 처리 (300ms)
        if (this.state.debounceTimer) {
            clearTimeout(this.state.debounceTimer);
        }

        this.state.debounceTimer = setTimeout(function() {
            self.handleSearch(query);
        }, 300);
    },

    handleSearch: function(query) {
        this.state.searchQuery = query.trim();

        // 필터링
        if (this.state.searchQuery) {
            var lowerQuery = this.state.searchQuery.toLowerCase();
            this.state.filteredKeywords = this.state.keywords.filter(function(keyword) {
                return keyword.text.toLowerCase().indexOf(lowerQuery) !== -1;
            });
        } else {
            this.state.filteredKeywords = this.state.keywords.slice();
        }

        // 확장된 키워드 초기화
        this.state.expandedKeywordId = null;

        // UI 업데이트
        this.updateResultTitle();
        this.renderKeywordList();
    },

    // ========================================
    // 결과 타이틀 업데이트
    // ========================================
    updateResultTitle: function() {
        var titleEl = document.getElementById('result-title');
        if (!titleEl) return;

        if (this.state.searchQuery) {
            titleEl.textContent = '"' + this.state.searchQuery + '" 검색 결과 (' +
                                  this.state.filteredKeywords.length + '건)';
        } else {
            titleEl.textContent = '인기 키워드 Top10';
        }
    },

    // ========================================
    // 키워드 목록 렌더링
    // ========================================
    renderKeywordList: function() {
        var listEl = document.getElementById('keyword-list');
        var emptyEl = document.getElementById('empty-state');

        if (!listEl) return;

        // 빈 상태 처리
        if (this.state.filteredKeywords.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        // 키워드 아이템 렌더링
        var self = this;
        var html = this.state.filteredKeywords.map(function(keyword) {
            var isExpanded = self.state.expandedKeywordId === keyword.id;
            return self.renderKeywordItem(keyword, isExpanded);
        }).join('');

        listEl.innerHTML = html;

        // 확장된 키워드가 있으면 차트 초기화
        if (this.state.expandedKeywordId) {
            this.initTrendChart();
        }
    },

    renderKeywordItem: function(keyword, isExpanded) {
        var expandedClass = isExpanded ? ' expanded' : '';
        var rowExpandedClass = isExpanded ? ' expanded' : '';
        var highlightedText = this.highlightText(keyword.text, this.state.searchQuery);

        var html = '<div class="keyword-item' + expandedClass + '" data-keyword-id="' + keyword.id + '">';

        // 키워드 로우
        html += '<div class="keyword-row' + rowExpandedClass + '" data-keyword-id="' + keyword.id + '">';
        html += '  <span class="keyword-text">' + highlightedText + '</span>';
        html += '  <div class="keyword-meta">';
        html += '    <span class="keyword-count">' + this.formatNumber(keyword.count) + '건</span>';
        html += '    <svg class="keyword-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
        html += '      <polyline points="6 9 12 15 18 9"></polyline>';
        html += '    </svg>';
        html += '  </div>';
        html += '</div>';

        // 키워드 상세 (확장 콘텐츠)
        if (isExpanded) {
            html += this.renderKeywordDetail(keyword);
        }

        html += '</div>';

        return html;
    },

    renderKeywordDetail: function(keyword) {
        var today = new Date();
        var fromDate = this.formatDateInput(this.state.dateRange.from || today);
        var toDate = this.formatDateInput(this.state.dateRange.to || today);

        var html = '<div class="keyword-detail">';

        // 상세 헤더
        html += '<div class="detail-header">';
        html += '  <h3 class="detail-keyword-name">' + keyword.text + '</h3>';
        html += '</div>';

        // 차트 카드
        html += '<div class="chart-card">';
        html += '  <div class="card-body">';

        // 컨트롤 바
        html += '    <div class="control-bar">';
        html += '      <div class="control-bar-left">';
        html += '        <span class="chart-label">키워드 발생추이</span>';
        html += '      </div>';
        html += '      <div class="control-bar-right">';

        // 날짜 선택
        html += '        <div class="date-picker-group">';
        html += '          <input type="date" class="krds-input small date-from" value="' + fromDate + '">';
        html += '          <span class="date-separator">~</span>';
        html += '          <input type="date" class="krds-input small date-to" value="' + toDate + '">';
        html += '        </div>';

        // 빠른 날짜 선택
        html += '        <div class="quick-date-btns">';
        html += '          <button type="button" class="krds-btn small text quick-date-btn' +
                           (this.state.periodType === 'today' ? ' active' : '') +
                           '" data-period="today">오늘</button>';
        html += '          <button type="button" class="krds-btn small text quick-date-btn' +
                           (this.state.periodType === 'week' ? ' active' : '') +
                           '" data-period="week">일주일</button>';
        html += '        </div>';

        // 다운로드 드롭다운
        html += '        <div class="download-dropdown">';
        html += '          <button type="button" class="krds-btn small secondary btn-download-toggle">';
        html += '            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
        html += '              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>';
        html += '              <polyline points="7 10 12 15 17 10"></polyline>';
        html += '              <line x1="12" y1="15" x2="12" y2="3"></line>';
        html += '            </svg>';
        html += '            다운로드';
        html += '          </button>';
        html += '          <div class="download-menu">';
        html += '            <button type="button" class="download-menu-item" data-type="csv">';
        html += '              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
        html += '                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>';
        html += '                <polyline points="14 2 14 8 20 8"></polyline>';
        html += '              </svg>';
        html += '              CSV 다운로드';
        html += '            </button>';
        html += '            <button type="button" class="download-menu-item" data-type="excel">';
        html += '              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
        html += '                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>';
        html += '                <polyline points="14 2 14 8 20 8"></polyline>';
        html += '              </svg>';
        html += '              Excel 다운로드';
        html += '            </button>';
        html += '            <button type="button" class="download-menu-item" data-type="image">';
        html += '              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
        html += '                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>';
        html += '                <circle cx="8.5" cy="8.5" r="1.5"></circle>';
        html += '                <polyline points="21 15 16 10 5 21"></polyline>';
        html += '              </svg>';
        html += '              이미지 다운로드';
        html += '            </button>';
        html += '          </div>';
        html += '        </div>';

        html += '      </div>';
        html += '    </div>';

        // 차트 컨테이너
        html += '    <div id="trend-chart-' + keyword.id + '" class="trend-chart-container"></div>';

        html += '  </div>';
        html += '</div>';

        html += '</div>';

        return html;
    },

    // ========================================
    // 키워드 클릭 (아코디언 토글)
    // ========================================
    handleKeywordClick: function(keywordId) {
        if (this.state.expandedKeywordId === keywordId) {
            // 이미 확장된 경우 닫기
            this.state.expandedKeywordId = null;
        } else {
            // 새로 확장
            this.state.expandedKeywordId = keywordId;
            // 기간 초기화
            this.state.periodType = 'today';
            var today = new Date();
            this.state.dateRange = { from: today, to: today };
        }

        this.renderKeywordList();
    },

    // ========================================
    // 추세 차트 초기화
    // ========================================
    initTrendChart: function() {
        var keywordId = this.state.expandedKeywordId;
        if (!keywordId) return;

        var containerId = 'trend-chart-' + keywordId;
        var container = document.getElementById(containerId);
        if (!container) return;

        // 현재 확장된 키워드 찾기
        var keyword = this.state.filteredKeywords.find(function(k) {
            return k.id === keywordId;
        });
        if (!keyword) return;

        // 트렌드 데이터 생성
        var trendData = this.generateTrendData(keyword);

        // 차트 초기화
        if (this.state.trendChart) {
            this.state.trendChart.dispose();
        }

        this.state.trendChart = echarts.init(container);

        var tooltipLabel = this.state.periodType === 'today' ? '시간' : '날짜';
        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return tooltipLabel + ': ' + params[0].name + '<br/>민원 건수: ' +
                           params[0].value.toLocaleString() + '건';
                },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                textStyle: { color: '#374151' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: trendData.map(function(d) { return d.displayLabel; }),
                axisLabel: { fontSize: 11, color: '#6b7280' },
                axisLine: { lineStyle: { color: '#e5e7eb' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function(v) { return v.toLocaleString(); },
                    fontSize: 11,
                    color: '#6b7280'
                },
                splitLine: { lineStyle: { color: '#f3f4f6' } }
            },
            series: [{
                type: 'line',
                data: trendData.map(function(d) { return d.totalCount; }),
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#0033A0', width: 2 },
                itemStyle: { color: '#0033A0' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 51, 160, 0.3)' },
                        { offset: 1, color: 'rgba(0, 51, 160, 0.05)' }
                    ])
                }
            }]
        };

        this.state.trendChart.setOption(option);

        // 반응형
        var self = this;
        window.addEventListener('resize', function() {
            if (self.state.trendChart) {
                self.state.trendChart.resize();
            }
        });
    },

    // ========================================
    // 트렌드 데이터 생성 (샘플)
    // ========================================
    generateTrendData: function(keyword) {
        var baseCount = keyword.count / 20;
        var data = [];

        if (this.state.periodType === 'today') {
            // 오늘: 24시간 시간별 데이터
            var now = new Date();
            for (var i = 23; i >= 0; i--) {
                var hour = new Date(now);
                hour.setHours(now.getHours() - i, 0, 0, 0);
                data.push({
                    date: hour.toISOString(),
                    totalCount: Math.floor((baseCount / 24) * (0.5 + Math.random() * 1.5)),
                    displayLabel: hour.getHours() + '시'
                });
            }
        } else {
            // 일주일: 7일간 요일별 데이터
            var today = new Date();
            var weekdays = ['일', '월', '화', '수', '목', '금', '토'];
            for (var i = 6; i >= 0; i--) {
                var day = new Date(today);
                day.setDate(today.getDate() - i);
                var dayOfWeek = weekdays[day.getDay()];
                var monthDay = (day.getMonth() + 1) + '/' + day.getDate();
                data.push({
                    date: day.toISOString(),
                    totalCount: Math.floor(baseCount * (0.6 + Math.random() * 0.8)),
                    displayLabel: monthDay + '(' + dayOfWeek + ')'
                });
            }
        }

        // 현재 키워드의 트렌드 데이터 저장 (다운로드용)
        this.state.currentTrendData = data;

        return data;
    },

    // ========================================
    // 빠른 날짜 선택
    // ========================================
    handleQuickDateSelect: function(periodType) {
        var today = new Date();
        this.state.periodType = periodType;

        if (periodType === 'today') {
            this.state.dateRange = { from: today, to: today };
        } else {
            var weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 6);
            this.state.dateRange = { from: weekAgo, to: today };
        }

        // 버튼 상태 업데이트
        var btns = document.querySelectorAll('.quick-date-btn');
        btns.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.dataset.period === periodType) {
                btn.classList.add('active');
            }
        });

        // 차트 업데이트
        this.initTrendChart();
    },

    // ========================================
    // 다운로드 메뉴 토글
    // ========================================
    toggleDownloadMenu: function(btn) {
        var dropdown = btn.closest('.download-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('open');
        }
    },

    closeAllDownloadMenus: function() {
        var dropdowns = document.querySelectorAll('.download-dropdown.open');
        dropdowns.forEach(function(dropdown) {
            dropdown.classList.remove('open');
        });
    },

    // ========================================
    // 다운로드 처리
    // ========================================
    handleDownload: function(type) {
        var keyword = this.state.filteredKeywords.find(function(k) {
            return k.id === this.state.expandedKeywordId;
        }.bind(this));

        if (!keyword || !this.state.currentTrendData) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        var filename = 'keyword-' + keyword.text + '-' +
                       this.formatDateInput(new Date());

        switch (type) {
            case 'csv':
                this.downloadCSV(this.state.currentTrendData, filename);
                break;
            case 'excel':
                this.downloadExcel(this.state.currentTrendData, filename);
                break;
            case 'image':
                this.downloadImage(filename);
                break;
        }

        this.closeAllDownloadMenus();
    },

    downloadCSV: function(data, filename) {
        var csvContent = '날짜,민원건수\n';
        data.forEach(function(row) {
            csvContent += row.displayLabel + ',' + row.totalCount + '\n';
        });

        var blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        this.saveFile(blob, filename + '.csv');
    },

    downloadExcel: function(data, filename) {
        if (typeof XLSX === 'undefined') {
            alert('Excel 다운로드 기능을 사용할 수 없습니다.');
            return;
        }

        var wsData = [['날짜', '민원건수']];
        data.forEach(function(row) {
            wsData.push([row.displayLabel, row.totalCount]);
        });

        var ws = XLSX.utils.aoa_to_sheet(wsData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

        XLSX.writeFile(wb, filename + '.xlsx');
    },

    downloadImage: function(filename) {
        if (typeof html2canvas === 'undefined') {
            alert('이미지 다운로드 기능을 사용할 수 없습니다.');
            return;
        }

        var chartContainer = document.getElementById('trend-chart-' + this.state.expandedKeywordId);
        if (!chartContainer) return;

        html2canvas(chartContainer, {
            backgroundColor: '#ffffff',
            scale: 2
        }).then(function(canvas) {
            canvas.toBlob(function(blob) {
                this.saveFile(blob, filename + '.png');
            }.bind(this));
        }.bind(this));
    },

    saveFile: function(blob, filename) {
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    },

    // ========================================
    // 유틸리티 함수
    // ========================================
    highlightText: function(text, query) {
        if (!query || !query.trim()) return text;

        var escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp('(' + escapedQuery + ')', 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    },

    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    formatDateInput: function(date) {
        var d = date instanceof Date ? date : new Date(date);
        var year = d.getFullYear();
        var month = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    },

    // ========================================
    // 샘플 데이터 (백엔드 연동 전)
    // ========================================
    getSampleKeywords: function() {
        return [
            { id: 'kw1', text: '불법주차', count: 4523, trend: 'up' },
            { id: 'kw2', text: '도로파손', count: 3891, trend: 'stable' },
            { id: 'kw3', text: '쓰레기투기', count: 3456, trend: 'up' },
            { id: 'kw4', text: '소음민원', count: 3210, trend: 'up' },
            { id: 'kw5', text: '가로등고장', count: 2890, trend: 'down' },
            { id: 'kw6', text: '신호등', count: 2654, trend: 'stable' },
            { id: 'kw7', text: '보도블록', count: 2432, trend: 'stable' },
            { id: 'kw8', text: '악취', count: 2187, trend: 'up' },
            { id: 'kw9', text: '건축소음', count: 1956, trend: 'down' },
            { id: 'kw10', text: '노점상', count: 1823, trend: 'stable' }
        ];
    }
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    CallIssuePage.init();
});
