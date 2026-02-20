const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MIN_LOADING_MS = 180;
const BATCH_HOUR = 2;
const RESULT_COUNT = 2400;

const PERIOD_CONFIG = {
  custom: {
    label: "검색기간",
    days: 30,
    bucket: "auto",
    compareLabel: "전년 동일기간",
    tooltipFormula: "(선택 기간 - 전년 동일기간) / 전년 동일기간 x 100",
    speechBasis: "전년 동일기간 대비"
  },
  daily: {
    label: "전일",
    days: 1,
    bucket: "hour",
    compareLabel: "전일(D-2)",
    tooltipFormula: "(D-1 건수 - D-2 건수) / D-2 건수 x 100",
    speechBasis: "전일 대비"
  },
  "3m": {
    label: "3개월",
    days: 90,
    bucket: "week",
    compareLabel: "전년 동기 3개월",
    tooltipFormula: "(최근 90일 - 전년 동기 90일) / 전년 동기 90일 x 100",
    speechBasis: "전년 동기 대비"
  },
  "6m": {
    label: "6개월",
    days: 180,
    bucket: "week",
    compareLabel: "전년 동기 6개월",
    tooltipFormula: "(최근 180일 - 전년 동기 180일) / 전년 동기 180일 x 100",
    speechBasis: "전년 동기 대비"
  },
  "1y": {
    label: "1년",
    days: 365,
    bucket: "month",
    compareLabel: "전년도 1년",
    tooltipFormula: "(최근 1년 - 전년도 1년) / 전년도 1년 x 100",
    speechBasis: "전년 동기 대비"
  }
};

const CATEGORIES = ["교통", "환경", "안전", "시설", "복지", "주거", "행정", "기타"];

const DISTRICT_OPTIONS = [
  "종로구",
  "중구",
  "용산구",
  "성동구",
  "광진구",
  "동대문구",
  "중랑구",
  "성북구",
  "강북구",
  "도봉구",
  "노원구",
  "은평구",
  "서대문구",
  "마포구",
  "양천구",
  "강서구",
  "구로구",
  "금천구",
  "영등포구",
  "동작구",
  "관악구",
  "서초구",
  "강남구",
  "송파구",
  "강동구"
];
const ALL_DISTRICT_LABEL = "서울시 전체";
const DISTRICT_FILTER_OPTIONS = [ALL_DISTRICT_LABEL, ...DISTRICT_OPTIONS];

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAY_FULL_LABELS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const ACTIVITY_COLORS = ["#F2F4F6", "#E8EEF8", "#D5E5FB", "#B8D4FB", "#88B9FB", "#3182F6"];

const SEASONS = [
  { key: "spring", label: "봄", months: [3, 4, 5] },
  { key: "summer", label: "여름", months: [6, 7, 8] },
  { key: "autumn", label: "가을", months: [9, 10, 11] },
  { key: "winter", label: "겨울", months: [12, 1, 2] }
];

const SEASON_ICONS = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️"
};

const keywordPool = [
  "불법", "주정차", "이중주차", "배차간격", "정류소", "지하철", "고장", "승차거부", "횡단보도", "과속",
  "난폭운전", "킥보드", "무단방치", "자전거도로", "포트홀", "보도블록", "노면표시", "교통표지판", "맨홀", "낙하물",
  "적치물", "교통통제", "쓰레기", "무단투기", "수거지연", "분리수거", "음식물쓰레기", "악취", "담배꽁초", "청결",
  "불법소각", "비산먼지", "미세먼지", "대기오염", "층간소음", "공사소음", "빛공해", "가로등", "보안등", "배수불량",
  "침수", "빙판길", "싱크홀", "지반침하", "위험시설물", "난간", "어린이보호구역", "안전시설", "안전점검", "불법광고물",
  "불법노점", "도로점용", "반려견", "배변", "목줄", "CCTV", "설치", "요청"
];

const SEARCH_ITEMS = createSearchItems(RESULT_COUNT);

const state = {
  period: "daily",
  query: "",
  selectedDistrict: ALL_DISTRICT_LABEL,
  activeDistrict: null,
  customStart: "",
  customEnd: "",
  requestId: 0,
  activeRequestId: 0,
  chartModel: null,
  activityModel: null
};

const districtSelect = document.getElementById("districtSelect");
const keywordInput = document.getElementById("keywordInput");
const keywordSearchBtn = document.getElementById("keywordSearchBtn");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const periodTabs = document.getElementById("periodTabs");
const customRangeWrap = document.getElementById("customRangeWrap");
const customStartInput = document.getElementById("customStartInput");
const customEndInput = document.getElementById("customEndInput");
const analysisContext = document.getElementById("analysisContext");
const rangeStartInput = document.getElementById("rangeStartInput");
const rangeEndInput = document.getElementById("rangeEndInput");
const batchUpdated = document.getElementById("batchUpdated");
const kpiCard1Title = document.getElementById("kpiCard1Title");
const kpiCard1Period = document.getElementById("kpiCard1Period");
const kpiCard1Main = document.getElementById("kpiCard1Main");
const kpiCard1Secondary = document.getElementById("kpiCard1Secondary");
const kpiCard1BottomLabel = document.getElementById("kpiCard1BottomLabel");
const kpiCard1Footer = document.getElementById("kpiCard1Footer");

const kpiCard2Title = document.getElementById("kpiCard2Title");
const kpiCard2Period = document.getElementById("kpiCard2Period");
const kpiCard2Main = document.getElementById("kpiCard2Main");
const kpiCard2Secondary = document.getElementById("kpiCard2Secondary");
const kpiCard2BottomLabel = document.getElementById("kpiCard2BottomLabel");
const kpiCard2Footer = document.getElementById("kpiCard2Footer");

const kpiCard3Title = document.getElementById("kpiCard3Title");
const kpiCard3Period = document.getElementById("kpiCard3Period");
const kpiCard3Main = document.getElementById("kpiCard3Main");
const kpiCard3Secondary = document.getElementById("kpiCard3Secondary");
const kpiCard3BottomLabel = document.getElementById("kpiCard3BottomLabel");
const kpiCard3Footer = document.getElementById("kpiCard3Footer");

const kpiCard4Title = document.getElementById("kpiCard4Title");
const kpiCard4Period = document.getElementById("kpiCard4Period");
const kpiCard4Main = document.getElementById("kpiCard4Main");
const kpiCard4Secondary = document.getElementById("kpiCard4Secondary");
const kpiCard4BottomLabel = document.getElementById("kpiCard4BottomLabel");
const kpiCard4Footer = document.getElementById("kpiCard4Footer");

const kpiCards = {
  card1: {
    title: kpiCard1Title,
    period: kpiCard1Period,
    main: kpiCard1Main,
    secondary: kpiCard1Secondary,
    bottomLabel: kpiCard1BottomLabel,
    footer: kpiCard1Footer
  },
  card2: {
    title: kpiCard2Title,
    period: kpiCard2Period,
    main: kpiCard2Main,
    secondary: kpiCard2Secondary,
    bottomLabel: kpiCard2BottomLabel,
    footer: kpiCard2Footer
  },
  card3: {
    title: kpiCard3Title,
    period: kpiCard3Period,
    main: kpiCard3Main,
    secondary: kpiCard3Secondary,
    bottomLabel: kpiCard3BottomLabel,
    footer: kpiCard3Footer
  },
  card4: {
    title: kpiCard4Title,
    period: kpiCard4Period,
    main: kpiCard4Main,
    secondary: kpiCard4Secondary,
    bottomLabel: kpiCard4BottomLabel,
    footer: kpiCard4Footer
  }
};

const trendSummary = document.getElementById("trendSummary");
const comparisonChartWrap = document.getElementById("comparisonChartWrap");
const chartTooltip = document.getElementById("chartTooltip");

const formulaGuideBtn = document.getElementById("formulaGuideBtn");
const formulaGuideTooltip = document.getElementById("formulaGuideTooltip");

const mapSvgWrap = document.getElementById("mapSvgWrap");
const mapSvg = document.getElementById("mapSvg");
const legendTitle = document.getElementById("legendTitle");
const legendMin = document.getElementById("legendMin");
const legendMax = document.getElementById("legendMax");
const regionMapSectionTitle = document.getElementById("regionMapSectionTitle");
const districtSectionTitle = document.getElementById("districtSectionTitle");
const districtRankingBars = document.getElementById("districtRankingBars");

const activityInsightTag = document.getElementById("activityInsightTag");
const activityPeakLabel = document.getElementById("activityPeakLabel");
const activityGridWrap = document.getElementById("activityGridWrap");
const activityTooltip = document.getElementById("activityTooltip");

const seasonCards = document.getElementById("seasonCards");

