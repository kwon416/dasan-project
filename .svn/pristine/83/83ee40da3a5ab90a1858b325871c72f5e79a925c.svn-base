<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  KRDS DatePicker 공통 컴포넌트

  사용법:
  <jsp:include page="/WEB-INF/jsp/common/datepicker.jsp">
      <jsp:param name="startInputId" value="start-date"/>
      <jsp:param name="endInputId" value="end-date"/>
      <jsp:param name="containerClass" value="sidebar-date-picker"/>
      <jsp:param name="quickPeriodStyle" value="radio"/>
      <jsp:param name="quickPeriodName" value="rdo_period"/>
      <jsp:param name="quickPeriods" value="1week,1month,3months"/>
  </jsp:include>

  파라미터:
  - startInputId: 시작일 input ID (필수)
  - endInputId: 종료일 input ID (필수)
  - containerClass: 컨테이너 CSS 클래스 (선택, 기본: krds-datepicker)
  - quickPeriodStyle: 빠른 선택 스타일 (radio | button | none, 기본: radio)
  - quickPeriodName: 라디오 버튼 name 속성 (radio 스타일 사용 시)
  - quickPeriods: 빠른 선택 버튼 목록 (예: "1week,1month" 또는 비어있으면 기본값 사용)

  사용 페이지:
  - region.jsp: 지역별 민원 현황 (sidebar, radio, 1week/1month)
  - period.jsp: 기간별 분석 (inline, none - 별도 빠른 선택 버튼 사용)
  - callIssue.jsp: JavaScript 동적 생성 방식 사용 (KrdsDatePicker.generateHTML() API)
--%>

<%
    // 파라미터 값 가져오기
    String startInputId = request.getParameter("startInputId");
    String endInputId = request.getParameter("endInputId");
    String containerClass = request.getParameter("containerClass");
    String quickPeriodStyle = request.getParameter("quickPeriodStyle");
    String quickPeriodName = request.getParameter("quickPeriodName");
    String quickPeriods = request.getParameter("quickPeriods");

    // 기본값 설정
    if (containerClass == null || containerClass.isEmpty()) {
        containerClass = "krds-datepicker";
    }
    if (quickPeriodStyle == null || quickPeriodStyle.isEmpty()) {
        quickPeriodStyle = "radio";
    }
    if (quickPeriodName == null || quickPeriodName.isEmpty()) {
        quickPeriodName = "rdo_period";
    }

    // 필수 파라미터 검증
    if (startInputId == null || endInputId == null) {
        throw new IllegalArgumentException("startInputId와 endInputId는 필수 파라미터입니다.");
    }

    // 빠른 선택 버튼 목록 설정
    String[] periodList;
    if (quickPeriods != null && !quickPeriods.isEmpty()) {
        periodList = quickPeriods.split(",");
    } else {
        // 기본값
        periodList = new String[]{"1week", "1month"};
    }

    // 빠른 선택 버튼 라벨 매핑
    java.util.Map<String, String> periodLabels = new java.util.HashMap<>();
    periodLabels.put("today", "오늘");
    periodLabels.put("1week", "최근 1주");
    periodLabels.put("1month", "최근 1개월");
    periodLabels.put("3months", "최근 3개월");
    periodLabels.put("1year", "최근 1년");
%>

<!-- KRDS DatePicker 컴포넌트 -->
<div class="<%= containerClass %>">
    <!-- 날짜 범위 입력 -->
    <div class="date-range-picker">
        <!-- 시작일 -->
        <div class="form-conts calendar-conts">
            <div class="calendar-input">
                <input type="text"
                       id="<%= startInputId %>"
                       class="krds-input small datepicker date-from"
                       placeholder="YYYY.MM.DD"
                       readonly
                       aria-label="시작일">
                <button type="button" class="krds-btn small icon form-btn-datepicker">
                    <span class="sr-only">시작일 선택</span>
                    <i class="svg-icon ico-calendar" aria-hidden="true"></i>
                </button>
            </div>
        </div>

        <!-- 구분자 -->
        <span class="date-separator" aria-hidden="true">~</span>

        <!-- 종료일 -->
        <div class="form-conts calendar-conts">
            <div class="calendar-input">
                <input type="text"
                       id="<%= endInputId %>"
                       class="krds-input small datepicker date-to"
                       placeholder="YYYY.MM.DD"
                       readonly
                       aria-label="종료일">
                <button type="button" class="krds-btn small icon form-btn-datepicker">
                    <span class="sr-only">종료일 선택</span>
                    <i class="svg-icon ico-calendar" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- 빠른 선택 버튼 -->
    <% if ("radio".equals(quickPeriodStyle)) { %>
    <!-- 라디오 칩 스타일 (KRDS Form Chip) -->
    <div class="krds-check-area quick-period-selector"><%
        for (int i = 0; i < periodList.length; i++) {
            String periodKey = periodList[i].trim();
            String periodLabel = periodLabels.get(periodKey);
            if (periodLabel == null) periodLabel = periodKey;
            String radioId = quickPeriodName + "_" + periodKey.replace(".", "_");
            boolean isFirst = (i == 0);
        %>
        <div class="krds-form-chip">
            <input type="radio" class="radio" name="<%= quickPeriodName %>" id="<%= radioId %>" data-period="<%= periodKey %>"<%= isFirst ? " checked" : "" %>>
            <label class="krds-form-chip-outline" for="<%= radioId %>"><%= periodLabel %></label>
        </div><%
        }
        %>
    </div>

    <% } else if ("button".equals(quickPeriodStyle)) { %>
    <!-- 일반 버튼 스타일 -->
    <div class="quick-period-buttons">
        <%
        for (int i = 0; i < periodList.length; i++) {
            String periodKey = periodList[i].trim();
            String periodLabel = periodLabels.get(periodKey);
            if (periodLabel == null) periodLabel = periodKey;
            boolean isFirst = (i == 0);
        %>
        <button type="button"
                class="period-quick-btn <%= isFirst ? "active" : "" %>"
                data-period="<%= periodKey %>">
            <%= periodLabel %>
        </button>
        <% } %>
    </div>
    <% } %>
    <!-- quickPeriodStyle이 "none"이면 빠른 선택 버튼 생성하지 않음 -->
</div>
