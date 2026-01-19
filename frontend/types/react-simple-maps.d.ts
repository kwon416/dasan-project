declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, CSSProperties, MouseEvent } from 'react';

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (event: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (event: { coordinates: [number, number]; zoom: number; dragging: boolean }) => void;
    onMoveEnd?: (event: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  }

  export interface GeographyType {
    rsmKey: string;
    properties: Record<string, unknown>;
    geometry: GeoJSON.Geometry;
    svgPath: string;
  }

  export interface GeographiesChildrenProps {
    geographies: GeographyType[];
    outline: GeographyType;
    borders: GeographyType;
  }

  export interface GeographiesProps {
    geography: string | Record<string, unknown> | unknown[];
    children: (props: GeographiesChildrenProps) => ReactNode;
    parseGeographies?: (geographies: GeographyType[]) => GeographyType[];
  }

  export interface GeographyStyle {
    default?: CSSProperties;
    hover?: CSSProperties;
    pressed?: CSSProperties;
  }

  export interface GeographyProps {
    geography: GeographyType;
    style?: GeographyStyle;
    className?: string;
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseDown?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseUp?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseMove?: (event: MouseEvent<SVGPathElement>) => void;
    onClick?: (event: MouseEvent<SVGPathElement>) => void;
    onFocus?: (event: React.FocusEvent<SVGPathElement>) => void;
    onBlur?: (event: React.FocusEvent<SVGPathElement>) => void;
    tabIndex?: number;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    style?: GeographyStyle;
    className?: string;
    onMouseEnter?: (event: MouseEvent<SVGGElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGGElement>) => void;
    onClick?: (event: MouseEvent<SVGGElement>) => void;
    children?: ReactNode;
  }

  export interface LineProps {
    from: [number, number];
    to: [number, number];
    coordinates?: [number, number][];
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    fill?: string;
    className?: string;
  }

  export interface AnnotationProps {
    subject: [number, number];
    dx?: number;
    dy?: number;
    connectorProps?: Record<string, unknown>;
    children?: ReactNode;
  }

  export interface GraticuleProps {
    step?: [number, number];
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    className?: string;
  }

  export interface SphereProps {
    id?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Line: ComponentType<LineProps>;
  export const Annotation: ComponentType<AnnotationProps>;
  export const Graticule: ComponentType<GraticuleProps>;
  export const Sphere: ComponentType<SphereProps>;
}
