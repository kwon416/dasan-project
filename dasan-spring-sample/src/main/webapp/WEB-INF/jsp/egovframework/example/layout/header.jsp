<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>



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
					<a href="<c:url value='/main.do'/>" class="logo-link">
						<img src="<c:url value='/resources/img/logo.jpg'/>" alt="120 다산콜 민원공개시스템 - 홈으로" class="logo-img">
					</a>
					<div class="header-actions">
						<!-- 검색 입력창 -->
						<div class="sch-input">
							<label for="header-search" class="sr-only">검색어 입력</label>
							<input type="text" id="header-search" class="krds-input" placeholder="검색어를 입력하세요">
							<button type="button" class="krds-btn medium icon ico-search" aria-label="검색">
								<i class="svg-icon ico-sch" aria-hidden="true"></i>
							</button>
						</div>
						<!-- 전체메뉴 버튼 (모바일) -->
						<button type="button" class="btn-navi all" aria-controls="mobile-nav">전체메뉴</button>
					</div>
				</div>
			</div>
		</div>
		<!-- //헤더 상단 기타메뉴 -->

		<!-- 메인메뉴 : 데스크탑 -->
		<nav id="krds-main-menu" class="krds-main-menu" role="navigation" aria-label="메인 메뉴">
			<div class="inner">
				<ul class="gnb-menu">
					<li>
						<a href="<c:url value='/main.do'/>"
						   class="gnb-main-trigger is-link<c:if test="${currentMenu == 'main'}"> active</c:if>"
						   data-trigger="gnb"
						   <c:if test="${currentMenu == 'main'}">aria-current="page"</c:if>>메인</a>
					</li>
					<li>
						<a href="<c:url value='/callIssue.do'/>"
						   class="gnb-main-trigger is-link<c:if test="${currentMenu == 'callIssue'}"> active</c:if>"
						   data-trigger="gnb"
						   <c:if test="${currentMenu == 'callIssue'}">aria-current="page"</c:if>>콜 이슈</a>
					</li>
					<li>
						<button type="button"
								class="gnb-main-trigger<c:if test="${currentMenu == 'complaint'}"> active</c:if>"
								data-trigger="gnb"
								aria-expanded="false"
								aria-haspopup="true">민원</button>
						<!-- gnb-toggle-wrap -->
						<div class="gnb-toggle-wrap" role="region" aria-label="민원 하위 메뉴">
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
				<!-- gnb-login -->
				<div class="gnb-login">
					<span class="site-name">120 다산콜 민원공개시스템</span>
				</div>
				<!-- //gnb-login -->
				<!-- 검색 -->
				<div class="sch-input">
					<label for="mobile-menu-search" class="sr-only">메뉴 검색</label>
					<input type="text" id="mobile-menu-search" class="krds-input" placeholder="찾고자 하는 메뉴명을 입력해 주세요">
					<button type="button" class="krds-btn medium icon ico-search" aria-label="메뉴 검색">
						<i class="svg-icon ico-sch" aria-hidden="true"></i>
					</button>
				</div>
				<!-- //검색 -->
			</div>
			<!-- //gnb-header -->

			<!-- gnb-body -->
			<div class="gnb-body">
				<!-- gnb-menu -->
				<div class="gnb-menu">
					<!-- 탭 메뉴 (1뎁스) -->
					<div class="menu-wrap">
						<ul role="tablist" aria-label="메뉴 카테고리">
							<li role="none">
								<a href="#mGnb-anchor1"
								   class="gnb-main-trigger<c:if test="${currentMenu == 'main'}"> active</c:if>"
								   role="tab"
								   id="tab-main"
								   aria-controls="mGnb-anchor1"
								   aria-selected="${currentMenu == 'main' ? 'true' : 'false'}">메인</a>
							</li>
							<li role="none">
								<a href="#mGnb-anchor2"
								   class="gnb-main-trigger<c:if test="${currentMenu == 'callIssue'}"> active</c:if>"
								   role="tab"
								   id="tab-callIssue"
								   aria-controls="mGnb-anchor2"
								   aria-selected="${currentMenu == 'callIssue' ? 'true' : 'false'}">콜 이슈</a>
							</li>
							<li role="none">
								<a href="#mGnb-anchor3"
								   class="gnb-main-trigger<c:if test="${currentMenu == 'complaint'}"> active</c:if>"
								   role="tab"
								   id="tab-complaint"
								   aria-controls="mGnb-anchor3"
								   aria-selected="${currentMenu == 'complaint' ? 'true' : 'false'}">민원</a>
							</li>
							<li role="none">
								<a href="#mGnb-anchor4"
								   class="gnb-main-trigger<c:if test="${currentMenu == 'admin'}"> active</c:if>"
								   role="tab"
								   id="tab-admin"
								   aria-controls="mGnb-anchor4"
								   aria-selected="${currentMenu == 'admin' ? 'true' : 'false'}">관리자</a>
							</li>
						</ul>
					</div>
					<!-- 서브메뉴 (2뎁스) -->
					<div class="submenu-wrap">
						<div class="gnb-sub-list" id="mGnb-anchor1" role="tabpanel" aria-labelledby="tab-main">
							<h2 class="sub-title">메인</h2>
							<ul>
								<li>
									<a href="<c:url value='/main.do'/>" class="gnb-sub-trigger"
									   <c:if test="${currentMenu == 'main'}">aria-current="page"</c:if>>
										대시보드
									</a>
								</li>
							</ul>
						</div>
						<div class="gnb-sub-list" id="mGnb-anchor2" role="tabpanel" aria-labelledby="tab-callIssue">
							<h2 class="sub-title">콜 이슈</h2>
							<ul>
								<li>
									<a href="<c:url value='/callIssue.do'/>" class="gnb-sub-trigger"
									   <c:if test="${currentMenu == 'callIssue'}">aria-current="page"</c:if>>
										키워드 검색
									</a>
								</li>
							</ul>
						</div>
						<div class="gnb-sub-list" id="mGnb-anchor3" role="tabpanel" aria-labelledby="tab-complaint">
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
						<div class="gnb-sub-list" id="mGnb-anchor4" role="tabpanel" aria-labelledby="tab-admin">
							<h2 class="sub-title">관리자</h2>
							<ul>
								<li>
									<a href="<c:url value='/admin.do'/>" class="gnb-sub-trigger"
									   <c:if test="${currentMenu == 'admin'}">aria-current="page"</c:if>>
										관리자 페이지
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
			<button type="button" class="krds-btn medium icon gnb-close-btn" id="close-nav" aria-label="전체메뉴 닫기">
				<i class="svg-icon ico-popup-close" aria-hidden="true"></i>
			</button>
			<!-- //gnb-close -->
		</div>
	</div>
	<!-- //메인메뉴 : 모바일 사이드메뉴 -->
