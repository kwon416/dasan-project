'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { DateRange } from '@/types';

interface SidebarProps {
  districts?: Array<{ code: string; name: string; totalComplaints: number }>;
  selectedDistrict?: string;
  hoveredDistrict?: string;
  onDistrictSelect?: (code: string) => void;
  onDistrictHover?: (code: string | null) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  showDatePicker?: boolean;
  showDistrictList?: boolean;
}

export function Sidebar({
  districts = [],
  selectedDistrict,
  hoveredDistrict,
  onDistrictSelect,
  onDistrictHover,
  dateRange,
  onDateRangeChange,
  showDatePicker = true,
  showDistrictList = true,
}: SidebarProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(true);
  const [districtListOpen, setDistrictListOpen] = useState(true);

  // Sort districts by complaint count
  const sortedDistricts = [...districts].sort((a, b) => b.totalComplaints - a.totalComplaints);

  return (
    <aside className="w-full lg:w-72 space-y-4">
      {/* 기간 선택 */}
      {showDatePicker && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setDatePickerOpen(!datePickerOpen)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                기간 선택
              </CardTitle>
              {datePickerOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
          {datePickerOpen && (
            <CardContent>
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground">
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      {dateRange.from.toLocaleDateString('ko-KR')} ~{' '}
                      {dateRange.to.toLocaleDateString('ko-KR')}
                    </>
                  ) : (
                    '기간을 선택하세요'
                  )}
                </div>
                <CalendarComponent
                  mode="range"
                  selected={dateRange ? { from: dateRange.from, to: dateRange.to } : undefined}
                  onSelect={(range) => {
                    if (range?.from && range?.to && onDateRangeChange) {
                      onDateRangeChange({ from: range.from, to: range.to });
                    }
                  }}
                  className="rounded-md border"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      const now = new Date();
                      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                      onDateRangeChange?.({ from: weekAgo, to: now });
                    }}
                  >
                    최근 1주
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      const now = new Date();
                      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                      onDateRangeChange?.({ from: monthAgo, to: now });
                    }}
                  >
                    최근 1개월
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* 자치구 목록 */}
      {showDistrictList && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setDistrictListOpen(!districtListOpen)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                자치구 목록
              </CardTitle>
              {districtListOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
          {districtListOpen && (
            <CardContent>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                <Button
                  variant={selectedDistrict === undefined ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-between text-xs"
                  onClick={() => onDistrictSelect?.('')}
                >
                  <span>전체</span>
                  <span className="text-muted-foreground">
                    {districts.reduce((sum, d) => sum + d.totalComplaints, 0).toLocaleString()}건
                  </span>
                </Button>
                {sortedDistricts.map((district, index) => {
                  const rank = index + 1;
                  const isSelected = selectedDistrict === district.code;
                  const isHovered = hoveredDistrict === district.code;

                  return (
                    <Button
                      key={district.code}
                      variant={isSelected ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'w-full justify-between text-xs transition-all duration-200',
                        isSelected && 'bg-[#0033A0]/10 text-[#0033A0]',
                        isHovered && !isSelected && 'bg-yellow-50 ring-2 ring-yellow-400'
                      )}
                      onClick={() => onDistrictSelect?.(district.code)}
                      onMouseEnter={() => onDistrictHover?.(district.code)}
                      onMouseLeave={() => onDistrictHover?.(null)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0033A0]/10 text-[#0033A0] text-[10px] font-bold flex items-center justify-center">
                          {rank}
                        </span>
                        <span>{district.name}</span>
                      </span>
                      <span className="text-muted-foreground">
                        {district.totalComplaints.toLocaleString()}건
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </aside>
  );
}
