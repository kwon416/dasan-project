declare module 'wordcloud' {
  interface WordCloudOptions {
    list: Array<[string, number, ...unknown[]]>;
    fontFamily?: string;
    fontWeight?: string | number | ((word: string, weight: number, fontSize: number, extraData?: unknown) => string | number);
    color?: string | ((word: string, weight: number, fontSize: number, distance: number, theta: number) => string);
    classes?: string | ((word: string, weight: number, fontSize: number, extraData?: unknown) => string);
    minSize?: number;
    weightFactor?: number | ((size: number) => number);
    clearCanvas?: boolean;
    backgroundColor?: string;
    gridSize?: number;
    origin?: [number, number];
    drawOutOfBound?: boolean;
    shrinkToFit?: boolean;
    drawMask?: boolean;
    maskColor?: string;
    maskGapWidth?: number;
    wait?: number;
    abortThreshold?: number;
    abort?: () => void;
    minRotation?: number;
    maxRotation?: number;
    rotateRatio?: number;
    rotationSteps?: number;
    shuffle?: boolean;
    shape?: string | ((theta: number) => number);
    ellipticity?: number;
    hover?: (item: [string, number, ...unknown[]] | null, dimension: unknown, event: MouseEvent) => void;
    click?: (item: [string, number, ...unknown[]], dimension: unknown, event: MouseEvent) => void;
  }

  function WordCloud(
    element: HTMLElement | HTMLElement[],
    options: WordCloudOptions
  ): void;

  namespace WordCloud {
    const isSupported: boolean;
    const minFontSize: number;
  }

  export = WordCloud;
}
