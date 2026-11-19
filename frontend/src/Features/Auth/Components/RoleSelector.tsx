// src/Features/Auth/Components/RoleSelector.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Badge } from "@/Components/Elements/Badge";
import { Avatar, AvatarFallback, type AvatarFallbackProps } from "@/Components/Elements/Avatar";
import { ROLE_DETAILS } from "@/Constants/AuthConstant";
import { getInitials } from "@/Utils/taskUtils";
import { cn } from "@/Utils/cn";
import type { DemoToken } from "@/Types/auth";

export interface RoleSelectorProps {
  demoTokens: DemoToken[];
  selectedToken: string;
  onSelectToken: (token: string) => void;
}

interface DemoDisplayMeta {
  initials?: string;
  roleTitle: string;
  rolePill: string;
  tone: NonNullable<AvatarFallbackProps["tone"]>;
  shortDesc: string;
}

const DEMO_TOKEN_META: Record<string, DemoDisplayMeta> = {
  mock_tl: {
    initials: "FZ",
    roleTitle: "Technical Lead",
    rolePill: "Technical Lead",
    tone: "emerald",
    shortDesc: "Dual-Approval & Sign-off DONE",
  },
  mock_pm: {
    initials: "TW",
    roleTitle: "Project Manager",
    rolePill: "Project Manager",
    tone: "indigo",
    shortDesc: "Dual-Approval & Verifikasi PM",
  },
  mock_dev: {
    initials: "AR",
    roleTitle: "Frontend Developer",
    rolePill: "Frontend Dev",
    tone: "purple",
    shortDesc: "Development & Ajukan Review",
  },
  mock_fajri: {
    initials: "FJ",
    roleTitle: "Backend Developer",
    rolePill: "Backend Dev",
    tone: "blue",
    shortDesc: "Integrasi API & Development",
  },
  mock_tester: {
    initials: "VD",
    roleTitle: "QA Tester",
    rolePill: "QA Tester",
    tone: "amber",
    shortDesc: "Pengujian QA & Auto-Rework",
  },
};

const ROLE_FALLBACK_TONE: Record<string, NonNullable<AvatarFallbackProps["tone"]>> = {
  TECHNICAL_LEAD: "emerald",
  PROJECT_MANAGER: "indigo",
  DEVELOPER: "purple",
  TESTER: "amber",
};

export const RoleSelector = memo<RoleSelectorProps>(
  ({ demoTokens, selectedToken, onSelectToken }) => {
    const activeDemo =
      demoTokens.find((d) => d.token === selectedToken) || demoTokens[1] || demoTokens[0];
    const activeShort = activeDemo
      ? ROLE_DETAILS[activeDemo.role]?.short || activeDemo.role
      : "PM";

    return (
      <Card size="md" surface="subtle" padding="sm" className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            AKUN DEMO PERAN (PRATINJAU)
          </span>
          <Badge variant="primary" size="xs" casing="normal">
            Aktif: {activeShort}
          </Badge>
        </div>

        <div className="space-y-1.5">
          {demoTokens.map((item) => {
            const isSelected = selectedToken === item.token;
            const tokenMeta = DEMO_TOKEN_META[item.token];
            const roleMeta = ROLE_DETAILS[item.role];

            const baseName = item.name.replace(/\s*\([^)]*\)\s*$/, "").trim();
            const displayRole = tokenMeta?.roleTitle || roleMeta?.label || item.role;
            const pillLabel = tokenMeta?.rolePill || roleMeta?.label || item.role;
            const initials = tokenMeta?.initials || getInitials(baseName);
            const avatarTone =
              tokenMeta?.tone || ROLE_FALLBACK_TONE[item.role] || "indigo";
            const summaryText = tokenMeta?.shortDesc || item.description;

            return (
              <Card
                key={item.token}
                size="md"
                padding="sm"
                surface={isSelected ? "subtle" : "default"}
                selected={isSelected}
                interactive="primary"
                onClick={() => onSelectToken(item.token)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectToken(item.token);
                  }
                }}
                className="cursor-pointer select-none"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar size="sm" borderless>
                      <AvatarFallback appearance="solid" tone={avatarTone}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="text-[11.5px] font-bold text-foreground leading-tight truncate">
                        {baseName} · {displayRole}
                      </div>
                      <p className="text-[10.5px] text-muted-foreground truncate mt-0.5">
                        {summaryText}
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "text-[10.5px] shrink-0 whitespace-nowrap",
                      isSelected
                        ? "font-semibold text-primary"
                        : "font-medium text-muted-foreground",
                    )}
                  >
                    {pillLabel}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    );
  },
);

RoleSelector.displayName = "RoleSelector";
export default RoleSelector;
