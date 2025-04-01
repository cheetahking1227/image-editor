import { fabric } from "fabric";
import { RgbaColor } from "react-colorful";

export const drawPen = (canvas: fabric.Canvas, color: string, strokeWidth: number,) => {
  initEvent(canvas);
  pressRightButton(canvas);
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = color;
  canvas.freeDrawingBrush.width = strokeWidth;
}

export const drawLine = (canvas: fabric.Canvas, color: string, strokeWidth: number, isArrow = false) => {
  initEvent(canvas);

  let isDrawing = false;
  let line: fabric.CustomLine | null = null;
  let startX = 0;
  let startY = 0;
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on('mouse:down', (opt: any) => {
    const evt = opt.e as MouseEvent;
    if (evt.button === 2) {
      isPanning = true;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      canvas.selection = false;
      canvas.setCursor('grab');
    } else {
      const target = canvas.findTarget(opt.e, true);
      if (target) return;

      const pointer = canvas.getPointer(opt.e);
      isDrawing = true;
      startX = pointer.x;
      startY = pointer.y;

      const linePoint = [new fabric.Point(startX, startY), new fabric.Point(startX, startY)];
      line = new fabric.CustomLine(linePoint, {
        stroke: color,
        strokeWidth: strokeWidth,
        selectable: false,
        evented: true,
        hasBorders: false,
        perPixelTargetFind: true,
        isArrow: isArrow
      });
      canvas.add(line);
    }
  });

  canvas.on('mouse:move', (opt: any) => {
    if (isPanning) {
      canvas.setCursor('grab');
      const e = opt.e as MouseEvent;
      const vpt = canvas.viewportTransform!;
      vpt[4] += e.clientX - lastPosX;
      vpt[5] += e.clientY - lastPosY;
      clampPan(canvas);
      canvas.requestRenderAll();
      lastPosX = e.clientX;
      lastPosY = e.clientY;
    } else {
      if (!isDrawing || !line) return;
      const pointer = opt.absolutePointer;
      const linePoint = line.points;
      if (linePoint) {
        linePoint[1] = new fabric.Point(pointer.x, pointer.y);
        line.set({ points: linePoint });
        line.setCoords();
        line._setPositionDimensions({});
        line.dirty = true;
      }
      canvas.requestRenderAll();
    }
  });

  canvas.on('mouse:up', () => {
    if (line) {
      line.set({
        selectable: true,
        evented: true,
      });

      canvas.setActiveObject(line);
    }
    isPanning = false;
    canvas.selection = true;
    isDrawing = false;
    line = null;
  });
}

export const drawRectangle = (canvas: fabric.Canvas, color: string, bgColor: RgbaColor, strokeWidth: number) => {
  initEvent(canvas);

  let isDrawing = false;
  let rect: fabric.Rect | null = null;
  let startX = 0;
  let startY = 0;
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on('mouse:down', (opt: any) => {
    const evt = opt.e as MouseEvent;
    if (evt.button === 2) {
      isPanning = true;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      canvas.selection = false;
      canvas.setCursor('grab');
    } else {
      const target = canvas.findTarget(opt.e, true);
      if (target) return;

      const pointer = canvas.getPointer(opt.e);
      isDrawing = true;

      startX = pointer.x;
      startY = pointer.y;

      rect = new fabric.Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
        stroke: color,
        strokeWidth: strokeWidth,
        objectCaching: false,
        selectable: false,
        hasControls: false,
      });

      canvas.add(rect);
    }
  });

  canvas.on('mouse:move', (opt: any) => {
    if (isPanning) {
      canvas.setCursor('grab');
      const e = opt.e as MouseEvent;
      const vpt = canvas.viewportTransform!;
      vpt[4] += e.clientX - lastPosX;
      vpt[5] += e.clientY - lastPosY;
      clampPan(canvas);
      canvas.requestRenderAll();
      lastPosX = e.clientX;
      lastPosY = e.clientY;
    } else {
      if (!isDrawing || !rect) return;

      const pointer = canvas.getPointer(opt.e);
      const width = pointer.x - startX;
      const height = pointer.y - startY;

      rect.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width < 0 ? pointer.x : startX,
        top: height < 0 ? pointer.y : startY,
      });

      canvas.requestRenderAll();
    }
  });

  canvas.on('mouse:up', () => {
    if (rect) {
      rect.set({
        selectable: true,
        hasControls: true,
        hasRotatingPoint: true,
      });

      canvas.setActiveObject(rect);
    }
    isPanning = false;
    canvas.selection = true;
    isDrawing = false;
    rect = null;
  });
}

