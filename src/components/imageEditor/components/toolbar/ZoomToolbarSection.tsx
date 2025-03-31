import { ZoomIn, ZoomOut } from 'lucide-react';
import { ZoomToolbarSectionType } from '../../../../types';

export const ZoomToolbarSection = ({ imageUrl, viewMode, onChange }: ZoomToolbarSectionType) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="join">
        <button className="btn btn-ghost btn-sm" title="Zoom In" disabled={!imageUrl} onClick={() => { viewMode === 1 ? onChange(-133.3333282470703) : onChange(1.1) }}>
          <ZoomIn size={20} />
        </button>
        <button className="btn btn-ghost btn-sm" title="Zoom Out" disabled={!imageUrl} onClick={() => { viewMode === 1 ? onChange(133.3333282470703) : onChange(1 / 1.1) }}>
          <ZoomOut size={20} />
        </button>
      </div>
      <div>Zoom</div>
    </div>
  );
}
