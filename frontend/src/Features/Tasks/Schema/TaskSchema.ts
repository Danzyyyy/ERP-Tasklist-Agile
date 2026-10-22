// src/Features/Tasks/Schema/TaskSchema.ts
import { z } from "zod";

export const CreateTaskSchema = z.object({
  module_id: z.string().min(1, "Modul wajib dipilih"),
  feature_id: z.string().optional().nullable(),
  task_code: z
    .string()
    .min(2, "Kode tugas minimal 2 karakter")
    .max(50, "Kode tugas maksimal 50 karakter")
    .toUpperCase(),
  title: z.string().min(3, "Judul tugas minimal 3 karakter").max(255),
  description: z.string().optional().nullable(),
  complexity_weight: z.enum(["LOW", "MEDIUM", "HIGH"]),
  estimated_man_hours: z
    .union([z.string(), z.number()])
    .refine((v) => !Number.isNaN(Number(v)), "Estimasi jam harus berupa angka")
    .transform((v) => Number(v))
    .refine((v) => v >= 0.25, "Estimasi jam kerja minimal 0.25 man-hour (Q-02)"),
  target_deadline: z.string().min(1, "Tenggat waktu acuan wajib ditentukan (Q-11)"),
});

export type CreateTaskInput = z.input<typeof CreateTaskSchema>;
export type CreateTaskOutput = z.output<typeof CreateTaskSchema>;

export const AssignTaskSchema = z.object({
  assignee_id: z.string().min(1, "Pelaksana (assignee) wajib dipilih"),
  assignee_name: z.string().min(1, "Nama pelaksana wajib diisi"),
});

export type AssignTaskInput = z.input<typeof AssignTaskSchema>;
export type AssignTaskOutput = z.output<typeof AssignTaskSchema>;
