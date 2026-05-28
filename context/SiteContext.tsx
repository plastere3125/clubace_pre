"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { PORTFOLIO_MOCK, POSTS_MOCK, BOARDS, Portfolio, Post, Board } from "@/lib/mockData";
import { UserRole } from "./AuthContext";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BrandConfig {
  logoText: string;
  tagline: string;
  logoImageUrl: string | null; // base64 or URL
  showDemoAccounts: boolean;   // 로그인 페이지 테스트 계정 노출 여부
}

export interface GradePermission {
  canViewPortfolio: boolean;     // 포트폴리오 페이지 접근
  canViewMemberOnly: boolean;    // 멤버전용 콘텐츠 열람
  canViewContact: boolean;       // 연락처 열람
  canWritePost: boolean;         // 게시글 작성
  accessibleBoards: string[];    // 접근 가능 게시판 ID 목록
}

export type GradePermissions = Record<"gold" | "silver" | "bronze", GradePermission>;

export type GradeLabels = Record<"gold" | "silver" | "bronze", string>;

export interface MemberGrade {
  id: string;       // 내부 키 (gold / silver / bronze / custom_xxx)
  label: string;    // 표시 이름
  color: string;    // HEX 색상
}

export type PortfolioTierLabels = Record<"1등급" | "2등급" | "3등급" | "4등급", string>;

export interface PageTexts {
  // 로그인
  loginAgeText: string;
  loginAgeSubText: string;
  loginButtonText: string;
  loginRegisterText: string;
  loginRegisterLink: string;
  // 대시보드
  dashWelcome: string;
  dashFeaturedTitle: string;
  dashRecentTitle: string;
  dashBoardsTitle: string;
  // 포트폴리오
  portfolioLabel: string;
  portfolioTitle: string;
  portfolioSubSuffix: string;
  // 커뮤니티
  communityLabel: string;
  communityTitle: string;
  communityRecentTitle: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salary: string;
  description: string;
  benefits: string[];
  contact: string;
  kakaoUrl: string;
  telegramUrl: string;
  imageUrl: string;
  createdAt: string;
  adStatus: "disconnected" | "connected";
  adConnectedAt?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  joinedAt: string;
}

export interface PendingMember {
  id: string;
  name: string;
  email: string;
  password: string;
  company?: string;
  role: string;
}

interface SiteContextType {
  brand: BrandConfig;
  pageTexts: PageTexts;
  navLinks: NavLink[];
  portfolios: Portfolio[];
  posts: Post[];
  members: Member[];
  pendingMembers: PendingMember[];
  boards: Board[];
  industries: string[];
  gradePermissions: GradePermissions;
  gradeLabels: GradeLabels;
  portfolioTierLabels: PortfolioTierLabels;
  memberGrades: MemberGrade[];
  addMemberGrade: (g: Omit<MemberGrade, "id">) => void;
  updateMemberGrade: (id: string, updates: Partial<Omit<MemberGrade, "id">>) => void;
  removeMemberGrade: (id: string) => void;
  // Brand & PageTexts
  updateBrand: (updates: Partial<BrandConfig>) => void;
  updatePageTexts: (updates: Partial<PageTexts>) => void;
  updateGradePermission: (grade: "gold" | "silver" | "bronze", updates: Partial<GradePermission>) => void;
  updateGradeLabel: (grade: "gold" | "silver" | "bronze", label: string) => void;
  updatePortfolioTierLabel: (tier: keyof PortfolioTierLabels, label: string) => void;
  // Nav
  updateNavLink: (index: number, label: string) => void;
  // Portfolio CRUD
  addPortfolio: (p: Omit<Portfolio, "id">) => void;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
  deletePortfolio: (id: string) => void;
  // Post CRUD
  addPost: (p: Omit<Post, "id">) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  // Members
  addMember: (m: Omit<Member, "id" | "joinedAt">) => void;
  approveMember: (id: string, role: UserRole) => void;
  rejectMember: (id: string) => void;
  changeMemberRole: (id: string, role: UserRole) => void;
  deleteMember: (id: string) => void;
  refreshPending: () => void;
  // Boards
  updateBoard: (id: string, updates: Partial<Omit<Board, "id">>) => void;
  // Industries
  addIndustry: (name: string) => void;
  removeIndustry: (name: string) => void;
  // Support
  supportKakaoUrl: string;
  updateSupportKakaoUrl: (url: string) => void;
  jobPostings: JobPosting[];
  addJobPosting: (j: Omit<JobPosting, "id" | "createdAt" | "adStatus">) => void;
  updateJobPosting: (id: string, updates: Partial<JobPosting>) => void;
  deleteJobPosting: (id: string) => void;
  connectJobAd: (id: string) => void;
  disconnectJobAd: (id: string) => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_BRAND: BrandConfig = {
  logoText: "COMPANY LOGO",
  tagline: "PREMIUM BUSINESS NETWORK",
  logoImageUrl: null,
  showDemoAccounts: true,
};

const DEFAULT_NAV: NavLink[] = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/community", label: "커뮤니티" },
];

