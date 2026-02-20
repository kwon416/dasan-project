const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const NEW_REFERENCE_MIN_COUNT = 5;
const RANK_SHIFT_HIGHLIGHT_THRESHOLD = 3;

const keywordPool = [
  "불법",
  "주정차",
  "이중주차",
  "장애인전용주차",
  "위반",
  "버스",
  "배차간격",
  "정류소",
  "시설",
  "지하철",
  "지연",
  "운행정보",
  "택시",
  "승차거부",
  "교통신호등",
  "고장",
  "횡단보도",
  "신호시간",
  "과속",
  "난폭운전",
  "신고",
  "킥보드",
  "무단방치",
  "자전거도로",
  "불법점유",
  "주차장",
  "부족",
  "주차요금",
  "도로포장",
  "파손",
  "포트홀",
  "보도블록",
  "차선도색",
  "노면표시",
  "훼손",
  "교통표지판",
  "누락",
  "맨홀",
  "뚜껑",
  "낙하물",
  "적치물",
  "공사장",
  "교통통제",
  "차로막음",
  "쓰레기",
  "무단투기",
  "생활폐기물",
  "수거지연",
  "재활용",
  "분리수거",
  "음식물쓰레기",
  "악취",
  "대형폐기물",
  "스티커",
  "배출",
  "담배꽁초",
  "길거리",
  "청결",
  "불법소각",
  "하수",
  "음식점",
  "비산먼지",
  "미세먼지",
  "대기오염",
  "층간소음",
  "야간",
  "공사소음",
  "상가",
  "클럽",
  "소음",
  "불법확성기",
  "집회소음",
  "빛공해",
  "간판",
  "조명",
  "가로등",
  "보안등",
  "하수구",
  "막힘",
  "역류",
  "배수불량",
  "침수",
  "제설",
  "미흡",
  "빙판길",
  "싱크홀",
  "지반침하",
  "의심",
  "위험시설물",
  "펜스",
  "난간",
  "어린이보호구역",
  "안전시설",
  "단속",
  "공원",
  "시설물",
  "놀이터",
  "안전점검",
  "CCTV",
  "설치",
  "요청",
  "방치자전거",
  "폐자전거",
  "불법현수막",
  "불법광고물",
  "전단지",
  "스티커",
  "불법노점",
  "도로점용",
  "반려견",
  "배변",
  "목줄"
];

const CATEGORY_OPTIONS = [
  { id: "all", label: "전체" },
  { id: "welfare", label: "복지" },
  { id: "traffic", label: "교통" },
  { id: "environment", label: "환경" },
  { id: "safety", label: "안전" },
  { id: "admin", label: "행정" }
];

const CATEGORY_TERMS = {
  welfare: ["반려견", "배변", "놀이터", "시설물", "공원", "요청", "설치", "청결"],
  traffic: ["주정차", "이중주차", "장애인전용주차", "버스", "배차간격", "정류소", "지하철", "지연", "택시", "승차거부", "교통신호등", "신호시간", "과속", "킥보드"],
  environment: ["무단투기", "생활폐기물", "재활용", "분리수거", "음식물쓰레기", "악취", "불법소각", "미세먼지", "대기오염", "공사소음", "하수구"],
  safety: ["침수", "제설", "빙판길", "싱크홀", "지반침하", "위험시설물", "펜스", "난간", "어린이보호구역", "안전시설", "안전점검", "CCTV"],
  admin: ["신고", "요청", "단속", "불법현수막", "불법광고물", "전단지", "스티커", "불법노점", "도로점용", "설치"]
};

const HOT_TERMS = ["주정차", "지연", "무단투기", "침수", "공사장", "교통신호등", "불법광고물", "가로등", "악취", "소음", "하수구", "방치자전거"];

const DISTRICT_OPTIONS = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구"
];

const PRESET_MAP = {
  d1: { id: "d1", label: "전일", mode: "day_before" },
  m3: { id: "m3", label: "3개월", days: 90 },
  m6: { id: "m6", label: "6개월", days: 180 },
  y1: { id: "y1", label: "1년", days: 365 }
};

const PRESET_KEYS = ["d1", "m3", "m6", "y1"];
const UNIQUE_TERMS = Array.from(new Set(keywordPool));
const termCategoryMap = createTermCategoryMap();
let mockItems = [];

const datePartsFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

const hourFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  hour12: false
});

const dashboardShell = document.getElementById("dashboardShell");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");
const districtSelect = document.getElementById("districtSelect");
const filterStatus = document.getElementById("filterStatus");
const quickPresetGroup = document.getElementById("quickPresetGroup");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const datePickerButton = document.getElementById("datePickerButton");
const searchError = document.getElementById("searchError");

