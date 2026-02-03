<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="120 다산콜 민원공개시스템 - 기간별 민원 분석">
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
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/complaint-period.css'/>">
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
                <h1 class="page-title">기간별 분석</h1>
                <p class="page-description">분석할 기간을 선택하고 원하는 분석 유형을 선택하세요.</p>
            </div>
        </section>
        

        <!-- 콘텐츠 영역 -->
        <div class="period-content">
            <!-- 기간 선택 카드 -->
            <div class="period-select-card">
                <div class="period-card-header">
                    <h2 class="period-card-title">
                        <img src="<c:url value='/resources/img/component/icon/ico_calendar.svg'/>" alt="" class="icon">
                        분석 기간 선택
                    </h2>
                    <p class="period-card-desc">분석할 기간을 빠른 선택 버튼 또는 직접 입력으로 설정하세요.</p>
                </div>

                <!-- 기간 선택 섹션 (Date-Picker 공통 컴포넌트) -->
                <div class="period-select-section">
                    <jsp:include page="/WEB-INF/jsp/common/datepicker.jsp">
                        <jsp:param name="startInputId" value="period-start-date" />
                        <jsp:param name="endInputId" value="period-end-date" />
                        <jsp:param name="containerClass" value="period-date-inputs krds-datepicker krds-datepicker--wrap" />
                        <jsp:param name="quickPeriodStyle" value="radio" />
                        <jsp:param name="quickPeriodName" value="rdo_period_quick" />
                        <jsp:param name="quickPeriods" value="1week,1month,3months,1year" />
                    </jsp:include>
                    <span id="date-format-hint" class="sr-only">날짜 형식: YYYY.MM.DD</span>
                </div>
            </div>

            <!-- 분석 유형 선택 섹션 -->
            <section class="analysis-type-section">
                <h2 class="analysis-section-title">분석 유형 선택</h2>
                <div class="analysis-type-grid">
                    <!-- 키워드 검색 카드 -->
                    <article class="analysis-type-card" data-analysis-type="keyword" tabindex="0" role="button" aria-label="키워드 검색 분석 시작">
                        <div class="analysis-card-header">
                            <div class="analysis-card-icon">
                                <img src="<c:url value='/resources/img/component/icon/ico_sch.svg'/>" alt="" class="icon">
                            </div>
                            <div class="analysis-card-content">
                                <h3 class="analysis-card-title">키워드 검색</h3>
                                <p class="analysis-card-desc">
                                    특정 키워드로 민원을 검색하고 일별 발생 추이를 분석합니다.
                                </p>
                            </div>
                        </div>
                        <div class="analysis-card-action">
                            <button type="button" class="krds-btn medium primary analysis-start-btn" data-analysis-type="keyword">
                                키워드 검색하기
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.4rem;">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        </div>
                    </article>

                    <!-- Top5 통계 카드 -->
                    <article class="analysis-type-card" data-analysis-type="top5" tabindex="0" role="button" aria-label="Top5 통계 분석 시작">
                        <div class="analysis-card-header">
                            <div class="analysis-card-icon">
                                <img src="<c:url value='/resources/img/component/icon/ico_analytics.svg'/>" alt="" class="icon">
                            </div>
                            <div class="analysis-card-content">
                                <h3 class="analysis-card-title">Top5 통계</h3>
                                <p class="analysis-card-desc">
                                    선택한 기간 내 가장 많이 접수된 민원 키워드 Top5를 분석합니다.
                                </p>
                            </div>
                        </div>
                        <div class="analysis-card-action">
                            <button type="button" class="krds-btn medium primary analysis-start-btn" data-analysis-type="top5">
                                top5 통계 보기
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.4rem;">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        </div>
                    </article>
                </div>
            </section>
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

    <!-- 공통 유틸리티 모듈 (DasanUtils, DasanDateValidator) -->
    <script src="<c:url value='/resources/js/common/dasan-utils.js'/>"></script>

    <!-- KRDS DatePicker 공통 모듈 -->
    <script src="<c:url value='/resources/js/common/krds-datepicker.js'/>"></script>

    <!-- Custom JS -->
    <script src="<c:url value='/resources/js/dasan/complaint-period.js'/>"></script>
</body>
</html>
