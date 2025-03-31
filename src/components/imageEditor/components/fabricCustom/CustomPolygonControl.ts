import { fabric } from "fabric";
import type { ICustomPolygonControlOptions } from "../../../../types";

export class CustomPolygonControl extends fabric.Control {
  pointIndex: number = 0;
  objectType: string = "customPolygon";
  isActing: boolean = false;

  constructor(options: ICustomPolygonControlOptions) {
    super({
      ...options,
      cursorStyle: options?.cursorStyle || "all-scroll",
    });
    this.pointIndex = options.pointIndex;
    this.objectType = options.objectType;
    this.actionName = options.actionName || "modifyPolygon";
  }

  positionHandler: fabric.Control["positionHandler"] = (_, __, object) => {
    const polygon = object as fabric.Polygon;
    const index = this.pointIndex;
    const point = polygon.points?.[index];
    if (!point) return new fabric.Point(0, 0);

    const transformed = fabric.util.transformPoint(
      new fabric.Point(point.x - polygon.pathOffset.x, point.y - polygon.pathOffset.y),
      fabric.util.multiplyTransformMatrices(
        object.canvas?.viewportTransform ?? fabric.iMatrix.concat(),
        object.calcTransformMatrix()
      )
    );
    return transformed;
  };

  mouseDownHandler: fabric.Control["mouseDownHandler"] = () => {
    this.isActing = true;
    return true;
  };

  mouseUpHandler: fabric.Control["mouseUpHandler"] = () => {
    this.isActing = false;
    return true;
  };

  render: fabric.Control["render"] = (ctx, left, top) => {
    ctx.beginPath();
    ctx.arc(left, top, 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.isActing ? "rgba(92, 178, 209, 1)" : "white";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(92, 178, 209, 1)";
    ctx.stroke();
  };

  actionHandler: fabric.Control["actionHandler"] = (_eventData, transform, x, y) => {
    const polygon = transform.target as fabric.Polygon;
    const index = this.pointIndex;
    if (!polygon.points || polygon.points.length <= index) return false;

    const local = polygon.toLocalPoint(new fabric.Point(x, y), "center", "center");
    const base = polygon._getNonTransformedDimensions();
    const size = polygon._getTransformedDimensions(0, 0);

    const newPoint = new fabric.Point(
      (local.x * base.x) / size.x + polygon.pathOffset.x,
      (local.y * base.y) / size.y + polygon.pathOffset.y
    );

    polygon.points[index] = newPoint;
    polygon.setCoords();
    polygon.dirty = true;
    return true;
  };
}
