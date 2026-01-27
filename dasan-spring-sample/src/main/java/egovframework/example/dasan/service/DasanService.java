package egovframework.example.dasan.service;

import java.util.List;

/**
 * 다산콜 민원 서비스 인터페이스
 */
public interface DasanService {

    /**
     * 데이터 수집 현황 조회
     * @return 데이터 상태 정보
     */
    DataStatusVO selectDataStatus() throws Exception;

    /**
     * 일별 민원 통계 조회
     * @return 일별 통계 목록
     */
    List<DailyStatsVO> selectDailyStats() throws Exception;

    /**
     * 자치구별 민원 Top10 조회
     * @return 자치구 목록 (Top10)
     */
    List<DistrictVO> selectDistrictTop10() throws Exception;

    /**
     * 오늘의 이슈 키워드 조회 (워드클라우드용)
     * @return 키워드 목록
     */
    List<KeywordVO> selectTodayIssues() throws Exception;

    /**
     * 오늘의 이슈 키워드 타임스탬프 조회
     * @return 타임스탬프 문자열
     */
    String selectTodayIssuesTimestamp() throws Exception;

    /**
     * 오늘의 민원 Top10 조회
     * @return 민원 Top10 목록
     */
    List<TopComplaintVO> selectTodayTopComplaints() throws Exception;

    /**
     * 오늘의 민원 Top10 타임스탬프 조회
     * @return 타임스탬프 문자열
     */
    String selectTodayTopComplaintsTimestamp() throws Exception;
}