const risingTitle = document.getElementById("risingTitle");
const rankingTitle = document.getElementById("rankingTitle");
const risingUpdated = document.getElementById("risingUpdated");
const rankingUpdated = document.getElementById("rankingUpdated");
const risingList = document.getElementById("risingList");
const rankingList = document.getElementById("rankingList");

const categorySidebar = document.getElementById("categorySidebar");
const keywordTagGrid = document.getElementById("keywordTagGrid");

const analysisModal = document.getElementById("analysisModal");
const analysisConfirm = document.getElementById("analysisConfirm");
const analysisCancel = document.getElementById("analysisCancel");
const analysisOverlay = document.getElementById("analysisOverlay");

const state = {
  category: "all",
  subKeyword: "",
  query: "",
  district: "all",
  activePreset: null,
  isManualRange: false,
  pendingPayload: null,
  isLoading: false
};

function ensureRequiredDom() {
  const missing = [
    ["#dashboardShell", dashboardShell],
    ["#searchInput", searchInput],
    ["#searchButton", searchButton],
    ["#resetButton", resetButton],
    ["#districtSelect", districtSelect],
    ["#filterStatus", filterStatus],
    ["#quickPresetGroup", quickPresetGroup],
    ["#startDate", startDateInput],
    ["#endDate", endDateInput],
    ["#datePickerButton", datePickerButton],
    ["#searchError", searchError],
    ["#risingTitle", risingTitle],
    ["#rankingTitle", rankingTitle],
    ["#risingUpdated", risingUpdated],
    ["#rankingUpdated", rankingUpdated],
    ["#risingList", risingList],
    ["#rankingList", rankingList],
    ["#categorySidebar", categorySidebar],
    ["#keywordTagGrid", keywordTagGrid],
    ["#analysisModal", analysisModal],
    ["#analysisConfirm", analysisConfirm],
    ["#analysisCancel", analysisCancel],
    ["#analysisOverlay", analysisOverlay]
  ].filter(([, element]) => !element);

  if (missing.length) {
    throw new Error(`필수 DOM이 누락되었습니다: ${missing.map(([id]) => id).join(", ")}`);
  }
}

