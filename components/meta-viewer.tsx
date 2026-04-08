"use client";

import { useCallback, useState } from "react";
import DropZone from "./drop-zone";
import FieldToggles from "./field-toggles";
import PhotoCard from "./photo-card";
import RawDump from "./raw-dump";
import { ExifData, FIELD_DEFS } from "@/lib/exif";

interface PhotoState {
  src: string;
  filename: string;
  filesize: string;
  meta: ExifData;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DEFAULT_ACTIVE = new Set(
  FIELD_DEFS.filter((f) => f.defaultOn).map((f) => f.key)
);

export default function MetaViewer() {
  const [photo, setPhoto] = useState<PhotoState | null>(null);
  const [activeFields, setActiveFields] = useState<Set<string>>(DEFAULT_ACTIVE);
  const [available, setAvailable] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const exifr = (await import("exifr")).default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = await (exifr.parse as any)(file, {
        tiff: true,
        exif: true,
        gps: true,
        ifd0: true,
        ifd1: true,
        iptc: true,
        xmp: true,
        interop: true,
        translateValues: false,
      }) as ExifData | undefined;

      const meta: ExifData = raw ?? {};

      console.log("[Photo Metadata Viewer] Full EXIF dump:", meta);
      console.log("[Photo Metadata Viewer] Total keys extracted:", Object.keys(meta).length);

      const availableKeys = new Set(
        FIELD_DEFS
          .filter((f) => f.extract(meta) !== null)
          .map((f) => f.key)
      );
      setAvailable(availableKeys);

      // keep only active fields that are actually available
      setActiveFields((prev) => {
        const next = new Set<string>();
        DEFAULT_ACTIVE.forEach((k) => { if (availableKeys.has(k)) next.add(k); });
        prev.forEach((k) => { if (availableKeys.has(k)) next.add(k); });
        return next;
      });

      const src = URL.createObjectURL(file);

      setPhoto({
        src,
        filename: file.name,
        filesize: formatBytes(file.size),
        meta,
      });
    } catch (err) {
      console.error("[Photo Metadata Viewer] parse error:", err);
      setError("Could not read metadata from this file.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleField = useCallback((key: string) => {
    setActiveFields((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const reset = () => {
    if (photo) URL.revokeObjectURL(photo.src);
    setPhoto(null);
    setAvailable(new Set());
    setActiveFields(DEFAULT_ACTIVE);
    setError(null);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">


      {!photo && !loading && (
        <DropZone onFile={handleFile} />
      )}

      {loading && (
        <div className="border border-neutral-100 rounded-xl px-8 py-16 text-center">
          <p className="text-sm text-neutral-300">Reading metadata…</p>
        </div>
      )}

      {error && (
        <div className="border border-red-100 rounded-xl px-6 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {photo && !loading && (
        <>
          <FieldToggles
            fields={FIELD_DEFS}
            available={available}
            active={activeFields}
            onToggle={toggleField}
          />

          <PhotoCard
            src={photo.src}
            filename={photo.filename}
            filesize={photo.filesize}
            meta={photo.meta}
            activeFields={activeFields}
            index={1}
          />

          <RawDump meta={photo.meta} />

          <button
            onClick={reset}
            className="mt-6 text-xs text-neutral-300 hover:text-neutral-500 cursor-pointer transition-colors"
          >
            ← upload another photo
          </button>
        </>
      )}
    </div>
  );
}
