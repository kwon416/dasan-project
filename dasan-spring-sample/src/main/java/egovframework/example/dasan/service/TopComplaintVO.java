package egovframework.example.dasan.service;

/**
 * 오늘의 민원 Top10 VO
 */
public class TopComplaintVO {

    /** 순위 */
    private int rank;

    /** 민원 제목 */
    private String title;

    /** 카테고리 */
    private String category;

    /** 건수 */
    private int count;

    /** 트렌드 (up, down, stable) */
    private String trend;

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }
}
