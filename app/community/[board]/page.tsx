"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth, ROLE_COLORS } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Post } from "@/lib/mockData";
import { useSite } from "@/context/SiteContext";

export default function BoardPage() {
  const { user, isLoading } = useAuth();
  const { posts: allPosts, addPost, gradePermissions, boards } = useSite();
  const router = useRouter();
  const params = useParams();
  const boardId = params.board as string;
  const board = boards.find((b) => b.id === boardId);
  const [showWrite, setShowWrite] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const posts = allPosts.filter((p) => p.boardId === boardId);

  useEffect(() => {
    if (!isLoading) {
      if (!user) { router.replace("/auth/login"); return; }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !board) return null;

  const perm = user.role === "admin"
    ? { canWritePost: true, accessibleBoards: ["lounge","deal","insight","network"] }
    : (gradePermissions[user.role as "gold"|"silver"|"bronze"] ?? { canWritePost: false, accessibleBoards: [] });

  if (!perm.accessibleBoards.includes(boardId)) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
        <Navbar />
        <div style={{ paddingTop: 160, textAlign: "center" }}>
          <p style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.3em", marginBottom: 12 }}>ACCESS DENIED</p>
          <p style={{ color: "#4A4A4A", fontSize: 14 }}>이 게시판에 접근할 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPost({
      boardId,
      title: form.title,
      content: form.content,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
    });
    setForm({ title: "", content: "" });
    setShowWrite(false);
    setSubmitStatus("게시글이 등록되었습니다.");
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <Navbar />
      <main style={{ paddingTop: 80 }}>

        {/* Header */}
        <section style={{ padding: "40px 40px 28px", borderBottom: "1px solid #1A1A1A" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Link href="/community" style={{ color: "#4A4A4A", fontSize: 12 }}>커뮤니티</Link>
                  <span style={{ color: "#2A2A2A" }}>›</span>
                  <span style={{ color: "#C9A84C", fontSize: 12 }}>{board.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ color: "#C9A84C", fontSize: 24 }}>{board.icon}</span>
                  <div>
                    <h1 style={{ color: "#F5F0E8", fontSize: 22, fontWeight: 300, fontFamily: "inherit", }}>
                      {board.name}
                    </h1>
                    <p style={{ color: "#4A4A4A", fontSize: 12 }}>{board.description}</p>
                  </div>
                </div>
              </motion.div>
              {perm.canWritePost && (
                <button
                  onClick={() => setShowWrite((v) => !v)}
                  className="btn-gold"
                  style={{ padding: "10px 24px", fontSize: 11, letterSpacing: "0.15em", border: "none", cursor: "pointer" }}
                >
                  {showWrite ? "취소" : "+ 글쓰기"}
                </button>
              )}
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 40px 80px" }}>

          {/* Write form */}
          <AnimatePresence>
            {showWrite && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", marginBottom: 28 }}
              >
                <form
                  onSubmit={handleSubmit}
                  style={{ background: "#141414", border: "1px solid #C9A84C20", padding: "24px" }}
                >
                  <h3 style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.2em", marginBottom: 20 }}>새 게시글 작성</h3>
                  <div style={{ marginBottom: 14 }}>
                    <input
                      className="input-premium"
                      type="text"
                      placeholder="제목을 입력하세요"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <textarea
                      className="input-premium"
                      placeholder="내용을 입력하세요. 이미지는 URL 형식으로 첨부 가능합니다."
                      value={form.content}
                      onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                      rows={6}
                      required
                      style={{ resize: "vertical", width: "100%" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => setShowWrite(false)}
                      style={{ padding: "9px 20px", background: "transparent", border: "1px solid #2A2A2A", color: "#6A6A5A", cursor: "pointer", fontSize: 12 }}
                    >
                      취소
                    </button>
                    <button type="submit" className="btn-gold" style={{ padding: "9px 24px", fontSize: 11, letterSpacing: "0.12em", border: "none", cursor: "pointer" }}>
                      등록
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {submitStatus && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ background: "#1A3A1A", border: "1px solid #3A8A3A", color: "#80E080", fontSize: 12, padding: "10px 14px", marginBottom: 20 }}>
              {submitStatus}
            </motion.div>
          )}

          {/* Post list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A" }}>
            {/* Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 80px 60px",
                gap: 12,
                padding: "10px 18px",
                background: "#0F0F0F",
                borderBottom: "1px solid #2A2A2A",
              }}
            >
              {["제목", "작성자", "날짜", "조회"].map((h) => (
                <span key={h} style={{ color: "#3A3A3A", fontSize: 10, letterSpacing: "0.15em" }}>{h}</span>
              ))}
            </div>
            {posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#3A3A3A", background: "#141414" }}>
                등록된 게시글이 없습니다.
              </div>
            ) : (
              posts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <Link
                    href={`/community/${boardId}/${post.id}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 80px 80px 60px",
                      gap: 12,
                      padding: "15px 18px",
                      background: "#141414",
                      textDecoration: "none",
                      alignItems: "center",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1A1A1A")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#141414")}
                  >
                    <div>
                      <p style={{ color: "#F5F0E8", fontSize: 13, fontFamily: "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {post.title}
                      </p>
                      {post.tags && (
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          {post.tags.slice(0, 2).map((t) => (
                            <span key={t} style={{ color: "#C9A84C40", fontSize: 10 }}>#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span style={{ color: ROLE_COLORS[post.authorRole as keyof typeof ROLE_COLORS] || "#6A6A5A", fontSize: 12 }}>
                      {post.author}
                    </span>
                    <span style={{ color: "#3A3A3A", fontSize: 11 }}>{post.createdAt}</span>
                    <span style={{ color: "#3A3A3A", fontSize: 11 }}>{post.views}</span>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