export const drawEllipse = (canvas: fabric.Canvas, color: string, bgColor: RgbaColor, strokeWidth: number) => {
  initEvent(canvas);

  let isDrawing = false;
  let ellipse: fabric.Ellipse | null = null;
  let startX = 0;
  let startY = 0;
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on('mouse:down', (opt: any) => {
    const evt = opt.e as MouseEvent;
    if (evt.button === 2) {
      isPanning = true;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      canvas.selection = false;
      canvas.setCursor('grab');
    } else {
      const target = canvas.findTarget(opt.e, true);
      if (target) return;

      const pointer = canvas.getPointer(opt.e);

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
        fill: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
        stroke: color,
        strokeWidth: strokeWidth,
        selectable: false,
        hasControls: false,
        objectCaching: false,
      });

      canvas.add(ellipse);
    }
  });

  canvas.on('mouse:move', (opt: any) => {
    if (isPanning) {
      canvas.setCursor('grab');
      const e = opt.e as MouseEvent;
      const vpt = canvas.viewportTransform!;
      vpt[4] += e.clientX - lastPosX;
      vpt[5] += e.clientY - lastPosY;
      clampPan(canvas);
      canvas.requestRenderAll();
      lastPosX = e.clientX;
      lastPosY = e.clientY;
    } else {
      if (!isDrawing || !ellipse) return;

      const pointer = canvas.getPointer(opt.e);

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
    }
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
    isPanning = false;
    canvas.selection = true;
    isDrawing = false;
    ellipse = null;
  });
}

interface Point {
  x: number;
  y: number;
}

export const drawPath = (canvas: fabric.Canvas, color: string, strokeWidth: number) => {
  initEvent(canvas);

  let polygonOptions: fabric.IPolylineOptions = {
    fill: "rgba(0,0,255,0)",
    stroke: color,
    strokeWidth: strokeWidth,
    selectable: true,
  }
  let points: Point[] = [];
  let isDrawing = false;
  let polygon: fabric.CustomPolyLine | null = null;
  let startX = 0;
  let startY = 0;
  let lastClickTime = 0;
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on('mouse:down', (opt: any) => {
    const evt = opt.e as MouseEvent;
    if (evt.button === 2) {
      isPanning = true;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      canvas.selection = false;
      canvas.setCursor('grab');
    } else {
      const now = Date.now();
      if (now - lastClickTime < 300) {
        points = points.slice(0, points.length - 1);
        if (polygon) {
          polygon.set({ points: points as fabric.Point[] });
          polygon.setCoords();
          polygon._setPositionDimensions({});
          polygon.dirty = true;
        }
        polygon = null;
        points = [];
        isDrawing = false;
        return;
      }
      lastClickTime = now;
      const target = canvas.findTarget(opt.e, true);
      if (target && !isDrawing) return;

      const pointer = canvas.getPointer(opt.e);
      isDrawing = true;
      startX = pointer.x;
      startY = pointer.y;
      if (points.length === 0) {
        points = [new fabric.Point(startX, startY), new fabric.Point(startX, startY)];
      } else {
        points = [...points, new fabric.Point(startX, startY)];
      }
      if (points.length > 1 && points.length < 3) {
        polygon = new fabric.CustomPolyLine(points, polygonOptions);
        canvas.add(polygon as unknown as fabric.Object);
        canvas.setActiveObject(polygon as unknown as fabric.Object);
      }
      if (polygon) {
        polygon.set({ points: points as fabric.Point[] });
        polygon.setCoords();
        polygon._setPositionDimensions({});
        polygon.dirty = true;
        polygon.updateCustomControls();
      }
    }
  });

  canvas.on('mouse:move', (opt: any) => {
    if (isPanning) {
      canvas.setCursor('grab');
      const e = opt.e as MouseEvent;
      const vpt = canvas.viewportTransform!;
      vpt[4] += e.clientX - lastPosX;
      vpt[5] += e.clientY - lastPosY;
      clampPan(canvas);
      canvas.requestRenderAll();
      lastPosX = e.clientX;
      lastPosY = e.clientY;
    } else {
      if (!isDrawing || !polygon) return;
      const pointer = opt.absolutePointer;
      if (points) {
        points[points.length - 1] = new fabric.Point(pointer.x, pointer.y);
        polygon.set({ points: points as fabric.Point[] });
        polygon.setCoords();
        polygon._setPositionDimensions({});
        polygon.dirty = true;
      }
      canvas.requestRenderAll();
    }
  });

  canvas.on('mouse:up', () => {
    isPanning = false;
    canvas!.selection = true;
  });
}

