<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%-- 현재 URL 기반으로 메뉴 상태 자동 설정 --%>
<c:if test="${empty currentMenu}">
	<c:set var="requestURI" value="${pageContext.request.requestURI}"/>
	<c:choose>
		<c:when test="${fn:contains(requestURI, 'index') || fn:endsWith(requestURI, '/') || fn:contains(requestURI, 'main')}">
			<c:set var="currentMenu" value="main"/>
		</c:when>
		<c:when test="${fn:contains(requestURI, 'callIssue')}">
			<c:set var="currentMenu" value="callIssue"/>
		</c:when>
		<c:when test="${fn:contains(requestURI, 'complaint')}">
			<c:set var="currentMenu" value="complaint"/>
		</c:when>
	</c:choose>
</c:if>

<!-- official banner -->
<div id="krds-masthead">
	<div class="toggle-wrap">
		<div class="toggle-head">
			<div class="inner">
				<span class="nuri-txt">이 누리집은 대한민국 공식 전자정부 누리집입니다.</span>
			</div>
		</div>
	</div>
</div>
<!-- //official banner -->

<!-- header -->
<header id="krds-header">
	<!-- 헤더 컨텐츠 영역 -->
	<div class="header-in">
		<!-- 헤더 상단 기타메뉴 -->
		<div class="header-container">
			<div class="inner">
				<div class="header-utility">
					<ul class="utility-list">
						<li>
							<a href="https://120dasan.or.kr" class="krds-btn small text" target="_blank" title="120다산콜 홈페이지 새 창 열기">
								120다산콜재단<i class="svg-icon ico-go" aria-hidden="true"></i>
							</a>
						</li>
						<li>
							<button type="button"
									class="krds-btn small text btn-display-settings"
									aria-label="글자 및 화면 설정 열기"
									aria-haspopup="dialog"
									aria-controls="display-settings-modal">
								<i class="svg-icon ico-view-mode" aria-hidden="true"></i>
								글자·화면 설정
							</button>
						</li>
					</ul>
				</div>
				<div class="header-branding">
					<a href="<c:url value='/index.do'/>">
						<img src="<c:url value='/resources/img/logo.png'/>" alt="120 다산콜" class="logo-img">
					</a>
					<div class="header-actions">
						<c:if test="${currentMenu == 'main'}">
						<!-- 검색 입력창 (메인 페이지에서만 표시) -->
						<div class="sch-input">
							<label for="header-search" class="sr-only">검색어 입력</label>
							<input type="text" id="header-search" class="krds-input" placeholder="검색어를 입력하세요" title="검색어 입력">
							<button type="button" class="krds-btn medium icon ico-search" aria-label="검색">
								<span class="sr-only">검색</span>
								<i class="svg-icon ico-sch"></i>
							</button>
						</div>
						</c:if>
						<!-- 전체메뉴 버튼 (모바일) -->
						<button type="button" class="btn-navi all" aria-controls="mobile-nav">전체메뉴</button>
					</div>
				</div>
			</div>
		</div>
		<!-- //헤더 상단 기타메뉴 -->

		<!-- 메인메뉴 : 데스크탑 -->
		<nav class="krds-main-menu" role="navigation" aria-label="메인 메뉴">
			<div class="inner">
				<ul class="gnb-menu">
					<!-- 메인 (단순 링크) -->
					<li>
						<a href="<c:url value='/index.do'/>"
						   class="gnb-main-trigger is-link<c:if test="${currentMenu == 'main'}"> active</c:if>"
						   data-trigger="gnb"
						   <c:if test="${currentMenu == 'main'}">aria-current="page"</c:if>>메인</a>
					</li>
					<!-- 콜 이슈 (단순 링크) -->
					<li>
						<a href="<c:url value='/callIssue.do'/>"
						   class="gnb-main-trigger is-link<c:if test="${currentMenu == 'callIssue'}"> active</c:if>"
						   data-trigger="gnb"
						   <c:if test="${currentMenu == 'callIssue'}">aria-current="page"</c:if>>콜 이슈</a>
					</li>
					<!-- 민원 (서브메뉴 있음) -->
					<li>
						<button type="button"
								class="gnb-main-trigger<c:if test="${currentMenu == 'complaint'}"> is-current-section</c:if>"
								data-trigger="gnb"
								aria-expanded="false"
								aria-haspopup="true">민원</button>
						<!-- gnb-toggle-wrap -->
						<div class="gnb-toggle-wrap">
							<!-- gnb-main-list -->
							<div class="gnb-main-list">
								<!-- gnb-sub-list -->
								<div class="gnb-sub-list single-list">
									<div class="gnb-sub-content">
										<ul>
											<li>
												<a href="<c:url value='/complaint/region.do'/>"
												   <c:if test="${currentSubMenu == 'region'}">aria-current="page"</c:if>>
													지역별 분석
												</a>
											</li>
											<li>
												<a href="<c:url value='/complaint/period.do'/>"
												   <c:if test="${currentSubMenu == 'period'}">aria-current="page"</c:if>>
													기간별 분석
												</a>
											</li>
										</ul>
									</div>
								</div>
								<!-- //gnb-sub-list -->
							</div>
							<!-- //gnb-main-list -->
						</div>
						<!-- //gnb-toggle-wrap -->
					</li>
					<li>
						<a href="<c:url value='/admin.do'/>"
						   class="gnb-main-trigger is-link<c:if test="${currentMenu == 'admin'}"> active</c:if>"
						   data-trigger="gnb"
						   <c:if test="${currentMenu == 'admin'}">aria-current="page"</c:if>>관리자</a>
					</li>
				</ul>
			</div>
		</nav>
		<!-- //메인메뉴 : 데스크탑 -->
	</div>
	<!-- //헤더 컨텐츠 영역 -->

	<!-- 메인메뉴 : 모바일 사이드메뉴 -->
	<div id="mobile-nav" class="krds-main-menu-mobile" role="dialog" aria-modal="true" aria-label="전체 메뉴">
		<div class="gnb-wrap" tabindex="-1">
			<!-- gnb-header -->
			<div class="gnb-header">
				<!-- gnb-utils -->
				<div class="gnb-utils">
					<ul class="utility-list">
						<li>
							<a href="https://120dasan.or.kr" class="krds-btn xsmall text" target="_blank" title="120다산콜 홈페이지 새 창 열기">
								120다산콜재단
							</a>
						</li>
					</ul>
				</div>
				<!-- //gnb-utils -->
				<!-- gnb-login -->
				<div class="gnb-login">
					<span class="site-name">120 다산콜 민원공개시스템</span>
				</div>
				<!-- //gnb-login -->
				<!-- 검색 -->
				<div class="sch-input">
					<input type="text" class="krds-input" placeholder="찾고자 하는 메뉴명을 입력해 주세요" title="찾고자 하는 메뉴명 입력">
					<button type="button" class="krds-btn medium icon ico-search">
						<span class="sr-only">검색</span>
						<i class="svg-icon ico-sch"></i>
					</button>
				</div>
				<!-- //검색 -->
			</div>
			<!-- //gnb-header -->

			<!-- gnb-body -->
			<div class="gnb-body">
				<!-- gnb-menu -->
				<div class="gnb-menu">
					<div class="menu-wrap">
						<ul>
							<li>
								<a href="#mGnb-main" class="gnb-main-trigger<c:if test="${currentMenu == 'main'}"> active</c:if>">메인</a>
							</li>
							<li>
								<a href="#mGnb-callIssue" class="gnb-main-trigger<c:if test="${currentMenu == 'callIssue'}"> active</c:if>">콜 이슈</a>
							</li>
							<li>
								<a href="#mGnb-complaint" class="gnb-main-trigger<c:if test="${currentMenu == 'complaint'}"> active</c:if>">민원</a>
							</li>
						</ul>
					</div>
					<div class="submenu-wrap">
						<div class="gnb-sub-list" id="mGnb-main">
							<h2 class="sub-title">메인</h2>
							<ul>
								<li>
									<a href="<c:url value='/index.do'/>" class="gnb-sub-trigger"
									   <c:if test="${currentMenu == 'main'}">aria-current="page"</c:if>>
										메인 페이지
									</a>
								</li>
							</ul>
						</div>
						<div class="gnb-sub-list" id="mGnb-callIssue">
							<h2 class="sub-title">콜 이슈</h2>
							<ul>
								<li>
									<a href="<c:url value='/callIssue.do'/>" class="gnb-sub-trigger"
									   <c:if test="${currentMenu == 'callIssue'}">aria-current="page"</c:if>>
										콜 이슈
									</a>
								</li>
							</ul>
						</div>
						<div class="gnb-sub-list" id="mGnb-complaint">
							<h2 class="sub-title">민원</h2>
							<ul>
								<li>
									<a href="<c:url value='/complaint/region.do'/>" class="gnb-sub-trigger"
									   <c:if test="${currentSubMenu == 'region'}">aria-current="page"</c:if>>
										지역별 분석
									</a>
								</li>
								<li>
									<a href="<c:url value='/complaint/period.do'/>" class="gnb-sub-trigger"
									   <c:if test="${currentSubMenu == 'period'}">aria-current="page"</c:if>>
										기간별 분석
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!-- //gnb-menu -->
			</div>
			<!-- //gnb-body -->

			<!-- gnb-close -->
			<button type="button" class="krds-btn medium icon" id="close-nav">
				<span class="sr-only">전체메뉴 닫기</span>
				<i class="svg-icon ico-popup-close"></i>
			</button>
			<!-- //gnb-close -->
		</div>
	</div>
	<!-- //메인메뉴 : 모바일 -->
