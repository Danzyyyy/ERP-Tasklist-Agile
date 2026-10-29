// src/Types/api.ts

export interface ApiResponse<T = unknown> {
  success: boolean;
  status?: string | number;
  message?: string;
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number;
  to?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ApiValidationError {
  message: string;
  validationErrors?: Record<string, string>;
  allErrors?: string[];
  status: 422;
  isValidationError: true;
}
