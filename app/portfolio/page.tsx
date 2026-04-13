"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import PortfolioCard from "@/components/PortfolioCard";
import PortfolioModal from "@/components/PortfolioModal";
import FloatingSupport from "@/components/FloatingSupport";
import { Portfolio } from "@/lib/mockData";
import { useSite } from "@/context/SiteContext";

// ── 자동 순환 훅 ──────────────────────────────────────────────────────────────
const ROTATE_MS = 60000; // 1분마다 자동 전환

function useAutoRotate<T>(items: T[], pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const [page, setPage] = useState(0);

  // 아이템 바뀌면(필터) 페이지 초기화
  useEffect(() => { setPage(0); }, [items.length]);

  // page가 바뀔 때마다(수동 클릭 포함) 타이머 리셋 → 게이지와 항상 동기화
  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setTimeout(() => setPage(p => (p + 1) % totalPages), ROTATE_MS);
    return () => clearTimeout(t);
  }, [totalPages, page]);

  const displayed = items.slice(page * pageSize, page * pageSize + pageSize);
  return { displayed, page, totalPages, setPage };
}

// ── 진행 바 + 도트 인디케이터 ─────────────────────────────────────────────────
function RotateIndicator({
  page, totalPages, setPage, accentColor = "#C9A84C",
}: {
  page: number; totalPages: number; setPage: (p: number) => void; accentColor?: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i)}
          style={{
            width: i === page ? 18 : 6,
            height: 6,
            borderRadius: 3,
            background: i === page ? accentColor : "#2E2E2E",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.35s ease",
          }}
        />
      ))}
    </div>
  );
}

