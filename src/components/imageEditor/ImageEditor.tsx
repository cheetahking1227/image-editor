import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Paper, Toolbar } from "@mui/material";
import {
  FolderOpen,
  Undo,
  Redo,
  RemoveCircleOutline,
  AddCircleOutline,
  Crop,
  Edit,
  Check,
  Close,
  Loop,
  Save,
} from "@mui/icons-material";
import * as fabric from "fabric";
import Cropper from "react-easy-crop";

const ImageEditor: React.FC = () => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const linePoints: fabric.Point[] = [];
  const [viewMode, setViewMode] = useState<number>(1)
  const [completedImage, setCompletedImage] = useState<string>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropSize, setCropSize] = useState({ width: 400, height: 300 });
  const [canvasWidth, setCanvasWidth] = useState<number>(1880);
  const [canvasHeight, setCanvasHeight] = useState<number>(800);
  const [isWorking, setIsWorking] = useState<boolean>(false);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
      });
    }
  }, [viewMode]);

  // Load image object when imageUrl changes
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageObj(img);
  }, [imageUrl]);

  // Draw image on canvas
  useEffect(() => {
    if (!imageObj || !fabricCanvasRef.current) return;

    fabricCanvasRef.current.setWidth(imageObj.width);
    fabricCanvasRef.current.setHeight(imageObj.height);
    const fabricImage = new fabric.FabricImage(imageObj)
    fabricCanvasRef.current.backgroundImage = fabricImage;
    fabricCanvasRef.current.renderAll()
    setCanvasWidth(imageObj.width);
    setCanvasHeight(imageObj.height);
  }, [imageObj]);

  const handleFileOpen = () => {
    fileInputRef.current?.click();
  };

  const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<string>  => {
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

  const showCroppedImage = async () => {
  try {
    setIsWorking(false);
    const croppedImg = await getCroppedImg(completedImage!, croppedAreaPixels);
    setImageUrl(croppedImg); // This triggers image reload and canvas redraw
    setViewMode(1); // Back to main canvas view
  } catch (e) {
    console.error(e);
  }
};

  const handleCrop = () => {
    if (fabricCanvasRef.current) {
      setIsWorking(true);
      if (viewMode === 1) {
        const dataURL = fabricCanvasRef.current.toDataURL();
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
        setCompletedImage(dataURL);
        setViewMode(2);
      } else {
        // showCroppedImage();
      }
    }
  }

  const cancelCrop = () => {
    setIsWorking(false);
    if (completedImage) {
      setImageUrl(completedImage); // reload canvas with previous image
      setViewMode(1);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handlePenDraw = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    // canvas.isDrawingMode = true;
    // canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    /////////////////////////////////////////////////////////////////////////////////

  // let isDrawing = false;
  // let ellipse: fabric.Ellipse | null = null;
  // let startX = 0;
  // let startY = 0;

  // fabric.FabricObject.prototype.transparentCorners = false;
  // fabric.FabricObject.prototype.cornerColor = 'blue';
  // fabric.FabricObject.prototype.cornerStyle = 'circle';

  // canvas.on('mouse:down', (opt: any) => {
  //   const pointer = canvas.getScenePoint(opt.e);
  //   const target = canvas.findTarget(opt.e);
  //   if (target) return; // Prevent drawing over existing object

  //   isDrawing = true;
  //   startX = pointer.x;
  //   startY = pointer.y;

  //   ellipse = new fabric.Ellipse({
  //     left: startX,
  //     top: startY,
  //     rx: 1,
  //     ry: 1,
  //     originX: 'center',
  //     originY: 'center',
  //     fill: 'transparent',
  //     stroke: 'lightgreen',
  //     strokeWidth: 4,
  //     selectable: false,
  //     hasControls: false,
  //     objectCaching: false,
  //   });

  //   canvas.add(ellipse);
  // });

  // canvas.on('mouse:move', (opt: any) => {
  //   if (!isDrawing || !ellipse) return;

  //   const pointer = canvas.getScenePoint(opt.e);

  //   const rx = Math.abs(pointer.x - startX) / 2;
  //   const ry = Math.abs(pointer.y - startY) / 2;

  //   const centerX = (pointer.x + startX) / 2;
  //   const centerY = (pointer.y + startY) / 2;

  //   ellipse.set({
  //     rx,
  //     ry,
  //     left: centerX,
  //     top: centerY,
  //   });
  //   canvas.requestRenderAll();
  // });

  // canvas.on('mouse:up', () => {
  //   if (ellipse) {
  //     ellipse.set({
  //       selectable: true,
  //       hasControls: true,
  //       hasRotatingPoint: true,
  //     });

  //     canvas.setActiveObject(ellipse);
  //   }

  //   isDrawing = false;
  //   ellipse = null;
  // });

    ////////////////////////////////////////////////////////////////////////////////////////

    let isDrawing = false;
    let rect: fabric.Rect | null = null;
    let startX = 0;
    let startY = 0;

    // Optional: Default selection style
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

  return (
    <Paper elevation={3} sx={{ m: 2, overflow: "hidden" }}>
      {/* Top Toolbar */}
      <Toolbar variant="dense" sx={{ bgcolor: "#f5f5f5" }}>
        <IconButton onClick={handleFileOpen}><FolderOpen /></IconButton>
        {/* <IconButton><Undo /></IconButton>
        <IconButton><Redo /></IconButton>
        <IconButton><RemoveCircleOutline /></IconButton>
        <IconButton><AddCircleOutline /></IconButton> */}
        <Box flexGrow={1} />
        <IconButton onClick={handleCrop}><Crop /></IconButton>
        <IconButton onClick={handlePenDraw}><Edit /></IconButton>
        <Box flexGrow={1} />
        {
          isWorking
          ? ( <>
              <IconButton onClick={showCroppedImage}><Check /></IconButton>
              <IconButton onClick={cancelCrop}><Close /></IconButton>
            </>)
          : (<></>)
        }
        {/* <IconButton><Loop /></IconButton> */}
        <IconButton><Save /></IconButton>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Toolbar>

      {/* Canvas Preview Area */}

      <div style={{width:1880, height:800}}>
        {
          // imageObj !== null
          viewMode === 1
            ? <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="90vh"
              bgcolor="#fff"
              sx={{ width: canvasWidth, height: canvasHeight, mx: 'auto', my: 'auto' }}
            >
              <canvas
                ref={canvasRef}
                // width={canvasWidth}
                // height={canvasHeight}
                style={{
                  border: "1px solid #ccc",
                }}
              />
            </Box>
            : <Box
              position="relative"
              bgcolor="#fff"
              border="2px solid #fff"
              sx={{ width: canvasWidth, height: canvasHeight, mx: 'auto' }}
            >
              <Cropper
                image={completedImage}
                crop={crop}
                zoom={zoom}
                aspect={undefined}
                cropShape="rect"
                cropSize={{ width: 400, height: 300 }}
                showGrid={true}
                restrictPosition={true}
                minZoom={1}
                maxZoom={3}
                zoomSpeed={0.1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                // onCropChange={(c) => setCrop(c)}
                onCropComplete={(_, croppedPixels) => {
                  setCroppedAreaPixels(croppedPixels);
                }}
              />
            </Box>
          // : <></>
        }
      </div>
    </Paper>
  );
};

export default ImageEditor;