export const addText = (canvas: fabric.Canvas, color: string, bgColor: RgbaColor) => {
  if (!canvas) return;
  initEvent(canvas);
  pressRightButton(canvas);
  const text = new fabric.IText('Double-click to edit me', {
    left: 150,
    top: 150,
    fontSize: 24,
    fill: color,
    backgroundColor: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
    fontFamily: 'Arial',
    editable: true,
    selectable: true,
  });

  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
}

export const addImage = (canvas: fabric.Canvas, event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !canvas) return;
  initEvent(canvas);
  pressRightButton(canvas);

  const reader = new FileReader();
  reader.onload = function (f) {
    const dataUrl = f.target?.result as string;

    fabric.Image.fromURL(dataUrl, (img) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
        selectable: true,
        hasControls: true,
      });

      canvas!.add(img);
      canvas!.setActiveObject(img);
      canvas!.renderAll();
    });
  };

  reader.readAsDataURL(file);
}

export const initEvent = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = false;
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
}

export const makeBoundingBoxFromPoints = function (points: fabric.Point[]) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
    center: new fabric.Point((minX + maxX) / 2, (minY + maxY) / 2)
  };
};

export const pressRightButton = function (canvas: fabric.Canvas) {
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on('mouse:down', (opt: any) => {
    const evt = opt.e as MouseEvent;
    if (evt.button === 2) {
      isPanning = true;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      canvas!.selection = false;
      canvas.setCursor('grab');
    }
  });
  canvas.on('mouse:move', (opt: any) => {
    if (isPanning) {
      canvas.setCursor('grab');
      const e = opt.e as MouseEvent;
      const vpt = canvas!.viewportTransform!;
      vpt[4] += e.clientX - lastPosX;
      vpt[5] += e.clientY - lastPosY;
      clampPan(canvas);
      canvas!.requestRenderAll();
      lastPosX = e.clientX;
      lastPosY = e.clientY;
    }
  });
  canvas.on('mouse:up', () => {
    isPanning = false;
    canvas!.selection = true;
  });
}

export const clampPan = function (canvas: fabric.Canvas) {
  const vpt = canvas.viewportTransform!;
  const zoom = canvas.getZoom();

  const img = canvas.backgroundImage as fabric.Image;
  const imgWidth = img.width! * img.scaleX! * zoom;
  const imgHeight = img.height! * img.scaleY! * zoom;

  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Calculate bounds
  const minX = Math.min(0, canvasWidth - imgWidth);
  const maxX = 0;
  const minY = Math.min(0, canvasHeight - imgHeight);
  const maxY = 0;

  // Clamp viewport translate values (vpt[4] and vpt[5])
  vpt[4] = Math.max(minX, Math.min(vpt[4], maxX));
  vpt[5] = Math.max(minY, Math.min(vpt[5], maxY));
}
