// src/Features/Modules/Schema/ModuleSchema.ts
import { z } from "zod";

export const CreateModuleSchema = z.object({
  project_id: z.string().min(1, "ID Proyek wajib diisi").default("PROJ-ERP-01"),
  code: z
    .string()
    .min(2, "Kode modul minimal 2 karakter")
    .max(50, "Kode modul maksimal 50 karakter")
    .toUpperCase(),
  name: z.string().min(3, "Nama modul minimal 3 karakter").max(255),
  description: z.string().optional(),
});

export type CreateModuleInput = z.input<typeof CreateModuleSchema>;
export type CreateModuleOutput = z.output<typeof CreateModuleSchema>;

export const CreateFeatureSchema = z.object({
  module_id: z.string().min(1, "Modul wajib dipilih"),
  code: z
    .string()
    .min(2, "Kode fitur minimal 2 karakter")
    .max(50, "Kode fitur maksimal 50 karakter")
    .toUpperCase(),
  name: z.string().min(3, "Nama fitur minimal 3 karakter").max(255),
  description: z.string().optional(),
});

export type CreateFeatureInput = z.input<typeof CreateFeatureSchema>;
export type CreateFeatureOutput = z.output<typeof CreateFeatureSchema>;
