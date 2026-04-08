"use client";

import { useRef, useState } from "react";

interface Props {
  onFile: (file: File) => void;
}

export default function DropZone({ onFile }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    onFile(f);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
      className={`
        relative border border-dashed rounded-xl px-8 py-16 text-center cursor-pointer
        transition-colors duration-150 select-none
        ${dragging ? "border-neutral-400 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <div className="text-2xl mb-3 text-neutral-300">↑</div>
      <p className="text-sm text-neutral-400 font-normal">
        Drop a photo here or click to upload
      </p>
      <p className="text-xs text-neutral-300 mt-1">JPEG · TIFF · HEIC · RAW</p>
    </div>
  );
}
