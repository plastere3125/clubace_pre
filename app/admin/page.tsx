"use client";

import { useState, useEffect, useRef, ReactNode, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, ROLE_LABELS, ROLE_COLORS, UserRole } from "@/context/AuthContext";
import { useSite, Member } from "@/context/SiteContext";
import { Portfolio, Post } from "@/lib/mockData";

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, background: "#1A1A1A", border: "1px solid #C9A84C50", color: "#C9A84C", fontSize: 13, padding: "12px 20px", boxShadow: "0 4px 24px #C9A84C20" }}>
      ✓&nbsp;{msg}
    </motion.div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(4px)" }}>
      <motion.div onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        style={{ background: "#141414", border: "1px solid #C9A84C30", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #2A2A2A", position: "sticky", top: 0, background: "#141414", zIndex: 1 }}>
          <span style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.15em" }}>{title}</span>
          <button onClick={onClose} style={{ color: "#6A6A5A", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </motion.div>
    </div>
  );
}

const IS: React.CSSProperties = { width: "100%", background: "#0F0F0F", border: "1px solid #2A2A2A", color: "#F5F0E8", padding: "9px 12px", fontSize: 13, outline: "none" };
const ISF: React.CSSProperties = { ...IS, border: "1px solid #C9A84C60" };

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  const [focus, setFocus] = useState(false);
  return <input style={focus ? ISF : IS} value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={placeholder} type={type} />;
}
function Textarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const [focus, setFocus] = useState(false);
  return <textarea style={{ ...IS, ...(focus ? { border: "1px solid #C9A84C60" } : {}), resize: "vertical" }} value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={placeholder} rows={rows} />;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div style={{ marginBottom: 14 }}><label style={{ display: "block", color: "#7A7A6A", fontSize: 11, letterSpacing: "0.1em", marginBottom: 7 }}>{label}</label>{children}</div>;
}
function Btn({ children, onClick, variant = "gold", type = "button", disabled }: { children: ReactNode; onClick?: () => void; variant?: "gold" | "ghost" | "danger"; type?: "button" | "submit"; disabled?: boolean }) {
  const s = { gold: { background: "linear-gradient(135deg,#E8CC7A,#C9A84C)", color: "#0A0A0A", border: "none" }, ghost: { background: "transparent", color: "#8A8A7A", border: "1px solid #2A2A2A" }, danger: { background: "#3A1A1A", color: "#E08080", border: "1px solid #8A3A3A" } };
  return <button type={type} onClick={onClick} disabled={disabled} style={{ ...s[variant], padding: "8px 18px", fontSize: 12, letterSpacing: "0.08em", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.2s", fontWeight: 600 }}>{children}</button>;
}
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return <div style={{ marginBottom: 28 }}><h2 style={{ color: "#F5F0E8", fontSize: 20, fontWeight: 500, marginBottom: 6 }}>{title}</h2>{sub && <p style={{ color: "#5A5A4A", fontSize: 12 }}>{sub}</p>}<div className="gold-divider" style={{ marginTop: 16 }} /></div>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type Section = "overview" | "indexpage" | "brand" | "pagetexts" | "permissions" | "menu" | "portfolio" | "boards" | "members" | "support";
const MENU_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "overview",    label: "개요",         icon: "◎" },
  { id: "indexpage",   label: "인덱스 페이지", icon: "⊞" },
  { id: "brand",       label: "브랜드 설정",   icon: "◈" },
  { id: "pagetexts",   label: "페이지 텍스트", icon: "✎" },
  { id: "permissions", label: "등급 권한",     icon: "◑" },
  { id: "menu",        label: "메뉴 편집",     icon: "≡" },
  { id: "portfolio",   label: "포트폴리오",    icon: "◧" },
  { id: "boards",      label: "게시판 관리",   icon: "◻" },
  { id: "members",     label: "회원 관리",     icon: "◉" },
  { id: "support",     label: "고객센터",      icon: "◎" },
];

