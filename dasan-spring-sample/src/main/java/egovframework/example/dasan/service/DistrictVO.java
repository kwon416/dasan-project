package egovframework.example.dasan.service;

/**
 * 자치구 민원 현황 VO
 */
public class DistrictVO {

    /** 자치구 코드 */
    private String code;

    /** 자치구명 */
    private String name;

    /** 총 민원 건수 */
    private int totalComplaints;

    /** 위도 */
    private double lat;

    /** 경도 */
    private double lng;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(int totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }
}
