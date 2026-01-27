<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="120 다산콜 민원공개시스템 - 서울시 민원 데이터 대시보드">
    <title>${pageTitle} - 120 다산콜 민원공개시스템</title>

    <!-- KRDS CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/css/cdn/krds.min.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/token/krds_tokens.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/common/common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/component/component.css'/>">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/main.css'/>">
</head>
<body>
    <!-- Header -->
    <%@ include file="/WEB-INF/jsp/egovframework/example/layout/header.jsp" %>

    <div id="container">
    <main id="content">
        <!-- Hero 섹션 -->
        <section class="hero-section">
            <div class="inner">
                <h1 class="hero-title">Hello, 다산!</h1>

                <!-- 통계 카드 -->
                <div class="stat-cards">
                    <div class="stat-card">
                        <div class="icon-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="label">수집 기간</span>
                            <span class="value">${dataStatus.collectionStartFormatted} 부터</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="icon-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="label">최종 업데이트</span>
                            <span class="value">${dataStatus.lastUpdatedFormatted}</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="icon-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="label">전체 데이터</span>
                            <span class="value"><fmt:formatNumber value="${dataStatus.totalRecords}"/>건</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="icon-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                                <path d="M10 6h4"></path>
                                <path d="M10 10h4"></path>
                                <path d="M10 14h4"></path>
                                <path d="M10 18h4"></path>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="label">월 데이터</span>
                            <span class="value"><fmt:formatNumber value="${dataStatus.monthlyRecords}"/>건</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 콘텐츠 영역 -->
        <div class="content-section">
            <div class="inner">
                <!-- 차트 그리드 -->
                <div class="chart-grid">
                    <!-- 일별 민원 차트 -->
                    <div class="dasan-card fade-in">
                        <div class="card-header">
                            <h2 class="card-title">일별 민원 건수</h2>
                        </div>
                        <div class="card-body">
                            <div id="dailyChart" class="chart-container"></div>
                        </div>
                    </div>

                    <!-- 기관별 Top10 -->
                    <div class="dasan-card fade-in">
                        <div class="card-header">
                            <h2 class="card-title">기관별 현황 Top10</h2>
                        </div>
                        <div class="card-body">
                            <div id="districtPieChart" class="chart-container"></div>
                        </div>
                    </div>
                </div>

                <!-- 하단 섹션 -->
                <div class="bottom-grid">
                    <!-- 워드클라우드 -->
                    <div class="dasan-card fade-in">
                        <div class="card-header">
                            <h2 class="card-title">오늘의 이슈 키워드</h2>
                            <span class="card-timestamp">${todayIssuesTimestamp} 기준</span>
                        </div>
                        <div class="card-body">
                            <div class="wordcloud-container">
                                <canvas id="wordCloudCanvas"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Top10 테이블 -->
                    <div class="dasan-card fade-in">
                        <div class="card-header">
                            <h2 class="card-title">오늘의 민원 Top10</h2>
                            <span class="card-timestamp">${todayTopComplaintsTimestamp} 기준</span>
                        </div>
                        <div class="card-body no-padding">
                            <table class="dasan-table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="text-center" style="width: 60px;">순위</th>
                                        <th scope="col">민원 유형</th>
                                        <th scope="col" style="width: 100px;">카테고리</th>
                                        <th scope="col" class="text-right" style="width: 100px;">건수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="item" items="${todayTopComplaints}" varStatus="status">
                                        <tr>
                                            <td class="text-center">
                                                <span class="rank-badge<c:if test="${item.rank <= 3}"> top-3</c:if>">${item.rank}</span>
                                            </td>
                                            <td>
                                                <c:out value="${item.title}"/>
                                                <c:if test="${item.trend == 'up'}">
                                                    <span class="trend-icon up" title="상승">▲</span>
                                                </c:if>
                                                <c:if test="${item.trend == 'down'}">
                                                    <span class="trend-icon down" title="하락">▼</span>
                                                </c:if>
                                                <c:if test="${item.trend == 'stable'}">
                                                    <span class="trend-icon stable" title="유지">-</span>
                                                </c:if>
                                            </td>
                                            <td>
                                                <span class="category-tag"><c:out value="${item.category}"/></span>
                                            </td>
                                            <td class="text-right">
                                                <strong><fmt:formatNumber value="${item.count}"/></strong>건
                                            </td>
                                        </tr>
                                    </c:forEach>
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
    <%@ include file="/WEB-INF/jsp/egovframework/example/layout/footer.jsp" %>

    <!-- KRDS JS -->
    <script src="<c:url value='/resources/js/cdn/krds.min.js'/>"></script>
    <script src="<c:url value='/resources/js/component/ui-script.js'/>"></script>

    <!-- 글자·화면 설정 -->
    <script src="<c:url value='/resources/js/dasan/display-settings.js'/>"></script>

    <!-- ECharts -->
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>

    <!-- wordcloud2.js -->
    <script src="https://cdn.jsdelivr.net/npm/wordcloud@1.2.2/src/wordcloud2.min.js"></script>

    <!-- Chart Config -->
    <script src="<c:url value='/resources/js/dasan/chart-config.js'/>"></script>

    <script>
        // 서버에서 전달받은 데이터
        var dailyStats = ${dailyStatsJson};
        var districtTop10 = ${districtTop10Json};
        var todayIssues = ${todayIssuesJson};

        // DOM 로드 완료 후 차트 초기화
        document.addEventListener('DOMContentLoaded', function() {
            // 일별 민원 라인 차트
            initDailyChart('dailyChart', dailyStats);

            // 기관별 도넛 차트
            initDistrictPieChart('districtPieChart', districtTop10);

            // 워드클라우드
            initWordCloud('wordCloudCanvas', todayIssues, handleWordClick);
        });

        /**
         * 워드클라우드 단어 클릭 핸들러
         */
        function handleWordClick(word) {
            location.href = '<c:url value="/callIssue.do"/>?q=' + encodeURIComponent(word);
        }
    </script>
</body>
</html>
