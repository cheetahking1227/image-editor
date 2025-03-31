import React, { useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import { CropperRef, Cropper, Coordinates } from 'react-advanced-cropper';
import {
  FolderOpen,
  Crop as CropIcon,
  SlidersHorizontal,
  Sparkles,
  Check,
  X,
  FolderInput,
  Save,
} from 'lucide-react';
import { RgbaColor } from "react-colorful";
import {
  AnnotationToolbarSection,
  FinetuneToolbarSection,
  ZoomToolbarSection,
  ColorAndStrokeSettings,
  FilterSettings,
  FinetuneSettings,
} from "./components/toolbar";
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
import { BG_IMAGE_FINETUNE } from "../../constants";
import { BgImageFinetuneItem } from "../../types";
import 'react-advanced-cropper/dist/style.css'
import 'react-advanced-cropper/dist/themes/bubble.css';
import { getImage, saveImage } from "../../actions";

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
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.on('mouse:wheel', (opt) => {
          const delta = opt.e.deltaY;
          let zoom = fabricCanvasRef.current!.getZoom();
          zoom *= 0.999 ** delta;
          zoom = Math.max(1, Math.min(zoom, 3));
          const center = new fabric.Point(fabricCanvasRef.current!.getWidth() / 2, fabricCanvasRef.current!.getHeight() / 2);
          fabricCanvasRef.current!.zoomToPoint(center, zoom);
          opt.e.preventDefault();
          opt.e.stopPropagation();
        });
      }
      fabricCanvasRef.current.setWidth(800);
      fabricCanvasRef.current.setHeight(600);
    }
  }, [viewMode]);

  useEffect(() => {
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
  }, [annotation, color, bgColor, strokeWidth]);

  useEffect(() => {
    drawImage(imageUrl || '');
  }, [imageUrl, croppedImageUrl]);

  useEffect(() => {
    drawImage(imageUrl || '', false);
  }, [filter])

  useEffect(() => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      const activeObject = canvas.getActiveObject();
      switch (activeObject?.type) {
        case 'customPolyLine':
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
        case 'path':
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string); // base64 string
        setCroppedImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleAnnotationSelect = (value: string) => {
    setAnnotation(value);
  }

  const handleFinetuneChange = (value: number) => {
    setFinetune(value);
  }

  const handleRangeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(parseInt(e.target.value));
    bgImageFinetune[finetune].value = parseInt(e.target.value);
    drawImage(imageUrl || '', false);
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
  }

  const handleColorChange = (color: string) => {
    setColor(color);
  }

  const handleWidthChange = (width: number) => {
    setStrokeWidth(width);
  }

  const handleBgColorChange = (bgColor: RgbaColor) => {
    setBgColor(bgColor);
  }

  const handleFilterChange = (value: string) => {
    setFilter(value);
  }

  const handleZoomChange = (zoomFactor: number) => {
    if (viewMode === 2) {
      cropperRef.current?.zoomImage(zoomFactor)
    } else {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** zoomFactor;
        zoom = Math.max(1, Math.min(zoom, 3));
        const center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
        canvas.zoomToPoint(center, zoom);
        canvas.requestRenderAll();
      }
    }
  }

  const handleGetImage = () => {
    const data = getImage();
    const img = new Image();
    img.src = data.imageUrl;
    img.onload = () => {
      if (!img) return;
      const maxWidth = window.innerWidth - 80;
      const maxHeight = (window.innerHeight - 130) * 5 / 6;
      const widthRatio = maxWidth / img.width;
      const heightRatio = maxHeight / img.height;
      const scale = Math.min(widthRatio, heightRatio, 1);
      let originWidth = img.width * scale;
      let originHeight = img.height * scale;
      setOriginImageWidth(originWidth);
      setOriginImageHeight(originHeight);
    }
    setCoordinates(data.coordinate);
    fabric.util.enlivenObjects(
      data.data,
      (enlivenedObjects: fabric.Object[]) => {
        setCanvasObjects(enlivenedObjects);
      },
      'fabric' // ✅ This is the expected string
    );
    setImageUrl(data.imageUrl);
    setCroppedImageUrl(data.imageUrl);
  }

  const handleSaveImage = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const canvasObjs = canvas?.getObjects();
      if (coordinates) {
        canvasObjs.forEach((obj) => {
          obj.top = obj.top + coordinates.top;
          obj.left = obj.left + coordinates.left;
        });
      }
      const data = {
        imageUrl: imageUrl,
        data: canvasObjs,
        coordinate: coordinates
      };
      saveImage(data);
    }
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
            <ZoomToolbarSection
              imageUrl={imageUrl || ''}
              viewMode={viewMode}
              onChange={handleZoomChange}
            />
            <div className="divider divider-horizontal"></div>
            <AnnotationToolbarSection
              annotation={annotation}
              imageUrl={imageUrl || ''}
              onChangeAnnotation={handleAnnotationClick}
            />
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
          : <FinetuneToolbarSection
            finetune={finetune}
            onChangeFinetune={handleFinetuneChange}
          />
        }
        <div className="flex">
          <button className="btn btn-ghost btn-sm" title="Apply" onClick={showCroppedImage}>
            <Check size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Discard" onClick={handleCancel}>
            <X size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Get Image" onClick={handleGetImage}>
            <FolderInput size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" title="Save" onClick={handleSaveImage}>
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
                onColorChange={handleColorChange}
                onWidthChange={handleWidthChange}
                onBgColorChange={handleBgColorChange}
              />
              : <FilterSettings
                imageUrl={croppedImageUrl || ''}
                onFilterChange={handleFilterChange}
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
                  border: "1px solid #fff",
                  width: 800,
                  height: 600,
                }}
              />
            </div>
            : <div className="flex w-full h-full justify-center items-center" style={{ width: originImageWidth, height: originImageHeight, }}>
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
