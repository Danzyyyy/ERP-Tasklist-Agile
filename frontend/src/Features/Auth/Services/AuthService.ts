// src/Features/Auth/Services/AuthService.ts
import { apiUtils } from "@/Services/Common/Base";
import type { ApiResponse } from "@/Types/api";
import type { User, DemoToken } from "@/Types/auth";

const AuthService = {
  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await apiUtils.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  getDemoTokens: async (): Promise<ApiResponse<DemoToken[]>> => {
    const response = await apiUtils.get<ApiResponse<DemoToken[]>>("/auth/demo-tokens");
    return response.data;
  },
};

export default AuthService;
