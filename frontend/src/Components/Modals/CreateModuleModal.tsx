// src/Components/Modals/CreateModuleModal.tsx
import React, { memo } from "react";
import useCreateModule from "@/Hooks/useCreateModule";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Textarea } from "@/Components/Elements/Textarea";
import { Label } from "@/Components/Elements/Label";

export interface CreateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateModuleModal = memo<CreateModuleModalProps>(({ isOpen, onClose }) => {
  const { register, errors, onSubmit, isPending } = useCreateModule({ onSuccess: onClose });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Tambah Modul Proyek Baru"
      description="Hierarki tingkat teratas untuk pengelompokan deliverable sistem (SOP-05)"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="create-module-form" loading={isPending}>
            Simpan Modul
          </Button>
        </>
      }
    >
      <form id="create-module-form" onSubmit={onSubmit} className="space-y-3.5">
        <div>
          <Label required>Kode Modul</Label>
          <Input
            placeholder="Contoh: MOD-E4 atau MOD-INV"
            {...register("code")}
            error={Boolean(errors.code)}
          />
          {errors.code && <p className="text-[11px] text-destructive mt-1">{errors.code.message}</p>}
        </div>

        <div>
          <Label required>Nama Modul</Label>
          <Input
            placeholder="Contoh: Tasklist dan Eksekusi Agile"
            {...register("name")}
            error={Boolean(errors.name)}
          />
          {errors.name && <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label>Deskripsi Modul (Opsional)</Label>
          <Textarea
            placeholder="Jelaskan cakupan deliverable dan tanggung jawab modul..."
            {...register("description")}
          />
        </div>
      </form>
    </Modal>
  );
});

CreateModuleModal.displayName = "CreateModuleModal";
export default CreateModuleModal;

