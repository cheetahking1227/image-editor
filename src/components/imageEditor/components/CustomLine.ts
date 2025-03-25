import { fabric } from "fabric";
import { CustomLineControl } from "./CustomLineControl";

fabric.CustomLine = fabric.util.createClass(fabric.Polyline, {
  type: "customLine",
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
