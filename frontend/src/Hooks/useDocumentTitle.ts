// src/Hooks/useDocumentTitle.ts
import { useEffect } from "react";

const BASE_TITLE = "ERP Modul E-4 — PT. Anaheim Nimbus Universal";

export function useDocumentTitle(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }, [title, description]);
}

export default useDocumentTitle;
