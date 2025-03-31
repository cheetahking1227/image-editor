import { useState, useEffect, useRef } from "react";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";
import { PaintBucket, Highlighter } from "lucide-react";
import { ColorAndStrokeSettingsType } from "../../../../types";

export const ColorAndStrokeSettings = ({ color, width, onColorChange, onWidthChange, bgColor, onBgColorChange }: ColorAndStrokeSettingsType) => {
  const fgPickerRef = useRef<HTMLDivElement>(null);
  const bgPickerRef = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fgPickerRef.current &&
        !fgPickerRef.current.contains(event.target as Node)
      ) {
        setPickerOpen(false);
      }
      if (
        bgPickerRef.current &&
        !bgPickerRef.current.contains(event.target as Node)
      ) {
        setBgPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute flex top-20 left-0 right-0 z-10 justify-center items-center bg-base-200 border-error mt-2 p-4 shadow-lg gap-4">
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
          <div ref={bgPickerRef} className="absolute z-10 mt-2 bg-base-100 p-2 rounded-box shadow">
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
          <div ref={fgPickerRef} className="absolute z-10 mt-2 bg-base-100 p-2 rounded-box shadow">
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