function Sidebar({ active, onChange }: { active: Section; onChange: (s: Section) => void }) {
  const { brand, pendingMembers } = useSite();
  return (
    <aside style={{ width: 220, minHeight: "100vh", background: "#0A0A0A", borderRight: "1px solid #1E1E1E", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          {brand.logoImageUrl
            ? <img src={brand.logoImageUrl} alt="" style={{ height: 26, objectFit: "contain" }} />
            : <div style={{ width: 26, height: 26, border: "1px solid #C9A84C", transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ transform: "rotate(-45deg)", color: "#C9A84C", fontSize: 11, fontWeight: 700 }}>P</span></div>
          }
          <span style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.12em", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{brand.logoText}</span>
        </div>
        <p style={{ color: "#2E2E2E", fontSize: 10, letterSpacing: "0.15em", paddingLeft: 36 }}>ADMIN PANEL</p>
      </div>
      <nav style={{ flex: 1, padding: "10px 0" }}>
        {MENU_ITEMS.map(item => (
          <button key={item.id} onClick={() => onChange(item.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", background: active === item.id ? "#C9A84C0D" : "transparent", borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: active === item.id ? "2px solid #C9A84C" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s", textAlign: "left" }}>
            <span style={{ color: active === item.id ? "#C9A84C" : "#4A4A4A", fontSize: 15 }}>{item.icon}</span>
            <span style={{ color: active === item.id ? "#E8D898" : "#7A7A6A", fontSize: 13 }}>{item.label}</span>
            {item.id === "members" && pendingMembers.length > 0 && (
              <span style={{ marginLeft: "auto", background: "#C9A84C", color: "#0A0A0A", borderRadius: "50%", width: 17, height: 17, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{pendingMembers.length}</span>
            )}
          </button>
        ))}
      </nav>
      <div style={{ padding: "14px 20px", borderTop: "1px solid #1A1A1A" }}>
        <p style={{ color: "#2E2E2E", fontSize: 10, letterSpacing: "0.15em", marginBottom: 10 }}>SITE NAVIGATION</p>
        {[
          { href: "/dashboard",  label: "대시보드" },
          { href: "/portfolio",  label: "포트폴리오" },
          { href: "/community",  label: "커뮤니티" },
        ].map(l => (
          <Link key={l.href} href={l.href} style={{ color: "#5A5A4A", fontSize: 12, display: "flex", alignItems: "center", gap: 8, padding: "6px 0", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={e => (e.currentTarget.style.color = "#5A5A4A")}>
            <span style={{ fontSize: 10 }}>›</span>{l.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

// ─── 개요 ─────────────────────────────────────────────────────────────────────

function OverviewSection({ onGo }: { onGo: (s: Section) => void }) {
  const { portfolios, posts, members, pendingMembers } = useSite();
  const stats = [
    { label: "총 포트폴리오", value: portfolios.length, s: "portfolio" as Section },
    { label: "총 게시글",     value: posts.length,      s: "boards"    as Section },
    { label: "총 회원",       value: members.length,    s: "members"   as Section },
    { label: "승인 대기",     value: pendingMembers.length, s: "members" as Section, warn: pendingMembers.length > 0 },
  ];
  return (
    <div>
      <SectionHeader title="개요" sub="플랫폼 현황을 한눈에 확인합니다." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "#1A1A1A", marginBottom: 36 }}>
        {stats.map(s => (
          <div key={s.label} onClick={() => onGo(s.s)} style={{ background: "#141414", padding: "28px 22px", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1C1C1C")} onMouseLeave={e => (e.currentTarget.style.background = "#141414")}>
            <div style={{ color: s.warn ? "#E89090" : "#C9A84C", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>{s.value}</div>
            <div style={{ color: "#5A5A4A", fontSize: 12, letterSpacing: "0.08em" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {MENU_ITEMS.filter(m => m.id !== "overview").map(m => (
          <div key={m.id} onClick={() => onGo(m.id)} className="card-glow" style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: "#C9A84C", fontSize: 20 }}>{m.icon}</span>
            <span style={{ color: "#C0BAA8", fontSize: 14 }}>{m.label}</span>
            <span style={{ marginLeft: "auto", color: "#3A3A3A", fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 인덱스 페이지 ────────────────────────────────────────────────────────────

function IndexPageSection({ toast }: { toast: (m: string) => void }) {
  const { brand, updateBrand, pageTexts, updatePageTexts } = useSite();
  const fileRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState(brand.logoText);
  const [tagline, setTagline] = useState(brand.tagline);
  const [preview, setPreview] = useState<string | null>(brand.logoImageUrl);
  const [showDemo, setShowDemo] = useState(brand.showDemoAccounts ?? true);

  const [ageText, setAgeText] = useState(pageTexts.loginAgeText);
  const [ageSub, setAgeSub] = useState(pageTexts.loginAgeSubText);
  const [btnText, setBtnText] = useState(pageTexts.loginButtonText);
  const [regText, setRegText] = useState(pageTexts.loginRegisterText);
  const [regLink, setRegLink] = useState(pageTexts.loginRegisterLink);

  useEffect(() => {
    setLogo(brand.logoText); setTagline(brand.tagline); setPreview(brand.logoImageUrl); setShowDemo(brand.showDemoAccounts ?? true);
  }, [brand]);
  useEffect(() => {
    setAgeText(pageTexts.loginAgeText); setAgeSub(pageTexts.loginAgeSubText);
    setBtnText(pageTexts.loginButtonText); setRegText(pageTexts.loginRegisterText); setRegLink(pageTexts.loginRegisterLink);
  }, [pageTexts]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { const b64 = ev.target?.result as string; setPreview(b64); updateBrand({ logoImageUrl: b64 }); toast("로고 이미지 업로드 완료"); };
    reader.readAsDataURL(file);
  };

  const saveBrand = () => {
    updateBrand({ logoText: logo, tagline, showDemoAccounts: showDemo });
    toast("로고/태그라인 저장 완료");
  };

  const saveTexts = () => {
    updatePageTexts({ loginAgeText: ageText, loginAgeSubText: ageSub, loginButtonText: btnText, loginRegisterText: regText, loginRegisterLink: regLink });
    toast("로그인 텍스트 저장 완료");
  };

  return (
    <div>
      <SectionHeader title="인덱스 페이지 편집" sub="로그인 페이지(메인)의 로고, 텍스트, 옵션을 수정합니다. 저장 즉시 반영됩니다." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>

        {/* 로고 & 브랜드 */}
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "20px 22px" }}>
          <p style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.15em", marginBottom: 18 }}>로고 · 브랜드명</p>
          <Field label="로고 이미지">
            <div style={{ background: "#0F0F0F", border: "1px solid #222", padding: 16, textAlign: "center", marginBottom: 8, minHeight: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {preview
                ? <img src={preview} alt="" style={{ maxHeight: 60, maxWidth: "100%", objectFit: "contain" }} />
                : <span style={{ color: "#3A3A3A", fontSize: 11 }}>이미지 없음</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => fileRef.current?.click()}>업로드</Btn>
              {preview && <Btn variant="danger" onClick={() => { setPreview(null); updateBrand({ logoImageUrl: null }); toast("로고 이미지 제거"); }}>제거</Btn>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
          </Field>
          <Field label="브랜드명 (로고 하단 텍스트)"><Input value={logo} onChange={setLogo} placeholder="COMPANY LOGO" /></Field>
          <Field label="태그라인"><Input value={tagline} onChange={setTagline} placeholder="PREMIUM BUSINESS NETWORK" /></Field>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <input type="checkbox" id="demo-toggle" checked={showDemo} onChange={e => setShowDemo(e.target.checked)} style={{ accentColor: "#C9A84C", width: 16, height: 16 }} />
            <label htmlFor="demo-toggle" style={{ color: "#9A9A8A", fontSize: 13, cursor: "pointer" }}>테스트 계정 표시 (개발용)</label>
          </div>
          <Btn onClick={saveBrand}>저장하기</Btn>
        </div>

        {/* 로그인 텍스트 */}
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "20px 22px" }}>
          <p style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.15em", marginBottom: 18 }}>로그인 폼 텍스트</p>
          <Field label="성인 인증 문구"><Input value={ageText} onChange={setAgeText} /></Field>
          <Field label="성인 인증 보조 문구"><Input value={ageSub} onChange={setAgeSub} /></Field>
          <Field label="로그인 버튼 텍스트"><Input value={btnText} onChange={setBtnText} /></Field>
          <Field label="회원가입 안내 문구"><Input value={regText} onChange={setRegText} /></Field>
          <Field label="회원가입 링크 텍스트"><Input value={regLink} onChange={setRegLink} /></Field>
          <Btn onClick={saveTexts}>저장하기</Btn>
        </div>
      </div>

      {/* 실시간 미리보기 */}
      <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", padding: "32px 24px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: 360, width: "100%" }}>
          <p style={{ color: "#2E2E2E", fontSize: 10, letterSpacing: "0.2em", textAlign: "center", marginBottom: 20 }}>PREVIEW</p>
          {/* 로고 */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            {preview
              ? <img src={preview} alt="" style={{ height: 48, objectFit: "contain", marginBottom: 10 }} />
              : <div style={{ width: 44, height: 44, border: "1.5px solid #C9A84C", transform: "rotate(45deg)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <span style={{ transform: "rotate(-45deg)", color: "#C9A84C", fontSize: 16 }}>{logo?.[0] ?? "P"}</span>
                </div>
            }
            <p style={{ color: "#C9A84C", fontSize: 10, letterSpacing: "0.3em", marginBottom: 4 }}>{logo || "COMPANY LOGO"}</p>
            <p style={{ color: "#5A5A4A", fontSize: 10, letterSpacing: "0.08em" }}>{tagline || "PREMIUM BUSINESS NETWORK"}</p>
          </div>
          <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#C9A84C60,transparent)", marginBottom: 20 }} />
          {/* 폼 skeleton */}
          <div style={{ background: "#141414", border: "1px solid #333", borderRadius: 1, padding: "10px 14px", marginBottom: 10 }}>
            <p style={{ color: "#4A4A4A", fontSize: 10, marginBottom: 4 }}>이메일</p>
            <div style={{ height: 8, background: "#1E1E1E", borderRadius: 1 }} />
          </div>
          <div style={{ background: "#141414", border: "1px solid #333", borderRadius: 1, padding: "10px 14px", marginBottom: 10 }}>
            <p style={{ color: "#4A4A4A", fontSize: 10, marginBottom: 4 }}>비밀번호</p>
            <div style={{ height: 8, background: "#1E1E1E", borderRadius: 1 }} />
          </div>
          <div style={{ border: "1px solid #333", padding: "8px 10px", marginBottom: 10 }}>
            <p style={{ color: "#6A6A5A", fontSize: 10, lineHeight: 1.5 }}>{ageText}</p>
            <p style={{ color: "#3A3A3A", fontSize: 10 }}>{ageSub}</p>
          </div>
          <div style={{ background: "linear-gradient(135deg,#E8CC7A,#C9A84C)", padding: "10px", textAlign: "center" }}>
            <p style={{ color: "#0A0A0A", fontSize: 11, letterSpacing: "0.15em", fontWeight: 700 }}>{btnText}</p>
          </div>
          <p style={{ color: "#4A4A4A", fontSize: 10, textAlign: "center", marginTop: 12 }}>
            {regText} <span style={{ color: "#C9A84C" }}>{regLink}</span>
          </p>
          {showDemo && (
            <div style={{ marginTop: 12, border: "1px solid #1A1A1A", padding: "8px 10px" }}>
              <p style={{ color: "#2E2E2E", fontSize: 9, letterSpacing: "0.15em", marginBottom: 4 }}>TEST ACCOUNTS</p>
              {["ADMIN","GOLD","SILVER","BRONZE"].map(r => (
                <div key={r} style={{ display: "flex", gap: 8, padding: "2px 0", borderBottom: "1px solid #161616" }}>
                  <span style={{ color: "#C9A84C40", fontSize: 9, minWidth: 40 }}>{r}</span>
                  <span style={{ color: "#2A2A2A", fontSize: 9 }}>{r.toLowerCase()}@premium.com</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 브랜드 ───────────────────────────────────────────────────────────────────

function BrandSection({ toast }: { toast: (m: string) => void }) {
  const { brand, updateBrand } = useSite();
  const [logoText, setLogoText] = useState(brand.logoText);
  const [tagline, setTagline] = useState(brand.tagline);
  const [preview, setPreview] = useState<string | null>(brand.logoImageUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLogoText(brand.logoText); setTagline(brand.tagline); setPreview(brand.logoImageUrl); }, [brand]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { const b64 = ev.target?.result as string; setPreview(b64); updateBrand({ logoImageUrl: b64 }); toast("로고 이미지 업데이트 완료"); };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <SectionHeader title="브랜드 설정" sub="저장 즉시 헤더 및 전체 사이트에 반영됩니다." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <div>
          <Field label="로고 텍스트"><Input value={logoText} onChange={setLogoText} placeholder="COMPANY LOGO" /></Field>
          <Field label="태그라인"><Input value={tagline} onChange={setTagline} placeholder="PREMIUM BUSINESS NETWORK" /></Field>
          <Btn onClick={() => { updateBrand({ logoText, tagline }); toast("브랜드 설정 저장 완료"); }}>저장하기</Btn>
        </div>
        <div>
          <Field label="로고 이미지">
            <div style={{ background: "#0F0F0F", border: "1px solid #2A2A2A", padding: 20, textAlign: "center", marginBottom: 10, minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {preview ? <img src={preview} alt="" style={{ maxHeight: 70, maxWidth: "100%", objectFit: "contain" }} /> : <span style={{ color: "#3A3A3A", fontSize: 12 }}>이미지 없음 (텍스트 로고 사용 중)</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => fileRef.current?.click()}>이미지 업로드</Btn>
              {preview && <Btn variant="danger" onClick={() => { setPreview(null); updateBrand({ logoImageUrl: null }); toast("로고 이미지 제거"); }}>제거</Btn>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            <p style={{ color: "#3A3A3A", fontSize: 11, marginTop: 8 }}>PNG · SVG · JPG 권장 — 헤더에 자동 적용</p>
          </Field>
        </div>
      </div>
      <div style={{ marginTop: 28, padding: "18px 22px", background: "#0F0F0F", border: "1px solid #1A1A1A" }}>
        <p style={{ color: "#2E2E2E", fontSize: 10, letterSpacing: "0.15em", marginBottom: 12 }}>헤더 미리보기</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {preview ? <img src={preview} alt="" style={{ height: 30, objectFit: "contain" }} />
            : <div style={{ width: 28, height: 28, border: "1.5px solid #C9A84C", transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ transform: "rotate(-45deg)", color: "#C9A84C", fontSize: 11 }}>P</span></div>}
          <div>
            <p style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.2em" }}>{logoText || "COMPANY LOGO"}</p>
            <p style={{ color: "#4A4A4A", fontSize: 10, marginTop: 2 }}>{tagline || "PREMIUM BUSINESS NETWORK"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 메뉴 편집 ────────────────────────────────────────────────────────────────

function MenuSection({ toast }: { toast: (m: string) => void }) {
  const { navLinks, updateNavLink } = useSite();
  const [labels, setLabels] = useState(navLinks.map(l => l.label));
  useEffect(() => { setLabels(navLinks.map(l => l.label)); }, [navLinks]);

  return (
    <div>
      <SectionHeader title="메뉴 편집" sub="네비게이션 메뉴 이름을 수정합니다. 저장 즉시 반영됩니다." />
      <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A" }}>
        {navLinks.map((link, i) => (
          <div key={link.href} style={{ background: "#141414", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#C9A84C40", fontSize: 11, minWidth: 110 }}>{link.href}</span>
            <input style={{ ...IS, flex: 1, fontSize: 14 }} value={labels[i] ?? ""} onChange={e => { const v = [...labels]; v[i] = e.target.value; setLabels(v); }} />
            <Btn onClick={() => { updateNavLink(i, labels[i]); toast(`메뉴 "${labels[i]}" 저장 완료`); }}>저장</Btn>
          </div>
        ))}
      </div>
      <p style={{ color: "#3A3A3A", fontSize: 11, marginTop: 12 }}>* 메뉴 경로(URL)는 변경할 수 없습니다.</p>
    </div>
  );
}

// ─── 포트폴리오 ───────────────────────────────────────────────────────────────

const EP: Omit<Portfolio, "id"> = { title: "", company: "", category: "1등급", industry: "IT", description: "", fullDescription: "", tags: [], imageUrl: "", contact: "", location: "", established: "", revenue: "", employees: "", memberOnly: false, manager: "", employmentType: "", salary: "", benefits: [], kakaoUrl: "", telegramUrl: "", detailImages: [] };

function PortfolioSection({ toast }: { toast: (m: string) => void }) {
  const { portfolios, addPortfolio, updatePortfolio, deletePortfolio, industries, addIndustry, removeIndustry, portfolioTierLabels, updatePortfolioTierLabel } = useSite();
  const [tierInputs, setTierInputs] = useState<Record<string, string>>({
    "1등급": portfolioTierLabels["1등급"],
    "2등급": portfolioTierLabels["2등급"],
    "3등급": portfolioTierLabels["3등급"],
    "4등급": portfolioTierLabels["4등급"],
  });
  useEffect(() => {
    setTierInputs({
      "1등급": portfolioTierLabels["1등급"],
      "2등급": portfolioTierLabels["2등급"],
      "3등급": portfolioTierLabels["3등급"],
      "4등급": portfolioTierLabels["4등급"],
    });
  }, [portfolioTierLabels]);
  const saveTierLabel = (tier: "1등급" | "2등급" | "3등급" | "4등급") => {
    const val = tierInputs[tier].trim();
    if (!val) return;
    updatePortfolioTierLabel(tier, val);
    toast(`${tier} 이름 저장 완료`);
  };
  const [modal, setModal] = useState<"add" | Portfolio | null>(null);
  const [form, setForm] = useState<Omit<Portfolio, "id"> & { tagsStr: string; benefitsStr: string; detailImagesStr: string }>({ ...EP, tagsStr: "", benefitsStr: "", detailImagesStr: "" });
  const [search, setSearch] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  const open = (p?: Portfolio) => {
    if (p) setForm({
      ...p,
      tagsStr: p.tags.join(", "),
      benefitsStr: (p.benefits || []).join(", "),
      detailImagesStr: (p.detailImages || []).join("\n"),
    });
    else setForm({ ...EP, tagsStr: "", benefitsStr: "", detailImagesStr: "" });
    setModal(p ?? "add");
  };

  const save = () => {
    const tags = form.tagsStr.split(",").map(t => t.trim()).filter(Boolean);
    const benefits = form.benefitsStr.split(",").map(t => t.trim()).filter(Boolean);
    const detailImages = form.detailImagesStr.split("\n").map(t => t.trim()).filter(Boolean);
    const data = { ...form, tags, benefits, detailImages };
    if (modal === "add") { addPortfolio(data); toast("포트폴리오 추가 완료"); }
    else { updatePortfolio((modal as Portfolio).id, data); toast("포트폴리오 수정 완료"); }
    setModal(null);
  };

  const del = (id: string) => { if (!confirm("삭제하시겠습니까?")) return; deletePortfolio(id); toast("삭제 완료"); };
  const f = (k: keyof typeof form) => (v: string | boolean) => setForm(p => ({ ...p, [k]: v }));
  const filtered = portfolios.filter(p => !search || p.title.includes(search) || p.company.includes(search));

  const handleAddIndustry = () => {
    const trimmed = newIndustry.trim();
    if (!trimmed) return;
    addIndustry(trimmed);
    setNewIndustry("");
    toast(`업종 "${trimmed}" 추가 완료`);
  };

  return (
    <div>
      <SectionHeader title="포트폴리오 관리" sub={`총 ${portfolios.length}개 · 추가/수정/삭제 즉시 메인 화면에 반영됩니다.`} />

      {/* 포트폴리오 등급 이름 편집 */}
      <div style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "18px 20px", marginBottom: 24 }}>
        <p style={{ color: "#7A7A6A", fontSize: 11, letterSpacing: "0.12em", marginBottom: 14 }}>포트폴리오 등급 이름 편집</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {(["1등급", "2등급", "3등급", "4등급"] as const).map(tier => (
            <div key={tier} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: "#5A5A4A", fontSize: 11, letterSpacing: "0.1em" }}>
                {tier}
                {portfolioTierLabels[tier] !== tier && (
                  <span style={{ color: "#C9A84C", marginLeft: 8 }}>→ {portfolioTierLabels[tier]}</span>
                )}
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ ...IS, flex: 1 }}
                  value={tierInputs[tier]}
                  onChange={e => setTierInputs(prev => ({ ...prev, [tier]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && saveTierLabel(tier)}
                  placeholder={`예) VIP, 프리미엄, 일반 ...`}
                />
                <Btn onClick={() => saveTierLabel(tier)}>저장</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 업종 카테고리 관리 */}
      <div style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "18px 20px", marginBottom: 24 }}>
        <p style={{ color: "#7A7A6A", fontSize: 11, letterSpacing: "0.12em", marginBottom: 14 }}>업종 카테고리 관리</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {industries.map(ind => (
            <span key={ind} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1E1E1E", border: "1px solid #2E2E2E", padding: "4px 10px", fontSize: 12, color: "#C0BAA8" }}>
              {ind}
              <button onClick={() => { removeIndustry(ind); toast(`업종 "${ind}" 삭제 완료`); }}
                style={{ background: "none", border: "none", color: "#5A5A4A", cursor: "pointer", fontSize: 13, lineHeight: 1, padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E08080")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5A5A4A")}>✕</button>
            </span>
          ))}
          {industries.length === 0 && <span style={{ color: "#3A3A3A", fontSize: 12 }}>등록된 업종이 없습니다.</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ ...IS, maxWidth: 200 }}
            value={newIndustry}
            onChange={e => setNewIndustry(e.target.value)}
            placeholder="새 업종 입력"
            onKeyDown={e => e.key === "Enter" && handleAddIndustry()}
          />
          <Btn onClick={handleAddIndustry} disabled={!newIndustry.trim()}>+ 추가</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
        <input style={{ ...IS, maxWidth: 240 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="제목, 회사명 검색" />
        <Btn onClick={() => open()}>+ 추가</Btn>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid #2A2A2A" }}>{["이미지","제목","카테고리","업종","멤버전용","액션"].map(h => <th key={h} style={{ color: "#4A4A4A", fontSize: 11, padding: "10px 14px", textAlign: "left", fontWeight: 400 }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #181818", background: i % 2 === 0 ? "#141414" : "#111111" }}>
                <td style={{ padding: "10px 14px" }}><img src={p.imageUrl} alt="" style={{ width: 48, height: 32, objectFit: "cover" }} /></td>
                <td style={{ padding: "10px 14px" }}><p style={{ color: "#F5F0E8", fontSize: 13 }}>{p.title}</p><p style={{ color: "#4A4A4A", fontSize: 11 }}>{p.company}</p></td>
                <td style={{ padding: "10px 14px", color: "#C9A84C", fontSize: 12 }}>{portfolioTierLabels[p.category as keyof typeof portfolioTierLabels] ?? p.category}</td>
                <td style={{ padding: "10px 14px", color: "#7A7A6A", fontSize: 12 }}>{p.industry}</td>
                <td style={{ padding: "10px 14px", color: p.memberOnly ? "#C9A84C" : "#3A3A3A", fontSize: 12 }}>{p.memberOnly ? "Y" : "—"}</td>
                <td style={{ padding: "10px 14px" }}><div style={{ display: "flex", gap: 6 }}><Btn variant="ghost" onClick={() => open(p)}>수정</Btn><Btn variant="danger" onClick={() => del(p.id)}>삭제</Btn></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#3A3A3A", fontSize: 12 }}>결과 없음</div>}
      </div>

      <AnimatePresence>
        {modal !== null && (
          <Modal title={modal === "add" ? "포트폴리오 추가" : "포트폴리오 수정"} onClose={() => setModal(null)}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="제목 *"><Input value={form.title} onChange={f("title")} /></Field>
              <Field label="회사명 *"><Input value={form.company} onChange={f("company")} /></Field>
              <Field label="카테고리 (등급)">
                <select style={{ ...IS }} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {(["1등급", "2등급", "3등급", "4등급"] as const).map(tier => (
                    <option key={tier} value={tier}>{portfolioTierLabels[tier]}</option>
                  ))}
                </select>
              </Field>
              <Field label="업종">
                <select style={{ ...IS }} value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  {!industries.includes(form.industry) && form.industry && <option value={form.industry}>{form.industry}</option>}
                </select>
              </Field>
              <Field label="위치"><Input value={form.location} onChange={f("location")} placeholder="서울 강남" /></Field>
              <Field label="설립연도"><Input value={form.established} onChange={f("established")} placeholder="2015년" /></Field>
            </div>
            <Field label="대표 썸네일">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* 미리보기 */}
                {form.imageUrl && (
                  <div style={{ position: "relative", width: "100%", height: 140, background: "#0E0E0E", border: "1px solid #2A2A2A", overflow: "hidden" }}>
                    <img src={form.imageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      onClick={() => setForm(p => ({ ...p, imageUrl: "" }))}
                      style={{ position: "absolute", top: 6, right: 6, background: "#000000cc", border: "1px solid #3A3A3A", color: "#C9A84C", fontSize: 11, padding: "3px 8px", cursor: "pointer" }}
                    >✕ 삭제</button>
                  </div>
                )}
                {/* 파일 업로드 버튼 */}
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#1A1A1A", border: "1px solid #2E2E2E", color: "#C0BAA8", fontSize: 12, cursor: "pointer", letterSpacing: "0.05em", width: "fit-content" }}>
                  📁 파일 업로드
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setForm(p => ({ ...p, imageUrl: ev.target?.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                {/* 또는 URL 직접 입력 */}
                <Input value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl} onChange={f("imageUrl")} placeholder="또는 이미지 URL 직접 입력 (https://...)" />
              </div>
            </Field>
            <Field label="연락처"><Input value={form.contact} onChange={f("contact")} placeholder="010-0000-0000" /></Field>
            <Field label="담당자"><Input value={form.manager || ""} onChange={f("manager")} placeholder="홍길동" /></Field>
            <Field label="고용형태"><Input value={form.employmentType || ""} onChange={f("employmentType")} placeholder="정규직, 계약직, 프리랜서 등" /></Field>
            <Field label="급여조건"><Input value={form.salary || ""} onChange={f("salary")} placeholder="면접 후 협의, 월 300만원 이상 등" /></Field>
            <Field label="편의사항 (쉼표 구분)"><Input value={form.benefitsStr} onChange={f("benefitsStr")} placeholder="4대보험, 주5일, 식대 지원" /></Field>
            <Field label="카카오톡 채팅 URL"><Input value={form.kakaoUrl || ""} onChange={f("kakaoUrl")} placeholder="https://open.kakao.com/..." /></Field>
            <Field label="텔레그램 URL"><Input value={form.telegramUrl || ""} onChange={f("telegramUrl")} placeholder="https://t.me/..." /></Field>
            <Field label="간략 설명"><Textarea value={form.description} onChange={f("description")} rows={2} /></Field>
            <Field label="상세 설명 (텍스트)"><Textarea value={form.fullDescription} onChange={f("fullDescription")} rows={3} /></Field>
            <Field label="상세 이미지 URL (한 줄에 하나씩)"><Textarea value={form.detailImagesStr} onChange={f("detailImagesStr")} rows={4} placeholder={"https://example.com/img1.jpg\nhttps://example.com/img2.jpg"} /></Field>
            <Field label="태그 (쉼표 구분)"><Input value={form.tagsStr} onChange={f("tagsStr")} placeholder="투자, 바이오, M&A" /></Field>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <input type="checkbox" checked={form.memberOnly} onChange={e => setForm(p => ({ ...p, memberOnly: e.target.checked }))} id="mo" style={{ accentColor: "#C9A84C", width: 16, height: 16 }} />
              <label htmlFor="mo" style={{ color: "#9A9A8A", fontSize: 13, cursor: "pointer" }}>멤버 전용 표시</label>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>취소</Btn>
              <Btn onClick={save} disabled={!form.title || !form.company}>저장하기</Btn>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 페이지 텍스트 ────────────────────────────────────────────────────────────

function PageTextsSection({ toast }: { toast: (m: string) => void }) {
  const { pageTexts, updatePageTexts } = useSite();
  const [form, setForm] = useState({ ...pageTexts });

  const f = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const pages: { label: string; fields: { key: keyof typeof form; label: string }[] }[] = [
    {
      label: "로그인 페이지",
      fields: [
        { key: "loginAgeText",      label: "성인 인증 문구" },
        { key: "loginAgeSubText",   label: "성인 인증 보조 문구" },
        { key: "loginButtonText",   label: "로그인 버튼 텍스트" },
        { key: "loginRegisterText", label: "회원가입 안내 문구" },
        { key: "loginRegisterLink", label: "회원가입 링크 텍스트" },
      ],
    },
    {
      label: "대시보드",
      fields: [
        { key: "dashWelcome",       label: "환영 라벨 (영문)" },
        { key: "dashFeaturedTitle", label: "포트폴리오 섹션 제목" },
        { key: "dashRecentTitle",   label: "최근 게시글 섹션 제목" },
        { key: "dashBoardsTitle",   label: "커뮤니티 섹션 제목" },
      ],
    },
    {
      label: "포트폴리오 페이지",
      fields: [
        { key: "portfolioLabel",     label: "상단 라벨 (영문)" },
        { key: "portfolioTitle",     label: "페이지 제목" },
        { key: "portfolioSubSuffix", label: "부제 (앞에 갯수 자동 표시)" },
      ],
    },
    {
      label: "커뮤니티 페이지",
      fields: [
        { key: "communityLabel",       label: "상단 라벨 (영문)" },
        { key: "communityTitle",       label: "페이지 제목" },
        { key: "communityRecentTitle", label: "최근 활동 섹션 제목" },
      ],
    },
  ];

  return (
    <div>
      <SectionHeader title="페이지 텍스트" sub="각 페이지의 제목과 텍스트를 수정합니다. 저장 즉시 반영됩니다." />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {pages.map(page => (
          <div key={page.label} style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "20px 22px" }}>
            <p style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.15em", marginBottom: 16 }}>{page.label.toUpperCase()}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {page.fields.map(({ key, label }) => (
                <Field key={key} label={label}>
                  <Input value={form[key]} onChange={f(key)} />
                </Field>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <Btn onClick={() => {
                const subset = page.fields.reduce((acc, { key }) => ({ ...acc, [key]: form[key] }), {});
                updatePageTexts(subset);
                toast(`${page.label} 저장 완료`);
              }}>저장</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 등급 권한 ────────────────────────────────────────────────────────────────

const BOARD_LABELS: Record<string, string> = {
  lounge: "멤버 라운지",
  deal: "딜 제안",
  insight: "비즈니스 인사이트",
  network: "네트워킹",
};
const ALL_BOARDS_LIST = ["lounge", "deal", "insight", "network"];

function PermissionsSection({ toast }: { toast: (m: string) => void }) {
  const { gradePermissions, updateGradePermission, gradeLabels, updateGradeLabel, boards } = useSite();
  const grades: ("gold" | "silver" | "bronze")[] = ["gold", "silver", "bronze"];
  const gradeColors: Record<string, string> = { gold: "#FFD700", silver: "#C0C0C0", bronze: "#CD7F32" };
  const [labelInputs, setLabelInputs] = useState<Record<string, string>>({
    gold: gradeLabels.gold,
    silver: gradeLabels.silver,
    bronze: gradeLabels.bronze,
  });

  const toggle = (grade: "gold" | "silver" | "bronze", key: keyof Omit<typeof gradePermissions["gold"], "accessibleBoards">) => {
    updateGradePermission(grade, { [key]: !gradePermissions[grade][key] });
    toast(`${gradeLabels[grade]} 권한 업데이트`);
  };

  const toggleBoard = (grade: "gold" | "silver" | "bronze", boardId: string) => {
    const current = gradePermissions[grade].accessibleBoards;
    const next = current.includes(boardId) ? current.filter(b => b !== boardId) : [...current, boardId];
    updateGradePermission(grade, { accessibleBoards: next });
    toast(`${gradeLabels[grade]} 게시판 권한 업데이트`);
  };

  const saveLabel = (grade: "gold" | "silver" | "bronze") => {
    const trimmed = labelInputs[grade].trim();
    if (!trimmed) return;
    updateGradeLabel(grade, trimmed);
    toast(`${trimmed} 등급명 저장 완료`);
  };

  const PERMS: { key: keyof Omit<typeof gradePermissions["gold"], "accessibleBoards">; label: string }[] = [
    { key: "canViewPortfolio",  label: "포트폴리오 열람" },
    { key: "canViewMemberOnly", label: "멤버전용 콘텐츠 열람" },
    { key: "canViewContact",    label: "연락처 열람" },
    { key: "canWritePost",      label: "게시글 작성" },
  ];

  return (
    <div>
      <SectionHeader title="등급 권한 관리" sub="각 회원 등급별 접근 및 사용 권한을 설정합니다. 변경 즉시 반영됩니다." />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {grades.map(grade => (
          <div key={grade} style={{ background: "#141414", border: `1px solid ${gradeColors[grade]}20`, padding: "20px 24px" }}>
            {/* 등급명 편집 */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ color: gradeColors[grade], fontSize: 11, minWidth: 52 }}>등급명</span>
              <input
                value={labelInputs[grade]}
                onChange={e => setLabelInputs(p => ({ ...p, [grade]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && saveLabel(grade)}
                style={{ background: "#0F0F0F", border: `1px solid ${gradeColors[grade]}40`, color: gradeColors[grade], padding: "5px 10px", fontSize: 13, letterSpacing: "0.1em", width: 140, outline: "none", fontWeight: 600 }}
              />
              <button
                onClick={() => saveLabel(grade)}
                disabled={!labelInputs[grade].trim() || labelInputs[grade].trim() === gradeLabels[grade]}
                style={{ padding: "5px 14px", background: gradeColors[grade], color: "#0A0A0A", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", opacity: (!labelInputs[grade].trim() || labelInputs[grade].trim() === gradeLabels[grade]) ? 0.4 : 1 }}
              >
                저장
              </button>
              <span style={{ padding: "3px 12px", border: `1px solid ${gradeColors[grade]}60`, color: gradeColors[grade], fontSize: 10, letterSpacing: "0.12em", marginLeft: 4 }}>
                현재: {gradeLabels[grade]}
              </span>
            </div>

            {/* 접근/사용 권한 토글 */}
            <p style={{ color: "#5A5A4A", fontSize: 10, letterSpacing: "0.15em", marginBottom: 12 }}>접근 · 사용 권한</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 18 }}>
              {PERMS.map(({ key, label }) => {
                const on = gradePermissions[grade][key] as boolean;
                return (
                  <div key={key} onClick={() => toggle(grade, key)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: on ? "#1A2A1A" : "#1A1A1A", border: `1px solid ${on ? "#3A6A3A" : "#2A2A2A"}`, cursor: "pointer", transition: "all 0.15s" }}>
                    <span style={{ color: on ? "#80C880" : "#5A5A4A", fontSize: 12 }}>{label}</span>
                    <span style={{ color: on ? "#80C880" : "#3A3A3A", fontSize: 12, fontWeight: 600 }}>{on ? "ON" : "OFF"}</span>
                  </div>
                );
              })}
            </div>

            {/* 게시판 접근 */}
            <p style={{ color: "#5A5A4A", fontSize: 10, letterSpacing: "0.15em", marginBottom: 12 }}>게시판 접근 권한</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {boards.map(b => {
                const on = gradePermissions[grade].accessibleBoards.includes(b.id);
                return (
                  <button key={b.id} onClick={() => toggleBoard(grade, b.id)}
                    style={{ padding: "6px 14px", background: on ? "#1A2A1A" : "transparent", border: `1px solid ${on ? "#3A6A3A" : "#2A2A2A"}`, color: on ? "#80C880" : "#4A4A4A", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
                    {b.icon}&nbsp;{b.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: "#3A3A3A", fontSize: 11, marginTop: 14 }}>* 관리자(ADMIN) 등급은 모든 권한이 자동 부여됩니다.</p>
    </div>
  );
}

// ─── 게시판 관리 ──────────────────────────────────────────────────────────────

function BoardsSection({ toast }: { toast: (m: string) => void }) {
  const { posts, addPost, updatePost, deletePost, boards, updateBoard } = useSite();
  const [boardId, setBoardId] = useState(boards[0]?.id ?? "lounge");
  const [modal, setModal] = useState<"add" | Post | null>(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [editingBoard, setEditingBoard] = useState<string | null>(null);
  const [boardForm, setBoardForm] = useState({ name: "", description: "", icon: "" });

  const boardPosts = posts.filter(p => p.boardId === boardId);
  const board = boards.find(b => b.id === boardId)!;

  const open = (p?: Post) => { setForm(p ? { title: p.title, content: p.content, tags: p.tags?.join(", ") || "" } : { title: "", content: "", tags: "" }); setModal(p ?? "add"); };
  const save = () => {
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    if (modal === "add") { addPost({ boardId, title: form.title, content: form.content, author: "관리자", authorRole: "admin", createdAt: new Date().toISOString().split("T")[0], views: 0, tags }); toast("게시글 등록 완료"); }
    else { updatePost((modal as Post).id, { title: form.title, content: form.content, tags }); toast("게시글 수정 완료"); }
    setModal(null);
  };
  const del = (id: string) => { if (!confirm("삭제하시겠습니까?")) return; deletePost(id); toast("삭제 완료"); };

  const openBoardEdit = (b: typeof boards[0]) => {
    setBoardForm({ name: b.name, description: b.description, icon: b.icon });
    setEditingBoard(b.id);
  };
  const saveBoardEdit = () => {
    if (!editingBoard || !boardForm.name.trim()) return;
    updateBoard(editingBoard, { name: boardForm.name.trim(), description: boardForm.description.trim(), icon: boardForm.icon.trim() || "◆" });
    toast(`"${boardForm.name.trim()}" 게시판 이름 저장 완료`);
    setEditingBoard(null);
  };

  return (
    <div>
      <SectionHeader title="게시판 관리" sub="게시판 이름/설명/아이콘 수정 및 게시글을 관리합니다." />

      {/* 게시판 이름 편집 */}
      <div style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "18px 20px", marginBottom: 22 }}>
        <p style={{ color: "#7A7A6A", fontSize: 11, letterSpacing: "0.12em", marginBottom: 14 }}>게시판 이름 편집</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {boards.map(b => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#1A1A1A", border: "1px solid #242424" }}>
              <span style={{ color: "#C9A84C", fontSize: 16, minWidth: 20 }}>{b.icon}</span>
              <span style={{ color: "#F5F0E8", fontSize: 13, flex: 1 }}>{b.name}</span>
              <span style={{ color: "#4A4A4A", fontSize: 11, flex: 2 }}>{b.description}</span>
              <Btn variant="ghost" onClick={() => openBoardEdit(b)}>수정</Btn>
            </div>
          ))}
        </div>
      </div>

      {/* 게시판 탭 */}
      <div style={{ display: "flex", gap: 1, background: "#1A1A1A", marginBottom: 22 }}>
        {boards.map(b => (
          <button key={b.id} onClick={() => setBoardId(b.id)}
            style={{ flex: 1, padding: "12px 8px", background: boardId === b.id ? "#C9A84C0D" : "#141414", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: boardId === b.id ? "2px solid #C9A84C" : "2px solid transparent", color: boardId === b.id ? "#C9A84C" : "#5A5A4A", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
            {b.icon}&nbsp;{b.name}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ color: "#6A6A5A", fontSize: 12 }}>{board?.name} · {boardPosts.length}개</span>
        <Btn onClick={() => open()}>+ 글 등록</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 110px", padding: "10px 16px", background: "#0F0F0F", borderBottom: "1px solid #2A2A2A" }}>
          {["제목","작성자","날짜","액션"].map(h => <span key={h} style={{ color: "#3A3A3A", fontSize: 10, letterSpacing: "0.08em" }}>{h}</span>)}
        </div>
        {boardPosts.length === 0
          ? <div style={{ textAlign: "center", padding: "36px", color: "#3A3A3A", background: "#141414", fontSize: 12 }}>게시글이 없습니다.</div>
          : boardPosts.map((p, i) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 110px", padding: "13px 16px", background: i % 2 === 0 ? "#141414" : "#111111", alignItems: "center" }}>
                <p style={{ color: "#F5F0E8", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                <span style={{ color: "#5A5A4A", fontSize: 12 }}>{p.author}</span>
                <span style={{ color: "#3A3A3A", fontSize: 11 }}>{p.createdAt}</span>
                <div style={{ display: "flex", gap: 6 }}><Btn variant="ghost" onClick={() => open(p)}>수정</Btn><Btn variant="danger" onClick={() => del(p.id)}>삭제</Btn></div>
              </div>
            ))
        }
      </div>
      <AnimatePresence>
        {modal !== null && (
          <Modal title={modal === "add" ? "게시글 등록" : "게시글 수정"} onClose={() => setModal(null)}>
            <Field label="제목 *"><Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} /></Field>
            <Field label="내용 *"><Textarea value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} rows={6} /></Field>
            <Field label="태그 (쉼표 구분)"><Input value={form.tags} onChange={v => setForm(f => ({ ...f, tags: v }))} placeholder="투자, 바이오" /></Field>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>취소</Btn>
              <Btn onClick={save} disabled={!form.title || !form.content}>저장하기</Btn>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* 게시판 이름 수정 모달 */}
      <AnimatePresence>
        {editingBoard !== null && (
          <Modal title="게시판 수정" onClose={() => setEditingBoard(null)}>
            <Field label="게시판 이름 *">
              <Input value={boardForm.name} onChange={v => setBoardForm(p => ({ ...p, name: v }))} placeholder="멤버 라운지" />
            </Field>
            <Field label="설명">
              <Input value={boardForm.description} onChange={v => setBoardForm(p => ({ ...p, description: v }))} placeholder="회원 전용 자유 토론 공간" />
            </Field>
            <Field label="아이콘 (이모지 또는 특수문자)">
              <Input value={boardForm.icon} onChange={v => setBoardForm(p => ({ ...p, icon: v }))} placeholder="◆" />
            </Field>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setEditingBoard(null)}>취소</Btn>
              <Btn onClick={saveBoardEdit} disabled={!boardForm.name.trim()}>저장하기</Btn>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 회원 관리 ────────────────────────────────────────────────────────────────

const EMPTY_MEMBER = { name: "", email: "", password: "", company: "", role: "bronze" as UserRole };
const DEFAULT_GRADE_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32", "#C9A84C", "#4A90D9", "#7B68EE", "#50C878", "#E8A090"];

function MembersSection({ toast }: { toast: (m: string) => void }) {
  const { members, pendingMembers, addMember, approveMember, rejectMember, changeMemberRole, deleteMember, refreshPending, memberGrades, addMemberGrade, updateMemberGrade, removeMemberGrade } = useSite();
  const [tab, setTab] = useState<"pending" | "all" | "grades">("pending");
  const [search, setSearch] = useState("");

  // 등급 관리 state
  const [gradeForm, setGradeForm] = useState({ label: "", color: DEFAULT_GRADE_COLORS[0] });
  const [editingGrade, setEditingGrade] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ label: "", color: "" });
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [formErr, setFormErr] = useState("");

  useEffect(() => { refreshPending(); }, [refreshPending]);

  const filtered = members.filter(m => !search || m.name.includes(search) || m.email.includes(search));

  const openAdd = () => { setForm(EMPTY_MEMBER); setFormErr(""); setAddModal(true); };
  const submitAdd = () => {
    if (!form.name.trim()) { setFormErr("이름을 입력해주세요."); return; }
    if (!form.email.trim()) { setFormErr("이메일을 입력해주세요."); return; }
    if (!form.password.trim()) { setFormErr("비밀번호를 입력해주세요."); return; }
    if (members.some(m => m.email === form.email.trim())) { setFormErr("이미 사용 중인 이메일입니다."); return; }
    addMember({ name: form.name.trim(), email: form.email.trim(), role: form.role, company: form.company.trim() || undefined });
    toast(`${form.name.trim()}님 회원 등록 완료`);
    setAddModal(false);
  };
  const f = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <SectionHeader title="회원 관리" sub="가입 승인 및 등급 변경을 처리합니다." />

      <AnimatePresence>
        {addModal && (
          <Modal title="회원 직접 등록" onClose={() => setAddModal(false)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="이름 *"><Input value={form.name} onChange={f("name")} placeholder="홍길동" /></Field>
              <Field label="이메일 *"><Input value={form.email} onChange={f("email")} placeholder="user@example.com" type="email" /></Field>
              <Field label="비밀번호 *"><Input value={form.password} onChange={f("password")} placeholder="초기 비밀번호" type="password" /></Field>
              <Field label="소속 (선택)"><Input value={form.company} onChange={f("company")} placeholder="회사명" /></Field>
              <Field label="등급">
                <select
                  style={{ ...IS }}
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
                >
                  {memberGrades.map(g => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </Field>
              {formErr && <p style={{ color: "#E08080", fontSize: 12, margin: 0 }}>{formErr}</p>}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <Btn variant="ghost" onClick={() => setAddModal(false)}>취소</Btn>
                <Btn onClick={submitAdd}>등록</Btn>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* 탭 */}
      <div style={{ display: "flex", gap: 1, background: "#1A1A1A", marginBottom: 24, width: "fit-content" }}>
        {([
          ["pending", `승인 대기 (${pendingMembers.length})`],
          ["all",     `전체 회원 (${members.length})`],
          ["grades",  `등급 관리 (${memberGrades.length})`],
        ] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding: "10px 24px", background: tab === id ? "#C9A84C0D" : "#141414", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: tab === id ? "2px solid #C9A84C" : "2px solid transparent", color: tab === id ? "#C9A84C" : "#5A5A4A", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* 승인 대기 */}
      {tab === "pending" && (
        pendingMembers.length === 0
          ? <div style={{ textAlign: "center", padding: "60px", color: "#3A3A3A", background: "#141414", border: "1px solid #1A1A1A", fontSize: 13 }}>대기 중인 신청이 없습니다.</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A" }}>
              {pendingMembers.map((u, i) => (
                <div key={u.id} style={{ background: i % 2 === 0 ? "#141414" : "#111111", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                  <div>
                    <p style={{ color: "#F5F0E8", fontSize: 14, marginBottom: 3 }}>{u.name}</p>
                    <p style={{ color: "#5A5A4A", fontSize: 12 }}>{u.email}{u.company && ` · ${u.company}`}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {memberGrades.map(g => (
                      <button key={g.id} onClick={() => { approveMember(u.id, g.id as UserRole); toast(`${u.name}님 ${g.label} 승인 완료`); }}
                        style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${g.color}`, color: g.color, fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}>
                        {g.label} 승인
                      </button>
                    ))}
                    <Btn variant="danger" onClick={() => { rejectMember(u.id); toast(`${u.name}님 거절`); }}>거절</Btn>
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* 전체 회원 */}
      {tab === "all" && (
        <>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <input style={{ ...IS, maxWidth: 240 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="이름, 이메일 검색" />
            <Btn onClick={openAdd}>+ 회원 추가</Btn>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "1px solid #2A2A2A" }}>{["이름","이메일","등급","소속","가입일","등급 변경",""].map((h, i) => <th key={i} style={{ color: "#4A4A4A", fontSize: 11, padding: "10px 14px", textAlign: "left", fontWeight: 400 }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((m: Member, i) => {
                  const grade = memberGrades.find(g => g.id === m.role);
                  const gColor = grade?.color ?? ROLE_COLORS[m.role as UserRole] ?? "#888";
                  const gLabel = grade?.label ?? ROLE_LABELS[m.role as UserRole] ?? m.role;
                  return (
                    <tr key={m.id} style={{ borderBottom: "1px solid #181818", background: i % 2 === 0 ? "#141414" : "#111111" }}>
                      <td style={{ padding: "12px 14px", color: "#F5F0E8", fontSize: 13 }}>{m.name}</td>
                      <td style={{ padding: "12px 14px", color: "#6A6A5A", fontSize: 12 }}>{m.email}</td>
                      <td style={{ padding: "12px 14px" }}><span style={{ padding: "3px 10px", border: `1px solid ${gColor}`, color: gColor, fontSize: 11 }}>{gLabel}</span></td>
                      <td style={{ padding: "12px 14px", color: "#5A5A4A", fontSize: 12 }}>{m.company || "—"}</td>
                      <td style={{ padding: "12px 14px", color: "#3A3A3A", fontSize: 11 }}>{m.joinedAt}</td>
                      <td style={{ padding: "12px 14px" }}>
                        {m.role !== "admin" && (
                          <select value={m.role} onChange={e => { changeMemberRole(m.id, e.target.value as UserRole); toast(`${m.name}님 등급 변경 완료`); }}
                            style={{ background: "#0F0F0F", border: "1px solid #2A2A2A", color: "#C9A84C", padding: "5px 10px", fontSize: 12, cursor: "pointer", outline: "none" }}>
                            {memberGrades.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                          </select>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {m.role !== "admin" && <Btn variant="danger" onClick={() => { if (!confirm(`${m.name}님을 삭제하시겠습니까?`)) return; deleteMember(m.id); toast("삭제 완료"); }}>삭제</Btn>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 등급 관리 */}
      {tab === "grades" && (
        <div>
          {/* 등급 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {memberGrades.map(g => (
              <div key={g.id} style={{ background: "#141414", border: `1px solid ${g.color}25`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {editingGrade === g.id ? (
                  <>
                    <div style={{ width: 36, height: 36, borderRadius: 2, background: editForm.color, border: "1px solid #3A3A3A", flexShrink: 0 }} />
                    <input
                      style={{ ...IS, width: 120 }}
                      value={editForm.label}
                      onChange={e => setEditForm(p => ({ ...p, label: e.target.value }))}
                      placeholder="등급 이름"
                      autoFocus
                    />
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {DEFAULT_GRADE_COLORS.map(c => (
                        <button key={c} onClick={() => setEditForm(p => ({ ...p, color: c }))}
                          style={{ width: 22, height: 22, background: c, border: editForm.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", borderRadius: 2, flexShrink: 0 }} />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                      <Btn onClick={() => {
                        if (!editForm.label.trim()) return;
                        updateMemberGrade(g.id, { label: editForm.label.trim(), color: editForm.color });
                        toast(`"${editForm.label.trim()}" 등급 저장 완료`);
                        setEditingGrade(null);
                      }}>저장</Btn>
                      <Btn variant="ghost" onClick={() => setEditingGrade(null)}>취소</Btn>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: g.color, flexShrink: 0 }} />
                    <span style={{ color: g.color, fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", flex: 1 }}>{g.label}</span>
                    <span style={{ color: "#3A3A3A", fontSize: 11 }}>
                      {members.filter(m => m.role === g.id).length}명
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn variant="ghost" onClick={() => { setEditingGrade(g.id); setEditForm({ label: g.label, color: g.color }); }}>이름·색상 변경</Btn>
                      <Btn variant="danger" onClick={() => {
                        const count = members.filter(m => m.role === g.id).length;
                        if (count > 0) { toast(`해당 등급 회원 ${count}명이 있어 삭제할 수 없습니다.`); return; }
                        if (memberGrades.length <= 1) { toast("최소 1개 등급은 유지해야 합니다."); return; }
                        if (!confirm(`"${g.label}" 등급을 삭제하시겠습니까?`)) return;
                        removeMemberGrade(g.id);
                        toast(`"${g.label}" 등급 삭제 완료`);
                      }}>삭제</Btn>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 새 등급 추가 */}
          <div style={{ background: "#141414", border: "1px solid #2A2A2A", padding: "20px" }}>
            <p style={{ color: "#7A7A6A", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16 }}>새 등급 추가</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ width: 36, height: 36, borderRadius: 2, background: gradeForm.color, border: "1px solid #3A3A3A", flexShrink: 0 }} />
              <input
                style={{ ...IS, width: 160 }}
                value={gradeForm.label}
                onChange={e => setGradeForm(p => ({ ...p, label: e.target.value }))}
                placeholder="등급 이름 (예: VIP)"
                onKeyDown={e => {
                  if (e.key === "Enter" && gradeForm.label.trim()) {
                    addMemberGrade({ label: gradeForm.label.trim(), color: gradeForm.color });
                    toast(`"${gradeForm.label.trim()}" 등급 추가 완료`);
                    setGradeForm({ label: "", color: DEFAULT_GRADE_COLORS[0] });
                  }
                }}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {DEFAULT_GRADE_COLORS.map(c => (
                  <button key={c} onClick={() => setGradeForm(p => ({ ...p, color: c }))}
                    style={{ width: 22, height: 22, background: c, border: gradeForm.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", borderRadius: 2, flexShrink: 0 }} />
                ))}
              </div>
              <Btn onClick={() => {
                if (!gradeForm.label.trim()) return;
                addMemberGrade({ label: gradeForm.label.trim(), color: gradeForm.color });
                toast(`"${gradeForm.label.trim()}" 등급 추가 완료`);
                setGradeForm({ label: "", color: DEFAULT_GRADE_COLORS[0] });
              }} disabled={!gradeForm.label.trim()}>+ 추가</Btn>
            </div>
          </div>
          <p style={{ color: "#3A3A3A", fontSize: 11, marginTop: 12 }}>* 회원이 배정된 등급은 삭제할 수 없습니다.</p>
        </div>
      )}
    </div>
  );
}

// ─── 고객센터 ──────────────────────────────────────────────────────────────────

function SupportSection({ toast }: { toast: (m: string) => void }) {
  const { supportKakaoUrl, updateSupportKakaoUrl } = useSite();
  const [url, setUrl] = useState(supportKakaoUrl);

  useEffect(() => { setUrl(supportKakaoUrl); }, [supportKakaoUrl]);

  const save = () => {
    updateSupportKakaoUrl(url.trim());
    toast("고객센터 URL 저장 완료");
  };

  const clear = () => {
    setUrl("");
    updateSupportKakaoUrl("");
    toast("고객센터 버튼 비활성화");
  };

  return (
    <div>
      <SectionHeader
        title="고객센터"
        sub="카카오톡 오픈채팅 URL을 등록하면 포트폴리오·커뮤니티·로그인 페이지 우측 하단에 플로팅 버튼이 활성화됩니다."
      />

      {/* 상태 표시 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "14px 18px", background: supportKakaoUrl ? "#0E1A0E" : "#141414", border: `1px solid ${supportKakaoUrl ? "#2A5A2A" : "#2A2A2A"}` }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: supportKakaoUrl ? "#4CAF50" : "#3A3A3A", display: "inline-block", flexShrink: 0 }} />
        <span style={{ color: supportKakaoUrl ? "#7ACC7A" : "#5A5A4A", fontSize: 12, letterSpacing: "0.08em" }}>
          {supportKakaoUrl ? "고객센터 버튼 활성화 중" : "URL 미등록 — 버튼 비표시 상태"}
        </span>
      </div>

      {/* URL 입력 */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", color: "#8A8A7A", fontSize: 12, letterSpacing: "0.1em", marginBottom: 8 }}>
          카카오톡 오픈채팅 URL
        </label>
        <input
          className="input-premium"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://open.kakao.com/o/..."
          style={{ width: "100%", maxWidth: 520 }}
        />
        <p style={{ color: "#3A3A3A", fontSize: 11, marginTop: 8 }}>
          카카오톡 오픈채팅방 개설 후 링크를 입력하세요. URL이 비어 있으면 버튼이 숨겨집니다.
        </p>
      </div>

      {/* 미리보기 */}
      {url && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#111111", border: "1px solid #1E1E1E", marginBottom: 20, maxWidth: 520 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FEE500", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>💬</span>
          </div>
          <div>
            <p style={{ color: "#F0EBE0", fontSize: 12, marginBottom: 2 }}>고객센터 버튼 미리보기</p>
            <p style={{ color: "#5A5A4A", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 360 }}>{url}</p>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={save} disabled={!url.trim()}>저장하기</Btn>
        {supportKakaoUrl && <Btn variant="ghost" onClick={clear}>버튼 비활성화</Btn>}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) { router.replace("/"); return; }
      if (user.role !== "admin") { router.replace("/dashboard"); return; }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "admin") return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0A" }}>
      <Sidebar active={section} onChange={setSection} />
      <main style={{ flex: 1, marginLeft: 220, padding: "44px 48px", minHeight: "100vh" }}>
        <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {section === "overview"   && <OverviewSection onGo={setSection} />}
          {section === "indexpage"  && <IndexPageSection toast={setToastMsg} />}
          {section === "brand"      && <BrandSection toast={setToastMsg} />}
          {section === "pagetexts"   && <PageTextsSection toast={setToastMsg} />}
          {section === "permissions" && <PermissionsSection toast={setToastMsg} />}
          {section === "menu"        && <MenuSection toast={setToastMsg} />}
          {section === "portfolio" && <PortfolioSection toast={setToastMsg} />}
          {section === "boards"    && <BoardsSection toast={setToastMsg} />}
          {section === "members"   && <MembersSection toast={setToastMsg} />}
          {section === "support"   && <SupportSection toast={setToastMsg} />}
        </motion.div>
      </main>
      <AnimatePresence>
        {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
}
