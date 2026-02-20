package kr.or.dasancall.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.egovframe.rte.psl.dataaccess.util.EgovMap;
import org.springframework.stereotype.Service;

import kr.or.dasancall.service.DashboardVO;
import kr.or.dasancall.service.MainService;
import kr.or.dasancall.util.DasanConstants;

@Service("mainService")
public class MainServiceImpl implements MainService {

	private static Logger logger = LogManager.getLogger(MainServiceImpl.class);

	@Resource(name = "mainMapper")
	private MainMapper mainMapper;

	@Override
	public List<HashMap<String, Object>> selectDataList(DashboardVO vo) throws Exception {
		return mainMapper.selectDataList(vo);
	}

	/**
	 * 대시보드 메인 데이터 통합 조회
	 */
	@Override
	public Map<String, Object> selectDashboardData(DashboardVO vo) throws Exception {
		Map<String, Object> result = new LinkedHashMap<>();
		String gu = vo.getGu();
		String keyword = vo.getKeyword();

		/*
		 * [STEP 1] 타임존 계산
		 * - latestSlot    : 가장 최근 완료된 6시간 타임존 (예: 오늘 TM_ZN=2 → 12:00~17:59)
		 * - prevDaySlot   : 전일 동일 타임존 (급상승 비교 기준)
		 * - last4Slots    : 최근 4개 타임존 = 24시간 (빈도 합산 기준)
		 * - prevDayLast4  : 전일 동일 4개 타임존 (빈도 비교 기준)
		 */
		Map<String, String> latestSlot = DasanConstants.getLatestSlotForDate(vo.getToday());
		Map<String, String> prevDaySlot = DasanConstants.getPrevDaySlot(latestSlot);
		List<Map<String, String>> last4Slots = DasanConstants.getLast4Slots(latestSlot);
		List<Map<String, String>> prevDayLast4Slots = DasanConstants.getPrevDayLast4Slots(last4Slots);
		int latestTmZn = Integer.parseInt(latestSlot.get("tmZn"));

		logger.info("Dashboard API - gu: {}, keyword: {}, latestSlot: {}", gu, keyword, latestSlot);

		/*
		 * [STEP 2] meta 정보 (데이터 기준일, 타임존 라벨, 갱신 시각)
		 */
		result.put("meta", buildMeta(latestSlot, prevDaySlot, latestTmZn));

		/*
		 * [STEP 3] 통합 쿼리 실행 
		 * UNION ALL로 서브쿼리 실행
		 * 각 행의 QTYPE 컬럼으로 어떤 서브쿼리의 결과인지 구분
		 */
		Map<String, Object> params = new HashMap<>();
		params.put("latestYyyy", latestSlot.get("yyyy"));
		params.put("latestMm", latestSlot.get("mm"));
		params.put("latestDd", latestSlot.get("dd"));
		params.put("latestTmZn", latestSlot.get("tmZn"));
		params.put("prevYyyy", prevDaySlot.get("yyyy"));
		params.put("prevMm", prevDaySlot.get("mm"));
		params.put("prevDd", prevDaySlot.get("dd"));
		params.put("prevTmZn", prevDaySlot.get("tmZn"));
		params.put("timeSlots", last4Slots);
		params.put("prevTimeSlots", prevDayLast4Slots);
		if (gu != null) params.put("gu", gu);
		if (keyword != null) params.put("keyword", keyword);

		/*
		 * [KPI 날짜 계산] TB_STAT_COMPLAINTS용 (TM_ZN 없음, HH 기반)
		 * - 오늘: YYYY/MM/DD + HH <= 현재시각
		 * - 어제: 전일 YYYY/MM/DD + HH <= 현재시각 (동일 시간대 비교)
		 */
		Calendar kpiCal = Calendar.getInstance();
		int currentHh = kpiCal.get(Calendar.HOUR_OF_DAY);

		if (vo.getToday() != null) {
			try {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				sdf.setLenient(false);
				Calendar todayCal = Calendar.getInstance();
				todayCal.set(Calendar.HOUR_OF_DAY, 0);
				todayCal.set(Calendar.MINUTE, 0);
				todayCal.set(Calendar.SECOND, 0);
				todayCal.set(Calendar.MILLISECOND, 0);

				kpiCal.setTime(sdf.parse(vo.getToday()));
				kpiCal.set(Calendar.HOUR_OF_DAY, 0);
				kpiCal.set(Calendar.MINUTE, 0);
				kpiCal.set(Calendar.SECOND, 0);
				kpiCal.set(Calendar.MILLISECOND, 0);

				if (kpiCal.before(todayCal)) {
					currentHh = 23; // 과거 날짜: 하루 전체 포함
				}
			} catch (Exception e) {
				kpiCal = Calendar.getInstance();
			}
		}

		Calendar kpiYesterday = (Calendar) kpiCal.clone();
		kpiYesterday.add(Calendar.DATE, -1);

		SimpleDateFormat yyyyFmt = new SimpleDateFormat("yyyy");
		SimpleDateFormat mmFmt = new SimpleDateFormat("MM");
		SimpleDateFormat ddFmt = new SimpleDateFormat("dd");

		params.put("kpiTodayYyyy", yyyyFmt.format(kpiCal.getTime()));
		params.put("kpiTodayMm", mmFmt.format(kpiCal.getTime()));
		params.put("kpiTodayDd", ddFmt.format(kpiCal.getTime()));
		params.put("kpiYesterdayYyyy", yyyyFmt.format(kpiYesterday.getTime()));
		params.put("kpiYesterdayMm", mmFmt.format(kpiYesterday.getTime()));
		params.put("kpiYesterdayDd", ddFmt.format(kpiYesterday.getTime()));
		params.put("kpiCurrentHh", currentHh);

		long queryStart = System.currentTimeMillis();
		List<EgovMap> allRows = mainMapper.selectDashboardAll(params);
		logger.info("Dashboard query: {}ms, rows={}", System.currentTimeMillis() - queryStart, allRows.size());

		/*
		 * [STEP 4] QTYPE별 결과 분류
		 * - KW_*    : 키워드 관련 (급상승·빈도 계산용)
		 * - DIST_*  : 자치구 관련 (지도 색상·바 차트용)
		 * - KPI_DIST_* : KPI 카드용 (keyword 필터 무관한 전체 자치구 데이터)
		 */
		List<EgovMap> kwLatest = new ArrayList<>();
		List<EgovMap> kwPrev = new ArrayList<>();
		List<EgovMap> kwVolume = new ArrayList<>();
		List<EgovMap> kwVolumePrev = new ArrayList<>();
		List<EgovMap> distLatest = new ArrayList<>();
		List<EgovMap> distPrev = new ArrayList<>();
		List<EgovMap> kpiDistLatest = new ArrayList<>();
		List<EgovMap> kpiDistPrev = new ArrayList<>();

		for (EgovMap row : allRows) {
			String qtype = String.valueOf(row.get("qtype"));
			switch (qtype) {
				case "KW_LATEST":      kwLatest.add(row);      break;
				case "KW_PREV":        kwPrev.add(row);        break;
				case "KW_VOLUME":      kwVolume.add(row);      break;
				case "KW_VOL_PREV":    kwVolumePrev.add(row);  break;
				case "DIST_LATEST":    distLatest.add(row);    break;
				case "DIST_PREV":      distPrev.add(row);      break;
				case "KPI_DIST_LATEST": kpiDistLatest.add(row); break;
				case "KPI_DIST_PREV":  kpiDistPrev.add(row);   break;
			}
		}

		// KPI 데이터는 항상 TB_STAT_COMPLAINTS에서 조회 (keyword/TM_ZN 무관)

		/*
		 * [STEP 5] 응답 데이터 조립
		 * - buildKpi       : 선택 지역 현황 + 서울시 평균 KPI 카드
		 * - buildDistricts : 25개 자치구별 건수·증감률 (지도 + 바 차트)
		 * - buildKeywords  : 급상승 Top10 + 빈도 Top10 (워드클라우드 + 랭킹)
		 * - keywordPool    : 키워드 필터 UI용 카테고리·태그 (정적 데이터)
		 */
		result.put("kpi", buildKpi(gu, kpiDistLatest, kpiDistPrev));
		result.put("districts", buildDistricts(distLatest, distPrev));
		result.put("keywords", buildKeywords(kwLatest, kwPrev, kwVolume, kwVolumePrev));
		result.put("keywordPool", DasanConstants.getKeywordPool());

		return result;
	}

