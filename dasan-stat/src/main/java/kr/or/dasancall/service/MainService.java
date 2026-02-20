package kr.or.dasancall.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface MainService {

	/**
	 * 일별 상담 통계 목록 조회 (TB_STAT_CONSULT)
	 * @param vo 조회 조건 VO
	 * @return 일자별(YYYY, MM, DD) 상담 건수 목록
	 */
	List<HashMap<String, Object>> selectDataList(DashboardVO vo) throws Exception;

	/**
	 * 대시보드 메인 데이터 통합 조회 (TB_STAT_CALL)
	 * 
	 * {
	 *   "meta"       : 조회 기준 정보 (날짜, 타임존, 갱신시각)
	 *   "kpi"        : KPI 카드 데이터
	 *     ├ "selected" : 선택 지역(또는 서울시 전체) 민원 건수·증감률·인구당 건수·순위
	 *     └ "average"  : 서울시 25개 자치구 평균 민원 건수·증감률·인구당 건수
	 *   "districts"  : 25개 자치구별 민원 건수 (지도 색상 + 바 차트용)
	 *     └ [{gu, population, totalCount, capitaRate, prevTotalCount, deltaPct}, ...]
	 *   "keywords"   : 키워드 순위 데이터
	 *     ├ "trending" : 급상승 Top 10 (전일 동 타임존 대비 증감률 내림차순)
	 *     └ "volume"   : 최다 발생 Top 10 (최근 24시간 합산 건수 내림차순)
	 *   "keywordPool": 키워드 필터 UI용 카테고리·태그 목록 (DasanConstants 정적 데이터)
	 * }
	 *
	 * @param vo 조회 조건
	 * @return 대시보드 전체 응답 데이터 (위 구조 참고)
	 * @throws Exception
	 */
	Map<String, Object> selectDashboardData(DashboardVO vo) throws Exception;

}
