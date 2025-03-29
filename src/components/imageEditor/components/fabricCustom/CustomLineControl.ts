import { CustomLine, ICustomLineControlOptions } from "fabric/fabric-impl";
import { fabric } from "fabric";

export class CustomLineControl extends fabric.Control {
  pointIndex: number = 0;
  type: string = "customLineControl";
  isActing: boolean = false;
  tempMatrix: number[] = [];
  objectType: string = "";

  constructor(options: Partial<ICustomLineControlOptions>) {
    super({
      ...options,
      cursorStyle: options?.cursorStyle || "all-scroll",
    });
    this.pointIndex = options.pointIndex || 0;
    this.actionName = options.actionName || "modifyLine";
    this.objectType = options.objectType || "";

    if (this.objectType === "customPolyLine") this.visible = false;
  }

  // position handler
  positionHandler = (
    _eventData: MouseEvent,
    _transformData: fabric.Transform,
    fabricObject: fabric.Object
  ) => {
    const object = fabricObject as CustomLine;
    if (object.type !== "customLine") return new fabric.Point(0, 0);
    const index: number = this.pointIndex || 0;
    if (!object.points) {
      object.points = [];
    }
    const x = object.points[index].x - object.pathOffset.x;
    const y = object.points[index].y - object.pathOffset.y;

    const p = fabric.util.transformPoint(
      new fabric.Point(x, y),
      fabric.util.multiplyTransformMatrices(
        [...(object.canvas?.viewportTransform ?? [])],
        [...object.calcTransformMatrix()]
      )
    );
    return p;
  };

  // mouseDownHandler
  mouseDownHandler = (
    eventData: MouseEvent,
    transformData: fabric.Transform
  ) => {
    this.isActing = true;
    if (this.objectType === 'customLine') {
      const object = transformData.target as CustomLine;
      object.clone((cloned: fabric.CustomLine) => {
        object.prevObject = cloned;
        object.prevObject.id = object.id;
      })
    }
    return true;
  };

  // mouseUpHandler
  mouseUpHandler = (eventData: MouseEvent, transformData: fabric.Transform) => {
    this.isActing = false;
    if (this.objectType === 'customLine') {
    }
    return true;
  };

  // render method
  render = (ctx: CanvasRenderingContext2D, left: number, top: number) => {
    ctx.beginPath();
    let radius = 8;

    ctx.arc(left, top, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.isActing ? "rgba(92, 178, 209, 1)" : "white";

    ctx.fill();
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(92, 178, 209, 1)";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // actionHandler
  actionHandler = (eventData: MouseEvent, transformData: fabric.Transform, x: number, y: number): boolean => {
    const canvas: fabric.Canvas | undefined = transformData.target.canvas;
    if (!canvas) return false;

    const polyline = transformData.target as CustomLine;
    polyline.activeControlIndex = this.pointIndex;

    if (!polyline.points) {
      polyline.points = [];
    }
    // Ensure enough points exist before modifying
    if (polyline.points.length <= this.pointIndex) {
      console.error(
        "Error: Point index out of bounds!",
        polyline.points,
        this.pointIndex
      );
      return false;
    }

    polyline.set({
      scaleX: 1,
      scaleY: 1,
    });

    const mouseLocalPosition = polyline.toLocalPoint(
      new fabric.Point(x, y),
      "center",
      "center"
    );

    const polylineBaseSize = polyline._getNonTransformedDimensions();
    const size = polyline._getTransformedDimensions(0, 0);

    let finalPointPosition = new fabric.Point(
      (mouseLocalPosition.x * polylineBaseSize.x) / size.x +
      polyline.pathOffset.x,
      (mouseLocalPosition.y * polylineBaseSize.y) / size.y +
      polyline.pathOffset.y
    );

    if (!polyline.points) {
      polyline.points = [];
    }

    let points = polyline._getAbsPoints(polyline.points);
    const pointer = new fabric.Point(finalPointPosition.x, finalPointPosition.y);
    points[this.pointIndex] = pointer;
    polyline.set({ points: points });
    polyline.dirty = true;
    polyline._setPositionDimensions({});
    polyline.setCoords();
    return true;
  };
}
