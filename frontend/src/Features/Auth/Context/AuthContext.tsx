// src/Features/Auth/Context/AuthContext.tsx
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AuthService from "../Services/AuthService";
import { AUTH_QUERY_KEYS } from "../Constants/AuthConstant";
import { sessionUtils } from "@/Utils/sessionUtils";
import type { User, UserRole, DemoToken } from "@/Types/auth";

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  demoTokens: DemoToken[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, targetRole: UserRole) => void;
  logout: () => void;
  switchRole: (targetRole: UserRole) => void;
  switchToken: (token: string, targetRole: UserRole) => void;
  isRole: (requiredRole: UserRole | UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FALLBACK_DEMO_TOKENS: DemoToken[] = [
  {
    role: "TECHNICAL_LEAD",
    name: "Fauzan (Technical Lead)",
    email: "tl@anaheim.id",
    token: "mock_tl",
    description: "Memiliki hak Dual-Approval Task Release dan Sign-off Final DONE.",
  },
  {
    role: "PROJECT_MANAGER",
    name: "Tubagus M. Wildan (Project Manager)",
    email: "pm@anaheim.id",
    token: "mock_pm",
    description: "Memiliki hak Dual-Approval Task Release dan Verifikasi Ceklis PM.",
  },
  {
    role: "DEVELOPER",
    name: "Ariel (Frontend Dev)",
    email: "dev@anaheim.id",
    token: "mock_dev",
    description: "Dapat menarik tugas ke Development dan mengajukan Code Review.",
  },
  {
    role: "TESTER",
    name: "Valdric (QA Tester)",
    email: "tester@anaheim.id",
    token: "mock_tester",
    description: "Dapat melakukan pengujian QA dan memicu Alur Rework.",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(() => sessionUtils.getToken());
  const [role, setRoleState] = useState<UserRole | null>(() => sessionUtils.getActiveRole());

  // Query demo tokens
  const { data: demoTokensData } = useQuery({
    queryKey: AUTH_QUERY_KEYS.demoTokens(),
    queryFn: async () => {
      try {
        const res = await AuthService.getDemoTokens();
        return res.data && res.data.length > 0 ? res.data : FALLBACK_DEMO_TOKENS;
      } catch {
        return FALLBACK_DEMO_TOKENS;
      }
    },
    staleTime: 1000 * 60 * 30,
  });

  const demoTokens = demoTokensData || FALLBACK_DEMO_TOKENS;

  // Query user profile
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await AuthService.getMe();
        return res.data;
      } catch {
        const match = demoTokens.find((d) => d.role === role) || demoTokens[0];
        return {
          id: match.token,
          name: match.name,
          email: match.email,
          role: match.role,
        };
      }
    },
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5,
  });

  const user = useMemo(() => {
    if (!token) return null;
    if (userData) return userData;
    const match = demoTokens.find((d) => d.role === role) || demoTokens[0];
    return {
      id: match.token,
      name: match.name,
      email: match.email,
      role: match.role,
    };
  }, [token, userData, demoTokens, role]);

  const login = useCallback(
    (newToken: string, newRole: UserRole) => {
      sessionUtils.setToken(newToken);
      sessionUtils.setActiveRole(newRole);
      setTokenState(newToken);
      setRoleState(newRole);
      queryClient.invalidateQueries();
      toast.success(`Berhasil masuk sebagai ${newRole}!`);
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    sessionUtils.clearSession();
    setTokenState(null);
    setRoleState(null);
    queryClient.clear();
    toast.info("Anda telah keluar dari sesi sistem.");
  }, [queryClient]);

  const switchToken = useCallback(
    async (newToken: string, newRole: UserRole) => {
      sessionUtils.setToken(newToken);
      sessionUtils.setActiveRole(newRole);
      setTokenState(newToken);
      setRoleState(newRole);
      await queryClient.invalidateQueries();
      toast.success(`Akses dialihkan ke ${newRole}`);
    },
    [queryClient],
  );

  const switchRole = useCallback(
    (targetRole: UserRole) => {
      const match = demoTokens.find((d) => d.role === targetRole);
      if (match) {
        switchToken(match.token, match.role);
      } else {
        sessionUtils.setActiveRole(targetRole);
        setRoleState(targetRole);
        queryClient.invalidateQueries();
      }
    },
    [demoTokens, switchToken, queryClient],
  );

  const isRole = useCallback(
    (requiredRole: UserRole | UserRole[]) => {
      if (!role) return false;
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(role);
      }
      return role === requiredRole;
    },
    [role],
  );

  const value = useMemo(
    () => ({
      user,
      role,
      token,
      demoTokens,
      isLoading: isUserLoading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      switchRole,
      switchToken,
      isRole,
    }),
    [user, role, token, demoTokens, isUserLoading, login, logout, switchRole, switchToken, isRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
