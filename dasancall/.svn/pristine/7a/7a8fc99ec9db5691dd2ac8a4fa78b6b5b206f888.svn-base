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
        debounceTimer: null,    // 디바운스 타이머
        datePicker: null        // KrdsDatePicker 인스턴스
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

                // 빠른 날짜 선택 (KRDS 라디오 칩)
                var quickDateRadio = e.target;
                if (quickDateRadio.type === 'radio' && quickDateRadio.closest('.quick-period-selector')) {
                    var periodType = quickDateRadio.dataset.period;
                    if (periodType) {
                        self.handleQuickDateSelect(periodType);
                    }
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

            // 날짜 입력 이벤트 (이벤트 위임)
            keywordList.addEventListener('input', function(e) {
                var dateInput = e.target.closest('.date-from, .date-to');
                if (dateInput) {
                    self.formatDateInput(dateInput);
                }
            });

            // 날짜 변경 완료 이벤트
            keywordList.addEventListener('change', function(e) {
                var dateInput = e.target.closest('.date-from, .date-to');
                if (dateInput) {
                    self.handleDateChange(dateInput);
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
        var self = this;
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

        // 날짜 선택 (공통 모듈 사용)
        if (typeof KrdsDatePicker !== 'undefined') {
            html += KrdsDatePicker.generateHTML({
                id: 'callissue-datepicker-' + keyword.id,
                startInputId: 'callissue-start-date-' + keyword.id,
                endInputId: 'callissue-end-date-' + keyword.id,
                quickPeriods: [
                    { key: 'today', label: '오늘', days: 1 },
                    { key: 'week', label: '일주일', days: 7 }
                ],
                defaultPeriod: this.state.periodType
            });
        } else {
            // 폴백: KRDS 라디오 칩 사용
            var fallbackId = 'fallback-datepicker-' + keyword.id;
            html += '        <div class="inline-datepicker krds-datepicker">';
            html += '          <div class="form-conts calendar-conts">';
            html += '            <div class="calendar-input">';
            html += '              <input type="text" class="krds-input small date-from" value="' + this.formatDateDisplay(this.state.dateRange.from || new Date()) + '" placeholder="YYYY.MM.DD" maxlength="10">';
            html += '            </div>';
            html += '          </div>';
            html += '          <span class="date-separator">~</span>';
            html += '          <div class="form-conts calendar-conts">';
            html += '            <div class="calendar-input">';
            html += '              <input type="text" class="krds-input small date-to" value="' + this.formatDateDisplay(this.state.dateRange.to || new Date()) + '" placeholder="YYYY.MM.DD" maxlength="10">';
            html += '            </div>';
            html += '          </div>';
            html += '          <div class="krds-check-area quick-period-selector">';
            html += '            <div class="krds-form-chip">';
            html += '              <input type="radio" class="radio" name="rdo_fallback_' + fallbackId + '" id="rdo_today_' + fallbackId + '" data-period="today"' + (this.state.periodType === 'today' ? ' checked' : '') + '>';
            html += '              <label class="krds-form-chip-outline" for="rdo_today_' + fallbackId + '">오늘</label>';
            html += '            </div>';
            html += '            <div class="krds-form-chip">';
            html += '              <input type="radio" class="radio" name="rdo_fallback_' + fallbackId + '" id="rdo_week_' + fallbackId + '" data-period="week"' + (this.state.periodType === 'week' ? ' checked' : '') + '>';
            html += '              <label class="krds-form-chip-outline" for="rdo_week_' + fallbackId + '">일주일</label>';
            html += '            </div>';
            html += '          </div>';
            html += '        </div>';
        }

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
        // 기존 DatePicker 인스턴스 정리
        if (this.state.datePicker) {
            if (typeof KrdsDatePicker !== 'undefined') {
                KrdsDatePicker.destroy(this.state.datePicker);
            }
            this.state.datePicker = null;
        }

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
        var self = this;
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

        // DatePicker 초기화 (공통 모듈 사용)
        this.initDatePicker(keywordId);

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
    // DatePicker 초기화 (공통 모듈 사용)
    // ========================================
    initDatePicker: function(keywordId) {
        var self = this;

        try {
            // 기존 인스턴스 정리
            if (this.state.datePicker) {
                try {
                    if (typeof KrdsDatePicker !== 'undefined') {
                        KrdsDatePicker.destroy(this.state.datePicker);
                    }
                } catch (destroyError) {
                    console.warn('[DatePicker] 인스턴스 정리 중 오류:', destroyError);
                }
                this.state.datePicker = null;
            }

            // KrdsDatePicker 모듈 존재 확인
            if (typeof KrdsDatePicker === 'undefined') {
                console.error('[DatePicker] KrdsDatePicker 모듈을 찾을 수 없습니다.');
                this.showDatePickerError('날짜 선택 기능을 불러올 수 없습니다.');
                return null;
            }

            // 상세 영역 확인
            var detailEl = document.querySelector('.keyword-item.expanded .keyword-detail');
            if (!detailEl) {
                console.error('[DatePicker] 키워드 상세 영역을 찾을 수 없습니다.');
                return null;
            }

            // 동적으로 생성된 DatePicker 초기화
            this.state.datePicker = KrdsDatePicker.initDynamic(detailEl, {
                quickPeriods: [
                    { key: 'today', label: '오늘', days: 1 },
                    { key: 'week', label: '일주일', days: 7 }
                ],
                defaultPeriod: this.state.periodType,
                onDateChange: function(startDate, endDate) {
                    if (!startDate || !endDate) {
                        console.warn('[DatePicker] 유효하지 않은 날짜:', { startDate: startDate, endDate: endDate });
                        return;
                    }

                    self.state.dateRange = { from: startDate, to: endDate };

                    // 기간 타입 업데이트
                    var diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                    self.state.periodType = diffDays === 0 ? 'today' : 'week';

                    // 차트 업데이트
                    self.updateTrendChart();

                    console.log('[DatePicker] 날짜 변경:', self.formatDateISO(startDate), '~', self.formatDateISO(endDate));
                }
            });

            // 초기화 실패 확인
            if (!this.state.datePicker) {
                throw new Error('DatePicker 동적 초기화 실패');
            }

            // 초기 날짜 설정
            var dateRange = this.state.datePicker.getDateRange();
            if (dateRange && dateRange.startDate && dateRange.endDate) {
                this.state.dateRange = { from: dateRange.startDate, to: dateRange.endDate };
                console.log('[DatePicker] 초기화 완료');
            } else {
                throw new Error('DatePicker 날짜 범위를 가져올 수 없습니다');
            }

            return this.state.datePicker;

        } catch (error) {
            console.error('[DatePicker] 초기화 중 오류:', error);
            this.showDatePickerError('날짜 선택 기능 초기화에 실패했습니다.');
            return null;
        }
    },

    /**
     * DatePicker 에러 메시지 표시
     * @param {string} message - 에러 메시지
     */
    showDatePickerError: function(message) {
        var detailEl = document.querySelector('.keyword-item.expanded .keyword-detail');
        if (!detailEl) {
            console.error('[DatePicker] 에러 메시지를 표시할 영역을 찾을 수 없습니다.');
            return;
        }

        // 기존 에러 메시지 제거
        var existingError = detailEl.querySelector('.datepicker-error-message');
        if (existingError) {
            existingError.remove();
        }

        // 에러 메시지 생성
        var errorEl = document.createElement('div');
        errorEl.className = 'datepicker-error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: var(--dasan-danger, #dc2626); font-size: 1.3rem; padding: 0.8rem 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.4rem; margin: 0.8rem 0;';
        errorEl.setAttribute('role', 'alert');

        // control-bar 다음에 삽입
        var controlBar = detailEl.querySelector('.control-bar');
        if (controlBar && controlBar.nextSibling) {
            controlBar.parentNode.insertBefore(errorEl, controlBar.nextSibling);
        } else if (controlBar) {
            controlBar.parentNode.appendChild(errorEl);
        }

        // 5초 후 자동 제거
        setTimeout(function() {
            if (errorEl && errorEl.parentNode) {
                errorEl.remove();
            }
        }, 5000);
    },

    // ========================================
    // 차트 업데이트
    // ========================================
    updateTrendChart: function() {
        var keywordId = this.state.expandedKeywordId;
        if (!keywordId) return;

        var keyword = this.state.filteredKeywords.find(function(k) {
            return k.id === keywordId;
        });
        if (!keyword) return;

        // 새 데이터 생성
        var trendData = this.generateTrendData(keyword);

        // 차트 옵션 업데이트
        if (this.state.trendChart) {
            var tooltipLabel = this.state.periodType === 'today' ? '시간' : '날짜';
            this.state.trendChart.setOption({
                tooltip: {
                    formatter: function(params) {
                        return tooltipLabel + ': ' + params[0].name + '<br/>민원 건수: ' +
                               params[0].value.toLocaleString() + '건';
                    }
                },
                xAxis: {
                    data: trendData.map(function(d) { return d.displayLabel; })
                },
                series: [{
                    data: trendData.map(function(d) { return d.totalCount; })
                }]
            });
        }
    },

    // ========================================
    // 빠른 날짜 선택
    // ========================================
    handleQuickDateSelect: function(periodType) {
        var self = this;
        var today = new Date();
        this.state.periodType = periodType;

        if (periodType === 'today') {
            this.state.dateRange = { from: today, to: today };
        } else {
            var weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 6);
            this.state.dateRange = { from: weekAgo, to: today };
        }

        // 공통 모듈 사용 시 DatePicker로 기간 적용
        if (this.state.datePicker) {
            this.state.datePicker.applyQuickPeriod(periodType);
        } else {
            // 폴백: 라디오 버튼 상태 업데이트
            var radios = document.querySelectorAll('.keyword-item.expanded .quick-period-selector input[type="radio"]');
            radios.forEach(function(radio) {
                radio.checked = (radio.dataset.period === periodType);
            });

            // 날짜 입력 필드 업데이트
            var dateFrom = document.querySelector('.keyword-item.expanded .date-from');
            var dateTo = document.querySelector('.keyword-item.expanded .date-to');
            if (dateFrom) {
                dateFrom.value = this.formatDateDisplay(this.state.dateRange.from);
                dateFrom.classList.remove('error');
            }
            if (dateTo) {
                dateTo.value = this.formatDateDisplay(this.state.dateRange.to);
                dateTo.classList.remove('error');
            }
        }

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
                       this.formatDateISO(new Date());

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

    // ========================================
    // 다운로드 처리 (DasanDownload 모듈 사용)
    // ========================================
    downloadCSV: function(data, filename) {
        DasanDownload.downloadCSV(data, filename, {
            headers: ['날짜', '민원건수'],
            keys: ['displayLabel', 'totalCount']
        });
    },

    downloadExcel: function(data, filename) {
        DasanDownload.downloadExcel(data, filename, {
            headers: ['날짜', '민원건수'],
            keys: ['displayLabel', 'totalCount'],
            sheetName: '키워드추세'
        });
    },

    downloadImage: function(filename) {
        var chartContainer = document.getElementById('trend-chart-' + this.state.expandedKeywordId);
        if (!chartContainer) return;
        DasanDownload.downloadImage(chartContainer, filename);
    },

    // ========================================
    // 유틸리티 함수 (DasanUtils 모듈 사용)
    // ========================================
    highlightText: function(text, query) {
        return DasanUtils.highlightText(text, query);
    },

    formatNumber: function(num) {
        return DasanUtils.formatNumber(num);
    },

    formatDateISO: function(date) {
        return DasanUtils.formatDateISO(date);
    },

    formatDateDisplay: function(date) {
        return DasanUtils.formatDateDisplay(date);
    },

    parseDate: function(dateStr) {
        return DasanUtils.parseDate(dateStr);
    },

    // 날짜 입력 필드 자동 포맷팅
    formatDateInput: function(input) {
        var value = input.value.replace(/[^0-9]/g, ''); // 숫자만 추출
        var formatted = '';

        if (value.length > 0) {
            formatted = value.substring(0, 4);
        }
        if (value.length > 4) {
            formatted += '.' + value.substring(4, 6);
        }
        if (value.length > 6) {
            formatted += '.' + value.substring(6, 8);
        }

        input.value = formatted;
    },

    // 날짜 변경 처리
    handleDateChange: function(input) {
        var dateStr = input.value;
        var date = this.parseDate(dateStr);

        // 유효성 검사
        if (!date || isNaN(date.getTime())) {
            input.classList.add('error');
            return;
        }

        // 미래 날짜 제한
        var today = new Date();
        today.setHours(23, 59, 59, 999);
        if (date > today) {
            date = today;
            input.value = this.formatDateDisplay(date);
        }

        input.classList.remove('error');

        // 시작일/종료일 구분
        var isFrom = input.classList.contains('date-from');
        var detail = input.closest('.keyword-detail');
        var fromInput = detail.querySelector('.date-from');
        var toInput = detail.querySelector('.date-to');

        var fromDate = this.parseDate(fromInput.value);
        var toDate = this.parseDate(toInput.value);

        // 범위 유효성 검사 (시작일 > 종료일 방지)
        if (fromDate && toDate && fromDate > toDate) {
            if (isFrom) {
                toInput.value = fromInput.value;
                toDate = fromDate;
            } else {
                fromInput.value = toInput.value;
                fromDate = toDate;
            }
        }

        // 상태 업데이트
        if (fromDate && toDate) {
            this.state.dateRange = { from: fromDate, to: toDate };

            // 기간 타입 업데이트
            var diffDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
            this.state.periodType = diffDays === 0 ? 'today' : 'week';

            // 빠른 선택 라디오 버튼 상태 초기화 (직접 입력 시)
            var radios = detail.querySelectorAll('.quick-period-selector input[type="radio"]');
            radios.forEach(function(radio) {
                radio.checked = false;
            });

            // 차트 업데이트
            this.updateTrendChart();
        }
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
