// src/Features/Modules/Components/CreateFeatureModal.tsx
import React, { memo, useEffect } from "react";
import useCreateFeature from "../Hooks/useCreateFeature";
import useModules from "../Hooks/useModules";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Textarea } from "@/Components/Elements/Textarea";
import { Select } from "@/Components/Elements/Select";

export interface CreateFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModuleId?: string;
}

export const CreateFeatureModal = memo<CreateFeatureModalProps>(
  ({ isOpen, onClose, defaultModuleId }) => {
    const { data: modules = [] } = useModules();
    const { form, handleSubmitForm, loading } = useCreateFeature({
      moduleId: defaultModuleId,
      onSuccess: onClose,
    });

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = form;

    useEffect(() => {
      if (defaultModuleId) {
        setValue("module_id", defaultModuleId);
      } else if (modules.length > 0) {
        setValue("module_id", modules[0].id);
      }
    }, [defaultModuleId, modules, setValue]);

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Tambah Fitur Baru ke Modul"
        description="Hierarki tingkat kedua opsional di bawah Modul (SOP-05)"
        footer={
          <>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" form="create-feature-form" loading={loading}>
              Simpan Fitur
            </Button>
          </>
        }
      >
        <form
          id="create-feature-form"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="space-y-3.5"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Modul Induk <span className="text-red-500">*</span>
            </label>
            <Select {...register("module_id")} error={Boolean(errors.module_id)}>
              <option value="">Pilih Modul Induk...</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} — {m.name}
                </option>
              ))}
            </Select>
            {errors.module_id && (
              <p className="text-[11px] text-red-500 mt-1">{errors.module_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kode Fitur <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Contoh: FTR-K04-03"
              {...register("code")}
              error={Boolean(errors.code)}
            />
            {errors.code && <p className="text-[11px] text-red-500 mt-1">{errors.code.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Fitur <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Contoh: Dual-Approval Task Release Gate"
              {...register("name")}
              error={Boolean(errors.name)}
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Fitur (Opsional)
            </label>
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
