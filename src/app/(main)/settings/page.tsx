"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, DollarSign, LogOut, ChevronRight, Check, Trash2, Moon, Globe, Lock, Mail, Phone, Plus, X, Database } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={cn("w-11 h-6 rounded-full transition-colors relative flex-shrink-0", on ? "bg-primary" : "bg-white/[0.12]")}>
      <motion.div animate={{ x: on ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1 mb-2">{title}</h2>
      <div className="card overflow-hidden divide-y divide-border">
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, value, onClick, danger = false, toggle, onToggle }:
  { icon: React.ReactNode; label: string; value?: string; onClick?: () => void; danger?: boolean; toggle?: boolean; onToggle?: (v: boolean) => void }) {
  return (
    <div onClick={onClick} className={cn("flex items-center gap-3 px-4 py-3.5 transition-colors", onClick ? "cursor-pointer hover:bg-white/[0.03]" : "")}>
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.06]", danger && "bg-accent-rose/10")}>
        <span className={danger ? "text-accent-rose" : "text-text-secondary"}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm font-medium", danger ? "text-accent-rose" : "text-text-primary")}>{label}</div>
        {value && <div className="text-xs text-text-muted mt-0.5 truncate">{value}</div>}
      </div>
      {toggle !== undefined && onToggle ? (
        <Toggle on={toggle} onChange={onToggle} />
      ) : onClick ? (
        <ChevronRight size={15} className="text-text-muted flex-shrink-0" />
      ) : null}
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);

  const [connectedAccounts, setConnectedAccounts] = useState([
    { id: "privy", label: "Privy (primary)", icon: "🔐", connected: true, removable: false },
  ]);

  const [notifs, setNotifs] = useState({
    newFollower: true,
    tips: true,
    comments: true,
    mentions: true,
    members: true,
    newsletter: false,
  });

  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showEarnings: true,
    allowDMs: true,
    indexProfile: true,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast("success", "Profile updated");
  };

  const handleSavePersonalInfo = async () => {
    setSavingInfo(true);
    await new Promise(r => setTimeout(r, 1000));
    setSavingInfo(false);
    toast("success", "Personal info saved");
  };

  const handleAddAccount = () => {
    toast("info", "Choose a login method to add", "Email, Google, Apple, or Twitter");
  };

  const handleRemoveAccount = (id: string) => {
    setConnectedAccounts(prev => prev.filter(a => a.id !== id));
    toast("success", "Account removed");
  };

  const handleLogout = () => {
    logout();
    toast("success", "Signed out");
  };

  const handleDeleteAccount = () => {
    toast("warning", "Contact support to delete your account", "support@verse.app");
  };

  const avatarSrc = user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username ?? "default"}`;

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Settings" />

      <div className="px-4 pt-5">

        {/* Profile */}
        <Section title="Profile">
          <div className="px-4 py-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar src={avatarSrc} alt={user?.displayName ?? "You"} size="xl" />
              <button className="text-sm text-primary-light font-semibold hover:text-primary transition-colors">
                Change photo
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Display name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name" className="input-base" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Username</label>
                <input type="text" value={user?.username ?? ""} readOnly
                  className="input-base opacity-50 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="Tell people about yourself..." rows={3}
                  className="input-base resize-none" />
              </div>
              <Button variant="primary" size="sm" loading={saving} onClick={handleSaveProfile} className="gap-1.5">
                <Check size={13} /> Save changes
              </Button>
            </div>
          </div>
        </Section>

        {/* Personal Info */}
        <Section title="Personal Info">
          <div className="px-4 py-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="input-base pl-9" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1.5">Phone number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000" className="input-base pl-9" />
              </div>
              <p className="text-xs text-text-muted mt-1.5">Used for account recovery only. Never shown publicly.</p>
            </div>
            <Button variant="primary" size="sm" loading={savingInfo} onClick={handleSavePersonalInfo} className="gap-1.5">
              <Check size={13} /> Save
            </Button>
          </div>
        </Section>

        {/* Connected Accounts */}
        <Section title="Connected Accounts">
          <div className="px-4 py-3 space-y-2">
            {connectedAccounts.map(account => (
              <div key={account.id} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-base flex-shrink-0">
                  {account.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{account.label}</div>
                  <div className="text-xs text-accent-green">Connected</div>
                </div>
                {account.removable && (
                  <button onClick={() => handleRemoveAccount(account.id)}
                    className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-text-muted hover:text-accent-rose hover:bg-accent-rose/10 transition-colors">
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={handleAddAccount}
              className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-text-muted hover:text-primary-light">
              <Plus size={15} /> Add account
            </button>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Row icon={<User size={15} />} label="New followers" toggle={notifs.newFollower} onToggle={v => setNotifs(p => ({ ...p, newFollower: v }))} />
          <Row icon={<DollarSign size={15} />} label="Tips received" toggle={notifs.tips} onToggle={v => setNotifs(p => ({ ...p, tips: v }))} />
          <Row icon={<Bell size={15} />} label="Comments" toggle={notifs.comments} onToggle={v => setNotifs(p => ({ ...p, comments: v }))} />
          <Row icon={<Bell size={15} />} label="Mentions" toggle={notifs.mentions} onToggle={v => setNotifs(p => ({ ...p, mentions: v }))} />
          <Row icon={<Lock size={15} />} label="New members" toggle={notifs.members} onToggle={v => setNotifs(p => ({ ...p, members: v }))} />
          <Row icon={<Globe size={15} />} label="Newsletter & updates" toggle={notifs.newsletter} onToggle={v => setNotifs(p => ({ ...p, newsletter: v }))} />
        </Section>

        {/* Privacy */}
        <Section title="Privacy">
          <Row icon={<Lock size={15} />} label="Private account" value="Only approved followers see your posts" toggle={privacy.privateAccount} onToggle={v => setPrivacy(p => ({ ...p, privateAccount: v }))} />
          <Row icon={<DollarSign size={15} />} label="Show earnings publicly" toggle={privacy.showEarnings} onToggle={v => setPrivacy(p => ({ ...p, showEarnings: v }))} />
          <Row icon={<User size={15} />} label="Allow direct messages" toggle={privacy.allowDMs} onToggle={v => setPrivacy(p => ({ ...p, allowDMs: v }))} />
          <Row icon={<Globe size={15} />} label="Allow search indexing" toggle={privacy.indexProfile} onToggle={v => setPrivacy(p => ({ ...p, indexProfile: v }))} />
        </Section>

        {/* Data & Portability */}
        <Section title="Data & Portability">
          <Link href="/data" className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-accent-green/10">
              <Database size={15} className="text-accent-green" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary">Download your data</div>
              <div className="text-xs text-text-muted mt-0.5">Posts, followers (with emails), earnings — yours to keep</div>
            </div>
            <ChevronRight size={15} className="text-text-muted flex-shrink-0" />
          </Link>
        </Section>

        {/* Account */}
        <Section title="Account">
          <Row icon={<Shield size={15} />} label="Connected accounts" value="Manage your login methods" onClick={() => toast("info", "Coming soon")} />
          <Row icon={<DollarSign size={15} />} label="Payout settings" value="Bank, PayPal, Stripe" onClick={() => toast("info", "Go to Earnings to manage payouts")} />
          <Row icon={<Moon size={15} />} label="Appearance" value="Dark mode" onClick={() => toast("info", "Dark mode is always on — it's better")} />
          <Row icon={<LogOut size={15} />} label="Sign out" onClick={handleLogout} />
          <Row icon={<Trash2 size={15} />} label="Delete account" danger onClick={handleDeleteAccount} />
        </Section>

        <p className="text-center text-xs text-text-muted pb-6">
          Verse · Your content, your audience, your earnings
        </p>
      </div>
    </div>
  );
}
