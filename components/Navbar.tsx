"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, ROLE_LABELS, ROLE_COLORS } from "@/context/AuthContext";
import { useSite, GradeLabels } from "@/context/SiteContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout, updateProfile } = useAuth();
  const { brand, navLinks, gradeLabels } = useSite();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", company: "" });
  const [profileSaved, setProfileSaved] = useState(false);

  const openProfile = () => {
    setProfileForm({ name: user?.name ?? "", company: user?.company ?? "" });
    setProfileSaved(false);
    setProfileOpen(true);
  };

  const saveProfile = () => {
    if (!profileForm.name.trim()) return;
    updateProfile({ name: profileForm.name.trim(), company: profileForm.company.trim() || undefined });
    setProfileSaved(true);
    setTimeout(() => setProfileOpen(false), 800);
  };

  const isAdmin = user?.role === "admin";
  // 대시보드는 admin만 노출, 나머지 링크는 전체 공개
  const baseLinks = isAdmin ? navLinks : navLinks.filter(l => l.href !== "/dashboard");
  const visibleLinks = isAdmin ? [...baseLinks, { href: "/admin", label: "관리자" }] : baseLinks;

  return (
    <>
    <nav
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0A0A0Aee 100%)", borderBottom: "1px solid #C9A84C30" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3">
          {brand.logoImageUrl ? (
            <img src={brand.logoImageUrl} alt="logo" style={{ height: 36, objectFit: "contain" }} />
          ) : (
            <div style={{ width: 36, height: 36, border: "1.5px solid #C9A84C", transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ transform: "rotate(-45deg)", color: "#C9A84C", fontWeight: 700, fontSize: 14 }}>P</span>
            </div>
          )}
          <span className="text-gold-gradient hidden sm:block" style={{ fontSize: 13, letterSpacing: "0.2em", fontWeight: 500 }}>
            {brand.logoText}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {visibleLinks.map((link) => {
            const isAdminLink = link.href === "/admin";
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? "#C9A84C" : isAdminLink ? "#C9A84C80" : "#8A8A7A",
                  borderBottom: isActive ? "1px solid #C9A84C" : isAdminLink ? "1px solid #C9A84C40" : "1px solid transparent",
                  letterSpacing: "0.08em",
                  fontSize: 13,
                  transition: "all 0.2s",
                  paddingBottom: 2,
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User info */}
        {user && (
          <div className="hidden md:flex items-center gap-4">
            <span style={{ padding: "2px 10px", border: `1px solid ${ROLE_COLORS[user.role]}`, color: ROLE_COLORS[user.role], fontSize: 11, letterSpacing: "0.1em" }}>
              {(user.role === "gold" || user.role === "silver" || user.role === "bronze") ? gradeLabels[user.role] : ROLE_LABELS[user.role]}
            </span>
            <button
              onClick={openProfile}
              style={{ color: "#C9A84C", fontSize: 13, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", textDecorationColor: "#C9A84C40", textUnderlineOffset: 3 }}
              title="프로필 수정"
            >
              {user.name}
            </button>
            <button
              onClick={logout}
              style={{ color: "#6A6A5A", fontSize: 12, border: "1px solid #2A2A2A", padding: "4px 12px", background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "#C9A84C50"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "#2A2A2A"; }}
            >
              로그아웃
            </button>
          </div>
        )}

        <button className="md:hidden" style={{ color: "#C9A84C", background: "none", border: "none", cursor: "pointer", fontSize: 22 }} onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ borderTop: "1px solid #C9A84C20", marginTop: 16, overflow: "hidden" }}>
            <div className="flex flex-col gap-4 pt-4 pb-2 px-2">
              {visibleLinks.map((link) => {
                const isAdminLink = link.href === "/admin";
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                    style={{ color: isActive ? "#C9A84C" : isAdminLink ? "#C9A84C80" : "#8A8A7A", fontSize: 14, textDecoration: "none" }}>
                    {link.label}
                  </Link>
                );
              })}
              {user && <button onClick={() => { logout(); setMenuOpen(false); }} style={{ color: "#6A6A5A", fontSize: 12, textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>로그아웃</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    {/* Profile edit modal */}
    <AnimatePresence>
      {profileOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setProfileOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            style={{ background: "#141414", border: "1px solid #C9A84C30", padding: "28px 32px", width: "100%", maxWidth: 400 }}
          >
            <h3 style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.2em", marginBottom: 22 }}>프로필 수정</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "#7A7A6A", fontSize: 11, letterSpacing: "0.1em", marginBottom: 7 }}>이름 *</label>
              <input
                className="input-premium"
                value={profileForm.name}
                onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                placeholder="이름을 입력하세요"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", color: "#7A7A6A", fontSize: 11, letterSpacing: "0.1em", marginBottom: 7 }}>소속 회사</label>
              <input
                className="input-premium"
                value={profileForm.company}
                onChange={e => setProfileForm(p => ({ ...p, company: e.target.value }))}
                placeholder="소속 회사 (선택)"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setProfileOpen(false)} style={{ padding: "9px 20px", background: "transparent", border: "1px solid #2A2A2A", color: "#6A6A5A", cursor: "pointer", fontSize: 12 }}>취소</button>
              <button
                onClick={saveProfile}
                disabled={!profileForm.name.trim()}
                className="btn-gold"
                style={{ padding: "9px 24px", fontSize: 12, letterSpacing: "0.1em", border: "none", cursor: "pointer", opacity: profileSaved ? 0.7 : 1 }}
              >
                {profileSaved ? "저장됨 ✓" : "저장하기"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
