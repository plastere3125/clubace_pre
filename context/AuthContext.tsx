"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "gold" | "silver" | "bronze" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  approvedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAgeVerified: boolean;
  isLoading: boolean;
  verifyAge: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updates: { name?: string; company?: string }) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
  introduction?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users (실제 구현 시 API로 교체)
const MOCK_USERS: (User & { password: string })[] = [
  { id: "1", name: "관리자", email: "admin@premium.com", password: "admin123", role: "admin" },
  { id: "2", name: "골드회원", email: "gold@premium.com", password: "gold123", role: "gold", company: "프리미엄그룹" },
  { id: "3", name: "실버회원", email: "silver@premium.com", password: "silver123", role: "silver", company: "실버컴퍼니" },
  { id: "4", name: "브론즈회원", email: "bronze@premium.com", password: "bronze123", role: "bronze", company: "브론즈코" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ageVerified = sessionStorage.getItem("ageVerified") === "true";
    const storedUser = localStorage.getItem("currentUser");
    setIsAgeVerified(ageVerified);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const verifyAge = () => {
    sessionStorage.setItem("ageVerified", "true");
    setIsAgeVerified(true);
  };

  const login = async (email: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      // 승인된 실제 회원 확인
      const members: (User & { password?: string })[] = JSON.parse(localStorage.getItem("site_members") || "[]");
      const pendingUsers: (User & { password: string })[] = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
      const approvedMember = members.find(m => m.email === email);
      const pendingMatch = pendingUsers.find(u => u.email === email && u.password === password);
      if (pendingMatch) return { success: false, message: "관리자 승인 대기 중입니다." };
      if (!approvedMember) return { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
      // 비밀번호는 pendingUsers에서 찾아야 하나 이미 승인 후 삭제됨 — 별도 저장본 확인
      const allPasswords: Record<string, string> = JSON.parse(localStorage.getItem("member_passwords") || "{}");
      if (allPasswords[approvedMember.id] !== password) {
        return { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
      }
      setUser(approvedMember);
      localStorage.setItem("currentUser", JSON.stringify(approvedMember));
      return { success: true, message: "로그인 성공" };
    }
    if (found.role === "pending") {
      return { success: false, message: "관리자 승인 대기 중입니다. 승인 후 로그인 가능합니다." };
    }
    const { password: _, ...base } = found;
    // 저장된 프로필 업데이트 적용 (이름/소속 변경 반영)
    const members: User[] = JSON.parse(localStorage.getItem("site_members") || "[]");
    const saved = members.find(m => m.id === base.id);
    const userWithoutPassword = saved ? { ...base, name: saved.name, company: saved.company } : base;
    setUser(userWithoutPassword);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    return { success: true, message: "로그인 성공" };
  };

  const register = async (data: RegisterData) => {
    // Mock register — pending approval
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: "pending",
      company: data.company,
    };

    const pending = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
    pending.push(newUser);
    localStorage.setItem("pendingUsers", JSON.stringify(pending));
    // 비밀번호 별도 보관 (승인 후 로그인용)
    const passwords = JSON.parse(localStorage.getItem("member_passwords") || "{}");
    passwords[newUser.id] = data.password;
    localStorage.setItem("member_passwords", JSON.stringify(passwords));

    return { success: true, message: "가입 신청이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateProfile = (updates: { name?: string; company?: string }) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem("currentUser", JSON.stringify(next));
      // site_members에도 반영
      const members: User[] = JSON.parse(localStorage.getItem("site_members") || "[]");
      const updated = members.map(m => m.id === prev.id ? { ...m, ...updates } : m);
      localStorage.setItem("site_members", JSON.stringify(updated));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAgeVerified, isLoading, verifyAge, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "관리자",
  gold: "GOLD",
  silver: "SILVER",
  bronze: "BRONZE",
  pending: "승인 대기",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: "#C9A84C",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  pending: "#666666",
};
