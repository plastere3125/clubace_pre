"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";

// ─── 성인인증 모달 ─────────────────────────────────────────────────────────────

const VERIFY_METHODS = [
  { id: "shinhan",  label: "신한은행",    color: "#003087", icon: "S" },
  { id: "finance",  label: "금융인증서",  color: "#1A5C96", icon: "F" },
  { id: "woori",    label: "우리WON인증", color: "#007BC7", icon: "W" },
  { id: "kb",       label: "KB국민인증",  color: "#FFBC00", icon: "KB" },
  { id: "toss",     label: "토스 인증",   color: "#0064FF", icon: "T" },
  { id: "naver",    label: "네이버 인증", color: "#03C75A", icon: "N" },
  { id: "pass",     label: "PASS 인증",   color: "#E2142D", icon: "P" },
  { id: "samsung",  label: "삼성패스",    color: "#1428A0", icon: "S" },
];

function VerifyModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [verifying, setVerifying] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSelect = (id: string) => {
    setVerifying(id);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => { onSuccess(); onClose(); }, 800);
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#FAFAFA", width: "100%", maxWidth: 400, borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 60px #00000080" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #E8E8E8", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "#004A9F", borderRadius: 4, padding: "4px 8px" }}>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>KG</span>
            </div>
            <span style={{ color: "#333", fontSize: 13, fontWeight: 600 }}>이니시스</span>
          </div>
          <span style={{ color: "#555", fontSize: 13, cursor: "pointer" }} onClick={onClose}>간편인증</span>
        </div>

        <div style={{ padding: "24px 20px" }}>
          {done ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>✓</div>
              <p style={{ color: "#2E7D32", fontSize: 14, fontWeight: 600 }}>인증이 완료되었습니다.</p>
            </motion.div>
          ) : verifying ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 40, height: 40, border: "3px solid #E0E0E0", borderTop: "3px solid #004A9F", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <p style={{ color: "#333", fontSize: 13 }}>인증을 진행 중입니다...</p>
              <p style={{ color: "#999", fontSize: 11, marginTop: 6 }}>잠시만 기다려 주세요.</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {VERIFY_METHODS.map(m => (
                  <button key={m.id} onClick={() => handleSelect(m.id)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 4px", background: "#fff", border: "1px solid #E8E8E8", borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#004A9F")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8E8E8")}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: m.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                      {m.icon}
                    </div>
                    <span style={{ color: "#333", fontSize: 10, textAlign: "center", lineHeight: 1.3 }}>{m.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ background: "#F5F5F5", borderRadius: 4, padding: "12px 14px", marginBottom: 20 }}>
                {["본인 명의의 인증서로 간편인증이 가능합니다.", "입력한 정보는 간편인증을 위해서만 활용됩니다.", "각 인증서는 해당 인증서의 앱 설치 후 발급 가능\n(금융인증서는 각 은행에서 발급 가능)"].map((t, i) => (
                  <p key={i} style={{ color: "#666", fontSize: 11, lineHeight: 1.7 }}>· {t}</p>
                ))}
              </div>
            </>
          )}
        </div>

        {!done && !verifying && (
          <div style={{ borderTop: "1px solid #E8E8E8" }}>
            <button onClick={onClose}
              style={{ width: "100%", padding: "16px", background: "#555", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em" }}>
              취 소
            </button>
            <p style={{ textAlign: "center", color: "#AAA", fontSize: 10, padding: "8px 0" }}>
              고객지원 1588-4954 | 개인정보처리방침
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── 개인정보 처리방침 모달 ────────────────────────────────────────────────────

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#141414", border: "1px solid #C9A84C30", width: "100%", maxWidth: 540, maxHeight: "70vh", borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid #2A2A2A" }}>
          <span style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.15em" }}>개인정보 처리방침</span>
          <button onClick={onClose} style={{ color: "#6A6A5A", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "20px 22px", overflowY: "auto", flex: 1 }}>
          {["수집 항목", "수집 목적", "보유 기간", "제3자 제공"].map((title, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <p style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.1em", marginBottom: 8 }}>{i + 1}. {title}</p>
              <p style={{ color: "#6A6A5A", fontSize: 12, lineHeight: 1.8 }}>
                {["이름, 이메일, 연락처, 생년월일, 성별, 업종, 사업자등록증",
                  "회원 가입 및 서비스 제공, 본인 확인, 불만 처리 등 민원 처리",
                  "회원 탈퇴 시까지 (단, 관계 법령에 따라 일정 기간 보관)",
                  "수집한 개인정보는 원칙적으로 제3자에게 제공하지 않습니다."][i]}
              </p>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #2A2A2A" }}>
          <button onClick={onClose} className="btn-gold" style={{ width: "100%", padding: "11px", fontSize: 12, border: "none", cursor: "pointer", letterSpacing: "0.1em" }}>확인</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { register } = useAuth();
  const { brand } = useSite();
  const fileRef = useRef<HTMLInputElement>(null);

  const [memberType, setMemberType] = useState<"gold" | "silver">("gold");
  const [verified, setVerified] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    name: "",
    nickname: "",
    birth: "",
    gender: "",
    phone: "",
    email: "",
    industry: "",
    snsAgree: false,
  });

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const handleVerifySuccess = () => {
    setVerified(true);
    setForm(p => ({ ...p, name: "홍길동", birth: "19900101", phone: "010-1234-5678" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) { setStatus({ type: "error", message: "본인인증을 완료해 주세요." }); return; }
    if (form.password !== form.passwordConfirm) { setStatus({ type: "error", message: "비밀번호가 일치하지 않습니다." }); return; }
    if (form.password.length < 8) { setStatus({ type: "error", message: "비밀번호는 8자 이상이어야 합니다." }); return; }
    if (!privacyAgree) { setStatus({ type: "error", message: "개인정보 처리 방침에 동의해 주세요." }); return; }
    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.id,
      password: form.password,
      company: form.industry,
      phone: form.phone,
    });
    setLoading(false);
    setStatus({ type: result.success ? "success" : "error", message: result.message });
  };

  const inputStyle = (disabled = false): React.CSSProperties => ({
    width: "100%",
    background: disabled ? "#1A1A1A" : "#0F0F0F",
    border: "1px solid #2A2A2A",
    color: disabled ? "#4A4A4A" : "#F5F0E8",
    padding: "11px 14px",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#9A9A8A",
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 7,
  };

  const requiredMark = <span style={{ color: "#C9A84C", marginLeft: 2 }}>*</span>;
  const autoNote = <span style={{ color: "#C9A84C60", fontSize: 10, marginLeft: 6 }}>* 본인인증시 자동입력됩니다.</span>;

  if (status?.type === "success") {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
          <div style={{ width: 64, height: 64, border: "1.5px solid #C9A84C", transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <span style={{ transform: "rotate(-45deg)", color: "#C9A84C", fontSize: 26 }}>✓</span>
          </div>
          <p style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.3em", marginBottom: 12 }}>APPLICATION COMPLETE</p>
          <p style={{ color: "#F5F0E8", fontSize: 18, fontWeight: 300, marginBottom: 16 }}>가입 신청 완료</p>
          <p style={{ color: "#6A6A5A", fontSize: 13, lineHeight: 1.8 }}>{status.message}</p>
          <div className="gold-divider" style={{ margin: "28px 0" }} />
          <Link href="/" style={{ color: "#C9A84C", fontSize: 12, borderBottom: "1px solid #C9A84C40", paddingBottom: 2 }}>
            로그인 페이지로 이동
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>

      {/* ── 좌측 브랜드 패널 ── */}
      <div style={{ width: 420, flexShrink: 0, position: "sticky", top: 0, height: "100vh", background: "#0D0D0D", borderRight: "1px solid #1E1E1E", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 44px" }}
        className="register-left">
        {/* 상단 로고 */}
        <div>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 48 }}>
            {brand.logoImageUrl
              ? <img src={brand.logoImageUrl} alt="logo" style={{ height: 32 }} />
              : <div style={{ width: 36, height: 36, border: "1.5px solid #C9A84C", transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ transform: "rotate(-45deg)", color: "#C9A84C", fontSize: 14, fontWeight: 700 }}>P</span>
                </div>
            }
            <span style={{ color: "#C9A84C", fontSize: 13, letterSpacing: "0.2em", fontWeight: 500 }}>{brand.logoText}</span>
          </Link>

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p style={{ color: "#C9A84C", fontSize: 10, letterSpacing: "0.4em", marginBottom: 14 }}>MEMBERSHIP</p>
            <h1 style={{ color: "#F5F0E8", fontSize: 28, fontWeight: 300, lineHeight: 1.4, letterSpacing: "0.03em", marginBottom: 20 }}>
              프리미엄<br />멤버십 신청
            </h1>
            <p style={{ color: "#4A4A4A", fontSize: 13, lineHeight: 1.9 }}>
              신청서 제출 후 관리자 검토를<br />거쳐 입장 승인이 완료됩니다.
            </p>
          </motion.div>

          <div className="gold-divider" style={{ margin: "36px 0" }} />

          {/* 등급 혜택 */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            {[
              { grade: "GOLD", color: "#FFD700", perks: ["포트폴리오 전체 열람", "연락처 열람", "전체 게시판 접근", "멤버 전용 딜 제안"] },
              { grade: "SILVER", color: "#C0C0C0", perks: ["포트폴리오 열람", "연락처 열람", "전체 게시판 접근"] },
            ].map(({ grade, color, perks }) => (
              <div key={grade} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ padding: "2px 10px", border: `1px solid ${color}`, color, fontSize: 10, letterSpacing: "0.15em" }}>{grade}</span>
                </div>
                {perks.map(p => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: color, fontSize: 10 }}>◆</span>
                    <span style={{ color: "#5A5A4A", fontSize: 12 }}>{p}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* 하단 로그인 링크 */}
        <p style={{ color: "#3A3A3A", fontSize: 12 }}>
          이미 회원이신가요?{" "}
          <Link href="/" style={{ color: "#C9A84C", borderBottom: "1px solid #C9A84C40", paddingBottom: 1 }}>로그인</Link>
        </p>
      </div>

      {/* ── 우측 폼 패널 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "48px 52px 80px" }} className="register-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ maxWidth: 520 }}>

          {/* 회원 유형 탭 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 32 }}>
            {(["gold", "silver"] as const).map(type => (
              <button key={type} onClick={() => setMemberType(type)}
                style={{
                  padding: "13px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: memberType === type ? "#C9A84C" : "transparent",
                  color: memberType === type ? "#0A0A0A" : "#4A4A4A",
                  border: `1px solid ${memberType === type ? "#C9A84C" : "#2A2A2A"}`,
                }}>
                {type === "gold" ? "골드 회원" : "실버 회원"}
              </button>
            ))}
          </div>

          <div className="gold-divider" style={{ marginBottom: 28 }} />

        <form onSubmit={handleSubmit}>

          {/* 본인인증 */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>본인인증 {requiredMark}</label>
            {verified ? (
              <div style={{ padding: "11px 14px", background: "#1A2A1A", border: "1px solid #3A6A3A", color: "#80C880", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                <span>✓</span> 본인인증이 완료되었습니다.
              </div>
            ) : (
              <button type="button" onClick={() => setShowVerify(true)}
                style={{ width: "100%", padding: "12px", background: "#1A1A1A", border: "1px solid #C9A84C40", color: "#C9A84C", fontSize: 13, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#C9A84C15")}
                onMouseLeave={e => (e.currentTarget.style.background = "#1A1A1A")}>
                성인 인증
              </button>
            )}
          </div>

          {/* 아이디 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>아이디 (이메일) {requiredMark}</label>
            <input style={inputStyle()} value={form.id} onChange={f("id")} placeholder="email@example.com" type="email" required
              onFocus={e => (e.target.style.borderColor = "#C9A84C60")}
              onBlur={e => (e.target.style.borderColor = "#2A2A2A")} />
          </div>

          {/* 비밀번호 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>비밀번호 {requiredMark}</label>
            <input style={inputStyle()} value={form.password} onChange={f("password")} placeholder="8자 이상 입력해 주세요" type="password" required
              onFocus={e => (e.target.style.borderColor = "#C9A84C60")}
              onBlur={e => (e.target.style.borderColor = "#2A2A2A")} />
          </div>

          {/* 비밀번호 확인 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>비밀번호 확인 {requiredMark}</label>
            <input style={{ ...inputStyle(), borderColor: form.passwordConfirm && form.password !== form.passwordConfirm ? "#8A3A3A" : "#2A2A2A" }}
              value={form.passwordConfirm} onChange={f("passwordConfirm")} placeholder="비밀번호를 다시 입력해 주세요" type="password" required
              onFocus={e => (e.target.style.borderColor = "#C9A84C60")}
              onBlur={e => (e.target.style.borderColor = form.passwordConfirm && form.password !== form.passwordConfirm ? "#8A3A3A" : "#2A2A2A")} />
            {form.passwordConfirm && form.password !== form.passwordConfirm && (
              <p style={{ color: "#E08080", fontSize: 11, marginTop: 5 }}>비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {/* 이름 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>이름 {requiredMark}{autoNote}</label>
            <input style={inputStyle(!verified)} value={form.name} onChange={f("name")} placeholder="본인인증 후 자동입력" disabled={!verified}
              onFocus={e => { if (verified) e.target.style.borderColor = "#C9A84C60"; }}
              onBlur={e => (e.target.style.borderColor = "#2A2A2A")} />
          </div>

          {/* 닉네임 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>닉네임</label>
            <input style={inputStyle()} value={form.nickname} onChange={f("nickname")} placeholder="사용하실 닉네임을 입력해 주세요"
              onFocus={e => (e.target.style.borderColor = "#C9A84C60")}
              onBlur={e => (e.target.style.borderColor = "#2A2A2A")} />
          </div>

          {/* 생년월일 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>생년월일 {requiredMark}{autoNote}</label>
            <input style={inputStyle(!verified)} value={form.birth} onChange={f("birth")} placeholder="본인인증 후 자동입력 (YYYYMMDD)" disabled={!verified}
              onFocus={e => { if (verified) e.target.style.borderColor = "#C9A84C60"; }}
              onBlur={e => (e.target.style.borderColor = "#2A2A2A")} />
          </div>

          {/* 성별 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>성별 {requiredMark}</label>
            <div style={{ display: "flex", gap: 32, padding: "12px 4px" }}>
              {["남성", "여성"].map(g => (
                <label key={g} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: form.gender === g ? "#C9A84C" : "#6A6A5A", fontSize: 13, transition: "color 0.2s" }}>
                  <div onClick={() => setForm(p => ({ ...p, gender: g }))}
                    style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${form.gender === g ? "#C9A84C" : "#3A3A3A"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
                    {form.gender === g && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9A84C" }} />}
                  </div>
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* 핸드폰 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>핸드폰 {requiredMark}{autoNote}</label>
            <input style={inputStyle(!verified)} value={form.phone} onChange={f("phone")} placeholder="본인인증 후 자동입력" disabled={!verified}
              onFocus={e => { if (verified) e.target.style.borderColor = "#C9A84C60"; }}
              onBlur={e => (e.target.style.borderColor = "#2A2A2A")} />
          </div>

          {/* 이메일 */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>이메일 {requiredMark}</label>
            <input style={inputStyle()} value={form.email} onChange={f("email")} placeholder="이메일을 입력해 주세요" type="email" required
              onFocus={e => (e.target.style.borderColor = "#C9A84C60")}
              onBlur={e => (e.target.style.borderColor = "#2A2A2A")} />
          </div>

          {/* 골드 전용: SNS 수신동의 */}
          {memberType === "gold" && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                onClick={() => setForm(p => ({ ...p, snsAgree: !p.snsAgree }))}>
                <div style={{ width: 18, height: 18, border: `1px solid ${form.snsAgree ? "#C9A84C" : "#3A3A3A"}`, background: form.snsAgree ? "#C9A84C18" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                  {form.snsAgree && <span style={{ color: "#C9A84C", fontSize: 12, lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ color: form.snsAgree ? "#C9A84C" : "#6A6A5A", fontSize: 13, transition: "color 0.2s" }}>SNS 수신동의</span>
              </label>
            </div>
          )}

          {/* 실버 전용: 업종 + 사업자등록증 */}
          {memberType === "silver" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>업종 {requiredMark}</label>
                <input style={inputStyle()} value={form.industry} onChange={f("industry")} placeholder="예: IT, 부동산, 금융"
                  onFocus={e => (e.target.style.borderColor = "#C9A84C60")}
                  onBlur={e => (e.target.style.borderColor = "#2A2A2A")} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>사업자등록증 {requiredMark}</label>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: "none" }} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ padding: "10px 24px", background: "#1A1A1A", border: "1px solid #C9A84C40", color: "#C9A84C", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#C9A84C15")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#1A1A1A")}>
                  업로드
                </button>
                {fileName && <p style={{ color: "#6A6A5A", fontSize: 11, marginTop: 7 }}>📎 {fileName}</p>}
              </div>
            </>
          )}

          <div className="gold-divider" style={{ marginBottom: 20 }} />

          {/* 개인정보 처리방침 */}
          <div style={{ marginBottom: 24 }}>
            <button type="button" onClick={() => setShowPrivacy(true)}
              style={{ padding: "8px 16px", background: "transparent", border: "1px solid #3A3A3A", color: "#8A8A7A", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, letterSpacing: "0.05em" }}>
              개인정보처리방침 내용읽기
            </button>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div onClick={() => setPrivacyAgree(v => !v)}
                style={{ width: 18, height: 18, border: `1px solid ${privacyAgree ? "#C9A84C" : "#3A3A3A"}`, background: privacyAgree ? "#C9A84C18" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
                {privacyAgree && <span style={{ color: "#C9A84C", fontSize: 12, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ color: privacyAgree ? "#C9A84C" : "#6A6A5A", fontSize: 13, transition: "color 0.2s" }}>
                개인정보 처리 방침에 동의 합니다.
              </span>
            </label>
          </div>

          {/* 에러 메시지 */}
          <AnimatePresence>
            {status?.type === "error" && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "#3A1A1A", border: "1px solid #8A3A3A", color: "#E08080", fontSize: 12, padding: "11px 14px", marginBottom: 16 }}>
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 제출 버튼 */}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: loading ? "#2A2A2A" : "linear-gradient(135deg,#E8CC7A,#C9A84C)", color: loading ? "#5A5A4A" : "#0A0A0A", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
            {loading ? "신청 중..." : "회원가입"}
          </button>
        </form>
        </motion.div>
      </div>{/* /우측 폼 패널 */}

      {/* 성인인증 모달 */}
      <AnimatePresence>
        {showVerify && <VerifyModal onClose={() => setShowVerify(false)} onSuccess={handleVerifySuccess} />}
      </AnimatePresence>

      {/* 개인정보 처리방침 모달 */}
      <AnimatePresence>
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>

      {/* 반응형 */}
      <style>{`
        @media (max-width: 860px) {
          .register-left { display: none !important; }
          .register-right { padding: 36px 28px 80px !important; }
        }
      `}</style>
    </div>
  );
}
