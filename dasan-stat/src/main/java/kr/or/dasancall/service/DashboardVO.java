package kr.or.dasancall.service;

/**
 * 메인 페이지 VO
 */
public class DashboardVO {

	private String today;
	private String gu;
	private String keyword;

	public String getToday() {
		return today;
	}

	public void setToday(String today) {
		this.today = (today != null && today.matches("\\d{4}-\\d{2}-\\d{2}")) ? today.trim() : null;
	}

	public String getGu() {
		return gu;
	}

	public void setGu(String gu) {
		this.gu = (gu != null && !gu.trim().isEmpty()) ? gu.trim() : null;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
	}

}
