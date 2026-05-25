export interface ValidationResult {
  ok: boolean;
  message: string;
}

export const RULES = {
  USERNAME: { min: 3, max: 30, pattern: /^[a-zA-Z0-9_]+$/, label: "solo letras, números y guión bajo" },
  NAME: { min: 2, max: 50, pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, label: "solo letras y espacios" },
  PASSWORD: { min: 8, max: 128, label: "mínimo 8 caracteres" },
  EMAIL: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: "formato de correo inválido" },
  YEAR: { min: 1900, max: 2030 },
};

export const passwordStrength = (pw: string): { ok: boolean; label: string }[] => [
  { ok: pw.length >= RULES.PASSWORD.min, label: `${RULES.PASSWORD.min} caracteres` },
  { ok: /[A-Z]/.test(pw), label: "una mayúscula" },
  { ok: /[a-z]/.test(pw), label: "una minúscula" },
  { ok: /[0-9]/.test(pw), label: "un número" },
  { ok: /[^A-Za-z0-9]/.test(pw), label: "un carácter especial" },
];

export const validateUsername = (v: string): ValidationResult => {
  if (!v.trim()) return { ok: false, message: "El usuario es obligatorio" };
  if (v.length < RULES.USERNAME.min) return { ok: false, message: `Mínimo ${RULES.USERNAME.min} caracteres` };
  if (v.length > RULES.USERNAME.max) return { ok: false, message: `Máximo ${RULES.USERNAME.max} caracteres` };
  if (!RULES.USERNAME.pattern.test(v)) return { ok: false, message: RULES.USERNAME.label };
  return { ok: true, message: "" };
};

export const validateEmail = (v: string): ValidationResult => {
  if (!v.trim()) return { ok: false, message: "El correo es obligatorio" };
  if (!RULES.EMAIL.pattern.test(v)) return { ok: false, message: RULES.EMAIL.label };
  return { ok: true, message: "" };
};

export const validateName = (v: string, field: string): ValidationResult => {
  if (!v.trim()) return { ok: false, message: `${field} es obligatorio` };
  if (v.length < RULES.NAME.min) return { ok: false, message: `Mínimo ${RULES.NAME.min} caracteres` };
  if (v.length > RULES.NAME.max) return { ok: false, message: `Máximo ${RULES.NAME.max} caracteres` };
  if (!RULES.NAME.pattern.test(v)) return { ok: false, message: RULES.NAME.label };
  return { ok: true, message: "" };
};

export const validatePassword = (v: string): ValidationResult => {
  if (!v) return { ok: false, message: "La contraseña es obligatoria" };
  if (v.length < RULES.PASSWORD.min) return { ok: false, message: `Mínimo ${RULES.PASSWORD.min} caracteres` };
  if (v.length > RULES.PASSWORD.max) return { ok: false, message: `Máximo ${RULES.PASSWORD.max} caracteres` };
  const checks = passwordStrength(v);
  const failed = checks.filter((c) => !c.ok).map((c) => c.label);
  if (failed.length) return { ok: false, message: `Debe contener: ${failed.join(", ")}` };
  return { ok: true, message: "" };
};

export const validateConfirmPassword = (pw: string, confirm: string): ValidationResult => {
  if (!confirm) return { ok: false, message: "Confirma la contraseña" };
  if (pw !== confirm) return { ok: false, message: "Las contraseñas no coinciden" };
  return { ok: true, message: "" };
};

export const validateVehicleBrand = (v: string): ValidationResult => {
  if (!v.trim()) return { ok: false, message: "La marca es obligatoria" };
  if (v.length < 2) return { ok: false, message: "Mínimo 2 caracteres" };
  return { ok: true, message: "" };
};

export const validateVehicleLocation = (v: string): ValidationResult => {
  if (!v.trim()) return { ok: false, message: "La sucursal es obligatoria" };
  if (v.length < 2) return { ok: false, message: "Mínimo 2 caracteres" };
  return { ok: true, message: "" };
};

export const validateVehicleApplicant = (v: string): ValidationResult => {
  if (!v.trim()) return { ok: false, message: "El aspirante es obligatorio" };
  if (v.length < 2) return { ok: false, message: "Mínimo 2 caracteres" };
  return { ok: true, message: "" };
};

export const validateYear = (v: string): ValidationResult => {
  if (!v.trim()) return { ok: true, message: "" };
  const n = parseInt(v, 10);
  if (isNaN(n) || !/^\d{4}$/.test(v)) return { ok: false, message: "Debe ser un año de 4 dígitos" };
  if (n < RULES.YEAR.min || n > RULES.YEAR.max) return { ok: false, message: `Año entre ${RULES.YEAR.min} y ${RULES.YEAR.max}` };
  return { ok: true, message: "" };
};

export const validatePrice = (v: string): ValidationResult => {
  if (!v.trim()) return { ok: true, message: "" };
  const n = parseFloat(v);
  if (isNaN(n) || n < 0) return { ok: false, message: "Debe ser un número positivo" };
  return { ok: true, message: "" };
};


