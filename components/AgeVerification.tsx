"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AgeVerificationPage() {
  const { verifyAge, user } = useAuth();
  const router = useRouter();

  const handleConfirm = () => {
    verifyAge();
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  const handleDeny = () => {
    window.location.href = "about:blank";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background ornament */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, #C9A84C08 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          border: "1px solid #C9A84C08",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          border: "1px solid #C9A84C05",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Top ornament */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="gold-divider"
          style={{ marginBottom: 40 }}
        />

        {/* Diamond logo */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
          style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              border: "1.5px solid #C9A84C",
              transform: "rotate(45deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 30px #C9A84C30",
            }}
          >
            <span
              style={{
                transform: "rotate(-45deg)",
                color: "#C9A84C",
                fontSize: 22,
                fontFamily: "inherit",
                fontWeight: 300,
              }}
            >
              P
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <p
            style={{
              color: "#C9A84C",
              fontSize: 11,
              letterSpacing: "0.4em",
              marginBottom: 16,
              fontFamily: "inherit",
            }}
          >
            COMPANY LOGO
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 300,
              letterSpacing: "0.08em",
              color: "#F5F0E8",
              fontFamily: "inherit",
              marginBottom: 12,
            }}
          >
            성인 인증
          </h1>
          <p
            style={{
              color: "#6A6A5A",
              fontSize: 13,
              lineHeight: 1.8,
              letterSpacing: "0.02em",
              marginBottom: 8,
            }}
          >
            본 플랫폼은 만 19세 이상 성인만 이용 가능한
            <br />
            프리미엄 비즈니스 매칭 서비스입니다.
          </p>
          <p style={{ color: "#4A4A4A", fontSize: 12, lineHeight: 1.7, marginBottom: 40 }}>
            귀하는 만 19세 이상입니까?
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ display: "flex", gap: 12, justifyContent: "center" }}
        >
          <button
            onClick={handleConfirm}
            className="btn-gold"
            style={{
              padding: "14px 40px",
              fontSize: 12,
              letterSpacing: "0.2em",
              border: "none",
              cursor: "pointer",
              minWidth: 160,
            }}
          >
            예, 19세 이상입니다
          </button>
          <button
            onClick={handleDeny}
            style={{
              padding: "14px 40px",
              fontSize: 12,
              letterSpacing: "0.1em",
              background: "transparent",
              border: "1px solid #2A2A2A",
              color: "#6A6A5A",
              cursor: "pointer",
              minWidth: 120,
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            아니오
          </button>
        </motion.div>

        {/* Bottom notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ color: "#3A3A3A", fontSize: 11, marginTop: 40, lineHeight: 1.7 }}
        >
          본 플랫폼은 회원 심사를 통해 엄선된 비즈니스 전문가만
          <br />
          입장 가능한 프라이빗 네트워크입니다.
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="gold-divider"
          style={{ marginTop: 40 }}
        />
      </motion.div>
    </div>
  );
}
