type Variant = "success" | "error";

type Props = {
  message: string;
  variant: Variant;
  visible: boolean;
};

export default function MobileToast({ message, variant, visible }: Props) {
  return (
    <div className={`m-toast ${variant}${visible ? " show" : ""}`} role="status" aria-live="polite">
      <div className="m-toast-icon" aria-hidden="true">
        {variant === "success" ? (
          <>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12l5 5L20 6" />
            </svg>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12l5 5L20 6" />
            </svg>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </>
        )}
      </div>
      <div className="m-toast-text">{message}</div>
    </div>
  );
}