	// ========== meta ==========

	/**
	 * 응답 meta 섹션 생성
	 * 프론트엔드 상단 "데이터 기준: 2026-02-13 12:00~17:59" 표시에 사용
	 * @return {dataDate, tmZn, tmZnLabel, prevDate, updatedAt}
	 */
	private Map<String, Object> buildMeta(Map<String, String> latestSlot, Map<String, String> prevSlot, int tmZn) {
		Map<String, Object> meta = new LinkedHashMap<>();
		meta.put("dataDate", latestSlot.get("yyyy") + "-" + latestSlot.get("mm") + "-" + latestSlot.get("dd"));
		meta.put("tmZn", tmZn);
		meta.put("tmZnLabel", DasanConstants.getTmZnLabel(tmZn));
		meta.put("prevDate", prevSlot.get("yyyy") + "-" + prevSlot.get("mm") + "-" + prevSlot.get("dd"));
		meta.put("updatedAt", new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
		return meta;
	}

	// ========== KPI ==========

	/**
	 * KPI 카드 데이터 생성
	 *
	 * "selected" (선택 지역 또는 서울시 전체):
	 *   - totalCount  : 최신 타임존 민원 건수
	 *   - deltaCount  : 전일 동 타임존 대비 증감 건수
	 *   - deltaPct    : 전일 대비 증감률 (%)
	 *   - capitaRate  : 인구 1만명당 민원 건수 
	 *   - capitaRank  : 인구당 건수 서울시 내 순위 (gu 선택 시)
	 *
	 * "average" (서울시 25개 자치구 평균):
	 *   - totalCount  : 자치구 평균 민원 건수
	 *   - capitaRate  : 자치구별 인구당 건수의 평균
	 *
	 * @param gu          선택 자치구 (null이면 서울시 전체)
	 * @param distLatest  최신 타임존 자치구별 건수 (KPI_DIST_LATEST 또는 DIST_LATEST)
	 * @param distPrev    전일 동 타임존 자치구별 건수
	 */
	private Map<String, Object> buildKpi(String gu, List<EgovMap> distLatest, List<EgovMap> distPrev) {
		Map<String, Object> kpi = new LinkedHashMap<>();

		Map<String, Long> latestMap = toCountMap(distLatest);
		Map<String, Long> prevMap = toCountMap(distPrev);

		// selected (선택 지역 또는 서울시 전체)
		Map<String, Object> selected = new LinkedHashMap<>();
		long selectedTotal;
		long selectedPrev;
		long selectedPopulation;

		if (gu != null) {
			selected.put("label", gu);
			selectedTotal = latestMap.getOrDefault(gu, 0L);
			selectedPrev = prevMap.getOrDefault(gu, 0L);
			selectedPopulation = DasanConstants.getPopulation(gu);

			// 인구 1만명당 순위 계산
			List<Map.Entry<String, Double>> capitaRanking = new ArrayList<>();
			for (Map.Entry<String, Long> entry : DasanConstants.getPopulationMap().entrySet()) {
				long cnt = latestMap.getOrDefault(entry.getKey(), 0L);
				double rate = DasanConstants.calcCapitaRate(cnt, entry.getValue());
				capitaRanking.add(new java.util.AbstractMap.SimpleEntry<>(entry.getKey(), rate));
			}
			capitaRanking.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
			int rank = 1;
			for (Map.Entry<String, Double> entry : capitaRanking) {
				if (entry.getKey().equals(gu)) break;
				rank++;
			}
			selected.put("capitaRank", rank);
		} else {
			selected.put("label", "서울시 전체");
			selectedTotal = sumValues(latestMap);
			selectedPrev = sumValues(prevMap);
			selectedPopulation = DasanConstants.POPULATION_TOTAL;
			selected.put("capitaRank", null);
		}

		selected.put("totalCount", selectedTotal);
		selected.put("deltaCount", selectedTotal - selectedPrev);
		selected.put("deltaPct", DasanConstants.calcDeltaPct(selectedTotal, selectedPrev));
		selected.put("capitaRate", DasanConstants.calcCapitaRate(selectedTotal, selectedPopulation));
		kpi.put("selected", selected);

		// average (서울시 자치구 평균)
		Map<String, Object> average = new LinkedHashMap<>();
		int districtCount = DasanConstants.getPopulationMap().size();
		// 25개 실제 자치구 데이터만 합산 (비자치구 제외)
		long totalAll = 0;
		long prevAll = 0;
		for (String name : DasanConstants.getPopulationMap().keySet()) {
			totalAll += latestMap.getOrDefault(name, 0L);
			prevAll += prevMap.getOrDefault(name, 0L);
		}
		long avgTotal = districtCount > 0 ? Math.round((double) totalAll / districtCount) : 0;
		long avgPrev = districtCount > 0 ? Math.round((double) prevAll / districtCount) : 0;
		double avgCapita = 0.0;
		for (Map.Entry<String, Long> entry : DasanConstants.getPopulationMap().entrySet()) {
			long cnt = latestMap.getOrDefault(entry.getKey(), 0L);
			avgCapita += DasanConstants.calcCapitaRate(cnt, entry.getValue());
		}
		avgCapita = districtCount > 0 ? Math.round(avgCapita / districtCount * 10) / 10.0 : 0.0;

		average.put("totalCount", avgTotal);
		average.put("deltaCount", avgTotal - avgPrev);
		average.put("deltaPct", DasanConstants.calcDeltaPct(avgTotal, avgPrev));
		average.put("capitaRate", avgCapita);
		kpi.put("average", average);

		return kpi;
	}

	// ========== Districts (지도 + 바차트) ==========

	/**
	 * 자치구별 + 비자치구 민원 데이터 생성 (지도 + 바 차트용)
	 *
	 * 1) 25개 자치구: 인구·인구당 건수 포함
	 * 2) 비자치구(산하기관, 서울시 등): population=0, capitaRate=0
	 *
	 * @return [{gu, population, totalCount, capitaRate, prevTotalCount, deltaPct}, ...]
	 */
	private List<Map<String, Object>> buildDistricts(List<EgovMap> distLatest, List<EgovMap> distPrev) {
		Map<String, Long> latestMap = toCountMap(distLatest);
		Map<String, Long> prevMap = toCountMap(distPrev);
		Map<String, Long> popMap = DasanConstants.getPopulationMap();

		List<Map<String, Object>> districts = new ArrayList<>();

		// ① 25개 자치구 (인구 데이터 기반)
		for (Map.Entry<String, Long> popEntry : popMap.entrySet()) {
			String name = popEntry.getKey();
			long population = popEntry.getValue();
			long totalCount = latestMap.getOrDefault(name, 0L);
			long prevTotalCount = prevMap.getOrDefault(name, 0L);

			Map<String, Object> district = new LinkedHashMap<>();
			district.put("gu", name);
			district.put("population", population);
			district.put("totalCount", totalCount);
			district.put("capitaRate", DasanConstants.calcCapitaRate(totalCount, population));
			district.put("prevTotalCount", prevTotalCount);
			district.put("deltaPct", DasanConstants.calcDeltaPct(totalCount, prevTotalCount));
			districts.add(district);
		}

		// ② 비자치구 (산하기관, 서울시, 시설관리공단, 외국어, 자치구공통 등)
		for (String guName : latestMap.keySet()) {
			if (popMap.containsKey(guName)) continue;
			long totalCount = latestMap.getOrDefault(guName, 0L);
			long prevTotalCount = prevMap.getOrDefault(guName, 0L);

			Map<String, Object> district = new LinkedHashMap<>();
			district.put("gu", guName);
			district.put("population", 0L);
			district.put("totalCount", totalCount);
			district.put("capitaRate", 0.0);
			district.put("prevTotalCount", prevTotalCount);
			district.put("deltaPct", DasanConstants.calcDeltaPct(totalCount, prevTotalCount));
			districts.add(district);
		}
		// prevMap에만 있는 비자치구 보완
		for (String guName : prevMap.keySet()) {
			if (popMap.containsKey(guName) || latestMap.containsKey(guName)) continue;
			long prevTotalCount = prevMap.getOrDefault(guName, 0L);

			Map<String, Object> district = new LinkedHashMap<>();
			district.put("gu", guName);
			district.put("population", 0L);
			district.put("totalCount", 0L);
			district.put("capitaRate", 0.0);
			district.put("prevTotalCount", prevTotalCount);
			district.put("deltaPct", DasanConstants.calcDeltaPct(0L, prevTotalCount));
			districts.add(district);
		}

		return districts;
	}

	// ========== Keywords (급상승 Top10 + 빈도 Top10) ==========

	/**
	 * 키워드 순위 데이터 생성 (워드클라우드 + 랭킹 리스트용)
	 *
	 * 4가지 데이터 소스를 조합하여 각 키워드의 급상승·빈도 지표를 산출한다.
	 *
	 * "trending" (급상승 Top 10):
	 *   - 최신 1개 타임존 건수 vs 전일 동 타임존 건수 → deltaPct 내림차순
	 *   - 프론트엔드: 워드클라우드 "급상승" 탭, KPI 카드 "급상승 키워드"
	 *
	 * "volume" (최다 발생 Top 10):
	 *   - 최근 4개 타임존(24h) 합산 건수 → dayCount 내림차순
	 *   - 프론트엔드: 워드클라우드 "빈도" 탭, KPI 카드 "최다 발생 키워드"
	 *
	 * @param kwLatest     최신 타임존 키워드별 건수 (KW_LATEST)
	 * @param kwPrev       전일 동 타임존 키워드별 건수 (KW_PREV)
	 * @param kwVolume     최근 4타임존 합산 키워드별 건수 (KW_VOLUME)
	 * @param kwVolumePrev 전일 4타임존 합산 키워드별 건수 (KW_VOL_PREV)
	 * @return {trending: [...], volume: [...]}
	 */
	private Map<String, Object> buildKeywords(
			List<EgovMap> kwLatest, List<EgovMap> kwPrev,
			List<EgovMap> kwVolume, List<EgovMap> kwVolumePrev) {

		Map<String, Long> latestMap = toCountMap(kwLatest);
		Map<String, Long> prevMap = toCountMap(kwPrev);
		Map<String, Long> volumeMap = toCountMap(kwVolume);
		Map<String, Long> volumePrevMap = toCountMap(kwVolumePrev);

		// 모든 키워드 수집
		Map<String, Boolean> allTerms = new LinkedHashMap<>();
		for (String term : latestMap.keySet()) allTerms.put(term, true);
		for (String term : prevMap.keySet()) allTerms.put(term, true);
		for (String term : volumeMap.keySet()) allTerms.put(term, true);
		for (String term : volumePrevMap.keySet()) allTerms.put(term, true);

		List<Map<String, Object>> allKeywords = new ArrayList<>();
		for (String term : allTerms.keySet()) {
			long count = latestMap.getOrDefault(term, 0L);
			long prevCount = prevMap.getOrDefault(term, 0L);
			long dayCount = volumeMap.getOrDefault(term, 0L);
			long prevDayCount = volumePrevMap.getOrDefault(term, 0L);

			Map<String, Object> kw = new LinkedHashMap<>();
			kw.put("term", term);
			// 급상승용: 최신 TM_ZN vs 전일 동 TM_ZN
			kw.put("count", count);
			kw.put("prevCount", prevCount);
			kw.put("deltaCount", count - prevCount);
			kw.put("deltaPct", DasanConstants.calcDeltaPct(count, prevCount));
			// 빈도용: 최근 4TM_ZN 합산 vs 전일 4TM_ZN 합산
			kw.put("dayCount", dayCount);
			kw.put("prevDayCount", prevDayCount);
			kw.put("volumeDelta", dayCount - prevDayCount);
			kw.put("volumeDeltaPct", DasanConstants.calcDeltaPct(dayCount, prevDayCount));
			allKeywords.add(kw);
		}

		// 급상승 Top 10: deltaPct 내림차순
		List<Map<String, Object>> byRise = new ArrayList<>(allKeywords);
		byRise.sort((a, b) -> Double.compare(
			((Number) b.get("deltaPct")).doubleValue(),
			((Number) a.get("deltaPct")).doubleValue()
		));
		List<Map<String, Object>> trending = byRise.subList(0, Math.min(10, byRise.size()));

		// 빈도 Top 10: dayCount(총 건수) 내림차순
		List<Map<String, Object>> byVolume = new ArrayList<>(allKeywords);
		byVolume.sort((a, b) -> Long.compare(
			((Number) b.get("dayCount")).longValue(),
			((Number) a.get("dayCount")).longValue()
		));
		List<Map<String, Object>> volume = byVolume.subList(0, Math.min(10, byVolume.size()));

		Map<String, Object> result = new LinkedHashMap<>();
		result.put("trending", new ArrayList<>(trending));
		result.put("volume", new ArrayList<>(volume));
		return result;
	}

	// ========== 헬퍼 메서드 ==========

	/**
	 * EgovMap 리스트를 {dimKey: cnt} Map으로 변환
	 * UNION ALL 쿼리의 DIM_KEY(→dimKey) 컬럼을 키로 사용
	 */
	private Map<String, Long> toCountMap(List<EgovMap> list) {
		Map<String, Long> map = new LinkedHashMap<>();
		if (list == null) return map;
		for (EgovMap row : list) {
			Object dimKeyObj = row.get("dimKey");
			if (dimKeyObj == null) continue;
			String key = String.valueOf(dimKeyObj);
			Object cntObj = row.get("cnt");
			long cnt = cntObj instanceof Number ? ((Number) cntObj).longValue() : 0L;
			map.put(key, cnt);
		}
		return map;
	}

	/**
	 * Map value 합산
	 */
	private long sumValues(Map<String, Long> map) {
		long sum = 0;
		for (Long v : map.values()) sum += v;
		return sum;
	}

}
