import {
  Sun,
  Contrast,
  Eclipse,
  Pipette,
  Target,
  CircleDashed,
  Droplet,
} from 'lucide-react';
import { FinetuneToolbarSectionType } from '../../../../types';

const FINETUNES = [
  { label: 'Brightness', icon: <Sun size={20} /> },
  { label: 'Contrast', icon: <Contrast size={20} /> },
  { label: 'Hue', icon: <Target size={20} /> },
  { label: 'Saturation', icon: <Pipette size={20} /> },
  { label: 'Exposure', icon: <Eclipse size={20} /> },
  { label: 'Opacity', icon: <CircleDashed size={20} /> },
  { label: 'Blur', icon: <Droplet size={20} /> },
];

export const FinetuneToolbarSection = ({ finetune, onChangeFinetune }: FinetuneToolbarSectionType) => {
  return (
    <div>
      {FINETUNES.map((item, index) => (
        <button key={index} className={`btn btn-ghost btn-sm ${finetune === index ? 'btn-active' : ''}`} title={item.label} onClick={() => { onChangeFinetune(index) }}>
          {item.icon}
        </button>
      ))}
    </div>
  )
}
