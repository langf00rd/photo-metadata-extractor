"use client";

import { ExifData, FIELD_DEFS } from "@/lib/exif";
import { useCallback, useRef, useState } from "react";

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
    (f) => activeFields.has(f.key) && f.extract(meta) !== null,
  );

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
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
      <div ref={cardRef} className="overflow-hidden bg-white">
        <div
          className="relative bg-neutral-50 flex items-center justify-center overflow-hidden"
          style={{ minHeight: 280 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={filename}
            className="w-full max-h-105 object-contain"
          />
        </div>

        {visibleFields.length > 0 && (
          <div className="grid gap-4.5 px-3 grid-cols-3 p-3">
            {visibleFields.map((f, i) => {
              const val = f.extract(meta)!;
              return (
                <div key={f.key}>
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
          fixed bottom-5 right-4
          rounded-full bg-neutral-900 text-white px-3 py-2 text-sm gap-3
          flex items-center justify-center shadow-md
          transition-all duration-150
          ${
            exporting
              ? "opacity-50 cursor-not-allowed scale-95"
              : "hover:bg-neutral-700 hover:scale-105 active:scale-95 cursor-pointer"
          }
        `}
      >
        Export
        {exporting ? (
          <svg
            className="animate-spin"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="8 6"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v8M4 6l3 3 3-3M2 11h10"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
