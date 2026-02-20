const populationTotal = 9597372;

const populationData = [
  { name: "종로구", population: 149608 },
  { name: "중구", population: 131214 },
  { name: "용산구", population: 217194 },
  { name: "성동구", population: 281289 },
  { name: "광진구", population: 348652 },
  { name: "동대문구", population: 358603 },
  { name: "중랑구", population: 385349 },
  { name: "성북구", population: 435037 },
  { name: "강북구", population: 289374 },
  { name: "도봉구", population: 306032 },
  { name: "노원구", population: 496552 },
  { name: "은평구", population: 465350 },
  { name: "서대문구", population: 318622 },
  { name: "마포구", population: 372745 },
  { name: "양천구", population: 434351 },
  { name: "강서구", population: 562194 },
  { name: "구로구", population: 411916 },
  { name: "금천구", population: 239070 },
  { name: "영등포구", population: 397173 },
  { name: "동작구", population: 387352 },
  { name: "관악구", population: 495620 },
  { name: "서초구", population: 413076 },
  { name: "강남구", population: 563215 },
  { name: "송파구", population: 656310 },
  { name: "강동구", population: 481474 }
];

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

const keywordTerms = Array.from(new Set(keywordPool));

function seedFromText(text) {
  return Array.from(text).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function makeDistrictData(entry) {
  const seed = seedFromText(entry.name);
  const baseRate = 1 / 105;
  const factor = 0.85 + (seed % 36) / 100;
  const total = Math.round(entry.population * baseRate * factor);
  const delta = 2 + (seed % 15);
  const riseRatio = 0.9 + (seed % 80) / 100;
  const capita = Math.round((total / entry.population) * 10000);
  return {
    name: entry.name,
    population: entry.population,
    total,
    delta,
    riseRatio,
    capita
  };
}

const districtData = populationData.map(makeDistrictData);

function makeKeywordData(term) {
  const seed = seedFromText(term);
  const freq = 180 + (seed % 1600);
  const deltaPct = 3 + (seed % 40);
  const rise = Math.round(freq * (deltaPct / 100) * (0.45 + (seed % 20) / 100));
  return { term, freq, deltaPct, rise };
}

const keywordData = keywordTerms.map(makeKeywordData);
const keywordDataFreq = keywordData;
const keywordDataRise = keywordData;

const state = {
  district: "all",
  timePreset: "today",
  sort: "rise",
  selectedKeyword: null,
  top: 10,
  normalize: "total",
  popSort: "population",
  keywordSearch: ""
};

const mapSvg = document.getElementById("mapSvg");
const districtSelect = document.getElementById("district");
const resetDistrict = document.getElementById("resetDistrict");
const chip = document.getElementById("conditionText");
const kpiCard1Title = document.getElementById("kpiCard1Title");
const kpiTotalValue = document.getElementById("kpiTotalValue");
const kpiTotalDeltaValue = document.getElementById("kpiTotalDeltaValue");
const kpiIntensityValue = document.getElementById("kpiIntensityValue");
const kpiIntensityStatus = document.getElementById("kpiIntensityStatus");
const kpiAvgTotalValue = document.getElementById("kpiAvgTotalValue");
const kpiAvgIntensityValue = document.getElementById("kpiAvgIntensityValue");
const kpiAvgDeltaValue = document.getElementById("kpiAvgDeltaValue");
const kpiAvgStatus = document.getElementById("kpiAvgStatus");
const kpiTrendTitle = document.getElementById("kpiTrendTitle");
const kpiTrendMain = document.getElementById("kpiTrendMain");
const kpiTrendTotal = document.getElementById("kpiTrendTotal");
const kpiTrendDelta = document.getElementById("kpiTrendDelta");
const kpiTrendSecondLabel = document.getElementById("kpiTrendSecondLabel");
const kpiTrendSecondDelta = document.getElementById("kpiTrendSecondDelta");
const kpiTrendThirdLabel = document.getElementById("kpiTrendThirdLabel");
const kpiTrendThirdDelta = document.getElementById("kpiTrendThirdDelta");
const kpiVolumeTitle = document.getElementById("kpiVolumeTitle");
const kpiVolumeMain = document.getElementById("kpiVolumeMain");
const kpiVolumeTotal = document.getElementById("kpiVolumeTotal");
const kpiVolumeDelta = document.getElementById("kpiVolumeDelta");
const kpiVolumeSecondLabel = document.getElementById("kpiVolumeSecondLabel");
const kpiVolumeSecondDelta = document.getElementById("kpiVolumeSecondDelta");
const kpiVolumeThirdLabel = document.getElementById("kpiVolumeThirdLabel");
const kpiVolumeThirdDelta = document.getElementById("kpiVolumeThirdDelta");
const rankingList = document.getElementById("rankingList");
const rankingTitle = document.getElementById("rankingTitle");
const wordcloud = document.getElementById("wordcloud");
const keywordPanelTitle = document.getElementById("keywordPanelTitle");
const keywordPanelSub = document.getElementById("keywordPanelSub");
const keywordPanelTip = document.getElementById("keywordPanelTip");
const keywordPoolTitle = document.getElementById("keywordPoolTitle");
const mapSvgWrap = document.querySelector(".map-svg-wrap");
const mapPanelTitle = document.getElementById("mapPanelTitle");
const barChart = document.getElementById("barChart");
const row3Sub = document.getElementById("row3Sub");
const row3Title = document.getElementById("row3Title");
const filterStatus = document.getElementById("filterStatus");
const clearAllButton = document.getElementById("clearAll");
const populationTableBody = document.querySelector("#populationTable tbody");
const populationMeta = document.getElementById("populationMeta");
const keywordTags = document.getElementById("keywordTags");
const keywordSearch = document.getElementById("keywordSearch");
const popSortButtons = document.querySelectorAll("[data-pop-sort]");
const legendTitle = document.getElementById("legendTitle");
const legendMin = document.getElementById("legendMin");
const legendMax = document.getElementById("legendMax");

const presetLabels = {
  today: "오늘",
  "24h": "최근24h",
  "7d": "7일",
  "30d": "30일",
  custom: "직접선택"
};

function formatNumber(value, digits = 0) {
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  const fixed = num.toFixed(digits);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
}

function keywordFactor(term) {
  const sum = seedFromText(term);
  return 0.75 + (sum % 50) / 100;
}

function rotationForTerm(term) {
  const sum = seedFromText(term);
  const rotation = (sum % 26) - 13;
  return rotation;
}

function fallbackPosition(term, maxWidth, maxHeight, wordWidth, wordHeight, padding) {
  const sum = seedFromText(term);
  const xRatio = ((sum % 97) + 13) / 110;
  const yRatio = ((sum % 67) + 17) / 90;
  const x = padding + xRatio * Math.max(0, maxWidth - wordWidth - padding * 2);
  const y = padding + yRatio * Math.max(0, maxHeight - wordHeight - padding * 2);
  return { x, y };
}

function keywordDistrictFactor(term, district) {
  if (district === "all") return 1;
  const sum = seedFromText(`${district}${term}`);
  return 0.8 + (sum % 45) / 100;
}

function currentValue(district) {
  let value = state.normalize === "capita" ? district.capita : district.total;
  if (state.selectedKeyword) {
    value = Math.round(value * keywordFactor(state.selectedKeyword));
  }
  return value;
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

function makePaddedBox(x, y, width, height, padding) {
  return {
    x: x - padding,
    y: y - padding,
    w: width + padding * 2,
    h: height + padding * 2
  };
}

function boxesOverlap(a, b) {
  return !(
    a.x + a.w < b.x
    || a.x > b.x + b.w
    || a.y + a.h < b.y
    || a.y > b.y + b.h
  );
}

function findSpiralPosition(width, height, placed, containerWidth, containerHeight, padding) {
  const centerX = containerWidth / 2 - width / 2;
  const centerY = containerHeight / 2 - height / 2;
  const maxSteps = 520;

  for (let i = 0; i < maxSteps; i += 1) {
    const angle = i * 0.35;
    const radius = i * 1.8;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const box = makePaddedBox(x, y, width, height, padding);

    const withinBounds = box.x >= 0
      && box.y >= 0
      && box.x + box.w <= containerWidth
      && box.y + box.h <= containerHeight;

    if (!withinBounds) continue;

    const overlaps = placed.some((p) => boxesOverlap(box, p));
    if (!overlaps) {
      return { x, y, box };
    }
  }

  return null;
}

function findGridPosition(width, height, placed, containerWidth, containerHeight, padding) {
  const step = 8;
  for (let y = padding; y <= containerHeight - height - padding; y += step) {
    for (let x = padding; x <= containerWidth - width - padding; x += step) {
      const box = makePaddedBox(x, y, width, height, padding);
      const overlaps = placed.some((p) => boxesOverlap(box, p));
      if (!overlaps) {
        return { x, y, box };
      }
    }
  }
  return null;
}

function updateLegend(values) {
  if (!legendMin && !legendMax && !legendTitle) return;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const digits = state.normalize === "capita" ? 1 : 0;
  const unit = state.normalize === "capita" ? "(건/1만명)" : "(건)";
  if (legendMin) {
    legendMin.textContent = `${formatNumber(min, digits)}${unit}`;
  }
  if (legendMax) {
    legendMax.textContent = `${formatNumber(max, digits)}${unit}`;
  }

  if (legendTitle) {
    legendTitle.textContent = state.normalize === "capita" ? "범례 (1만명당)" : "범례 (건수)";
  }
}

function renderDistrictSelect() {
  districtData.forEach((district) => {
    const option = document.createElement("option");
    option.value = district.name;
    option.textContent = district.name;
    districtSelect.appendChild(option);
  });
}

function renderMap() {
  if (!mapSvg) return;
  const values = districtData.map((d) => currentValue(d));
  const thresholds = getThresholds(values);
  updateLegend(values);
  const unitLabel = state.normalize === "capita" ? "건/1만명" : "건";

  mapSvg.querySelectorAll(".district-path").forEach((path) => {
    const name = path.dataset.district;
    const district = districtData.find((d) => d.name === name);
    if (!district) return;
    const value = currentValue(district);
    const level = getLevel(value, thresholds);
    path.setAttribute("data-level", String(level));
    path.classList.toggle("selected", state.district === name);

    let title = path.querySelector("title");
    if (!title) {
      title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      path.appendChild(title);
    }
    title.textContent = `${name} · ${formatNumber(value)}${unitLabel} · 전일 동시간 +${district.delta}%`;
  });

  updateMapLabels();
}

function parseMatrixPoint(transform) {
  const match = /matrix\\(([^)]+)\\)/.exec(transform || "");
  if (!match) return null;
  const values = match[1].split(/[\\s,]+/).map(Number);
  if (values.length < 6 || values.some((n) => Number.isNaN(n))) return null;
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
      // Fall back to bounding box check below.
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
  const parts = attr.split(/[\\s,]+/).map(Number);
  if (parts.length < 4 || parts.some((n) => Number.isNaN(n))) return null;
  return { width: parts[2], height: parts[3] };
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
  const candidatePaths = allPaths.filter((path) => {
    const fill = (path.getAttribute("fill") || "").toLowerCase();
    return fill !== "none";
  });
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
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      const hitPath = hit?.closest?.("path");
      if (hitPath && candidateSet.has(hitPath) && !assignedSet.has(hitPath)) {
        resolvedPath = hitPath;
      }
    }

    if (resolvedPath) {
      const index = remaining.findIndex((item) => item.path === resolvedPath);
      if (index >= 0) {
        remaining.splice(index, 1);
      }
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
        const score = item.area;
        if (score < bestScore) {
          bestScore = score;
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
        const box = item.box;
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        const dx = label.x - cx;
        const dy = label.y - cy;
        let score = Math.hypot(dx, dy);
        if (withinBoxCandidates.length) {
          score *= 0.5;
        }
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

let hoveredDistrict = null;
let mapLabelPoints = [];
let mapDistrictPaths = [];
let mapBounds = null;

function updateMapLabels() {
  if (!mapSvg) return;
  mapSvg.querySelectorAll("text[data-district]").forEach((textEl) => {
    const name = textEl.dataset.district;
    const isSelected = state.district === name;
    const isHovered = hoveredDistrict === name;
    textEl.classList.toggle("is-selected", isSelected);
    textEl.classList.toggle("is-active", isHovered);
  });
}

function collectMapLabels() {
  if (!mapSvg) return [];
  mapLabelPoints = Array.from(mapSvg.querySelectorAll("text"))
    .map((textEl) => {
      const name = textEl.textContent.trim();
      if (!name) return null;
      const point = getTextPoint(textEl);
      return { name, x: point.x, y: point.y };
    })
    .filter(Boolean);
  return mapLabelPoints;
}

function computeMapBounds(paths) {
  if (!paths || !paths.length) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  paths.forEach((path) => {
    try {
      const box = path.getBBox();
      if (!box) return;
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    } catch (err) {
      // Ignore invalid boxes.
    }
  });
  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    return null;
  }
  return { minX, minY, maxX, maxY };
}

function isPointInsideBounds(point, bounds, padding = 0) {
  if (!point || !bounds) return false;
  return (
    point.x >= bounds.minX - padding
    && point.x <= bounds.maxX + padding
    && point.y >= bounds.minY - padding
    && point.y <= bounds.maxY + padding
  );
}

function getSvgPoint(svg, clientX, clientY) {
  if (!svg) return null;
  const point = makeSvgPoint(svg, clientX, clientY);
  if (!point) return null;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  return point.matrixTransform(ctm.inverse());
}

function findNearestLabel(svg, clientX, clientY) {
  if (!mapLabelPoints.length) {
    collectMapLabels();
  }
  if (!mapLabelPoints.length) return null;
  const svgPoint = getSvgPoint(svg, clientX, clientY);
  if (!svgPoint) return null;
  let best = null;
  let bestDistance = Infinity;
  mapLabelPoints.forEach((label) => {
    const dx = svgPoint.x - label.x;
    const dy = svgPoint.y - label.y;
    const distance = Math.hypot(dx, dy);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = label.name;
    }
  });
  return best;
}

function findDistrictByPoint(svg, clientX, clientY) {
  const svgPoint = getSvgPoint(svg, clientX, clientY);
  if (!svgPoint) return null;
  const candidates = mapDistrictPaths.length
    ? mapDistrictPaths
    : Array.from(mapSvg?.querySelectorAll(".district-path") || []);
  for (let i = 0; i < candidates.length; i += 1) {
    const path = candidates[i];
    if (pointInPath(path, svgPoint.x, svgPoint.y)) {
      return path.dataset.district || null;
    }
  }
  return null;
}

function initMapSvg() {
  if (!mapSvg) return;
  mapDistrictPaths = assignDistrictsToPaths();
  collectMapLabels();
  mapBounds = computeMapBounds(mapDistrictPaths.length ? mapDistrictPaths : mapSvg.querySelectorAll(".district-path"));
  mapDistrictPaths.forEach((path) => {
    path.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!path.dataset.district) return;
      setDistrict(path.dataset.district);
    });
    path.addEventListener("mouseenter", () => {
      hoveredDistrict = path.dataset.district;
      updateMapLabels();
    });
    path.addEventListener("mouseleave", () => {
      hoveredDistrict = null;
      updateMapLabels();
    });
  });

  mapSvg.addEventListener("click", (event) => {
    const target = event.target;
    const direct = target?.dataset?.district
      || target?.closest?.(".district-path")?.dataset?.district;
    if (direct) {
      setDistrict(direct);
      return;
    }
    setDistrict("all");
  });

  if (mapSvgWrap) {
    mapSvgWrap.addEventListener("click", (event) => {
      if (event.target?.closest?.("#mapSvg")) return;
      setDistrict("all");
    });
  }
}

