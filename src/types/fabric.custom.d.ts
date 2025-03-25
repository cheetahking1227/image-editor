import { v4 as uuid } from "uuid";
import { fabric } from "fabric";
import { AroomyItem, DrawingCurveType } from "./types";
declare module "fabric" {
  namespace fabric {
    class InfiniteGrid extends fabric.Object {
      constructor(options?: fabric.IObjectOptions);
    }

    class CustomPolygon extends fabric.Object {
      constructor(points, options?: fabric.IObjectOptions);
    }

    export class AroomyCircle extends fabric.Circle {
      type?: string | undefined;
      depth: number; a
      elevation: number;
      points: fabric.Point[];
      dimObjects: {};
      isNotWall: boolean;

      initialize(options?: ICircleOptions);
      _setOptions(options: ICircleOptions): void;
      _handleObjectSelected(): void;
      _handleSelectionCleared(): void;
      _showDimension(): void;
      _hideDimension(): void;
      _calculateStartAndEndPointForDim(): nuber { }
      _addDimension(): void;
      _updateDimension(): void;
      _removeDimension(): void;
      updateCirclFromCenter(centerPoint: fabric.Point): void;
      toObject();
      fromObject(options: ICircleOptions): AroomyCircle;
      _render(ctx: CanvasRenderingContext2D): void;
    }

    class AroomyCurve extends fabric.Path {
      type: "aroomyCurve";
      drawingCurve: DrawingCurveType;
      points: fabric.Point[];
      dimObjects: AroomyDimension;
      middleDimObjects: AroomyDimension;
      dimArray: fabric.Object[];

      constructor(points: fabric.Point[], options?: IPathOptions);

      toObject(): object;

      _render(ctx: CanvasRenderingContext2D): void;

      _getPathFromPoints(): string[][];

      showDimension(value: boolean): void;

      addDimension(): void;

      handleMoving(): void;

      handleRemoved(): void;

      _addCustomControls(): void;

      polylinePositionHandler(
        fabricObject: fabric.Polyline,
        index: number
      ): fabric.Point;

      anchorWrapper(
        anchorIndex: number,
        function_: fabric.ActionHandler,
        canvas?: fabric.Canvas
      ): fabric.ActionHandler;

      actionHandler(
        eventData: MouseEvent,
        transform: fabric.Transform,
        x: number,
        y: number,
        self?: any
      ): boolean;

      setCoords(): void;
      _setPath(path: fabric.Path): void;
      __setPath(): void;
      updateCurveFromPoints(newPoints: fabric.Point[]): void;
      updateDimensionColor(color: string): void;
      _calcBoundsFromPoints(): {
        left: number;
        top: number;
        width: number;
        height: number;
      };
      updateDimension(): void;
      updateCurveShape(): void;

      static fromObject(
        object: any,
        callback: (obj: fabric.Object) => void,
        extraParam?: any
      ): fabric.Path;
    }

    type PathSegment = [string, ...number[]];

    export class AroomyPolygon extends fabric.Polygon {
      type?: string | undefined;
      lines: fabric.AroomyPolyLine[];
      depth: number;
      elevation: number;
      updatedPoints: fabric.Point[];
      isSelected: boolean;
      isLineSelected: boolean;
      isRoom: boolean;
      areaTextObj: fabric.Text;
      isNotWall: boolean;
      wallThickness: number;
      customControls: any;
      connectedPolygonInfo: any[];
      isSnappedPoint: boolean;
      prevPolygon: fabric.AroomyPolygon | undefined;
      prevConnectedPolygons: fabric.AroomyPolygon[] | undefined;
      modifiedConnectedPolygons: fabric.AroomyPolygon[] | undefined;
      lineOptions: any;

      initialize?(
        points: fabric.Point[],
        options: IObjectOptions & { lineOptions?: IObjectOptions },
      );
      _addAroomyLines?(
        points: fabric.Point[],
        options: IObjectOptions & { lineOptions?: IObjectOptions }
      ): void;
      _showLineDimensionColor(color: string): void;
      _showLineDimensions(visible: boolean): void;
      updatePolygon(): void;
      splitEvent(delLine: fabric.AroomyPolyLine, oriLine: fabric.AroomyPolyLine, newLine: fabric.AroomyPolyLine): void;
      removeTwoLine(delLine0: fabric.AroomyPolyLine, delLine1: fabric.AroomyPolyLine, addLine: fabric.AroomyPolyLine): void;
      _findConnectedPolygonsByIndex(indexes: number[]);
      _updatePolygonFromLine(line: fabric.AroomyPolyLine): void;
      _updateAreaTextPosition(): void;
      _updateAreaTextContent(): void;
      _setCoords(): void;
      __handleModified(): void;
      _hideAroomyLines(index?: number): void;
      _updateAroomyLines(): void;
      _drawSquareRooms?(): void;
      updatePolygonFromPoints(newPoints: fabric.Point[]): void;
      updatePolygonFromAroomyItem(item: AroomyItem): void;
      showHideControlsByLine(line: fabric.AroomyPolyLine, isShow: boolean);
      controlSnapEvent(point: fabric.Point, index: number): void;
      toObject?();
      fromObject?(options: IObjectOptions): AroomyPolygon;
      _render?(ctx: CanvasRenderingContext2D): void;
    }

    export class AroomyPolyLine extends fabric.AroomyLine {
      type?: string | undefined;
      parentPolygon: fabric.AroomyPolygon;
      parentId: string;
      isSelected: boolean;
      initialize(
        points: fabric.Point[],
        options: IObjectOptions & { lineOptions?: IObjectOptions }
      );
      _setCoords(): void;
      fromObject(options: IObjectOptions): AroomyLine;
      _render(ctx: CanvasRenderingContext2D): void;
    }

    export class AroomyDoorWindowPath extends fabric.Path {
      type?: string | undefined;
      depth: number;
      elevation: number;
      points: fabric.Point[];
      parentId: string;
      bandOptions: fabric.IPathOptions;
      bandPathObj: fabric.Path;
      parentObjectId: string;
      __isFlip: boolean;
      doorWindowWidth: number;

      moveEvent(isByBand: boolean): void;
      updateDoorWindow(pointer: fabric.Point): void;
      updateBandPathObject(path: any, options: any): void;
      updateDoorWindowByWidth(): void;
      initialize(path: string, options: IObjectOptions);
      fromObject(options: IObjectOptions): AroomyDoorWindowPath;
      updatePositionAngle(leftPos: number, topPos: number, angle);
      filpDoor(): void;
      updateDoorPath(path: any): void;
      parentModifiedEvent();
      parentModifiedEventHandler();
      parentModifiedAfterEvent();
      parentModifiedAfterEventHandler();
      setFinalProperty(): void;
      _setPath(): void;
      _render(ctx: CanvasRenderingContext2D): void;
    }
  }
}
