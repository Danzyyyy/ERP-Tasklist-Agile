// src/Utils/formatters.ts
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const date = parseISO(dateStr);
    return format(date, "dd MMM yyyy", { locale: id });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const date = parseISO(dateStr);
    return format(date, "dd MMM yyyy, HH:mm", { locale: id });
  } catch {
    return dateStr;
  }
}

export function formatManHours(hours?: number | null): string {
  if (hours === undefined || hours === null) return "0h";
  return `${Number(hours).toFixed(1).replace(/\.0$/, "")}h`;
}

export function formatPercent(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "0.0%";
  return `${Number(value).toFixed(1)}%`;
}
