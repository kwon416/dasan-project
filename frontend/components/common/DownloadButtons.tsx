'use client';

import { Download, FileSpreadsheet, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

type SheetData = Record<string, unknown>[];
type MultiSheetData = Record<string, SheetData>;

interface DownloadButtonsProps {
  data?: SheetData | MultiSheetData;
  filename?: string;
  chartRef?: React.RefObject<HTMLDivElement | null>;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

// 데이터가 배열인지 멀티시트 객체인지 체크
function isSheetData(data: SheetData | MultiSheetData): data is SheetData {
  return Array.isArray(data);
}

export function DownloadButtons({
  data = [],
  filename = 'data',
  chartRef,
  variant = 'outline',
  size = 'sm',
}: DownloadButtonsProps) {
  // 데이터를 평탄화된 배열로 변환
  const flatData = isSheetData(data) ? data : Object.values(data).flat();

  const downloadCSV = () => {
    if (flatData.length === 0) return;

    const headers = Object.keys(flatData[0]);
    const csvContent = [
      headers.join(','),
      ...flatData.map((row) =>
        headers.map((header) => {
          const value = row[header];
          // Handle strings with commas by wrapping in quotes
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    if (isSheetData(data)) {
      // 단일 시트
      if (data.length === 0) return;
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    } else {
      // 멀티 시트
      const sheets = Object.entries(data);
      if (sheets.length === 0) return;
      sheets.forEach(([sheetName, sheetData]) => {
        if (sheetData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(sheetData);
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        }
      });
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
  };

  const downloadImage = async () => {
    if (!chartRef?.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${filename}.png`);
        }
      });
    } catch (error) {
      console.error('Failed to capture chart:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Download className="h-4 w-4 mr-2" />
          다운로드
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {flatData.length > 0 && (
          <>
            <DropdownMenuItem onClick={downloadCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV 다운로드
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel 다운로드
            </DropdownMenuItem>
          </>
        )}
        {chartRef && (
          <DropdownMenuItem onClick={downloadImage}>
            <ImageIcon className="h-4 w-4 mr-2" />
            이미지 다운로드
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