function setDistrict(name) {
  if (name === "all") {
    state.selectedKeyword = null;
  }
  state.district = name;
  districtSelect.value = name;
  updateAll();
}

function updateChips() {
  if (!chip) return;
  const districtLabel = state.district === "all" ? "서울시 전체" : state.district;
  const timeLabel = presetLabels[state.timePreset];
  const keywordLabel = state.selectedKeyword ? state.selectedKeyword : "전체 키워드";
  chip.textContent = `${districtLabel} · ${timeLabel} · ${keywordLabel}`;
}

function updateFilterStatus() {
  if (!filterStatus) return;
  const applied = [];
  if (state.district !== "all") applied.push("자치구");
  if (state.timePreset !== "today") applied.push("기간");
  if (state.selectedKeyword) applied.push("키워드");
  if (state.normalize !== "total") applied.push("정규화");

  filterStatus.textContent = applied.length
    ? `적용된 조건 ${applied.length}개`
    : "기본 조건";
}

function updateMapHeader() {
  if (!mapPanelTitle) return;
  const districtLabel = state.district === "all" ? "서울시 전체" : state.district;
  const keywordLabel = state.selectedKeyword ? state.selectedKeyword : "전체 키워드";
  mapPanelTitle.textContent = `${districtLabel} ${keywordLabel} 현황`;
}

