/**
 * 지역별 분석 페이지 JavaScript
 * - D3.js 기반 GeoJSON 지도 렌더링
 * - 자치구/행정동 선택 인터랙션
 * - ECharts 추세 차트
 */

(function() {
    'use strict';

    // ========================================
    // 상수 및 설정
    // ========================================
    var CONFIG = {
        MAP_WIDTH: 800,
        MAP_HEIGHT: 520,
        SEOUL_CENTER: [126.978, 37.54],
        // 순위별 색상 (1~5위가 가장 진한 색)
        RANK_COLORS: {
            TOP_5: '#08306b',    // 1-5위
            TOP_10: '#2171b5',   // 6-10위
            TOP_15: '#4292c6',   // 11-15위
            TOP_20: '#6baed6',   // 16-20위
            BOTTOM: '#c6dbef'    // 21-25위
        },
        SELECTED_COLOR: '#0033A0',
        HOVER_COLOR: '#FFB800',
        DONG_SELECTED_COLOR: '#FF6B35',
        // 행정동 색상 팔레트
        DONG_COLORS: [
            '#e8f4f8', '#d1e9f0', '#b9dde8', '#a2d2e0', '#8ac6d8',
            '#73bbd0', '#5bafc8', '#44a4c0', '#2c98b8', '#158db0'
        ]
    };

    // 상태 관리
    var state = {
        svg: null,
        projection: null,
        path: null,
        zoom: null,
        geoData: null,
        hangJeongDongData: null,
        districtData: [],
        rankedDistricts: [],
        selectedDistrict: null,
        selectedDong: null,
        hoveredDistrict: null,
        trendChart: null,
        startDate: null,
        endDate: null
    };

    // ========================================
    // 유틸리티 함수
    // ========================================

    /**
     * 날짜를 YYYY-MM-DD 형식으로 포맷
     * @deprecated DasanDateValidator.formatDate 사용
     */
    function formatDate(date) {
        return DasanDateValidator.formatDate(date);
    }

    /**
     * 컨텍스트 경로 가져오기
     */
    function getContextPath() {
        var path = window.location.pathname;
        var contextPath = path.substring(0, path.indexOf('/', 1));
        return contextPath || '';
    }

    /**
     * 순위에 따른 색상 반환
     */
    function getColorByRank(rank) {
        if (rank <= 5) return CONFIG.RANK_COLORS.TOP_5;
        if (rank <= 10) return CONFIG.RANK_COLORS.TOP_10;
        if (rank <= 15) return CONFIG.RANK_COLORS.TOP_15;
        if (rank <= 20) return CONFIG.RANK_COLORS.TOP_20;
        return CONFIG.RANK_COLORS.BOTTOM;
    }

    /**
     * 행정동 색상 반환
     */
    function getDongColor(index) {
        return CONFIG.DONG_COLORS[index % CONFIG.DONG_COLORS.length];
    }

    // ========================================
    // 데이터 로드
    // ========================================

    /**
     * 모든 데이터 로드
     * 서버에서 자치구 데이터를 전달받으면 사용, 없으면 JSON 파일에서 fetch
     */
    function loadAllData() {
        var contextPath = getContextPath();
        var useServerData = window.DISTRICT_DATA && window.DISTRICT_DATA.serverRendered;

        // 서버에서 전달받은 자치구 데이터가 있는 경우
        if (useServerData) {
            state.districtData = window.DISTRICT_DATA.districts;
            state.rankedDistricts = state.districtData.slice(); // 이미 순위 포함

            // GeoJSON 데이터만 fetch
            Promise.all([
                fetch(contextPath + '/resources/data/seoul-geojson.json').then(function(r) { return r.json(); }),
                fetch(contextPath + '/resources/data/seoul-HangJeongDong-geojson.json').then(function(r) { return r.json(); })
            ]).then(function(results) {
                state.geoData = results[0];
                state.hangJeongDongData = results[1];

                initMap();
                renderDistrictList(); // 이벤트 바인딩만
                initTrendChart();
                renderSummary();
            }).catch(function(error) {
                console.error('지도 데이터 로드 실패:', error);
                showMapError();
            });
        } else {
            // 서버 데이터 없음: 기존 방식으로 모든 데이터 fetch
            Promise.all([
                fetch(contextPath + '/resources/data/seoul-geojson.json').then(function(r) { return r.json(); }),
                fetch(contextPath + '/resources/data/seoul-HangJeongDong-geojson.json').then(function(r) { return r.json(); }),
                fetch(contextPath + '/resources/data/districts.json').then(function(r) { return r.json(); })
            ]).then(function(results) {
                state.geoData = results[0];
                state.hangJeongDongData = results[1];
                state.districtData = results[2].districts || [];

                // 순위 계산
                calculateRanks();

                initMap();
                renderDistrictList(); // HTML 생성 + 이벤트 바인딩
                initTrendChart();
                renderSummary();
            }).catch(function(error) {
                console.error('데이터 로드 실패:', error);
                showMapError();
            });
        }
    }

    /**
     * 자치구 순위 계산
     */
    function calculateRanks() {
        state.rankedDistricts = state.districtData.slice().sort(function(a, b) {
            return b.totalComplaints - a.totalComplaints;
        }).map(function(d, index) {
            return Object.assign({}, d, { rank: index + 1 });
        });
    }

    /**
     * 이름으로 자치구 데이터 찾기
     */
    function findDistrictByName(name) {
        for (var i = 0; i < state.rankedDistricts.length; i++) {
            if (state.rankedDistricts[i].name === name) {
                return state.rankedDistricts[i];
            }
        }
        return null;
    }

    /**
     * 코드로 자치구 데이터 찾기
     */
    function findDistrictByCode(code) {
        for (var i = 0; i < state.rankedDistricts.length; i++) {
            if (state.rankedDistricts[i].code === code) {
                return state.rankedDistricts[i];
            }
        }
        return null;
    }

    // ========================================
    // D3.js 지도 초기화
    // ========================================

    /**
     * 지도 초기화
     */
    function initMap() {
        var container = document.getElementById('region-map');
        if (!container || !state.geoData) return;

        // 기존 SVG 제거
        d3.select('#region-map').selectAll('*').remove();

        // SVG 생성
        state.svg = d3.select('#region-map')
            .append('svg')
            .attr('viewBox', '0 0 ' + CONFIG.MAP_WIDTH + ' ' + CONFIG.MAP_HEIGHT)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('width', '100%')
            .style('height', 'auto')
            .style('background', '#fff');

        // 메인 그룹
        var g = state.svg.append('g').attr('class', 'map-container');

        // 프로젝션 설정
        state.projection = d3.geoMercator()
            .center(CONFIG.SEOUL_CENTER)
            .scale(75000)
            .translate([CONFIG.MAP_WIDTH / 2, CONFIG.MAP_HEIGHT / 2]);

        // Path 생성기
        state.path = d3.geoPath().projection(state.projection);

        // 줌 설정
        state.zoom = d3.zoom()
            .scaleExtent([1, 6])
            .on('zoom', function(event) {
                g.attr('transform', event.transform);
            });

        state.svg.call(state.zoom);

        // 자치구 레이어
        var districtLayer = g.append('g').attr('class', 'district-layer');

        // 자치구 렌더링
        districtLayer.selectAll('path')
            .data(state.geoData.features)
            .enter()
            .append('path')
            .attr('d', state.path)
            .attr('class', 'district-path')
            .attr('data-name', function(d) { return d.properties.name; })
            .attr('data-code', function(d) { return d.properties.code; })
            .style('fill', function(d) {
                var district = findDistrictByName(d.properties.name);
                return district ? getColorByRank(district.rank) : '#ccc';
            })
            .style('stroke', '#fff')
            .style('stroke-width', '0.5px')
            .style('cursor', 'pointer')
            .style('transition', 'fill 0.2s, stroke-width 0.2s')
            .on('mouseenter', handleDistrictMouseEnter)
            .on('mousemove', handleDistrictMouseMove)
            .on('mouseleave', handleDistrictMouseLeave)
            .on('click', handleDistrictClick);

        // 행정동 레이어 (처음엔 비어있음)
        g.append('g').attr('class', 'dong-layer');

        // 툴팁 생성
        createTooltip();

        // 범례 생성
        createLegend();

        // 줌 컨트롤 생성
        createZoomControls();
    }

    /**
     * 지도 툴팁 생성 (자체 구현)
     */
    function createTooltip() {
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'map-tooltip';
            tooltip.setAttribute('role', 'tooltip');
            document.querySelector('.map-container').appendChild(tooltip);
        }
    }

    /**
     * 범례 생성
     */
    function createLegend() {
        var legendContainer = document.getElementById('map-legend');
        if (!legendContainer) {
            legendContainer = document.createElement('div');
            legendContainer.id = 'map-legend';
            legendContainer.className = 'map-legend';
            document.querySelector('.map-container').appendChild(legendContainer);
        }

        var legendItems = [
            { color: CONFIG.RANK_COLORS.TOP_5, label: '1~5위', subLabel: '' },
            { color: CONFIG.RANK_COLORS.TOP_10, label: '6~10위', subLabel: '' },
            { color: CONFIG.RANK_COLORS.TOP_15, label: '11~15위', subLabel: '' },
            { color: CONFIG.RANK_COLORS.TOP_20, label: '16~20위', subLabel: '' },
            { color: CONFIG.RANK_COLORS.BOTTOM, label: '21~25위', subLabel: '' },
            { color: CONFIG.HOVER_COLOR, label: '선택', subLabel: '' }
        ];

        var html = '<div class="legend-title">민원 건수 순위</div>';
        legendItems.forEach(function(item) {
            html += '<div class="legend-item">' +
                '<span class="legend-color" style="background:' + item.color + '"></span>' +
                '<span class="legend-label">' + item.label + '</span>' +
                (item.subLabel ? '<span class="legend-sub">' + item.subLabel + '</span>' : '') +
                '</div>';
        });

        legendContainer.innerHTML = html;
    }

    /**
     * 줌 컨트롤 생성
     */
    function createZoomControls() {
        var zoomContainer = document.getElementById('map-zoom-controls');
        if (zoomContainer) return;

        zoomContainer = document.createElement('div');
        zoomContainer.id = 'map-zoom-controls';
        zoomContainer.className = 'map-zoom-controls';
        zoomContainer.innerHTML =
            '<button type="button" class="zoom-btn" id="zoom-in" aria-label="확대">+</button>' +
            '<button type="button" class="zoom-btn" id="zoom-out" aria-label="축소">-</button>' +
            '<button type="button" class="zoom-btn" id="zoom-reset" aria-label="초기화">↺</button>';

        document.querySelector('.map-container').appendChild(zoomContainer);

        // 이벤트 바인딩
        document.getElementById('zoom-in').addEventListener('click', function() {
            state.svg.transition().call(state.zoom.scaleBy, 1.5);
        });

        document.getElementById('zoom-out').addEventListener('click', function() {
            state.svg.transition().call(state.zoom.scaleBy, 0.67);
        });

        document.getElementById('zoom-reset').addEventListener('click', function() {
            resetMapView();
            selectDistrict(null);
        });
    }

    /**
     * 지도 뷰 리셋
     */
    function resetMapView() {
        state.svg.transition()
            .duration(500)
            .call(state.zoom.transform, d3.zoomIdentity);
    }

    // ========================================
    // 자치구 인터랙션
    // ========================================

    /**
     * 자치구 마우스 진입
     */
    function handleDistrictMouseEnter(event, d) {
        if (state.selectedDistrict) return; // 선택된 구가 있으면 무시

        var district = findDistrictByName(d.properties.name);
        if (!district) return;

        // 하이라이트
        d3.select(this)
            .style('fill', CONFIG.HOVER_COLOR)
            .style('stroke-width', '2px');

        // KRDS 툴팁 표시
        showKrdsTooltip(event, {
            title: district.name,
            value: district.totalComplaints.toLocaleString() + '건',
            rank: district.rank + '위'
        });

        // 사이드바 하이라이트
        highlightSidebarDistrict(district.code);
    }

    /**
     * 자치구 마우스 이동
     */
    function handleDistrictMouseMove(event) {
        moveKrdsTooltip(event);
    }

    /**
     * 자치구 마우스 떠남
     */
    function handleDistrictMouseLeave(event, d) {
        if (state.selectedDistrict) return;

        var district = findDistrictByName(d.properties.name);

        d3.select(this)
            .style('fill', district ? getColorByRank(district.rank) : '#ccc')
            .style('stroke-width', '0.5px');

        hideKrdsTooltip();

        // 사이드바 하이라이트 제거
        highlightSidebarDistrict(null);
    }

    /**
     * 자치구 클릭
     */
    function handleDistrictClick(event, d) {
        var district = findDistrictByName(d.properties.name);
        if (!district) return;

        // 이미 선택된 구 클릭 시 선택 해제
        if (state.selectedDistrict === district.code) {
            selectDistrict(null);
        } else {
            selectDistrict(district.code);
        }
    }

    /**
     * 자치구 선택
     */
    function selectDistrict(code) {
        state.selectedDistrict = code;
        state.selectedDong = null;

        var tooltip = document.getElementById('map-tooltip');
        tooltip.style.display = 'none';

        if (code) {
            var district = findDistrictByCode(code);
            if (!district) return;

            // 모든 자치구 스타일 업데이트
            d3.selectAll('.district-path')
                .style('fill', function(d) {
                    var dist = findDistrictByName(d.properties.name);
                    if (dist && dist.code === code) {
                        return CONFIG.SELECTED_COLOR;
                    }
                    return dist ? getColorByRank(dist.rank) : '#ccc';
                })
                .style('stroke-width', function(d) {
                    return d.properties.name === district.name ? '2.5px' : '0.5px';
                })
                .style('opacity', function(d) {
                    return d.properties.name === district.name ? 1 : 0.3;
                });

            // 해당 구로 줌인
            zoomToDistrict(district.name);

            // 행정동 레이어 렌더링
            renderHangJeongDong(district.name);

            // 범례 숨김
            var legend = document.getElementById('map-legend');
            if (legend) legend.style.display = 'none';

            // 선택된 구 정보 패널 표시
            showDistrictInfoPanel(district);

            // Top5 테이블 업데이트
            updateTop5Table(district);

            // 추세 차트 업데이트
            updateTrendChart(district.name);

        } else {
            // 선택 해제
            d3.selectAll('.district-path')
                .style('fill', function(d) {
                    var dist = findDistrictByName(d.properties.name);
                    return dist ? getColorByRank(dist.rank) : '#ccc';
                })
                .style('stroke-width', '0.5px')
                .style('opacity', 1);

            // 행정동 레이어 제거
            d3.select('.dong-layer').selectAll('*').remove();

            // 범례 표시
            var legend = document.getElementById('map-legend');
            if (legend) legend.style.display = 'block';

            // 지도 뷰 리셋
            resetMapView();

            // 정보 패널 숨김
            hideDistrictInfoPanel();

            // 요약 표시
            renderSummary();
        }

        // 사이드바 업데이트
        updateSidebarSelection(code);
    }

    /**
     * 자치구로 줌인
     */
    function zoomToDistrict(districtName) {
        var feature = state.geoData.features.find(function(f) {
            return f.properties.name === districtName;
        });

        if (!feature) return;

        var bounds = state.path.bounds(feature);
        var dx = bounds[1][0] - bounds[0][0];
        var dy = bounds[1][1] - bounds[0][1];
        var x = (bounds[0][0] + bounds[1][0]) / 2;
        var y = (bounds[0][1] + bounds[1][1]) / 2;
        var scale = Math.max(1, Math.min(4, 0.9 / Math.max(dx / CONFIG.MAP_WIDTH, dy / CONFIG.MAP_HEIGHT)));
        var translate = [CONFIG.MAP_WIDTH / 2 - scale * x, CONFIG.MAP_HEIGHT / 2 - scale * y];

        state.svg.transition()
            .duration(500)
            .call(state.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }

    // ========================================
    // 행정동 레이어
    // ========================================

    /**
     * 행정동 렌더링
     */
    function renderHangJeongDong(districtName) {
        if (!state.hangJeongDongData) return;

        // 해당 구의 행정동만 필터링
        var filtered = state.hangJeongDongData.features.filter(function(f) {
            return f.properties.sggnm === districtName;
        });

        if (filtered.length === 0) return;

        var dongLayer = d3.select('.dong-layer');
        dongLayer.selectAll('*').remove();

        dongLayer.selectAll('path')
            .data(filtered)
            .enter()
            .append('path')
            .attr('d', state.path)
            .attr('class', 'dong-path')
            .attr('data-code', function(d) { return d.properties.adm_cd; })
            .attr('data-name', function(d) { return d.properties.adm_nm; })
            .style('fill', function(d, i) { return getDongColor(i); })
            .style('stroke', CONFIG.SELECTED_COLOR)
            .style('stroke-width', '0.5px')
            .style('cursor', 'pointer')
            .style('transition', 'fill 0.15s')
            .on('mouseenter', handleDongMouseEnter)
            .on('mousemove', handleDongMouseMove)
            .on('mouseleave', handleDongMouseLeave)
            .on('click', handleDongClick);

        // 행정동 목록 패널 렌더링
        renderDongListPanel(filtered, districtName);
    }

    /**
     * 행정동 마우스 진입
     */
    function handleDongMouseEnter(event, d) {
        var dongName = d.properties.adm_nm.split(' ').pop();

        if (state.selectedDong !== d.properties.adm_cd) {
            d3.select(this).style('fill', CONFIG.HOVER_COLOR);
        }

        // KRDS 툴팁 표시
        showKrdsTooltip(event, {
            title: dongName,
            subtitle: d.properties.adm_nm
        });
    }

    /**
     * 행정동 마우스 이동
     */
    function handleDongMouseMove(event) {
        moveKrdsTooltip(event);
    }

    /**
     * 행정동 마우스 떠남
     */
    function handleDongMouseLeave(event, d) {
        if (state.selectedDong !== d.properties.adm_cd) {
            var paths = d3.selectAll('.dong-path').nodes();
            var index = paths.indexOf(this);
            d3.select(this).style('fill', getDongColor(index));
        }

        hideKrdsTooltip();
    }

    /**
     * 행정동 클릭
     */
    function handleDongClick(event, d) {
        var dongCode = d.properties.adm_cd;
        var dongName = d.properties.adm_nm.split(' ').pop();

        if (state.selectedDong === dongCode) {
            // 선택 해제
            selectDong(null);
        } else {
            selectDong(dongCode, dongName);
        }
    }

    /**
     * 행정동 선택
     */
    function selectDong(code, name) {
        state.selectedDong = code;

        // 스타일 업데이트
        d3.selectAll('.dong-path').each(function(d, i) {
            var isSelected = d.properties.adm_cd === code;
            d3.select(this)
                .style('fill', isSelected ? CONFIG.DONG_SELECTED_COLOR : getDongColor(i))
                .style('stroke-width', isSelected ? '1.5px' : '0.5px');
        });

        // 행정동 목록 업데이트
        updateDongListSelection(code);

        if (code && name) {
            // 행정동 상세 정보 표시
            showDongDetail(name);
        } else {
            // 구 정보로 복귀
            var district = findDistrictByCode(state.selectedDistrict);
            if (district) {
                showDistrictInfoPanel(district);
                updateTop5Table(district);
            }
        }
    }

    /**
     * 행정동 목록 패널 렌더링
     */
    function renderDongListPanel(dongFeatures, districtName) {
        var panel = document.getElementById('dong-list-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'dong-list-panel';
            panel.className = 'dong-list-panel';
            document.querySelector('.map-container').appendChild(panel);
        }

        var district = findDistrictByName(districtName);
        var html = '<div class="dong-panel-header">' +
            '<div class="dong-panel-title">' +
            '<span class="district-name">' + districtName + '</span>' +
            '</div>' +
            '<div class="dong-panel-total">' + (district ? district.totalComplaints.toLocaleString() : '-') + '건</div>' +
            '<div class="dong-panel-rank">전체 ' + (district ? district.rank : '-') + '위</div>' +
            '</div>';

        html += '<div class="dong-panel-subtitle">행정동 (' + dongFeatures.length + '개)</div>';
        html += '<div class="dong-list">';

        dongFeatures.forEach(function(f, i) {
            var dongName = f.properties.adm_nm.split(' ').pop();
            html += '<button type="button" class="dong-item" data-code="' + f.properties.adm_cd + '">' +
                '<span class="dong-color" style="background:' + getDongColor(i) + '"></span>' +
                '<span class="dong-name">' + dongName + '</span>' +
                '</button>';
        });

        html += '</div>';
        html += '<button type="button" class="dong-panel-back" id="back-to-all">전체 보기로 돌아가기</button>';

        panel.innerHTML = html;
        panel.style.display = 'block';

        // 이벤트 바인딩
        panel.querySelectorAll('.dong-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var code = this.getAttribute('data-code');
                var name = this.querySelector('.dong-name').textContent;

                if (state.selectedDong === code) {
                    selectDong(null);
                } else {
                    selectDong(code, name);
                }
            });
        });

        document.getElementById('back-to-all').addEventListener('click', function() {
            selectDistrict(null);
        });
    }

    /**
     * 행정동 목록 선택 상태 업데이트
     */
    function updateDongListSelection(code) {
        document.querySelectorAll('.dong-item').forEach(function(item) {
            var itemCode = item.getAttribute('data-code');
            if (itemCode === code) {
                item.classList.add('active');
                item.querySelector('.dong-color').style.background = CONFIG.DONG_SELECTED_COLOR;
            } else {
                item.classList.remove('active');
                // 원래 색상 복원
                var index = Array.from(item.parentNode.children).indexOf(item);
                item.querySelector('.dong-color').style.background = getDongColor(index);
            }
        });
    }

    // ========================================
    // 사이드바
    // ========================================

    /**
     * 자치구 목록 렌더링 또는 이벤트 바인딩
     * - 서버에서 렌더링된 경우: 이벤트만 바인딩
     * - 서버 데이터 없는 경우: HTML 생성 + 이벤트 바인딩
     */
    function renderDistrictList() {
        var listContainer = document.getElementById('district-list');
        if (!listContainer) return;

        var useServerData = window.DISTRICT_DATA && window.DISTRICT_DATA.serverRendered;

        // 서버 데이터가 없는 경우: HTML 동적 생성
        if (!useServerData) {
            var totalComplaints = state.rankedDistricts.reduce(function(sum, d) {
                return sum + d.totalComplaints;
            }, 0);

            var html = '<li class="district-item total" data-code="">' +
                '<span class="district-rank"></span>' +
                '<span class="district-name">전체</span>' +
                '<span class="district-count">' + totalComplaints.toLocaleString() + '건</span>' +
                '</li>';

            state.rankedDistricts.forEach(function(district) {
                html += '<li class="district-item" data-code="' + district.code + '" data-name="' + district.name + '" data-total="' + district.totalComplaints + '" data-rank="' + district.rank + '">' +
                    '<span class="district-rank">' + district.rank + '</span>' +
                    '<span class="district-name">' + district.name + '</span>' +
                    '<span class="district-count">' + district.totalComplaints.toLocaleString() + '건</span>' +
                    '</li>';
            });

            listContainer.innerHTML = html;

            // 평균 민원 업데이트
            var districtCount = state.rankedDistricts.length || 25;
            var avgComplaints = Math.round(totalComplaints / districtCount);
            var avgEl = document.getElementById('avg-complaints');
            if (avgEl && avgEl.textContent === '-') {
                avgEl.textContent = avgComplaints.toLocaleString();
            }
        }

        // 이벤트 바인딩 (서버/클라이언트 렌더링 공통)
        listContainer.querySelectorAll('.district-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var code = this.getAttribute('data-code');
                if (code === state.selectedDistrict || code === '') {
                    selectDistrict(null);
                } else {
                    selectDistrict(code);
                }
            });

            item.addEventListener('mouseenter', function() {
                var code = this.getAttribute('data-code');
                if (!state.selectedDistrict && code) {
                    highlightDistrictOnMap(code);
                }
            });

            item.addEventListener('mouseleave', function() {
                if (!state.selectedDistrict) {
                    resetDistrictHighlightOnMap();
                }
            });
        });
    }

    /**
     * 사이드바 선택 상태 업데이트 및 스크롤 이동
     */
    function updateSidebarSelection(code) {
        var selectedItem = null;

        document.querySelectorAll('.district-item').forEach(function(item) {
            var itemCode = item.getAttribute('data-code');
            if (itemCode === code) {
                item.classList.add('active');
                selectedItem = item;
            } else if (code === null && itemCode === '') {
                item.classList.add('active');
                selectedItem = item;
            } else {
                item.classList.remove('active');
            }
        });

        // 선택된 항목으로 스크롤 이동
        if (selectedItem) {
            scrollToSelectedDistrict(selectedItem);
        }
    }

    /**
     * 선택된 자치구 항목으로 스크롤 이동
     * @param {HTMLElement} item - 선택된 자치구 항목 요소
     */
    function scrollToSelectedDistrict(item) {
        var listContainer = document.getElementById('district-list');
        if (!listContainer || !item) return;

        // 부드러운 스크롤로 선택된 항목이 보이도록 이동
        item.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    /**
     * 사이드바 하이라이트
     */
    function highlightSidebarDistrict(code) {
        document.querySelectorAll('.district-item').forEach(function(item) {
            if (item.getAttribute('data-code') === code) {
                item.classList.add('hover');
            } else {
                item.classList.remove('hover');
            }
        });
    }

    /**
     * 지도에서 자치구 하이라이트
     */
    function highlightDistrictOnMap(code) {
        var district = findDistrictByCode(code);
        if (!district) return;

        d3.selectAll('.district-path')
            .style('fill', function(d) {
                if (d.properties.name === district.name) {
                    return CONFIG.HOVER_COLOR;
                }
                var dist = findDistrictByName(d.properties.name);
                return dist ? getColorByRank(dist.rank) : '#ccc';
            })
            .style('stroke-width', function(d) {
                return d.properties.name === district.name ? '2px' : '0.5px';
            });
    }

    /**
     * 지도 하이라이트 리셋
     */
    function resetDistrictHighlightOnMap() {
        d3.selectAll('.district-path')
            .style('fill', function(d) {
                var dist = findDistrictByName(d.properties.name);
                return dist ? getColorByRank(dist.rank) : '#ccc';
            })
            .style('stroke-width', '0.5px');
    }

    // ========================================
    // 정보 패널
    // ========================================

    /**
     * 자치구 정보 패널 표시
     */
    function showDistrictInfoPanel(district) {
        var panel = document.getElementById('district-detail-panel');
        if (!panel) return;

        panel.style.display = 'block';

        // 구 이름 업데이트 (파란색으로 리셋)
        var nameEl = document.getElementById('panel-district-name');
        if (nameEl) {
            nameEl.textContent = district.name;
            nameEl.style.color = ''; // CSS 기본값으로 리셋
        }

        // 총 건수 업데이트 (파란색으로 리셋)
        var countEl = document.getElementById('panel-total-count');
        if (countEl) {
            countEl.textContent = district.totalComplaints.toLocaleString();
            countEl.style.color = ''; // CSS 기본값으로 리셋
        }

        // 단위 색상 리셋
        var unitEl = panel.querySelector('.panel-count-unit');
        if (unitEl) {
            unitEl.style.color = '';
        }

        // 힌트 문구 복원
        var hintEl = panel.querySelector('.district-panel-hint');
        if (hintEl) {
            hintEl.textContent = '지도에서 행정동을 선택하면 상세 현황을 볼 수 있습니다';
        }

        // 행정동 패널 숨김
        var dongPanel = document.getElementById('dong-list-panel');
        if (dongPanel) dongPanel.style.display = 'none';
    }

    /**
     * 행정동 상세 정보 표시
     */
    function showDongDetail(dongName) {
        var panel = document.getElementById('district-detail-panel');
        if (!panel) return;

        panel.style.display = 'block';

        var district = findDistrictByCode(state.selectedDistrict);
        if (!district) return;

        // 샘플 데이터 생성 (실제 구현 시 API 호출)
        var seed = dongName.split('').reduce(function(acc, char) { return acc + char.charCodeAt(0); }, 0);
        var dongTotal = Math.floor(district.totalComplaints * (0.05 + (seed % 10) / 100));

        // 행정동 이름으로 헤더 업데이트
        var nameEl = document.getElementById('panel-district-name');
        if (nameEl) {
            nameEl.textContent = dongName;
            nameEl.style.color = '#FF6B35'; // 행정동은 주황색
        }

        // 총 건수 업데이트
        var countEl = document.getElementById('panel-total-count');
        if (countEl) {
            countEl.textContent = dongTotal.toLocaleString();
            countEl.style.color = '#FF6B35';
        }

        // 단위 색상도 변경
        var unitEl = panel.querySelector('.panel-count-unit');
        if (unitEl) {
            unitEl.style.color = '#FF6B35';
        }

        // 힌트 문구 변경
        var hintEl = panel.querySelector('.district-panel-hint');
        if (hintEl) {
            hintEl.textContent = district.name + ' 전체 대비 ' + ((dongTotal / district.totalComplaints) * 100).toFixed(1) + '%';
        }

        // 행정동 Top5 테이블 업데이트
        updateDongTop5Table(dongName, district);
    }

    /**
     * 정보 패널 숨김
     */
    function hideDistrictInfoPanel() {
        var panel = document.getElementById('district-detail-panel');
        if (panel) panel.style.display = 'none';

        var dongPanel = document.getElementById('dong-list-panel');
        if (dongPanel) dongPanel.style.display = 'none';
    }

    /**
     * 통계 값 업데이트
     */
    function updateStatValue(container, id, value) {
        var el = container.querySelector('[data-stat="' + id + '"]');
        if (el) el.textContent = value;
    }

    // ========================================
    // Top5 테이블
    // ========================================

    /**
     * 카테고리별 배지 색상
     */
    var CATEGORY_COLORS = {
        '교통·주차': 'blue',
        '도로·시설물': 'orange',
        '환경·청소': 'green',
        '건축·주택': 'purple',
        '복지·보건': 'pink',
        '세무·요금': 'yellow',
        '안전·재난': 'red',
        '문화·관광': 'cyan',
        '교육·청소년': 'indigo',
        '민원행정': 'slate',
        '기타': 'gray'
    };

    /**
     * Top5 테이블 업데이트
     */
    function updateTop5Table(district) {
        var tableBody = document.getElementById('top5-table-body');
        if (!tableBody) return;

        var categories = Object.entries(district.complaints)
            .sort(function(a, b) { return b[1] - a[1]; })
            .slice(0, 5);

        var html = '';
        categories.forEach(function(item, index) {
            var badgeColor = CATEGORY_COLORS[item[0]] || 'gray';
            html += '<tr>' +
                '<td class="text-center"><span class="keyword-rank rank-' + (index + 1) + '">' + (index + 1) + '</span></td>' +
                '<td><span class="keyword-badge ' + badgeColor + '">' + item[0] + '</span></td>' +
                '<td class="text-right">' + item[1].toLocaleString() + '건</td>' +
                '</tr>';
        });

        tableBody.innerHTML = html;
    }

    /**
     * 행정동 Top5 테이블 업데이트
     */
    function updateDongTop5Table(dongName, district) {
        var tableBody = document.getElementById('top5-table-body');
        if (!tableBody) return;

        // 샘플 데이터 (실제 구현 시 API 호출)
        var seed = dongName.split('').reduce(function(acc, char) { return acc + char.charCodeAt(0); }, 0);
        var categories = Object.entries(district.complaints)
            .map(function(item, i) {
                var variation = 0.5 + ((seed + i) % 10) / 10;
                return [item[0], Math.floor(item[1] * 0.1 * variation)];
            })
            .sort(function(a, b) { return b[1] - a[1]; })
            .slice(0, 5);

        var html = '';
        categories.forEach(function(item, index) {
            var badgeColor = CATEGORY_COLORS[item[0]] || 'gray';
            html += '<tr>' +
                '<td class="text-center"><span class="keyword-rank rank-' + (index + 1) + '">' + (index + 1) + '</span></td>' +
                '<td><span class="keyword-badge ' + badgeColor + '">' + item[0] + '</span></td>' +
                '<td class="text-right">' + item[1].toLocaleString() + '건</td>' +
                '</tr>';
        });

        tableBody.innerHTML = html;
    }

    // ========================================
    // 요약
    // ========================================

    /**
     * 전체 요약 렌더링 (구 미선택 시)
     */
    function renderSummary() {
        // 구 미선택 시 패널 숨김
        var panel = document.getElementById('district-detail-panel');
        if (panel) {
            panel.style.display = 'none';
        }

        // 서버 데이터가 없는 경우에만 평균 민원 업데이트
        var useServerData = window.DISTRICT_DATA && window.DISTRICT_DATA.serverRendered;
        if (!useServerData && state.rankedDistricts.length > 0) {
            var totalComplaints = state.rankedDistricts.reduce(function(sum, d) {
                return sum + d.totalComplaints;
            }, 0);

            var districtCount = state.rankedDistricts.length || 25;
            var avgComplaints = Math.round(totalComplaints / districtCount);

            var avgEl = document.getElementById('avg-complaints');
            if (avgEl) {
                avgEl.textContent = avgComplaints.toLocaleString();
            }
        }
    }

    // ========================================
    // 추세 차트
    // ========================================

    /**
     * 추세 차트 초기화
     */
    function initTrendChart() {
        var chartContainer = document.getElementById('region-trend-chart');
        if (!chartContainer || typeof echarts === 'undefined') return;

        state.trendChart = echarts.init(chartContainer);

        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var result = params[0].axisValue + '<br/>';
                    params.forEach(function(p) {
                        result += p.marker + ' ' + p.seriesName + ': <strong>' + p.value.toLocaleString() + '</strong>건<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: [],
                bottom: 0,
                type: 'scroll'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value',
                name: '건수'
            },
            series: []
        };

        state.trendChart.setOption(option);

        window.addEventListener('resize', function() {
            if (state.trendChart) state.trendChart.resize();
        });
    }

    /**
     * 추세 차트 업데이트
     */
    function updateTrendChart(districtName) {
        if (!state.trendChart) return;

        var district = findDistrictByName(districtName);
        if (!district) return;

        // 샘플 데이터 생성
        var dates = [];
        var today = new Date();
        for (var i = 29; i >= 0; i--) {
            var date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push((date.getMonth() + 1) + '/' + date.getDate());
        }

        var categories = Object.entries(district.complaints)
            .sort(function(a, b) { return b[1] - a[1]; })
            .slice(0, 5);

        var colors = ['#0033A0', '#2563eb', '#059669', '#d97706', '#dc2626'];
        var series = categories.map(function(cat, index) {
            var values = dates.map(function(_, i) {
                var base = cat[1] / 30;
                var variation = 0.7 + Math.random() * 0.6;
                return Math.round(base * variation);
            });

            return {
                name: cat[0],
                type: 'line',
                stack: 'total',
                areaStyle: { opacity: 0.7 },
                emphasis: { focus: 'series' },
                data: values,
                itemStyle: { color: colors[index] }
            };
        });

        state.trendChart.setOption({
            legend: { data: categories.map(function(c) { return c[0]; }) },
            xAxis: { data: dates },
            series: series
        });

        // 패널이 display:none에서 block으로 변경된 후 차트 크기 재계산
        setTimeout(function() {
            if (state.trendChart) {
                state.trendChart.resize();
            }
        }, 100);
    }

    // ========================================
    // 기간 선택 (공통 모듈 사용)
    // ========================================

    // DatePicker 인스턴스
    var datePicker = null;

    /**
     * 기간 선택 초기화 (공통 모듈 사용)
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
            var startInput = document.getElementById('region-start-date');
            var endInput = document.getElementById('region-end-date');

            if (!startInput || !endInput) {
                console.error('[DatePicker] 날짜 입력 필드를 찾을 수 없습니다.');
                showDatePickerError('날짜 선택 UI를 초기화할 수 없습니다.');
                return null;
            }

            // DatePicker 초기화
            datePicker = KrdsDatePicker.init({
                startInputId: 'region-start-date',
                endInputId: 'region-end-date',
                quickPeriodSelector: '.sidebar-date-picker .quick-period-selector',
                quickPeriods: [
                    { key: '1week', label: '최근 1주', days: 7 },
                    { key: '1month', label: '최근 1개월', days: 30 }
                ],
                defaultPeriod: '1week',
                onDateChange: function(startDate, endDate) {
                    if (!startDate || !endDate) {
                        console.warn('[DatePicker] 유효하지 않은 날짜:', { startDate: startDate, endDate: endDate });
                        return;
                    }
                    state.startDate = startDate;
                    state.endDate = endDate;
                    console.log('[DatePicker] 날짜 변경:', formatDate(startDate), '~', formatDate(endDate));
                }
            });

            if (!datePicker) {
                throw new Error('DatePicker 초기화 실패');
            }

            // 초기 상태 동기화
            var dateRange = datePicker.getDateRange();
            if (dateRange && dateRange.startDate && dateRange.endDate) {
                state.startDate = dateRange.startDate;
                state.endDate = dateRange.endDate;
                console.log('[DatePicker] 초기화 완료');
            } else {
                throw new Error('DatePicker 날짜 범위를 가져올 수 없습니다');
            }

            return datePicker;

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
        var container = document.querySelector('.sidebar-date-picker');
        if (!container) {
            console.error('[DatePicker] 에러 메시지를 표시할 컨테이너를 찾을 수 없습니다.');
            return;
        }

        // 기존 에러 메시지 제거
        var existingError = container.querySelector('.datepicker-error-message');
        if (existingError) {
            existingError.remove();
        }

        // 에러 메시지 생성
        var errorEl = document.createElement('div');
        errorEl.className = 'datepicker-error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: var(--dasan-danger, #dc2626); font-size: 1.3rem; padding: 0.8rem 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.4rem; margin-bottom: 1rem;';
        errorEl.setAttribute('role', 'alert');

        // 컨테이너 상단에 삽입
        container.insertBefore(errorEl, container.firstChild);

        // 5초 후 자동 제거
        setTimeout(function() {
            if (errorEl && errorEl.parentNode) {
                errorEl.remove();
            }
        }, 5000);
    }

    /**
     * 빠른 선택 버튼 초기화 (공통 모듈에서 처리)
     */
    function initQuickSelectButtons() {
        // KrdsDatePicker.init()에서 자동으로 처리됨
        // 이 함수는 호환성을 위해 빈 함수로 유지
    }

    // ========================================
    // 지도 툴팁 함수 (자체 구현)
    // ========================================

    /**
     * 툴팁 표시
     * @param {Event} event - 마우스 이벤트
     * @param {Object} data - 툴팁 데이터 { title, value?, rank?, subtitle? }
     */
    function showKrdsTooltip(event, data) {
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) {
            createTooltip();
            tooltip = document.getElementById('map-tooltip');
        }
        if (!tooltip) return;

        // 툴팁 HTML 생성
        var html = '<div class="tooltip-title">' + data.title + '</div>';

        if (data.value) {
            html += '<div class="tooltip-row">';
            html += '<span class="tooltip-label">민원 건수</span>';
            html += '<span class="tooltip-value">' + data.value + '</span>';
            html += '</div>';
        }
        if (data.rank) {
            html += '<div class="tooltip-row">';
            html += '<span class="tooltip-label">순위</span>';
            html += '<span class="tooltip-rank">' + data.rank + '</span>';
            html += '</div>';
        }
        if (data.subtitle) {
            html += '<div class="tooltip-row">';
            html += '<span class="tooltip-label">' + data.subtitle + '</span>';
            html += '</div>';
        }

        tooltip.innerHTML = html;

        // 위치 계산 후 표시
        positionTooltip(event, tooltip);
        tooltip.classList.add('show');
    }

    /**
     * 툴팁 위치 계산
     * @param {Event} event - 마우스 이벤트
     * @param {HTMLElement} tooltip - 툴팁 요소
     */
    function positionTooltip(event, tooltip) {
        var container = document.querySelector('.map-container');
        if (!container) return;

        var containerRect = container.getBoundingClientRect();

        // 툴팁 크기 측정
        tooltip.classList.add('show');
        var tooltipWidth = tooltip.offsetWidth;
        var tooltipHeight = tooltip.offsetHeight;

        // 마우스 위치 (컨테이너 기준)
        var mouseX = event.clientX - containerRect.left;
        var mouseY = event.clientY - containerRect.top;

        // 기본 간격
        var gap = 15;

        // 기존 화살표 클래스 제거
        tooltip.classList.remove('arrow-top', 'arrow-bottom');

        var tooltipTop, tooltipLeft;

        // 세로 위치 결정: 마우스 위치에 따라 위/아래 결정
        if (mouseY > containerRect.height / 2) {
            // 마우스가 하단에 있으면 툴팁은 위에
            tooltipTop = mouseY - tooltipHeight - gap;
            tooltip.classList.add('arrow-bottom');
        } else {
            // 마우스가 상단에 있으면 툴팁은 아래에
            tooltipTop = mouseY + gap;
            tooltip.classList.add('arrow-top');
        }

        // 가로 위치: 마우스 중앙 정렬
        tooltipLeft = mouseX - (tooltipWidth / 2);

        // 경계 체크
        if (tooltipLeft < 10) {
            tooltipLeft = 10;
        }
        if (tooltipLeft + tooltipWidth > containerRect.width - 10) {
            tooltipLeft = containerRect.width - tooltipWidth - 10;
        }
        if (tooltipTop < 10) {
            tooltipTop = mouseY + gap;
            tooltip.classList.remove('arrow-bottom');
            tooltip.classList.add('arrow-top');
        }
        if (tooltipTop + tooltipHeight > containerRect.height - 10) {
            tooltipTop = mouseY - tooltipHeight - gap;
            tooltip.classList.remove('arrow-top');
            tooltip.classList.add('arrow-bottom');
        }

        tooltip.style.left = tooltipLeft + 'px';
        tooltip.style.top = tooltipTop + 'px';
    }

    /**
     * 툴팁 위치 이동
     * @param {Event} event - 마우스 이벤트
     */
    function moveKrdsTooltip(event) {
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip || !tooltip.classList.contains('show')) return;

        positionTooltip(event, tooltip);
    }

    /**
     * 툴팁 숨기기
     */
    function hideKrdsTooltip() {
        var tooltip = document.getElementById('map-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show', 'arrow-top', 'arrow-bottom');
        }
    }

    // ========================================
    // 에러 처리
    // ========================================

    /**
     * 지도 에러 표시
     */
    function showMapError() {
        var container = document.getElementById('region-map');
        if (container) {
            container.innerHTML = '<div class="complaint-empty-state">' +
                '<div class="title">지도를 불러올 수 없습니다</div>' +
                '<div class="description">잠시 후 다시 시도해주세요.</div>' +
                '</div>';
        }
    }

    // ========================================
    // 초기화
    // ========================================

    /**
     * 페이지 초기화
     */
    function init() {
        console.log('지역별 분석 페이지 초기화 (D3.js 버전)');

        // D3.js 로드 확인
        if (typeof d3 === 'undefined') {
            console.error('D3.js가 로드되지 않았습니다.');
            showMapError();
            return;
        }

        // 기간 선택 초기화
        initDatePicker();
        initQuickSelectButtons();

        // 데이터 로드 및 지도 초기화
        loadAllData();
    }

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
