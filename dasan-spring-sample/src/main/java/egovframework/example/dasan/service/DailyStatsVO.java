package egovframework.example.dasan.service;

/**
 * 일별 민원 통계 VO
 */
public class DailyStatsVO {

    /** 날짜 (yyyy-MM-dd) */
    private String date;

    /** 일별 민원 건수 */
    private int totalCount;

    /** 화면 표시용 날짜 (M/d) */
    private String displayDate;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public String getDisplayDate() {
        return displayDate;
    }

    public void setDisplayDate(String displayDate) {
        this.displayDate = displayDate;
    }
}