function updateRow3Header() {
  if (!row3Title) return;
  const keywordLabel = state.selectedKeyword ? state.selectedKeyword : "전체 키워드";
  row3Title.textContent = `${keywordLabel} 자치구 순위`;
  if (row3Sub) {
    row3Sub.textContent = state.normalize === "capita"
      ? "기준: 인구 1만명당"
      : "기준: 총량";
  }
}

function applyDeltaState(element, value) {
  if (!element) return;
  const isUp = value > 0;
  const isDown = value < 0;
  element.classList.toggle("up", isUp);
  element.classList.toggle("down", isDown);
  element.classList.toggle("neutral", !isUp && !isDown);
}

function getCapitaRank(districtName) {
  if (!districtName || districtName === "all") return null;
  const sorted = [...districtData].sort((a, b) => b.capita - a.capita);
  const index = sorted.findIndex((row) => row.name === districtName);
  return index >= 0 ? index + 1 : null;
}

function updateKpis() {
  const formatDeltaText = (item) => {
    if (!item) return "데이터 없음";
    const trendSign = item.deltaPct > 0 ? "▲" : item.deltaPct < 0 ? "▼" : "-";
    const riseSign = item.rise >= 0 ? "+" : "-";
    return `전일비 ${riseSign}${formatNumber(Math.abs(item.rise))}건 ${trendSign} ${formatNumber(Math.abs(item.deltaPct))}%`;
  };
  const formatTotalDelta = (item) => {
    if (!item) return "(+0건) - 0%";
    const trendSign = item.deltaPct > 0 ? "▲" : item.deltaPct < 0 ? "▼" : "-";
    const riseSign = item.rise >= 0 ? "+" : "-";
    return `(${riseSign}${formatNumber(Math.abs(item.rise))}건) ${trendSign} ${formatNumber(Math.abs(item.deltaPct))}%`;
  };
  const districtLabel = state.district === "all" ? "서울시 전체" : state.district;
  if (kpiCard1Title) {
    kpiCard1Title.textContent = `${districtLabel} 현황`;
  }
  if (kpiTrendTitle) {
    kpiTrendTitle.textContent = `${districtLabel} 급상승 키워드`;
  }
  if (kpiVolumeTitle) {
    kpiVolumeTitle.textContent = `${districtLabel} 최다 발생 키워드`;
  }

  const totalAll = districtData.reduce((sum, d) => sum + d.total, 0);
  const populationAll = districtData.reduce((sum, d) => sum + d.population, 0);
  const avgDelta = Math.round(districtData.reduce((sum, d) => sum + d.delta, 0) / districtData.length);
  const deltaPct = state.district === "all"
    ? avgDelta
    : districtData.find((d) => d.name === state.district).delta;

  const total = state.district === "all"
    ? totalAll
    : districtData.find((d) => d.name === state.district).total;

  if (kpiTotalValue) {
    kpiTotalValue.textContent = `일간 민원 : 총 ${formatNumber(total)}건`;
  }
  if (kpiTotalDeltaValue) {
    const deltaCount = Math.round((total * deltaPct) / 100);
    const countSign = deltaCount >= 0 ? "+" : "-";
    const sign = deltaPct > 0 ? "▲" : deltaPct < 0 ? "▼" : "-";
    applyDeltaState(kpiTotalDeltaValue, deltaPct);
    kpiTotalDeltaValue.textContent = `${countSign}${formatNumber(Math.abs(deltaCount))}건 ${sign} ${formatNumber(Math.abs(deltaPct))}%`;
  }

  const avgCapita = districtData.reduce((sum, d) => sum + d.capita, 0) / districtData.length;
  const capitaValue = state.district === "all"
    ? (totalAll / populationAll) * 10000
    : districtData.find((d) => d.name === state.district).capita;

  if (kpiIntensityValue) {
    kpiIntensityValue.textContent = `인구 1만명당 ${formatNumber(capitaValue, 1)}건`;
  }
  if (kpiIntensityStatus) {
    if (state.district === "all") {
      kpiIntensityStatus.textContent = "25개 자치구 전체 합계";
    } else {
      const rank = getCapitaRank(state.district);
      kpiIntensityStatus.textContent = `서울 내 ${rank ?? "-"}위 / 25위`;
    }
  }

  if (kpiAvgTotalValue) {
    const avgTotal = totalAll / districtData.length;
    kpiAvgTotalValue.textContent = `평균 민원 : 총 ${formatNumber(avgTotal)}건`;
  }
  if (kpiAvgIntensityValue) {
    kpiAvgIntensityValue.textContent = `인구 1만명당 ${formatNumber(avgCapita, 1)}건`;
  }
  if (kpiAvgDeltaValue) {
    const avgTotal = totalAll / districtData.length;
    const deltaCount = Math.round((avgTotal * avgDelta) / 100);
    const countSign = deltaCount >= 0 ? "+" : "-";
    const sign = avgDelta > 0 ? "▲" : avgDelta < 0 ? "▼" : "-";
    applyDeltaState(kpiAvgDeltaValue, avgDelta);
    kpiAvgDeltaValue.textContent = `${countSign}${formatNumber(Math.abs(deltaCount))}건 ${sign} ${formatNumber(Math.abs(avgDelta))}%`;
  }
  if (kpiAvgStatus) {
    kpiAvgStatus.textContent = "전체평균";
  }

  const derived = derivedKeywords(keywordData);
  const trendList = [...derived].sort((a, b) => b.deltaPct - a.deltaPct).slice(0, 3);
  const volumeList = [...derived].sort((a, b) => b.freq - a.freq).slice(0, 3);

  if (trendList.length && kpiTrendMain) {
    const top = trendList[0];
    kpiTrendMain.textContent = top.term;
  }
  if (trendList.length && kpiTrendTotal) {
    const top = trendList[0];
    kpiTrendTotal.textContent = `총 ${formatNumber(top.freq)}건`;
  }
  if (trendList.length && kpiTrendDelta) {
    const top = trendList[0];
    applyDeltaState(kpiTrendDelta, top.deltaPct);
    kpiTrendDelta.textContent = formatTotalDelta(top);
  }
  if (kpiTrendSecondLabel) {
    const second = trendList[1];
    kpiTrendSecondLabel.textContent = second
      ? `2위 ${second.term} ${formatNumber(second.freq)}건`
      : "2위 데이터 없음";
  }
  if (kpiTrendSecondDelta) {
    const second = trendList[1];
    kpiTrendSecondDelta.textContent = formatDeltaText(second);
    applyDeltaState(kpiTrendSecondDelta, second?.deltaPct ?? 0);
  }
  if (kpiTrendThirdLabel) {
    const third = trendList[2];
    kpiTrendThirdLabel.textContent = third
      ? `3위 ${third.term} ${formatNumber(third.freq)}건`
      : "3위 데이터 없음";
  }
  if (kpiTrendThirdDelta) {
    const third = trendList[2];
    kpiTrendThirdDelta.textContent = formatDeltaText(third);
    applyDeltaState(kpiTrendThirdDelta, third?.deltaPct ?? 0);
  }

  if (volumeList.length && kpiVolumeMain) {
    const top = volumeList[0];
    kpiVolumeMain.textContent = top.term;
  }
  if (volumeList.length && kpiVolumeTotal) {
    const top = volumeList[0];
    kpiVolumeTotal.textContent = `총 ${formatNumber(top.freq)}건`;
  }
  if (volumeList.length && kpiVolumeDelta) {
    const top = volumeList[0];
    applyDeltaState(kpiVolumeDelta, top.deltaPct);
    kpiVolumeDelta.textContent = formatTotalDelta(top);
  }
  if (kpiVolumeSecondLabel) {
    const second = volumeList[1];
    kpiVolumeSecondLabel.textContent = second
      ? `2위 ${second.term} ${formatNumber(second.freq)}건`
      : "2위 데이터 없음";
  }
  if (kpiVolumeSecondDelta) {
    const second = volumeList[1];
    kpiVolumeSecondDelta.textContent = formatDeltaText(second);
    applyDeltaState(kpiVolumeSecondDelta, second?.deltaPct ?? 0);
  }
  if (kpiVolumeThirdLabel) {
    const third = volumeList[2];
    kpiVolumeThirdLabel.textContent = third
      ? `3위 ${third.term} ${formatNumber(third.freq)}건`
      : "3위 데이터 없음";
  }
  if (kpiVolumeThirdDelta) {
    const third = volumeList[2];
    kpiVolumeThirdDelta.textContent = formatDeltaText(third);
    applyDeltaState(kpiVolumeThirdDelta, third?.deltaPct ?? 0);
  }
}

