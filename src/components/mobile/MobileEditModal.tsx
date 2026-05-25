import type { ReactNode } from "react";

type Field = {
  key: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal" | "search" | "email" | "tel" | "url" | "none";
  multiline?: boolean;
};

type Props = {
  open: boolean;
  fields: Field[];
  onCancel: () => void;
  onConfirm: () => void;
  extra?: ReactNode;
};

export default function MobileEditModal({ open, fields, onCancel, onConfirm, extra }: Props) {
  return (
    <div className={`m-modal-overlay${open ? " open" : ""}`} onClick={onCancel}>
      <div className="m-modal-card" onClick={(e) => e.stopPropagation()}>
        {fields.map((f) =>
          f.multiline ? (
            <textarea
              key={f.key}
              className="m-modal-input"
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              placeholder={f.placeholder}
              rows={2}
              style={{ resize: "none", lineHeight: 1.3, borderRadius: 18, padding: "10px 18px", fontFamily: "var(--font)" }}
            />
          ) : (
            <input
              key={f.key}
              className="m-modal-input"
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              placeholder={f.placeholder}
              type={f.type || "text"}
              inputMode={f.inputMode}
            />
          )
        )}
        {extra}
        <div className="m-modal-actions">
          <button type="button" className="m-modal-btn" onClick={onCancel} aria-label="Cancelar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M7 12h10" />
            </svg>
          </button>
          <button type="button" className="m-modal-btn" onClick={onConfirm} aria-label="Confirmar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
