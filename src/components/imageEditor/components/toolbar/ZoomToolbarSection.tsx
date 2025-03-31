import { ZoomIn, ZoomOut } from 'lucide-react';

type ZoomToolbarSectionType = {
  imageUrl: string;
  onChange: (zoom: number) => void;
}

export const ZoomToolbarSection = ({ imageUrl, onChange }: ZoomToolbarSectionType) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="join">
        <button className="btn btn-ghost btn-sm" title="Zoom In" disabled={!imageUrl} onClick={() => { onChange(1.1) }}>
          <ZoomIn size={20} />
        </button>
        <button className="btn btn-ghost btn-sm" title="Zoom Out" disabled={!imageUrl} onClick={() => { onChange(1 / 1.1) }}>
          <ZoomOut size={20} />
        </button>
      </div>
      <div>Zoom</div>
    </div>
  );
}
