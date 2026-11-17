// src/Components/Modals/CreateFeatureModal.tsx
import React, { memo } from "react";
import useCreateFeature from "@/Hooks/useCreateFeature";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Textarea } from "@/Components/Elements/Textarea";
import { Select } from "@/Components/Elements/Select";
import { Label } from "@/Components/Elements/Label";

export interface CreateFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModuleId?: string;
}

export const CreateFeatureModal = memo<CreateFeatureModalProps>(
  ({ isOpen, onClose, defaultModuleId }) => {
    const { register, errors, onSubmit, isPending, modules } = useCreateFeature({
      moduleId: defaultModuleId,
      onSuccess: onClose,
    });

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="lg"
        title="Tambah Fitur Baru ke Modul"
        description="Hierarki tingkat kedua opsional di bawah Modul (SOP-05)"
        footer={
          <>
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" form="create-feature-form" loading={isPending}>
              Simpan Fitur
            </Button>
          </>
        }
      >
        <form id="create-feature-form" onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <Label required>Modul Induk</Label>
            <Select {...register("module_id")} error={Boolean(errors.module_id)}>
              <option value="">Pilih Modul Induk...</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} — {m.name}
                </option>
              ))}
            </Select>
            {errors.module_id && (
              <p className="text-[11px] text-destructive mt-1">{errors.module_id.message}</p>
            )}
          </div>

          <div>
            <Label required>Kode Fitur</Label>
            <Input
              placeholder="Contoh: FTR-K04-03"
              {...register("code")}
              error={Boolean(errors.code)}
            />
            {errors.code && <p className="text-[11px] text-destructive mt-1">{errors.code.message}</p>}
          </div>

          <div>
            <Label required>Nama Fitur</Label>
            <Input
              placeholder="Contoh: Dual-Approval Task Release Gate"
              {...register("name")}
              error={Boolean(errors.name)}
            />
            {errors.name && <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Deskripsi Fitur (Opsional)</Label>
            <Textarea
              placeholder="Deskripsi fungsionalitas dan kriteria fitur..."
              {...register("description")}
            />
          </div>
        </form>
      </Modal>
    );
  },
);

CreateFeatureModal.displayName = "CreateFeatureModal";
export default CreateFeatureModal;

