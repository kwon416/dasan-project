package egovframework.dasan.dashboard.service;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 대시보드 통계 정보 VO
 * SFR-003: 전체 민원 데이터 건수 안내
 *
 * @author kwon416
 * @since 2026.01.19
 * @version 1.0
 */
@Schema(description = "대시보드 통계 VO")
@Getter
@Setter
public class DashboardStatsVO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 전체 민원 건수 */
	@Schema(description = "전체 민원 건수", example = "125000")
	private long totalCount;

	/** 실시간 데이터 건수 */
	@Schema(description = "실시간 데이터 건수", example = "50000")
	private long realtimeCount;

	/** 배치 데이터 건수 */
	@Schema(description = "배치 데이터 건수", example = "75000")
	private long batchCount;

	/** 최신 업데이트 일시 */
	@Schema(description = "최신 업데이트 일시", example = "2026-01-19 14:30:00")
	private String latestUpdateDt;

	/** 데이터 수집 시작일 */
	@Schema(description = "데이터 수집 시작일", example = "2020-01-01")
	private String dataCollectionBgnDe;

	/** 데이터 수집 종료일 */
	@Schema(description = "데이터 수집 종료일", example = "2026-01-19")
	private String dataCollectionEndDe;

	/** 데이터 크기 (MB) */
	@Schema(description = "데이터 크기(MB)", example = "1024.5")
	private double dataSizeMb;

	/** 오늘 등록된 건수 */
	@Schema(description = "오늘 등록된 건수", example = "350")
	private long todayCount;

	/** 이번 주 등록된 건수 */
	@Schema(description = "이번 주 등록된 건수", example = "2450")
	private long weekCount;

	/** 이번 달 등록된 건수 */
	@Schema(description = "이번 달 등록된 건수", example = "10500")
	private long monthCount;
}
