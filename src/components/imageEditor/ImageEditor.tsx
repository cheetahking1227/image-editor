import React, { useState, useRef, useEffect } from "react";
import {
  FolderOpen,
  Undo2,
  MinusCircle,
  PlusCircle,
  Redo2,
  Crop,
  PenLine,
  Slash,
  RectangleHorizontal,
  Circle,
  MoveUpRight,
  Waypoints,
  Type,
  Image as InsertImage,
  SlidersHorizontal,
  Blend,
  Check,
  X,
  RefreshCw,
  Save,
  Sun,
  Contrast,
  Eclipse,
  Pipette,
  Target,
  CircleDashed,
  Droplet,
} from 'lucide-react';
import { fabric } from "fabric";
import ImageCropper from "./components/ImageCropper";
import 'react-image-crop/dist/ReactCrop.css';
import {
  drawPen,
  drawLine,
  drawRectangle,
  drawEllipse,
  drawArrow,
  drawPath,
  addText,
  addImage,
  initEvent,
} from "../../utils";
import { BgImageFinetuneItem } from "../../types";
import { BG_IMAGE_FINETUNE } from "../../Constants";

const annotations = [
  { label: 'Pen', icon: <PenLine size={20} /> },
  { label: 'Line', icon: <Slash size={20} /> },
  { label: 'Rectangle', icon: <RectangleHorizontal size={20} /> },
  { label: 'Ellipse', icon: <Circle size={20} /> },
  { label: 'Arrow', icon: <MoveUpRight size={20} /> },
  { label: 'Path', icon: <Waypoints size={20} /> },
  { label: 'Add Text', icon: <Type size={20} /> },
  { label: 'Add Image', icon: <InsertImage size={20} /> },
];

