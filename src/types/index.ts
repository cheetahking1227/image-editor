import { Polyline, Control } from "fabric/fabric-impl";

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