</header>
<!-- //header -->

<!-- 글자·화면 설정 모달 -->
<div id="display-settings-modal"
	 class="krds-modal display-settings-modal"
	 role="dialog"
	 aria-modal="true"
	 aria-labelledby="display-settings-title">
	<!-- 모달 배경 -->
	<div class="modal-back" aria-hidden="true"></div>

	<!-- 모달 다이얼로그 -->
	<div class="modal-dialog modal-md">
		<div class="modal-content" tabindex="-1">
			<!-- X 닫기 버튼 (우상단) -->
			<button type="button" class="krds-btn medium icon btn-close close-modal">
				<span class="sr-only">닫기</span>
				<i class="svg-icon ico-popup-close"></i>
			</button>

			<!-- 모달 헤더 -->
			<div class="modal-header">
				<h2 id="display-settings-title" class="modal-title">글자·화면 표시 설정</h2>
			</div>

			<!-- 모달 본문 -->
			<div class="modal-conts">
				<div class="conts-area display-settings-grid">
					<!-- 왼쪽: 글자·화면 표시 설정 (KRDS 라디오 버튼) -->
					<div class="settings-column">
						<fieldset class="krds-check-area chk-column">
							<legend class="settings-section-title">글자·화면 표시 설정</legend>

							<div class="krds-form-check medium">
								<input type="radio" name="zoom-scale" id="zoom-sm" value="0.9" data-adjust-scale="sm">
								<label for="zoom-sm">작게</label>
							</div>
							<div class="krds-form-check medium">
								<input type="radio" name="zoom-scale" id="zoom-md" value="1" data-adjust-scale="md" checked>
								<label for="zoom-md">보통</label>
							</div>
							<div class="krds-form-check medium">
								<input type="radio" name="zoom-scale" id="zoom-lg" value="1.1" data-adjust-scale="lg">
								<label for="zoom-lg">조금 크게</label>
							</div>
							<div class="krds-form-check medium">
								<input type="radio" name="zoom-scale" id="zoom-xlg" value="1.3" data-adjust-scale="xlg">
								<label for="zoom-xlg">크게</label>
							</div>
							<div class="krds-form-check medium">
								<input type="radio" name="zoom-scale" id="zoom-xxlg" value="1.5" data-adjust-scale="xxlg">
								<label for="zoom-xxlg">가장 크게</label>
							</div>
						</fieldset>
					</div>

					<!-- 오른쪽: 화면 표시 모드 -->
					<div class="settings-column">
						<fieldset class="krds-check-area chk-column mode-fieldset">
							<legend class="settings-section-title">화면 표시 모드</legend>

							<div class="mode-card-option">
								<div class="mode-preview light-preview" aria-hidden="true">
									<div class="preview-header"></div>
									<div class="preview-sidebar"></div>
									<div class="preview-content"></div>
								</div>
								<div class="krds-form-check medium">
									<input type="radio" name="display-mode" id="mode-light" value="light" data-mode="light" checked>
									<label for="mode-light">기본 (밝은 배경)</label>
								</div>
							</div>

							<div class="mode-card-option">
								<div class="mode-preview dark-preview" aria-hidden="true">
									<div class="preview-header"></div>
									<div class="preview-sidebar"></div>
									<div class="preview-content"></div>
								</div>
								<div class="krds-form-check medium">
									<input type="radio" name="display-mode" id="mode-high-contrast" value="high-contrast" data-mode="high-contrast">
									<label for="mode-high-contrast">선명하게 (어두운 배경)</label>
								</div>
							</div>

							<div class="mode-card-option">
								<div class="mode-preview system-preview" aria-hidden="true">
									<div class="preview-header"></div>
									<div class="preview-sidebar"></div>
									<div class="preview-content"></div>
								</div>
								<div class="krds-form-check medium">
									<input type="radio" name="display-mode" id="mode-system" value="system" data-mode="system">
									<label for="mode-system">시스템 설정</label>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
			</div>

			<!-- 모달 푸터 (우하단 버튼) -->
			<div class="modal-footer-btns">
				<button type="button" class="krds-btn medium tertiary" id="display-settings-reset">
					초기화
				</button>
				<button type="button" class="krds-btn medium primary btn-modal-close">
					닫기
				</button>
			</div>
		</div>
	</div>
</div>
<!-- //글자·화면 설정 모달 -->
