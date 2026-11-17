// src/Features/Auth/Components/RoleSelector.tsx
import React, { memo } from "react";
import { Label } from "@/Components/Elements/Label";
import { ROLE_DETAILS } from "@/Constants/AuthConstant";
import type { DemoToken } from "@/Types/auth";

export interface RoleSelectorProps {
  demoTokens: DemoToken[];
  selectedToken: string;
  onSelectToken: (token: string) => void;
}

export const RoleSelector = memo<RoleSelectorProps>(
  ({ demoTokens, selectedToken, onSelectToken }) => {
    return (
      <div className="space-y-2.5">
        <Label className="text-foreground text-xs font-bold">
          Pilih Akun Simulasi Aktor (Sprint 1):
        </Label>

        <div className="space-y-2">
          {demoTokens.map((item) => {
            const isSelected = selectedToken === item.token;
            const meta = ROLE_DETAILS[item.role];

            return (
              <div
                key={item.token}
                onClick={() => onSelectToken(item.token)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? "border-primary bg-primary-subtle/40 ring-1 ring-primary shadow-xs"
                    : "border-border hover:border-ring/40 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg font-bold text-[10px] grid place-items-center font-mono ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {meta?.short || item.role.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">
                          ({item.token})
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    <div
                      className={`size-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-primary bg-primary" : "border-input bg-card"
                      }`}
                    >
                      {isSelected && (
                        <div className="size-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

RoleSelector.displayName = "RoleSelector";
export default RoleSelector;
