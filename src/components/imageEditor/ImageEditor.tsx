import React, { useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import { CropperRef, Cropper, Coordinates } from 'react-advanced-cropper';
import {
  FolderOpen,
  ZoomIn,
  ZoomOut,
  Crop as CropIcon,
  PenLine,
  Slash,
  RectangleHorizontal,
  Circle,
  MoveUpRight,
  Waypoints,
  Type,
  Image as InsertImage,
  SlidersHorizontal,
  Sparkles,
  Check,
  X,
  Sun,
  Contrast,
  Eclipse,
  Pipette,
  Target,
  CircleDashed,
  Droplet,
} from 'lucide-react';
import { RgbaColor } from "react-colorful";
import {
  drawPen,
  drawLine,
  drawRectangle,
  drawEllipse,
  drawPath,
  addText,
  addImage,
  initEvent,
} from "../../utils";
import { BgImageFinetuneItem } from "../../types";
import { BG_IMAGE_FINETUNE } from "../../Constants";
import ColorAndStrokeSettings from "./components/ColorAndStrokeSettings";
import FilterSettings from "./components/FilterSettings";
import FinetuneSettings from "./components/FinetuneSettings";
import 'react-advanced-cropper/dist/style.css'
import 'react-advanced-cropper/dist/themes/bubble.css';

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

const Finetunes = [
  { label: 'Brightness', icon: <Sun size={20} /> },
  { label: 'Contrast', icon: <Contrast size={20} /> },
  { label: 'Hue', icon: <Target size={20} /> },
  { label: 'Saturation', icon: <Pipette size={20} /> },
  { label: 'Exposure', icon: <Eclipse size={20} /> },
  { label: 'Opacity', icon: <CircleDashed size={20} /> },
  { label: 'Blur', icon: <Droplet size={20} /> },
];

const ImageEditor: React.FC = () => {
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const addImageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const cropperRef = useRef<CropperRef>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>();
  const [canvasImageUrl, setCanvasImageUrl] = useState<string>();
  const [canvasObjects, setCanvasObjects] = useState<fabric.Object[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [viewMode, setViewMode] = useState<number>(1)
  const [originImageWidth, setOriginImageWidth] = useState<number>(0);
  const [originImageHeight, setOriginImageHeight] = useState<number>(0);
  const [isCropWorking, setIsCropWorking] = useState<boolean>(false);
  const [isSelectedFinetune, setIsSelectedFinetune] = useState<boolean>(false);
  const [finetune, setFinetune] = useState<number>(0);
  const [rangeValue, setRangeValue] = useState<number>(0);
  const [bgImageFinetune, setBgImageFinetune] = useState<BgImageFinetuneItem[]>(BG_IMAGE_FINETUNE);
  const [isSelectedAnnotation, setIsSelectedAnnotation] = useState<number>(9);
  const [color, setColor] = useState<string>('#FFF');
  const [bgColor, setBgColor] = useState<RgbaColor>({ "r": 0, "g": 0, "b": 0, "a": 0 });
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [annotation, setAnnotation] = useState<string>('');
  const [isSelectedFilter, setIsSelectedFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current.setWidth(800);
      fabricCanvasRef.current.setHeight(600);

    }
  }, [viewMode]);

  useEffect(() => {
    handleAnnotatinoRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotation, color, bgColor, strokeWidth]);

  useEffect(() => {
    drawImage(imageUrl || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, croppedImageUrl, filter,]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      const activeObject = canvas.getActiveObject();
      switch (activeObject?.type) {
        case 'path':
          activeObject.set({
            stroke: color,
            strokeWidth: strokeWidth
          });
          break;
        case 'customLine':
          activeObject.set({
            stroke: color,
            strokeWidth: strokeWidth
          });
          break;
        case 'polyline':
          activeObject.set({
            stroke: color,
            strokeWidth: strokeWidth
          });
          break;
        case 'rect':
          activeObject.set({
            fill: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
            stroke: color,
            strokeWidth: strokeWidth,
          });
          break;
        case 'ellipse':
          activeObject.set({
            fill: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
            stroke: color,
            strokeWidth: strokeWidth,
          });
          break;
        case 'i-text':
          activeObject.set({
            backgroundColor: `rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`,
            fill: color,
          });
          break;
        default:
          break;
      }
      activeObject?.setCoords();
      canvas.requestRenderAll();
    }
  }, [color, bgColor, strokeWidth]);

  const drawImage = (url: string, isCrop = true, mode = 2) => {
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

    if (filter === 'Grayscale') {
      filters.push(new fabric.Image.filters.Grayscale());
    } else if (filter === 'Invert') {
      filters.push(new fabric.Image.filters.Invert());
    }

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      if (!img) return;
      const maxWidth = window.innerWidth - 80;
      const maxHeight = (window.innerHeight - 130) * 5 / 6;
      // Scale down to fit screen
      const widthRatio = maxWidth / img.width;
      const heightRatio = maxHeight / img.height;
      const scale = Math.min(widthRatio, heightRatio, 1); // Don’t upscale

      let targetWidth = img.width * scale;
      let targetHeight = img.height * scale;

      // Set canvas size
      canvas.setWidth(targetWidth);
      canvas.setHeight(targetHeight);

      const fabricImage = new fabric.Image(img)
      fabricImage.scaleToWidth(targetWidth);
      fabricImage.scaleToHeight(targetHeight);
      fabricImage.applyFilters(filters);

      canvas.backgroundImage = fabricImage;
      if (coordinates && canvasObjects) {
        if (isCrop && mode == 2) {
          canvasObjects.forEach((obj) => {
            obj.top = obj.top - coordinates.top;
            obj.left = obj.left - coordinates.left;
            canvas.add(obj)
          });
        }
        if (canvas.backgroundImage) {
          canvas.backgroundImage.top = canvas.backgroundImage.top - coordinates.top;
          canvas.backgroundImage.left = canvas.backgroundImage.left - coordinates.left;
        }
        canvas.setWidth(coordinates.width);
        canvas.setHeight(coordinates.height);
      }
      canvas.requestRenderAll()
    }
  }

  const handleBgImageFileOpen = () => {
    bgImageInputRef.current?.click();
  };

  const handleBgImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (!img) return;
        const maxWidth = window.innerWidth - 80;
        const maxHeight = (window.innerHeight - 130) * 5 / 6;
        // Scale down to fit screen
        const widthRatio = maxWidth / img.width;
        const heightRatio = maxHeight / img.height;
        const scale = Math.min(widthRatio, heightRatio, 1); // Don’t upscale

        let originWidth = img.width * scale;
        let originHeight = img.height * scale;
        setOriginImageWidth(originWidth);
        setOriginImageHeight(originHeight);
      }
      setImageUrl(url);
      setCroppedImageUrl(url);
    }
  };

  const handleImageCropping = () => {
    setIsCropWorking(true);
    if (viewMode === 1 && fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      let objects = canvas.getObjects();
      if (coordinates) {
        objects.forEach((obj) => {
          obj.top = obj.top + coordinates.top;
          obj.left = obj.left + coordinates.left;
        });
        if (canvas.backgroundImage && typeof canvas.backgroundImage !== 'string') {
          canvas.backgroundImage.top = canvas.backgroundImage.top + coordinates.top;
          canvas.backgroundImage.left = canvas.backgroundImage.left + coordinates.left;
        }
        canvas.setWidth(originImageWidth);
        canvas.setHeight(originImageHeight);
      }
      canvas.requestRenderAll();
      setCanvasImageUrl(canvas.toDataURL({
        format: 'png',
        quality: 1.0
      }))
      setCanvasObjects(objects);
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
      setIsSelectedFinetune(false);
      setIsSelectedAnnotation(9);
      setIsSelectedFilter(false);
      setViewMode(2);
    } else if (viewMode === 2) {
    }
  };

  const showCroppedImage = () => {
    if (cropperRef.current) {
      setIsCropWorking(false);
      setViewMode(1);
      setCoordinates(cropperRef.current.getCoordinates()!);
      setCroppedImageUrl(cropperRef.current.getCanvas()?.toDataURL())
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    drawImage(imageUrl || '', true, viewMode);
    setViewMode(1);
    setIsCropWorking(false);
    setIsSelectedFinetune(false);
    setIsSelectedAnnotation(9);
    setAnnotation('');
    setIsSelectedFilter(false);
  };


  const handleImageAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    addImage(fabricCanvasRef.current!, event);
    event.target.value = '';
  }

  const handleAnnotatinoRefresh = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    initEvent(canvas);
    switch (annotation) {
      case 'Pen':
        drawPen(canvas, color, strokeWidth);
        break;
      case 'Line':
        drawLine(canvas, color, strokeWidth);
        break;
      case 'Rectangle':
        drawRectangle(canvas, color, bgColor, strokeWidth);
        break;
      case 'Ellipse':
        drawEllipse(canvas, color, bgColor, strokeWidth);
        break;
      case 'Arrow':
        drawLine(canvas, color, strokeWidth, true);
        break;
      case 'Path':
        drawPath(canvas, color, strokeWidth);
        break;
      default:
        break;
    }
  }

  const handleAnnotationSelect = (value: string) => {
    setAnnotation(value);
  }

  const handleFinetuneChange = (value: number) => {
    setFinetune(value);
  }

  const applyImage = () => {
    drawImage(imageUrl || '', false)
  };

  const handleRangeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(parseInt(e.target.value));
    bgImageFinetune[finetune].value = parseInt(e.target.value);
    applyImage();
  }

  const handleAnnotationClick = (index: number, label?: string) => {
    setIsSelectedAnnotation(index);
    setViewMode(1);
    setIsCropWorking(false);
    setIsSelectedFilter(false);
    drawImage(imageUrl || '', false);
    if (index === 7) {
      setAnnotation('');
      addImageInputRef.current?.click();
    } else if (index === 6) {
      setAnnotation('');
      addText(fabricCanvasRef.current!, color, bgColor);
    } else {
      handleAnnotationSelect(label!);
    }
  }

  const handleFinetuneClick = () => {
    setIsSelectedFinetune(true);
    setViewMode(1);
    setIsCropWorking(false);
    drawImage(imageUrl || '', false);
  }

  const handleFilterClick = () => {
    setIsSelectedFilter(true);
    setViewMode(1);
    setIsCropWorking(false);
    drawImage(imageUrl || '', false);
  }

  const onColorChange = (color: string) => {
    setColor(color);
  }

  const onWidthChange = (width: number) => {
    setStrokeWidth(width);
  }

  const onBgColorChange = (bgColor: RgbaColor) => {
    setBgColor(bgColor);
  }

  const onFilterChange = (value: string) => {
    setFilter(value);
  }

  return (
    <div className="relative h-screen px-10 pt-20">
      {/* Toolbar */}
      <div className="relative flex justify-between items-center border p-4">
        <div className="flex">
          <button className="btn btn-ghost btn-sm" title="Open" onClick={handleBgImageFileOpen}>
            <FolderOpen size={20} />
          </button>
        </div>
        {!isSelectedFinetune
          ? <div className="flex gap-2">
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="join">
                <button className="btn btn-ghost btn-sm" title="Zoom In" disabled={!imageUrl} onClick={() => { cropperRef.current?.zoomImage(1.1) }}>
                  <ZoomIn size={20} />
                </button>
                <button className="btn btn-ghost btn-sm" title="Zoom Out" disabled={!imageUrl} onClick={() => { cropperRef.current?.zoomImage(1 / 1.1) }}>
                  <ZoomOut size={20} />
                </button>
              </div>
              <div>Zoom</div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="join">
                {
                  annotations.map((item, index) => (
                    item.label === 'Add Image'
                      ? <button key={index} className={`btn btn-ghost btn-sm ${item.label === annotation ? 'btn-active' : ''}`} title={item.label} disabled={!imageUrl} onClick={() => { handleAnnotationClick(index) }}>
                        {item.icon}
                      </button>
                      : item.label === 'Add Text'
                        ? <button key={index} className={`btn btn-ghost btn-sm ${item.label === annotation ? 'btn-active' : ''}`} title={item.label} disabled={!imageUrl} onClick={() => { handleAnnotationClick(index) }}>
                          {item.icon}
                        </button>
                        : <button key={index} className={`btn btn-ghost btn-sm ${item.label === annotation ? 'btn-active' : ''}`} title={item.label} disabled={!imageUrl} onClick={() => { handleAnnotationClick(index, item.label) }}>
                          {item.icon}
                        </button>
                  ))
                }
              </div>
              <div>Annotation</div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex flex-col justify-center items-center gap-2">

              <div className="join">
                <button className={`btn btn-ghost btn-sm ${isCropWorking ? 'btn-active' : ''}`} title="Crop and Transform" disabled={!imageUrl} onClick={handleImageCropping}>
                  <CropIcon size={20} />
                </button>
                <button className="btn btn-ghost btn-sm" title="Finetune" disabled={!imageUrl} onClick={() => { handleFinetuneClick() }}>
                  <SlidersHorizontal size={20} />
                </button>
                <button className={`btn btn-ghost btn-sm ${isSelectedFilter ? 'btn-active' : ''}`} title="Filter" disabled={!imageUrl} onClick={() => { handleFilterClick() }}>
                  <Sparkles size={20} />
                </button>
              </div>
              <div>Image Format</div>
            </div>
          </div>
          : <div>
            {Finetunes.map((item, index) => (
              <button key={index} className={`btn btn-ghost btn-sm ${finetune === index ? 'btn-active' : ''}`} title={item.label} onClick={() => { handleFinetuneChange(index) }}>
                {item.icon}
              </button>
            ))}
          </div>
        }
        <div className="flex">
          <button className="btn btn-ghost btn-sm" title="Apply" onClick={showCroppedImage}>
            <Check size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Discard" onClick={handleCancel}>
            <X size={20} />
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
        {(isSelectedFinetune || isSelectedAnnotation < 9 || isSelectedFilter) && (
          isSelectedFinetune
            ? <FinetuneSettings
              finetune={finetune}
              bgImageFinetune={bgImageFinetune}
              handleRangeValueChange={handleRangeValueChange}
            />
            : !isSelectedFilter
              ? <ColorAndStrokeSettings
                color={color}
                width={strokeWidth}
                bgColor={bgColor}
                onColorChange={onColorChange}
                onWidthChange={onWidthChange}
                onBgColorChange={onBgColorChange}
              />
              : <FilterSettings
                imageUrl={croppedImageUrl || ''}
                filter={filter}
                onFilterChange={onFilterChange}
              />
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
                  width: 800,
                  height: 600,
                }}
              />
            </div>
            : <div className="flex w-full h-full justify-center items-center" style={{ width: originImageWidth, height: originImageHeight, }}>
              {/* <ImageCropper imageSrc={(imageUrl) || ''} onCropConfirm={showCroppedImage} restoredCrop={restoredCrop!} setRestoredCrop={setRestoredCrop} zoom={zoom} /> */}
              <Cropper
                ref={cropperRef}
                className={'cropper'}
                src={canvasImageUrl}
                defaultCoordinates={coordinates}
                stencilProps={{
                  grid: true
                }}
              />
            </div>
        }
      </div>
    </div>
  );
};

export default ImageEditor;
