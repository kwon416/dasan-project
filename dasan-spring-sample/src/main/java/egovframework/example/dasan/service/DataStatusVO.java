package egovframework.example.dasan.service;

/**
 * 데이터 수집 현황 VO
 */
public class DataStatusVO {

    /** 수집 시작일 */
    private String collectionStart;

    /** 수집 종료일 */
    private String collectionEnd;

    /** 최종 업데이트 일시 */
    private String lastUpdated;

    /** 전체 레코드 수 */
    private int totalRecords;

    /** 총 자치구 수 */
    private int totalDistricts;

    /** 월간 레코드 수 */
    private int monthlyRecords;

    /** 포맷된 수집 시작일 (yyyy년 M월 d일 형식) */
    private String collectionStartFormatted;

    /** 포맷된 최종 업데이트 일시 */
    private String lastUpdatedFormatted;

    public String getCollectionStart() {
        return collectionStart;
    }

    public void setCollectionStart(String collectionStart) {
        this.collectionStart = collectionStart;
    }

    public String getCollectionEnd() {
        return collectionEnd;
    }

    public void setCollectionEnd(String collectionEnd) {
        this.collectionEnd = collectionEnd;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }

    public int getTotalDistricts() {
        return totalDistricts;
    }

    public void setTotalDistricts(int totalDistricts) {
        this.totalDistricts = totalDistricts;
    }

    public int getMonthlyRecords() {
        return monthlyRecords;
    }

    public void setMonthlyRecords(int monthlyRecords) {
        this.monthlyRecords = monthlyRecords;
    }

    public String getCollectionStartFormatted() {
        return collectionStartFormatted;
    }

    public void setCollectionStartFormatted(String collectionStartFormatted) {
        this.collectionStartFormatted = collectionStartFormatted;
    }

    public String getLastUpdatedFormatted() {
        return lastUpdatedFormatted;
    }

    public void setLastUpdatedFormatted(String lastUpdatedFormatted) {
        this.lastUpdatedFormatted = lastUpdatedFormatted;
    }
}