</header>
<!-- //header -->

<!-- 글자·화면 설정 모달 -->
<div id="display-settings-modal"
	 class="krds-modal"
	 role="dialog"
	 aria-modal="true"
	 aria-labelledby="display-settings-title">
	<!-- 모달 배경 -->
	<div class="modal-back" aria-hidden="true"></div>

	<!-- 모달 다이얼로그 -->
	<div class="modal-dialog modal-sm">
		<div class="modal-content" tabindex="-1">
			<!-- 모달 헤더 -->
			<div class="modal-header">
				<h2 id="display-settings-title" class="modal-title">글자·화면 설정</h2>
			</div>

			<!-- 모달 본문 -->
			<div class="modal-conts">
				<div class="conts-area">
					<!-- 화면 크기 조정 섹션 -->
					<div class="settings-section">
						<h3 class="settings-section-title">화면 크기</h3>
						<p class="settings-section-desc">화면에 표시되는 모든 요소의 크기를 조정합니다.</p>

						<div class="zoom-options" role="radiogroup" aria-label="화면 크기 선택">
							<button type="button"
									class="zoom-option sm"
									data-zoom="0.9"
									role="radio"
									aria-checked="false">
								<span class="zoom-icon" aria-hidden="true"></span>
								<span class="zoom-label">작게<span class="zoom-percent">90%</span></span>
							</button>
							<button type="button"
									class="zoom-option md active"
									data-zoom="1"
									role="radio"
									aria-checked="true">
								<span class="zoom-icon" aria-hidden="true"></span>
								<span class="zoom-label">보통<span class="zoom-percent">100%</span></span>
							</button>
							<button type="button"
									class="zoom-option lg"
									data-zoom="1.1"
									role="radio"
									aria-checked="false">
								<span class="zoom-icon" aria-hidden="true"></span>
								<span class="zoom-label">조금 크게<span class="zoom-percent">110%</span></span>
							</button>
							<button type="button"
									class="zoom-option xlg"
									data-zoom="1.3"
									role="radio"
									aria-checked="false">
								<span class="zoom-icon" aria-hidden="true"></span>
								<span class="zoom-label">크게<span class="zoom-percent">130%</span></span>
							</button>
							<button type="button"
									class="zoom-option xxlg"
									data-zoom="1.5"
									role="radio"
									aria-checked="false">
								<span class="zoom-icon" aria-hidden="true"></span>
								<span class="zoom-label">가장 크게<span class="zoom-percent">150%</span></span>
							</button>
						</div>
					</div>

					<!-- 고대비 모드 섹션 -->
					<div class="settings-section">
						<h3 class="settings-section-title">화면 모드</h3>
						<p class="settings-section-desc">시인성을 높이기 위한 화면 모드를 선택합니다.</p>

						<div class="mode-options" role="radiogroup" aria-label="화면 모드 선택">
							<button type="button"
									class="mode-option active"
									data-mode="light"
									role="radio"
									aria-checked="true">
								<span class="mode-icon light" aria-hidden="true"></span>
								<span class="mode-label">일반 모드</span>
							</button>
							<button type="button"
									class="mode-option"
									data-mode="high-contrast"
									role="radio"
									aria-checked="false">
								<span class="mode-icon high-contrast" aria-hidden="true"></span>
								<span class="mode-label">선명한 화면</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- 모달 푸터 -->
			<div class="modal-btn">
				<button type="button" class="krds-btn medium tertiary btn-reset" id="display-settings-reset">
					초기화
				</button>
				<button type="button" class="krds-btn medium primary btn-apply" id="display-settings-apply">
					적용
				</button>
			</div>

			<!-- 닫기 버튼 -->
			<button type="button" class="krds-btn medium icon btn-close" aria-label="닫기">
				<i class="svg-icon ico-modal-close" aria-hidden="true"></i>
			</button>
		</div>
	</div>
</div>
<!-- //글자·화면 설정 모달 -->
