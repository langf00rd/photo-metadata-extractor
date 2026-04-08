"use client";

import { ExifData } from "@/lib/exif";
import { useState } from "react";

interface Props {
  meta: ExifData;
}

export default function RawDump({ meta }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-neutral-500 underline decoration-dotted cursor-pointer hover:text-neutral-400 transition-colors"
      >
        {open ? "hide" : "show"} raw metadata dump
      </button>
      {open && (
        <pre className="mt-3 text-[10px] font-mono text-neutral-400 bg-neutral-50 border border-neutral-100 rounded-lg p-4 max-h-64 overflow-y-auto whitespace-pre-wrap break-all leading-relaxed">
          {JSON.stringify(meta, null, 2)}
        </pre>
      )}
    </div>
  );
}
