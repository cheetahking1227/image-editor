declare namespace fabric {
  import { ItemType, WallType } from "./types";
  import { AroomyLine, IAroomyLineControlOptions } from "fabric/fabric-impl";

  export interface Canvas {
    contextTop: CanvasRenderingContext2D;
    lowerCanvasEl: HTMLElement;
    wrapperEl: HTMLElement;
    isDragging: boolean;
    historyProcessing: boolean;
    _currentTransform: unknown;
    extraProps: any;
    lastPosX?: number;
    lastPosY?: number;
    isObjectDrawing?: boolean;
    startDrawingSnapPointX?: number;
    startDrawingSnapPointY?: number;
    clearHistory(boolean?): void;
    clearUndo(): void;
    _historyNext(): void;
    _historyInit(): void;
    offHistory(): void;
    onHistory(): void;
    _centerObject: (obj: fabric.Object, center: fabric.Point) => fabric.Canvas;
    _setupCurrentTransform(
      e: Event,
      target: fabric.Object,
      alreadySelected: boolean
    ): void;
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
    depth?: number; // real height in three
    wallType?: WallType;
    type: ItemType;
    elevation?: number;
    bandPath?: string;
    isRoom?: boolean;
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

  export interface IGuideLineClassOptions extends IGuideLineOptions {
    canvas: {
      setActiveObject(
        object: fabric.Object | fabric.GuideLine,
        e?: Event
      ): Canvas;
      remove<T>(...object: (fabric.Object | fabric.GuideLine)[]): T;
    } & Canvas;
    activeOn: "down" | "up";
    initialize(xy: number, objObjects: IGuideLineOptions): void;
    callSuper(methodName: string, ...args: unknown[]): any;
    getBoundingRect(absolute?: boolean, calculate?: boolean): Rect;
    on(eventName: EventNameExt, handler: (e: IEvent<MouseEvent>) => void): void;
    off(
      eventName: EventNameExt,
      handler?: (e: IEvent<MouseEvent>) => void
    ): void;
    fire<T>(eventName: EventNameExt, options?: any): T;
    isPointOnRuler(e: MouseEvent): "horizontal" | "vertical" | false;
    bringToFront(): fabric.Object;
    isHorizontal(): boolean;
  }

  export interface GuideLine extends Line, IGuideLineClassOptions { }

  export class GuideLine extends Line {
    constructor(xy: number, objObjects?: IGuideLineOptions);
    static fromObject(object: any, callback: any): void;
  }

  export interface StaticCanvas {
    ruler: InstanceType<typeof CanvasRuler>;
  }
  interface AroomyLine extends Polyline {
    depth: number;
    elevation: number;
    isSelected: boolean;
    isNotWall: boolean;
    isHovered: boolean;
    activeControlIndex?: number;
    prevObject: fabric.AroomyLine;
    allLineObjects: fabric.AroomyLine[] | fabric.AroomyPolyLine[] | undefined;
    isSnappedLine: boolean;
    convertPolygon(): void;
    reCalcCoords(): void;
    _setPositionDimensions({ }): void;
    updateLine(): void;
    handleSelected(): void;
    handleDeselected(): void;
    showDimension(value: boolean): void;
    updateDimensionColor(color: string): void;
  }

  interface AroomyDimension {
    dimLine: fabric.Line;
    leftMarker: fabric.Triangle;
    rightMarker: fabric.Triangle;
    dimText: fabric.Text;
    dimTextField: fabric.Rect;
    convertPolygon?: () => void;
    prevObject?: fabric.AroomyLine;
  }

  interface AroomyCurve extends fabric.AroomyCurve {
    activeControlIndex?: number;
    isMiddleDim: boolean;
    dimObjects: fabric.Object;
    points: fabric.Point[];
    elevation: number;
    depth: number;
    isNotWall: boolean;
    _getPathFromPoints: (absPoints: fabric.Points[]) => any;
    updateCurveFromAroomyItem(item: AroomyItem): void;
    updateCurveFromPoints(newPointer: fabric.Point[]): void;
  }
  class AroomyLine extends Polyline {
    constructor(points: any[], options?: any);
    parentPolygon: fabric.AroomyPolygon;
    dimObjects: fabric.Object;
    isSelected: boolean;
    reCalcCoords(): void;
    _getAbsPoints(points: fabric.Point[]): fabric.Point[];
    _getMidPoint(p0: fabric.Point, p1: fabric.Point): fabric.Point;
    _setCoords();
    updatePoint(newPoints: fabric.Point[]): void;
    updateLineFromAroomyItem(item: AroomyItem);
    doSplit(curPoint: fabric.Point): void;
    setActiveLine(): void;
    setInActiveLine(): void;
  }
  interface IAroomyDoorWindowOptions extends IImageOptions {
    isDoor?: boolean;
    isWindow?: boolean;
    parentObjectId?: string;
    initPosition?: fabric.IPoint;
  }

  interface AroomyDoorWindow extends Image {
    id?: string;
    elevation: number;
    depth: number;
    points: fabric.Point[];
    doorWindowHeight: number,
    doorWindowWidth: number,
    doorWindowBottom: number,
    __isDoor?: boolean;
    __isWindow?: boolean;
    __parentObjectID?: string;
  }

  export class AroomyDoorWindow extends Image {
    __isDoor: boolean;
    __isWindow: boolean;
    __parentObjectId: string;
    __isAdded: boolean;
    __parentObject: any;

    constructor(
      element: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
      options: IAroomyDoorWindowOptions
    );

    static fromObject(
      object: any,
      callback?: (obj: fabric.Object) => void,
      extraParam?: any
    ): fabric.Image;

    toObject(): any;
    registerEvents(): void;
    dispose(): void;
    addedEvent(): void;
    parentModifiedEventHandler: () => void;
    parentMoveEvent: () => void;
    parentRemoveEvent(): void;
    moveEvent(): void;
    move: (point: fabric.Point) => void;

    set isDoor(flag: boolean);
    get isDoor(): boolean;

    set isWindow(flag: boolean);
    get isWindow(): boolean;

    set parentObjectId(id: string);
    get parentObjectId(): string;
  }

  interface IAroomyLineControlOptions extends Control {
    id?: string;
    pointIndex?: number;
    objectType?: string;
  }

  interface IAroomyPolygonControlOptions {
    canvas: fabric.Canvas,
    point: IPoint,
    parentPolygon: fabric.AroomyPolygon,
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

  export interface CustomPolyline extends fabric.Polyline {
    isBg: boolean;
    roomId?: string;
    pointIndex: number;
    __corner: string;
    controlPointsPositions?: { x: number; y: number }[];
    _setPositionDimensions: (...args: any[]) => any;
    points: fabric.Point[];
    childImages?: CustomImage[];
  }

  export type extendCanvas = {
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
    historyUndo: any[];
    historyRedo: any[];
    tempHistory: { id: string | undefined, object: AroomyObject }[];
    isEnded: boolean;
    isLineOperated: boolean;
    oldVpt: any[];
    aroomyUnit: string;
    currentTool: AroomyDrawingToolType;
    hasSplittedObjects: boolean;
    countClick: number = 0;
  };
  export interface CustomRect extends fabric.Rect {
    absPoint?: { start: fabric.Point; end: fabric.Point };
  }

  export interface CustomCircle extends fabric.Circle {
    absPoint?: { start: fabric.Point; end: fabric.Point };
  }
  export interface CustomLine extends fabric.Line {
    absPoint?: { start: fabric.Point; end: fabric.Point };
  }

  export interface TempLine extends fabric.Line {
    dimObjects?: {};
  }

  export type AroomyObject = fabric.AroomyCurve | fabric.AroomyLine | fabric.AroomyPolyLine | fabric.AroomyCircle | fabric.AroomyDoorWindow | fabric.AroomyPolygon;
  export type AroomyWallObject = fabric.AroomyCurve | fabric.AroomyLine | fabric.AroomyPolyLine | fabric.AroomyCircle | fabric.AroomyPolygon;

  export type HistoryType = 'added' | 'modified' | 'removed' | 'line-connected' | 'line-splitted' | 'doorWindowAdded' | 'notWallModified' | 'doorFilpped';
  export interface AroomyHistoryObject {
    actionType: HistoryType;
    current: AroomyObject | null;
    prev: AroomyObject | null;
  }

  export type AroomyDimensionObject = fabric.AroomyCurve | fabric.AroomyLine | fabric.AroomyCircle | fabric.AroomyPolyLine;

  export type HistoryType = 'added' | 'modified' | 'removed';
  export interface AroomyHistoryObject {
    actionType: HistoryType;
    current: AroomyObject | null;
    prev: AroomyObject | null;
  }
  interface FabricStoreState {
    isSavingStatus: boolean;
    setIsSavingStatus: (status: boolean) => void;
    isNotWallNotification: boolean;
    setIsNotWallNotification: (status: boolean) => void;
  }
  interface SettingStoreState {
    selectedUnit: string;
    setSelectedUnit: (unit: string) => void;
    isColorView: boolean;
    setIsColorView: (isColor: boolean) => void;
  }

  type AroomyCanvas = fabric.Canvas & fabric.extendCanvas;
}
