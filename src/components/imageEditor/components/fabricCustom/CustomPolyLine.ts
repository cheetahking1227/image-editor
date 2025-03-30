import { fabric } from "fabric";
import { CustomPolyLineControl } from "./CustomPolyLineControl"; // reuse this

fabric.CustomPolyLine = fabric.util.createClass(fabric.Polyline, {
  type: "customPolyLine",
  parentId: "",
  parentPolygon: null,
  isSelected: false,

  initialize: function (
    points: fabric.Point[],
    options: fabric.IObjectOptions & { lineOptions?: fabric.IObjectOptions } = {}
  ) {
    this.callSuper("initialize", points, options);
    this._addCustomControls();
    this._eventListner();
  },

  _addCustomControls: function () {
    const points = this.points || [];
    this.hasBorders = false;

    this.controls = points.reduce((acc: Record<string, CustomPolyLineControl>, _: fabric.Point, index: number) => {
      acc[`p${index}`] = new CustomPolyLineControl({
        pointIndex: index,
        objectType: "customPolyLine",
      });
      return acc;
    }, {});
  },

  _eventListner: function () {
    this.on("modified", () => {
      const absPoints = this.getAbsPoints(this.points);
      this.set({ points: absPoints });
      this.setCoords();
      this._setPositionDimensions({});
      this.dirty = true;
      if (this.canvas) {
        this.canvas.requestRenderAll(); // re-render canvas
      }
    });
  },

  updateCustomControls: function () {
    const points = this.points || [];
    this.controls = points.reduce((acc: Record<string, CustomPolyLineControl>, _: fabric.Point, index: number) => {
      acc[`p${index}`] = new CustomPolyLineControl({
        pointIndex: index,
        objectType: "customPolyLine",
      });
      return acc;
    }, {});
  },


  toObject: function () {
    return {
      ...this.callSuper("toObject"),
      parentId: this.parentId,
    };
  },

  getAbsPoints: function (points: fabric.Point[]) {
    const matrix = this.calcTransformMatrix();
    return points.map((p) =>
      fabric.util.transformPoint(
        new fabric.Point(p.x - this.pathOffset.x, p.y - this.pathOffset.y),
        matrix
      )
    );
  }
});

fabric.CustomPolyLine.fromObject = function (
  object: any,
  callback?: (obj: fabric.Object) => void
): fabric.Polyline {
  return fabric.Object._fromObject("CustomPolyLine", object, callback, "points") as fabric.Polyline;
};
