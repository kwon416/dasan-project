package egovframework.dasan.dashboard.dao;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;
import org.springframework.stereotype.Repository;

import egovframework.dasan.dashboard.service.DashboardStatsVO;

/**
 * 대시보드 데이터 접근 클래스
 *
 * @author kwon416
 * @since 2026.01.19
 * @version 1.0
 */
@Repository("dasanDashboardDAO")
public class DasanDashboardDAO extends EgovAbstractMapper {

	/**
	 * 대시보드 통계 정보 조회
	 *
	 * @return DashboardStatsVO 통계 정보
	 * @throws Exception
	 */
	public DashboardStatsVO selectDashboardStats() throws Exception {
		return selectOne("DasanDashboardDAO.selectDashboardStats");
	}
}
