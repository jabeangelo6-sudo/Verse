export interface ExifData {
  dateTaken: Date | null;
  make: string | null;
  model: string | null;
  gpsAvailable: boolean;
  software: string | null;
}

export async function readImageExif(file: File): Promise<ExifData | null> {
  if (!file.type.match(/jpe?g/i) && !file.name.match(/\.jpe?g$/i)) return null;
  try {
    const buffer = await file.slice(0, 131072).arrayBuffer();
    const view = new DataView(buffer);
    if (view.getUint16(0) !== 0xffd8) return null;

    let offset = 2;
    while (offset + 4 < buffer.byteLength) {
      if (view.getUint8(offset) !== 0xff) break;
      const marker = view.getUint8(offset + 1);
      if (marker === 0xda) break;
      const len = view.getUint16(offset + 2);
      if (marker === 0xe1 && offset + 10 < buffer.byteLength) {
        const hdr = String.fromCharCode(
          view.getUint8(offset + 4), view.getUint8(offset + 5),
          view.getUint8(offset + 6), view.getUint8(offset + 7),
        );
        if (hdr === "Exif") return parseTiff(view, offset + 10);
      }
      offset += 2 + len;
    }
    return null;
  } catch { return null; }
}

function parseTiff(view: DataView, base: number): ExifData {
  const out: ExifData = { dateTaken: null, make: null, model: null, gpsAvailable: false, software: null };
  const le = view.getUint16(base) === 0x4949;
  if (u16(view, base + 2, le) !== 42) return out;

  const ifd = base + u32(view, base + 4, le);
  const count = u16(view, ifd, le);

  for (let i = 0; i < count; i++) {
    const e = ifd + 2 + i * 12;
    if (e + 12 > view.byteLength) break;
    const tag = u16(view, e, le);
    const n   = u32(view, e + 4, le);
    const vOff = e + 8;

    const str = () => {
      const abs = n > 4 ? base + u32(view, vOff, le) : vOff;
      let s = "";
      for (let j = 0; j < n && abs + j < view.byteLength; j++) {
        const c = view.getUint8(abs + j);
        if (c === 0) break;
        s += String.fromCharCode(c);
      }
      return s.trim() || null;
    };

    switch (tag) {
      case 0x010f: out.make    = str(); break;
      case 0x0110: out.model   = str(); break;
      case 0x0131: out.software = str(); break;
      case 0x0132: out.dateTaken = exifDate(str()); break;
      case 0x8825: out.gpsAvailable = true; break;
      case 0x8769: {
        // ExifIFD — grab DateTimeOriginal if main DateTime missing
        const sub = base + u32(view, vOff, le);
        const sc  = u16(view, sub, le);
        for (let j = 0; j < sc; j++) {
          const se = sub + 2 + j * 12;
          if (se + 12 > view.byteLength) break;
          if (u16(view, se, le) === 0x9003) {
            const sn = u32(view, se + 4, le);
            const sv = se + 8;
            const abs = sn > 4 ? base + u32(view, sv, le) : sv;
            let s = "";
            for (let k = 0; k < sn && abs + k < view.byteLength; k++) {
              const c = view.getUint8(abs + k);
              if (c === 0) break;
              s += String.fromCharCode(c);
            }
            if (!out.dateTaken) out.dateTaken = exifDate(s.trim() || null);
          }
        }
        break;
      }
    }
  }
  return out;
}

function u16(v: DataView, o: number, le: boolean) { return v.getUint16(o, le); }
function u32(v: DataView, o: number, le: boolean) { return v.getUint32(o, le); }

function exifDate(s: string | null): Date | null {
  if (!s) return null;
  const m = s.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}
