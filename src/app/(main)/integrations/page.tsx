"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Check, Copy, X, Upload, Globe, Zap, Rss, DollarSign, Sparkles, Mail, Heart, RefreshCw, Send } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useIntegrations } from "@/lib/hooks/useIntegrations";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

type IntegrationDef = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  type: "distribute" | "import" | "automate" | "payout" | "email";
  inputLabel?: string;
  inputPlaceholder?: string;
  connectedLabel?: string;
  urlOutput?: boolean;
  alwaysOn?: boolean;
  comingSoon?: boolean;
};

const INTEGRATIONS: IntegrationDef[] = [
  // DISTRIBUTE
  {
    id: "twitter", name: "X / Twitter", type: "distribute",
    tagline: "Auto cross-post when you publish",
    description: "Every Verse post you publish gets shared to your X account automatically.",
    icon: <span className="font-black text-white text-base leading-none">𝕏</span>,
    color: "bg-black",
    inputLabel: "Your X username", inputPlaceholder: "@yourhandle",
    connectedLabel: "Posting to",
  },
  {
    id: "linkedin", name: "LinkedIn", type: "distribute",
    tagline: "Reach your professional audience",
    description: "Share posts to your LinkedIn feed. Great for thought leadership content.",
    icon: <span className="font-black text-white text-xs leading-none">in</span>,
    color: "bg-[#0077B5]",
    inputLabel: "LinkedIn profile name", inputPlaceholder: "Your Name",
    connectedLabel: "Posting as",
  },
  {
    id: "farcaster", name: "Farcaster", type: "distribute",
    tagline: "Cast to Warpcast on publish",
    description: "Cross-post to Farcaster automatically. Reach the crypto-native creator community.",
    icon: <span className="font-black text-white text-sm leading-none">⌀</span>,
    color: "bg-[#8B5CF6]",
    inputLabel: "Farcaster username", inputPlaceholder: "@yourname",
    connectedLabel: "Casting as",
  },
  {
    id: "telegram", name: "Telegram", type: "distribute",
    tagline: "Notify your Telegram channel",
    description: "Send a message to your Telegram channel whenever you post something new.",
    icon: <Send size={14} className="text-white" />,
    color: "bg-[#229ED9]",
    inputLabel: "Channel username", inputPlaceholder: "@yourchannel",
    connectedLabel: "Sending to",
  },
  {
    id: "instagram", name: "Instagram", type: "distribute",
    tagline: "Copy caption on publish, paste into Instagram",
    description: "When you publish, your post text is copied to clipboard automatically. Open Instagram and paste it as your caption.",
    icon: <span className="font-black text-white text-xs leading-none">IG</span>,
    color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    inputLabel: "Your Instagram username", inputPlaceholder: "@yourhandle",
    connectedLabel: "Copying caption for",
  },
  {
    id: "tiktok", name: "TikTok", type: "distribute",
    tagline: "Copy caption on publish, paste into TikTok",
    description: "When you publish, your post text is copied to clipboard. Open TikTok, upload your video, and paste it as your caption.",
    icon: <span className="font-black text-white text-xs leading-none">TT</span>,
    color: "bg-black",
    inputLabel: "Your TikTok username", inputPlaceholder: "@yourhandle",
    connectedLabel: "Copying caption for",
  },

  // IMPORT & MIGRATE
  {
    id: "substack", name: "Substack", type: "import",
    tagline: "Import posts + subscriber list",
    description: "Migrate your Substack posts and bring your email subscribers to Verse. Keep the newsletter format with Verse's email delivery.",
    icon: <Mail size={15} className="text-white" />,
    color: "bg-[#FF6719]",
    inputLabel: "Your Substack URL", inputPlaceholder: "yourname.substack.com",
    connectedLabel: "Imported from",
  },
  {
    id: "medium", name: "Medium", type: "import",
    tagline: "Import all your articles",
    description: "Pull all your Medium posts into Verse as long-form content. Keep your drafts, published posts, and claps data.",
    icon: <span className="font-black text-white text-base leading-none">M</span>,
    color: "bg-black",
    inputLabel: "Medium username", inputPlaceholder: "@yourhandle",
    connectedLabel: "Imported from",
  },
  {
    id: "twitter_import", name: "Import from X", type: "import",
    tagline: "Bring your threads and tweets",
    description: "Import your best threads and tweets as Verse posts. Your existing audience can follow your new profile.",
    icon: <span className="font-black text-white text-base leading-none">𝕏</span>,
    color: "bg-black",
    inputLabel: "Your X username", inputPlaceholder: "@yourhandle",
    connectedLabel: "Importing from",
  },
  {
    id: "beehiiv", name: "Beehiiv", type: "import",
    tagline: "Migrate your subscriber list",
    description: "Import your Beehiiv newsletter subscribers directly to Verse. They'll receive your posts by email.",
    icon: <Mail size={15} className="text-white" />,
    color: "bg-black",
    inputLabel: "Beehiiv publication URL", inputPlaceholder: "yourpub.beehiiv.com",
    connectedLabel: "Imported from",
  },
  {
    id: "patreon", name: "Patreon", type: "import",
    tagline: "Migrate members to Inner Circle",
    description: "Move your Patreon patrons to Verse's Inner Circle. They keep their access, you keep more of your earnings.",
    icon: <Heart size={14} className="text-white fill-white" />,
    color: "bg-[#FF424D]",
    inputLabel: "Patreon creator URL", inputPlaceholder: "patreon.com/yourname",
    connectedLabel: "Migrating from",
  },

  // AUTOMATE
  {
    id: "zapier", name: "Zapier", type: "automate",
    tagline: "Connect Verse to 6,000+ apps",
    description: "Use your Verse webhook to trigger anything: send thank-you emails on new tips, add new followers to your CRM, post to Slack on new members.",
    icon: <Zap size={14} className="text-white fill-white" />,
    color: "bg-[#FF4A00]",
    urlOutput: true,
    connectedLabel: "Webhook active",
  },
  {
    id: "discord", name: "Discord", type: "automate",
    tagline: "Post to your server when you publish",
    description: "Paste your Discord webhook URL and every new Verse post fires into your server automatically.",
    icon: <span className="font-black text-white text-xs leading-none">DC</span>,
    color: "bg-[#5865F2]",
    inputLabel: "Discord webhook URL", inputPlaceholder: "https://discord.com/api/webhooks/...",
    connectedLabel: "Posting to server",
  },
  {
    id: "make", name: "Make (Integromat)", type: "automate",
    tagline: "Visual automation for Verse events",
    description: "Use your Verse webhook in Make to build visual automation flows for any event: tips, posts, new members.",
    icon: <RefreshCw size={15} className="text-white" />,
    color: "bg-[#6D00CC]",
    urlOutput: true,
    connectedLabel: "Webhook active",
  },
  {
    id: "rss", name: "RSS Feed", type: "automate",
    tagline: "Your public posts as an RSS feed",
    description: "Every creator on Verse gets an RSS feed. Anyone can subscribe using any feed reader.",
    icon: <Rss size={15} className="text-white" />,
    color: "bg-[#F97316]",
    alwaysOn: true,
    urlOutput: true,
    connectedLabel: "Always active",
  },

  // EMAIL
  {
    id: "kit", name: "Kit (ConvertKit)", type: "email",
    tagline: "Send every post as a newsletter to your subscribers",
    description: "Connect your Kit account and every Verse post you publish goes straight to your email subscribers as a broadcast. Your audience, owned by you.",
    icon: <Mail size={15} className="text-white" />,
    color: "bg-[#FB6970]",
    inputLabel: "Kit API key", inputPlaceholder: "Paste your Kit API key",
    connectedLabel: "Sending to subscribers",
  },

  // PAYOUT
  {
    id: "stripe", name: "Stripe", type: "payout",
    tagline: "Bank transfers in 2–3 business days",
    description: "Connect your Stripe account to receive earnings via bank transfer. Supports 40+ countries.",
    icon: <span className="font-black text-white text-base leading-none">S</span>,
    color: "bg-[#635BFF]",
    connectedLabel: "Connected",
  },
  {
    id: "paypal", name: "PayPal", type: "payout",
    tagline: "Same-day transfers to PayPal",
    description: "Link your PayPal account for instant same-day withdrawals to your PayPal balance.",
    icon: <span className="font-black text-white text-xs leading-none">PP</span>,
    color: "bg-[#003087]",
    inputLabel: "PayPal email", inputPlaceholder: "you@email.com",
    connectedLabel: "Connected to",
  },
];

