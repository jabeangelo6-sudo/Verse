"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users2, Plus, X, Percent } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_CREATORS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Collaborator = { username: string; avatar: string; displayName: string; split: number };

type Props = {
  onChange?: (collaborators: Collaborator[]) => void;
};

export function CollabSplit({ onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [collabs, setCollabs] = useState<Collaborator[]>([]);
  const [search, setSearch] = useState("");

  const myShare = Math.max(0, 100 - collabs.reduce((s, c) => s + c.split, 0));

  const addCollab = (creator: typeof MOCK_CREATORS[0]) => {
    if (collabs.find(c => c.username === creator.username)) return;
    const defaultSplit = Math.floor((100 - myShare) / (collabs.length + 1));
    const updated = [...collabs, { username: creator.username, avatar: creator.avatar, displayName: creator.displayName, split: defaultSplit }];
    setCollabs(updated);
    onChange?.(updated);
    setSearch("");
  };

  const updateSplit = (idx: number, val: number) => {
    const updated = collabs.map((c, i) => i === idx ? { ...c, split: val } : c);
    setCollabs(updated);
    onChange?.(updated);
  };

  const remove = (idx: number) => {
    const updated = collabs.filter((_, i) => i !== idx);
    setCollabs(updated);
    onChange?.(updated);
  };

  const filtered = MOCK_CREATORS.filter(c =>
    !collabs.find(col => col.username === c.username) &&
    (c.username.includes(search.toLowerCase()) || c.displayName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border",
          open || collabs.length > 0
            ? "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25"
            : "bg-white/[0.04] text-text-muted border-border hover:border-border-strong hover:text-text-secondary"
        )}
      >
        <Users2 size={13} />
        {collabs.length > 0 ? `${collabs.length} collaborator${collabs.length > 1 ? "s" : ""} · You keep ${myShare}%` : "Add collaborator"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 card p-3 space-y-3">
              {/* Your share */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Your share</span>
                <span className={cn("text-sm font-bold", myShare < 50 ? "text-accent-rose" : "text-accent-green")}>{myShare}%</span>
              </div>

              {/* Collabs */}
              {collabs.map((c, i) => (
                <div key={c.username} className="flex items-center gap-2">
                  <Avatar src={c.avatar} alt={c.displayName} size="xs" />
                  <span className="text-xs text-text-secondary flex-1">@{c.username}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1} max={99}
                      value={c.split}
                      onChange={e => updateSplit(i, Number(e.target.value))}
                      className="w-12 h-7 text-center text-xs rounded-lg bg-white/[0.05] border border-border text-text-primary outline-none focus:border-primary/40"
                    />
                    <Percent size={10} className="text-text-muted" />
                  </div>
                  <button onClick={() => remove(i)} className="text-text-muted hover:text-accent-rose transition-colors">
                    <X size={13} />
                  </button>
                </div>
              ))}

              {/* Search */}
              <input
                type="text"
                placeholder="Search creator to add..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-base h-8 text-xs"
              />

              {search && (
                <div className="space-y-1">
                  {filtered.slice(0, 4).map(creator => (
                    <button
                      key={creator.id}
                      onClick={() => addCollab(creator)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
                    >
                      <Avatar src={creator.avatar} alt={creator.displayName} size="xs" />
                      <span className="text-xs text-text-secondary">{creator.displayName}</span>
                      <span className="text-[10px] text-text-muted">@{creator.username}</span>
                      <Plus size={11} className="ml-auto text-text-muted" />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-text-muted">
                Revenue splits are enforced on-chain. All collaborators receive their share instantly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
