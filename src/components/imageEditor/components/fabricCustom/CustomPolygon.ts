import { fabric } from "fabric";
import { CustomPolygonControl } from "./CustomPolygonControl";

fabric.CustomPolygon = fabric.util.createClass(fabric.Polygon, {
  type: "customPolygon",
  name: "Polygon",
  controlsVisible: true,

  initialize: function (
    points: fabric.Point[],
    options: fabric.IObjectOptions = {}
  ) {
    this.callSuper("initialize", points, options);
    this._addCustomControls();
  },

  toObject: function () {
    return {
      ...this.callSuper("toObject"),
      name: this.name,
    };
  },

  _addCustomControls: function () {
    const points = this.points || [];
    this.hasBorders = false;

    this.controls = points.reduce((acc: Record<string, CustomPolygonControl>, _: fabric.Point, index: number) => {
      acc[`p${index}`] = new CustomPolygonControl({
        pointIndex: index,
        objectType: this.type,
      });
      return acc;
    }, {});
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

fabric.CustomPolygon.fromObject = function (
  object: any,
  callback?: (obj: fabric.Object) => void
): fabric.Polygon {
  return fabric.Object._fromObject("CustomPolygon", object, callback, "points") as fabric.Polygon;
};
