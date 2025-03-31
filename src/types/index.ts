import { Polyline, Control } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { RgbaColor } from "react-colorful";

export type ImageCanvasProps = {
  image: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  rotation?: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export interface IAnnotationLineControlOptions extends Control {
  id?: string;
  pointIndex?: number;
  objectType?: string;
}

export interface IObjectOptions {
  id?: string | undefined;
  name?: string | undefined;
  depth?: number; // real height in three
  elevation?: number;
  bandPath?: string;
  isRoom?: boolean;
}

export class AnnotationLine extends Polyline {
  // constructor(points: any[], options?: any);
}

export interface ICustomLineControlOptions extends Control {
  id?: string;
  pointIndex?: number;
  objectType?: string;
}

export interface ICustomPolygonControlOptions extends Partial<fabric.Control> {
  pointIndex: number;
  objectType: string;
}

export type BgImageFinetuneItem = {
  title: string;
  value: number;
  min: number;
  max: number;
}

export type AnnotationToolbarSectionType = {
  annotation: string;
  imageUrl: string;
  onChangeAnnotation: (index: number, title?: string) => void;
}

export type ColorAndStrokeSettingsType = {
  color: string;
  width: number;
  bgColor?: RgbaColor;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  onBgColorChange?: (color: RgbaColor) => void;
}

export type FilterSettingsType = {
  imageUrl: string;
  onFilterChange: (filter: string) => void;
}

export type FinetuneSettingsType = {
  bgImageFinetune: BgImageFinetuneItem[];
  finetune: number
  handleRangeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type FinetuneToolbarSectionType = {
  finetune: number,
  onChangeFinetune: (index: number) => void
}

export type ZoomToolbarSectionType = {
  imageUrl: string;
  viewMode: number;
  onChange: (zoom: number) => void;
}
