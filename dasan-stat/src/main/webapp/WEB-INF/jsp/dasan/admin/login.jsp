<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<html lang="ko">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>120다산콜재단 민원공개시스템 관리자</title>
	<link rel="stylesheet" href="/resources/assets/krds/krds.min.css" />
	<link rel="stylesheet" href="/resources/css/dasan/common.css" />
	<link rel="stylesheet" href="/resources/css/dasan/login.css" />
	<script type="text/javascript" src="/resources/js/dasan/jquery-3.7.1.min.js"></script>
	<script type="text/javascript" src="/resources/js/dasan/jquery-ui.min.js"></script>
	<script type="text/javascript" src="/resources/js/dasan/chart.umd.min.js"></script>
	<script type="text/javascript" src="/resources/js/dasan/swiper.min.js"></script>
</head>
<body>
	<main class="login">
		<div class="card login-container">
			<div class="card__header">
				<h1 class="login-logo">120다산콜재단</h1>
				<p class="login-desc">관리자 계정으로 로그인하세요</p>
			</div>

			<form class="login-form">
				<div class="form-group">
					<label for="id" class="form-label">아이디</label>
					<div class="form-conts error"> <!-- 에러처리 필요 시, <div class="form-conts error"> error 클래스 추가 || 개발 주석은 확인 후 삭제해주세요. -->
						<input type="text" id="id" class="krds-input" placeholder="이메일 주소를 입력해 주세요">
					</div>
					<p class="validation">이메일 주소를 확인해 주세요</p>
				</div>

				<div class="form-group">
					<label for="password" class="form-label">비밀번호</label>
					<div class="form-conts btn-ico-wrap">
						<input type="password" id="password" class="krds-input" placeholder="비밀번호를 입력해 주세요">
						<button type="button" class="krds-btn medium icon">
							<span class="sr-only">입력한 비밀번호 보기</span>
							<i class="svg-icon ico-pw-visible"></i>
						</button>
					</div>
					<p class="validation">비밀번호를 확인해 주세요</p>
				</div>

				<button class="krds-btn primary login-submit" type="submit">
					로그인
				</button>
			</form>

			<div class="login__footer">
				<p>COPYRIGHT ⓒ 2026 120DasanCall Foundation. ALL RIGHTS RESERVED.</p>
			</div>
		</div>
	</main>
	</div>

	<!-- js -->
	<script src="/resources/assets/krds/krds.min.js"></script>
	<script src="/resources/js/dasan/common.js"></script> <!-- 비밀번호 보기/숨김 플로우 확인용으로 실제 개발 시 수정하셔도 됩니다. || 개발 주석은 확인 후 삭제해주세요. -->
</body>
</html>
