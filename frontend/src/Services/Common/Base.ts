// src/Services/Common/Base.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { sessionUtils } from "@/Utils/sessionUtils";
import type { ApiResponse, ApiValidationError } from "@/Types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://168.110.206.131:8000/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Normalize response & errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // If backend returns { status: 'success' }, normalize it to success: true
    if (response.data && typeof response.data === "object") {
      if (response.data.status === "success" && response.data.success === undefined) {
        response.data.success = true;
      }
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error(error.message || "Gagal terhubung ke server backend"));
    }

    const { status, data } = error.response;

    // Handle 422 Validation Error
    if (status === 422) {
      const validationErrors: Record<string, string> = {};
      const allErrors: string[] = [];

      if (data?.errors && typeof data.errors === "object") {
        Object.entries(data.errors).forEach(([field, msgs]) => {
          const messageArray = Array.isArray(msgs) ? msgs : [String(msgs)];
          validationErrors[field] = messageArray[0] || "Validasi gagal";
          allErrors.push(...messageArray);
        });
      }

      const validationError: ApiValidationError = {
        message: data?.message || "Data yang dikirimkan tidak valid",
        validationErrors,
        allErrors,
        status: 422,
        isValidationError: true,
      };

      return Promise.reject(validationError);
    }

    // Handle 401 Unauthorized
    if (status === 401) {
      const message =
        data?.message || "Sesi autentikasi telah berakhir. Silakan pilih kembali peran demo.";
      return Promise.reject(new Error(message));
    }

    // Handle 403 Forbidden
    if (status === 403) {
      const message =
        data?.message || "Akses ditolak: Anda tidak memiliki wewenang untuk tindakan ini.";
      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error(data?.message || `Terjadi kesalahan server (${status})`));
  },
);

export const apiUtils = {
  get: <T = ApiResponse<unknown>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  post: <T = ApiResponse<unknown>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  put: <T = ApiResponse<unknown>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  patch: <T = ApiResponse<unknown>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  delete: <T = ApiResponse<unknown>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};