function seedFromText(text) {
  return Array.from(text).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function getDatePartsKst(date) {
  const parts = datePartsFormatter.formatToParts(date);
  return {
    year: parts.find((part) => part.type === "year")?.value || "0000",
    month: parts.find((part) => part.type === "month")?.value || "00",
    day: parts.find((part) => part.type === "day")?.value || "00"
  };
}

function formatDateKeyKst(date) {
  const parts = getDatePartsKst(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function formatDateTimeKst(date) {
  const parts = dateTimeFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "0000";
  const month = parts.find((part) => part.type === "month")?.value || "00";
  const day = parts.find((part) => part.type === "day")?.value || "00";
  const hour = parts.find((part) => part.type === "hour")?.value || "00";
  const minute = parts.find((part) => part.type === "minute")?.value || "00";
  return `${year}-${month}-${day} ${hour}:${minute} (KST)`;
}

function getHourKst(date) {
  const hourValue = hourFormatter.formatToParts(date).find((part) => part.type === "hour")?.value || "0";
  const normalized = Number(hourValue) % 24;
  if (Number.isNaN(normalized)) return 0;
  return Math.min(23, Math.max(0, normalized));
}

function parseDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return null;

  const date = new Date(`${value}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return null;
  return formatDateKeyKst(date) === value ? date : null;
}

function addDays(dateKey, days) {
  const date = parseDateKey(dateKey);
  if (!date) return null;
  return formatDateKeyKst(new Date(date.getTime() + days * DAY_MS));
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function shiftDateKeyByYears(dateKey, years) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateKey || ""));
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!year || !month || !day) return null;

  const shiftedYear = year + years;
  const maxDay = new Date(Date.UTC(shiftedYear, month, 0)).getUTCDate();
  const safeDay = Math.min(day, maxDay);

  return `${shiftedYear}-${pad2(month)}-${pad2(safeDay)}`;
}

function getRangeDays(start, end) {
  const startDate = parseDateKey(start);
  const endDate = parseDateKey(end);
  if (!startDate || !endDate) return null;

  const days = Math.round((endDate.getTime() - startDate.getTime()) / DAY_MS) + 1;
  return days > 0 ? days : null;
}

function setError(message) {
  searchError.textContent = message;
}

function clearError() {
  searchError.textContent = "";
}

function getTermsByCategory(category) {
  if (category === "all") {
    return HOT_TERMS;
  }
  return CATEGORY_TERMS[category] || [];
}

function createTermCategoryMap() {
  const map = new Map();

  Object.entries(CATEGORY_TERMS).forEach(([category, terms]) => {
    terms.forEach((term) => {
      map.set(term, category);
    });
  });

  return map;
}

function inferCategory(term, prng) {
  const mapped = termCategoryMap.get(term);
  if (mapped) return mapped;

  const fallback = ["traffic", "environment", "safety", "welfare", "admin"];
  return fallback[randomInt(prng, 0, fallback.length - 1)];
}

function pickYesterdayHour(prng) {
  const hotspots = [8, 9, 10, 11, 13, 14, 18, 19, 20, 21];
  if (prng() < 0.72) {
    return hotspots[randomInt(prng, 0, hotspots.length - 1)];
  }
  return randomInt(prng, 0, 23);
}

function pickHistoricalOffset(prng) {
  const roll = prng();

  if (roll < 0.25) return 2;
  if (roll < 0.45) return randomInt(prng, 3, 7);
  if (roll < 0.75) return randomInt(prng, 8, 90);
  return randomInt(prng, 91, 364);
}

function pickWeightedCategory(prng) {
  const roll = prng();

  if (roll < 0.3) return "traffic";
  if (roll < 0.52) return "environment";
  if (roll < 0.7) return "safety";
  if (roll < 0.86) return "admin";
  return "welfare";
}

function pickKeywordByCategory(category, prng) {
  const list = getTermsByCategory(category);
  if (list.length) {
    return list[randomInt(prng, 0, list.length - 1)];
  }
  return UNIQUE_TERMS[randomInt(prng, 0, UNIQUE_TERMS.length - 1)];
}

function createMockItems(size) {
  const prng = createPrng(seedFromText("search-dashboard-v7") + Date.now());
  const now = Date.now();
  const currentYearCount = Math.max(1400, Math.floor(size * 0.7));
  const yesterdayDominantCount = Math.floor(currentYearCount * 0.4);
  const items = [];
  let sequence = 1;

  function buildRecord(dateKey, options = {}) {
    const hour = options.hour ?? randomInt(prng, 0, 23);
    const minute = options.minute ?? randomInt(prng, 0, 59);
    const occurredAt = new Date(`${dateKey}T${pad2(hour)}:${pad2(minute)}:00+09:00`);
    if (Number.isNaN(occurredAt.getTime())) return;

    const category = options.category ?? pickWeightedCategory(prng);
    const district = options.district ?? DISTRICT_OPTIONS[randomInt(prng, 0, DISTRICT_OPTIONS.length - 1)];
    const keywordCount = options.keywordCount ?? randomInt(prng, 1, 3);
    const keywordSet = new Set(options.keywords || []);

    while (keywordSet.size < keywordCount) {
      if (prng() < 0.8) {
        keywordSet.add(pickKeywordByCategory(category, prng));
      } else {
        keywordSet.add(UNIQUE_TERMS[randomInt(prng, 0, UNIQUE_TERMS.length - 1)]);
      }
    }

    const keywords = Array.from(keywordSet);

    items.push({
      id: sequence,
      category: inferCategory(keywords[0], prng),
      district,
      occurredAt,
      dateKey: formatDateKeyKst(occurredAt),
      keywords,
      title: `${keywords[0]} 관련 민원 접수`
    });
    sequence += 1;
  }

  for (let index = 0; index < currentYearCount; index += 1) {
    const isYesterdayFocused = index < yesterdayDominantCount;
    const dayOffset = isYesterdayFocused ? 1 : pickHistoricalOffset(prng);
    const baseDate = new Date(now - dayOffset * DAY_MS);
    const dateKey = formatDateKeyKst(baseDate);
    const category = pickWeightedCategory(prng);
    const district = DISTRICT_OPTIONS[randomInt(prng, 0, DISTRICT_OPTIONS.length - 1)];
    const hour = isYesterdayFocused ? pickYesterdayHour(prng) : randomInt(prng, 0, 23);
    const minute = randomInt(prng, 0, 59);

    buildRecord(dateKey, { category, district, hour, minute });

    const yoyDateKey = shiftDateKeyByYears(dateKey, -1);
    if (yoyDateKey && (isYesterdayFocused || prng() < 0.76)) {
      buildRecord(yoyDateKey, {
        category,
        district,
        hour: isYesterdayFocused ? pickYesterdayHour(prng) : randomInt(prng, 0, 23),
        minute: randomInt(prng, 0, 59)
      });
    }
  }

  while (items.length < size) {
    const offset = randomInt(prng, 365, 730);
    const dateKey = formatDateKeyKst(new Date(now - offset * DAY_MS));
    buildRecord(dateKey);
  }

  return items.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
}

function generateMockData(size = 2200) {
  mockItems = createMockItems(size);
}

function setPresetActive(presetId) {
  state.activePreset = presetId;
  quickPresetGroup.querySelectorAll(".preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === presetId);
  });
}

function clearPresetActive() {
  state.activePreset = null;
  quickPresetGroup.querySelectorAll(".preset-btn").forEach((button) => {
    button.classList.remove("is-active");
  });
}

function applyPreset(presetId) {
  const preset = PRESET_MAP[presetId];
  if (!preset) return;

  const today = formatDateKeyKst(new Date());

  if (preset.mode === "day_before") {
    const yesterday = addDays(today, -1);
    if (!yesterday) return;

    startDateInput.value = yesterday;
    endDateInput.value = yesterday;
    setPresetActive(preset.id);
    return;
  }

  const start = addDays(today, -(preset.days - 1));
  if (!start) return;

  startDateInput.value = start;
  endDateInput.value = today;
  setPresetActive(preset.id);
}

function syncPresetByRange() {
  const start = startDateInput.value;
  const end = endDateInput.value;

  if (!start || !end) {
    clearPresetActive();
    return;
  }

  if (start === end) {
    const today = formatDateKeyKst(new Date());
    const yesterday = addDays(today, -1);
    if (start === yesterday) {
      setPresetActive("d1");
      return;
    }
  }

  const days = getRangeDays(start, end);
  if (!days) {
    clearPresetActive();
    return;
  }

  const matched = PRESET_KEYS.find((key) => PRESET_MAP[key].days === days);
  if (matched) {
    setPresetActive(matched);
  } else {
    clearPresetActive();
  }
}

function getCurrentRange() {
  const start = startDateInput.value;
  const end = endDateInput.value;
  const days = getRangeDays(start, end);

  if (days) {
    return { start, end, days };
  }

  const fallback = formatDateKeyKst(new Date());
  return { start: fallback, end: fallback, days: 1 };
}

function matchesQuery(item, query) {
  if (!query) return true;

  return item.title.includes(query) || item.keywords.some((term) => term.includes(query));
}

function matchesBaseFilter(item, query) {
  const districtMatched = state.district === "all" || item.district === state.district;
  const queryMatched = matchesQuery(item, query);
  return districtMatched && queryMatched;
}

function getItemsInRange(range, query) {
  return mockItems.filter((item) => {
    const inRange = item.dateKey >= range.start && item.dateKey <= range.end;
    return inRange && matchesBaseFilter(item, query);
  });
}

function shiftRangeByYears(range, years) {
  const shiftedStart = shiftDateKeyByYears(range.start, years);
  const shiftedEnd = shiftDateKeyByYears(range.end, years);
  const shiftedDays = getRangeDays(shiftedStart, shiftedEnd);

  if (!shiftedStart || !shiftedEnd || !shiftedDays) {
    return null;
  }

  return {
    start: shiftedStart,
    end: shiftedEnd,
    days: shiftedDays
  };
}

function resolveReferenceRange(currentRange, activePreset, isManualRange) {
  // Comparison rules:
  // - d1: yesterday vs day-before-yesterday
  // - m3/m6: year-over-year same-length range
  // - y1: previous rolling 1 year
  // - manual date range: year-over-year range
  if (isManualRange) {
    const yoyRange = shiftRangeByYears(currentRange, -1);
    if (yoyRange) return yoyRange;
  }

  if (activePreset === "d1") {
    const previousDay = addDays(currentRange.start, -1) || currentRange.start;
    return {
      start: previousDay,
      end: previousDay,
      days: 1
    };
  }

  if (activePreset === "m3" || activePreset === "m6") {
    const yoyRange = shiftRangeByYears(currentRange, -1);
    if (yoyRange) return yoyRange;
  }

  if (activePreset === "y1") {
    const prevEnd = addDays(currentRange.start, -1) || currentRange.end;
    const prevStart = addDays(prevEnd, -(currentRange.days - 1)) || prevEnd;
    return {
      start: prevStart,
      end: prevEnd,
      days: getRangeDays(prevStart, prevEnd) || currentRange.days
    };
  }

  const fallbackYoy = shiftRangeByYears(currentRange, -1);
  if (fallbackYoy) return fallbackYoy;

  const prevEnd = addDays(currentRange.start, -1) || currentRange.end;
  const prevStart = addDays(prevEnd, -(currentRange.days - 1)) || prevEnd;
  return {
    start: prevStart,
    end: prevEnd,
    days: getRangeDays(prevStart, prevEnd) || currentRange.days
  };
}

function buildDateAxis(range) {
  const axis = [];
  for (let index = 0; index < range.days; index += 1) {
    const key = addDays(range.start, index);
    if (key) axis.push(key);
  }
  return axis;
}

function aggregateTermCounts(items) {
  const map = new Map();

  items.forEach((item) => {
    new Set(item.keywords).forEach((term) => {
      map.set(term, (map.get(term) || 0) + 1);
    });
  });

  return map;
}

function downSampleSeries(series, maxPoints) {
  if (series.length <= maxPoints) return series;

  const sampled = [];
  const bucket = series.length / maxPoints;

  for (let index = 0; index < maxPoints; index += 1) {
    const start = Math.floor(index * bucket);
    const end = Math.max(start + 1, Math.floor((index + 1) * bucket));

    let sum = 0;
    let count = 0;

    for (let cursor = start; cursor < Math.min(end, series.length); cursor += 1) {
      sum += series[cursor];
      count += 1;
    }

    sampled.push(count ? Math.round(sum / count) : 0);
  }

  return sampled;
}

function buildMetrics(currentItems, previousItems, range) {
  const currentCountMap = aggregateTermCounts(currentItems);
  const previousCountMap = aggregateTermCounts(previousItems);
  const isSingleDayRange = range.days === 1;
  const seriesMap = new Map();

  if (isSingleDayRange) {
    currentItems.forEach((item) => {
      const hourIndex = getHourKst(item.occurredAt);

      new Set(item.keywords).forEach((term) => {
        if (!seriesMap.has(term)) {
          seriesMap.set(term, Array(24).fill(0));
        }
        seriesMap.get(term)[hourIndex] += 1;
      });
    });
  } else {
    const axis = buildDateAxis(range);
    const axisIndexMap = new Map(axis.map((dateKey, index) => [dateKey, index]));

    currentItems.forEach((item) => {
      const index = axisIndexMap.get(item.dateKey);
      if (typeof index !== "number") return;

      new Set(item.keywords).forEach((term) => {
        if (!seriesMap.has(term)) {
          seriesMap.set(term, Array(axis.length).fill(0));
        }
        seriesMap.get(term)[index] += 1;
      });
    });
  }

  return UNIQUE_TERMS.map((term) => {
    const current = currentCountMap.get(term) || 0;
    const previous = previousCountMap.get(term) || 0;

    if (current <= 0) {
      return null;
    }

    const isNew = previous < NEW_REFERENCE_MIN_COUNT && current > 0;
    const deltaPct = previous >= NEW_REFERENCE_MIN_COUNT
      ? Number((((current - previous) / previous) * 100).toFixed(1))
      : 0;

    const baseHistory = seriesMap.get(term) || (isSingleDayRange ? Array(24).fill(0) : [0, 0]);

    return {
      term,
      current,
      previous,
      isNew,
      deltaPct,
      history: isSingleDayRange ? baseHistory : downSampleSeries(baseHistory, 24)
    };
  }).filter(Boolean);
}

function createSparklineSvg(history) {
  const values = history.length > 1 ? history : [history[0] || 0, history[0] || 0];
  const width = 168;
  const height = 24;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / spread) * (height - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const areaPoints = [`0,${height}`, ...points, `${width},${height}`].join(" ");

  return `
    <svg class="sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
      <polygon points="${areaPoints}" fill="rgba(30, 77, 183, 0.12)"></polygon>
      <polyline points="${points.join(" ")}" fill="none" stroke="#1e4db7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline>
    </svg>
  `;
}

function buildReferenceRankMap(referenceCountMap) {
  return new Map(
    [...referenceCountMap.entries()]
      .filter(([, count]) => count > 0)
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0], "ko");
      })
      .map(([term], index) => [term, index + 1])
  );
}

function buildVolumeBadgeInfo(metric) {
  if (metric.previous < NEW_REFERENCE_MIN_COUNT) {
    return {
      text: "NEW",
      className: "new",
      aria: "비교기간 데이터 부족으로 신규 키워드로 표시"
    };
  }

  if (metric.deltaPct > 0) {
    return {
      text: `▲ ${Math.abs(metric.deltaPct).toFixed(1)}%`,
      className: "rise",
      aria: `비교기간 대비 ${Math.abs(metric.deltaPct).toFixed(1)}퍼센트 상승`
    };
  }

  if (metric.deltaPct < 0) {
    return {
      text: `▼ ${Math.abs(metric.deltaPct).toFixed(1)}%`,
      className: "fall",
      aria: `비교기간 대비 ${Math.abs(metric.deltaPct).toFixed(1)}퍼센트 하락`
    };
  }

  return {
    text: "-",
    className: "steady",
    aria: "비교기간 대비 변동 없음"
  };
}

function buildRankBadgeInfo(currentRank, referenceRank, referenceCount) {
  if (referenceCount < NEW_REFERENCE_MIN_COUNT || typeof referenceRank !== "number") {
    return {
      text: "NEW",
      className: "new",
      aria: "비교기간 대비 신규 진입",
      shiftAbs: null,
      direction: "new"
    };
  }

  const diff = referenceRank - currentRank;
  if (diff > 0) {
    return {
      text: `▴ ${diff}`,
      className: "rise",
      aria: `비교기간 대비 순위 ${diff}단계 상승`,
      shiftAbs: Math.abs(diff),
      direction: "rise"
    };
  }

  if (diff < 0) {
    return {
      text: `▾ ${Math.abs(diff)}`,
      className: "fall",
      aria: `비교기간 대비 순위 ${Math.abs(diff)}단계 하락`,
      shiftAbs: Math.abs(diff),
      direction: "fall"
    };
  }

  return {
    text: "-",
    className: "steady",
    aria: "비교기간 대비 순위 변동 없음",
    shiftAbs: 0,
    direction: "steady"
  };
}

function getRankingRowEmphasisClass(rankBadgeInfo) {
  if (rankBadgeInfo.direction === "new") {
    return "is-new-row";
  }

  if (rankBadgeInfo.shiftAbs >= RANK_SHIFT_HIGHLIGHT_THRESHOLD) {
    if (rankBadgeInfo.direction === "rise") return "is-volatile-row is-volatile-rise";
    if (rankBadgeInfo.direction === "fall") return "is-volatile-row is-volatile-fall";
    return "is-volatile-row";
  }

  return "";
}

function renderEmptyWidgets(message) {
  const html = `<li class="widget-empty">${escapeHtml(message)}</li>`;
  risingList.innerHTML = html;
  rankingList.innerHTML = html;
}

function buildWidgetRowHtml(metric, rank, badgeInfo, rowClass = "") {
  const normalizedClass = rowClass ? ` ${rowClass}` : "";

  return `
    <li class="widget-item">
      <button type="button" class="widget-row${normalizedClass}" data-term="${escapeHtml(metric.term)}" aria-label="${escapeHtml(`${rank}위 ${metric.term}`)}">
        <span class="rank-dot">${rank}</span>
        <span class="term-cell">${escapeHtml(metric.term)}</span>
        <span class="viz-cell">${createSparklineSvg(metric.history)}</span>
        <span class="count-cell">${formatNumber(metric.current)}</span>
        <span class="delta-cell">
          <span class="delta-pill ${badgeInfo.className}" aria-label="${escapeHtml(badgeInfo.aria)}">${badgeInfo.text}</span>
        </span>
      </button>
    </li>
  `;
}

function renderWidgets() {
  const range = getCurrentRange();
  const query = state.query.trim();

  const currentItems = getItemsInRange(range, query);
  if (!currentItems.length) {
    renderEmptyWidgets("선택한 조건에 집계된 데이터가 없습니다.");
    return;
  }

  const referenceRange = resolveReferenceRange(range, state.activePreset, state.isManualRange);
  const referenceItems = getItemsInRange(referenceRange, query);

  const metrics = buildMetrics(currentItems, referenceItems, range);
  if (!metrics.length) {
    renderEmptyWidgets("표시할 키워드 데이터가 없습니다.");
    return;
  }

  risingTitle.textContent = "서울시 급상승 키워드 TOP10";
  rankingTitle.textContent = "서울시 검색 키워드 순위 TOP10";

  const updatedText = `마지막 집계: ${formatDateTimeKst(new Date())}`;
  risingUpdated.textContent = updatedText;
  rankingUpdated.textContent = updatedText;

  const risingTop = [...metrics]
    .sort((a, b) => {
      if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
      if (b.deltaPct !== a.deltaPct) return b.deltaPct - a.deltaPct;
      if (b.current !== a.current) return b.current - a.current;
      return a.term.localeCompare(b.term, "ko");
    })
    .slice(0, 10);

  const rankingTop = [...metrics]
    .sort((a, b) => {
      if (b.current !== a.current) return b.current - a.current;
      if (b.deltaPct !== a.deltaPct) return b.deltaPct - a.deltaPct;
      return a.term.localeCompare(b.term, "ko");
    })
    .slice(0, 10);
  const referenceCountMap = aggregateTermCounts(referenceItems);
  const referenceRankMap = buildReferenceRankMap(referenceCountMap);

  risingList.innerHTML = risingTop
    .map((metric, index) => {
      const rank = index + 1;
      const volumeBadgeInfo = buildVolumeBadgeInfo(metric);
      return buildWidgetRowHtml(metric, rank, volumeBadgeInfo);
    })
    .join("");

  rankingList.innerHTML = rankingTop
    .map((metric, index) => {
      const rank = index + 1;
      const referenceRank = referenceRankMap.get(metric.term);
      const referenceCount = referenceCountMap.get(metric.term) || 0;
      const rankBadgeInfo = buildRankBadgeInfo(rank, referenceRank, referenceCount);
      const rowClass = getRankingRowEmphasisClass(rankBadgeInfo);
      return buildWidgetRowHtml(metric, rank, rankBadgeInfo, rowClass);
    })
    .join("");
}

function renderCategorySidebar() {
  categorySidebar.innerHTML = CATEGORY_OPTIONS.map((option) => {
    const activeClass = option.id === state.category ? "is-active" : "";

    return `
      <button
        type="button"
        class="category-btn ${activeClass}"
        role="tab"
        aria-selected="${option.id === state.category}"
        data-category="${option.id}"
      >
        ${escapeHtml(option.label)}
      </button>
    `;
  }).join("");
}

function renderKeywordTagGrid() {
  const terms = state.category === "all"
    ? Array.from(new Set([...HOT_TERMS, ...Object.values(CATEGORY_TERMS).flat()]))
    : getTermsByCategory(state.category);

  keywordTagGrid.innerHTML = terms
    .map((term) => {
      const activeClass = state.subKeyword === term ? "is-active" : "";
      return `<button type="button" class="keyword-tag ${activeClass}" data-tag="${escapeHtml(term)}">${escapeHtml(term)}</button>`;
    })
    .join("");
}

function updateFilterStatus() {
  const range = getCurrentRange();
  const queryLabel = state.query ? state.query : "전체";
  const districtLabel = state.district === "all" ? "서울시 전체" : state.district;
  let compareLabel = "비교: 전년 동기";

  if (!state.isManualRange && state.activePreset === "d1") {
    compareLabel = "비교: 전일 vs 전전일";
  } else if (!state.isManualRange && state.activePreset === "y1") {
    compareLabel = "비교: 직전 1년";
  }

  filterStatus.textContent = `구: ${districtLabel} · ${range.start} ~ ${range.end} · ${compareLabel} · 검색어: ${queryLabel}`;
}

function openDatePicker() {
  const active = document.activeElement === endDateInput ? endDateInput : startDateInput;
  if (typeof active.showPicker === "function") {
    active.showPicker();
    return;
  }
  active.focus();
  active.click();
}

function validateSearchConditions() {
  const start = startDateInput.value;
  const end = endDateInput.value;

  if (!start || !end) {
    setError("시작일과 종료일을 모두 선택해주세요.");
    return false;
  }

  if (!parseDateKey(start) || !parseDateKey(end)) {
    setError("날짜 형식을 확인해주세요.");
    return false;
  }

  if (start > end) {
    setError("시작일은 종료일보다 늦을 수 없습니다.");
    return false;
  }

  clearError();
  return true;
}

function openAnalysisModal(payload) {
  state.pendingPayload = payload;
  analysisModal.classList.remove("is-hidden");
  document.body.classList.add("modal-open");
  analysisConfirm.focus();
}

function closeAnalysisModal() {
  analysisModal.classList.add("is-hidden");
  document.body.classList.remove("modal-open");
}

function showAnalysisOverlay() {
  state.isLoading = true;
  analysisOverlay.classList.remove("is-hidden");
  dashboardShell.classList.add("is-blurred");
  document.body.classList.add("is-busy");
}

function hideAnalysisOverlay() {
  state.isLoading = false;
  analysisOverlay.classList.add("is-hidden");
  dashboardShell.classList.remove("is-blurred");
  document.body.classList.remove("is-busy");
}

function requestAnalysis(trigger) {
  if (state.isLoading) return;

  if (!validateSearchConditions()) return;

  state.district = districtSelect.value || "all";

  const payload = {
    query: trigger?.query ?? searchInput.value.trim(),
    district: trigger?.district ?? state.district
  };

  openAnalysisModal(payload);
}

function handleConfirmAnalysis() {
  if (!state.pendingPayload || state.isLoading) return;

  const payload = state.pendingPayload;
  state.pendingPayload = null;

  closeAnalysisModal();
  showAnalysisOverlay();

  window.setTimeout(() => {
    state.query = payload.query;
    state.district = payload.district;

    searchInput.value = state.query;
    districtSelect.value = state.district;

    updateFilterStatus();
    renderWidgets();

    hideAnalysisOverlay();
  }, 2500);
}

function handleCancelAnalysis() {
  if (state.isLoading) return;

  state.pendingPayload = null;
  closeAnalysisModal();
}

function handlePresetClick(event) {
  const button = event.target.closest("button[data-preset]");
  if (!button) return;

  const presetId = button.dataset.preset;
  if (!presetId) return;

  state.isManualRange = false;
  applyPreset(presetId);
  clearError();
  updateFilterStatus();
  renderWidgets();
}

function handleDateChange() {
  state.isManualRange = true;
  syncPresetByRange();
  clearError();
  updateFilterStatus();
  renderWidgets();
}

function handleCategoryClick(event) {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  const category = button.dataset.category;
  if (!category || state.category === category) return;

  state.category = category;

  const currentTerms = getTermsByCategory(state.category);
  if (!currentTerms.includes(state.subKeyword)) {
    state.subKeyword = "";
  }

  renderCategorySidebar();
  renderKeywordTagGrid();
}

function handleTagClick(event) {
  const button = event.target.closest("button[data-tag]");
  if (!button) return;

  const tag = button.dataset.tag || "";
  searchInput.value = tag;
  searchInput.focus();
  const cursor = searchInput.value.length;
  searchInput.setSelectionRange(cursor, cursor);
}

function handleWidgetClick(event) {
  const button = event.target.closest("button[data-term]");
  if (!button) return;

  const term = button.dataset.term || "";
  state.query = term;
  searchInput.value = term;
  state.subKeyword = "";
  renderKeywordTagGrid();

  updateFilterStatus();

  requestAnalysis({
    query: term
  });
}

function handleSearchInput() {
  state.query = searchInput.value.trim();
  if (state.query !== state.subKeyword) {
    state.subKeyword = "";
    renderKeywordTagGrid();
  }
  updateFilterStatus();
}

function handleDistrictChange() {
  state.district = districtSelect.value || "all";
  updateFilterStatus();
  renderWidgets();
}

function resetSearchConditions() {
  if (state.isLoading) return;

  state.category = "all";
  state.subKeyword = "";
  state.query = "";
  state.district = "all";
  state.isManualRange = false;

  searchInput.value = "";
  districtSelect.value = "all";

  applyPreset("d1");
  clearError();
  renderCategorySidebar();
  renderKeywordTagGrid();
  updateFilterStatus();
  renderWidgets();
}

function bindEvents() {
  searchButton.addEventListener("click", () => requestAnalysis());
  resetButton.addEventListener("click", resetSearchConditions);

  searchInput.addEventListener("input", handleSearchInput);
  districtSelect.addEventListener("change", handleDistrictChange);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    requestAnalysis();
  });

  quickPresetGroup.addEventListener("click", handlePresetClick);
  startDateInput.addEventListener("change", handleDateChange);
  endDateInput.addEventListener("change", handleDateChange);

  datePickerButton.addEventListener("click", openDatePicker);

  categorySidebar.addEventListener("click", handleCategoryClick);
  keywordTagGrid.addEventListener("click", handleTagClick);

  risingList.addEventListener("click", handleWidgetClick);
  rankingList.addEventListener("click", handleWidgetClick);

  analysisConfirm.addEventListener("click", handleConfirmAnalysis);
  analysisCancel.addEventListener("click", handleCancelAnalysis);

  analysisModal.addEventListener("click", (event) => {
    if (event.target === analysisModal) {
      handleCancelAnalysis();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !analysisModal.classList.contains("is-hidden")) {
      handleCancelAnalysis();
    }
  });
}

function init() {
  ensureRequiredDom();

  generateMockData(2200);

  state.category = "all";
  state.subKeyword = "";
  state.query = "";
  state.district = "all";
  state.isManualRange = false;
  districtSelect.value = "all";

  applyPreset("d1");
  clearError();

  renderCategorySidebar();
  renderKeywordTagGrid();
  updateFilterStatus();
  renderWidgets();

  bindEvents();
}

init();
