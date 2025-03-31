import { FilterSettingsType } from "../../../../types";
import { FILTERS } from "../../../../Constants";

export const FilterSettings = ({ imageUrl, onFilterChange }: FilterSettingsType) => {
  return (
    <div className="absolute flex top-20 left-0 right-0 z-10 justify-center items-center bg-base-200 border-error mt-2 p-4 shadow-lg gap-4">
      {FILTERS.map((filter) => (
        <button key={filter.name} className="flex flex-col items-center space-y-1 cursor-pointer" onClick={() => onFilterChange(filter.name)}>
          <div className={`w-16 h-16 rounded border overflow-hidden`}>
            <img
              src={imageUrl}
              alt={filter.name}
              className={`w-full h-full object-cover ${filter.class}`}
            />
          </div>
          <span className="text-xs">{filter.name}</span>
        </button>
      ))}
    </div>
  );
}
