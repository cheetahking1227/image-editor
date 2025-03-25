import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  FolderOpen,
  Crop as CropIcon,
  BorderColor,
  HorizontalRule,
  CropSquare,
  CircleOutlined,
  ArrowForward,
  Timeline,
  TextFields,
  InsertPhoto,
  Check,
  Close,
  Save,
} from "@mui/icons-material";
import { fabric } from "fabric";
import ImageCropper from "./components/ImageCropper";
import 'react-image-crop/dist/ReactCrop.css';
import {
  drawLine,
  drawRectangle,
  drawEllipse,
  drawPath,
  initEvent,
} from "../../utils";

const annotations = [
  { label: 'Pen', icon: <BorderColor /> },
  { label: 'Line', icon: <HorizontalRule /> },
  { label: 'Rectangle', icon: <CropSquare /> },
  { label: 'Ellipse', icon: <CircleOutlined /> },
  { label: 'Arrow', icon: <ArrowForward /> },
  { label: 'Path', icon: <Timeline /> },
  { label: 'Add Text', icon: <TextFields /> },
  { label: 'Add Image', icon: <InsertPhoto /> },
];

const ImageEditor: React.FC = () => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<number>(1)
  const [canvasWidth, setCanvasWidth] = useState<number>(1880);
  const [canvasHeight, setCanvasHeight] = useState<number>(800);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [annotation, setAnnotation] = useState<string>('Pen');

  const selectedIcon = annotations.find((tool) => tool.label === annotation)?.icon;

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
      });
    }
  }, [viewMode]);

  const drawImage = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      if (!img) return;
      const maxWidth = 1880;  // leave margin
      const maxHeight = 800; // leave room for toolbar, etc.

      let targetWidth = img.width;
      let targetHeight = img.height;

      // Scale down to fit screen
      const widthRatio = maxWidth / img.width;
      const heightRatio = maxHeight / img.height;
      const scale = Math.min(widthRatio, heightRatio, 1); // Don’t upscale

      targetWidth = img.width * scale;
      targetHeight = img.height * scale;

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
    initEvent(canvas);
    switch (annotation) {
      case 'Pen':
        // drawPen(canvas);
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
      case 'Path':
        drawPath(canvas);
        break;
      default:
        break;
    }
  }, [annotation]);

  const handleFileOpen = () => {
    fileInputRef.current?.click();
  };

  const showCroppedImage = async (croppedDataUrl: string) => {
    setIsWorking(false);
    setImageUrl(croppedDataUrl); // Reload image into fabric.js
    setViewMode(1);
  };

  const handleCrop = () => {
    setIsWorking(true);
    if (viewMode === 1 && fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
      setViewMode(2);
    } else if (viewMode === 2) {
      (window as any).cropperPerformCrop?.(); // trigger actual cropping
    }
  };  

  const cancelCrop = () => {
    setViewMode(1);
    setIsWorking(false);
    drawImage(imageUrl || '');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleAnnotationChange = (event: SelectChangeEvent) => {
    setAnnotation(event.target.value)
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
        <IconButton onClick={handleCrop}><CropIcon /></IconButton>
        <FormControl sx={{ m: 1, minWidth: 60 }} size="small">
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            displayEmpty
            value={annotation}
            onChange={handleAnnotationChange}
            renderValue={() => (
              <Box display="flex" alignItems="center">
                {selectedIcon}
              </Box>
            )}
          >
            {annotations.map((item) => (
              <MenuItem key={item.label} value={item.label}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}
            {/* <MenuItem value={'Pen'}><Edit /> Pen</MenuItem>
            <MenuItem value={'Line'}>Line</MenuItem>
            <MenuItem value={'Rectangle'}><Crop54 /> Rectangle</MenuItem>
            <MenuItem value={'Ellipse'}><CircleOutlined /> Ellipse</MenuItem> */}
          </Select>
        </FormControl>
        <Box flexGrow={1} />
        {
          isWorking && (<>
            <IconButton onClick={handleCrop}><Check /></IconButton>
            <IconButton onClick={cancelCrop}><Close /></IconButton>
          </>)
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

      <div style={{ width: 1880, height: 800 }}>
        {
          // imageObj !== null
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
            bgcolor="#fff"
          >
            {viewMode === 1 ? (
              <Box
                bgcolor="#fff"
                sx={{
                  width: canvasWidth,
                  height: canvasHeight,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    border: "1px solid #f00",
                  }}
                />
              </Box>
            ) : (
              <Box
                position="relative"
                bgcolor="#fff"
                border="2px solid #fff"
                sx={{
                  width: canvasWidth,
                  height: canvasHeight,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageCropper imageSrc={(imageUrl) || ''} onCropConfirm={showCroppedImage} />
              </Box>
            )}
          </Box>


          // : <></>
        }
      </div>
    </Paper>
  );
};

export default ImageEditor;
