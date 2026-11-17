// src/Features/Auth/Components/RoleBadge.tsx
import React, { memo } from "react";
import Badge, { type BadgeProps } from "@/Components/Elements/Badge";
import type { UserRole } from "@/Types/auth";
import { ROLE_DETAILS } from "@/Constants/AuthConstant";

export interface RoleBadgeProps {
  role: UserRole;
  showShort?: boolean;
}

const variantMap: Record<string, BadgeProps["variant"]> = {
  amber: "warning",
  indigo: "indigo",
  blue: "primary",
  cyan: "cyan",
};

export const RoleBadge = memo<RoleBadgeProps>(({ role, showShort = false }) => {
  const meta = ROLE_DETAILS[role] || {
    label: role,
    short: role,
    badgeTone: "default",
  };

  return (
    <Badge variant={variantMap[meta.badgeTone] || "default"} dot>
      {showShort ? meta.short : meta.label}
    </Badge>
  );
});

RoleBadge.displayName = "RoleBadge";
export default RoleBadge;
