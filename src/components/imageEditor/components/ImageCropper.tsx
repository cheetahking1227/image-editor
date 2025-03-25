import React, { useRef, useState, useEffect } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
} from 'react-image-crop';
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
};

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = (img: HTMLImageElement) => {
    imgRef.current = img;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        16 / 9,
        img.width,
        img.height
      ),
      img.width,
      img.height
    );
    setCrop(crop);
  };

  const downloadCroppedImage = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'cropped-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    if (
      imgRef.current &&
      completedCrop &&
      previewCanvasRef.current
    ) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  return (
    <div style={{ padding: '1rem' }}>
      {imageSrc && (
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={16 / 9}

            keepSelection
          >
            <img
              src={imageSrc}
              alt="Source"
              onLoad={(e) => onImageLoad(e.currentTarget)}
              style={{ maxWidth: '100%' }}
            />
          </ReactCrop>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