const DEFAULT_INDUSTRIES: string[] = ["부동산", "외식", "바이오", "물류", "IT"];

const ALL_BOARDS = ["lounge", "deal", "insight", "network"];
const DEFAULT_GRADE_LABELS: GradeLabels = {
  gold: "GOLD",
  silver: "SILVER",
  bronze: "BRONZE",
};

const DEFAULT_MEMBER_GRADES: MemberGrade[] = [
  { id: "gold",   label: "GOLD",   color: "#FFD700" },
  { id: "silver", label: "SILVER", color: "#C0C0C0" },
  { id: "bronze", label: "BRONZE", color: "#CD7F32" },
];

const DEFAULT_PORTFOLIO_TIER_LABELS: PortfolioTierLabels = {
  "1등급": "1등급",
  "2등급": "2등급",
  "3등급": "3등급",
  "4등급": "4등급",
};

const DEFAULT_GRADE_PERMISSIONS: GradePermissions = {
  gold:   { canViewPortfolio: true,  canViewMemberOnly: true,  canViewContact: true,  canWritePost: true,  accessibleBoards: ALL_BOARDS },
  silver: { canViewPortfolio: true,  canViewMemberOnly: true,  canViewContact: true,  canWritePost: true,  accessibleBoards: ALL_BOARDS },
  bronze: { canViewPortfolio: true,  canViewMemberOnly: false, canViewContact: false, canWritePost: true,  accessibleBoards: ["lounge", "network"] },
};

const DEFAULT_PAGE_TEXTS: PageTexts = {
  loginAgeText: "본인은 만 19세 이상 성인임을 확인합니다",
  loginAgeSubText: "본 플랫폼은 성인 전용 프라이빗 비즈니스 네트워크입니다",
  loginButtonText: "입장하기",
  loginRegisterText: "아직 회원이 아니신가요?",
  loginRegisterLink: "멤버십 신청",
  dashWelcome: "WELCOME BACK",
  dashFeaturedTitle: "주목 포트폴리오",
  dashRecentTitle: "최근 게시글",
  dashBoardsTitle: "커뮤니티 게시판",
  portfolioLabel: "PORTFOLIO",
  portfolioTitle: "비즈니스 포트폴리오",
  portfolioSubSuffix: "프리미엄 비즈니스 기회",
  communityLabel: "COMMUNITY",
  communityTitle: "멤버 커뮤니티",
  communityRecentTitle: "최근 활동",
};

