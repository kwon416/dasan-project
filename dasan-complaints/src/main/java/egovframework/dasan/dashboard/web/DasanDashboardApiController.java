package egovframework.dasan.dashboard.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.dasan.dashboard.service.DasanDashboardService;
import egovframework.dasan.dashboard.service.DashboardStatsVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 대시보드 API 컨트롤러
 * SFR-003: 전체 민원 데이터 건수 안내
 *
 * @author kwon416
 * @since 2026.01.19
 * @version 1.0
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/dasan/dashboard")
@Tag(name = "DasanDashboardApiController", description = "DASAN 대시보드 API")
public class DasanDashboardApiController {

	private final DasanDashboardService dasanDashboardService;

	/**
	 * 대시보드 통계 정보 조회
	 *
	 * @return ResultVO 통계 정보
	 */
	@Operation(
		summary = "대시보드 통계 조회",
		description = "전체 민원 데이터 건수, 최신 업데이트 시각, 데이터 수집 기간 등을 조회합니다."
	)
	@GetMapping("/stats")
	public ResultVO selectDashboardStats() {
		log.debug("=== DasanDashboardApiController.selectDashboardStats() 시작 ===");

		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<>();

		try {
			DashboardStatsVO stats = dasanDashboardService.selectDashboardStats();

			resultMap.put("stats", stats);

			resultVO.setResult(resultMap);
			resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
			resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());

			log.debug("대시보드 통계 조회 성공 - 전체건수: {}", stats.getTotalCount());

		} catch (Exception e) {
			log.error("대시보드 통계 조회 중 오류 발생", e);

			resultVO.setResultCode(ResponseCode.INPUT_CHECK_ERROR.getCode());
			resultVO.setResultMessage("통계 조회 중 오류가 발생했습니다: " + e.getMessage());
		}

		log.debug("=== DasanDashboardApiController.selectDashboardStats() 종료 ===");
		return resultVO;
	}
}