const ImageEditor: React.FC = () => {

  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const addImageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<number>(1)
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [isSelectedFinetune, setIsSelectedFinetune] = useState<boolean>(false);
  const [finetune, setFinetune] = useState<number>(0);
  const [rangeValue, setRangeValue] = useState<number>(0);
  const [bgImageFinetune, setBgImageFinetune] = useState<BgImageFinetuneItem[]>(BG_IMAGE_FINETUNE);
  const [annotation, setAnnotation] = useState<string>('');

  // const selectedIcon = annotations.find((tool) => tool.label === annotation)?.icon;

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
      });
    }
  }, [viewMode]);

  const drawImage = (url: string, zoom: number = 1, applyFilters: boolean = false) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      if (!img) return;
      const maxWidth = window.innerWidth - 80;  // leave margin
      const maxHeight = (window.innerHeight - 130) * 5 / 6; // leave room for toolbar, etc.

      let targetWidth = img.width;
      let targetHeight = img.height;

      // Scale down to fit screen
      const widthRatio = maxWidth / img.width;
      const heightRatio = maxHeight / img.height;
      const scale = Math.min(widthRatio, heightRatio, 1); // Don’t upscale

      targetWidth = img.width * scale * zoom;
      targetHeight = img.height * scale * zoom;

      // Set canvas size
      canvas.setWidth(targetWidth);
      canvas.setHeight(targetHeight);
      setCanvasWidth(targetWidth);
      setCanvasHeight(targetHeight);

      const fabricImage = new fabric.Image(img)
      fabricImage.scaleToWidth(targetWidth);
      fabricImage.scaleToHeight(targetHeight);
      canvas.backgroundImage = fabricImage;
      canvas.renderAll()
    }
  }
  // Draw image on canvas
  useEffect(() => {
    drawImage(imageUrl || '');
  }, [imageUrl]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    drawImage(imageUrl || '', zoom);
  }, [zoom]);

  const handleBgImageFileOpen = () => {
    bgImageInputRef.current?.click();
  };

  const handleBgImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleImageCropping = () => {
    setIsWorking(true);
    if (viewMode === 1 && fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
      setViewMode(2);
    } else if (viewMode === 2) {
      (window as any).cropperPerformCrop?.(); // trigger actual cropping
    }
  };

  const showCroppedImage = async (croppedDataUrl: string) => {
    setIsWorking(false);
    setImageUrl(croppedDataUrl); // Reload image into fabric.js
    setViewMode(1);
  };

  const handleCancel = () => {
    setViewMode(1);
    setIsWorking(false);
    drawImage(imageUrl || '');
    setIsSelectedFinetune(false);
  };


  const handleImageAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    addImage(fabricCanvasRef.current!, event);
    event.target.value = '';
  }

  const handleAnnotationSelect = (annotation: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    initEvent(canvas);
    switch (annotation) {
      case 'Pen':
        drawPen(canvas);
        break;
      case 'Line':
        drawLine(canvas);
        break;
      case 'Rectangle':
        drawRectangle(canvas);
        break;
      case 'Ellipse':
        drawEllipse(canvas);
        break;
      case 'Arrow':
        drawArrow(canvas);
        break;
      case 'Path':
        drawPath(canvas);
        break;
      default:
        break;
    }
  }

  const handleZoomChange = (value: number) => {
    setZoom(Math.round((zoom + value) * 100) / 100);
  }

  const handleFinetuneChange = (value: number) => {
    setFinetune(value);
  }

  const applyImage = () => {
    const filters: fabric.IBaseFilter[] = [];

    bgImageFinetune.forEach((item, index) => {
      switch (index) {
        case 0:
          filters.push(new fabric.Image.filters.Brightness({ brightness: item.value / 100 }));
          break;
        case 1:
          filters.push(new fabric.Image.filters.Contrast({ contrast: item.value / 100 }));
          break;
        case 2:
          filters.push(new fabric.Image.filters.HueRotation({ rotation: item.value / 100 }));
          break;
        case 3:
          filters.push(new fabric.Image.filters.Saturation({ saturation: item.value / 100 }));
          break;
        case 4:
          filters.push(new fabric.Image.filters.Exposure({ exposure: item.value / 100 }));
          break;
        case 5:
          filters.push(new fabric.Image.filters.Opacity({ opacity: item.value / 100 }));
          break;
        case 6:
          filters.push(new fabric.Image.filters.Blur({ blur: item.value / 100 }));
          break;
        default:
          break;
      }
    })

    const img = new Image();
    img.src = imageUrl!;
    img.onload = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      if (!img) return;
      const fabricImage = new fabric.Image(img)
      // fabricImage.filters = filters;
      fabricImage.applyFilters(filters);
      canvas.backgroundImage = fabricImage;
      canvas.renderAll()
    }
  };

  const handleRangeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(parseInt(e.target.value));
    bgImageFinetune[finetune].value = parseInt(e.target.value);
    applyImage();
  }

  return (
    <div className="relative h-screen px-10 pt-20">
      {/* Toolbar */}
      <div className="relative flex justify-between items-center border p-2">
        <div className="flex">
          <button className="btn btn-ghost btn-sm" title="Open" onClick={handleBgImageFileOpen}>
            <FolderOpen size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Undo">
            <Undo2 size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Redo">
            <Redo2 size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Zoom Out" disabled={zoom === 1 ? true : false} onClick={() => { handleZoomChange(-0.1) }}>
            <MinusCircle size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Zoom In" disabled={zoom === 3 ? true : false} onClick={() => { handleZoomChange(0.1) }}>
            <PlusCircle size={20} />
          </button>
        </div>

        {!isSelectedFinetune
          ? <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" title="Crop and Transform" onClick={handleImageCropping}>
              <Crop size={20} />
            </button>
            <div className="join">
              {
                annotations.map((item, index) => (
                  item.label === 'Add Image'
                    ? <button key={index} className="btn btn-ghost btn-sm" title={item.label} onClick={() => { addImageInputRef.current?.click() }}>
                      {item.icon}
                    </button>
                    : item.label === 'Add Text'
                      ? <button key={index} className="btn btn-ghost btn-sm" title={item.label} onClick={() => { addText(fabricCanvasRef.current!) }}>
                        {item.icon}
                      </button>
                      : <button key={index} className="btn btn-ghost btn-sm" title={item.label} onClick={() => { handleAnnotationSelect(item.label) }}>
                        {item.icon}
                      </button>
                ))
              }
            </div>
            <div className="join">
              <button className="btn btn-ghost btn-sm" title="Finetune" onClick={() => { setIsSelectedFinetune(true) }}>
                <SlidersHorizontal size={20} />
              </button>
              <button className="btn btn-ghost btn-sm" title="Filter">
                <Blend size={20} />
              </button>
            </div>
          </div>
          : <div>
            <button className="btn btn-ghost btn-sm" title="Brightness" onClick={() => { handleFinetuneChange(0) }}>
              <Sun size={20} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Contrast" onClick={() => { handleFinetuneChange(1) }}>
              <Contrast size={20} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Hue" onClick={() => { handleFinetuneChange(2) }}>
              <Eclipse size={20} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Saturation" onClick={() => { handleFinetuneChange(3) }}>
              <Pipette size={20} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Exposure" onClick={() => { handleFinetuneChange(4) }}>
              <Target size={20} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Opacity" onClick={() => { handleFinetuneChange(5) }}>
              <CircleDashed size={20} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Blur" onClick={() => { handleFinetuneChange(6) }}>
              <Droplet size={20} />
            </button>
          </div>
        }
        <div className="flex">
          <button className="btn btn-ghost btn-sm" title="Apply" onClick={handleImageCropping}>
            <Check size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Discard" onClick={handleCancel}>
            <X size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Reset">
            <RefreshCw size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Save">
            <Save size={20} />
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={bgImageInputRef}
          onChange={handleBgImageChange}
          style={{ display: "none" }}
        />
        <input
          type="file"
          accept="image/*"
          ref={addImageInputRef}
          onChange={handleImageAdd}
          style={{ display: "none" }}
        />
        {isSelectedFinetune && (
          <div className="absolute flex top-10 left-0 right-0 z-10 justify-center items-center bg-base-200 border-error mt-2 p-4 shadow-lg gap-4">
            <label className="block text-center">
              {bgImageFinetune[finetune].title}
            </label>
            <input
              type="range"
              min={bgImageFinetune[finetune].min}
              max={bgImageFinetune[finetune].max}
              value={bgImageFinetune[finetune].value}
              className="range range-xs text-white [--range-bg:black] [--range-thumb:blue] [--range-fill:0]"
              onChange={(e) => { handleRangeValueChange(e) }}
              step={10}
            />
            <div className="text-center ml-5">{bgImageFinetune[finetune].value}</div>
          </div>
        )}
      </div>

      {/* Image Editor */}
      <div className="relative flex h-5/6 justify-center items-center border bg-white">
        {
          viewMode === 1
            ? <div className="flex w-full h-full justify-center items-center">
              <canvas
                ref={canvasRef}
                style={{
                  border: "1px solid #f00",
                }}
              />
            </div>
            : <div className="flex w-full h-full justify-center items-center" style={{ width: canvasWidth, height: canvasHeight, }}>
              <ImageCropper imageSrc={(imageUrl) || ''} onCropConfirm={showCroppedImage} />
            </div>
        }
      </div>
    </div>
    // <Paper elevation={3} sx={{ m: 2, overflow: "hidden" }}>
    //   {/* Top Toolbar */}
    //   <Toolbar variant="dense" sx={{ bgcolor: "#f5f5f5" }}>
    //     <IconButton onClick={handleFileOpen}><FolderOpen /></IconButton>
    //     {/* <IconButton><Undo /></IconButton>
    //     <IconButton><Redo /></IconButton>
    //     <IconButton><RemoveCircleOutline /></IconButton>
    //     <IconButton><AddCircleOutline /></IconButton> */}
    //     <Box flexGrow={1} />
    //     <IconButton onClick={handleCrop}><CropIcon /></IconButton>
    //     <FormControl sx={{ m: 1, minWidth: 60 }} size="small">
    //       <Select
    //         labelId="demo-simple-select-standard-label"
    //         id="demo-simple-select-standard"
    //         displayEmpty
    //         value={annotation}
    //         onChange={handleAnnotationChange}
    //         renderValue={() => (
    //           <Box display="flex" alignItems="center">
    //             {selectedIcon}
    //           </Box>
    //         )}
    //       >
    //         {annotations.map((item) => (
    //           item.label === 'Add Image'
    //             ? <MenuItem key={item.label} value={item.label} onClick={() => { addImageInputRef.current?.click() }}>
    //               <ListItemIcon>{item.icon}</ListItemIcon>
    //               <ListItemText>{item.label}</ListItemText>
    //             </MenuItem>
    //             : item.label === 'Add Text'
    //               ? <MenuItem key={item.label} value={item.label} onClick={() => { addText(fabricCanvasRef.current!) }}>
    //                 <ListItemIcon>{item.icon}</ListItemIcon>
    //                 <ListItemText>{item.label}</ListItemText>
    //               </MenuItem>
    //               : <MenuItem key={item.label} value={item.label}>
    //                 <ListItemIcon>{item.icon}</ListItemIcon>
    //                 <ListItemText>{item.label}</ListItemText>
    //               </MenuItem>
    //         ))}
    //         {/* <MenuItem value={'Pen'}><Edit /> Pen</MenuItem>
    //         <MenuItem value={'Line'}>Line</MenuItem>
    //         <MenuItem value={'Rectangle'}><Crop54 /> Rectangle</MenuItem>
    //         <MenuItem value={'Ellipse'}><CircleOutlined /> Ellipse</MenuItem> */}
    //       </Select>
    //     </FormControl>
    //     <Box flexGrow={1} />
    //     {
    //       isWorking && (<>
    //         <IconButton onClick={handleCrop}><Check /></IconButton>
    //         <IconButton onClick={cancelCrop}><Close /></IconButton>
    //       </>)
    //     }
    //     {/* <IconButton><Loop /></IconButton> */}
    //     <IconButton><Save /></IconButton>

    //     {/* Hidden File Input */}
    //     <input
    //       type="file"
    //       accept="image/*"
    //       ref={bgImageInputRef}
    //       onChange={handleFileChange}
    //       style={{ display: "none" }}
    //     />
    //     <input
    //       type="file"
    //       accept="image/*"
    //       ref={addImageInputRef}
    //       onChange={handleImageAdd}
    //       style={{ display: "none" }}
    //     />

    //   </Toolbar>

    //   {/* Canvas Preview Area */}

    //   <div style={{ width: 1880, height: 800 }}>
    //     {
    //       // imageObj !== null
    //       <Box
    //         display="flex"
    //         justifyContent="center"
    //         alignItems="center"
    //         minHeight="80vh"
    //         bgcolor="#fff"
    //       >
    //         {viewMode === 1 ? (
    //           <Box
    //             bgcolor="#fff"
    //             sx={{
    //               width: canvasWidth,
    //               height: canvasHeight,
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //           >
    //             <canvas
    //               ref={canvasRef}
    //               style={{
    //                 border: "1px solid #f00",
    //               }}
    //             />
    //           </Box>
    //         ) : (
    //           <Box
    //             position="relative"
    //             bgcolor="#fff"
    //             border="2px solid #fff"
    //             sx={{
    //               width: canvasWidth,
    //               height: canvasHeight,
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //           >
    //             <ImageCropper imageSrc={(imageUrl) || ''} onCropConfirm={showCroppedImage} />
    //           </Box>
    //         )}
    //       </Box>
    //       // : <></>
    //     }
    //   </div>
    // </Paper>
  );
};

export default ImageEditor;
