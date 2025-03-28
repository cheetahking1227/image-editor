import { useState } from "react";

type FilterSettingsType = {
  imageUrl: string;
  filter: string
  onFilterChange: (filter: string) => void;
}

const filters = [
  { name: 'Default', class: '' },
  { name: 'Grayscale', class: 'grayscale' },
  { name: 'Invert', class: 'invert' },
];

export default function FilterSettings({ imageUrl, filter, onFilterChange }: FilterSettingsType) {
  return (
    <div className="absolute flex top-10 left-0 right-0 z-10 justify-center items-center bg-base-200 border-error mt-2 p-4 shadow-lg gap-4">
      {filters.map((filter) => (
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
