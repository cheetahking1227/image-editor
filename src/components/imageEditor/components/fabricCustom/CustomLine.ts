import { fabric } from "fabric";
import { CustomLineControl } from "./CustomLineControl";

fabric.CustomLine = fabric.util.createClass(fabric.Polyline, {
  type: "customLine",
  name: "Line",
  dimObjects: {},
  isSelected: false,
  isHovered: false,
  isHoverControl: false,
  allLineObjects: undefined,
  isSnappedLine: false,
  isSplittedPolygon: false,
  isArrow: false,

  initialize: function (
    points: fabric.Point[],
    options?: fabric.IObjectOptions
  ) {
    options = options || {};
    this.callSuper("initialize", points, options);
    this.initOptions();

    this.id = 0;
    if (options.id) this.id = options.id || this.id;

    this._addCustomControls();
    this._eventListner();
  },

  _eventListner: function () {
    this.on("modified", () => {
      const absPoints = this._getAbsPoints(this.points);
      this.set({ points: absPoints });
      this.setCoords();
      this._setPositionDimensions({});
      this.dirty = true;
      if (this.canvas) {
        this.canvas.requestRenderAll(); // re-render canvas
      }
    });
  },

  initOptions: function () {
    this.strokeLineCap = "round";
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      id: this.get("id"),
      name: this.get("name"),
    });
  },

  _render: function (ctx: CanvasRenderingContext2D) {
    this.callSuper("_render", ctx);

    if (this.isArrow) {
      const points = this.points;
      if (!points || points.length < 2) return;

      const last = points[points.length - 1];
      const prev = points[points.length - 2];

      const dx = last.x - prev.x;
      const dy = last.y - prev.y;
      const angle = Math.atan2(dy, dx);

      const triangleLength = 15 + this.strokeWidth * 3;
      const triangleWidth = 20 + this.strokeWidth * 4;

      ctx.save();
      ctx.translate(last.x - this.pathOffset.x, last.y - this.pathOffset.y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(this.strokeWidth, 0);
      ctx.lineTo(-triangleLength, triangleWidth / 2);
      ctx.lineTo(-triangleLength, -triangleWidth / 2);
      ctx.closePath();
      ctx.fillStyle = this.stroke || "black";
      ctx.fill();
      ctx.restore();
    }
  },

  _addCustomControls() {
    const points = this.points ?? [];
    this.hasBorders = false;
    this.controls = points.reduce(
      (
        accumulator: Record<string, CustomLineControl>,
        _point: fabric.Point,
        index: number
      ) => {
        accumulator["p" + index] = new CustomLineControl({ pointIndex: index, objectType: this.type });
        return accumulator;
      },
      {}
    );
    return this;
  },

  _getAbsPoints: function (points: fabric.Point[]) {
    const matrix = this.calcTransformMatrix();
    return points.map((p: any) =>
      fabric.util.transformPoint(
        new fabric.Point(p.x - this.pathOffset.x, p.y - this.pathOffset.y),
        matrix
      )
    );
  },
});

fabric.CustomLine.fromObject = function (
  object: any,
  callback?: (obj: fabric.Object) => void,
  extraParam?: any
): fabric.Polyline {
  return fabric.Object._fromObject(
    "CustomLine",
    object,
    callback,
    "points"
  ) as fabric.Polyline;
};
