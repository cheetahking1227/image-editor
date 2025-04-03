declare namespace fabric {
  import { CustomLine, ICustomLineControlOptions } from "fabric/fabric-impl";

  export interface Canvas {
    contextTop: CanvasRenderingContext2D;
    lowerCanvasEl: HTMLElement;
    wrapperEl: HTMLElement;
    isDragging: boolean;
    extraProps: any;
    lastPosX?: number;
    lastPosY?: number;
    isObjectDrawing?: boolean;
  }
  export interface Object {
    extensionType?: string;
    extension: any;
    top: number;
    left: number;
    forEachObject?: ICollection.forEachObject;
    fontFamily?: string;
    _objects?: ICollection.Object[];
    vpt: any;
  }

  export interface IObjectOptions {
    id?: string | undefined;
    name?: string | undefined;
  }

  export interface Group {
    _objects: ICollection.Object[];
    originMatrix: any;
  }
  export interface IUtil {
    findScaleToFit: (
      source: Record<string, unknown> | fabric.Object,
      destination: Record<string, unknown> | fabric.Object
    ) => number;
    makePathSimpler: (path: (string | number)[][]) => string;
  }

  function ControlMouseEventHandler(
    eventData: MouseEvent,
    transformData: Transform,
    x: number,
    y: number
  ): boolean;

  function ControlStringHandler(
    eventData: MouseEvent,
    control: fabric.Control,
    fabricObject: fabric.Object
  ): string;

  export const controlsUtils: {
    rotationWithSnapping: ControlMouseEventHandler;
    scalingEqually: ControlMouseEventHandler;
    scalingYOrSkewingX: ControlMouseEventHandler;
    scalingXOrSkewingY: ControlMouseEventHandler;

    scaleCursorStyleHandler: ControlStringHandler;
    scaleSkewCursorStyleHandler: ControlStringHandler;
    scaleOrSkewActionName: ControlStringHandler;
    rotationStyleHandler: ControlStringHandler;
  };

  type EventNameExt = "removed" | EventName;

  export interface IObservable<T> {
    on(
      eventName: "guideline:moving" | "guideline:mouseup",
      handler: (event: { e: Event; target: fabric.GuideLine }) => void
    ): T;
    on(events: {
      [key: EventName]: (event: { e: Event; target: fabric.GuideLine }) => void;
    }): T;
  }

  export interface IGuideLineOptions extends ILineOptions {
    axis: "horizontal" | "vertical";
  }
  export interface StaticCanvas {
    ruler: InstanceType<typeof CanvasRuler>;
  }

  interface CustomLine extends Polyline {
    isSelected: boolean;
    isHovered: boolean;
    activeControlIndex?: number;
    prevObject: fabric.CustomLine;
    _getAbsPoints(points: fabric.Point[]): fabric.Point[];
    _setPositionDimensions({ }): void;
  }
  class CustomLine extends Polyline {
    constructor(points: any[], options?: any);
    parentPolygon: fabric.CustomPolygon;
    dimObjects: fabric.Object;
    isSelected: boolean;
    reCalcCoords(): void;
    updatePoint(newPoints: fabric.Point[]): void;
    _getAbsPoints(points: fabric.Point[]): fabric.Point[];
    _setPositionDimensions({ }): void;
  }

  interface ICustomLineControlOptions extends Control {
    id?: string;
    pointIndex?: number;
    objectType?: string;
  }

  interface ICustomPolygonControlOptions {
    canvas: fabric.Canvas,
    point: IPoint,
    parentPolygon: fabric.CustomPolygon,
    index: number,
  }

  export type ActionHandler = (
    eventData: Readonly<MouseEvent>,
    transform: Readonly<fabric.Transform>,
    x: number,
    y: number,
    canvas?: fabric.Canvas
  ) => boolean;

  export interface CustomImage extends fabric.Image {
    startLeft?: number | null;
    startTop?: number | null;
  }

  export type extendCanvas = {
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
    historyUndo: any[];
    historyRedo: any[];
    tempHistory: { id: string | undefined, object: CustomObject }[];
    isEnded: boolean;
    isLineOperated: boolean;
    oldVpt: any[];
    customUnit: string;
    currentTool: CustomDrawingToolType;
    hasSplittedObjects: boolean;
    countClick: number = 0;
  };

  export class CustomCircle extends fabric.Circle {
    type?: string | undefined;
    depth: number; a
    elevation: number;
    points: fabric.Point[];
    dimObjects: {};
    isNotWall: boolean;

    initialize(options?: ICircleOptions);
    updateCirclFromCenter(centerPoint: fabric.Point): void;
    toObject();
    fromObject(options: ICircleOptions): CustomCircle;
  }
  export class CustomPolygon extends fabric.Polygon {
    type?: string | undefined;

    initialize?(
      points: fabric.Point[],
      options: IObjectOptions,
    );
    fromObject?(options: IObjectOptions): CustomPolygon;
  }


  export interface CustomPolyline extends fabric.Polyline {
    isBg: boolean;
    roomId?: string;
    pointIndex: number;
    __corner: string;
    controlPointsPositions?: { x: number; y: number }[];
    _setPositionDimensions: (...args: any[]) => any;
    points: fabric.Point[];
    childImages?: CustomImage[];
    getAbsPoints: (points: fabric.Point[]) => fabric.Point[];
    updateCustomControls(): void;
  }
  export class CustomPolyLine extends fabric.Polyline {
    type?: string | undefined;
    parentPolygon: fabric.CustomPolygon;
    parentId: string;
    isSelected: boolean;
    initialize(
      points: fabric.Point[],
      options: IObjectOptions & { lineOptions?: IObjectOptions }
    );
    fromObject(options: IObjectOptions): CustomLine;
    _setPositionDimensions({ }): void;
    getAbsPoints: (points: fabric.Point[]) => fabric.Point[];
    updateCustomControls(): void;
  }
  export interface CustomRect extends fabric.Rect {
    absPoint?: { start: fabric.Point; end: fabric.Point };
  }

  export interface CustomCircle extends fabric.Circle {
    absPoint?: { start: fabric.Point; end: fabric.Point };
  }
  export interface CustomLine extends fabric.Line {
    absPoint?: { start: fabric.Point; end: fabric.Point };
    isArrow?: boolean;
  }

  export interface TempLine extends fabric.Line {
    dimObjects?: {};
  }

  interface ICircleOptions extends IObjectOptions {
    name?: string;
    nodeNum?: number;
  }


  type CustomCanvas = fabric.Canvas & fabric.extendCanvas;
}