const DEFAULT_MEMBERS: Member[] = [
  { id: "1", name: "관리자", email: "admin@premium.com", role: "admin", joinedAt: "2024-01-01" },
  { id: "2", name: "골드회원", email: "gold@premium.com", role: "gold", company: "프리미엄그룹", joinedAt: "2024-02-15" },
  { id: "3", name: "실버회원", email: "silver@premium.com", role: "silver", company: "실버컴퍼니", joinedAt: "2024-03-10" },
  { id: "4", name: "브론즈회원", email: "bronze@premium.com", role: "bronze", company: "브론즈코", joinedAt: "2024-04-05" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND);
  const [pageTexts, setPageTexts] = useState<PageTexts>(DEFAULT_PAGE_TEXTS);
  const [navLinks, setNavLinks] = useState<NavLink[]>(DEFAULT_NAV);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(PORTFOLIO_MOCK);
  const [posts, setPosts] = useState<Post[]>(POSTS_MOCK);
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [industries, setIndustries] = useState<string[]>(DEFAULT_INDUSTRIES);
  const [gradePermissions, setGradePermissions] = useState<GradePermissions>(DEFAULT_GRADE_PERMISSIONS);
  const [gradeLabels, setGradeLabels] = useState<GradeLabels>(DEFAULT_GRADE_LABELS);
  const [portfolioTierLabels, setPortfolioTierLabels] = useState<PortfolioTierLabels>(DEFAULT_PORTFOLIO_TIER_LABELS);
  const [memberGrades, setMemberGrades] = useState<MemberGrade[]>(DEFAULT_MEMBER_GRADES);
  const [boards, setBoards] = useState<Board[]>(BOARDS);
  const [supportKakaoUrl, setSupportKakaoUrl] = useState<string>("");
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);

  useEffect(() => {
    setBrand(load("site_brand", DEFAULT_BRAND));
    setPageTexts(load("site_page_texts", DEFAULT_PAGE_TEXTS));
    setNavLinks(load("site_nav", DEFAULT_NAV));
    // v3: 상세페이지 필드 추가 (구 캐시 제거)
    localStorage.removeItem("site_portfolios");
    localStorage.removeItem("site_portfolios_v3");
    setPortfolios(load("site_portfolios_v3", PORTFOLIO_MOCK));
    setPosts(load("site_posts", POSTS_MOCK));
    setMembers(load("site_members", DEFAULT_MEMBERS));
    setPendingMembers(JSON.parse(localStorage.getItem("pendingUsers") || "[]"));
    setIndustries(load("site_industries", DEFAULT_INDUSTRIES));
    setGradePermissions(load("site_grade_permissions", DEFAULT_GRADE_PERMISSIONS));
    setGradeLabels(load("site_grade_labels", DEFAULT_GRADE_LABELS));
    setPortfolioTierLabels(load("site_portfolio_tier_labels", DEFAULT_PORTFOLIO_TIER_LABELS));
    setMemberGrades(load("site_member_grades", DEFAULT_MEMBER_GRADES));
    setBoards(load("site_boards", BOARDS));
    setSupportKakaoUrl(load("site_support_kakao_url", ""));
    setJobPostings(load("site_job_postings", []));
  }, []);

  // Brand
  const updateBrand = useCallback((updates: Partial<BrandConfig>) => {
    setBrand(prev => { const next = { ...prev, ...updates }; save("site_brand", next); return next; });
  }, []);

  const updatePageTexts = useCallback((updates: Partial<PageTexts>) => {
    setPageTexts(prev => { const next = { ...prev, ...updates }; save("site_page_texts", next); return next; });
  }, []);

  // Nav
  const updateNavLink = useCallback((index: number, label: string) => {
    setNavLinks(prev => {
      const next = prev.map((l, i) => i === index ? { ...l, label } : l);
      save("site_nav", next);
      return next;
    });
  }, []);

  // Portfolio
  const addPortfolio = useCallback((p: Omit<Portfolio, "id">) => {
    setPortfolios(prev => { const next = [{ ...p, id: `p${Date.now()}` }, ...prev]; save("site_portfolios_v3", next); return next; });
  }, []);
  const updatePortfolio = useCallback((id: string, updates: Partial<Portfolio>) => {
    setPortfolios(prev => { const next = prev.map(p => p.id === id ? { ...p, ...updates } : p); save("site_portfolios_v3", next); return next; });
  }, []);
  const deletePortfolio = useCallback((id: string) => {
    setPortfolios(prev => { const next = prev.filter(p => p.id !== id); save("site_portfolios_v3", next); return next; });
  }, []);

  // Post
  const addPost = useCallback((p: Omit<Post, "id">) => {
    setPosts(prev => { const next = [{ ...p, id: `post${Date.now()}` }, ...prev]; save("site_posts", next); return next; });
  }, []);
  const updatePost = useCallback((id: string, updates: Partial<Post>) => {
    setPosts(prev => { const next = prev.map(p => p.id === id ? { ...p, ...updates } : p); save("site_posts", next); return next; });
  }, []);
  const deletePost = useCallback((id: string) => {
    setPosts(prev => { const next = prev.filter(p => p.id !== id); save("site_posts", next); return next; });
  }, []);

  // Members
  const addMember = useCallback((m: Omit<Member, "id" | "joinedAt">) => {
    const newMember: Member = { ...m, id: `m${Date.now()}`, joinedAt: new Date().toISOString().split("T")[0] };
    setMembers(prev => { const next = [...prev, newMember]; save("site_members", next); return next; });
  }, []);

  const refreshPending = useCallback(() => {
    setPendingMembers(JSON.parse(localStorage.getItem("pendingUsers") || "[]"));
  }, []);

  const approveMember = useCallback((id: string, role: UserRole) => {
    const pending: PendingMember[] = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
    const found = pending.find(u => u.id === id);
    if (!found) return;
    const newMember: Member = { id: found.id, name: found.name, email: found.email, role, company: found.company, joinedAt: new Date().toISOString().split("T")[0] };
    setMembers(prev => { const next = [...prev, newMember]; save("site_members", next); return next; });
    const updated = pending.filter(u => u.id !== id);
    localStorage.setItem("pendingUsers", JSON.stringify(updated));
    setPendingMembers(updated);
  }, []);

  const rejectMember = useCallback((id: string) => {
    const pending: PendingMember[] = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
    const updated = pending.filter(u => u.id !== id);
    localStorage.setItem("pendingUsers", JSON.stringify(updated));
    setPendingMembers(updated);
  }, []);

  const changeMemberRole = useCallback((id: string, role: UserRole) => {
    setMembers(prev => { const next = prev.map(m => m.id === id ? { ...m, role } : m); save("site_members", next); return next; });
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers(prev => { const next = prev.filter(m => m.id !== id); save("site_members", next); return next; });
  }, []);

  // Grade Permissions
  const updateGradePermission = useCallback((grade: "gold" | "silver" | "bronze", updates: Partial<GradePermission>) => {
    setGradePermissions(prev => {
      const next = { ...prev, [grade]: { ...prev[grade], ...updates } };
      save("site_grade_permissions", next);
      return next;
    });
  }, []);

  // Grade Labels
  const updateGradeLabel = useCallback((grade: "gold" | "silver" | "bronze", label: string) => {
    setGradeLabels(prev => {
      const next = { ...prev, [grade]: label };
      save("site_grade_labels", next);
      return next;
    });
  }, []);

  // Member Grades
  const addMemberGrade = useCallback((g: Omit<MemberGrade, "id">) => {
    setMemberGrades(prev => {
      const next = [...prev, { ...g, id: `grade_${Date.now()}` }];
      save("site_member_grades", next);
      return next;
    });
  }, []);
  const updateMemberGrade = useCallback((id: string, updates: Partial<Omit<MemberGrade, "id">>) => {
    setMemberGrades(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...updates } : g);
      save("site_member_grades", next);
      return next;
    });
  }, []);
  const removeMemberGrade = useCallback((id: string) => {
    setMemberGrades(prev => {
      const next = prev.filter(g => g.id !== id);
      save("site_member_grades", next);
      return next;
    });
  }, []);

  // Portfolio Tier Labels
  const updatePortfolioTierLabel = useCallback((tier: keyof PortfolioTierLabels, label: string) => {
    setPortfolioTierLabels(prev => {
      const next = { ...prev, [tier]: label };
      save("site_portfolio_tier_labels", next);
      return next;
    });
  }, []);

  // Boards
  const updateBoard = useCallback((id: string, updates: Partial<Omit<Board, "id">>) => {
    setBoards(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      save("site_boards", next);
      return next;
    });
  }, []);

  // Industries
  const addIndustry = useCallback((name: string) => {
    setIndustries(prev => {
      if (prev.includes(name)) return prev;
      const next = [...prev, name];
      save("site_industries", next);
      return next;
    });
  }, []);
  const removeIndustry = useCallback((name: string) => {
    setIndustries(prev => { const next = prev.filter(i => i !== name); save("site_industries", next); return next; });
  }, []);

  // Support
  const updateSupportKakaoUrl = useCallback((url: string) => {
    setSupportKakaoUrl(url);
    save("site_support_kakao_url", url);
  }, []);

  // Job Postings
  const addJobPosting = useCallback((j: Omit<JobPosting, "id" | "createdAt" | "adStatus">) => {
    setJobPostings(prev => {
      const next = [{ ...j, id: `job${Date.now()}`, createdAt: new Date().toISOString().split("T")[0], adStatus: "disconnected" as const }, ...prev];
      save("site_job_postings", next);
      return next;
    });
  }, []);
  const updateJobPosting = useCallback((id: string, updates: Partial<JobPosting>) => {
    setJobPostings(prev => { const next = prev.map(j => j.id === id ? { ...j, ...updates } : j); save("site_job_postings", next); return next; });
  }, []);
  const deleteJobPosting = useCallback((id: string) => {
    setJobPostings(prev => { const next = prev.filter(j => j.id !== id); save("site_job_postings", next); return next; });
  }, []);
  const connectJobAd = useCallback((id: string) => {
    setJobPostings(prev => {
      const next = prev.map(j => j.id === id ? { ...j, adStatus: "connected" as const, adConnectedAt: new Date().toISOString().split("T")[0] } : j);
      save("site_job_postings", next);
      return next;
    });
  }, []);
  const disconnectJobAd = useCallback((id: string) => {
    setJobPostings(prev => {
      const next = prev.map(j => j.id === id ? { ...j, adStatus: "disconnected" as const, adConnectedAt: undefined } : j);
      save("site_job_postings", next);
      return next;
    });
  }, []);

  return (
    <SiteContext.Provider value={{
      brand, pageTexts, navLinks, portfolios, posts, members, pendingMembers, boards, industries, gradePermissions, gradeLabels, portfolioTierLabels, memberGrades,
      updateBrand, updatePageTexts, updateNavLink, updateGradePermission, updateGradeLabel, updatePortfolioTierLabel, updateBoard,
      addPortfolio, updatePortfolio, deletePortfolio,
      addPost, updatePost, deletePost,
      addMember, approveMember, rejectMember, changeMemberRole, deleteMember, refreshPending,
      addMemberGrade, updateMemberGrade, removeMemberGrade,
      addIndustry, removeIndustry,
      supportKakaoUrl, updateSupportKakaoUrl,
      jobPostings, addJobPosting, updateJobPosting, deleteJobPosting, connectJobAd, disconnectJobAd,
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
