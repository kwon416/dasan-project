package kr.or.dasancall.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 다산콜 민원공개시스템 상수 및 유틸리티
 * - 자치구 인구 데이터
 * - 키워드 풀 목업 데이터
 * - TM_ZN(타임존) 계산 유틸리티
 */
public class DasanConstants {

	private DasanConstants() {}

	// ========== 자치구 인구 데이터 ==========

	public static final long POPULATION_TOTAL = 9597372L;

	private static final Object[][] POPULATION_RAW = {
		{ "종로구", 149608L }, { "중구", 131214L }, { "용산구", 217194L },
		{ "성동구", 281289L }, { "광진구", 348652L }, { "동대문구", 358603L },
		{ "중랑구", 385349L }, { "성북구", 435037L }, { "강북구", 289374L },
		{ "도봉구", 306032L }, { "노원구", 496552L }, { "은평구", 465350L },
		{ "서대문구", 318622L }, { "마포구", 372745L }, { "양천구", 434351L },
		{ "강서구", 562194L }, { "구로구", 411916L }, { "금천구", 239070L },
		{ "영등포구", 397173L }, { "동작구", 387352L }, { "관악구", 495620L },
		{ "서초구", 413076L }, { "강남구", 563215L }, { "송파구", 656310L },
		{ "강동구", 481474L }
	};

	private static final Map<String, Long> POPULATION_MAP;
	static {
		Map<String, Long> map = new LinkedHashMap<>();
		for (Object[] row : POPULATION_RAW) {
			map.put((String) row[0], (Long) row[1]);
		}
		POPULATION_MAP = Collections.unmodifiableMap(map);
	}

	public static Map<String, Long> getPopulationMap() {
		return POPULATION_MAP;
	}

	public static long getPopulation(String gu) {
		Long pop = POPULATION_MAP.get(gu);
		return pop != null ? pop : 0L;
	}

	/**
	 * 인구 1만명당 건수 계산
	 */
	public static double calcCapitaRate(long count, long population) {
		if (population <= 0) return 0.0;
		return Math.round((double) count / population * 10000 * 10) / 10.0;
	}

	// ========== 키워드 풀 목업 데이터 ==========

	private static final Map<String, List<String>> CATEGORY_TERMS;
	static {
		Map<String, List<String>> map = new LinkedHashMap<>();
		map.put("traffic", Arrays.asList(
			"주정차", "이중주차", "장애인전용주차", "버스", "배차간격", "정류소",
			"지하철", "지연", "택시", "승차거부", "교통신호등", "신호시간", "과속", "킥보드"
		));
		map.put("environment", Arrays.asList(
			"무단투기", "생활폐기물", "재활용", "분리수거", "음식물쓰레기", "악취",
			"불법소각", "미세먼지", "대기오염", "공사소음", "하수구"
		));
		map.put("safety", Arrays.asList(
			"침수", "제설", "빙판길", "싱크홀", "지반침하", "위험시설물",
			"펜스", "난간", "어린이보호구역", "안전시설", "안전점검", "CCTV"
		));
		map.put("welfare", Arrays.asList(
			"반려견", "배변", "놀이터", "시설물", "공원", "요청", "설치", "청결"
		));
		map.put("admin", Arrays.asList(
			"신고", "요청", "단속", "불법현수막", "불법광고물", "전단지",
			"스티커", "불법노점", "도로점용", "설치"
		));
		CATEGORY_TERMS = Collections.unmodifiableMap(map);
	}

	private static final List<Map<String, String>> CATEGORIES;
	static {
		List<Map<String, String>> list = new ArrayList<>();
		list.add(makeCategoryMap("all", "전체"));
		list.add(makeCategoryMap("traffic", "교통"));
		list.add(makeCategoryMap("environment", "환경"));
		list.add(makeCategoryMap("safety", "안전"));
		list.add(makeCategoryMap("welfare", "복지"));
		list.add(makeCategoryMap("admin", "행정"));
		CATEGORIES = Collections.unmodifiableList(list);
	}

	private static Map<String, String> makeCategoryMap(String id, String label) {
		Map<String, String> map = new LinkedHashMap<>();
		map.put("id", id);
		map.put("label", label);
		return map;
	}

	/**
	 * 키워드 풀 데이터 반환 (목업)
	 */
	public static Map<String, Object> getKeywordPool() {
		Map<String, Object> pool = new LinkedHashMap<>();
		pool.put("categories", CATEGORIES);

		List<Map<String, String>> items = new ArrayList<>();
		for (Map.Entry<String, List<String>> entry : CATEGORY_TERMS.entrySet()) {
			String category = entry.getKey();
			for (String term : entry.getValue()) {
				Map<String, String> item = new LinkedHashMap<>();
				item.put("term", term);
				item.put("category", category);
				items.add(item);
			}
		}
		pool.put("items", items);
		return pool;
	}

	// ========== TM_ZN 타임존 유틸리티 ==========

	private static final String[] TM_ZN_LABELS = {
		"00:00~05:59", "06:00~11:59", "12:00~17:59", "18:00~23:59"
	};

	/**
	 * 현재 시간 기준 TM_ZN (0~3)
	 */
	public static int getCurrentTmZn() {
		return Calendar.getInstance().get(Calendar.HOUR_OF_DAY) / 6;
	}

