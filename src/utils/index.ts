import { fabric } from "fabric";
import { RgbaColor } from "react-colorful";

export const drawPen = (canvas: fabric.Canvas, color: string, strokeWidth: number,) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = color;
  canvas.freeDrawingBrush.width = strokeWidth;
}

export const drawLine = (canvas: fabric.Canvas, color: string, strokeWidth: number, isArrow = false) => {
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
      stroke: color,
      strokeWidth: strokeWidth,
      selectable: false,
      evented: true,
      hasBorders: false,
      perPixelTargetFind: true,
      isArrow: isArrow
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

export const drawRectangle = (canvas: fabric.Canvas, color: string, bgColor: RgbaColor, strokeWidth: number) => {
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
      fill: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
      stroke: color,
      strokeWidth: strokeWidth,
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

export const drawEllipse = (canvas: fabric.Canvas, color: string, bgColor: RgbaColor, strokeWidth: number) => {
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
      fill: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
      stroke: color,
      strokeWidth: strokeWidth,
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

interface Point {
  x: number;
  y: number;
}

export const drawPath = (canvas: fabric.Canvas, color: string, strokeWidth: number) => {
  let pts: Point[] = [],
    polyShape: any,
    nodeNum = 0,
    nodes: fabric.Circle[] = [],
    polyType: 'Polygon' | 'Polyline' = 'Polyline',
    polyline: any,
    polygon: any,
    lastPt = 1,
    poly = true,
    btn = 'Polyline',
    isDown = false,
    mouse: Point,
    objFill = '',
    objStroke = color || 'white',
    objStrokeWidth = strokeWidth || 2,
    zindex: number,
    redrawAll = false;

  const Props = {
    objectCaching: false,
    hasControls: false,
    hasBorders: true,
    originX: 'center' as const,
    originY: 'center' as const,
    strokeUniform: true,
    borderOpacityWhenMoving: 0,
    cornerColor: 'magenta',
    cornerStyle: 'circle' as const,
    padding: 10,
    borderDashArray: [4, 4],
  };

  canvas.on('mouse:down', (e: any) => {
    const target = canvas.findTarget(e.e, true);

    if ((btn === 'Polyline' || btn === 'Polygon') && poly === true && !target) {
      if (pts.length > 1) {
        pts.splice(-1, 1);
      }
      polyline = new fabric.Polyline(pts, { ...Props, name: 'temp', fill: '', stroke: color || 'white', strokeWidth: strokeWidth || 2 });
      canvas.add(polyline);
      polyline.points[pts.length] = { x: parseInt(mouse.x.toString()), y: parseInt(mouse.y.toString()) };
      lastPt++;
      isDown = true;
    }

    if ((e.target && !isDown && e.target.name === 'poly') || e.target == null) {
      clearNodes();
    }
  });

  canvas.on('mouse:move', (e: any) => {
    mouse = canvas.getPointer(e);
    if (poly && isDown) {
      polyline.points[lastPt - 1] = { x: mouse.x, y: mouse.y };
      canvas.renderAll();
    }
  });

  canvas.on('object:moving', (e: any) => {
    if (e.target && e.target.name === 'node') {
      isDown = false;
      polyShape.points[e.target.nodeNum] = {
        x: e.target.getCenterPoint().x,
        y: e.target.getCenterPoint().y,
      };
    }
  });

  canvas.on('mouse:dblclick', (e) => {
    if (btn === 'Polyline' || btn === 'Polygon') {
      canvas.getObjects().forEach((i) => {
        if (i.name === 'temp') canvas.remove(i);
      });
      objFill = `#${Math.random().toString(16).slice(-6)}`;
      makePolygon(true);
      addNodes(polyShape);
      canvas.add(...nodes);
      info();
    }
    if (e.target && !poly && e.target.name === 'poly') {
      addNodes(e.target);
      canvas.add(...nodes);
      info();
      canvas.discardActiveObject().renderAll();
    }
    canvas.renderAll();
    isDown = false;
    lastPt = 1;
    pts = [];
  });

  canvas.on('object:modified', (e) => {
    if (e.target && !poly && (e.target.name === 'poly' || e.target.name === 'node')) {
      addNodes(polyShape);
      pts = [];
      polyShape.get('points').forEach((_point: any, i: number) => {
        pts[i] = { x: nodes[i].left!, y: nodes[i].top! };
      });
      polyShape.set({ redraw: true });
      objFill = polyShape.fill;
      objStroke = polyShape.stroke;
      objStrokeWidth = polyShape.strokeWidth;
      zindex = canvas.getObjects().indexOf(polyShape);
      makePolygon(true);
      polyShape.moveTo(zindex);
      addNodes(polyShape);
      canvas.add(...nodes);
      info();
    }
  });

  canvas.on('selection:created', () => {
    if (canvas.getActiveObjects().length > 1) {
      redrawAll = true;
      clearNodes();
    }
  });

  canvas.on('selection:cleared', () => {
    if (redrawAll) {
      redrawAll = false;
      redrawAllPolys();
    }
  });

  function clearNodes() {
    nodes.forEach((node) => canvas.remove(node));
  }

  function redrawAllPolys() {
    canvas.getObjects().forEach((obj: any) => {
      if (obj.name === 'poly') {
        addNodes(obj);
        pts = [];
        obj.get('points').forEach((_point: any, i: number) => {
          pts[i] = { x: nodes[i].left!, y: nodes[i].top! };
        });
        obj.set({ redraw: true });
        zindex = canvas.getObjects().indexOf(obj);
        if (obj.pType) polyType = obj.pType;
        objFill = obj.fill;
        objStroke = obj.stroke;
        objStrokeWidth = obj.strokeWidth;
        makePolygon(true);
        obj.moveTo(zindex);
      }
    });
  }

  function makePolygon(val: boolean) {
    if (!val) return;
    canvas.getObjects().forEach((obj: any) => {
      if (obj.redraw && obj.name === 'poly') {
        canvas.setActiveObject(obj);
        canvas.remove(canvas.getActiveObject()!);
      }
    });
    const shapeOptions: fabric.IObjectOptions & { name?: string; redraw?: boolean; pType?: string } = {
      ...Props,
      name: 'poly',
      redraw: false,
      objectCaching: false,
    };

    polyShape = new fabric[polyType](pts, shapeOptions);
    objFill = polyType === 'Polygon' ? objFill : '';
    polyShape.set({
      pType: polyType,
      hasControls: true,
      fill: objFill,
      alphaFill: 1,
      stroke: objStroke,
      strokeWidth: objStrokeWidth,
    });
    canvas.add(polyShape);

    polyShape.on('mousedown', (e: any) => {
      polyShape = e.target;
      polyType = e.target.get('type') === 'polyline' ? 'Polyline' : 'Polygon';
    });
  }

  function addNodes(polyShape: any) {
    clearNodes();
    const matrix = polyShape.calcTransformMatrix();
    nodeNum = 0;
    const transformedpts = polyShape
      .get('points')
      .map((p: Point) => new fabric.Point(p.x - polyShape.pathOffset.x, p.y - polyShape.pathOffset.y))
      .map((p: fabric.Point) => fabric.util.transformPoint(p, matrix));

    nodes = transformedpts.map((p: fabric.Point) => {
      return new fabric.Circle({
        ...Props,
        name: 'node',
        nodeNum: nodeNum++,
        left: p.x,
        top: p.y,
        radius: 8,
        stroke: "rgba(92, 178, 209, 1)",
        fill: 'white',
        hoverCursor: 'pointer',
        selectable: false,
        opacity: 0.8,
      });
    });

    nodes.forEach((node) => {
      node.on('mouseover', () => {
        node.selectable = true;
        node.set('fill', 'white');
        canvas.renderAll();
      });
      node.on('mouseout', () => {
        node.selectable = false;
        node.set('fill', 'white');
        canvas.renderAll();
      });
    });
  }

  function info() {
    // Add info handling here if needed
  }

  function resetToolBar(tool: string) {
    btn = tool;
    // Add toolbar reset logic if needed
  }
}

export const addText = (canvas: fabric.Canvas) => {
  if (!canvas) return;
  initEvent(canvas);
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
  initEvent(canvas);

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
  canvas.isDrawingMode = false;
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
}
