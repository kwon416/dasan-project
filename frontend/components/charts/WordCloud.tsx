'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordCloudProps {
  words: Array<{ text: string; value: number }>;
  title?: string;
  timestamp?: string;
  onWordClick?: (word: string) => void;
}

export function WordCloud({ words, title = '오늘의 이슈', timestamp, onWordClick }: WordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#0033A0',
    '#1E5FC2',
    '#3D7BE4',
    '#5B97FF',
    '#002080',
    '#003DB8',
    '#0052D0',
  ];

  const handleClick = useCallback(
    (item: [string, number, ...unknown[]]) => {
      if (onWordClick && item) {
        onWordClick(item[0]);
      }
    },
    [onWordClick]
  );

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !words || words.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Set canvas size based on container
    const width = container.clientWidth || 400;
    const height = 320;
    canvas.width = width;
    canvas.height = height;

    // Convert words to WordCloud2 format: [['word', weight], ...]
    const maxValue = Math.max(...words.map((w) => w.value));
    const minValue = Math.min(...words.map((w) => w.value));
    const range = maxValue - minValue || 1;

    const list: [string, number][] = words.map((word) => {
      // Normalize weight for better visualization
      const normalized = (word.value - minValue) / range;
      const weight = 8 + normalized * 40; // Scale between 8 and 48
      return [word.text, weight];
    });

    // Clear previous content
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Dynamically import wordcloud to avoid SSR issues
    import('wordcloud').then((WordCloud2Module) => {
      const WordCloud2 = WordCloud2Module.default;

      // WordCloud2 options
      WordCloud2(canvas, {
        list,
        gridSize: 16,
        weightFactor: 1,
        fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        color: (_word: string, _weight: number, _fontSize: number, _distance: number, theta: number) => {
          const index = Math.floor((theta / (2 * Math.PI)) * colors.length);
          return colors[Math.abs(index) % colors.length];
        },
        rotateRatio: 0.3,
        rotationSteps: 2,
        backgroundColor: 'transparent',
        click: (item: [string, number, ...unknown[]]) => handleClick(item),
        hover: (item: [string, number, ...unknown[]] | null, _dimension: unknown, event: MouseEvent) => {
          const target = event.target as HTMLCanvasElement;
          target.style.cursor = item ? 'pointer' : 'default';
        },
        shrinkToFit: true,
        minSize: 10,
      });
    });

    // Cleanup
    return () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [words, colors, handleClick]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              기준: {formatTime(timestamp)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="flex justify-center items-center min-h-[320px]">
          {words && words.length > 0 ? (
            <canvas ref={canvasRef} className="max-w-full" />
          ) : (
            <p className="text-muted-foreground text-sm">데이터가 없습니다.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