	/**
	 * TM_ZN 라벨 반환
	 */
	public static String getTmZnLabel(int tmZn) {
		if (tmZn < 0 || tmZn > 3) return "";
		return TM_ZN_LABELS[tmZn];
	}

	/**
	 * 최신 완료 타임존 정보 반환 (오늘 기준)
	 * { tmZn, yyyy, mm, dd }
	 */
	public static Map<String, String> getLatestSlot() {
		int currentTmZn = getCurrentTmZn();
		int latestTmZn = (currentTmZn + 3) % 4;

		Calendar cal = Calendar.getInstance();
		if (currentTmZn == 0) {
			cal.add(Calendar.DATE, -1);
		}

		return makeSlot(cal, latestTmZn);
	}

	/**
	 * 특정 날짜 기준 최신 완료 타임존 반환
	 * - 과거 날짜: 해당일 마지막 타임존(3) 반환
	 * - 오늘: 현재 시간 기준 최신 완료 타임존
	 * @param dateStr yyyy-MM-dd 형식
	 */
	public static Map<String, String> getLatestSlotForDate(String dateStr) {
		if (dateStr == null) return getLatestSlot();

		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			sdf.setLenient(false);
			java.util.Date targetDate = sdf.parse(dateStr);

			Calendar target = Calendar.getInstance();
			target.setTime(targetDate);

			Calendar today = Calendar.getInstance();
			// 날짜만 비교 (시분초 제거)
			today.set(Calendar.HOUR_OF_DAY, 0);
			today.set(Calendar.MINUTE, 0);
			today.set(Calendar.SECOND, 0);
			today.set(Calendar.MILLISECOND, 0);
			target.set(Calendar.HOUR_OF_DAY, 0);
			target.set(Calendar.MINUTE, 0);
			target.set(Calendar.SECOND, 0);
			target.set(Calendar.MILLISECOND, 0);

			if (target.before(today)) {
				// 과거 날짜: 마지막 타임존(3)
				Calendar cal = Calendar.getInstance();
				cal.setTime(targetDate);
				return makeSlot(cal, 3);
			} else {
				// 오늘: 기존 로직
				return getLatestSlot();
			}
		} catch (Exception e) {
			return getLatestSlot();
		}
	}

	/**
	 * 전일 동 타임존 슬롯 반환 (급상승 비교 기준)
	 */
	public static Map<String, String> getPrevDaySlot(Map<String, String> latestSlot) {
		Calendar cal = parseSlotDate(latestSlot);
		cal.add(Calendar.DATE, -1);
		int tmZn = Integer.parseInt(latestSlot.get("tmZn"));
		return makeSlot(cal, tmZn);
	}

	/**
	 * 최근 4개 타임존 슬롯 반환 (24시간 = 최다 발생 기준)
	 */
	public static List<Map<String, String>> getLast4Slots(Map<String, String> latestSlot) {
		List<Map<String, String>> slots = new ArrayList<>();
		int tmZn = Integer.parseInt(latestSlot.get("tmZn"));
		Calendar cal = parseSlotDate(latestSlot);

		for (int i = 0; i < 4; i++) {
			slots.add(makeSlot(cal, tmZn));
			tmZn--;
			if (tmZn < 0) {
				tmZn = 3;
				cal.add(Calendar.DATE, -1);
			}
		}
		return slots;
	}

	/**
	 * 전일 24시간 슬롯 반환 (최다 발생 비교 기준)
	 */
	public static List<Map<String, String>> getPrevDayLast4Slots(List<Map<String, String>> currentSlots) {
		List<Map<String, String>> prevSlots = new ArrayList<>();
		for (Map<String, String> slot : currentSlots) {
			Calendar cal = parseSlotDate(slot);
			cal.add(Calendar.DATE, -1);
			int tmZn = Integer.parseInt(slot.get("tmZn"));
			prevSlots.add(makeSlot(cal, tmZn));
		}
		return prevSlots;
	}

	private static Map<String, String> makeSlot(Calendar cal, int tmZn) {
		Map<String, String> slot = new HashMap<>();
		SimpleDateFormat yyyyFmt = new SimpleDateFormat("yyyy");
		SimpleDateFormat mmFmt = new SimpleDateFormat("MM");
		SimpleDateFormat ddFmt = new SimpleDateFormat("dd");
		slot.put("yyyy", yyyyFmt.format(cal.getTime()));
		slot.put("mm", mmFmt.format(cal.getTime()));
		slot.put("dd", ddFmt.format(cal.getTime()));
		slot.put("tmZn", String.valueOf(tmZn));
		return slot;
	}

	private static Calendar parseSlotDate(Map<String, String> slot) {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.YEAR, Integer.parseInt(slot.get("yyyy")));
		cal.set(Calendar.MONTH, Integer.parseInt(slot.get("mm")) - 1);
		cal.set(Calendar.DAY_OF_MONTH, Integer.parseInt(slot.get("dd")));
		return cal;
	}

	/**
	 * 증감률 계산 (0으로 나누기 방지)
	 */
	public static double calcDeltaPct(long current, long previous) {
		if (previous <= 0) return current > 0 ? 100.0 : 0.0;
		return Math.round((double)(current - previous) / previous * 1000) / 10.0;
	}

}