function ensureRequiredDom() {
  const required = [
    ["#districtSelect", districtSelect],
    ["#keywordInput", keywordInput],
    ["#keywordSearchBtn", keywordSearchBtn],
    ["#resetFiltersBtn", resetFiltersBtn],
    ["#periodTabs", periodTabs],
    ["#customRangeWrap", customRangeWrap],
    ["#customStartInput", customStartInput],
    ["#customEndInput", customEndInput],
    ["#analysisContext", analysisContext],
    ["#rangeStartInput", rangeStartInput],
    ["#rangeEndInput", rangeEndInput],
    ["#batchUpdated", batchUpdated],
    ["#kpiCard1Title", kpiCard1Title],
    ["#kpiCard1Period", kpiCard1Period],
    ["#kpiCard1Main", kpiCard1Main],
    ["#kpiCard1Secondary", kpiCard1Secondary],
    ["#kpiCard1BottomLabel", kpiCard1BottomLabel],
    ["#kpiCard1Footer", kpiCard1Footer],
    ["#kpiCard2Title", kpiCard2Title],
    ["#kpiCard2Period", kpiCard2Period],
    ["#kpiCard2Main", kpiCard2Main],
    ["#kpiCard2Secondary", kpiCard2Secondary],
    ["#kpiCard2BottomLabel", kpiCard2BottomLabel],
    ["#kpiCard2Footer", kpiCard2Footer],
    ["#kpiCard3Title", kpiCard3Title],
    ["#kpiCard3Period", kpiCard3Period],
    ["#kpiCard3Main", kpiCard3Main],
    ["#kpiCard3Secondary", kpiCard3Secondary],
    ["#kpiCard3BottomLabel", kpiCard3BottomLabel],
    ["#kpiCard3Footer", kpiCard3Footer],
    ["#kpiCard4Title", kpiCard4Title],
    ["#kpiCard4Period", kpiCard4Period],
    ["#kpiCard4Main", kpiCard4Main],
    ["#kpiCard4Secondary", kpiCard4Secondary],
    ["#kpiCard4BottomLabel", kpiCard4BottomLabel],
    ["#kpiCard4Footer", kpiCard4Footer],
    ["#trendSummary", trendSummary],
    ["#comparisonChartWrap", comparisonChartWrap],
    ["#chartTooltip", chartTooltip],
    ["#formulaGuideBtn", formulaGuideBtn],
    ["#formulaGuideTooltip", formulaGuideTooltip],
    ["#mapSvgWrap", mapSvgWrap],
    ["#mapSvg", mapSvg],
    ["#legendTitle", legendTitle],
    ["#legendMin", legendMin],
    ["#legendMax", legendMax],
    ["#regionMapSectionTitle", regionMapSectionTitle],
    ["#districtSectionTitle", districtSectionTitle],
    ["#districtRankingBars", districtRankingBars],
    ["#activityInsightTag", activityInsightTag],
    ["#activityPeakLabel", activityPeakLabel],
    ["#activityGridWrap", activityGridWrap],
    ["#activityTooltip", activityTooltip],
    ["#seasonCards", seasonCards]
  ];

  const missing = required.filter(([, node]) => !node).map(([selector]) => selector);
  if (missing.length) {
    throw new Error(`필수 DOM이 누락되었습니다: ${missing.join(", ")}`);
  }
}

