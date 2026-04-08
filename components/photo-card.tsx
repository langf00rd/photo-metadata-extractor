"use client";

import { useRef, useState, useCallback } from "react";
import { ExifData, FIELD_DEFS } from "@/lib/exif";

interface Props {
  src: string;
  filename: string;
  filesize: string;
  meta: ExifData;
  activeFields: Set<string>;
  index: number;
}

export default function PhotoCard({
  src,
  filename,
  meta,
  activeFields,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const visibleFields = FIELD_DEFS.filter(
    (f) => activeFields.has(f.key) && f.extract(meta) !== null
  );

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // @ts-expect-error - dom-to-image-more lacks type definitions
      const domToImage = (await import("dom-to-image-more")).default as any;

      const dataUrl = await domToImage.toPng(cardRef.current, {
        scale: 4,
        bgcolor: "#ffffff",
        style: {
          border: "none",
        },
        filter: (node: HTMLElement) => {
          if (node.style) {
            node.style.border = "none";
            node.style.borderTop = "none";
            node.style.borderRight = "none";
          }
          return true;
        },
      });

      const link = document.createElement("a");
      link.download = filename.replace(/\.[^.]+$/, "") + "_meta.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [filename]);

  return (
    <div className="relative">
      <div ref={cardRef} className="border border-neutral-100 rounded-xl overflow-hidden bg-white">
        <div
          className="relative bg-neutral-50 flex items-center justify-center mt-3 mx-4 rounded-lg overflow-hidden"
          style={{ minHeight: 280 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={filename}
            className="w-full max-h-[420px] object-contain rounded-lg"
          />
        </div>

        {visibleFields.length > 0 && (
          <div className="grid grid-cols-3 border-t border-neutral-100 mt-4">
            {visibleFields.map((f, i) => {
              const val = f.extract(meta)!;
              const col = i % 3;
              return (
                <div
                  key={f.key}
                  className={`
                    px-5 py-4
                    ${col < 2 ? "border-r border-neutral-100" : ""}
                    ${i >= 3 ? "border-t border-neutral-100" : ""}
                  `}
                >
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400/80 font-medium mb-1">
                    {f.label}
                  </p>
                  <p className="text-sm text-neutral-800">{val}</p>
                </div>
              );
            })}
          </div>
        )}

        {visibleFields.length === 0 && (
          <div className="px-5 py-6 text-xs text-neutral-300 text-center">
            No fields selected
          </div>
        )}
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        title="Export as 4K image"
        className={`
          absolute -bottom-4 right-4
          w-10 h-10 rounded-full bg-neutral-900 text-white
          flex items-center justify-center shadow-md
          transition-all duration-150
          ${exporting
            ? "opacity-50 cursor-not-allowed scale-95"
            : "hover:bg-neutral-700 hover:scale-105 active:scale-95 cursor-pointer"
          }
        `}
      >
        {exporting ? (
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" strokeDasharray="8 6" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}