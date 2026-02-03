<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="120 다산콜 민원공개시스템 - Top5 키워드 통계">
    <title>Top5 키워드 통계 - 120 다산콜 민원공개시스템</title>

    <!-- KRDS CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/cdn/krds.min.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/token/krds_tokens.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/common/common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/component/component.css'/>">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/main.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/complaint-common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/complaint-top5.css'/>">

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- XLSX (Excel 다운로드) -->
    <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
    <!-- html2canvas (이미지 다운로드) -->
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
</head>
<body>
<div id="wrap">
    <!-- Header -->
    <%@ include file="/WEB-INF/jsp/dasan/layout/header.jsp" %>

    <div id="container">
    <main id="content">
        <!-- 페이지 헤더 -->
        <section class="page-header-section">
            <div class="inner">
                <div class="page-header-nav">
                    <a href="<c:url value='/complaint/period.do'/>" class="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        뒤로
                    </a>
                </div>
                <div class="page-header-main">
                    <div class="page-header-text">
                        <h1 class="page-title">Top5 키워드 통계</h1>
                        <p class="page-description">선택한 기간 동안 가장 많이 발생한 Top5 키워드를 비교 분석합니다.</p>
                    </div>
                    <div class="page-header-actions">
                        <div class="download-dropdown">
                            <button type="button" class="krds-btn medium secondary btn-download-toggle" id="download-toggle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" x2="12" y1="15" y2="3"/>
                                </svg>
                                다운로드
                            </button>
                            <div class="download-menu">
                                <button type="button" class="download-menu-item" data-type="csv">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                    CSV 다운로드
                                </button>
                                <button type="button" class="download-menu-item" data-type="excel">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                    Excel 다운로드
                                </button>
                                <button type="button" class="download-menu-item" data-type="image">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                    이미지 다운로드
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 콘텐츠 영역 -->
        <div class="top5-content">
            <!-- 선택된 기간 표시 -->
            <div class="period-info-bar success">
                <div class="period-info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                </div>
                <span class="period-info-text">
                    분석 기간: <strong id="period-display">2024년 1월 1일 ~ 2024년 1월 31일</strong>
                </span>
                <a href="<c:url value='/complaint/period.do'/>" class="period-change-link">기간 변경</a>
            </div>

            <!-- Top5 키워드 카드 그리드 -->
            <div class="top5-card-grid" id="top5-cards">
                <!-- JS로 동적 생성 -->
            </div>

            <!-- 키워드 범례 -->
            <div class="keyword-legend" id="keyword-legend">
                <!-- JS로 동적 생성 -->
            </div>

            <!-- 차트 섹션 -->
            <div class="chart-section">
                <!-- 월별 추세 차트 -->
                <div class="chart-card full-width">
                    <div class="chart-card-header">
                        <div class="chart-card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-blue">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                <line x1="16" x2="16" y1="2" y2="6"></line>
                                <line x1="8" x2="8" y1="2" y2="6"></line>
                                <line x1="3" x2="21" y1="10" y2="10"></line>
                            </svg>
                            월별 추세 비교
                        </div>
                        <p class="chart-card-desc">Top5 키워드의 월별 민원 발생량 비교</p>
                    </div>
                    <div class="chart-card-body">
                        <div class="chart-container" style="height: 32rem;">
                            <canvas id="monthly-chart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 시간대별 분포 차트 -->
                <div class="chart-card full-width">
                    <div class="chart-card-header">
                        <div class="chart-card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-green">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            시간대별 분포
                        </div>
                        <p class="chart-card-desc">24시간 기준 키워드별 민원 접수 패턴</p>
                    </div>
                    <div class="chart-card-body">
                        <div class="chart-container" style="height: 32rem;">
                            <canvas id="hourly-chart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 요일별 / 계절별 2열 그리드 -->
                <div class="chart-grid-2">
                    <!-- 요일별 패턴 -->
                    <div class="chart-card">
                        <div class="chart-card-header">
                            <div class="chart-card-title">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-orange">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                    <line x1="16" x2="16" y1="2" y2="6"></line>
                                    <line x1="8" x2="8" y1="2" y2="6"></line>
                                    <line x1="3" x2="21" y1="10" y2="10"></line>
                                    <path d="M8 14h.01"></path>
                                    <path d="M12 14h.01"></path>
                                    <path d="M16 14h.01"></path>
                                </svg>
                                요일별 패턴
                            </div>
                            <p class="chart-card-desc">요일별 키워드 분포 비교</p>
                        </div>
                        <div class="chart-card-body">
                            <div class="chart-container" style="height: 30rem;">
                                <canvas id="weekday-chart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- 계절별 분포 -->
                    <div class="chart-card">
                        <div class="chart-card-header">
                            <div class="chart-card-title">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-purple">
                                    <path d="M2 12h6.5l1 1 1.5-3 1.5 4 1-2h8.5"/>
                                </svg>
                                계절별 분포
                            </div>
                            <p class="chart-card-desc">계절별 키워드 구성 비율</p>
                        </div>
                        <div class="chart-card-body">
                            <div class="chart-container" style="height: 30rem;">
                                <canvas id="season-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 키워드별 상세 통계 테이블 -->
                <div class="chart-card full-width">
                    <div class="chart-card-header">
                        <div class="chart-card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-indigo">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                                <polyline points="16 7 22 7 22 13"/>
                            </svg>
                            키워드별 상세 통계
                        </div>
                    </div>
                    <div class="chart-card-body no-padding">
                        <div class="table-wrapper">
                            <table class="stats-table" id="stats-table">
                                <thead>
                                    <tr>
                                        <th>키워드</th>
                                        <th class="text-right">총 건수</th>
                                        <th class="text-right">피크 월</th>
                                        <th class="text-right">피크 시간</th>
                                        <th class="text-right">피크 요일</th>
                                        <th class="text-right">피크 계절</th>
                                    </tr>
                                </thead>
                                <tbody id="stats-table-body">
                                    <!-- JS로 동적 생성 -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    </div>

    <!-- Footer -->
    <%@ include file="/WEB-INF/jsp/dasan/layout/footer.jsp" %>
</div><!-- //wrap -->

    <!-- KRDS JS -->
    <script src="<c:url value='/resources/cdn/krds.min.js'/>"></script>
    <script src="<c:url value='/resources/js/component/ui-script.js'/>"></script>

    <!-- 글자·화면 설정 -->
    <script src="<c:url value='/resources/js/dasan/display-settings.js'/>"></script>

    <!-- 모바일 사이드바 -->
    <script src="<c:url value='/resources/js/dasan/mobile-sidebar.js'/>"></script>

    <!-- 공통 유틸리티 모듈 -->
    <script src="<c:url value='/resources/js/common/dasan-utils.js'/>"></script>
    <script src="<c:url value='/resources/js/common/dasan-download.js'/>"></script>

    <!-- Custom JS -->
    <script src="<c:url value='/resources/js/dasan/complaint-top5.js'/>"></script>
</body>
</html>
