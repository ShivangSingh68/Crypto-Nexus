"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "@/components/toaster";

/** Subset of Prisma User fields surfaced to the dialog. */
export interface UserProfile {
  username: string;
  displayName: string;
  email: string;
  bio: string;
  avatarUrl: string | undefined;
  avatarInitials: string;
  joinDate: string;
  location: string;
}

interface SavePayload {
  username: string;
  displayName: string;
  email: string;
  bio: string;
  location: string;
  avatar: File | null;
}

interface UserSettingsDialogProps {
  profile: UserProfile;
  currentUserId?: string;
  profileId?: string;
  onSave: (
    updated: SavePayload,
  ) => Promise<{ success: boolean; error?: string }>;
  onDelete: () => void;
  onLogout: () => Promise<void>;
}

/** True for any src that isn't a relative path — blob:, https:, http:, etc. */
function isExternalSrc(src: string): boolean {
  return /^(blob:|https?:\/\/)/.test(src);
}

export default function UserSettingsDialog({
  profile,
  currentUserId,
  profileId,
  onSave,
  onDelete,
  onLogout,
}: UserSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // While currentUserId is still loading (undefined/null), treat as owner so the
  // button stays interactive. Once resolved, block if IDs don't match.
  const isOwner = !currentUserId || !profileId || profileId === currentUserId;

  const [form, setForm] = useState({
    username: profile.username,
    displayName: profile.displayName,
    email: profile.email,
    bio: profile.bio,
    location: profile.location,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    profile.avatarUrl,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setAvatarError("Image must be under 4 MB.");
      e.target.value = ""; // reset so the same file triggers onChange again if retried
      return;
    }
    setAvatarError(null);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const patch = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const result = await onSave?.({ ...form, avatar: avatarFile });
      if (result && !result.success) {
        const errMsg =
          result.error ?? "Something went wrong. Please try again.";
        setSaveError(errMsg);
        toast("error", "Save Failed", errMsg);
        return;
      }
      setSaved(true);
      setOpen(false);
      toast("success", "Profile Updated", "Your changes have been saved.");
      window.location.reload();
    } catch {
      const errMsg = "Something went wrong. Please try again.";
      setSaveError(errMsg);
      toast("error", "Save Failed", errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerClick = () => {
    if (!isOwner) return; // do nothing if not the owner
    setOpen(true);
  };

  return (
    <>
      {/* ── Trigger chip ── */}
      <button
        onClick={handleTriggerClick}
        aria-label={isOwner ? "Open user settings" : undefined}
        // Disable pointer events visually when not owner so cursor stays default
        style={{
          background: "none",
          border: "none",
          cursor: isOwner ? "pointer" : "default",
          padding: 0,
          pointerEvents: isOwner ? "auto" : "none",
        }}
        className="group flex items-center gap-3 hover-lift"
      >
        <div className="relative">
          <div
            className="rounded-2xl flex items-center justify-center overflow-hidden font-orbitron font-black"
            style={{
              width: "48px",
              height: "48px",
              fontSize: "13px",
              background: avatarPreview
                ? "transparent"
                : "rgba(203,166,247,0.12)",
              border: "1px solid rgba(203,166,247,0.25)",
              color: "#cba6f7",
              boxShadow: "0 0 24px rgba(203,166,247,0.1)",
            }}
          >
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt={`${profile.displayName} avatar`}
                width={48}
                height={48}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                unoptimized={isExternalSrc(avatarPreview)}
              />
            ) : (
              profile.avatarInitials
            )}
          </div>
          {isOwner && (
            <span
              className="absolute"
              style={{
                bottom: "-2px",
                right: "-2px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#a6e3a1",
                border: "2px solid #11111b",
                boxShadow: "0 0 8px #a6e3a1",
              }}
            />
          )}
        </div>

        <div className="hidden sm:block text-left">
          <p
            className="font-orbitron font-bold"
            style={{
              fontSize: "12px",
              color: "#cdd6f4",
              lineHeight: 1,
              marginBottom: "3px",
            }}
          >
            {profile.displayName}
          </p>
          <p
            className="font-rajdhani"
            style={{ fontSize: "12px", color: "#585b70", lineHeight: 1 }}
          >
            @{profile.username}
          </p>
        </div>

        {/* Only show the edit pencil if the viewer is the owner */}
        {isOwner && (
          <div
            className="hidden sm:flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(203,166,247,0.08)",
              color: "#cba6f7",
              fontSize: "12px",
            }}
          >
            ✎
          </div>
        )}
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(17,17,27,0.88)",
            backdropFilter: "blur(10px)",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="w-full relative overflow-hidden flex flex-col"
            style={{
              maxWidth: "520px",
              // Cap height to the viewport with some breathing room
              maxHeight: "calc(100vh - 2rem)",
              background: "rgba(24,24,37,0.98)",
              border: "1px solid rgba(203,166,247,0.15)",
              borderRadius: "24px",
              boxShadow:
                "0 0 80px rgba(203,166,247,0.07), 0 40px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Top gradient line */}
            <div
              className="absolute top-0 left-0 right-0 h-px shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(203,166,247,0.45), transparent)",
              }}
            />

            {/* Header — fixed, never scrolls away */}
            <div
              className="shrink-0 flex items-center justify-between"
              style={{ padding: "2rem 2rem 1.5rem" }}
            >
              <div>
                <h2
                  className="font-orbitron font-black uppercase tracking-widest"
                  style={{ fontSize: "18px", color: "#cdd6f4" }}
                >
                  Edit Profile
                </h2>
                <p
                  className="font-rajdhani"
                  style={{
                    fontSize: "12px",
                    color: "#585b70",
                    marginTop: "4px",
                  }}
                >
                  Update your public profile information
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl transition-all"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "none",
                  cursor: "pointer",
                  color: "#585b70",
                  fontSize: "14px",
                  border: "1px solid rgba(180,190,254,0.08)",
                }}
              >
                ✕
              </button>
            </div>

            {/* Body — scrollable */}
            <div
              style={{
                padding: "0 2rem 2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                overflowY: "auto",
                // Smooth momentum scrolling on iOS
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Avatar upload */}
              <div
                className="flex items-center gap-5 rounded-2xl"
                style={{
                  padding: "1.25rem 1.5rem",
                  background: "rgba(180,190,254,0.03)",
                  border: "1px solid rgba(180,190,254,0.07)",
                }}
              >
                <div
                  className="rounded-2xl flex items-center justify-center overflow-hidden font-orbitron font-black shrink-0"
                  style={{
                    width: "72px",
                    height: "72px",
                    fontSize: "22px",
                    background: avatarPreview
                      ? "transparent"
                      : "rgba(203,166,247,0.1)",
                    border: "1px solid rgba(203,166,247,0.2)",
                    color: "#cba6f7",
                  }}
                >
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt={`${profile.displayName} avatar`}
                      width={72}
                      height={72}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      unoptimized={isExternalSrc(avatarPreview)}
                    />
                  ) : (
                    profile.avatarInitials
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    className="font-orbitron font-bold uppercase tracking-widest"
                    style={{ fontSize: "11px", color: "#cdd6f4" }}
                  >
                    Profile Photo
                  </p>
                  <p
                    className="font-rajdhani"
                    style={{ fontSize: "12px", color: "#585b70" }}
                  >
                    JPG, PNG or GIF · max 4 MB
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Btn onClick={() => fileRef.current?.click()}>Upload</Btn>
                  </div>
                  {avatarError && (
                    <p
                      className="font-rajdhani"
                      style={{
                        fontSize: "11px",
                        color: "#f38ba8",
                        marginTop: "2px",
                      }}
                    >
                      ⚠ {avatarError}
                    </p>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFile}
                  />
                </div>
              </div>

              <Field label="Display Name">
                <input
                  className="nexus-input"
                  value={form.displayName}
                  onChange={(e) => patch("displayName", e.target.value)}
                  placeholder="Your display name"
                />
              </Field>

              {/* Username — read-only */}
              <Field label="Username">
                <div style={{ position: "relative" }}>
                  <span
                    className="font-mono-tech absolute"
                    style={{
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "14px",
                      color: "#585b70",
                    }}
                  >
                    @
                  </span>
                  <input
                    className="nexus-input"
                    style={{
                      paddingLeft: "32px",
                      paddingRight: "36px",
                      opacity: 0.6,
                      cursor: "not-allowed",
                    }}
                    value={form.username}
                    readOnly
                    tabIndex={-1}
                    placeholder="username"
                  />
                  <LockIcon />
                </div>
              </Field>

              {/* Email — read-only */}
              <Field label="Email">
                <div style={{ position: "relative" }}>
                  <input
                    className="nexus-input"
                    type="email"
                    style={{
                      paddingRight: "36px",
                      opacity: 0.6,
                      cursor: "not-allowed",
                    }}
                    value={form.email}
                    readOnly
                    tabIndex={-1}
                    placeholder="your@email.com"
                  />
                  <LockIcon />
                </div>
              </Field>

              <Field label="Bio">
                <textarea
                  className="nexus-input"
                  rows={3}
                  style={{ resize: "none" }}
                  value={form.bio}
                  onChange={(e) => patch("bio", e.target.value)}
                  placeholder="Short bio…"
                />
              </Field>

              <Field label="Location">
                <input
                  className="nexus-input"
                  value={form.location}
                  onChange={(e) => patch("location", e.target.value)}
                  placeholder="City, Country"
                />
              </Field>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="font-orbitron font-bold uppercase tracking-widest rounded-2xl transition-all"
                style={{
                  width: "100%",
                  padding: "1rem",
                  fontSize: "13px",
                  marginTop: "0.25rem",
                  cursor: saving ? "not-allowed" : "pointer",
                  background: saved
                    ? "rgba(166,227,161,0.12)"
                    : "rgba(203,166,247,0.12)",
                  color: saved ? "#a6e3a1" : "#cba6f7",
                  border: `1px solid ${saved ? "rgba(166,227,161,0.25)" : "rgba(203,166,247,0.22)"}`,
                  boxShadow: saved
                    ? "0 0 30px rgba(166,227,161,0.08)"
                    : "0 0 30px rgba(203,166,247,0.06)",
                }}
              >
                {saving ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "14px",
                        height: "14px",
                        display: "inline-block",
                        borderRadius: "50%",
                        border: "1.5px solid rgba(203,166,247,0.3)",
                        borderTopColor: "#cba6f7",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Saving…
                  </span>
                ) : saved ? (
                  "✓  Saved"
                ) : (
                  "Save Changes"
                )}
              </button>

              {/* Save error */}
              {saveError && (
                <p
                  className="font-rajdhani"
                  style={{
                    fontSize: "12px",
                    color: "#f38ba8",
                    textAlign: "center",
                    marginTop: "-0.25rem",
                  }}
                >
                  ⚠ {saveError}
                </p>
              )}

              {/* Logout */}
              <button
                onClick={async () => {
                  await onLogout?.();
                }}
                className="font-orbitron font-bold uppercase tracking-widest rounded-2xl transition-all"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  fontSize: "12px",
                  cursor: "pointer",
                  background: "rgba(180,190,254,0.05)",
                  color: "#7f849c",
                  border: "1px solid rgba(180,190,254,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "14px" }}>⏻</span>
                Sign Out
              </button>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(180,190,254,0.06)",
                  margin: "0.25rem 0",
                }}
              />

              {/* Danger zone */}
              <div
                className="rounded-2xl"
                style={{
                  padding: "1.25rem 1.5rem",
                  background: "rgba(243,139,168,0.04)",
                  border: "1px solid rgba(243,139,168,0.12)",
                }}
              >
                <p
                  className="font-orbitron font-bold uppercase tracking-widest"
                  style={{
                    fontSize: "11px",
                    color: "#f38ba8",
                    marginBottom: "6px",
                  }}
                >
                  Danger Zone
                </p>
                <p
                  className="font-rajdhani"
                  style={{
                    fontSize: "12px",
                    color: "#585b70",
                    marginBottom: "14px",
                  }}
                >
                  Permanently delete your account and all data. This cannot be
                  undone.
                </p>
                {confirmDelete ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <p
                      className="font-rajdhani"
                      style={{ fontSize: "12px", color: "#f38ba8" }}
                    >
                      Type{" "}
                      <span style={{ fontWeight: 700, color: "#cdd6f4" }}>
                        @{form.username}
                      </span>{" "}
                      to confirm deletion.
                    </p>
                    <input
                      className="nexus-input"
                      placeholder={`@${form.username}`}
                      value={deleteConfirmInput}
                      onChange={(e) => setDeleteConfirmInput(e.target.value)}
                      style={{ borderColor: "rgba(243,139,168,0.25)" }}
                      autoFocus
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Btn
                        danger
                        onClick={() => {
                          setConfirmDelete(false);
                          setDeleteConfirmInput("");
                          onDelete?.();
                        }}
                        disabled={deleteConfirmInput !== form.username}
                      >
                        Yes, delete
                      </Btn>
                      <Btn
                        onClick={() => {
                          setConfirmDelete(false);
                          setDeleteConfirmInput("");
                        }}
                      >
                        Cancel
                      </Btn>
                    </div>
                  </div>
                ) : (
                  <Btn danger onClick={() => setConfirmDelete(true)}>
                    Delete Account
                  </Btn>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Helpers ── */

function LockIcon() {
  return (
    <span
      title="This field cannot be changed"
      style={{
        position: "absolute",
        right: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "12px",
        color: "#45475a",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      🔒
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label
        className="font-rajdhani uppercase tracking-[0.14em]"
        style={{ fontSize: "11px", color: "#585b70" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Btn({
  children,
  onClick,
  danger,
  cyan,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  cyan?: boolean;
  disabled?: boolean;
}) {
  const color = danger ? "#f38ba8" : cyan ? "#89dceb" : "#cba6f7";
  const bg = danger
    ? "rgba(243,139,168,0.1)"
    : cyan
      ? "rgba(137,220,235,0.1)"
      : "rgba(203,166,247,0.1)";
  const bdr = danger
    ? "rgba(243,139,168,0.2)"
    : cyan
      ? "rgba(137,220,235,0.2)"
      : "rgba(203,166,247,0.2)";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-rajdhani font-semibold uppercase tracking-widest rounded-xl"
      style={{
        padding: "7px 16px",
        fontSize: "11px",
        background: bg,
        color,
        border: `1px solid ${bdr}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}
