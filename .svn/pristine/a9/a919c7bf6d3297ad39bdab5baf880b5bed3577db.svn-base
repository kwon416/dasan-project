<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="120 다산콜 민원공개시스템 - 지역별 민원 분석">
    <title>${pageTitle} - 120 다산콜 민원공개시스템</title>

    <!-- KRDS CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/cdn/krds.min.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/token/krds_tokens.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/common/common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/component/component.css'/>">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/main.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/complaint-common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/common/krds-datepicker.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/complaint-region.css'/>">
</head>
<body>
<div id="wrap">
    <!-- Header -->
    <%@ include file="/WEB-INF/jsp/dasan/layout/header.jsp" %>

    <div id="container">
    <main id="content" class="complaint-region-page">
        <!-- 페이지 헤더 -->
        <section class="region-page-header">
            <div class="inner">
                <div class="header-content">
                    <div class="header-left">
                        <h1 class="page-title">지역별 민원 현황</h1>
                        <p class="page-description">서울시 25개 자치구의 민원 접수 현황을 지도와 통계로 확인하세요.</p>
                    </div>
                    <div class="header-right">
                        <div class="header-stat-card">
                            <div class="stat-label">구별 평균 민원</div>
                            <div class="stat-value" id="avg-complaints"><c:if test="${not empty avgComplaints}"><fmt:formatNumber value="${avgComplaints}" pattern="#,###"/></c:if><c:if test="${empty avgComplaints}">-</c:if></div>
                            <div class="stat-unit">건</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 사이드바 + 메인 레이아웃 -->
        <div class="complaint-region-layout">
            <!-- 사이드바 -->
            <aside class="region-sidebar">
                <!-- 기간 선택 섹션 -->
                <div class="sidebar-section">
                    <h2 class="sidebar-title">
                        <img src="<c:url value='/resources/img/component/icon/ico_calendar.svg'/>" alt="" class="icon" width="20" height="20">
                        기간 선택
                    </h2>
                    <!-- Date-Picker 공통 컴포넌트 사용 -->
                    <jsp:include page="/WEB-INF/jsp/common/datepicker.jsp">
                        <jsp:param name="startInputId" value="region-start-date" />
                        <jsp:param name="endInputId" value="region-end-date" />
                        <jsp:param name="containerClass" value="sidebar-date-picker krds-datepicker krds-datepicker--vertical" />
                        <jsp:param name="quickPeriodStyle" value="radio" />
                        <jsp:param name="quickPeriodName" value="rdo_period_region" />
                        <jsp:param name="quickPeriods" value="1week,1month" />
                    </jsp:include>
                </div>

                <!-- 자치구 목록 섹션 -->
                <div class="sidebar-section">
                    <h2 class="sidebar-title">
                        <img src="<c:url value='/resources/img/component/icon/ico_all.svg'/>" alt="" class="icon" width="20" height="20">
                        자치구 목록
                    </h2>
                    <!-- 자치구 목록 -->
                    <ul id="district-list" class="district-list">
                        <c:choose>
                            <%-- 서버에서 데이터를 전달받은 경우: JSTL로 렌더링 --%>
                            <c:when test="${not empty districtList}">
                                <!-- 전체 합계 -->
                                <li class="district-item total" data-code="">
                                    <span class="district-rank"></span>
                                    <span class="district-name">전체</span>
                                    <span class="district-count"><fmt:formatNumber value="${totalComplaints}" pattern="#,###"/>건</span>
                                </li>
                                <!-- 자치구 목록 -->
                                <c:forEach var="district" items="${districtList}">
                                <li class="district-item" data-code="${district.code}" data-name="${district.name}" data-total="${district.totalComplaints}" data-rank="${district.rank}">
                                    <span class="district-rank">${district.rank}</span>
                                    <span class="district-name">${district.name}</span>
                                    <span class="district-count"><fmt:formatNumber value="${district.totalComplaints}" pattern="#,###"/>건</span>
                                </li>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <%-- 서버 데이터 없음: JS에서 동적 생성 --%>
                            </c:otherwise>
                        </c:choose>
                    </ul>
                </div>
            </aside>

            <!-- 메인 영역 -->
            <div class="region-main">
                <!-- 지도 컨테이너 -->
                <div class="map-container">
                    <div class="map-header">
                        <h2 class="map-title">서울시 자치구별 민원 현황</h2>
                        <!-- 범례는 JS에서 동적으로 생성됨 -->
                    </div>
                    <div id="region-map"></div>
                </div>

                <!-- 선택된 구 상세 정보 패널 (구 선택 시에만 표시) -->
                <div id="district-detail-panel" class="district-detail-panel" style="display: none;">
                    <!-- 패널 헤더 -->
                    <div class="district-panel-header">
                        <div class="district-panel-title">
                            <span class="district-name-highlight" id="panel-district-name">영등포구</span>
                            <span class="panel-title-text">민원 현황</span>
                            <span class="panel-total-count" id="panel-total-count">4,350</span><span class="panel-count-unit">건</span>
                        </div>
                        <div class="district-panel-hint">
                            지도에서 행정동을 선택하면 상세 현황을 볼 수 있습니다
                        </div>
                    </div>

                    <!-- 하단 그리드: Top5 테이블 + 추세 차트 -->
                    <div class="district-panel-content">
                        <!-- Top5 테이블 -->
                        <div class="top5-section">
                            <h4 class="section-title">Top 5 민원 키워드</h4>
                            <table class="top5-keyword-table">
                                <thead>
                                    <tr>
                                        <th scope="col" style="width: 60px;">순위</th>
                                        <th scope="col">키워드</th>
                                        <th scope="col" style="width: 100px;" class="text-right">건수</th>
                                    </tr>
                                </thead>
                                <tbody id="top5-table-body">
                                    <tr>
                                        <td class="text-center"><span class="keyword-rank rank-1">1</span></td>
                                        <td><span class="keyword-badge blue">교통·주차</span></td>
                                        <td class="text-right">980건</td>
                                    </tr>
                                    <tr>
                                        <td class="text-center"><span class="keyword-rank rank-2">2</span></td>
                                        <td><span class="keyword-badge orange">도로·시설물</span></td>
                                        <td class="text-right">780건</td>
                                    </tr>
                                    <tr>
                                        <td class="text-center"><span class="keyword-rank rank-3">3</span></td>
                                        <td><span class="keyword-badge green">환경·청소</span></td>
                                        <td class="text-right">650건</td>
                                    </tr>
                                    <tr>
                                        <td class="text-center"><span class="keyword-rank rank-4">4</span></td>
                                        <td><span class="keyword-badge purple">건축·주택</span></td>
                                        <td class="text-right">450건</td>
                                    </tr>
                                    <tr>
                                        <td class="text-center"><span class="keyword-rank rank-5">5</span></td>
                                        <td><span class="keyword-badge pink">복지·보건</span></td>
                                        <td class="text-right">380건</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- 추세 차트 -->
                        <div class="trend-section">
                            <h4 class="section-title">Top 5 민원 추세</h4>
                            <div id="region-trend-chart"></div>
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

    <!-- D3.js for SVG Map -->
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>

    <!-- ECharts -->
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>

    <!-- 공통 유틸리티 모듈 (DasanUtils, DasanDateValidator) -->
    <script src="<c:url value='/resources/js/common/dasan-utils.js'/>"></script>

    <!-- KRDS DatePicker 공통 모듈 -->
    <script src="<c:url value='/resources/js/common/krds-datepicker.js'/>"></script>

    <!-- 서버 데이터를 JavaScript로 전달 (백엔드에서 데이터 제공 시 활성화) -->
    <c:if test="${not empty districtList}">
    <script>
        window.DISTRICT_DATA = {
            districts: [
                <c:forEach var="district" items="${districtList}" varStatus="status">
                {
                    code: '${district.code}',
                    name: '${district.name}',
                    totalComplaints: ${district.totalComplaints},
                    rank: ${district.rank}
                }<c:if test="${!status.last}">,</c:if>
                </c:forEach>
            ],
            totalComplaints: ${totalComplaints},
            avgComplaints: ${avgComplaints},
            serverRendered: true
        };
    </script>
    </c:if>

    <!-- Custom JS -->
    <script src="<c:url value='/resources/js/dasan/complaint-region.js'/>"></script>
</body>
</html>
