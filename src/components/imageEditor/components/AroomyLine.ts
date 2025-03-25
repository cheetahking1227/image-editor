import { fabric } from "fabric";
import { AroomyLineControl } from "./AroomyLineControl";

fabric.AroomyLine = fabric.util.createClass(fabric.Polyline, {
  type: "aroomyLine",
  name: "Line",
  dimObjects: {},
  isSelected: false,
  isNotWall: false,
  isHovered: false,
  isHoverControl: false,
  allLineObjects: undefined,
  isSnappedLine: false,
  isSplittedPolygon: false,

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
    // this.on("added", () => {});
    // this.on("moving", () => {});
    // this.on("mouseup", () => {});
    // this.on("modified", () => {});
    // this.on("removed", () => {});
  },

  initOptions: function () {
    this.strokeLineCap = "round";
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      id: this.get("id"),
      name: this.get("name"),
      depth: this.get("depth"),
      elevation: this.get('elevation'),
      dimObjects: this.get('dimObjects'),
      isNotWall: this.get("isNotWall"),
    });
  },

  _render: function (ctx: CanvasRenderingContext2D) {
    this.callSuper("_render", ctx);
  },

  _addCustomControls() {
    const points = this.points ?? [];
    const lastControl = points.length - 1;
    this.hasBorders = false;
    this.controls = points.reduce(
      (
        accumulator: Record<string, AroomyLineControl>,
        _point: fabric.Point,
        index: number
      ) => {
        accumulator["p" + index] = new AroomyLineControl({ pointIndex: index, objectType: this.type });
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

fabric.AroomyLine.fromObject = function (
  object: any,
  callback?: (obj: fabric.Object) => void,
  extraParam?: any
): fabric.Polyline {
  return fabric.Object._fromObject(
    "AroomyLine",
    object,
    callback,
    "points"
  ) as fabric.Polyline;
};
