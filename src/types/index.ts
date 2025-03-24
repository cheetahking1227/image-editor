export type ImageCanvasProps = {
  image: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  rotation?: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};
