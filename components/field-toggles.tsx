"use client";

import { FieldDef } from "@/lib/exif";

interface Props {
  fields: FieldDef[];
  available: Set<string>;
  active: Set<string>;
  onToggle: (key: string) => void;
}

export default function FieldToggles({ fields, available, active, onToggle }: Props) {
  const visible = fields.filter((f) => available.has(f.key));

  if (visible.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {visible.map((f) => {
          const on = active.has(f.key);
          return (
            <button
              key={f.key}
              onClick={() => onToggle(f.key)}
              className={`
                flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border
                transition-colors duration-100 cursor-pointer
                ${on
                  ? "border-neutral-300 text-neutral-700 bg-white"
                  : "border-neutral-100 text-neutral-500/80 bg-white hover:border-neutral-200 hover:text-neutral-400"
                }
              `}
            >
              <span
                className={`
                  w-2.5 h-2.5 rounded-sm border flex-shrink-0 flex items-center justify-center
                  ${on ? "border-neutral-500 bg-neutral-700" : "border-neutral-200"}
                `}
              >
                {on && (
                  <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                    <path d="M1 2.5L2.5 4L5 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
