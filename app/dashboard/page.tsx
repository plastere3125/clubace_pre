"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth, ROLE_LABELS, ROLE_COLORS } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useSite } from "@/context/SiteContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { portfolios, posts, pageTexts, boards } = useSite();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) { router.replace("/"); return; }
      if (user.role !== "admin") { router.replace("/portfolio"); return; }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const recentPosts = posts.slice(0, 5);
  const featuredPortfolios = portfolios.slice(0, 5);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <Navbar />

      <main style={{ paddingTop: 80 }}>

        {/* Hero welcome */}
        <section
          style={{
            padding: "56px 40px 44px",
            borderBottom: "1px solid #1E1E1E",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 50%, #C9A84C08 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p style={{ color: "#6A6A5A", fontSize: 12, letterSpacing: "0.25em", marginBottom: 14 }}>
                {pageTexts.dashWelcome}
              </p>
              <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 300, fontFamily: "inherit", letterSpacing: "0.03em", marginBottom: 14 }}>
                <span style={{ color: "#F0EBE0" }}>{user.name}</span>
                <span style={{ color: "#C9A84C" }}> 님,</span>
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    padding: "4px 16px",
                    border: `1px solid ${ROLE_COLORS[user.role]}`,
                    color: ROLE_COLORS[user.role],
                    fontSize: 12,
                    letterSpacing: "0.12em",
                  }}
                >
                  {ROLE_LABELS[user.role]}
                </span>
                {user.company && (
                  <span style={{ color: "#8A8A7A", fontSize: 14 }}>{user.company}</span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "44px 40px 80px" }}>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 52 }}
          >
            {[
              { label: "총 포트폴리오", value: portfolios.length },
              { label: "활성 게시판",   value: boards.length },
              { label: "이번 주 신규 딜", value: 7 },
              { label: "네트워크 멤버",  value: 243 },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#141414", border: "1px solid #1E1E1E", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ color: "#C9A84C", fontSize: 32, fontFamily: "inherit", fontWeight: 300, marginBottom: 10 }}>
                  {stat.value}
                </div>
                <div style={{ color: "#8A8A7A", fontSize: 12, letterSpacing: "0.08em" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>

            {/* Featured portfolios */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ color: "#F0EBE0", fontSize: 15, fontFamily: "inherit", letterSpacing: "0.06em", fontWeight: 500 }}>
                  {pageTexts.dashFeaturedTitle}
                </h2>
                <Link href="/portfolio" style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.08em", borderBottom: "1px solid #C9A84C50", textDecoration: "none", paddingBottom: 1 }}>
                  전체 보기
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A" }}>
                {featuredPortfolios.map((p, i) => (
                  <Link
                    key={p.id}
                    href="/portfolio"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 16px",
                      background: "#141414",
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1C1C1C")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#141414")}
                  >
                    <span style={{ color: "#4A4A42", fontSize: 12, fontFamily: "inherit", minWidth: 22 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <img src={p.imageUrl} alt="" style={{ width: 48, height: 34, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <p style={{ color: "#F0EBE0", fontSize: 13, fontFamily: "inherit", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.title}
                      </p>
                      <p style={{ color: "#7A7A6A", fontSize: 12 }}>{p.industry} · {p.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent posts */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ color: "#F0EBE0", fontSize: 15, fontFamily: "inherit", letterSpacing: "0.06em", fontWeight: 500 }}>
                  {pageTexts.dashRecentTitle}
                </h2>
                <Link href="/community" style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.08em", borderBottom: "1px solid #C9A84C50", textDecoration: "none", paddingBottom: 1 }}>
                  커뮤니티
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A" }}>
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.boardId}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      padding: "14px 16px",
                      background: "#141414",
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1C1C1C")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#141414")}
                  >
                    <p style={{ color: "#F0EBE0", fontSize: 13, fontFamily: "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {post.title}
                    </p>
                    <div style={{ display: "flex", gap: 14 }}>
                      <span style={{ color: "#C9A84C", fontSize: 12 }}>{post.author}</span>
                      <span style={{ color: "#6A6A5A", fontSize: 12 }}>{post.createdAt}</span>
                      <span style={{ color: "#6A6A5A", fontSize: 12 }}>조회 {post.views}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Community boards quick access */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: 52 }}>
            <h2 style={{ color: "#F0EBE0", fontSize: 15, fontFamily: "inherit", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 18 }}>
              {pageTexts.dashBoardsTitle}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
              {boards.map((board) => (
                <Link
                  key={board.id}
                  href={`/community/${board.id}`}
                  className="card-glow"
                  style={{
                    background: "#141414",
                    border: "1px solid #1E1E1E",
                    padding: "26px 22px",
                    textDecoration: "none",
                    display: "block",
                    transition: "all 0.3s",
                  }}
                >
                  <div style={{ color: "#C9A84C", fontSize: 22, marginBottom: 12 }}>{board.icon}</div>
                  <h3 style={{ color: "#F0EBE0", fontSize: 14, fontFamily: "inherit", marginBottom: 8, fontWeight: 500 }}>{board.name}</h3>
                  <p style={{ color: "#7A7A6A", fontSize: 13, lineHeight: 1.6 }}>{board.description}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
