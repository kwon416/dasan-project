package egovframework.dasan.dashboard.service.impl;

import org.springframework.stereotype.Service;

import egovframework.dasan.dashboard.dao.DasanDashboardDAO;
import egovframework.dasan.dashboard.service.DasanDashboardService;
import egovframework.dasan.dashboard.service.DashboardStatsVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 대시보드 서비스 구현 클래스
 *
 * @author kwon416
 * @since 2026.01.19
 * @version 1.0
 */
@Slf4j
@RequiredArgsConstructor
@Service("dasanDashboardService")
public class DasanDashboardServiceImpl implements DasanDashboardService {

	private final DasanDashboardDAO dasanDashboardDAO;

	/**
	 * 대시보드 통계 정보 조회
	 *
	 * @return DashboardStatsVO 통계 정보
	 * @throws Exception
	 */
	@Override
	public DashboardStatsVO selectDashboardStats() throws Exception {
		log.debug("=== DasanDashboardServiceImpl.selectDashboardStats() 시작 ===");

		DashboardStatsVO result = dasanDashboardDAO.selectDashboardStats();

		if (result == null) {
			log.warn("통계 데이터 조회 결과가 null입니다.");
			result = new DashboardStatsVO();
		}

		log.debug("통계 조회 결과 - 전체건수: {}, 실시간: {}, 배치: {}",
			result.getTotalCount(), result.getRealtimeCount(), result.getBatchCount());

		log.debug("=== DasanDashboardServiceImpl.selectDashboardStats() 종료 ===");
		return result;
	}
}
