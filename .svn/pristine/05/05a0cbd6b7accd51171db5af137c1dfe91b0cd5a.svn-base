<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>120다산콜재단 민원공개시스템 Admin</title>
<link rel="stylesheet" href="/resources/assets/krds/krds.min.css" />
<link rel="stylesheet" href="/resources/css/dasan/common.css" />
<link rel="stylesheet" href="/resources/css/dasan/admin.css" />
<script type="text/javascript" src="/resources/js/dasan/jquery-3.7.1.min.js"></script>
<script type="text/javascript" src="/resources/js/dasan/jquery-ui.min.js"></script>
<script type="text/javascript" src="/resources/js/dasan/chart.umd.min.js"></script>
<script type="text/javascript" src="/resources/js/dasan/swiper.min.js"></script>
</head>
<body>
	<div class="admin">
		<!-- Header -->
		<header class="admin-header">
			<div class="admin-header__inner">
				<div class="admin-identity">
					<a href="#" class="admin-logo"> <img
						src="/resources/css/images/logo.png" alt="120다산콜재단">
					</a>
					<p class="admin-title">120다산콜재단 민원공개시스템</p>
				</div>
				<div class="admin-user">
					<p class="user-profile">
						<span class="user-icon" aria-hidden="true"> <i
							class="svg-icon ico-my"></i>
						</span> <span class="user-id">email@email.com</span> 님
					</p>
					<button class="krds-btn ghost logout">
						<i class="svg-icon ico-logout"></i> 로그아웃
					</button>
				</div>
			</div>
		</header>

		<div class="admin-container">
			<!-- Sidebar -->
			<aside class="admin-sidebar">
				<nav>
					<ul class="admin-menu">
						<li class="menu-item"><a href="/mgmtsystem/user.do"> <i
								class="svg-icon ico-user"></i> <span class="item-title">사용자
									관리</span>
						</a></li>
						<li class="menu-item is-active"><a href="/mgmtsystem/keyword.do"> <i
								class="svg-icon ico-keyword"></i> <span class="item-title">키워드
									관리</span>
						</a></li>
						<li class="menu-item"><a href="/mgmtsystem/log.do"> <i
								class="svg-icon ico-log"></i> <span class="item-title">로그
									관리</span>
						</a></li>
					</ul>
				</nav>
			</aside>

			<!-- Main -->
			<main class="admin-content">
				<div class="admin-content__header">
					<h2 class="admin-content__title">키워드 관리</h2>
				</div>

				<div class="admin-content__inner">
					<div class="col">
						<div class="card category-card">
							<div class="card-header">
								<h3 class="card-title">분야</h3>
							</div>
							<div class="card-content">
								<!-- category tree 영역 -->
								<section class="category-wrap">
									<div class="category-tree-wrap">
										<!-- 타이틀 -->
										<div class="tree-header">전체</div>

										<ul class="tree-list">
											<li class="tree-item is-active"><a href="#"> <span
													class="item-title">복지</span>
											</a></li>
											<li class="tree-item"><a href="#"> <span
													class="item-title">환경</span>
											</a></li>
											<li class="tree-item"><a href="#"> <span
													class="item-title">교통</span>
											</a></li>
											<li class="tree-item"><a href="#"> <span
													class="item-title">안전</span>
											</a></li>
										</ul>
									</div>

									<div class="btn-wrap">
										<button class="krds-btn add">
											<i class="svg-icon ico-plus"></i> 추가
										</button>
										<button class="krds-btn delete">
											<i class="svg-icon ico-delete"></i> 삭제
										</button>
										<button class="krds-btn save">
											<i class="svg-icon ico-save"></i> 저장
										</button>
									</div>
								</section>
							</div>
						</div>

						<div class="card keyword-card">
							<div class="card-header">
								<h3 class="card-title">키워드</h3>
							</div>
							<div class="card-content">
								<div class="keyword-wrap">
									<div class="form-group horizontal">
										<label for="id" class="form-label">키워드 검색</label>
										<div class="form-conts btn-ico-wrap">
											<input type="text" id="search" class="krds-input search"
												placeholder="키워드를 검색해 주세요">
											<button type="button" class="krds-btn medium icon">
												<span class="sr-only">검색</span> <i class="svg-icon ico-sch"></i>
											</button>
										</div>
									</div>

									<!-- 테이블 -->
									<div class="krds-table-wrap">
										<table class="tbl data">
											<caption>키워드에 대한 표로 등록자, 키워드, 삭제버튼에 대한 내용으로 구성되어있다.</caption>
											<colgroup>
												<col>
												<col>
												<col style="width: 64px;">
											</colgroup>
											<thead>
												<tr>
													<th scope="col">등록자</th>
													<th scope="col">키워드</th>
													<th scope="col">작업</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>email@email.com</td>
													<td>쓰레기</td>
													<td>
														<div class="btn-wrap">
															<button class="krds-btn etc delete">
																<i class="svg-icon ico-delete"></i> 삭제
															</button>
														</div>
													</td>
												</tr>
												<tr>
													<td>email@email.com</td>
													<td>매연</td>
													<td>
														<div class="btn-wrap">
															<button class="krds-btn etc delete">
																<i class="svg-icon ico-delete"></i> 삭제
															</button>
														</div>
													</td>
												</tr>
												<tr>
													<td>email@email.com</td>
													<td>분리수거</td>
													<td>
														<div class="btn-wrap">
															<button class="krds-btn etc delete">
																<i class="svg-icon ico-delete"></i> 삭제
															</button>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<div class="btn-wrap">
										<button class="krds-btn add">
											<i class="svg-icon ico-plus"></i> 추가
										</button>
										<button class="krds-btn save">
											<i class="svg-icon ico-save"></i> 저장
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>

	<!-- js -->
	<script src="assets/krds/krds.min.js"></script>
	<script src="search.js"></script>
</body>
</html>
