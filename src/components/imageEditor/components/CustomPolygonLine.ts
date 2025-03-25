import { fabric } from "fabric";

fabric.CustomPolyLine = fabric.util.createClass(fabric.CustomLine, {
  type: "customPolyLine",
  parentPolygon: null,
  parentId: null,

  initialize: function (
    points: fabric.Point[],
    options?: fabric.IObjectOptions
  ) {
    options = options || {};

    this.callSuper("initialize", points, options);
    this.hasControls = true;
    this.evented = true;
    this.hoverCursor = "url('/icons/polyline-move-cursor.svg') 16 16, auto";
    this.moveCursor = "url('/icons/polyline-move-cursor.svg') 16 16, auto";
    this._eventRegister();
  },

  _eventRegister: function () {
    this.on("selected", () => {
      if (this.parentPolygon) {
        this.parentPolygon.fire("line:selected", {
          line: this
        });
        this.handleSelected();
      }
    });
    this.on("deselected", () => {
      if (!this.canvas) return;
      if (this.canvas.currentTool === 'wall-cut') return;
      if (this.parentPolygon) {
        this.parentPolygon.fire("line:deselected", {
          line: this
        });
        this.handleDeselected();
      }
    });
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      id: this.get("id"),
      name: this.get("name"),
      parentId: this.get("parentId"),
    });
  },

  _render: function (ctx: CanvasRenderingContext2D) {
    this.callSuper("_render", ctx);
  },
});

fabric.CustomPolyLine.fromObject = function (
  object: any,
  callback?: (obj: fabric.Object) => void,
  extraParam?: any
): fabric.Polyline {
  return fabric.Object._fromObject(
    "CustomPolyLine",
    object,
    callback,
    "points"
  ) as fabric.Polyline;
};
