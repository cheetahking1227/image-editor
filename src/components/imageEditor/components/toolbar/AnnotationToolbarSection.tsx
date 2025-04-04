import {
  PenLine,
  Slash,
  RectangleHorizontal,
  Circle,
  MoveUpRight,
  Waypoints,
  Type,
  Image as InsertImage,
  Trash2,
} from 'lucide-react';
import { AnnotationToolbarSectionType } from '../../../../types';

const ANNOTATIONS = [
  { label: 'Pen', icon: <PenLine size={20} /> },
  { label: 'Line', icon: <Slash size={20} /> },
  { label: 'Rectangle', icon: <RectangleHorizontal size={20} /> },
  { label: 'Ellipse', icon: <Circle size={20} /> },
  { label: 'Arrow', icon: <MoveUpRight size={20} /> },
  { label: 'Path', icon: <Waypoints size={20} /> },
  { label: 'Add Text', icon: <Type size={20} /> },
  { label: 'Add Image', icon: <InsertImage size={20} /> },
];

export const AnnotationToolbarSection = ({ annotation, imageUrl, onChangeAnnotation, onDeleteAnnotation }: AnnotationToolbarSectionType) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="join">
        {
          ANNOTATIONS.map((item, index) => (
            item.label === 'Add Image'
              ? <button key={index} className={`btn btn-ghost btn-sm ${item.label === annotation ? 'btn-active' : ''}`} title={item.label} disabled={!imageUrl} onClick={() => { onChangeAnnotation(index) }}>
                {item.icon}
              </button>
              : item.label === 'Add Text'
                ? <button key={index} className={`btn btn-ghost btn-sm ${item.label === annotation ? 'btn-active' : ''}`} title={item.label} disabled={!imageUrl} onClick={() => { onChangeAnnotation(index) }}>
                  {item.icon}
                </button>
                : <button key={index} className={`btn btn-ghost btn-sm ${item.label === annotation ? 'btn-active' : ''}`} title={item.label} disabled={!imageUrl} onClick={() => { onChangeAnnotation(index, item.label) }}>
                  {item.icon}
                </button>
          ))
        }
        <button className={`btn btn-ghost btn-sm`} title='Delete' disabled={!imageUrl} onClick={onDeleteAnnotation}>
          <Trash2 size={20} />
        </button>
      </div>
      <div>Annotation</div>
    </div>
  );
}
