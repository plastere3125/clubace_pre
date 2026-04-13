"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import FloatingSupport from "@/components/FloatingSupport";
import { POSTS_MOCK } from "@/lib/mockData";
import { useSite } from "@/context/SiteContext";

export default function CommunityPage() {
  const { user, isLoading } = useAuth();
  const { pageTexts, gradePermissions, boards } = useSite();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
            if (!user) { router.replace("/auth/login"); return; }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const accessibleBoards = user.role === "admin"
    ? ["lounge","deal","insight","network"]
    : (gradePermissions[user.role as "gold"|"silver"|"bronze"]?.accessibleBoards ?? []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <Navbar />
      <main style={{ paddingTop: 80 }}>

        <section style={{ padding: "50px 40px 32px", borderBottom: "1px solid #1A1A1A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p style={{ color: "#C9A84C", fontSize: 10, letterSpacing: "0.4em", marginBottom: 10 }}>{pageTexts.communityLabel}</p>
              <h1 style={{ color: "#F5F0E8", fontSize: 28, fontWeight: 300, fontFamily: "inherit", letterSpacing: "0.05em" }}>
                {pageTexts.communityTitle}
              </h1>
            </motion.div>
          </div>
        </section>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 80px" }}>

          {/* Boards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 56 }}>
            {boards.map((board, i) => {
              const boardPosts = POSTS_MOCK.filter((p) => p.boardId === board.id);
              const latest = boardPosts[0];
              const hasAccess = accessibleBoards.includes(board.id);
              return (
                <motion.div
                  key={board.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={hasAccess ? `/community/${board.id}` : "#"}
                    onClick={e => !hasAccess && e.preventDefault()}
                    className={hasAccess ? "card-glow" : ""}
                    style={{
                      display: "block",
                      background: hasAccess ? "#141414" : "#0F0F0F",
                      border: `1px solid ${hasAccess ? "#2A2A2A" : "#1A1A1A"}`,
                      padding: "28px 28px 24px",
                      textDecoration: "none",
                      transition: "all 0.3s",
                      opacity: hasAccess ? 1 : 0.5,
                      cursor: hasAccess ? "pointer" : "not-allowed",
                      position: "relative",
                    }}
                  >
                    {!hasAccess && (
                      <div style={{ position: "absolute", top: 14, right: 14, color: "#3A3A3A", fontSize: 14 }}>🔒</div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div style={{ color: "#C9A84C", fontSize: 22, marginBottom: 10 }}>{board.icon}</div>
                        <h2 style={{ color: "#F5F0E8", fontSize: 16, fontFamily: "inherit", letterSpacing: "0.04em", marginBottom: 6 }}>
                          {board.name}
                        </h2>
                        <p style={{ color: "#4A4A4A", fontSize: 12 }}>{board.description}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#C9A84C", fontSize: 20, fontFamily: "inherit", }}>{boardPosts.length}</div>
                        <div style={{ color: "#3A3A3A", fontSize: 10, letterSpacing: "0.1em" }}>게시물</div>
                      </div>
                    </div>
                    {latest && (
                      <>
                        <div className="gold-divider" style={{ marginBottom: 12 }} />
                        <p style={{ color: "#6A6A5A", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span style={{ color: "#C9A84C80", marginRight: 8 }}>최신</span>
                          {latest.title}
                        </p>
                      </>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Recent activity */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={{ color: "#F5F0E8", fontSize: 14, fontFamily: "inherit", letterSpacing: "0.1em", marginBottom: 20 }}>
              {pageTexts.communityRecentTitle}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A" }}>
              {POSTS_MOCK.slice(0, 10).map((post) => {
                const board = boards.find((b) => b.id === post.boardId);
                return (
                  <Link
                    key={post.id}
                    href={`/community/${post.boardId}/${post.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 18px",
                      background: "#141414",
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1A1A1A")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#141414")}
                  >
                    <span style={{ color: "#C9A84C", fontSize: 13, minWidth: 18 }}>{board?.icon}</span>
                    <span style={{ color: "#4A4A4A", fontSize: 10, letterSpacing: "0.08em", minWidth: 80 }}>{board?.name}</span>
                    <span style={{ color: "#F5F0E8", fontSize: 12, fontFamily: "inherit", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {post.title}
                    </span>
                    <span style={{ color: "#3A3A3A", fontSize: 10 }}>{post.author}</span>
                    <span style={{ color: "#2A2A2A", fontSize: 10 }}>{post.createdAt}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
      <FloatingSupport />
    </div>
  );
}
