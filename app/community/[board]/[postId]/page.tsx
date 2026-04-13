"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth, ROLE_LABELS, ROLE_COLORS } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { POSTS_MOCK } from "@/lib/mockData";
import { useSite } from "@/context/SiteContext";

export default function PostDetailPage() {
  const { user, isLoading } = useAuth();
  const { boards } = useSite();
  const router = useRouter();
  const params = useParams();
  const boardId = params.board as string;
  const postId = params.postId as string;

  const board = boards.find((b) => b.id === boardId);
  const post = POSTS_MOCK.find((p) => p.id === postId);

  useEffect(() => {
    if (!isLoading) {
            if (!user) { router.replace("/auth/login"); return; }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  if (!post || !board) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
        <Navbar />
        <div style={{ paddingTop: 120, textAlign: "center", color: "#4A4A4A", fontSize: 14 }}>
          게시글을 찾을 수 없습니다.
          <br />
          <Link href={`/community/${boardId}`} style={{ color: "#C9A84C", marginTop: 12, display: "inline-block" }}>
            게시판으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = POSTS_MOCK.filter((p) => p.boardId === boardId && p.id !== postId).slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 40px 80px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32 }}>
            <Link href="/community" style={{ color: "#4A4A4A", fontSize: 12 }}>커뮤니티</Link>
            <span style={{ color: "#2A2A2A" }}>›</span>
            <Link href={`/community/${boardId}`} style={{ color: "#4A4A4A", fontSize: 12 }}>{board.name}</Link>
            <span style={{ color: "#2A2A2A" }}>›</span>
            <span style={{ color: "#C9A84C", fontSize: 12 }}>게시글</span>
          </div>

          {/* Post */}
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Post header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ color: "#F5F0E8", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 300, fontFamily: "inherit", letterSpacing: "0.03em", lineHeight: 1.5, marginBottom: 16 }}>
                {post.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      border: `1px solid ${ROLE_COLORS[post.authorRole as keyof typeof ROLE_COLORS] || "#C9A84C"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: ROLE_COLORS[post.authorRole as keyof typeof ROLE_COLORS] || "#C9A84C",
                    }}
                  >
                    {post.author[0]}
                  </div>
                  <div>
                    <p style={{ color: "#C9A84C", fontSize: 12, fontFamily: "inherit", }}>{post.author}</p>
                    <p style={{ color: "#3A3A3A", fontSize: 10, letterSpacing: "0.08em" }}>
                      {ROLE_LABELS[post.authorRole as keyof typeof ROLE_LABELS] || post.authorRole}
                    </p>
                  </div>
                </div>
                <div style={{ color: "#3A3A3A", fontSize: 11 }}>
                  {post.createdAt} · 조회 {post.views}
                </div>
              </div>
            </div>

            <div className="gold-divider" style={{ marginBottom: 32 }} />

            {/* Post body */}
            <div style={{ color: "#B0AA9A", fontSize: 14, lineHeight: 1.9, fontFamily: "inherit", marginBottom: 36 }}>
              <p>{post.content}</p>
              <p style={{ marginTop: 20 }}>
                비즈니스 네트워크 회원 여러분과 이 인사이트를 공유합니다.
                귀중한 의견과 추가적인 관점이 있으시면 댓글로 공유해 주시기 바랍니다.
                지속적인 정보 공유와 네트워킹을 통해 함께 성장하는 프리미엄 커뮤니티를 만들어 나가겠습니다.
              </p>
            </div>

            {/* Tags */}
            {post.tags && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
                {post.tags.map((tag) => (
                  <span key={tag} style={{ padding: "4px 12px", border: "1px solid #C9A84C30", color: "#C9A84C60", fontSize: 11, letterSpacing: "0.08em" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="gold-divider" style={{ marginBottom: 32 }} />

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link
                href={`/community/${boardId}`}
                style={{ color: "#6A6A5A", fontSize: 12, letterSpacing: "0.08em", border: "1px solid #2A2A2A", padding: "10px 20px", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C30"; (e.currentTarget as HTMLElement).style.color = "#9A9A8A"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2A2A2A"; (e.currentTarget as HTMLElement).style.color = "#6A6A5A"; }}
              >
                ← 목록으로
              </Link>
            </div>
          </motion.article>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: 56 }}>
              <h2 style={{ color: "#C9A84C", fontSize: 11, letterSpacing: "0.2em", marginBottom: 20 }}>관련 게시글</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A" }}>
                {relatedPosts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/community/${boardId}/${p.id}`}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "#141414", textDecoration: "none", transition: "background 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1A1A1A")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#141414")}
                  >
                    <span style={{ color: "#F5F0E8", fontSize: 12, fontFamily: "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 16 }}>
                      {p.title}
                    </span>
                    <span style={{ color: "#3A3A3A", fontSize: 10, flexShrink: 0 }}>{p.createdAt}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
