import { useState } from "react";
import { HexColorPicker, RgbaColorPicker, RgbaColor } from "react-colorful";
import { PaintBucket, Highlighter } from "lucide-react";

type ColorAndStrokeSettingsType = {
  color: string;
  width: number;
  bgColor?: RgbaColor;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  onBgColorChange?: (color: RgbaColor) => void;
}

export default function ColorAndStrokeSettings({ color, width, onColorChange, onWidthChange, bgColor, onBgColorChange }: ColorAndStrokeSettingsType) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);

  return (
    <div className="absolute flex top-10 left-0 right-0 z-10 justify-center items-center bg-base-200 border-error mt-2 p-4 shadow-lg gap-4">
      {/* Color Picker */}
      <div className="relative">
        <button onClick={() => setBgPickerOpen(!bgPickerOpen)} className="btn btn-small">
          <div style={{
            borderWidth: 10,
            borderStyle: 'solid',
            borderColor: `rgba(${bgColor!.r},${bgColor!.g},${bgColor!.b},${bgColor!.a})`
          }}>
          </div>
          <PaintBucket size={20} />
        </button>
        {bgPickerOpen && (
          <div className="absolute z-10 mt-2 bg-base-100 p-2 rounded-box shadow">
            <RgbaColorPicker color={bgColor} onChange={onBgColorChange!} />
            <div className="text-sm text-center mt-1">{color}</div>
          </div>
        )}
      </div>

      <div className="relative">
        <button onClick={() => setPickerOpen(!pickerOpen)} className="btn btn-small">
          <div style={{
            borderWidth: 10,
            borderStyle: 'solid',
            borderColor: color
          }}>
          </div>
          <Highlighter size={20} />
        </button>
        {pickerOpen && (
          <div className="absolute z-10 mt-2 bg-base-100 p-2 rounded-box shadow">
            <HexColorPicker color={color} onChange={onColorChange} />
            <div className="text-sm text-center mt-1">{color}</div>
          </div>
        )}
      </div>

      {/* Stroke Width */}

      <label className="label">
        <span className="label-text">Stroke Width</span>
      </label>
      <input
        type="range"
        min={1}
        max={20}
        value={width}
        onChange={(e) => onWidthChange(Number(e.target.value))}
        className="range range-xs [--range-fill:0]"
      />
      <div className="text-sm text-center w-10">{width}px</div>

    </div>
  );
}
