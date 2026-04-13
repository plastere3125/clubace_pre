"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Portfolio } from "@/lib/mockData";
import { useEffect } from "react";

interface Props {
  portfolio: Portfolio | null;
  onClose: () => void;
  canViewContact?: boolean;
}

export default function PortfolioModal({ portfolio, onClose, canViewContact = true }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (portfolio) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [portfolio]);

  return (
    <AnimatePresence>
      {portfolio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "#000000dd",
            backdropFilter: "blur(6px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#F8F7F4",
              borderRadius: 0,
              maxWidth: 860,
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                zIndex: 10,
                background: "rgba(0,0,0,0.08)",
                border: "none",
                color: "#555",
                width: 32,
                height: 32,
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
            >
              ✕
            </button>

            {/* ── Header ── */}
            <div style={{ padding: "32px 36px 24px", borderBottom: "2px solid #E0D8C8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                {/* Left: 등급·지역 + 제목 */}
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#999", fontSize: 12, letterSpacing: "0.06em", marginBottom: 8 }}>
                    {portfolio.category}&nbsp;|&nbsp;{portfolio.location}
                  </p>
                  <h1 style={{ color: "#1A1A1A", fontSize: 26, fontWeight: 700, fontFamily: "inherit", lineHeight: 1.3, marginBottom: 4 }}>
                    {portfolio.title}
                  </h1>
                  <p style={{ color: "#777", fontSize: 13 }}>{portfolio.company}</p>
                </div>

                {/* Right: 채팅 버튼 */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, paddingTop: 4 }}>
                  <p style={{ color: "#999", fontSize: 11, letterSpacing: "0.03em", marginBottom: 4 }}>클릭하여 상담이 가능합니다!</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {/* 카카오톡 */}
                    <a
                      href={portfolio.kakaoUrl || "#"}
                      target={portfolio.kakaoUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={e => !portfolio.kakaoUrl && e.preventDefault()}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#FEE500",
                        color: "#3C1E1E",
                        padding: "9px 16px",
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                        borderRadius: 4,
                        cursor: portfolio.kakaoUrl ? "pointer" : "default",
                        opacity: portfolio.kakaoUrl ? 1 : 0.5,
                      }}
                    >
                      <span style={{ fontSize: 15 }}>💬</span> 카카오톡
                    </a>
                    {/* 텔레그램 */}
                    <a
                      href={portfolio.telegramUrl || "#"}
                      target={portfolio.telegramUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={e => !portfolio.telegramUrl && e.preventDefault()}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#229ED9",
                        color: "#fff",
                        padding: "9px 16px",
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                        borderRadius: 4,
                        cursor: portfolio.telegramUrl ? "pointer" : "default",
                        opacity: portfolio.telegramUrl ? 1 : 0.5,
                      }}
                    >
                      <span style={{ fontSize: 15 }}>✈️</span> 텔레그램
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div style={{ padding: "0 36px 40px" }}>

              {/* ── 업체정보 ── */}
              <div style={{ marginTop: 28, marginBottom: 28 }}>
                <SectionTitle>업체정보</SectionTitle>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #DDD" }}>
                  <tbody>
                    <InfoRow label="상호" value={portfolio.company} />
                    <InfoRow label="담당자" value={canViewContact ? (portfolio.manager || "—") : "열람 권한 없음"} blur={!canViewContact} />
                    <InfoRow label="연락처" value={canViewContact ? portfolio.contact : "열람 권한 없음"} blur={!canViewContact} />
                    <InfoRow label="근무지역" value={portfolio.location} />
                  </tbody>
                </table>
                {!canViewContact && (
                  <p style={{ color: "#C9A84C", fontSize: 11, marginTop: 8 }}>* 연락처 열람은 SILVER 등급 이상만 가능합니다.</p>
                )}
              </div>

              {/* ── 채용 요강 ── */}
              <div style={{ marginBottom: 28 }}>
                <SectionTitle>채용 요강</SectionTitle>
                <div style={{ background: "#fff", border: "1px solid #DDD", padding: "20px 24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px 32px" }}>
                    <TagRow label="업종" value={portfolio.industry} />
                    <TagRow label="고용형태" value={portfolio.employmentType || "—"} />
                    <TagRow label="급여조건" value={portfolio.salary || "—"} />
                    <div>
                      <span style={{ color: "#888", fontSize: 11, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>편의사항</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {(portfolio.benefits && portfolio.benefits.length > 0)
                          ? portfolio.benefits.map((b) => (
                              <span key={b} style={{ background: "#F0ECE4", border: "1px solid #DDD", color: "#444", fontSize: 11, padding: "3px 10px", borderRadius: 2 }}>
                                {b}
                              </span>
                            ))
                          : <span style={{ color: "#CCC", fontSize: 12 }}>—</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 상세내용 ── */}
              <div style={{ marginBottom: 16 }}>
                <SectionTitle>상세내용</SectionTitle>
                <div style={{ background: "#fff", border: "1px solid #DDD" }}>
                  {/* fullDescription 텍스트 */}
                  {portfolio.fullDescription && (
                    <div style={{ padding: "20px 24px", borderBottom: portfolio.detailImages && portfolio.detailImages.length > 0 ? "1px solid #EEE" : "none" }}>
                      <p style={{ color: "#444", fontSize: 14, lineHeight: 1.9 }}>{portfolio.fullDescription}</p>
                    </div>
                  )}
                  {/* 상세 이미지들 */}
                  {portfolio.detailImages && portfolio.detailImages.length > 0 && (
                    <div>
                      {portfolio.detailImages.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`상세 이미지 ${i + 1}`}
                          style={{ width: "100%", display: "block" }}
                        />
                      ))}
                    </div>
                  )}
                  {/* 대표 이미지 (detailImages 없을 때) */}
                  {(!portfolio.detailImages || portfolio.detailImages.length === 0) && portfolio.imageUrl && (
                    <img
                      src={portfolio.imageUrl}
                      alt={portfolio.title}
                      style={{ width: "100%", display: "block", maxHeight: 400, objectFit: "cover" }}
                    />
                  )}
                </div>
              </div>

              {/* ── 태그 ── */}
              {portfolio.tags && portfolio.tags.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
                  {portfolio.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "3px 12px",
                        border: "1px solid #C9A84C50",
                        color: "#C9A84C",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <span style={{ display: "block", width: 4, height: 18, background: "#C9A84C", flexShrink: 0 }} />
      <h2 style={{ color: "#1A1A1A", fontSize: 15, fontWeight: 700, fontFamily: "inherit", letterSpacing: "0.04em" }}>
        {children}
      </h2>
    </div>
  );
}

function InfoRow({ label, value, blur }: { label: string; value: string; blur?: boolean }) {
  return (
    <tr style={{ borderBottom: "1px solid #EEE" }}>
      <td style={{ background: "#F5F2EC", color: "#777", fontSize: 12, fontWeight: 600, padding: "12px 16px", width: 100, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
        {label}
      </td>
      <td style={{ color: blur ? "#BBB" : "#222", fontSize: 13, padding: "12px 16px", filter: blur ? "blur(4px)" : "none", userSelect: blur ? "none" : "auto" }}>
        {value}
      </td>
    </tr>
  );
}

function TagRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: "#888", fontSize: 11, letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>{label}</span>
      <span style={{ display: "inline-block", background: "#F0ECE4", border: "1px solid #DDD", color: "#444", fontSize: 12, padding: "4px 12px", borderRadius: 2 }}>
        {value}
      </span>
    </div>
  );
}
