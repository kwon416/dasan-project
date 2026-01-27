<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8" isErrorPage="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오류 발생</title>
    <style>
        body {
            font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
            background: #f5f5f5;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .error-container {
            text-align: center;
            padding: 40px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 500px;
        }
        .error-code {
            font-size: 72px;
            font-weight: 700;
            color: #DC2626;
            margin-bottom: 16px;
        }
        .error-title {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 12px;
        }
        .error-message {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 24px;
            line-height: 1.6;
        }
        .error-detail {
            font-size: 12px;
            color: #9ca3af;
            background: #f9fafb;
            padding: 12px;
            border-radius: 8px;
            text-align: left;
            word-break: break-all;
            margin-bottom: 24px;
        }
        .btn-home {
            display: inline-block;
            padding: 12px 24px;
            background: #0033A0;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
        }
        .btn-home:hover {
            background: #1E5FC2;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-code">500</div>
        <h1 class="error-title">오류가 발생했습니다</h1>
        <p class="error-message">
            요청을 처리하는 중 문제가 발생했습니다.<br>
            잠시 후 다시 시도해 주세요.
        </p>
        <c:if test="${not empty exception}">
            <div class="error-detail">
                <strong>오류 내용:</strong><br>
                ${exception.message}
            </div>
        </c:if>
        <a href="<c:url value='/main.do'/>" class="btn-home">메인으로 돌아가기</a>
    </div>
</body>
</html>
