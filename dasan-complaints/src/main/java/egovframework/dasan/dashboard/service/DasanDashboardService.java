package egovframework.dasan.dashboard.service;

/**
 * 대시보드 서비스 인터페이스
 *
 * @author kwon416
 * @since 2026.01.19
 * @version 1.0
 */
public interface DasanDashboardService {

	/**
	 * 대시보드 통계 정보 조회
	 * SFR-003: 전체 민원 데이터 건수 안내
	 *
	 * @return DashboardStatsVO 통계 정보
	 * @throws Exception
	 */
	DashboardStatsVO selectDashboardStats() throws Exception;
}
