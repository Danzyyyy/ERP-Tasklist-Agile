// src/Hooks/useFilterParams.ts
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useFilterParams<T extends Record<string, string>>() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params as Partial<T>;
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof T, value?: string | number | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === undefined || value === null || value === "" || value === "ALL") {
          next.delete(key as string);
        } else {
          next.set(key as string, String(value));
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    filters,
    setFilter,
    resetFilters,
    searchParams,
  };
}

export default useFilterParams;