const CATEGORIES = [
  { id: "distribute", label: "Distribute", description: "Post once, appear everywhere", icon: <Globe size={14} /> },
  { id: "email", label: "Email", description: "Own your audience with email", icon: <Mail size={14} /> },
  { id: "import", label: "Import & Migrate", description: "Bring your content and audience here", icon: <Upload size={14} /> },
  { id: "automate", label: "Automate", description: "Connect Verse to your workflow", icon: <Zap size={14} /> },
  { id: "payout", label: "Get Paid", description: "How you receive your earnings", icon: <DollarSign size={14} /> },
] as const;

type ModalState = { integration: IntegrationDef; inputValue: string } | null;

export default function IntegrationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isConnected, connect, disconnect, getMeta, loaded } = useIntegrations();
  const [modal, setModal] = useState<ModalState>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const connectedCount = INTEGRATIONS.filter(i => isConnected(i.id) || i.alwaysOn).length;

  const openModal = (integration: IntegrationDef) => {
    if (integration.comingSoon) { toast("info", "Coming soon", `${integration.name} integration is in progress`); return; }
    if (integration.alwaysOn) return;
    if (isConnected(integration.id)) {
      disconnect(integration.id);
      toast("success", `${integration.name} disconnected`);
      return;
    }
    setModal({ integration, inputValue: "" });
  };

  const handleConnect = async () => {
    if (!modal) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    connect(modal.integration.id, modal.inputValue ? { value: modal.inputValue } : undefined);
    setLoading(false);
    setModal(null);
    toast("success", `${modal.integration.name} connected`, modal.integration.connectedLabel ?? "");
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getRssUrl = () => `https://verse.app/${user?.username ?? "you"}/feed.rss`;
  const getWebhookUrl = () => `https://verse.app/api/webhooks/${user?.id ?? "your-id"}`;

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Integrations" />

      {/* Hero */}
      <div className="px-4 pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow-sm">
            <Link2 size={22} className="text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-text-primary">Connect your creator stack</div>
            <div className="text-sm text-text-muted mt-0.5">
              {loaded ? (
                <span>{connectedCount} of {INTEGRATIONS.length} connected</span>
              ) : "Loading..."}
            </div>
          </div>
          <div className="ml-auto">
            <div className="text-2xl font-bold gradient-text">{connectedCount}</div>
            <div className="text-[10px] text-text-muted text-center">active</div>
          </div>
        </motion.div>
      </div>

      {/* Category sections */}
      <div className="px-4 py-4 space-y-8">
        {CATEGORIES.map((cat) => {
          const items = INTEGRATIONS.filter(i => i.type === cat.id);
          return (
            <section key={cat.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-text-muted">{cat.icon}</div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary">{cat.label}</h2>
                  <p className="text-xs text-text-muted">{cat.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((integration, i) => {
                  const connected = isConnected(integration.id) || !!integration.alwaysOn;
                  const meta = getMeta(integration.id);
                  return (
                    <motion.div key={integration.id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn("card p-4 transition-all", connected && "border-border-strong")}>
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", integration.color)}>
                          {integration.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-text-primary">{integration.name}</span>
                            {connected && (
                              <span className="flex items-center gap-1 text-[10px] bg-accent-green/15 text-accent-green border border-accent-green/20 px-1.5 py-0.5 rounded-full font-bold">
                                <Check size={9} /> {integration.alwaysOn ? "Always on" : "Connected"}
                              </span>
                            )}
                            {integration.comingSoon && (
                              <span className="text-[10px] bg-white/[0.06] text-text-muted border border-border px-1.5 py-0.5 rounded-full">Soon</span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted mt-0.5">
                            {connected && meta.value
                              ? <span className="text-text-secondary">{integration.connectedLabel} <span className="font-medium">{meta.value}</span></span>
                              : integration.tagline
                            }
                          </div>
                        </div>

                        {/* Action */}
                        {!integration.alwaysOn && (
                          <button onClick={() => openModal(integration)}
                            className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex-shrink-0",
                              integration.comingSoon
                                ? "text-text-muted border-border cursor-default"
                                : connected
                                  ? "text-text-muted border-border hover:text-accent-rose hover:border-accent-rose/30 hover:bg-accent-rose/5"
                                  : "text-primary-light border-primary/25 bg-primary/8 hover:bg-primary/15"
                            )}>
                            {integration.comingSoon ? "Soon" : connected ? "Disconnect" : "Connect"}
                          </button>
                        )}
                      </div>

                      {/* URL output for RSS / Zapier / Make */}
                      {(connected || integration.alwaysOn) && integration.urlOutput && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-[11px] text-text-muted bg-white/[0.04] px-3 py-2 rounded-lg truncate font-mono">
                              {integration.id === "rss" ? getRssUrl() : getWebhookUrl()}
                            </code>
                            <button onClick={() => copyUrl(integration.id, integration.id === "rss" ? getRssUrl() : getWebhookUrl())}
                              className="p-2 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text-secondary transition-colors flex-shrink-0">
                              {copied === integration.id ? <Check size={13} className="text-accent-green" /> : <Copy size={13} />}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Connect Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModal(null)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="glass border border-border rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", modal.integration.color)}>
                    {modal.integration.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary">{modal.integration.name}</div>
                    <div className="text-xs text-text-muted">{modal.integration.tagline}</div>
                  </div>
                </div>
                <button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-text-muted">
                  <X size={15} />
                </button>
              </div>

              <p className="text-sm text-text-secondary mb-4 leading-relaxed">{modal.integration.description}</p>

              {modal.integration.inputLabel && (
                <div className="mb-4">
                  <label className="text-xs font-semibold text-text-secondary mb-1.5 block">{modal.integration.inputLabel}</label>
                  <input
                    type="text"
                    placeholder={modal.integration.inputPlaceholder}
                    value={modal.inputValue}
                    onChange={(e) => setModal(m => m ? { ...m, inputValue: e.target.value } : m)}
                    className="input-base"
                    autoFocus
                  />
                </div>
              )}

              {modal.integration.type === "import" && (
                <div className="mb-4 p-3 rounded-xl bg-primary/8 border border-primary/15 text-xs text-text-secondary flex items-start gap-2">
                  <Sparkles size={12} className="text-primary-light mt-0.5 flex-shrink-0" />
                  Import runs in the background. Your posts will appear in your Verse profile within a few minutes.
                </div>
              )}

              <Button variant="gradient" size="md" className="w-full" loading={loading} onClick={handleConnect}>
                {modal.integration.type === "import" ? "Start Import" :
                 modal.integration.type === "payout" ? "Connect Account" : "Connect"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
