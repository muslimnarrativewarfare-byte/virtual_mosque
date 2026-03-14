import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface LabeledTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const baseClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

export function LabeledInput({ label, ...props }: LabeledInputProps) {
  return (
    <label className="block space-y-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input className={baseClass} {...props} />
    </label>
  );
}

export function LabeledTextarea({ label, ...props }: LabeledTextareaProps) {
  return (
    <label className="block space-y-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <textarea className={baseClass} {...props} />
    </label>
  );
}
