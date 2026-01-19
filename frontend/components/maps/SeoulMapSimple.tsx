'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { SeoulMapTooltip } from './SeoulMapTooltip';
import { SeoulMapLegend } from './SeoulMapLegend';
import type { District, GeoJSONCollection, HangJeongDongCollection } from '@/types';

interface SeoulMapSimpleProps {
  geoData: GeoJSONCollection;
  districts: District[];
  hangJeongDongData?: HangJeongDongCollection;
  selectedDistrict?: string;
  hoveredDistrict?: string;
  onDistrictClick?: (code: string) => void;
  onDistrictHover?: (code: string | null) => void;
  onHangJeongDongSelect?: (dongName: string, dongCode?: string) => void;
}

// 서울 중심 좌표 및 프로젝션 설정
const SEOUL_CENTER: [number, number] = [126.978, 37.54];
const PROJECTION_CONFIG = {
  scale: 75000,
  center: SEOUL_CENTER,
};

// 행정동 색상 팔레트
const DONG_COLORS = [
  '#e8f4f8', '#d1e9f0', '#b9dde8', '#a2d2e0', '#8ac6d8',
  '#73bbd0', '#5bafc8', '#44a4c0', '#2c98b8', '#158db0',
];

export function SeoulMapSimple({
  geoData,
  districts,
  hangJeongDongData,
  selectedDistrict,
  hoveredDistrict,
  onDistrictClick,
  onDistrictHover,
  onHangJeongDongSelect,
}: SeoulMapSimpleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipData, setTooltipData] = useState<{
    name: string;
    complaints: number;
    rank: number;
    x: number;
    y: number;
  } | null>(null);

  // 행정동 툴팁 상태
  const [dongTooltipData, setDongTooltipData] = useState<{
    name: string;
    fullName: string;
    x: number;
    y: number;
  } | null>(null);

  // 선택된 행정동
  const [selectedDong, setSelectedDong] = useState<string | null>(null);

  // 줌 상태 관리
  const [mapCenter, setMapCenter] = useState<[number, number]>(SEOUL_CENTER);
  const [mapZoom, setMapZoom] = useState(1);

  // 이름 기반 자치구 데이터 룩업 테이블
  const districtLookupByName = useMemo(() => {
    return districts.reduce(
      (acc, d) => {
        acc[d.name] = d;
        return acc;
      },
      {} as Record<string, District>
    );
  }, [districts]);

  // 코드 기반 자치구 데이터 룩업 테이블
  const districtLookupByCode = useMemo(() => {
    return districts.reduce(
      (acc, d) => {
        acc[d.code] = d;
        return acc;
      },
      {} as Record<string, District>
    );
  }, [districts]);

  // 랭킹 기반 색상을 위한 정렬된 자치구 목록
  const rankedDistricts = useMemo(() => {
    return [...districts]
      .sort((a, b) => b.totalComplaints - a.totalComplaints)
      .map((d, index) => ({ ...d, rank: index + 1 }));
  }, [districts]);

  // 이름별 랭킹 룩업
  const rankLookupByName = useMemo(() => {
    return rankedDistricts.reduce(
      (acc, d) => {
        acc[d.name] = d.rank;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [rankedDistricts]);

  // 코드별 랭킹 룩업
  const rankLookupByCode = useMemo(() => {
    return rankedDistricts.reduce(
      (acc, d) => {
        acc[d.code] = d.rank;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [rankedDistricts]);

  // 선택된 구의 행정동 데이터 필터링
  const filteredHangJeongDong = useMemo(() => {
    if (!selectedDistrict || !hangJeongDongData) return null;

    const districtName = districtLookupByCode[selectedDistrict]?.name;
    if (!districtName) return null;

    const filtered = hangJeongDongData.features.filter(
      (feature) => feature.properties.sggnm === districtName
    );

    if (filtered.length === 0) return null;

    return {
      type: 'FeatureCollection' as const,
      features: filtered,
    };
  }, [selectedDistrict, hangJeongDongData, districtLookupByCode]);

  // 행정동 목록
  const hangJeongDongList = useMemo(() => {
    if (!filteredHangJeongDong) return [];
    return filteredHangJeongDong.features.map((f) => ({
      code: f.properties.adm_cd,
      name: f.properties.adm_nm.split(' ').pop() || '', // 동 이름만 추출
      fullName: f.properties.adm_nm,
    })).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [filteredHangJeongDong]);

  // 랭킹에 따른 색상 계산 (1위가 가장 진한 색)
  const getColorByRank = useCallback(
    (rank: number) => {
      const totalDistricts = districts.length;
      const ratio = (totalDistricts - rank + 1) / totalDistricts;

      if (ratio > 0.8) return '#08306b'; // 1-5위: 가장 진한 파랑
      if (ratio > 0.6) return '#2171b5'; // 6-10위
      if (ratio > 0.4) return '#4292c6'; // 11-15위
      if (ratio > 0.2) return '#6baed6'; // 16-20위
      return '#c6dbef'; // 21-25위: 가장 연한 파랑
    },
    [districts.length]
  );

  // 행정동 색상 계산 (인덱스 기반)
  const getDongColor = useCallback((index: number) => {
    return DONG_COLORS[index % DONG_COLORS.length];
  }, []);

  // GeoJSON feature에서 구 이름 가져오기
  const getDistrictName = (geo: { properties: Record<string, unknown> }) => {
    return (geo.properties.name as string) || '';
  };

  // 구 이름으로 코드 찾기
  const getCodeByName = useCallback((name: string) => {
    const district = districtLookupByName[name];
    return district?.code || '';
  }, [districtLookupByName]);

  // 코드로 구 이름 찾기
  const getNameByCode = useCallback((code: string) => {
    const district = districtLookupByCode[code];
    return district?.name || '';
  }, [districtLookupByCode]);

  // 선택된 구의 중심 좌표 계산
  const getDistrictCenter = useCallback((districtName: string): [number, number] | null => {
    const feature = geoData.features.find(f => f.properties.name === districtName);
    if (!feature) return null;

    const coords = feature.geometry.coordinates;
    let allCoords: number[][] = [];

    if (feature.geometry.type === 'Polygon') {
      allCoords = coords[0] as number[][];
    } else if (feature.geometry.type === 'MultiPolygon') {
      (coords as number[][][][]).forEach(polygon => {
        allCoords = allCoords.concat(polygon[0]);
      });
    }

    if (allCoords.length === 0) return null;

    const sumLng = allCoords.reduce((acc, coord) => acc + coord[0], 0);
    const sumLat = allCoords.reduce((acc, coord) => acc + coord[1], 0);

    return [sumLng / allCoords.length, sumLat / allCoords.length];
  }, [geoData]);

  // 선택된 자치구가 변경되면 해당 구로 줌인
  useEffect(() => {
    if (selectedDistrict) {
      const districtName = getNameByCode(selectedDistrict);
      if (districtName) {
        const center = getDistrictCenter(districtName);
        if (center) {
          setMapCenter(center);
          setMapZoom(2.5);
        }
      }
      // 구 변경 시 선택된 행정동 초기화
      setSelectedDong(null);
    } else {
      // 선택 해제 시 전체 보기로 복귀
      setMapCenter(SEOUL_CENTER);
      setMapZoom(1);
      setSelectedDong(null);
    }
  }, [selectedDistrict, getNameByCode, getDistrictCenter]);

  // 마우스 이벤트 핸들러 (자치구)
  const handleMouseEnter = useCallback(
    (
      event: React.MouseEvent<SVGPathElement>,
      geo: { properties: Record<string, unknown> }
    ) => {
      const { clientX, clientY } = event;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const name = getDistrictName(geo);
      const district = districtLookupByName[name];
      const rank = rankLookupByName[name] || 0;

      setTooltipData({
        name,
        complaints: district?.totalComplaints || 0,
        rank,
        x: clientX - rect.left,
        y: clientY - rect.top,
      });

      const code = getCodeByName(name);
      if (code) {
        onDistrictHover?.(code);
      }
    },
    [districtLookupByName, rankLookupByName, onDistrictHover, getCodeByName]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGPathElement>) => {
      if (!tooltipData) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setTooltipData((prev) =>
        prev
          ? {
              ...prev,
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            }
          : null
      );
    },
    [tooltipData]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltipData(null);
    onDistrictHover?.(null);
  }, [onDistrictHover]);

  // 행정동 마우스 이벤트 핸들러
  const handleDongMouseEnter = useCallback(
    (
      event: React.MouseEvent<SVGPathElement>,
      geo: { properties: Record<string, unknown> }
    ) => {
      const { clientX, clientY } = event;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const fullName = geo.properties.adm_nm as string;
      const dongName = fullName.split(' ').pop() || '';

      setDongTooltipData({
        name: dongName,
        fullName,
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    },
    []
  );

  const handleDongMouseMove = useCallback(
    (event: React.MouseEvent<SVGPathElement>) => {
      if (!dongTooltipData) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDongTooltipData((prev) =>
        prev
          ? {
              ...prev,
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            }
          : null
      );
    },
    [dongTooltipData]
  );

  const handleDongMouseLeave = useCallback(() => {
    setDongTooltipData(null);
  }, []);

  // 행정동 클릭 핸들러
  const handleDongClick = useCallback((geo: { properties: Record<string, unknown> }) => {
    const adm_cd = geo.properties.adm_cd as string;
    const fullName = geo.properties.adm_nm as string;
    const dongName = fullName.split(' ').pop() || '';

    if (selectedDong === adm_cd) {
      setSelectedDong(null);
      onHangJeongDongSelect?.('', '');
    } else {
      setSelectedDong(adm_cd);
      onHangJeongDongSelect?.(dongName, adm_cd);
    }
  }, [selectedDong, onHangJeongDongSelect]);

  // 클릭 핸들러 (자치구)
  const handleDistrictClick = useCallback((geo: { properties: Record<string, unknown> }) => {
    const name = getDistrictName(geo);
    const code = getCodeByName(name);

    if (code) {
      // 이미 선택된 구를 다시 클릭하면 선택 해제
      if (selectedDistrict === code) {
        onDistrictClick?.('');
      } else {
        onDistrictClick?.(code);
      }
    }
  }, [getCodeByName, onDistrictClick, selectedDistrict]);

  // 외부에서 hover된 구의 정보를 툴팁으로 표시
  const externalHoveredData = useMemo(() => {
    if (!hoveredDistrict || tooltipData) return null;
    const district = districtLookupByCode[hoveredDistrict];
    if (!district) return null;
    return {
      name: district.name,
      complaints: district.totalComplaints,
      rank: rankLookupByCode[hoveredDistrict] || 0,
    };
  }, [hoveredDistrict, tooltipData, districtLookupByCode, rankLookupByCode]);

  // 선택된 구 정보
  const selectedDistrictData = useMemo(() => {
    if (!selectedDistrict) return null;
    return districtLookupByCode[selectedDistrict];
  }, [selectedDistrict, districtLookupByCode]);

  return (
    <div ref={containerRef} className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={PROJECTION_CONFIG}
        width={800}
        height={520}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup
          center={mapCenter}
          zoom={mapZoom}
          onMoveEnd={({ coordinates, zoom }) => {
            setMapCenter(coordinates);
            setMapZoom(zoom);
          }}
          minZoom={1}
          maxZoom={6}
        >
          {/* 자치구 레이어 (선택되지 않았을 때 또는 배경으로) */}
          <Geographies geography={geoData as unknown as Record<string, unknown>}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = getDistrictName(geo);
                const code = getCodeByName(name);
                const isSelected = selectedDistrict === code;
                const isHovered = hoveredDistrict === code;
                const rank = rankLookupByName[name] || 25;
                const baseColor = getColorByRank(rank);

                // 선택된 구가 있을 때 다른 구는 희미하게
                const hasSelection = !!selectedDistrict;
                const opacity = hasSelection && !isSelected ? 0.3 : 1;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isSelected
                          ? '#0033A0'
                          : isHovered
                            ? '#FFB800'
                            : baseColor,
                        stroke: isSelected || isHovered ? '#fff' : '#fff',
                        strokeWidth: isSelected ? 2.5 : isHovered ? 2 : 0.5,
                        outline: 'none',
                        transition: 'all 0.2s ease-in-out',
                        filter: isHovered && !isSelected ? 'brightness(1.1)' : 'none',
                        opacity,
                      },
                      hover: {
                        fill: isSelected ? '#0033A0' : '#FFB800',
                        stroke: '#fff',
                        strokeWidth: 2,
                        outline: 'none',
                        cursor: 'pointer',
                        opacity: 1,
                      },
                      pressed: {
                        fill: '#0033A0',
                        outline: 'none',
                      },
                    }}
                    onMouseEnter={(e) => !selectedDistrict && handleMouseEnter(e, geo)}
                    onMouseMove={!selectedDistrict ? handleMouseMove : undefined}
                    onMouseLeave={!selectedDistrict ? handleMouseLeave : undefined}
                    onClick={() => handleDistrictClick(geo)}
                  />
                );
              })
            }
          </Geographies>

          {/* 행정동 레이어 (자치구 선택 시) */}
          {filteredHangJeongDong && (
            <Geographies geography={filteredHangJeongDong as unknown as Record<string, unknown>}>
              {({ geographies }) =>
                geographies.map((geo, index) => {
                  const adm_cd = geo.properties.adm_cd as string;
                  const isSelectedDong = selectedDong === adm_cd;
                  const baseColor = getDongColor(index);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: isSelectedDong ? '#FF6B35' : baseColor,
                          stroke: '#0033A0',
                          strokeWidth: isSelectedDong ? 1.5 : 0.5,
                          outline: 'none',
                          transition: 'all 0.15s ease-in-out',
                        },
                        hover: {
                          fill: isSelectedDong ? '#FF6B35' : '#FFB800',
                          stroke: '#0033A0',
                          strokeWidth: 1.5,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: '#FF6B35',
                          outline: 'none',
                        },
                      }}
                      onMouseEnter={(e) => handleDongMouseEnter(e, geo)}
                      onMouseMove={handleDongMouseMove}
                      onMouseLeave={handleDongMouseLeave}
                      onClick={() => handleDongClick(geo)}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>

      {/* 자치구 툴팁 */}
      {tooltipData && !selectedDistrict && (
        <SeoulMapTooltip
          name={tooltipData.name}
          complaints={tooltipData.complaints}
          rank={tooltipData.rank}
          x={tooltipData.x}
          y={tooltipData.y}
        />
      )}

      {/* 행정동 툴팁 */}
      {dongTooltipData && (
        <div
          className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-20 pointer-events-none text-sm"
          style={{
            left: dongTooltipData.x + 10,
            top: dongTooltipData.y - 10,
            transform: 'translateY(-100%)',
          }}
        >
          <p className="font-bold">{dongTooltipData.name}</p>
          <p className="text-xs text-gray-300">{dongTooltipData.fullName}</p>
        </div>
      )}

      {/* 외부 hover 시 상단에 정보 표시 */}
      {externalHoveredData && !tooltipData && !selectedDistrict && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0033A0] text-white px-4 py-2 rounded-lg shadow-lg z-10">
          <div className="text-center">
            <span className="font-bold">{externalHoveredData.name}</span>
            <span className="mx-2">|</span>
            <span>{externalHoveredData.complaints.toLocaleString()}건</span>
            <span className="ml-2 text-yellow-300 text-sm">({externalHoveredData.rank}위)</span>
          </div>
        </div>
      )}

      {/* 선택된 구 정보 + 행정동 목록 */}
      {selectedDistrictData && (
        <div className="absolute top-4 right-4 bg-white border border-[#0033A0] rounded-lg shadow-lg z-10 min-w-[200px] max-w-[250px] max-h-[480px] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <p className="text-xs text-muted-foreground mb-1">선택된 자치구</p>
            <p className="font-bold text-[#0033A0] text-lg">{selectedDistrictData.name}</p>
            <p className="text-sm mt-1">
              총 <span className="font-semibold">{selectedDistrictData.totalComplaints.toLocaleString()}</span>건
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              전체 {rankLookupByCode[selectedDistrict || ''] || 0}위
            </p>
          </div>

          {/* 행정동 목록 */}
          {hangJeongDongList.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                <p className="text-xs font-medium text-gray-600">
                  행정동 ({hangJeongDongList.length}개)
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {hangJeongDongList.map((dong, index) => (
                  <button
                    key={dong.code}
                    onClick={() => {
                      if (selectedDong === dong.code) {
                        setSelectedDong(null);
                        onHangJeongDongSelect?.('', '');
                      } else {
                        setSelectedDong(dong.code);
                        onHangJeongDongSelect?.(dong.name, dong.code);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                      selectedDong === dong.code ? 'bg-orange-50 text-orange-700' : ''
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: selectedDong === dong.code ? '#FF6B35' : getDongColor(index) }}
                    />
                    <span className="truncate">{dong.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => onDistrictClick?.('')}
              className="w-full text-xs text-gray-500 hover:text-gray-700 underline"
            >
              전체 보기로 돌아가기
            </button>
          </div>
        </div>
      )}

      {/* 범례 */}
      {!selectedDistrict && <SeoulMapLegend />}

      {/* 줌 컨트롤 */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-10">
        <button
          onClick={() => setMapZoom(Math.min(mapZoom * 1.5, 6))}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center text-lg font-bold"
          aria-label="확대"
        >
          +
        </button>
        <button
          onClick={() => {
            const newZoom = Math.max(mapZoom / 1.5, 1);
            setMapZoom(newZoom);
            if (newZoom <= 1) {
              setMapCenter(SEOUL_CENTER);
            }
          }}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center text-lg font-bold"
          aria-label="축소"
        >
          -
        </button>
        <button
          onClick={() => {
            setMapCenter(SEOUL_CENTER);
            setMapZoom(1);
            onDistrictClick?.('');
          }}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center text-xs"
          aria-label="전체 보기"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
