/**
 * 다산콜 민원시스템 차트 설정
 * ECharts 및 wordcloud2.js 초기화 함수
 */

/**
 * 일별 민원 라인 차트 초기화
 * @param {string} containerId - 차트 컨테이너 ID
 * @param {Array} data - 일별 통계 데이터 [{date, totalCount, displayDate}]
 */
function initDailyChart(containerId, data) {
    var chart = echarts.init(document.getElementById(containerId));

    var option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return params[0].name + '<br/>민원 건수: ' +
                       params[0].value.toLocaleString() + '건';
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            textStyle: {
                color: '#374151'
            }
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
            data: data.map(function(d) { return d.displayDate; }),
            axisLabel: {
                fontSize: 11,
                color: '#6b7280'
            },
            axisLine: {
                lineStyle: {
                    color: '#e5e7eb'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(v) { return v.toLocaleString(); },
                fontSize: 11,
                color: '#6b7280'
            },
            splitLine: {
                lineStyle: {
                    color: '#f3f4f6'
                }
            }
        },
        series: [{
            type: 'line',
            data: data.map(function(d) { return d.totalCount; }),
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                color: '#0033A0',
                width: 2
            },
            itemStyle: {
                color: '#0033A0'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(0, 51, 160, 0.3)' },
                    { offset: 1, color: 'rgba(0, 51, 160, 0.05)' }
                ])
            }
        }]
    };

    chart.setOption(option);

    // 반응형 처리
    window.addEventListener('resize', function() {
        chart.resize();
    });

    return chart;
}

/**
 * 기관별 도넛 차트 초기화
 * @param {string} containerId - 차트 컨테이너 ID
 * @param {Array} data - 자치구 데이터 [{name, totalComplaints}]
 */
function initDistrictPieChart(containerId, data) {
    var chart = echarts.init(document.getElementById(containerId));

    var colors = [
        '#0033A0', '#1E5FC2', '#3D7BE4', '#5B97FF', '#7FB3FF',
        '#A3CFFF', '#C7EBFF', '#E0F0FF', '#F0F8FF', '#F5FAFF'
    ];

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}건 ({d}%)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            textStyle: {
                color: '#374151'
            }
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemWidth: 12,
            itemHeight: 12,
            textStyle: {
                fontSize: 12,
                color: '#374151'
            }
        },
        color: colors,
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['35%', '50%'],
            data: data.map(function(d) {
                return {
                    name: d.name,
                    value: d.totalComplaints
                };
            }),
            label: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
            }
        }]
    };

    chart.setOption(option);

    // 반응형 처리
    window.addEventListener('resize', function() {
        chart.resize();
    });

    return chart;
}

/**
 * 워드클라우드 초기화
 * @param {string} canvasId - 캔버스 ID
 * @param {Array} words - 키워드 데이터 [{text, value}]
 * @param {Function} onWordClick - 단어 클릭 콜백
 */
function initWordCloud(canvasId, words, onWordClick) {
    var canvas = document.getElementById(canvasId);
    var container = canvas.parentElement;

    if (!words || words.length === 0) {
        console.warn('워드클라우드 데이터가 없습니다.');
        return;
    }

    // 컨테이너 크기 가져오기
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;

    // 고해상도 디스플레이 지원 (Retina 등)
    var dpr = window.devicePixelRatio || 1;

    // Canvas 실제 해상도 설정 (화질 개선의 핵심)
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;

    // Canvas CSS 크기 설정 (화면에 표시되는 크기)
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = containerHeight + 'px';

    var values = words.map(function(w) { return w.value; });
    var maxValue = Math.max.apply(null, values);
    var minValue = Math.min.apply(null, values);
    var range = maxValue - minValue || 1;

    var colors = ['#0033A0', '#1E5FC2', '#3D7BE4', '#5B97FF'];

    // 폰트 크기를 dpr에 맞게 스케일링
    var list = words.map(function(word) {
        var normalized = (word.value - minValue) / range;
        var weight = (14 + normalized * 40) * dpr; // 14px ~ 54px, dpr 적용
        return [word.text, weight];
    });

    WordCloud(canvas, {
        list: list,
        gridSize: Math.round(16 * dpr),
        fontFamily: 'Pretendard, "Noto Sans KR", sans-serif',
        fontWeight: 600,
        color: function() {
            return colors[Math.floor(Math.random() * colors.length)];
        },
        rotateRatio: 0.3,
        rotationSteps: 2,
        backgroundColor: 'transparent',
        click: function(item) {
            if (item && onWordClick) {
                onWordClick(item[0]);
            }
        },
        shrinkToFit: true,
        drawOutOfBound: false,
        minSize: Math.round(12 * dpr),
        clearCanvas: true
    });
}

/**
 * 숫자에 천단위 콤마 추가
 * @param {number} num - 숫자
 * @returns {string} 포맷된 문자열
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
