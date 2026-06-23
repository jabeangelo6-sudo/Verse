"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Mic, MicOff, Video, VideoOff, RotateCcw, Users, X, ChevronRight, Lock, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/utils";

type Audience = "public" | "members";

export default function LivestreamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState<Audience>("public");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraReady(true);
      })
      .catch(() => {
        if (mounted) setCameraError(true);
      });
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Fake viewer count ramp while live
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => setViewers(v => v + Math.floor(Math.random() * 3)), 4000);
    return () => clearInterval(t);
  }, [isLive]);

  // Duration counter while live
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [isLive]);

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !micOn; });
    setMicOn(v => !v);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach(t => { t.enabled = !camOn; });
    setCamOn(v => !v);
  };

  const handleGoLive = () => {
    if (!title.trim()) { toast("warning", "Add a title for your stream"); return; }
    setIsLive(true);
    toast("success", "You're live!", "Share the link to get viewers");
  };

  const handleEndStream = async () => {
    setEnding(true);
    await new Promise(r => setTimeout(r, 1200));
    streamRef.current?.getTracks().forEach(t => t.stop());
    toast("success", `Stream ended · ${formatCount(viewers)} viewers`);
    router.push("/");
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white md:pb-0">

      {/* Camera preview — full bleed */}
      <div className="relative flex-1 flex flex-col min-h-0">
        <div className="absolute inset-0">
          {cameraReady ? (
            <video ref={videoRef} autoPlay muted playsInline
              className={cn("w-full h-full object-cover", !camOn && "invisible")}
              style={{ transform: "scaleX(-1)" }} />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center">
              {cameraError ? (
                <div className="text-center px-6">
                  <Video size={36} className="text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm">Camera access denied</p>
                  <p className="text-zinc-600 text-xs mt-1">Check your browser permissions to go live with video</p>
                </div>
              ) : (
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              )}
            </div>
          )}
          {/* Gradient overlay for controls readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-2">
          {isLive ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-accent-rose text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <Radio size={10} className="animate-pulse" /> LIVE
              </span>
              <span className="text-white/80 text-xs font-mono">{fmt(duration)}</span>
            </div>
          ) : (
            <span className="text-xs text-white/50 font-semibold uppercase tracking-wider">Preview</span>
          )}
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <Users size={12} className="text-white/70" />
                <span className="text-white text-xs font-semibold">{formatCount(viewers)}</span>
              </div>
            )}
            <button onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); router.back(); }}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <X size={16} className="text-white/80" />
            </button>
          </div>
        </div>

        {/* Camera flip */}
        {cameraReady && (
          <div className="relative z-10 flex justify-end px-4">
            <button onClick={() => toast("info", "Camera flip coming soon")}
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center mt-2">
              <RotateCcw size={15} className="text-white/80" />
            </button>
          </div>
        )}

        {/* Bottom controls */}
        <div className="relative z-10 mt-auto px-4 pb-10 pt-6 space-y-4">

          {!isLive && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {/* Title */}
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="What are you streaming about?"
                className="w-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors" />

              {/* Audience */}
              <div className="flex gap-2">
                {(["public", "members"] as Audience[]).map(a => (
                  <button key={a} onClick={() => setAudience(a)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all border",
                      audience === a
                        ? "bg-white text-black border-white"
                        : "bg-black/30 text-white/60 border-white/10 hover:border-white/20"
                    )}>
                    {a === "public" ? <Globe size={12} /> : <Lock size={12} />}
                    {a === "public" ? "Public" : "Members only"}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mic / Cam toggles + Go Live */}
          <div className="flex items-center gap-3">
            <button onClick={toggleMic}
              className={cn("w-12 h-12 rounded-full flex items-center justify-center border transition-all flex-shrink-0",
                micOn ? "bg-white/10 border-white/20 text-white" : "bg-accent-rose border-accent-rose text-white")}>
              {micOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button onClick={toggleCam}
              className={cn("w-12 h-12 rounded-full flex items-center justify-center border transition-all flex-shrink-0",
                camOn ? "bg-white/10 border-white/20 text-white" : "bg-accent-rose border-accent-rose text-white")}>
              {camOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>

            {isLive ? (
              <button onClick={handleEndStream} disabled={ending}
                className="flex-1 py-3.5 rounded-2xl bg-accent-rose font-bold text-white text-sm transition-all disabled:opacity-60">
                {ending ? "Ending…" : "End stream"}
              </button>
            ) : (
              <button onClick={handleGoLive}
                className="flex-1 py-3.5 rounded-2xl bg-accent-rose font-bold text-white text-sm flex items-center justify-center gap-2 hover:bg-rose-500 transition-colors active:scale-[0.98]">
                <Radio size={15} className="animate-pulse" /> Go Live
              </button>
            )}
          </div>

          {/* Creator badge */}
          <div className="flex items-center gap-2.5 px-1">
            <Avatar src={user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
              alt={user?.displayName ?? "You"} size="sm" />
            <div>
              <p className="text-white text-xs font-semibold">{user?.displayName ?? "You"}</p>
              <p className="text-white/40 text-[10px]">@{user?.username ?? "creator"}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
