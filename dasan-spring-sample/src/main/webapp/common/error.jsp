<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8" isErrorPage="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <title>오류 발생 - KRDS</title>

    <!-- KRDS CSS -->
    <link href="<c:url value='/resources/css/token/krds_tokens.css'/>" type="text/css" rel="stylesheet">
    <link href="<c:url value='/resources/css/cdn/krds.min.css'/>" type="text/css" rel="stylesheet">

    <style>
        /* 에러 페이지 전용 스타일 (KRDS 공식 사이트 참조) */
        .g-wrap.err {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: var(--krds-light-color-bg-secondary, #f5f5f5);
        }

        [data-krds-mode="high-contrast"] .g-wrap.err {
            background-color: var(--krds-high-contrast-color-bg-secondary, #1a1a1a);
        }

        .g-wrap.err #container {
            width: 100%;
            max-width: var(--krds-contents-wrap-size, 1248px);
            padding: 0 var(--krds-contents-padding-x, 24px);
        }

        .g-wrap.err .inner {
            display: flex;
            justify-content: center;
        }

        .g-wrap.err .contents {
            text-align: center;
            padding: 60px 40px;
            background-color: var(--krds-light-color-bg-primary, #ffffff);
            border-radius: var(--krds-radius-4, 16px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            max-width: 600px;
            width: 100%;
        }

        [data-krds-mode="high-contrast"] .g-wrap.err .contents {
            background-color: var(--krds-high-contrast-color-bg-primary, #000000);
            box-shadow: 0 0 0 1px var(--krds-high-contrast-color-border-secondary, #444);
        }

        .heading-error {
            font-family: var(--krds-typo-font-type, 'Pretendard', sans-serif);
            font-size: var(--krds-typo-heading-4-pc-font-size, 2.4rem);
            font-weight: var(--krds-typo-heading-4-pc-font-weight, 700);
            line-height: var(--krds-typo-heading-4-pc-line-height, 1.4);
            color: var(--krds-light-color-text-primary, #111827);
            margin: 0 0 24px 0;
        }

        [data-krds-mode="high-contrast"] .heading-error {
            color: var(--krds-high-contrast-color-text-primary, #ffffff);
        }

        .info-txt {
            font-family: var(--krds-typo-font-type, 'Pretendard', sans-serif);
            font-size: var(--krds-typo-body-2-pc-font-size, 1.6rem);
            font-weight: var(--krds-typo-body-2-pc-font-weight, 400);
            line-height: var(--krds-typo-body-2-pc-line-height, 1.6);
            color: var(--krds-light-color-text-secondary, #6b7280);
            margin: 0;
        }

        [data-krds-mode="high-contrast"] .info-txt {
            color: var(--krds-high-contrast-color-text-secondary, #cccccc);
        }

        .info-txt.ac {
            text-align: center;
        }

        /* PC에서 줄바꿈 */
        @media (min-width: 1024px) {
            .pc-line {
                display: block;
                line-height: inherit;
            }
        }

        /* 모바일 반응형 */
        @media (max-width: 1023px) {
            .g-wrap.err .contents {
                padding: 40px 24px;
            }

            .heading-error {
                font-size: var(--krds-typo-heading-4-mobile-font-size, 2rem);
            }

            .pc-line {
                display: inline;
            }
        }
    </style>
</head>
<body>
    <div id="wrap" class="g-wrap err">
        <!-- 컨테이너 영역 -->
        <div id="container">
            <!-- 컨텐츠 영역 -->
            <div class="inner">
                <div class="contents">
                    <h1 class="heading-error">요청하신 페이지를 찾을 수 없습니다.</h1>
                    <p class="info-txt ac">
                        <span class="pc-line">찾으시는 웹페이지의 주소가 현재 사용할 수 없거나,</span>
                        <span class="pc-line">변경 또는 삭제되어 페이지를 찾을 수 없습니다.</span>
                        <span class="pc-line">다시 한 번 확인 후 접속하시기 바랍니다.</span>
                    </p>
                </div>
            </div>
            <!-- //컨텐츠 영역 -->
        </div>
        <!-- //컨테이너 영역 -->
    </div>

    <!-- KRDS JS -->
    <script src="<c:url value='/resources/js/cdn/krds.min.js'/>"></script>
</body>
</html>
