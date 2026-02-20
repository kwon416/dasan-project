<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="120 다산콜 민원공개시스템 - 키워드 검색 분석">
    <title>키워드 검색 - 120 다산콜 민원공개시스템</title>

    <!-- KRDS CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/cdn/krds.min.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/token/krds_tokens.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/common/common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/component/component.css'/>">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/main.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/complaint-common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/complaint-keyword.css'/>">

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
                <h1 class="page-title">키워드 검색</h1>
                <p class="page-description">선택한 기간 동안의 키워드별 민원 발생 추이를 분석합니다.</p>
            </div>
        </section>

        <!-- 콘텐츠 영역 -->
        <div class="keyword-content">
            <!-- 선택된 기간 표시 -->
            <div class="period-info-bar">
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

            <!-- 검색 카드 -->
            <div class="dasan-card search-card">
                <div class="card-body">
                    <div class="search-input-wrap">
                        <label for="keyword-search" class="sr-only">키워드 검색</label>
                        <i class="svg-icon ico-sch search-icon" aria-hidden="true"></i>
                        <input type="text"
                                id="keyword-search"
                                class="krds-input large"
                                placeholder="키워드를 입력하세요"
                                autocomplete="off">
                        <button type="button"
                                id="btn-clear-search"
                                class="krds-btn medium icon btn-clear-search"
                                aria-label="검색어 지우기"
                                style="display: none;">
                            <i class="svg-icon ico-popup-close" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 검색 결과 카드 -->
            <div class="result-card">
                <div class="result-header">
                    <h2 class="result-title" id="result-title">인기 키워드 Top10</h2>
                </div>
                <div class="result-body">
                    <!-- 키워드 리스트 -->
                    <div class="keyword-list" id="keyword-list">
                        <!-- JS로 동적 생성 -->
                    </div>

                    <!-- 빈 상태 -->
                    <div id="empty-state" class="empty-state" style="display: none;">
                        <p>검색 결과가 없습니다. 다른 키워드로 검색해 보세요.</p>
                    </div>

                    <!-- 로딩 상태 -->
                    <div id="loading-state" class="loading-spinner" style="display: none;">
                    </div>
                </div>
            </div>
        </div>
    </main>
    </div>

    <!-- Footer -->
    <%@ include file="/WEB-INF/jsp/dasan/layout/footer.jsp" %>
</div><!-- //wrap -->

<!-- 키워드 상세 모달 -->
<div class="keyword-modal" id="keyword-modal">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="modal-keyword-title">"불법주차" 발생 추이</h3>
            <button type="button" class="modal-close" id="modal-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <!-- 차트 영역 -->
            <div class="chart-container">
                <canvas id="trend-chart"></canvas>
            </div>

            <!-- 통계 요약 -->
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">총 민원 건수</span>
                    <span class="stat-value primary" id="stat-total">0건</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">일 평균</span>
                    <span class="stat-value" id="stat-avg">0건</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">최대</span>
                    <span class="stat-value danger" id="stat-max">0건</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">최소</span>
                    <span class="stat-value info" id="stat-min">0건</span>
                </div>
            </div>

            <!-- 다운로드 버튼 -->
            <div class="modal-actions">
                <button type="button" class="krds-btn medium outline" id="download-excel">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                    Excel 다운로드
                </button>
                <button type="button" class="krds-btn medium outline" id="download-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    이미지 저장
                </button>
            </div>
        </div>
    </div>
</div>

    <!-- KRDS JS -->
    <script src="<c:url value='/resources/cdn/krds.min.js'/>"></script>
    <script src="<c:url value='/resources/js/component/ui-script.js'/>"></script>

    <!-- 글자·화면 설정 -->
    <script src="<c:url value='/resources/js/dasan/display-settings.js'/>"></script>

    <!-- 모바일 사이드바 -->
    <script src="<c:url value='/resources/js/dasan/mobile-sidebar.js'/>"></script>

    <!-- 유틸리티 모듈 (complaint-keyword.js가 의존) -->
    <script src="<c:url value='/resources/js/common/dasan-utils.js'/>"></script>
    <script src="<c:url value='/resources/js/common/dasan-download.js'/>"></script>

    <!-- Custom JS -->
    <script src="<c:url value='/resources/js/dasan/complaint-keyword.js'/>"></script>
</body>
</html>
