export interface ExifData {
  Make?: string;
  Model?: string;
  LensModel?: string;
  Lens?: string;
  ISO?: number;
  FNumber?: number;
  FocalLength?: number;
  ExposureTime?: number;
  ExposureProgram?: number;
  MeteringMode?: number;
  Flash?: number;
  ImageWidth?: number;
  ImageHeight?: number;
  ColorSpace?: number;
  DateTimeOriginal?: string | Date;
  GPSLatitude?: number;
  GPSLongitude?: number;
  WhiteBalance?: number;
  ExposureBiasValue?: number;
  Software?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface FieldDef {
  key: string;
  label: string;
  extract: (m: ExifData) => string | null;
  defaultOn: boolean;
}

const EXPOSURE_PROGRAMS: Record<number, string> = {
  0: "Not defined", 1: "Manual", 2: "Normal", 3: "Aperture priority",
  4: "Shutter priority", 5: "Creative", 6: "Action", 7: "Portrait", 8: "Landscape",
};

const METERING_MODES: Record<number, string> = {
  1: "Average", 2: "Centre-weighted", 3: "Spot",
  4: "Multi-spot", 5: "Pattern", 6: "Partial",
};

export const FIELD_DEFS: FieldDef[] = [
  {
    key: "camera",
    label: "Camera",
    defaultOn: true,
    extract: (m) => {
      if (!m.Model) return null;
      const make = m.Make ?? "";
      const model = m.Model;
      return model.startsWith(make) ? model : `${make} ${model}`.trim();
    },
  },
  {
    key: "lens",
    label: "Lens",
    defaultOn: true,
    extract: (m) => m.LensModel ?? m.Lens ?? null,
  },
  {
    key: "iso",
    label: "ISO",
    defaultOn: true,
    extract: (m) => (m.ISO != null ? String(m.ISO) : null),
  },
  {
    key: "aperture",
    label: "Aperture",
    defaultOn: true,
    extract: (m) => (m.FNumber != null ? `f/${m.FNumber}` : null),
  },
  {
    key: "focalLength",
    label: "Focal length",
    defaultOn: true,
    extract: (m) => (m.FocalLength != null ? `${m.FocalLength}mm` : null),
  },
  {
    key: "shutterSpeed",
    label: "Shutter speed",
    defaultOn: true,
    extract: (m) => {
      if (m.ExposureTime == null) return null;
      const t = m.ExposureTime;
      return t >= 1 ? `${t} sec` : `1/${Math.round(1 / t)} sec`;
    },
  },
  {
    key: "exposure",
    label: "Exposure program",
    defaultOn: false,
    extract: (m) =>
      m.ExposureProgram != null
        ? EXPOSURE_PROGRAMS[m.ExposureProgram] ?? String(m.ExposureProgram)
        : null,
  },
  {
    key: "metering",
    label: "Metering",
    defaultOn: false,
    extract: (m) =>
      m.MeteringMode != null
        ? METERING_MODES[m.MeteringMode] ?? String(m.MeteringMode)
        : null,
  },
  {
    key: "dimensions",
    label: "Dimensions",
    defaultOn: false,
    extract: (m) =>
      m.ImageWidth && m.ImageHeight ? `${m.ImageWidth}×${m.ImageHeight}` : null,
  },
  {
    key: "colorSpace",
    label: "Color space",
    defaultOn: false,
    extract: (m) =>
      m.ColorSpace === 1 ? "sRGB" : m.ColorSpace != null ? String(m.ColorSpace) : null,
  },
  {
    key: "flash",
    label: "Flash",
    defaultOn: false,
    extract: (m) =>
      m.Flash != null
        ? m.Flash === 0 || m.Flash === 16
          ? "No flash"
          : "Flash fired"
        : null,
  },
  {
    key: "whiteBalance",
    label: "White balance",
    defaultOn: false,
    extract: (m) =>
      m.WhiteBalance != null ? (m.WhiteBalance === 0 ? "Auto" : "Manual") : null,
  },
  {
    key: "exposureBias",
    label: "Exposure bias",
    defaultOn: false,
    extract: (m) =>
      m.ExposureBiasValue != null ? `${m.ExposureBiasValue} EV` : null,
  },
  {
    key: "dateTaken",
    label: "Date taken",
    defaultOn: false,
    extract: (m) => {
      if (!m.DateTimeOriginal) return null;
      const d =
        m.DateTimeOriginal instanceof Date
          ? m.DateTimeOriginal
          : new Date(m.DateTimeOriginal);
      return isNaN(d.getTime()) ? null : d.toLocaleDateString();
    },
  },
  {
    key: "software",
    label: "Software",
    defaultOn: false,
    extract: (m) => m.Software ?? null,
  },
];
