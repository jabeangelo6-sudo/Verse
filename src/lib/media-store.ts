type PendingMedia = { url: string; type: "image" | "video"; name: string } | null;

let pending: PendingMedia = null;

export const mediaStore = {
  set: (media: PendingMedia) => { pending = media; },
  get: () => pending,
  clear: () => {
    if (pending?.url) URL.revokeObjectURL(pending.url);
    pending = null;
  },
};
