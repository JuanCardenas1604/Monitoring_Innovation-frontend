import { describe, it, expect } from "vitest";
import {
  validateUsername,
  validateEmail,
  validateName,
  validatePassword,
  validateConfirmPassword,
  validateVehicleBrand,
  validateVehicleLocation,
  validateVehicleApplicant,
  validateYear,
  validatePrice,
  passwordStrength,
} from "./validation";

describe("validateUsername", () => {
  it("accepts valid usernames", () => {
    expect(validateUsername("john_doe").ok).toBe(true);
    expect(validateUsername("abc123").ok).toBe(true);
    expect(validateUsername("A").ok).toBe(false);
  });

  it("rejects empty", () => {
    const r = validateUsername("");
    expect(r.ok).toBe(false);
    expect(r.message).toContain("obligatorio");
  });

  it("rejects too short", () => {
    expect(validateUsername("ab").ok).toBe(false);
  });

  it("rejects special characters", () => {
    expect(validateUsername("user name").ok).toBe(false);
    expect(validateUsername("user!name").ok).toBe(false);
  });

  it("rejects too long (31+)", () => {
    expect(validateUsername("a".repeat(31)).ok).toBe(false);
  });
});

describe("validateEmail", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("a@b.com").ok).toBe(true);
    expect(validateEmail("user+tag@domain.co").ok).toBe(true);
  });

  it("rejects empty", () => {
    expect(validateEmail("").ok).toBe(false);
  });

  it("rejects missing @", () => {
    expect(validateEmail("notanemail").ok).toBe(false);
  });

  it("rejects missing domain", () => {
    expect(validateEmail("user@").ok).toBe(false);
  });
});

describe("validateName", () => {
  it("accepts valid names", () => {
    expect(validateName("Juan", "El nombre").ok).toBe(true);
    expect(validateName("María José", "El nombre").ok).toBe(true);
    expect(validateName("Ñañez", "El nombre").ok).toBe(true);
  });

  it("rejects empty", () => {
    expect(validateName("", "X").ok).toBe(false);
  });

  it("rejects too short", () => {
    expect(validateName("A", "X").ok).toBe(false);
  });

  it("rejects numbers", () => {
    expect(validateName("Juan123", "X").ok).toBe(false);
  });
});

describe("validatePassword", () => {
  it("accepts strong password", () => {
    expect(validatePassword("Abcd1234!").ok).toBe(true);
  });

  it("rejects short password", () => {
    const r = validatePassword("Ab1!");
    expect(r.ok).toBe(false);
    expect(r.message).toContain("8");
  });

  it("rejects missing uppercase", () => {
    expect(validatePassword("abcd1234!").ok).toBe(false);
  });

  it("rejects missing lowercase", () => {
    expect(validatePassword("ABCD1234!").ok).toBe(false);
  });

  it("rejects missing digit", () => {
    expect(validatePassword("Abcdefgh!").ok).toBe(false);
  });

  it("rejects missing special char", () => {
    expect(validatePassword("Abcd1234").ok).toBe(false);
  });

  it("rejects empty", () => {
    expect(validatePassword("").ok).toBe(false);
  });

  it("rejects too long (129+)", () => {
    expect(validatePassword("A1!" + "x".repeat(126)).ok).toBe(false);
  });
});

describe("validateConfirmPassword", () => {
  it("passes when matching", () => {
    expect(validateConfirmPassword("abc", "abc").ok).toBe(true);
  });

  it("fails when empty", () => {
    expect(validateConfirmPassword("abc", "").ok).toBe(false);
  });

  it("fails when not matching", () => {
    const r = validateConfirmPassword("abc", "xyz");
    expect(r.ok).toBe(false);
    expect(r.message).toContain("no coinciden");
  });
});

describe("passwordStrength", () => {
  it("reports all checks for weak password", () => {
    const r = passwordStrength("1");
    expect(r.filter((c) => !c.ok)).toHaveLength(4);
    expect(r).toHaveLength(5);
  });

  it("reports all checks for strong password", () => {
    const r = passwordStrength("Abcd1234!");
    expect(r.every((c) => c.ok)).toBe(true);
  });

  it("shows correct labels", () => {
    const r = passwordStrength("x");
    expect(r[0].label).toContain("caracteres");
    expect(r[1].label).toContain("mayúscula");
    expect(r[2].label).toContain("minúscula");
  });
});

describe("vehicle validators", () => {
  it("validateVehicleBrand", () => {
    expect(validateVehicleBrand("Toyota").ok).toBe(true);
    expect(validateVehicleBrand("").ok).toBe(false);
    expect(validateVehicleBrand("A").ok).toBe(false);
  });

  it("validateVehicleLocation", () => {
    expect(validateVehicleLocation("Bogotá").ok).toBe(true);
    expect(validateVehicleLocation("").ok).toBe(false);
  });

  it("validateVehicleApplicant", () => {
    expect(validateVehicleApplicant("Carlos").ok).toBe(true);
    expect(validateVehicleApplicant("").ok).toBe(false);
  });
});

describe("validateYear", () => {
  it("accepts valid year", () => {
    expect(validateYear("2020").ok).toBe(true);
  });

  it("accepts empty (optional)", () => {
    expect(validateYear("").ok).toBe(true);
  });

  it("rejects non-4-digit", () => {
    expect(validateYear("123").ok).toBe(false);
    expect(validateYear("12345").ok).toBe(false);
    expect(validateYear("abcd").ok).toBe(false);
  });

  it("rejects out of range", () => {
    expect(validateYear("1899").ok).toBe(false);
    expect(validateYear("2031").ok).toBe(false);
  });
});

describe("validatePrice", () => {
  it("accepts valid price", () => {
    expect(validatePrice("50000").ok).toBe(true);
    expect(validatePrice("0").ok).toBe(true);
  });

  it("accepts empty (optional)", () => {
    expect(validatePrice("").ok).toBe(true);
  });

  it("rejects negative", () => {
    expect(validatePrice("-100").ok).toBe(false);
  });

  it("rejects non-numeric", () => {
    expect(validatePrice("abc").ok).toBe(false);
  });
});
