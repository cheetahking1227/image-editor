import { FinetuneSettingsType } from "../../../../types";

export const FinetuneSettings = ({ bgImageFinetune, finetune, handleRangeValueChange }: FinetuneSettingsType) => {
  return (
    <div className="absolute flex top-10 left-0 right-0 z-10 justify-center items-center bg-base-200 border-error mt-4 p-4 shadow-lg gap-4">
      <label className="block text-center">
        {bgImageFinetune[finetune].title}
      </label>
      <input
        type="range"
        min={bgImageFinetune[finetune].min}
        max={bgImageFinetune[finetune].max}
        value={bgImageFinetune[finetune].value}
        className="range range-xs [--range-fill:0]"
        onChange={(e) => { handleRangeValueChange(e) }}
        step={10}
      />
      <div className="text-center ml-5 w-10">{bgImageFinetune[finetune].value}</div>
    </div>
  );
}