function ProgressBar({ page, accentColor = "#C9A84C" }: { page: number; accentColor?: string }) {
  return (
    <div style={{ height: 2, background: "#1A1A1A", marginBottom: 22, overflow: "hidden", position: "relative" }}>
      <div
        key={page}
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          background: `linear-gradient(90deg, ${accentColor}50, ${accentColor})`,
          animation: `rotateProgress ${ROTATE_MS}ms linear`,
        }}
      />
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const { user, isLoading } = useAuth();
  const { portfolios, industries, pageTexts, gradePermissions, portfolioTierLabels } = useSite();
  const router = useRouter();
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [industry, setIndustry] = useState("전체");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoading) {
      if (!user) { router.replace("/auth/login"); return; }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const perm = user.role === "admin"
    ? { canViewPortfolio: true, canViewMemberOnly: true, canViewContact: true, canWritePost: true, accessibleBoards: [] }
    : (gradePermissions[user.role as "gold" | "silver" | "bronze"] ?? { canViewPortfolio: true, canViewMemberOnly: false, canViewContact: false, canWritePost: true, accessibleBoards: [] });

  if (!perm.canViewPortfolio) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
        <Navbar />
        <div style={{ paddingTop: 160, textAlign: "center" }}>
          <p style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.3em", marginBottom: 12 }}>ACCESS DENIED</p>
          <p style={{ color: "#6A6A5A", fontSize: 14 }}>포트폴리오 열람 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  const filtered = portfolios.filter((p) => {
    if (!perm.canViewMemberOnly && p.memberOnly) return false;
    if (industry !== "전체" && p.industry !== industry) return false;
    if (search && !p.title.includes(search) && !p.company.includes(search) && !p.description.includes(search)) return false;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <Navbar />
      <main style={{ paddingTop: 80 }}>

        {/* Page header */}
        <section style={{ padding: "52px 40px 36px", borderBottom: "1px solid #1E1E1E" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.3em", marginBottom: 12 }}>{pageTexts.portfolioLabel}</p>
              <h1 style={{ color: "#F0EBE0", fontSize: 30, fontWeight: 300, fontFamily: "inherit", letterSpacing: "0.04em", marginBottom: 10 }}>
                {pageTexts.portfolioTitle}
              </h1>
              <p style={{ color: "#8A8A7A", fontSize: 14 }}>총 {filtered.length}개의 {pageTexts.portfolioSubSuffix}</p>
            </motion.div>
          </div>
        </section>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 40px 80px" }}>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}
          >
            <div style={{ flex: "1 1 220px" }}>
              <label style={{ display: "block", color: "#8A8A7A", fontSize: 12, letterSpacing: "0.1em", marginBottom: 8 }}>검색</label>
              <input
                className="input-premium"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="기업명, 사업명으로 검색"
                style={{ maxWidth: 260 }}
              />
            </div>

            {industries.length > 0 && (
              <div>
                <label style={{ display: "block", color: "#8A8A7A", fontSize: 12, letterSpacing: "0.1em", marginBottom: 8 }}>업종</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["전체", ...industries].map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      style={{
                        padding: "5px 18px",
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        background: industry === ind ? "#2A2A2A" : "transparent",
                        border: `1px solid ${industry === ind ? "#5A5A4A" : "#2A2A2A"}`,
                        color: industry === ind ? "#C0BAA8" : "#6A6A5A",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                      }}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div className="gold-divider" style={{ marginBottom: 48 }} />

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#5A5A4A", fontSize: 14 }}>
              검색 조건에 맞는 포트폴리오가 없습니다.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>

              <TierSection
                label={portfolioTierLabels["1등급"]}
                items={filtered.filter((p) => p.category === "1등급")}
                cols={3}
                pageSize={6}
                cardSize="medium"
                onSelect={setSelectedPortfolio}
                accentColor="#C9A84C"
              />

              <Tier2Section
                label={portfolioTierLabels["2등급"]}
                items={filtered.filter((p) => p.category === "2등급")}
                onSelect={setSelectedPortfolio}
              />

              <TierSection
                label={portfolioTierLabels["3등급"]}
                items={filtered.filter((p) => p.category === "3등급")}
                cols={4}
                pageSize={8}
                cardSize="tiny"
                onSelect={setSelectedPortfolio}
                accentColor="#7A6A5A"
              />

              <BoardTierSection
                label={portfolioTierLabels["4등급"]}
                items={filtered.filter((p) => p.category === "4등급")}
                onSelect={setSelectedPortfolio}
              />

            </div>
          )}
        </div>
      </main>

      <style>{`
        @media (max-width: 1200px) {
          .tier-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
          .tier-grid-4 { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .tier-grid-3 { grid-template-columns: repeat(1, 1fr) !important; }
          .tier-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .tier-grid-4 { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>

      <PortfolioModal portfolio={selectedPortfolio} onClose={() => setSelectedPortfolio(null)} canViewContact={perm.canViewContact} />
      <FloatingSupport />
    </div>
  );
}

/* ────────────────────────────────────────────
   그리드 섹션 (1등급 · 3등급) — 자동 순환
──────────────────────────────────────────── */
interface TierSectionProps {
  label: string;
  items: Portfolio[];
  cols: number;
  pageSize: number;
  cardSize: "large" | "medium" | "small" | "tiny";
  onSelect: (p: Portfolio) => void;
  accentColor: string;
}

function TierSection({ label, items, cols, pageSize, cardSize, onSelect, accentColor }: TierSectionProps) {
  const { displayed, page, totalPages, setPage } = useAutoRotate(items, pageSize);
  if (items.length === 0) return null;

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <h2 style={{ color: "#F0EBE0", fontSize: 20, fontWeight: 400, fontFamily: "inherit", letterSpacing: "0.04em" }}>
          {label}
        </h2>
        <span style={{ color: "#6A6A5A", fontSize: 13 }}>{items.length}개</span>
        <div style={{ flex: 1, height: 1, background: "#222222" }} />
        <RotateIndicator page={page} totalPages={totalPages} setPage={setPage} accentColor={accentColor} />
      </div>

      {/* 카드 그리드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className={`tier-grid-${cols}`}
          style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}
        >
          {displayed.map((p, i) => (
            <PortfolioCard key={p.id} portfolio={p} index={i} size={cardSize} onClick={onSelect} />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

/* ────────────────────────────────────────────
   게시판 섹션 (4등급) — 자동 순환
──────────────────────────────────────────── */
const BOARD_PAGE_SIZE = 8;

function BoardTierSection({ label, items, onSelect }: { label: string; items: Portfolio[]; onSelect: (p: Portfolio) => void }) {
  const { displayed, page, totalPages, setPage } = useAutoRotate(items, BOARD_PAGE_SIZE);
  if (items.length === 0) return null;

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <h2 style={{ color: "#F0EBE0", fontSize: 20, fontWeight: 400, fontFamily: "inherit", letterSpacing: "0.04em" }}>
          {label}
        </h2>
        <span style={{ color: "#6A6A5A", fontSize: 13 }}>{items.length}개</span>
        <div style={{ flex: 1, height: 1, background: "#222222" }} />
        <RotateIndicator page={page} totalPages={totalPages} setPage={setPage} accentColor="#7A7A6A" />
      </div>

      {/* 테이블 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ border: "1px solid #1E1E1E", borderRadius: 2, overflow: "hidden" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "11px 20px", background: "#111111", borderBottom: "1px solid #1E1E1E" }}>
            {["사업명", "업종", "지역"].map((h) => (
              <span key={h} style={{ color: "#7A7A6A", fontSize: 12, letterSpacing: "0.1em" }}>{h}</span>
            ))}
          </div>
          {displayed.map((p, i) => (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "14px 20px", borderBottom: i < displayed.length - 1 ? "1px solid #181818" : "none", cursor: "pointer", transition: "background 0.15s", alignItems: "center" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#141414"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <div>
                <div style={{ color: "#F0EBE0", fontSize: 13, marginBottom: 4 }}>{p.title}</div>
                <div style={{ color: "#6A6A5A", fontSize: 12 }}>{p.company}</div>
              </div>
              <span style={{ color: "#8A8A7A", fontSize: 13 }}>{p.industry}</span>
              <span style={{ color: "#8A8A7A", fontSize: 13 }}>{p.location}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

/* ────────────────────────────────────────────
   2등급 전용: 좌측 카드 그리드 + 우측 써머리 — 자동 순환
──────────────────────────────────────────── */
const GRID2_SIZE = 6;

function Tier2Section({ label, items, onSelect }: { label: string; items: Portfolio[]; onSelect: (p: Portfolio) => void }) {
  // 좌측 카드와 우측 써머리는 같은 page를 공유 (sync)
  const { displayed: gridItems, page, totalPages, setPage } = useAutoRotate(items, GRID2_SIZE);

  if (items.length === 0) return null;

  // 우측 써머리: 현재 페이지의 같은 항목 중 최대 4개
  const summaryItems = gridItems.slice(0, 4);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <h2 style={{ color: "#F0EBE0", fontSize: 20, fontWeight: 400, fontFamily: "inherit", letterSpacing: "0.04em" }}>
          {label}
        </h2>
        <span style={{ color: "#6A6A5A", fontSize: 13 }}>{items.length}개</span>
        <div style={{ flex: 1, height: 1, background: "#222222" }} />
        <RotateIndicator page={page} totalPages={totalPages} setPage={setPage} accentColor="#B0B0A0" />
      </div>

      {/* 좌우 레이아웃 */}
      <div className="tier2-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* 좌측: 카드 그리드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, alignContent: "start", minWidth: 0 }}
          >
            {gridItems.map((p, i) => (
              <PortfolioCard key={p.id} portfolio={p} index={i} size="medium" onClick={onSelect} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* 우측: 써머리 박스 */}
        <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", border: "1px solid #1A1A1A", borderRadius: 2, background: "#0E0E0E" }}>
          <div style={{ padding: "13px 16px", borderBottom: "1px solid #1E1E1E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#B0A898", fontSize: 12, letterSpacing: "0.1em" }}>{label} 목록</span>
            <span style={{ color: "#6A6A5A", fontSize: 12 }}>{items.length}건</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflowY: "auto", minHeight: 0 }}
            >
              {summaryItems.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => onSelect(p)}
                  style={{ padding: "11px 16px", borderBottom: i < summaryItems.length - 1 ? "1px solid #181818" : "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#161616"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                >
                  <div style={{ color: "#E0DBD0", fontSize: 13, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p.title}</div>
                  <div style={{ color: "#7A7A6A", fontSize: 12, marginTop: 3 }}>{p.industry} · {p.location}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div style={{ padding: "11px 16px", borderTop: "1px solid #1E1E1E", textAlign: "center" }}>
            <span style={{ color: "#5A5A4A", fontSize: 12 }}>
              {page + 1} / {totalPages} 페이지
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .tier2-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.section>
  );
}
