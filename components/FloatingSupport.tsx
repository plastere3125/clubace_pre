"use client";

import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";

export default function FloatingSupport() {
  const { supportKakaoUrl } = useSite();

  const handleClick = () => {
    if (supportKakaoUrl) {
      window.open(supportKakaoUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        position: "fixed",
        bottom: 36,
        right: 28,
        zIndex: 999,
        cursor: supportKakaoUrl ? "pointer" : "default",
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #9A7248, #6B4A28)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        userSelect: "none",
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 헤드셋 아이콘 SVG */}
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1C6.48 1 2 5.48 2 11v4c0 1.1.9 2 2 2h1c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4v-1c0-4.42 3.58-8 8-8s8 3.58 8 8v1h-1c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h1c1.1 0 2-.9 2-2v-4c0-5.52-4.48-10-10-10z"
          fill="white"
          fillOpacity="0.92"
        />
      </svg>
      {/* 텍스트 */}
      <span
        style={{
          color: "rgba(255,255,255,0.90)",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        고객센터
      </span>
    </motion.div>
  );
}
