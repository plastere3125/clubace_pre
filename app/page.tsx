"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";
import FloatingSupport from "@/components/FloatingSupport";

export default function Home() {
  const { user, isLoading, login, verifyAge } = useAuth();
  const { pageTexts, brand } = useSite();
  const router = useRouter();

  const [ageChecked, setAgeChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === "admin" ? "/dashboard" : "/portfolio");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "1px solid #C9A84C40", borderTop: "1px solid #C9A84C", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ageChecked) {
      setError("성인 인증에 동의하셔야 로그인이 가능합니다.");
      return;
    }
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      verifyAge();
      // 로그인 직후 role은 login() 내부에서 localStorage에 저장됨
      // currentUser에서 role 확인
      const stored = localStorage.getItem("currentUser");
      const role = stored ? JSON.parse(stored).role : "bronze";
      router.push(role === "admin" ? "/dashboard" : "/portfolio");
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 40%, #C9A84C09 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, border: "1px solid #C9A84C08", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 960, height: 960, border: "1px solid #C9A84C05", borderRadius: "50%", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 440, width: "100%", position: "relative" }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 180 }}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}
          >
            {brand.logoImageUrl ? (
              <img src={brand.logoImageUrl} alt="logo" style={{ height: 56, objectFit: "contain" }} />
            ) : (
              <div
                style={{
                  width: 56,
                  height: 56,
                  border: "1.5px solid #C9A84C",
                  transform: "rotate(45deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 32px #C9A84C30",
                }}
              >
                <span style={{ transform: "rotate(-45deg)", color: "#C9A84C", fontSize: 20, fontWeight: 500 }}>
                  {brand.logoText?.[0] ?? "P"}
                </span>
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.4em", marginBottom: 8 }}
          >
            {brand.logoText}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            style={{ color: "#6A6A5A", fontSize: 12, letterSpacing: "0.1em" }}
          >
            {brand.tagline}
          </motion.p>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="gold-divider"
          style={{ marginBottom: 36 }}
        />

        {/* Login form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", color: "#9A9A8A", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              이메일
            </label>
            <input
              className="input-premium"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              style={{ fontSize: 14 }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", color: "#9A9A8A", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              비밀번호
            </label>
            <input
              className="input-premium"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ fontSize: 14 }}
            />
          </div>

          {/* Age verification checkbox */}
          <div
            onClick={() => setAgeChecked((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              background: ageChecked ? "#C9A84C0A" : "#141414",
              border: `1px solid ${ageChecked ? "#C9A84C50" : "#333333"}`,
              cursor: "pointer",
              marginBottom: 24,
              transition: "all 0.25s ease",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                border: `1.5px solid ${ageChecked ? "#C9A84C" : "#555555"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: ageChecked ? "#C9A84C18" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <AnimatePresence>
                {ageChecked && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ color: "#C9A84C", fontSize: 12, lineHeight: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div>
              <p style={{ color: ageChecked ? "#C9A84C" : "#C0BAA8", fontSize: 13, lineHeight: 1.4, transition: "color 0.2s" }}>
                {pageTexts.loginAgeText}
              </p>
              <p style={{ color: "#666660", fontSize: 11, marginTop: 3, lineHeight: 1.4 }}>
                {pageTexts.loginAgeSubText}
              </p>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{ background: "#3A1A1A", border: "1px solid #8A3A3A", color: "#F09090", fontSize: 13, padding: "11px 14px", marginBottom: 18, lineHeight: 1.5 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            className="btn-gold"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: 13,
              letterSpacing: "0.18em",
              border: "none",
              cursor: submitting || !ageChecked ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : !ageChecked ? 0.4 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {submitting ? "로그인 중..." : pageTexts.loginButtonText}
          </button>
        </motion.form>

        <div className="gold-divider" style={{ margin: "28px 0" }} />

        {/* Register link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{ textAlign: "center", color: "#7A7A6A", fontSize: 13 }}
        >
          {pageTexts.loginRegisterText}{" "}
          <Link
            href="/auth/register"
            style={{ color: "#C9A84C", borderBottom: "1px solid #C9A84C50", paddingBottom: 1 }}
          >
            {pageTexts.loginRegisterLink}
          </Link>
        </motion.p>

        {/* Demo hint */}
        {brand.showDemoAccounts ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ marginTop: 24, padding: "14px 16px", background: "#0F0F0F", border: "1px solid #1A1A1A" }}
          >
            <p style={{ color: "#2E2E2E", fontSize: 10, letterSpacing: "0.15em", marginBottom: 8 }}>TEST ACCOUNTS</p>
            {[
              { role: "ADMIN", email: "admin@premium.com", pw: "admin123" },
              { role: "GOLD", email: "gold@premium.com", pw: "gold123" },
              { role: "SILVER", email: "silver@premium.com", pw: "silver123" },
              { role: "BRONZE", email: "bronze@premium.com", pw: "bronze123" },
            ].map((acc) => (
              <div
                key={acc.role}
                onClick={() => { setEmail(acc.email); setPassword(acc.pw); }}
                style={{ display: "flex", gap: 10, padding: "5px 0", cursor: "pointer", alignItems: "center", borderBottom: "1px solid #161616" }}
              >
                <span style={{ color: "#C9A84C50", fontSize: 10, minWidth: 44, letterSpacing: "0.08em" }}>{acc.role}</span>
                <span style={{ color: "#333", fontSize: 11 }}>{acc.email}</span>
              </div>
            ))}
          </motion.div>
        ) : null}
      </motion.div>
      <FloatingSupport />
    </div>
  );
}
