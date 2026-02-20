document.addEventListener("click", function (e) {
	// password 숨김/보임
	const button = e.target.closest(".btn-ico-wrap button");
	if (!button) return;

	const wrap = button.closest(".btn-ico-wrap");
	const input = wrap.querySelector("input");
	const icon = button.querySelector(".svg-icon");
	const srText = button.querySelector(".sr-only");

	const isPassword = input.type === "password";

	// input type 변경
	input.type = isPassword ? "text" : "password";

	// 아이콘 클래스 변경
	if (isPassword) {
	icon.classList.remove("ico-pw-visible");
	icon.classList.add("ico-pw-visible-on");
	if (srText) srText.textContent = "입력한 비밀번호 숨기기";
	} else {
	icon.classList.remove("ico-pw-visible-on");
	icon.classList.add("ico-pw-visible");
	if (srText) srText.textContent = "입력한 비밀번호 보기";
	}
});