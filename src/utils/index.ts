import { fabric } from "fabric";

export const drawPen = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
}

export const drawLine = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = false;
  let isDrawing = false;
  let line: fabric.CustomLine | null = null;
  let startX = 0;
  let startY = 0;

  canvas.on('mouse:down', (opt: any) => {
    const target = canvas.findTarget(opt.e, true);
    if (target) return; // Prevent drawing over existing object

    const pointer = canvas.getPointer(opt.e);
    isDrawing = true;
    startX = pointer.x;
    startY = pointer.y;

    const linePoint = [new fabric.Point(startX, startY), new fabric.Point(startX, startY)];
    line = new fabric.CustomLine(linePoint, {
      stroke: 'white',
      strokeWidth: 2,
      selectable: false,
      evented: true,
      hasBorders: false,
      perPixelTargetFind: true,
    });
    canvas.add(line);
  });

  canvas.on('mouse:move', (opt: any) => {
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
    canvas.renderAll();
  });

  canvas.on('mouse:up', () => {
    if (line) {
      line.set({
        selectable: true,
        evented: true,
      });

      canvas.setActiveObject(line);
    }

    isDrawing = false;
    line = null;
  });
}

export const drawRectangle = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = false;
  let isDrawing = false;
  let rect: fabric.Rect | null = null;
  let startX = 0;
  let startY = 0;

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'white';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.cornerStrokeColor = 'rgba(92, 178, 209, 1)';
  fabric.Object.prototype.cornerSize = 16;

  canvas.on('mouse:down', (opt: any) => {
    const target = canvas.findTarget(opt.e, true);
    if (target) return; // Prevent drawing over existing object

    const pointer = canvas.getPointer(opt.e);
    isDrawing = true;

    // const target = canvas.findTarget(opt.e);
    // if (target) return;

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

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'white';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.cornerStrokeColor = 'rgba(92, 178, 209, 1)';
  fabric.Object.prototype.cornerSize = 16;

  canvas.on('mouse:down', (opt: any) => {
    const target = canvas.findTarget(opt.e, true);
    if (target) return; // Prevent drawing over existing object

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
  canvas.isDrawingMode = false;

  let isDrawing = false;
  let arrowLine: fabric.CustomLine | null = null;
  let arrowHead: fabric.Triangle | null = null;
  let arrowGroup: fabric.Group | null = null;
  let startX = 0;
  let startY = 0;

  canvas.on('mouse:down', (opt: any) => {
    const target = canvas.findTarget(opt.e, true);
    if (target) return;

    const pointer = canvas.getPointer(opt.e);
    isDrawing = true;
    startX = pointer.x;
    startY = pointer.y;

    // Create line
    const linePoint = [new fabric.Point(startX, startY), new fabric.Point(startX, startY)];
    arrowLine = new fabric.CustomLine(linePoint, {
      stroke: 'white',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });

    // Create arrowhead (triangle)
    arrowHead = new fabric.Triangle({
      width: 10,
      height: 12,
      fill: 'white',
      left: startX,
      top: startY,
      originX: 'center',
      originY: 'center',
      angle: 0,
      selectable: false,
      evented: false,
    });

    // Group line and arrowhead
    arrowGroup = new fabric.Group([arrowLine, arrowHead], {
      left: 0,
      top: 0,
      selectable: false,
      evented: true,
      hasBorders: false,
      hasControls: false,
      objectCaching: false,
    });

    canvas.add(arrowGroup);
  });

  canvas.on('mouse:move', (opt: any) => {
    if (!isDrawing || !arrowLine || !arrowHead || !arrowGroup) return;

    const pointer = opt.absolutePointer;
    const linePoint = arrowLine.points;
    if (linePoint) {
      linePoint[1] = new fabric.Point(pointer.x, pointer.y);
      arrowLine.set({ points: linePoint });
      arrowLine.setCoords();
      arrowLine._setPositionDimensions({});
      arrowLine.dirty = true;
    }
    // const pointer = opt.absolutePointer;
    // const x2 = pointer.x;
    // const y2 = pointer.y;

    // Update line
    // arrowLine.set({ x2, y2 });

    // Calculate angle for triangle
    const dx = pointer.x - startX;
    const dy = pointer.y - startY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Update triangle position and rotation
    arrowHead.set({
      left: pointer.x,
      top: pointer.y,
      angle: angle + 90,
    });

    // Recalculate group bounds
    // arrowGroup._calcBounds();
    arrowGroup.setCoords();
    console.log(`arrow group`, arrowGroup);
    console.log(`line`, arrowLine)
    canvas.renderAll();
  });

  canvas.on('mouse:up', () => {
    if (arrowGroup) {
      arrowGroup.set({
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
      });
      canvas.setActiveObject(arrowGroup);
    }

    isDrawing = false;
    arrowLine = null;
    arrowHead = null;
    arrowGroup = null;
  });

}

export const drawPath = (canvas: fabric.Canvas) => {
  // Match your existing styles
  canvas.isDrawingMode = false;
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'white';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.cornerStrokeColor = 'rgba(92, 178, 209, 1)';
  fabric.Object.prototype.cornerSize = 16;

  let isDrawing = false;
  let points: fabric.Point[] = [];
  let livePolyline: fabric.Polyline | null = null;
  let previewLine: fabric.CustomLine | null = null;

  const finishPolyline = () => {
    if (!isDrawing || points.length < 2) return;

    if (previewLine) {
      canvas.remove(previewLine);
      previewLine = null;
    }

    if (livePolyline) {
      livePolyline.set({
        selectable: true,
        hasControls: true,
        hasBorders: true,
        evented: true,
      });
      // canvas.setActiveObject(livePolyline);
      livePolyline = null;
    }

    isDrawing = false;
    points = [];
    canvas.requestRenderAll();
  };

  canvas.on('mouse:down', (opt: any) => {
    const target = canvas.findTarget(opt.e, true);
    if (target) return;

    const pointer = canvas.getPointer(opt.e);

    if (!isDrawing) {
      isDrawing = true;
      points.push(new fabric.Point(pointer.x, pointer.y));
      livePolyline = new fabric.Polyline(points, {
        stroke: 'white',
        strokeWidth: 2,
        fill: 'rgba(255,255,255,0.05)',
        selectable: false,
        evented: false,
        objectCaching: false,
      });

      canvas.add(livePolyline);
    } else {
      points.push(new fabric.Point(pointer.x, pointer.y));
      if (livePolyline) {
        livePolyline.set({ points });
        canvas.requestRenderAll();
      }
    }
  });

  canvas.on('mouse:move', (opt: any) => {
    if (!isDrawing || points.length === 0) return;

    const pointer = canvas.getPointer(opt.e);
    const last = points[points.length - 1];

    if (previewLine) canvas.remove(previewLine);

    previewLine = new fabric.CustomLine([new fabric.Point(last.x, last.y), new fabric.Point(pointer.x, pointer.y)], {
      stroke: 'white',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    canvas.setActiveObject(previewLine);

    canvas.add(previewLine);
    canvas.requestRenderAll();
  });

  const upperCanvasEl = (canvas as any).upperCanvasEl as HTMLCanvasElement;
  upperCanvasEl.addEventListener('dblclick', finishPolyline);
}

export const addText = (canvas: fabric.Canvas) => {
  if (!canvas) return;

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'white';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.cornerStrokeColor = 'rgba(92, 178, 209, 1)';
  fabric.Object.prototype.cornerSize = 16;

  const text = new fabric.IText('Double-click to edit me', {
    left: 150,
    top: 150,
    fontSize: 24,
    fill: '#FFF',
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

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'white';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.cornerStrokeColor = 'rgba(92, 178, 209, 1)';
  fabric.Object.prototype.cornerSize = 16;

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
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
}

export const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No 2D context");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.onerror = reject;
  });
}
