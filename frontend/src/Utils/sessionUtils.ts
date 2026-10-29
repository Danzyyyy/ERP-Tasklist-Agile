// src/Utils/sessionUtils.ts
import Cookies from "js-cookie";
import type { UserRole } from "@/Types/auth";

const TOKEN_KEY = "erp_auth_token";
const ROLE_KEY = "erp_active_role";

export const sessionUtils = {
  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
  },

  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: "lax" });
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  getActiveRole: (): UserRole | null => {
    const role = (Cookies.get(ROLE_KEY) || localStorage.getItem(ROLE_KEY)) as UserRole;
    return role || null;
  },

  setActiveRole: (role: UserRole): void => {
    Cookies.set(ROLE_KEY, role, { expires: 7, sameSite: "lax" });
    localStorage.setItem(ROLE_KEY, role);
  },

  clearSession: (): void => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(ROLE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};
