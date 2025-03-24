import * as fabric from 'fabric'

export const drawPen = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
}

export const drawLine = (canvas: fabric.Canvas) => {

}
export const drawRectangle = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = false;
  let isDrawing = false;
  let rect: fabric.Rect | null = null;
  let startX = 0;
  let startY = 0;

  fabric.FabricObject.prototype.transparentCorners = false;
  fabric.FabricObject.prototype.cornerColor = 'blue';
  fabric.FabricObject.prototype.cornerStyle = 'circle';

  canvas.on('mouse:down', (opt: any) => {
    const pointer = canvas.getScenePoint(opt.e);
    isDrawing = true;

    const target = canvas.findTarget(opt.e);
    if (target) return;

    startX = pointer.x;
    startY = pointer.y;

    rect = new fabric.Rect({
      left: startX,
      top: startY,
      width: 0,
      height: 0,
      fill: 'transparent',
      stroke: 'white',
      strokeWidth: 1,
      objectCaching: false,
      selectable: false,
      hasControls: false, // prevent mid-draw interactions
    });

    canvas.add(rect);
  });

  canvas.on('mouse:move', (opt: any) => {
    if (!isDrawing || !rect) return;

    const pointer = canvas.getScenePoint(opt.e);
    const width = pointer.x - startX;
    const height = pointer.y - startY;

    rect.set({
      width: Math.abs(width),
      height: Math.abs(height),
      left: width < 0 ? pointer.x : startX,
      top: height < 0 ? pointer.y : startY,
    });

    canvas.requestRenderAll();
  });

  canvas.on('mouse:up', () => {
    if (rect) {
      rect.set({
        selectable: true,
        hasControls: true,   // allow scaling
        hasRotatingPoint: true, // allow rotating
      });

      canvas.setActiveObject(rect);
    }

    isDrawing = false;
    rect = null;
  });
}
export const drawEllipse = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = false;
  let isDrawing = false;
  let ellipse: fabric.Ellipse | null = null;
  let startX = 0;
  let startY = 0;

  fabric.FabricObject.prototype.transparentCorners = false;
  fabric.FabricObject.prototype.cornerColor = 'blue';
  fabric.FabricObject.prototype.cornerStyle = 'circle';

  canvas.on('mouse:down', (opt: any) => {
    const pointer = canvas.getScenePoint(opt.e);
    const target = canvas.findTarget(opt.e);
    if (target) return; // Prevent drawing over existing object

    isDrawing = true;
    startX = pointer.x;
    startY = pointer.y;

    ellipse = new fabric.Ellipse({
      left: startX,
      top: startY,
      rx: 1,
      ry: 1,
      originX: 'center',
      originY: 'center',
      fill: 'transparent',
      stroke: 'white',
      strokeWidth: 1,
      selectable: false,
      hasControls: false,
      objectCaching: false,
    });

    canvas.add(ellipse);
  });

  canvas.on('mouse:move', (opt: any) => {
    if (!isDrawing || !ellipse) return;

    const pointer = canvas.getScenePoint(opt.e);

    const rx = Math.abs(pointer.x - startX) / 2;
    const ry = Math.abs(pointer.y - startY) / 2;

    const centerX = (pointer.x + startX) / 2;
    const centerY = (pointer.y + startY) / 2;

    ellipse.set({
      rx,
      ry,
      left: centerX,
      top: centerY,
    });
    canvas.requestRenderAll();
  });

  canvas.on('mouse:up', () => {
    if (ellipse) {
      ellipse.set({
        selectable: true,
        hasControls: true,
        hasRotatingPoint: true,
      });

      canvas.setActiveObject(ellipse);
    }

    isDrawing = false;
    ellipse = null;
  });
}
export const drawArrow = (canvas: fabric.Canvas) => {

}
export const drawPath = (canvas: fabric.Canvas) => {

}

export const initEvent = (canvas: fabric.Canvas) => {
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
}