function updateKeywordPanel() {
  if (!keywordPanelTitle && !keywordPanelSub && !keywordPanelTip) return;
  const districtLabel = state.district === "all" ? "서울시 전체" : state.district;
  const modeLabel = state.sort === "freq" ? "최다 발생 키워드" : "급상승 키워드";
  if (keywordPanelTitle) {
    keywordPanelTitle.textContent = `${districtLabel} ${modeLabel}`;
  }
  const syncText = state.sort === "freq"
    ? "워드클라우드 + 랭킹 동기화 (빈도 기준)"
    : "워드클라우드 + 랭킹 동기화 (급상승 기준)";
  if (keywordPanelSub) {
    keywordPanelSub.textContent = "";
  }
  if (keywordPanelTip) {
    keywordPanelTip.textContent = syncText;
  }
}

function updatePopulationMeta() {
  if (!populationMeta) return;
  const totalComplaints = districtData.reduce((sum, d) => sum + d.total, 0);
  populationMeta.textContent = `총인구 ${formatNumber(populationTotal)}명 · 샘플 민원 ${formatNumber(totalComplaints)}건`;
}

function renderPopulationTable() {
  if (!populationTableBody) return;
  let rows = [...districtData];
  rows.sort((a, b) => {
    if (state.popSort === "total") return b.total - a.total;
    return b.population - a.population;
  });

  populationTableBody.innerHTML = "";

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    if (state.district === row.name) {
      tr.classList.add("selected");
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.name}</td>
      <td class="num">${formatNumber(row.population)}</td>
      <td class="num">${formatNumber(row.total)}</td>
      <td class="num">${formatNumber(row.capita)}</td>
    `;

    tr.addEventListener("click", () => setDistrict(row.name));
    populationTableBody.appendChild(tr);
  });
}

function renderKeywordTags() {
  if (!keywordTags) return;
  const query = state.keywordSearch.trim();
  let list = [...keywordData].sort((a, b) => b.freq - a.freq);

  if (query) {
    list = list.filter((keyword) => keyword.term.includes(query));
  }

  keywordTags.innerHTML = "";

  if (keywordPoolTitle) {
    keywordPoolTitle.textContent = `민원 키워드 풀 (총 ${formatNumber(keywordData.length)}개)`;
  }

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "검색 결과가 없습니다.";
    keywordTags.appendChild(empty);
    return;
  }

  list.forEach((keyword) => {
    const btn = document.createElement("button");
    btn.className = "tag";
    btn.dataset.term = keyword.term;
    if (state.selectedKeyword === keyword.term) {
      btn.classList.add("selected");
    }

    const label = document.createElement("span");
    label.textContent = keyword.term;
    btn.append(label);
    btn.title = `빈도 ${formatNumber(keyword.freq)}건 · 전일 대비 +${keyword.deltaPct}%`;

    btn.addEventListener("mouseenter", () => setHover(keyword.term));
    btn.addEventListener("mouseleave", () => clearHover());
    btn.addEventListener("click", () => selectKeyword(keyword.term));
    keywordTags.appendChild(btn);
  });
}

function getActiveKeywordBase() {
  return state.sort === "rise" ? keywordDataRise : keywordDataFreq;
}

function derivedKeywords(baseList) {
  return baseList.map((keyword) => {
    const factor = keywordDistrictFactor(keyword.term, state.district);
    const adjustedPct = Math.max(1, Math.round(keyword.deltaPct * factor));
    return {
      ...keyword,
      freq: Math.max(1, Math.round(keyword.freq * factor)),
      rise: Math.max(1, Math.round(keyword.rise * factor)),
      deltaPct: adjustedPct
    };
  });
}

function sortedKeywords() {
  const data = derivedKeywords(getActiveKeywordBase());
  if (state.sort === "freq") {
    return data.sort((a, b) => b.freq - a.freq);
  }
  return data.sort((a, b) => b.deltaPct - a.deltaPct);
}

function renderWordcloud() {
  const data = sortedKeywords().slice(0, 10);
  const max = Math.max(...data.map((k) => (state.sort === "freq" ? k.freq : k.deltaPct)));
  const min = Math.min(...data.map((k) => (state.sort === "freq" ? k.freq : k.deltaPct)));

  wordcloud.innerHTML = "";
  const containerWidth = wordcloud.clientWidth || 360;
  const containerHeight = wordcloud.clientHeight || 320;
  const placed = [];
  const padding = 4;

  data.forEach((keyword, index) => {
    const value = state.sort === "freq" ? keyword.freq : keyword.deltaPct;
    let size = 16 + ((value - min) / (max - min || 1)) * 16;
    if (index === 0) {
      size *= 1.5;
    }
    const btn = document.createElement("button");
    btn.className = "word";
    btn.dataset.term = keyword.term;
    const isTop = index < 3;
    btn.classList.toggle("top", isTop);
    btn.classList.toggle("dim", !isTop);
    if (isTop) {
      btn.classList.toggle("up", keyword.deltaPct > 0);
      btn.classList.toggle("down", keyword.deltaPct < 0);
      btn.classList.toggle("neutral", keyword.deltaPct === 0);
    }
    btn.style.fontSize = `${size.toFixed(0)}px`;
    btn.style.setProperty("--rot", "0deg");
    btn.textContent = keyword.term;
    btn.style.visibility = "hidden";
    if (state.selectedKeyword === keyword.term) {
      btn.classList.add("selected");
    }
    btn.addEventListener("mouseenter", () => setHover(keyword.term));
    btn.addEventListener("mouseleave", () => clearHover());
    btn.addEventListener("click", () => selectKeyword(keyword.term));
    wordcloud.appendChild(btn);

    let placedPos = null;
    let finalBox = null;

    for (let attempt = 0; attempt < 2 && !placedPos; attempt += 1) {
      btn.style.fontSize = `${size.toFixed(0)}px`;
      const rect = btn.getBoundingClientRect();
      const wordWidth = rect.width;
      const wordHeight = rect.height;

      const spiral = findSpiralPosition(
        wordWidth,
        wordHeight,
        placed,
        containerWidth,
        containerHeight,
        padding
      );

      if (spiral) {
        placedPos = { x: spiral.x, y: spiral.y };
        finalBox = spiral.box;
      } else {
        const grid = findGridPosition(
          wordWidth,
          wordHeight,
          placed,
          containerWidth,
          containerHeight,
          padding
        );
        if (grid) {
          placedPos = { x: grid.x, y: grid.y };
          finalBox = grid.box;
        }
      }

      if (!placedPos) {
        size *= 0.9;
      }
    }

    if (!placedPos) {
      const fallback = fallbackPosition(
        keyword.term,
        containerWidth,
        containerHeight,
        btn.getBoundingClientRect().width,
        btn.getBoundingClientRect().height,
        padding
      );
      placedPos = { x: fallback.x, y: fallback.y };
      finalBox = makePaddedBox(
        fallback.x,
        fallback.y,
        btn.getBoundingClientRect().width,
        btn.getBoundingClientRect().height,
        padding
      );
    }

    btn.style.left = `${placedPos.x}px`;
    btn.style.top = `${placedPos.y}px`;
    btn.style.visibility = "visible";
    if (finalBox) {
      placed.push(finalBox);
    }
  });
}

function renderRanking() {
  const data = sortedKeywords().slice(0, 10);
  rankingList.innerHTML = "";
  if (rankingTitle) {
    rankingTitle.textContent = state.sort === "freq" ? "빈도 순위" : "급상승 순위";
  }

  data.forEach((keyword, index) => {
    const item = document.createElement("li");
    item.className = "ranking-item";
    item.dataset.term = keyword.term;
    if (state.selectedKeyword === keyword.term) {
      item.classList.add("selected");
    }

    const rank = document.createElement("span");
    rank.className = "rank-num";
    rank.textContent = index + 1;

    const term = document.createElement("span");
    term.className = "rank-term";
    term.textContent = keyword.term;

    const metrics = document.createElement("span");
    metrics.className = "rank-metrics";

    const label = document.createElement("span");
    label.className = "rank-label";
    label.textContent = "전일비";

    const delta = document.createElement("span");
    delta.className = "delta";
    const sign = keyword.deltaPct > 0 ? "▲" : keyword.deltaPct < 0 ? "▼" : "-";
    const riseSign = keyword.rise >= 0 ? "+" : "-";
    delta.textContent = `${riseSign}${formatNumber(Math.abs(keyword.rise))}건 ${sign} ${formatNumber(Math.abs(keyword.deltaPct))}%`;
    applyDeltaState(delta, keyword.deltaPct);

    const total = document.createElement("span");
    total.className = "rank-total";
    total.textContent = `(총 ${formatNumber(keyword.freq)}건)`;

    metrics.append(label, delta, total);
    item.append(rank, term, metrics);
    item.addEventListener("mouseenter", () => setHover(keyword.term));
    item.addEventListener("mouseleave", () => clearHover());
    item.addEventListener("click", () => selectKeyword(keyword.term));
    rankingList.appendChild(item);
  });
}

function setHover(term) {
  document.querySelectorAll(".word, .ranking-item, .tag").forEach((el) => {
    if (el.dataset.term === term) {
      el.classList.add("hovered");
    } else {
      el.classList.remove("hovered");
    }
  });
}

function clearHover() {
  document.querySelectorAll(".word, .ranking-item, .tag").forEach((el) => {
    el.classList.remove("hovered");
  });
}

function ensureSelectedKeyword() {
  if (!state.selectedKeyword) return;
  const exists = getActiveKeywordBase().some((k) => k.term === state.selectedKeyword);
  if (!exists) {
    state.selectedKeyword = null;
  }
}

function resetAll() {
  state.district = "all";
  state.timePreset = "today";
  state.sort = "rise";
  state.selectedKeyword = null;
  state.top = 10;
  state.normalize = "total";
  state.popSort = "population";
  state.keywordSearch = "";

  districtSelect.value = "all";
  if (keywordSearch) {
    keywordSearch.value = "";
  }

  document.querySelectorAll(".preset").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.preset === state.timePreset);
  });
  document.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sort === state.sort);
  });
  document.querySelectorAll("[data-normalize]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.normalize === state.normalize);
  });
  document.querySelectorAll("[data-top]").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.top) === state.top);
  });
  popSortButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.popSort === state.popSort);
  });

  updateAll();
}

function selectKeyword(term) {
  state.selectedKeyword = state.selectedKeyword === term ? null : term;
  updateAll();
}

function renderRow3() {
  const values = districtData.map((d) => currentValue(d));
  const maxValue = Math.max(...values);
  const avgValue = values.reduce((sum, v) => sum + v, 0) / values.length;
  const avgPct = (avgValue / maxValue) * 100;
  barChart.style.setProperty("--avg-pct", `${avgPct.toFixed(1)}%`);

  let rows = districtData.map((d) => ({
    name: d.name,
    value: currentValue(d)
  }));

  rows.sort((a, b) => b.value - a.value);
  rows = rows.slice(0, state.top);

  barChart.innerHTML = "";

  const avgLabel = document.createElement("div");
  avgLabel.className = "avg-label";
  avgLabel.textContent = "서울시 평균";
  barChart.appendChild(avgLabel);

  rows.forEach((row) => {
    const barRow = document.createElement("div");
    barRow.className = "bar-row";
    if (state.district === row.name) {
      barRow.classList.add("selected");
    }
    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = row.name;

    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.setProperty("--pct", `${(row.value / maxValue) * 100}%`);
    track.appendChild(fill);

    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = `${formatNumber(row.value)}건`;

    barRow.append(label, track, value);
    barRow.addEventListener("click", () => setDistrict(row.name));
    barChart.appendChild(barRow);
  });

}

function updateAll() {
  ensureSelectedKeyword();
  updateMapHeader();
  updateRow3Header();
  updateChips();
  updateFilterStatus();
  updateKpis();
  updateKeywordPanel();
  updatePopulationMeta();
  renderMap();
  renderWordcloud();
  renderRanking();
  renderRow3();
  renderPopulationTable();
  renderKeywordTags();
}

function initControls() {
  document.querySelectorAll(".preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".preset").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.timePreset = btn.dataset.preset;
      updateChips();
      updateFilterStatus();
    });
  });

  document.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-sort]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.sort = btn.dataset.sort;
      ensureSelectedKeyword();
      updateAll();
    });
  });

  document.querySelectorAll("[data-normalize]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.normalize = btn.dataset.normalize;
      document.querySelectorAll("[data-normalize]").forEach((b) => {
        b.classList.toggle("active", b.dataset.normalize === state.normalize);
      });
      updateFilterStatus();
      updateRow3Header();
      renderMap();
      renderRow3();
    });
  });

  document.querySelectorAll("[data-top]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-top]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.top = Number(btn.dataset.top);
      renderRow3();
    });
  });

  popSortButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      popSortButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.popSort = btn.dataset.popSort;
      renderPopulationTable();
    });
  });

  districtSelect.addEventListener("change", (event) => {
    const value = event.target.value;
    state.district = value;
    updateAll();
  });

  if (resetDistrict) {
    resetDistrict.addEventListener("click", resetAll);
  }

  if (clearAllButton) {
    clearAllButton.addEventListener("click", resetAll);
  }

  if (keywordSearch) {
    keywordSearch.addEventListener("input", (event) => {
      state.keywordSearch = event.target.value;
      renderKeywordTags();
    });
  }
}

function initTips() {
  const tipHosts = Array.from(document.querySelectorAll(".has-tip"));
  if (!tipHosts.length) return;

  const clearOthers = (current) => {
    tipHosts.forEach((host) => {
      if (host !== current) {
        host.classList.remove("show-tip");
      }
    });
  };

  tipHosts.forEach((host) => {
    host.addEventListener("mouseenter", () => {
      clearOthers(host);
      host.classList.add("show-tip");
    });
    host.addEventListener("mouseleave", () => {
      host.classList.remove("show-tip");
    });
    host.addEventListener("focusin", (event) => {
      if (event.target !== host) return;
      clearOthers(host);
      host.classList.add("show-tip");
    });
    host.addEventListener("focusout", (event) => {
      if (event.target !== host) return;
      host.classList.remove("show-tip");
    });
  });
}

renderDistrictSelect();
initMapSvg();
initControls();
initTips();
updateAll();

let wordcloudResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(wordcloudResizeTimer);
  wordcloudResizeTimer = setTimeout(() => {
    renderWordcloud();
  }, 120);
});
