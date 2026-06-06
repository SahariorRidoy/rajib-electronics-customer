"use client";

import type { ColorVariant } from "@/types";

interface Props {
  variants: ColorVariant[];
  selected: ColorVariant | null;
  onChange: (variant: ColorVariant) => void;
}

export default function ColorVariantSelector({ variants, selected, onChange }: Props) {
  if (!variants.length) return null;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">
        Color:{" "}
        {selected && (
          <span className="font-semibold text-gray-900">{selected.colorName}</span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.colorName}
            type="button"
            title={v.colorName}
            onClick={() => onChange(v)}
            className={`w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#167389] ${
              selected?.colorName === v.colorName
                ? "border-[#167389] scale-110 shadow-md"
                : "border-gray-300 hover:border-gray-500"
            }`}
            style={{ backgroundColor: v.colorHex ?? "#ccc" }}
          />
        ))}
      </div>
    </div>
  );
}
