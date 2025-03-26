import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../../../styles/CropStyles.css';

function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: Crop
) {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx || !crop.width || !crop.height) return;

  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );
}
type ImageCropperProps = {
  imageSrc: string;
  onCropConfirm: (croppedDataUrl: string) => void;
};

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropConfirm,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = (img: HTMLImageElement) => {
    imgRef.current = img;
    const crop: Crop = {
      unit: 'px',
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    };
    setCrop(crop);
  };

  const performCrop = useCallback(() => {
    if (
      imgRef.current &&
      completedCrop &&
      previewCanvasRef.current
    ) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      const dataUrl = previewCanvasRef.current.toDataURL('image/png');
      onCropConfirm(dataUrl);
    }
  }, [completedCrop, onCropConfirm]);

  useEffect(() => {
    (window as any).cropperPerformCrop = performCrop;
  }, [performCrop]);

  return (
    <div style={{ padding: '1rem' }}>
      {imageSrc && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            keepSelection
          >
            <img
              src={imageSrc}
              alt="Source"
              onLoad={(e) => onImageLoad(e.currentTarget)}
              style={{ maxWidth: '100%' }}
            />
          </ReactCrop>

          {/* Hidden canvas for preview + export */}
          <canvas
            ref={previewCanvasRef}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
