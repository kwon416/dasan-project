<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="120 다산콜 민원공개시스템 - 콜 이슈 키워드 검색">
    <title>콜 이슈 - 120 다산콜 민원공개시스템</title>

    <!-- KRDS CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/cdn/krds.min.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/token/krds_tokens.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/common/common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/component/component.css'/>">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/main.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/complaint-common.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/common/krds-datepicker.css'/>">
    <link rel="stylesheet" href="<c:url value='/resources/css/dasan/call-issue.css'/>">
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
                <h1 class="page-title">콜 이슈</h1>
                <p class="page-description">민원 키워드를 검색하고 추세를 분석합니다.</p>
            </div>
        </section>

        <!-- 콘텐츠 영역 -->
        <div class="content-section">
            <div class="inner">
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
                <div class="dasan-card result-c ard">
                    <div class="card-header">
                        <h2 class="card-title" id="result-title">인기 키워드 Top10</h2>
                    </div>
                    <div class="card-body no-padding">
                        <!-- 키워드 목록 (아코디언) -->
                        <div id="keyword-list" class="keyword-list">
                            <!-- JavaScript로 렌더링 -->
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

    <!-- ECharts -->
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>

    <!-- 다운로드 라이브러리 -->
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

    <!-- Chart Config -->
    <script src="<c:url value='/resources/js/dasan/chart-config.js'/>"></script>

    <!-- 공통 유틸리티 모듈 -->
    <script src="<c:url value='/resources/js/common/dasan-utils.js'/>"></script>
    <script src="<c:url value='/resources/js/common/dasan-download.js'/>"></script>

    <!-- KRDS DatePicker 공통 모듈 -->
    <script src="<c:url value='/resources/js/common/krds-datepicker.js'/>"></script>

    <!-- 콜 이슈 페이지 JS -->
    <script src="<c:url value='/resources/js/dasan/call-issue.js'/>"></script>

    <script>
        // 서버에서 전달받은 초기 데이터
        var initialKeywords = ${topKeywordsJson != null ? topKeywordsJson : '[]'};

        // 현재 메뉴 상태 (header.jsp에서 사용)
        var currentMenu = 'callIssue';
    </script>
</body>
</html>