function seedFromText(text) {
  return Array.from(String(text || "")).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function createPrng(seed) {
  let value = seed >>> 0;
  return function prng() {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(prng, min, max) {
  return Math.floor(prng() * (max - min + 1)) + min;
}

function shuffle(values, prng) {
  const arr = [...values];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(prng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createSearchItems(count) {
  const now = Date.now();
  const prng = createPrng(seedFromText("analysis-dashboard-v3"));
  const templates = [
    (a, b, category) => `${a} 관련 ${category} 민원 처리 현황 안내`,
    (a, b, category) => `${category} 분야 ${a} 개선 요청 접수`,
    (a, b, category) => `${a}·${b} 이슈 점검 결과 공유`,
    (a, b, category) => `${category} 민원: ${a} 대응 진행상황`,
    (a, b, category) => `${a} 중심 ${category} 생활불편 접수 요약`
  ];

  const items = [];

  for (let idx = 0; idx < count; idx += 1) {
    const ratio = prng();
    let dayOffset = 0;
    if (ratio < 0.63) {
      dayOffset = randomInt(prng, 0, 180);
    } else if (ratio < 0.9) {
      dayOffset = randomInt(prng, 181, 540);
    } else {
      dayOffset = randomInt(prng, 541, 820);
    }

    const minuteOffset = randomInt(prng, 0, 1439);
    const timestamp = now - dayOffset * DAY_MS - minuteOffset * 60 * 1000;
    const keywords = shuffle(keywordPool, prng).slice(0, randomInt(prng, 2, 4));
    const category = CATEGORIES[randomInt(prng, 0, CATEGORIES.length - 1)];
    const district = DISTRICT_OPTIONS[randomInt(prng, 0, DISTRICT_OPTIONS.length - 1)];
    const primary = keywords[0];
    const secondary = keywords[1] || keywords[0];
    const tertiary = keywords[2] || keywords[1] || keywords[0];

    items.push({
      id: `metric-${idx + 1}`,
      title: templates[randomInt(prng, 0, templates.length - 1)](primary, secondary, category),
      summary: `${primary}, ${secondary}, ${tertiary} 관련 ${category} 문의가 접수되었으며 현황과 처리 경과를 정리했습니다.`,
      category,
      district,
      date: new Date(timestamp),
      keywords
    });
  }

  return items;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function tokenizeQuery(query) {
  return Array.from(
    new Set(
      normalizeText(query)
        .split(/\s+/)
        .filter(Boolean)
    )
  );
}

function containsQuery(fieldText, queryNormalized, tokens) {
  const normalized = normalizeText(fieldText);
  if (!queryNormalized) return true;
  if (normalized.includes(queryNormalized)) return true;
  return tokens.some((token) => normalized.includes(token));
}

function matchesQuery(item, query) {
  const queryNormalized = normalizeText(query);
  if (!queryNormalized) return true;

  const tokens = tokenizeQuery(queryNormalized);
  return (
    containsQuery(item.title, queryNormalized, tokens) ||
    containsQuery(item.summary, queryNormalized, tokens) ||
    item.keywords.some((keyword) => containsQuery(keyword, queryNormalized, tokens))
  );
}

const kstDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

function formatDateKstDot(date) {
  const parts = kstDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "0000";
  const month = parts.find((part) => part.type === "month")?.value || "00";
  const day = parts.find((part) => part.type === "day")?.value || "00";
  return `${year}.${month}.${day}`;
}

function formatKstRangeDot(startMs, endMsExclusive) {
  const start = formatDateKstDot(new Date(startMs));
  const end = formatDateKstDot(new Date(endMsExclusive - 1));
  return `${start} ~ ${end}`;
}

function formatDateKstIso(date) {
  const parts = kstDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "0000";
  const month = parts.find((part) => part.type === "month")?.value || "00";
  const day = parts.find((part) => part.type === "day")?.value || "00";
  return `${year}-${month}-${day}`;
}

function isValidIsoDateText(text) {
  return /^\d{4}-\d{2}-\d{2}$/.test(text || "");
}

function parseIsoDateToKstMs(text) {
  if (!isValidIsoDateText(text)) return null;
  const [yearText, monthText, dayText] = text.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  const ms = kstDateTimeToUtcMs(year, month, day);
  const parts = getKstParts(new Date(ms));
  if (parts.year !== year || parts.month !== month || parts.day !== day) return null;
  return ms;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function formatNumberFixed(value, digits = 1) {
  return Number(value || 0).toLocaleString("ko-KR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function buildMonthCounts(items) {
  const counts = Array(12).fill(0);
  items.forEach((item) => {
    const month = getKstParts(item.date).month;
    counts[month - 1] += 1;
  });
  return counts;
}

function buildWeekdayCounts(items) {
  const counts = Array(7).fill(0);
  items.forEach((item) => {
    const weekday = getKstParts(item.date).weekday;
    counts[weekday] += 1;
  });
  return counts;
}

function buildHourCounts(items) {
  const counts = Array(24).fill(0);
  items.forEach((item) => {
    const hour = getKstParts(item.date).hour;
    counts[hour] += 1;
  });
  return counts;
}

function getPeakIndexOrNull(counts) {
  let index = -1;
  let max = 0;

  counts.forEach((count, idx) => {
    if (count > max) {
      max = count;
      index = idx;
    }
  });

  if (max <= 0 || index < 0) {
    return null;
  }

  return { index, count: max };
}

function countItemsByMonth(items, month) {
  let count = 0;
  items.forEach((item) => {
    if (getKstParts(item.date).month === month) {
      count += 1;
    }
  });
  return count;
}

function countItemsByWeekday(items, weekday) {
  let count = 0;
  items.forEach((item) => {
    if (getKstParts(item.date).weekday === weekday) {
      count += 1;
    }
  });
  return count;
}

function countItemsByHour(items, hour) {
  let count = 0;
  items.forEach((item) => {
    if (getKstParts(item.date).hour === hour) {
      count += 1;
    }
  });
  return count;
}

function toKstDate(date) {
  return new Date(date.getTime() + 9 * HOUR_MS);
}

function getKstParts(date) {
  const kst = toKstDate(date);
  return {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
    hour: kst.getUTCHours(),
    minute: kst.getUTCMinutes(),
    weekday: kst.getUTCDay()
  };
}

function kstDateTimeToUtcMs(year, month, day, hour = 0, minute = 0) {
  return Date.UTC(year, month - 1, day, hour - 9, minute, 0, 0);
}

function getKstTodayStartMs(nowMs) {
  const nowParts = getKstParts(new Date(nowMs));
  return kstDateTimeToUtcMs(nowParts.year, nowParts.month, nowParts.day);
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function shiftKstBoundaryByYears(ms, years) {
  const parts = getKstParts(new Date(ms));
  const year = parts.year + years;
  const day = Math.min(parts.day, daysInMonth(year, parts.month));
  return kstDateTimeToUtcMs(year, parts.month, day, parts.hour, parts.minute);
}

function getNextMonthStartKstMs(ms) {
  const parts = getKstParts(new Date(ms));
  const year = parts.month === 12 ? parts.year + 1 : parts.year;
  const month = parts.month === 12 ? 1 : parts.month + 1;
  return kstDateTimeToUtcMs(year, month, 1);
}

function formatMonthDayKst(ms) {
  const parts = getKstParts(new Date(ms));
  return `${String(parts.month).padStart(2, "0")}/${String(parts.day).padStart(2, "0")}`;
}

function formatMonthLabelKst(ms) {
  const parts = getKstParts(new Date(ms));
  return `${parts.month}월`;
}

function getDefaultCustomRange(nowMs) {
  const todayStart = getKstTodayStartMs(nowMs);
  const endMs = todayStart;
  const startMs = endMs - 30 * DAY_MS;
  return { startMs, endMs };
}

function normalizeCustomRange(nowMs) {
  const todayStart = getKstTodayStartMs(nowMs);
  const maxEndStart = todayStart - DAY_MS;
  const fallback = getDefaultCustomRange(nowMs);

  let startMs = parseIsoDateToKstMs(state.customStart);
  let endStartMs = parseIsoDateToKstMs(state.customEnd);

  if (startMs == null || endStartMs == null) {
    startMs = fallback.startMs;
    endStartMs = fallback.endMs - DAY_MS;
  }

  if (endStartMs > maxEndStart) {
    endStartMs = maxEndStart;
  }

  if (startMs > endStartMs) {
    startMs = endStartMs;
  }

  let currentEnd = endStartMs + DAY_MS;
  if (currentEnd - startMs > 366 * DAY_MS) {
    startMs = currentEnd - 366 * DAY_MS;
  }

  state.customStart = formatDateKstIso(new Date(startMs));
  state.customEnd = formatDateKstIso(new Date(endStartMs));

  return {
    currentStart: startMs,
    currentEnd
  };
}

function getPeriodWindow(periodKey, nowMs) {
  const config = PERIOD_CONFIG[periodKey] || PERIOD_CONFIG.daily;
  const todayStart = getKstTodayStartMs(nowMs);

  if (periodKey === "custom") {
    const { currentStart, currentEnd } = normalizeCustomRange(nowMs);
    const referenceStart = shiftKstBoundaryByYears(currentStart, -1);
    const referenceEnd = shiftKstBoundaryByYears(currentEnd, -1);
    return {
      periodKey,
      config,
      currentStart,
      currentEnd,
      referenceStart,
      referenceEnd,
      currentLabel: `${formatDateKstDot(new Date(currentStart))} ~ ${formatDateKstDot(new Date(currentEnd - 1))}`,
      referenceLabel: `${formatDateKstDot(new Date(referenceStart))} ~ ${formatDateKstDot(new Date(referenceEnd - 1))}`,
      batchLabel: `${formatDateKstDot(new Date(todayStart))} ${String(BATCH_HOUR).padStart(2, "0")}:00 (KST)`
    };
  }

  const currentEnd = todayStart;

  if (periodKey === "daily") {
    const currentStart = currentEnd - DAY_MS;
    const referenceEnd = currentStart;
    const referenceStart = referenceEnd - DAY_MS;
    return {
      periodKey,
      config,
      currentStart,
      currentEnd,
      referenceStart,
      referenceEnd,
      currentLabel: `${formatDateKstDot(new Date(currentStart))} (D-1)`,
      referenceLabel: `${formatDateKstDot(new Date(referenceStart))} (D-2)`,
      batchLabel: `${formatDateKstDot(new Date(todayStart))} ${String(BATCH_HOUR).padStart(2, "0")}:00 (KST)`
    };
  }

  const currentStart = currentEnd - config.days * DAY_MS;
  const referenceStart = shiftKstBoundaryByYears(currentStart, -1);
  const referenceEnd = shiftKstBoundaryByYears(currentEnd, -1);

  return {
    periodKey,
    config,
    currentStart,
    currentEnd,
    referenceStart,
    referenceEnd,
    currentLabel: `${formatDateKstDot(new Date(currentStart))} ~ ${formatDateKstDot(new Date(currentEnd - 1))}`,
    referenceLabel: `${formatDateKstDot(new Date(referenceStart))} ~ ${formatDateKstDot(new Date(referenceEnd - 1))}`,
    batchLabel: `${formatDateKstDot(new Date(todayStart))} ${String(BATCH_HOUR).padStart(2, "0")}:00 (KST)`
  };
}

function filterItemsByRange(items, startMs, endMs) {
  return items.filter((item) => {
    const ts = item.date.getTime();
    return ts >= startMs && ts < endMs;
  });
}

function countItemsInRange(items, startMs, endMs) {
  let count = 0;
  for (let i = 0; i < items.length; i += 1) {
    const ts = items[i].date.getTime();
    if (ts >= startMs && ts < endMs) {
      count += 1;
    }
  }
  return count;
}

function createBuckets(windowInfo) {
  const { periodKey, config, currentStart, currentEnd } = windowInfo;
  const buckets = [];

  if (periodKey === "daily") {
    for (let hour = 0; hour < 24; hour += 1) {
      const start = currentStart + hour * HOUR_MS;
      const end = start + HOUR_MS;
      buckets.push({
        label: `${String(hour).padStart(2, "0")}시`,
        currentStart: start,
        currentEnd: end,
        referenceStart: start - DAY_MS,
        referenceEnd: end - DAY_MS
      });
    }
    return buckets;
  }

  if (periodKey === "custom") {
    const days = Math.max(1, Math.round((currentEnd - currentStart) / DAY_MS));

    if (days <= 31) {
      let cursor = currentStart;
      while (cursor < currentEnd) {
        const end = Math.min(cursor + DAY_MS, currentEnd);
        buckets.push({
          label: formatMonthDayKst(cursor),
          currentStart: cursor,
          currentEnd: end,
          referenceStart: shiftKstBoundaryByYears(cursor, -1),
          referenceEnd: shiftKstBoundaryByYears(end, -1)
        });
        cursor = end;
      }
      return buckets;
    }

    if (days <= 180) {
      let cursor = currentStart;
      while (cursor < currentEnd) {
        const end = Math.min(cursor + DAY_MS * 7, currentEnd);
        buckets.push({
          label: `${formatMonthDayKst(cursor)}~${formatMonthDayKst(end - 1)}`,
          currentStart: cursor,
          currentEnd: end,
          referenceStart: shiftKstBoundaryByYears(cursor, -1),
          referenceEnd: shiftKstBoundaryByYears(end, -1)
        });
        cursor = end;
      }
      return buckets;
    }

    let cursor = currentStart;
    while (cursor < currentEnd) {
      const end = Math.min(getNextMonthStartKstMs(cursor), currentEnd);
      buckets.push({
        label: formatMonthLabelKst(cursor),
        currentStart: cursor,
        currentEnd: end,
        referenceStart: shiftKstBoundaryByYears(cursor, -1),
        referenceEnd: shiftKstBoundaryByYears(end, -1)
      });
      cursor = end;
    }
    return buckets;
  }

  if (config.bucket === "week") {
    let cursor = currentStart;
    while (cursor < currentEnd) {
      const end = Math.min(cursor + DAY_MS * 7, currentEnd);
      buckets.push({
        label: `${formatMonthDayKst(cursor)}~${formatMonthDayKst(end - 1)}`,
        currentStart: cursor,
        currentEnd: end,
        referenceStart: shiftKstBoundaryByYears(cursor, -1),
        referenceEnd: shiftKstBoundaryByYears(end, -1)
      });
      cursor = end;
    }
    return buckets;
  }

  let cursor = currentStart;
  while (cursor < currentEnd) {
    const end = Math.min(getNextMonthStartKstMs(cursor), currentEnd);
    buckets.push({
      label: formatMonthLabelKst(cursor),
      currentStart: cursor,
      currentEnd: end,
      referenceStart: shiftKstBoundaryByYears(cursor, -1),
      referenceEnd: shiftKstBoundaryByYears(end, -1)
    });
    cursor = end;
  }

  return buckets;
}

function calculateDelta(currentCount, referenceCount, speechBasis) {
  if (referenceCount === 0) {
    if (currentCount === 0) {
      return {
        text: "-",
        cssClass: "is-flat",
        sentence: "비교 기간 데이터가 0건으로 증감률을 계산하지 않았습니다.",
        speech: "비교 가능한 데이터가 없습니다",
        numeric: null
      };
    }

    return {
      text: "신규 발생",
      cssClass: "is-new",
      sentence: "비교 기간 데이터가 0건이라 신규 발생으로 표기했습니다.",
      speech: `${speechBasis} 신규 발생 구간입니다`,
      numeric: null
    };
  }

  const numeric = ((currentCount - referenceCount) / referenceCount) * 100;
  const rounded = Math.round(numeric * 10) / 10;

  if (rounded > 0) {
    return {
      text: `+${rounded.toFixed(1)}%`,
      cssClass: "is-up",
      sentence: `${speechBasis} ${Math.abs(rounded).toFixed(1)}% 증가했습니다.`,
      speech: `${speechBasis} ${Math.abs(rounded).toFixed(1)}% 증가한 수치입니다`,
      numeric: rounded
    };
  }

  if (rounded < 0) {
    return {
      text: `${rounded.toFixed(1)}%`,
      cssClass: "is-down",
      sentence: `${speechBasis} ${Math.abs(rounded).toFixed(1)}% 감소했습니다.`,
      speech: `${speechBasis} ${Math.abs(rounded).toFixed(1)}% 감소한 수치입니다`,
      numeric: rounded
    };
  }

  return {
    text: "0.0%",
    cssClass: "is-flat",
    sentence: `${speechBasis} 변동이 없습니다.`,
    speech: `${speechBasis} 변동이 없는 수치입니다`,
    numeric: 0
  };
}

function getSeasonKey(month) {
  for (let i = 0; i < SEASONS.length; i += 1) {
    if (SEASONS[i].months.includes(month)) {
      return SEASONS[i].key;
    }
  }
  return "spring";
}

function getDayGroupLabel(weekday) {
  return weekday === 0 || weekday === 6 ? "주말" : "평일";
}

function getTimeGroupLabel(hour) {
  if (hour >= 6 && hour < 12) return "오전";
  if (hour >= 12 && hour < 18) return "오후";
  if (hour >= 18) return "야간";
  return "심야";
}

function describePeakTag(weekday, hour) {
  return `${getDayGroupLabel(weekday)} ${getTimeGroupLabel(hour)}`;
}

function getKeywordScopeLabel() {
  return state.query ? state.query : "전체 키워드";
}

function getCompareSummaryText(windowInfo) {
  if (!windowInfo || !windowInfo.periodKey) return "-";
  if (windowInfo.periodKey === "daily") {
    return "전일 vs 전전일";
  }
  return `${windowInfo.config.label} vs ${windowInfo.config.compareLabel}`;
}

function getScopeDistrictLabel() {
  return state.selectedDistrict || ALL_DISTRICT_LABEL;
}

function populateDistrictSelectOptions() {
  districtSelect.innerHTML = DISTRICT_FILTER_OPTIONS
    .map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
    .join("");
  districtSelect.value = getScopeDistrictLabel();
}

function renderCustomRangeControls(windowInfo) {
  const isCustom = state.period === "custom";
  customRangeWrap.classList.toggle("is-visible", isCustom);
  customRangeWrap.classList.toggle("is-hidden", !isCustom);

  if (!isCustom) return;

  const startValue = state.customStart || formatDateKstIso(new Date(windowInfo.currentStart));
  const endValue = state.customEnd || formatDateKstIso(new Date(windowInfo.currentEnd - DAY_MS));
  customStartInput.value = startValue;
  customEndInput.value = endValue;
}

function renderControlSummary(windowInfo) {
  const startDate = formatDateKstDot(new Date(windowInfo.currentStart));
  const endDate = formatDateKstDot(new Date(windowInfo.currentEnd - 1));
  const districtLabel = getScopeDistrictLabel();
  const queryLabel = state.query || "전체";

  rangeStartInput.value = startDate;
  rangeEndInput.value = endDate;
  renderCustomRangeControls(windowInfo);
  analysisContext.textContent = `구: ${districtLabel} · ${startDate} ~ ${endDate} · 비교: ${getCompareSummaryText(windowInfo)} · 검색어: ${queryLabel} · 지도/순위: 서울시 전체 기준`;
}

function renderRegionHeadings() {
  const keywordLabel = getKeywordScopeLabel();
  regionMapSectionTitle.textContent = `서울시 전체 ${keywordLabel} 현황`;
  districtSectionTitle.textContent = `${keywordLabel} 자치구 순위`;
}

let hoveredDistrict = null;
let mapDistrictPaths = [];

function parseMatrixPoint(transform) {
  const match = /matrix\(([^)]+)\)/.exec(transform || "");
  if (!match) return null;
  const values = match[1].split(/[\s,]+/).map(Number);
  if (values.length < 6 || values.some((value) => Number.isNaN(value))) return null;
  return { x: values[4], y: values[5] };
}

function makeSvgPoint(svg, x, y) {
  if (!svg) return null;
  if (typeof svg.createSVGPoint === "function") {
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    return point;
  }
  if (typeof DOMPoint !== "undefined") {
    return new DOMPoint(x, y);
  }
  return null;
}

function pointInPath(path, x, y) {
  if (!path) return false;
  const point = makeSvgPoint(mapSvg, x, y);
  if (!point) return false;

  const ctm = typeof path.getCTM === "function" ? path.getCTM() : null;
  const localPoint = ctm ? point.matrixTransform(ctm.inverse()) : point;

  if (typeof path.isPointInFill === "function") {
    try {
      return path.isPointInFill(localPoint);
    } catch (err) {
      // Fall back to bbox check for legacy browsers.
    }
  }

  const box = path.getBBox();
  const inLocal = localPoint
    && localPoint.x >= box.x
    && localPoint.x <= box.x + box.width
    && localPoint.y >= box.y
    && localPoint.y <= box.y + box.height;
  const inSvg = x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
  return inLocal || inSvg;
}

function getTextPoint(textEl) {
  try {
    const box = textEl.getBBox();
    if (box && (box.width || box.height)) {
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    }
  } catch (err) {
    // Ignore getBBox failures and fall back to transform parsing.
  }

  const matrixPoint = parseMatrixPoint(textEl.getAttribute("transform"));
  if (matrixPoint) return matrixPoint;

  const x = Number(textEl.getAttribute("x") || 0);
  const y = Number(textEl.getAttribute("y") || 0);
  return { x, y };
}

function getViewBoxSize(svg) {
  if (!svg) return null;
  const viewBox = svg.viewBox && svg.viewBox.baseVal;
  if (viewBox && viewBox.width && viewBox.height) {
    return { width: viewBox.width, height: viewBox.height };
  }

  const attr = svg.getAttribute("viewBox");
  if (!attr) return null;
  const values = attr.split(/[\s,]+/).map(Number);
  if (values.length < 4 || values.some((value) => Number.isNaN(value))) return null;
  return { width: values[2], height: values[3] };
}

function assignDistrictsToPaths() {
  if (!mapSvg) return [];
  const viewBox = getViewBoxSize(mapSvg);
  const viewBoxArea = viewBox ? viewBox.width * viewBox.height : null;

  const labelNodes = Array.from(mapSvg.querySelectorAll("text"))
    .map((textEl) => {
      const name = textEl.textContent.trim();
      if (!name) return null;
      const point = getTextPoint(textEl);
      return { name, x: point.x, y: point.y, el: textEl };
    })
    .filter(Boolean);

  const allPaths = Array.from(mapSvg.querySelectorAll("path"));
  const candidatePaths = allPaths.filter((path) => (path.getAttribute("fill") || "").toLowerCase() !== "none");
  const candidateSet = new Set(candidatePaths);

  const pathBoxes = candidatePaths
    .map((path) => {
      const box = path.getBBox();
      const area = box.width * box.height;
      return { path, box, area };
    })
    .filter((item) => {
      if (!viewBoxArea) return true;
      return item.area < viewBoxArea * 0.65;
    });

  const remaining = [...pathBoxes];
  const assigned = [];
  const assignedSet = new Set();

  const assignPathToLabel = (path, label) => {
    if (!path || assignedSet.has(path)) return false;
    path.classList.add("district-path");
    path.dataset.district = label.name;
    label.el.setAttribute("data-district", label.name);
    assigned.push(path);
    assignedSet.add(path);
    return true;
  };

  labelNodes.forEach((label) => {
    let resolvedPath = null;
    const rect = label.el.getBoundingClientRect();

    if (rect && (rect.width || rect.height)) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const hit = document.elementFromPoint(centerX, centerY);
      const hitPath = hit?.closest?.("path");
      if (hitPath && candidateSet.has(hitPath) && !assignedSet.has(hitPath)) {
        resolvedPath = hitPath;
      }
    }

    if (resolvedPath) {
      const index = remaining.findIndex((item) => item.path === resolvedPath);
      if (index >= 0) remaining.splice(index, 1);
      assignPathToLabel(resolvedPath, label);
      return;
    }

    let bestIndex = -1;
    let bestScore = Infinity;

    const insideCandidates = remaining
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => pointInPath(item.path, label.x, label.y));

    if (insideCandidates.length) {
      insideCandidates.forEach(({ item, index }) => {
        if (item.area < bestScore) {
          bestScore = item.area;
          bestIndex = index;
        }
      });
    } else {
      const withinBoxCandidates = remaining
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => (
          label.x >= item.box.x
          && label.x <= item.box.x + item.box.width
          && label.y >= item.box.y
          && label.y <= item.box.y + item.box.height
        ));

      const candidates = withinBoxCandidates.length
        ? withinBoxCandidates
        : remaining.map((item, index) => ({ item, index }));

      candidates.forEach(({ item, index }) => {
        const centerX = item.box.x + item.box.width / 2;
        const centerY = item.box.y + item.box.height / 2;
        const distance = Math.hypot(label.x - centerX, label.y - centerY);
        const score = withinBoxCandidates.length ? distance * 0.5 : distance;
        if (score < bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });
    }

    if (bestIndex >= 0) {
      const item = remaining.splice(bestIndex, 1)[0];
      assignPathToLabel(item.path, label);
    }
  });

  return assigned;
}

function getInteractiveDistrict() {
  return hoveredDistrict || state.activeDistrict;
}

function updateMapPathHoverState() {
  const activeDistrict = getInteractiveDistrict();
  mapDistrictPaths.forEach((path) => {
    path.classList.toggle("is-hovered", activeDistrict === path.dataset.district);
  });
}

function updateMapLabels() {
  if (!mapSvg) return;
  const activeDistrict = getInteractiveDistrict();
  mapSvg.querySelectorAll("text[data-district]").forEach((textEl) => {
    const name = textEl.dataset.district;
    textEl.classList.toggle("is-active", activeDistrict === name);
    textEl.classList.remove("is-selected");
  });
}

function updateRankingHighlight() {
  const activeDistrict = getInteractiveDistrict();
  const selectedDistrict = DISTRICT_OPTIONS.includes(state.selectedDistrict) ? state.selectedDistrict : "";
  districtRankingBars.querySelectorAll(".district-item[data-district]").forEach((item) => {
    const name = item.dataset.district;
    item.classList.toggle("is-row-hover", !!activeDistrict && activeDistrict === name);
    item.classList.toggle("is-selected", !!selectedDistrict && selectedDistrict === name);
  });
}

function setHoveredDistrict(name) {
  hoveredDistrict = DISTRICT_OPTIONS.includes(name) ? name : null;
  updateMapPathHoverState();
  updateMapLabels();
  updateRankingHighlight();
}

function initMapSvg() {
  if (!mapSvg || mapSvg.dataset.bound === "true") return;

  mapDistrictPaths = assignDistrictsToPaths();

  mapDistrictPaths.forEach((path) => {
    path.addEventListener("mouseenter", () => {
      setHoveredDistrict(path.dataset.district || "");
    });

    path.addEventListener("mouseleave", () => {
      setHoveredDistrict("");
    });

    path.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });

  mapSvg.addEventListener("mouseleave", () => {
    setHoveredDistrict("");
  });

  mapSvg.dataset.bound = "true";
}

function getThresholds(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / 5 || 1;
  return [min + step, min + step * 2, min + step * 3, min + step * 4];
}

function getLevel(value, thresholds) {
  if (value <= thresholds[0]) return 1;
  if (value <= thresholds[1]) return 2;
  if (value <= thresholds[2]) return 3;
  if (value <= thresholds[3]) return 4;
  return 5;
}

function buildDistrictMapModel(currentItems) {
  const countMap = new Map();
  DISTRICT_OPTIONS.forEach((name) => countMap.set(name, 0));

  currentItems.forEach((item) => {
    countMap.set(item.district, (countMap.get(item.district) || 0) + 1);
  });

  const rows = DISTRICT_OPTIONS.map((name) => ({
    name,
    count: countMap.get(name) || 0
  }));

  const total = currentItems.length;
  const values = rows.map((row) => row.count);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;
  const thresholds = getThresholds(values.length ? values : [0]);

  const rowsWithLevel = rows.map((row) => ({
    ...row,
    level: max > 0 ? getLevel(row.count, thresholds) : 1
  }));

  const rankingRows = total > 0
    ? [...rowsWithLevel]
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return DISTRICT_OPTIONS.indexOf(a.name) - DISTRICT_OPTIONS.indexOf(b.name);
      })
      .map((row, idx) => ({
        ...row,
        rank: idx + 1,
        percent: (row.count / total) * 100,
        widthRatio: max > 0 ? row.count / max : 0
      }))
    : [];

  return {
    rows: rowsWithLevel,
    rankingRows,
    min,
    max,
    thresholds,
    total
  };
}

function buildDistrictRankingModel(mapModel) {
  return { rows: mapModel.rankingRows };
}

function getActivityLevel(count, maxCount) {
  if (maxCount <= 0 || count <= 0) return 0;
  const ratio = count / maxCount;
  return Math.min(ACTIVITY_COLORS.length - 1, Math.ceil(ratio * (ACTIVITY_COLORS.length - 1)));
}

function buildActivityModel(currentItems) {
  const matrix = Array.from({ length: 7 }, () => Array(24).fill(0));
  let peakWeekday = 1;
  let peakHour = 9;
  let peakCount = 0;

  currentItems.forEach((item) => {
    const parts = getKstParts(item.date);
    const weekday = parts.weekday;
    const hour = parts.hour;

    matrix[weekday][hour] += 1;
    if (matrix[weekday][hour] > peakCount) {
      peakCount = matrix[weekday][hour];
      peakWeekday = weekday;
      peakHour = hour;
    }
  });

  return {
    matrix,
    peakWeekday,
    peakHour,
    peakCount,
    insightTag: peakCount > 0 ? describePeakTag(peakWeekday, peakHour) : "데이터 없음",
    peakLabel:
      peakCount > 0
        ? `최다 발생: ${WEEKDAY_FULL_LABELS[peakWeekday]} ${String(peakHour).padStart(2, "0")}시 (${formatNumber(peakCount)}건)`
        : "최다 발생: 데이터 없음"
  };
}

function buildSeasonModel(currentItems, referenceItems) {
  const currentMap = new Map();
  const referenceMap = new Map();
  SEASONS.forEach((season) => {
    currentMap.set(season.key, 0);
    referenceMap.set(season.key, 0);
  });

  currentItems.forEach((item) => {
    const key = getSeasonKey(getKstParts(item.date).month);
    currentMap.set(key, currentMap.get(key) + 1);
  });

  referenceItems.forEach((item) => {
    const key = getSeasonKey(getKstParts(item.date).month);
    referenceMap.set(key, referenceMap.get(key) + 1);
  });

  const totalCurrent = currentItems.length;
  const totalReference = referenceItems.length;
  let maxKey = null;
  let maxCount = 0;

  SEASONS.forEach((season) => {
    const count = currentMap.get(season.key);
    if (count > maxCount) {
      maxCount = count;
      maxKey = season.key;
    }
  });

  const cards = SEASONS.map((season) => {
    const currentCount = currentMap.get(season.key);
    const referenceCount = referenceMap.get(season.key);
    const delta = calculateDelta(currentCount, referenceCount, "전년 동기 대비");
    const currentPercent = totalCurrent > 0 ? (currentCount / totalCurrent) * 100 : 0;
    const referencePercent = totalReference > 0 ? (referenceCount / totalReference) * 100 : 0;

    let yoyText = "작년 대비 데이터 없음";
    if (delta.text === "신규 발생") {
      yoyText = "작년 대비 신규 발생";
    } else if (delta.text === "-") {
      yoyText = "작년 대비 데이터 없음";
    } else {
      yoyText = `작년 대비 ${delta.text}`;
    }

    const arrow =
      delta.cssClass === "is-up"
        ? "▲"
        : delta.cssClass === "is-down"
          ? "▼"
          : delta.cssClass === "is-new"
            ? "◆"
            : "•";

    return {
      ...season,
      currentCount,
      referenceCount,
      delta,
      percent: currentPercent,
      referencePercent,
      deltaClass: delta.cssClass,
      yoyText,
      yoyArrow: arrow,
      isTop: maxKey === season.key && maxCount > 0,
      icon: SEASON_ICONS[season.key] || ""
    };
  });

  return { cards };
}

function buildContrastKpiModel(queryMatched, windowInfo) {
  const selectedDistrict = DISTRICT_FILTER_OPTIONS.includes(state.selectedDistrict)
    ? state.selectedDistrict
    : ALL_DISTRICT_LABEL;
  const isAllDistrict = selectedDistrict === ALL_DISTRICT_LABEL;

  const searchWindow = {
    start: windowInfo.currentStart,
    end: windowInfo.currentEnd
  };
  const annualWindow = {
    start: windowInfo.currentEnd - 365 * DAY_MS,
    end: windowInfo.currentEnd
  };

  const searchItems = filterItemsByRange(queryMatched, searchWindow.start, searchWindow.end);
  const annualItems = filterItemsByRange(queryMatched, annualWindow.start, annualWindow.end);

  const selectedSearchItems = isAllDistrict
    ? searchItems
    : searchItems.filter((item) => item.district === selectedDistrict);
  const selectedAnnualItems = isAllDistrict
    ? annualItems
    : annualItems.filter((item) => item.district === selectedDistrict);

  const districtUnit = DISTRICT_OPTIONS.length;
  const searchPeriodText = formatKstRangeDot(searchWindow.start, searchWindow.end);
  const annualPeriodText = formatKstRangeDot(annualWindow.start, annualWindow.end);

  function createCard({ title, periodText, main, secondary, bottomLabel, footer }) {
    return {
      title,
      periodText,
      main,
      secondary,
      bottomLabel,
      footer,
      footerClass: "is-flat"
    };
  }

  function createEmptyPeakCard(title, bottomLabel) {
    return createCard({
      title,
      periodText: annualPeriodText,
      main: "-",
      secondary: "-",
      bottomLabel,
      footer: "-"
    });
  }

  const card1 = createCard({
    title: `${selectedDistrict} 누적 현황`,
    periodText: searchPeriodText,
    main: formatNumber(selectedSearchItems.length),
    secondary: "건",
    bottomLabel: "자치구 평균",
    footer: `${formatNumberFixed(searchItems.length / districtUnit, 1)}건`
  });

  const monthCountsSelected = buildMonthCounts(selectedAnnualItems);
  const monthCountsCity = buildMonthCounts(annualItems);
  const peakMonthSelected = getPeakIndexOrNull(monthCountsSelected);
  const peakMonthCity = getPeakIndexOrNull(monthCountsCity);
  let card2 = createEmptyPeakCard(`${selectedDistrict} 최다 발생 월`, "자치구 평균 최다 월");
  if (peakMonthSelected) {
    const month = peakMonthSelected.index + 1;
    const cityPeakLabel = peakMonthCity ? `${peakMonthCity.index + 1}월` : "-";
    const cityPeakAverage = peakMonthCity ? peakMonthCity.count / districtUnit : 0;
    card2 = createCard({
      title: `${selectedDistrict} 최다 발생 월`,
      periodText: annualPeriodText,
      main: `${month}월`,
      secondary: `(${formatNumber(peakMonthSelected.count)}건)`,
      bottomLabel: "자치구 평균 최다 월",
      footer: peakMonthCity ? `${cityPeakLabel} (${formatNumberFixed(cityPeakAverage, 1)}건)` : "-"
    });
  }

  const weekdayCountsSelected = buildWeekdayCounts(selectedAnnualItems);
  const weekdayCountsCity = buildWeekdayCounts(annualItems);
  const peakWeekdaySelected = getPeakIndexOrNull(weekdayCountsSelected);
  const peakWeekdayCity = getPeakIndexOrNull(weekdayCountsCity);
  let card3 = createEmptyPeakCard(`${selectedDistrict} 최다 발생 요일`, "자치구 평균 최다 요일");
  if (peakWeekdaySelected) {
    const cityPeakLabel = peakWeekdayCity ? WEEKDAY_FULL_LABELS[peakWeekdayCity.index] : "-";
    const cityPeakAverage = peakWeekdayCity ? peakWeekdayCity.count / districtUnit : 0;
    card3 = createCard({
      title: `${selectedDistrict} 최다 발생 요일`,
      periodText: annualPeriodText,
      main: WEEKDAY_FULL_LABELS[peakWeekdaySelected.index],
      secondary: `(${formatNumber(peakWeekdaySelected.count)}건)`,
      bottomLabel: "자치구 평균 최다 요일",
      footer: peakWeekdayCity ? `${cityPeakLabel} (${formatNumberFixed(cityPeakAverage, 1)}건)` : "-"
    });
  }

  const hourCountsSelected = buildHourCounts(selectedAnnualItems);
  const hourCountsCity = buildHourCounts(annualItems);
  const peakHourSelected = getPeakIndexOrNull(hourCountsSelected);
  const peakHourCity = getPeakIndexOrNull(hourCountsCity);
  let card4 = createEmptyPeakCard(`${selectedDistrict} 최다 발생 시간`, "자치구 평균 최다 시간");
  if (peakHourSelected) {
    const cityPeakLabel = peakHourCity ? `${String(peakHourCity.index).padStart(2, "0")}시` : "-";
    const cityPeakAverage = peakHourCity ? peakHourCity.count / districtUnit : 0;
    card4 = createCard({
      title: `${selectedDistrict} 최다 발생 시간`,
      periodText: annualPeriodText,
      main: `${String(peakHourSelected.index).padStart(2, "0")}시`,
      secondary: `(${formatNumber(peakHourSelected.count)}건)`,
      bottomLabel: "자치구 평균 최다 시간",
      footer: peakHourCity ? `${cityPeakLabel} (${formatNumberFixed(cityPeakAverage, 1)}건)` : "-"
    });
  }

  return { selectedDistrict, card1, card2, card3, card4 };
}

function buildViewModel() {
  const nowMs = Date.now();
  const windowInfo = getPeriodWindow(state.period, nowMs);
  const queryMatched = SEARCH_ITEMS.filter((item) => matchesQuery(item, state.query));
  const selectedDistrict = DISTRICT_FILTER_OPTIONS.includes(state.selectedDistrict)
    ? state.selectedDistrict
    : ALL_DISTRICT_LABEL;
  const isAllDistrict = selectedDistrict === ALL_DISTRICT_LABEL;
  const scopedBaseItems = isAllDistrict
    ? queryMatched
    : queryMatched.filter((item) => item.district === selectedDistrict);

  const cityCurrentItems = filterItemsByRange(queryMatched, windowInfo.currentStart, windowInfo.currentEnd);
  const scopedCurrentItems = filterItemsByRange(scopedBaseItems, windowInfo.currentStart, windowInfo.currentEnd);
  const scopedReferenceItems = filterItemsByRange(scopedBaseItems, windowInfo.referenceStart, windowInfo.referenceEnd);

  const buckets = createBuckets(windowInfo);
  const currentSeries = buckets.map((bucket) => countItemsInRange(scopedBaseItems, bucket.currentStart, bucket.currentEnd));
  const referenceSeries = buckets.map((bucket) => countItemsInRange(scopedBaseItems, bucket.referenceStart, bucket.referenceEnd));

  const districtMap = buildDistrictMapModel(cityCurrentItems);
  const districtRanking = buildDistrictRankingModel(districtMap);
  const activity = buildActivityModel(scopedCurrentItems);
  const seasonality = buildSeasonModel(scopedCurrentItems, scopedReferenceItems);
  const kpi = buildContrastKpiModel(queryMatched, windowInfo);

  return {
    windowInfo,
    kpi,
    chart: {
      labels: buckets.map((bucket) => bucket.label),
      currentSeries,
      referenceSeries,
      speechBasis: windowInfo.config.speechBasis,
      formula: windowInfo.config.tooltipFormula
    },
    districtMap,
    districtRanking,
    activity,
    seasonality
  };
}

function getNiceMax(value) {
  if (value <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  let nice = 1;
  if (normalized > 1) nice = 2;
  if (normalized > 2) nice = 5;
  if (normalized > 5) nice = 10;
  return nice * magnitude;
}

function smoothPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}

function pickLabelIndexes(total, periodKey) {
  if (total <= 1) return [0];

  if (periodKey === "daily") {
    const indexes = [];
    for (let i = 0; i < total; i += 3) indexes.push(i);
    if (!indexes.includes(total - 1)) indexes.push(total - 1);
    return indexes;
  }

  if (total <= 8) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const target = 8;
  const indexes = [];
  for (let i = 0; i < target; i += 1) {
    indexes.push(Math.round((i * (total - 1)) / (target - 1)));
  }

  return Array.from(new Set(indexes));
}

function createComparisonChartSvg(chartModel, periodKey) {
  const width = 1200;
  const height = 420;
  const padLeft = 58;
  const padRight = 26;
  const padTop = 20;
  const padBottom = 52;

  const labels = chartModel.labels;
  const currentValues = chartModel.currentSeries;
  const referenceValues = chartModel.referenceSeries;
  const maxValue = Math.max(1, ...currentValues, ...referenceValues);
  const yMax = getNiceMax(maxValue);

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const count = labels.length;

  const pointsCurrent = labels.map((_, index) => {
    const ratio = count <= 1 ? 0 : index / (count - 1);
    return {
      x: padLeft + ratio * plotWidth,
      y: padTop + plotHeight - (currentValues[index] / yMax) * plotHeight
    };
  });

  const pointsReference = labels.map((_, index) => {
    const ratio = count <= 1 ? 0 : index / (count - 1);
    return {
      x: padLeft + ratio * plotWidth,
      y: padTop + plotHeight - (referenceValues[index] / yMax) * plotHeight
    };
  });

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(yMax * ratio));
  const yGrid = yTicks
    .map((tick) => {
      const y = padTop + plotHeight - (tick / yMax) * plotHeight;
      return `<line class="chart-grid-line" x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}"></line><text class="chart-axis" x="${padLeft - 8}" y="${y + 4}" text-anchor="end">${tick}</text>`;
    })
    .join("");

  const xLabelIndexes = pickLabelIndexes(labels.length, periodKey);
  const xLabels = xLabelIndexes
    .map((index) => {
      const ratio = count <= 1 ? 0 : index / (count - 1);
      const x = padLeft + ratio * plotWidth;
      return `<text class="chart-axis" x="${x}" y="${height - 14}" text-anchor="middle">${labels[index]}</text>`;
    })
    .join("");

  const currentPath = smoothPath(pointsCurrent);
  const referencePath = smoothPath(pointsReference);

  const currentDots = pointsCurrent
    .map((point) => `<circle class="point-current" cx="${point.x}" cy="${point.y}" r="3.8"></circle>`)
    .join("");

  const referenceDots = pointsReference
    .map((point) => `<circle class="point-reference" cx="${point.x}" cy="${point.y}" r="3.2"></circle>`)
    .join("");

  const hoverBands = labels
    .map((label, index) => {
      const leftEdge =
        index === 0
          ? padLeft
          : (pointsCurrent[index - 1].x + pointsCurrent[index].x) / 2;
      const rightEdge =
        index === labels.length - 1
          ? width - padRight
          : (pointsCurrent[index].x + pointsCurrent[index + 1].x) / 2;

      return `<rect class="hover-band" data-index="${index}" x="${leftEdge}" y="${padTop}" width="${Math.max(2, rightEdge - leftEdge)}" height="${plotHeight}" tabindex="0" aria-label="${label} 구간 상세 보기"></rect>`;
    })
    .join("");

  return `
    <svg class="comparison-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
      ${yGrid}
      <path class="series-reference" d="${referencePath}"></path>
      <path class="series-current" d="${currentPath}"></path>
      ${referenceDots}
      ${currentDots}
      ${xLabels}
      ${hoverBands}
    </svg>
  `;
}

function renderPeriodTabs() {
  periodTabs.querySelectorAll(".preset-btn").forEach((tab) => {
    const isActive = tab.dataset.period === state.period;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function setTrendClass(node, cssClass) {
  node.classList.remove("is-up", "is-down", "is-new", "is-flat");
  node.classList.add(cssClass || "is-flat");
}

function setKpiCardContent(card, payload) {
  if (payload.title != null) card.title.textContent = payload.title;
  if (payload.periodText != null) card.period.textContent = payload.periodText;
  card.main.textContent = payload.main;
  card.secondary.textContent = payload.secondary;
  if (payload.bottomLabel != null) card.bottomLabel.textContent = payload.bottomLabel;
  if (payload.footer != null) card.footer.textContent = payload.footer;
  setTrendClass(card.footer, payload.footerClass);
}

function renderKpis(model) {
  const { kpi, windowInfo } = model;

  batchUpdated.textContent = `배치 기준일: ${windowInfo.batchLabel}`;
  state.activeDistrict = DISTRICT_OPTIONS.includes(kpi.selectedDistrict) ? kpi.selectedDistrict : null;
  districtSelect.value = getScopeDistrictLabel();
  renderControlSummary(windowInfo);
  setKpiCardContent(kpiCards.card1, kpi.card1);
  setKpiCardContent(kpiCards.card2, kpi.card2);
  setKpiCardContent(kpiCards.card3, kpi.card3);
  setKpiCardContent(kpiCards.card4, kpi.card4);

  trendSummary.textContent = `실선(현재 ${windowInfo.config.label})과 점선(${windowInfo.config.compareLabel})을 비교합니다.`;
}

function setLegendValues(min, max) {
  legendTitle.textContent = "범례 (건수)";
  legendMin.textContent = `${formatNumber(min)}건`;
  legendMax.textContent = `${formatNumber(max)}건`;
}

function setMapNeutralState(message) {
  if (!mapSvg) return;
  mapSvg.querySelectorAll(".district-path").forEach((path) => {
    path.setAttribute("data-level", "1");
    let title = path.querySelector("title");
    if (!title) {
      title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      path.appendChild(title);
    }
    title.textContent = message;
  });

  hoveredDistrict = null;
  updateMapPathHoverState();
  updateMapLabels();
  updateRankingHighlight();
}

function renderMap(model) {
  initMapSvg();

  const rowMap = new Map(model.rows.map((row) => [row.name, row]));
  mapSvgWrap.classList.remove("is-error");

  mapSvg.querySelectorAll(".district-path").forEach((path) => {
    const name = path.dataset.district;
    const row = rowMap.get(name);
    if (!row) return;

    path.setAttribute("data-level", String(row.level));

    let title = path.querySelector("title");
    if (!title) {
      title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      path.appendChild(title);
    }
    title.textContent = `${name} · ${formatNumber(row.count)}건`;
  });

  setLegendValues(model.min, model.max);
  updateMapPathHoverState();
  updateMapLabels();
  updateRankingHighlight();
}

function renderDistrictRanking(model) {
  if (!model.rows.length) {
    districtRankingBars.innerHTML = '<li class="district-empty">해당 조건의 자치구 집계가 없습니다.</li>';
    return;
  }

  districtRankingBars.innerHTML = model.rows
    .map((row) => {
      const rankClass =
        row.rank === 1
          ? " rank-top1"
          : row.rank === 2
            ? " rank-top2"
            : row.rank === 3
              ? " rank-top3"
              : "";
      const selectedClass =
        DISTRICT_OPTIONS.includes(state.selectedDistrict) && state.selectedDistrict === row.name
          ? " is-selected"
          : "";
      return `
        <li class="district-item${rankClass}${selectedClass}" data-district="${escapeHtml(row.name)}" tabindex="0">
          <div class="district-head">
            <span class="district-rank">${row.rank}위</span>
            <span class="district-name">${escapeHtml(row.name)}</span>
            <span class="district-percent">${row.percent.toFixed(1)}%</span>
          </div>
          <div class="district-track">
            <span class="district-fill" style="width:${Math.max(6, row.widthRatio * 100).toFixed(1)}%"></span>
          </div>
          <p class="district-count">${formatNumber(row.count)}건</p>
        </li>
      `;
    })
    .join("");

  districtRankingBars.querySelectorAll(".district-item[data-district]").forEach((item) => {
    const district = item.dataset.district || "";
    item.addEventListener("mouseenter", () => setHoveredDistrict(district));
    item.addEventListener("mouseleave", () => setHoveredDistrict(""));
    item.addEventListener("focus", () => setHoveredDistrict(district));
    item.addEventListener("blur", () => setHoveredDistrict(""));
  });

  updateRankingHighlight();
}

function setLoadingState() {
  renderRegionHeadings();
  initMapSvg();
  closeFloatingTooltips();
  const windowInfo = getPeriodWindow(state.period, Date.now());
  renderControlSummary(windowInfo);
  districtSelect.value = getScopeDistrictLabel();
  const districtLabel = state.activeDistrict || state.selectedDistrict || "선택구";
  const searchPeriodText = formatKstRangeDot(windowInfo.currentStart, windowInfo.currentEnd);
  const annualPeriodText = formatKstRangeDot(windowInfo.currentEnd - 365 * DAY_MS, windowInfo.currentEnd);

  setKpiCardContent(kpiCards.card1, {
    title: `${districtLabel} 누적 현황`,
    periodText: searchPeriodText,
    main: "-",
    secondary: "건",
    bottomLabel: "자치구 평균",
    footer: "-",
    footerClass: "is-flat"
  });
  setKpiCardContent(kpiCards.card2, {
    title: `${districtLabel} 최다 발생 월`,
    periodText: annualPeriodText,
    main: "-",
    secondary: "-",
    bottomLabel: "자치구 평균 최다 월",
    footer: "-",
    footerClass: "is-flat"
  });
  setKpiCardContent(kpiCards.card3, {
    title: `${districtLabel} 최다 발생 요일`,
    periodText: annualPeriodText,
    main: "-",
    secondary: "-",
    bottomLabel: "자치구 평균 최다 요일",
    footer: "-",
    footerClass: "is-flat"
  });
  setKpiCardContent(kpiCards.card4, {
    title: `${districtLabel} 최다 발생 시간`,
    periodText: annualPeriodText,
    main: "-",
    secondary: "-",
    bottomLabel: "자치구 평균 최다 시간",
    footer: "-",
    footerClass: "is-flat"
  });

  trendSummary.textContent = "비교 추이를 계산 중입니다.";
  comparisonChartWrap.innerHTML = '<div class="skeleton-row"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line medium"></div></div>';

  mapSvgWrap.classList.remove("is-error");
  setMapNeutralState("자치구 분포를 집계 중입니다.");
  legendTitle.textContent = "범례 (건수)";
  legendMin.textContent = "-";
  legendMax.textContent = "-";

  districtRankingBars.innerHTML = '<li class="district-empty">자치구 랭킹을 집계 중입니다.</li>';

  activityInsightTag.textContent = "집계 중";
  activityPeakLabel.textContent = "최다 발생: 집계 중";
  activityGridWrap.innerHTML = '<div class="skeleton-row"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>';

  seasonCards.innerHTML = '<article class="season-card season-spring"><p class="season-name">집계 중</p></article>';

  chartTooltip.classList.add("is-hidden");
  activityTooltip.classList.add("is-hidden");
}

function buildChartTooltipHtml(index) {
  const chartModel = state.chartModel;
  const currentValue = chartModel.currentSeries[index];
  const referenceValue = chartModel.referenceSeries[index];
  const label = chartModel.labels[index];
  const delta = calculateDelta(currentValue, referenceValue, chartModel.speechBasis);

  return `
    <p class="chart-tooltip-title">${label}</p>
    <p class="chart-tooltip-line">현재 기간: ${formatNumber(currentValue)}건</p>
    <p class="chart-tooltip-line">비교 기간: ${formatNumber(referenceValue)}건</p>
    <p class="chart-tooltip-line">${delta.speech}</p>
    <p class="chart-tooltip-note">계산식: ${chartModel.formula}</p>
  `;
}

function positionTooltipInSection(tooltipNode, sectionNode, anchorRect, pointerX, pointerY) {
  const sectionRect = sectionNode.getBoundingClientRect();
  const tooltipRect = tooltipNode.getBoundingClientRect();

  let left = pointerX - sectionRect.left + 14;
  let top = pointerY - sectionRect.top - tooltipRect.height - 14;

  if (left + tooltipRect.width > sectionRect.width - 8) {
    left = sectionRect.width - tooltipRect.width - 8;
  }

  if (left < 8) {
    left = 8;
  }

  if (top < 8) {
    top = pointerY - sectionRect.top + 14;
  }

  if (anchorRect) {
    const minTop = anchorRect.top - sectionRect.top - tooltipRect.height - 12;
    if (minTop > 8) {
      top = minTop;
    }
  }

  tooltipNode.style.left = `${left}px`;
  tooltipNode.style.top = `${top}px`;
}

function showChartTooltip(index, event) {
  chartTooltip.innerHTML = buildChartTooltipHtml(index);
  chartTooltip.classList.remove("is-hidden");

  const sectionNode = comparisonChartWrap.closest(".trend-section");
  const anchorRect = comparisonChartWrap.getBoundingClientRect();
  const x = typeof event.clientX === "number" ? event.clientX : anchorRect.left + anchorRect.width / 2;
  const y = typeof event.clientY === "number" ? event.clientY : anchorRect.top + 24;

  positionTooltipInSection(chartTooltip, sectionNode, anchorRect, x, y);
}

function hideChartTooltip() {
  chartTooltip.classList.add("is-hidden");
}

function renderChart(model) {
  state.chartModel = {
    ...model.chart,
    speechBasis: model.windowInfo.config.speechBasis,
    formula: model.windowInfo.config.tooltipFormula
  };

  comparisonChartWrap.innerHTML = createComparisonChartSvg(model.chart, model.windowInfo.periodKey);

  comparisonChartWrap.querySelectorAll(".hover-band").forEach((band) => {
    const index = Number(band.dataset.index);

    band.addEventListener("mouseenter", (event) => {
      showChartTooltip(index, event);
    });

    band.addEventListener("mousemove", (event) => {
      if (!chartTooltip.classList.contains("is-hidden")) {
        showChartTooltip(index, event);
      }
    });

    band.addEventListener("focus", (event) => {
      showChartTooltip(index, event);
    });

    band.addEventListener("blur", hideChartTooltip);
  });

  comparisonChartWrap.onmouseleave = hideChartTooltip;
}

function createActivityGridHtml(activity) {
  const hourHeader = Array.from({ length: 24 })
    .map((_, hour) => {
      const label = [0, 6, 12, 18, 23].includes(hour) ? String(hour) : "";
      return `<span class="activity-hour">${label}</span>`;
    })
    .join("");

  const rows = WEEKDAY_ORDER.map((weekday) => {
    const cells = activity.matrix[weekday]
      .map((count, hour) => {
        const isPeak = count > 0 && weekday === activity.peakWeekday && hour === activity.peakHour;
        const level = getActivityLevel(count, activity.peakCount);
        const color = ACTIVITY_COLORS[level];
        const classes = `activity-cell${isPeak ? " is-peak" : ""}`;
        const ariaLabel = `${WEEKDAY_FULL_LABELS[weekday]} ${String(hour).padStart(2, "0")}시 ${formatNumber(count)}건`;

        return `<button type="button" class="${classes}" data-weekday="${weekday}" data-hour="${hour}" data-count="${count}" style="--activity-color:${color}"${isPeak ? ' data-peak="Peak"' : ""} aria-label="${ariaLabel}"></button>`;
      })
      .join("");

    return `<div class="activity-row"><span class="activity-day">${WEEKDAY_LABELS[weekday]}</span>${cells}</div>`;
  }).join("");

  const legend = `
    <div class="activity-legend">
      <span>낮음</span>
      <span class="activity-scale" aria-hidden="true"></span>
      <span>높음</span>
    </div>
  `;

  return `
    <div class="activity-table">
      <div class="activity-header"><span></span>${hourHeader}</div>
      ${rows}
      ${legend}
    </div>
  `;
}

function buildActivityTooltipHtml(target) {
  const weekday = Number(target.dataset.weekday);
  const hour = Number(target.dataset.hour);
  const count = Number(target.dataset.count);

  return `
    <p class="chart-tooltip-title">${WEEKDAY_FULL_LABELS[weekday]} ${String(hour).padStart(2, "0")}시</p>
    <p class="chart-tooltip-line">검출 건수: ${formatNumber(count)}건</p>
  `;
}

function showActivityTooltip(target, event) {
  activityTooltip.innerHTML = buildActivityTooltipHtml(target);
  activityTooltip.classList.remove("is-hidden");

  const sectionNode = activityGridWrap.closest(".activity-section");
  const anchorRect = target.getBoundingClientRect();
  const x = typeof event.clientX === "number" ? event.clientX : anchorRect.left + anchorRect.width / 2;
  const y = typeof event.clientY === "number" ? event.clientY : anchorRect.top + anchorRect.height / 2;

  positionTooltipInSection(activityTooltip, sectionNode, anchorRect, x, y);
}

function hideActivityTooltip() {
  activityTooltip.classList.add("is-hidden");
}

function renderActivity(activity) {
  state.activityModel = activity;
  activityInsightTag.textContent = activity.insightTag;
  activityPeakLabel.textContent = activity.peakLabel;

  activityGridWrap.innerHTML = createActivityGridHtml(activity);

  activityGridWrap.querySelectorAll(".activity-cell").forEach((cell) => {
    cell.addEventListener("mouseenter", (event) => {
      showActivityTooltip(cell, event);
    });

    cell.addEventListener("mousemove", (event) => {
      if (!activityTooltip.classList.contains("is-hidden")) {
        showActivityTooltip(cell, event);
      }
    });

    cell.addEventListener("focus", (event) => {
      showActivityTooltip(cell, event);
    });

    cell.addEventListener("blur", hideActivityTooltip);
  });

  activityGridWrap.onmouseleave = hideActivityTooltip;
}

function renderSeasonCards(model) {
  seasonCards.innerHTML = model.cards
    .map((card) => {
      const badge = card.isTop ? '<span class="season-badge">최다 발생</span>' : "";
      const currentWidth = Math.max(0, Math.min(100, card.percent));
      const referencePos = Math.max(0, Math.min(100, card.referencePercent));
      return `
        <article class="season-card season-${card.key}">
          <div class="season-top-row">
            <div class="season-label-group">
              <span class="season-icon" aria-hidden="true">${card.icon}</span>
              <p class="season-name">${card.label}</p>
            </div>
            <div class="season-metric-group">
              <p class="season-percent">${card.percent.toFixed(1)}%</p>
              ${badge}
            </div>
          </div>
          <p class="season-count">${formatNumber(card.currentCount)}건</p>
          <div
            class="season-progress"
            style="--current-width:${currentWidth.toFixed(2)}%; --reference-pos:${referencePos.toFixed(2)}%;"
            role="img"
            aria-label="전년 비중 ${card.referencePercent.toFixed(1)}%, 현재 비중 ${card.percent.toFixed(1)}%"
          >
            <span class="season-current-bar" aria-hidden="true"></span>
            <span class="season-reference-tick" aria-hidden="true"></span>
          </div>
          <p class="season-yoy ${card.deltaClass}">${card.yoyArrow} ${card.yoyText}</p>
        </article>
      `;
    })
    .join("");
}

function closeFloatingTooltips() {
  if (formulaGuideBtn && formulaGuideTooltip) {
    formulaGuideBtn.setAttribute("aria-expanded", "false");
    formulaGuideTooltip.classList.add("is-hidden");
  }
}

function toggleFloatingTooltip(button, tooltip) {
  const isOpen = !tooltip.classList.contains("is-hidden");
  closeFloatingTooltips();

  if (!isOpen) {
    button.setAttribute("aria-expanded", "true");
    tooltip.classList.remove("is-hidden");
  }
}

function render(model) {
  renderRegionHeadings();
  renderPeriodTabs();
  renderKpis(model);
  renderChart(model);
  renderMap(model.districtMap);
  renderDistrictRanking(model.districtRanking);
  renderActivity(model.activity);
  renderSeasonCards(model.seasonality);
}

function renderError() {
  renderRegionHeadings();
  initMapSvg();
  closeFloatingTooltips();
  hideChartTooltip();
  hideActivityTooltip();
  const windowInfo = getPeriodWindow(state.period, Date.now());
  renderControlSummary(windowInfo);
  districtSelect.value = getScopeDistrictLabel();
  const districtLabel = state.activeDistrict || state.selectedDistrict || "선택구";
  const searchPeriodText = formatKstRangeDot(windowInfo.currentStart, windowInfo.currentEnd);
  const annualPeriodText = formatKstRangeDot(windowInfo.currentEnd - 365 * DAY_MS, windowInfo.currentEnd);

  setKpiCardContent(kpiCards.card1, {
    title: `${districtLabel} 누적 현황`,
    periodText: searchPeriodText,
    main: "-",
    secondary: "건",
    bottomLabel: "자치구 평균",
    footer: "-",
    footerClass: "is-flat"
  });
  setKpiCardContent(kpiCards.card2, {
    title: `${districtLabel} 최다 발생 월`,
    periodText: annualPeriodText,
    main: "-",
    secondary: "-",
    bottomLabel: "자치구 평균 최다 월",
    footer: "-",
    footerClass: "is-flat"
  });
  setKpiCardContent(kpiCards.card3, {
    title: `${districtLabel} 최다 발생 요일`,
    periodText: annualPeriodText,
    main: "-",
    secondary: "-",
    bottomLabel: "자치구 평균 최다 요일",
    footer: "-",
    footerClass: "is-flat"
  });
  setKpiCardContent(kpiCards.card4, {
    title: `${districtLabel} 최다 발생 시간`,
    periodText: annualPeriodText,
    main: "-",
    secondary: "-",
    bottomLabel: "자치구 평균 최다 시간",
    footer: "-",
    footerClass: "is-flat"
  });

  trendSummary.textContent = "그래프를 생성하지 못했습니다.";
  comparisonChartWrap.innerHTML = '<div class="skeleton-row"><div class="skeleton-line short"></div><div class="skeleton-line"></div><div class="skeleton-line medium"></div></div>';

  mapSvgWrap.classList.add("is-error");
  setMapNeutralState("자치구 분포 데이터를 불러오지 못했습니다.");
  legendTitle.textContent = "범례 (건수)";
  legendMin.textContent = "-";
  legendMax.textContent = "-";

  districtRankingBars.innerHTML = '<li class="district-empty">자치구 랭킹 데이터를 불러오지 못했습니다.</li>';

  activityInsightTag.textContent = "오류";
  activityPeakLabel.textContent = "집계 실패";
  activityGridWrap.innerHTML = '<div class="skeleton-row"><div class="skeleton-line short"></div><div class="skeleton-line"></div></div>';

  seasonCards.innerHTML = '<article class="season-card season-winter"><p class="season-name">데이터 오류</p></article>';
}

function requestRender() {
  const requestId = ++state.requestId;
  state.activeRequestId = requestId;

  setLoadingState();

  const start = performance.now();
  let model = null;
  let error = null;

  try {
    model = buildViewModel();
  } catch (err) {
    error = err;
  }

  const elapsed = performance.now() - start;
  const wait = Math.max(0, MIN_LOADING_MS - elapsed);

  window.setTimeout(() => {
    if (state.activeRequestId !== requestId) return;

    if (error) {
      console.error(error);
      renderError();
      return;
    }

    try {
      render(model);
    } catch (renderErr) {
      console.error(renderErr);
      renderError();
    }
  }, wait);
}

function applyInitialStateFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim();
  if (query) {
    state.query = query;
    keywordInput.value = query;
  }

  const period = (params.get("period") || "").trim();
  if (period && PERIOD_CONFIG[period]) {
    state.period = period;
  }

  if (state.period === "custom") {
    const from = (params.get("from") || "").trim();
    const to = (params.get("to") || "").trim();
    if (isValidIsoDateText(from)) {
      state.customStart = from;
    }
    if (isValidIsoDateText(to)) {
      state.customEnd = to;
    }
  }

  const district = (params.get("district") || "").trim();
  if (district && DISTRICT_FILTER_OPTIONS.includes(district)) {
    state.selectedDistrict = district;
    state.activeDistrict = DISTRICT_OPTIONS.includes(district) ? district : null;
  }
}

function syncQueryString() {
  const params = new URLSearchParams(window.location.search);

  if (state.query) {
    params.set("q", state.query);
  } else {
    params.delete("q");
  }

/*  if (state.period && PERIOD_CONFIG[state.period]) {
    params.set("period", state.period);
  } else {
    params.delete("period");
  }*/

  if (state.period === "custom" && isValidIsoDateText(state.customStart) && isValidIsoDateText(state.customEnd)) {
    params.set("from", state.customStart);
    params.set("to", state.customEnd);
  } else {
    params.delete("from");
    params.delete("to");
  }

  if (state.selectedDistrict && state.selectedDistrict !== ALL_DISTRICT_LABEL && DISTRICT_OPTIONS.includes(state.selectedDistrict)) {
    params.set("district", state.selectedDistrict);
  } else {
    params.delete("district");
  }

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash || ""}`;
  window.history.replaceState(null, "", nextUrl);
}

function bindEvents() {
  districtSelect.addEventListener("change", () => {
    const selected = districtSelect.value;
    state.selectedDistrict = DISTRICT_FILTER_OPTIONS.includes(selected) ? selected : ALL_DISTRICT_LABEL;
    state.activeDistrict = DISTRICT_OPTIONS.includes(state.selectedDistrict) ? state.selectedDistrict : null;
    syncQueryString();
    requestRender();
  });

  keywordSearchBtn.addEventListener("click", () => {
    state.query = keywordInput.value.trim();
    syncQueryString();
    requestRender();
  });

  keywordInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    state.query = keywordInput.value.trim();
    syncQueryString();
    requestRender();
  });

  periodTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("button[data-period]");
    if (!tab) return;

    const nextPeriod = tab.dataset.period;
    if (!PERIOD_CONFIG[nextPeriod] || nextPeriod === state.period) return;

    state.period = nextPeriod;
    if (nextPeriod === "custom") {
      normalizeCustomRange(Date.now());
    }
    syncQueryString();
    requestRender();
  });

  customStartInput.addEventListener("change", () => {
    if (state.period !== "custom") return;
    if (isValidIsoDateText(customStartInput.value)) {
      state.customStart = customStartInput.value;
    }
    normalizeCustomRange(Date.now());
    syncQueryString();
    requestRender();
  });

  customEndInput.addEventListener("change", () => {
    if (state.period !== "custom") return;
    if (isValidIsoDateText(customEndInput.value)) {
      state.customEnd = customEndInput.value;
    }
    normalizeCustomRange(Date.now());
    syncQueryString();
    requestRender();
  });

  resetFiltersBtn.addEventListener("click", () => {
    state.query = "";
    state.period = "daily";
    state.selectedDistrict = ALL_DISTRICT_LABEL;
    state.activeDistrict = null;
    state.customStart = "";
    state.customEnd = "";
    keywordInput.value = "";
    districtSelect.value = ALL_DISTRICT_LABEL;
    syncQueryString();
    requestRender();
  });

  formulaGuideBtn.addEventListener("click", () => {
    toggleFloatingTooltip(formulaGuideBtn, formulaGuideTooltip);
  });

  document.addEventListener("click", (event) => {
    const inFloating = event.target.closest(".guide-row");
    if (!inFloating) {
      closeFloatingTooltips();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFloatingTooltips();
      hideChartTooltip();
      hideActivityTooltip();
    }
  });

  window.addEventListener("resize", () => {
    hideChartTooltip();
    hideActivityTooltip();
  });
}

function init() {
  ensureRequiredDom();
  populateDistrictSelectOptions();
  applyInitialStateFromQueryString();
  if (state.period === "custom") {
    normalizeCustomRange(Date.now());
  }
  districtSelect.value = getScopeDistrictLabel();
  syncQueryString();
  bindEvents();
  requestRender();
}

init();
