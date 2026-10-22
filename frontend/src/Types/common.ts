// src/Types/common.ts

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

export type StatusTone = 'slate' | 'blue' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'purple' | 'cyan';
