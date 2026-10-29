// src/Features/Modules/Components/CreateModuleModal.tsx
import React, { memo } from "react";
import useCreateModule from "../Hooks/useCreateModule";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Textarea } from "@/Components/Elements/Textarea";

export interface CreateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateModuleModal = memo<CreateModuleModalProps>(({ isOpen, onClose }) => {
  const { form, handleSubmitForm, loading } = useCreateModule({ onSuccess: onClose });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Modul Proyek Baru"
      description="Hierarki tingkat teratas untuk pengelompokan deliverable sistem (SOP-05)"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" form="create-module-form" loading={loading}>
            Simpan Modul
          </Button>
        </>
      }
    >
      <form
        id="create-module-form"
        onSubmit={handleSubmit(handleSubmitForm)}
        className="space-y-3.5"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kode Modul <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Contoh: MOD-E4 atau MOD-INV"
            {...register("code")}
            error={Boolean(errors.code)}
          />
          {errors.code && <p className="text-[11px] text-red-500 mt-1">{errors.code.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Modul <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Contoh: Tasklist dan Eksekusi Agile"
            {...register("name")}
            error={Boolean(errors.name)}
          />
          {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deskripsi Modul (Opsional)
          </label>
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
