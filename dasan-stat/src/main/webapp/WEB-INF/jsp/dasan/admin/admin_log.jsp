<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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
						<li class="menu-item"><a href="/mgmtsystem/keyword.do"> <i
								class="svg-icon ico-keyword"></i> <span class="item-title">키워드
									관리</span>
						</a></li>
						<li class="menu-item is-active"><a href="/mgmtsystem/log.do"> <i
								class="svg-icon ico-log"></i> <span class="item-title">로그
									관리</span>
						</a></li>
					</ul>
				</nav>
			</aside>

			<!-- Main -->
			<main class="admin-content">
				<div class="admin-content__header">
					<h2 class="admin-content__title">사용자 관리</h2>
				</div>

				<div class="admin-content__inner">
					<div class="row">
						<div class="card user-card">
							<!-- 상단 영역 -->
							<div class="card-header">
								<!-- select 영역 -->
								<div class="list-select">
									<div class="list-total">
										총 <strong class="total-number">123</strong>건
									</div>

									<div class="form-group">
										<div class="form-conts">
											<select id="select_name" class="krds-form-select" title="선택">
												<option value="">10개씩 보기</option>
												<option value="">20개씩 보기</option>
												<option value="">30개씩 보기</option>
											</select>
										</div>
									</div>

									<div class="form-group">
										<div class="form-conts btn-ico-wrap">
											<input type="text" id="search" class="krds-input search"
												placeholder="사용자를 검색해 주세요">
											<button type="button" class="krds-btn medium icon">
												<span class="sr-only">검색</span> <i class="svg-icon ico-sch"></i>
											</button>
										</div>
									</div>
								</div>

								<!-- 버튼 영역 -->
								<div class="btn-wrap">
									<!-- 모달 확인용으로 data-target 값 사용했습니다. 실제 개발 시 수정하셔도 됩니다. || 개발 주석은 확인 후 삭제해주세요. -->
									<button type="button" class="krds-btn primary open-modal"
										data-target="modal_userSetting">신규 등록</button>
								</div>

							</div>

							<!-- 테이블 -->
							<div class="card-content">
								<div class="krds-table-wrap">
									<table class="tbl data">
										<caption>사용자에 대한 표로 번호, 아이디, 비밀번호, 등록일, 구분, 수정버튼,
											삭제버튼으로 구성되어있다.</caption>
										<colgroup>
											<col style="width: 100px;">
											<col>
											<col>
											<col>
											<col>
											<col style="width: 100px;">
										</colgroup>
										<thead>
											<tr>
												<th scope="col">번호</th>
												<th scope="col">아이디</th>
												<th scope="col">비밀번호</th>
												<th scope="col">등록일</th>
												<th scope="col">구분</th>
												<th scope="col">작업</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>100</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-warning">관리자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>99</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-primary">사용자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>98</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-primary">사용자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>97</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-primary">사용자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>96</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-primary">사용자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>95</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-warning">관리자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>94</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-primary">사용자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>93</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-primary">사용자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>92</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-primary">사용자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
											<tr>
												<td>91</td>
												<td>email@email.com</td>
												<td>******</td>
												<td>2026.01.01</td>
												<td><span class="krds-badge bg-light-primary">사용자</span>
												</td>
												<td>
													<div class="btn-wrap">
														<button class="krds-btn etc edit">
															<i class="svg-icon ico-edit"></i> 수정
														</button>
														<button class="krds-btn etc delete">
															<i class="svg-icon ico-delete"></i> 삭제
														</button>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<!-- 하단 영역 -->
							<div class="card-footer">
								<!-- 페이지네이션 -->
								<div class="krds-pagination">
									<span class="page-navi prev disabled" href="#">이전</span>
									<div class="page-links">
										<a class="page-link" href="#">1</a> <a class="page-link"
											href="#">2</a> <a class="page-link" href="#">3</a> <a
											class="page-link active" href="#"><span class="sr-only">현재페이지
										</span>4</a> <a class="page-link" href="#">5</a> <a class="page-link"
											href="#">6</a> <a class="page-link" href="#">7</a> <a
											class="page-link" href="#">8</a> <span
											class="page-link link-dot"></span> <a class="page-link"
											href="#">99</a>
									</div>
									<a class="page-navi next" href="#">다음</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>

	<!-- modal -->
	<!-- 모달 확인용으로 id 값 사용했습니다. 실제 개발 시 수정하셔도 됩니다. || 개발 주석은 확인 후 삭제해주세요. -->
	<section id="modal_userSetting" class="krds-modal fade in"
		role="dialog" aria-labelledby="modal_userSettin">
		<div class="modal-dialog">
			<div class="modal-content">
				<!-- modal title -->
				<div class="modal-header">
					<h2 id="modal_userSetting" class="modal-title">사용자 정보</h2>
				</div>
				<!-- //modal title -->
				<!-- modal contents -->
				<div class="modal-conts">
					<div class="row">
						<div class="form-group horizontal">
							<label for="id" class="form-label required">아이디</label>
							<div class="form-conts">
								<input type="text" id="id" class="krds-input"
									placeholder="이메일 주소">
								<!-- 모달 확인용으로 data-target 값 사용했습니다. 실제 개발 시 수정하셔도 됩니다. || 개발 주석은 확인 후 삭제해주세요. -->
								<button type="button"
									class="krds-btn etc login-submit open-modal"
									data-target="modal_alert">중복확인</button>
							</div>
							<p class="validation">이메일 주소를 확인해 주세요</p>
						</div>

						<div class="form-group horizontal">
							<label for="pw" class="form-label required">비밀번호</label>
							<div class="form-conts">
								<input type="text" id="pw" class="krds-input"
									placeholder="영소/숫자/특수문자 포함 8~12글자 내 입력">
							</div>
							<p class="validation">비밀번호를 확인해 주세요</p>
						</div>

						<div class="form-group horizontal">
							<label for="checkPw" class="form-label required">비밀번호 확인</label>
							<div class="form-conts">
								<input type="text" id="checkPw" class="krds-input"
									placeholder="비밀번호를 다시 한번 입력">
							</div>
							<p class="validation">비밀번호가 다릅니다</p>
						</div>

						<div class="form-group horizontal">
							<label for="role" class="form-label required">구분</label>
							<div class="col">
								<div class="krds-form-check">
									<input type="radio" name="role" id="role-admin" checked>
									<label for="role-admin">관리자</label>
								</div>
								<div class="krds-form-check">
									<input type="radio" name="role" id="role-user"> <label
										for="role-user">사용자</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- //modal contents -->
				<!-- modal btn -->
				<div class="modal-btn btn-wrap">
					<button type="button" class="krds-btn secondary close-modal">취소</button>
					<button type="button" class="krds-btn primary close-modal">확인</button>
				</div>
				<!-- //modal btn -->
				<!-- close button -->
				<button type="button"
					class="krds-btn medium icon btn-close close-modal">
					<span class="sr-only">닫기</span> <i class="svg-icon ico-popup-close"></i>
				</button>
				<!-- //close button -->
			</div>
		</div>
		<div class="modal-back in"></div>
	</section>

	<!-- 중복확인 모달 예시 -->
	<section id="modal_alert" class="krds-modal fade in alert"
		role="dialog" aria-labelledby="modal_alert">
		<div class="modal-dialog">
			<div class="modal-content">
				<!-- modal title -->
				<div class="modal-header">
					<h2 id="modal_alert" class="modal-title"></h2>
				</div>
				<!-- //modal title -->
				<!-- modal contents -->
				<div class="modal-conts">
					<p class="alert-text">사용할 수 있는 이메일입니다.</p>
					<p class="alert-subtext"></p>
				</div>
				<!-- //modal contents -->
				<!-- modal btn -->
				<div class="modal-btn btn-wrap">
					<button type="button" class="krds-btn primary close-modal">확인</button>
				</div>
				<!-- //modal btn -->
				<!-- close button -->
				<button type="button"
					class="krds-btn medium icon btn-close close-modal">
					<span class="sr-only">닫기</span> <i class="svg-icon ico-popup-close"></i>
				</button>
				<!-- //close button -->
			</div>
		</div>
		<div class="modal-back in"></div>
	</section>

	<!-- js -->
	<script src="assets/krds/krds.min.js"></script>
	<script src="search.js"></script>
</body>
</html>
