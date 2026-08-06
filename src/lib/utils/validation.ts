export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function validatePositiveNumber(label: string, value: number): ValidationResult {
  if (isNaN(value)) return { valid: false, message: `${label} must be a number.` };
  if (value <= 0) return { valid: false, message: `${label} must be positive.` };
  return { valid: true };
}

export function validateAge(label: string, age: number, min = 0, max = 120): ValidationResult {
  if (!Number.isInteger(age)) return { valid: false, message: `${label} must be a whole number.` };
  if (age < min || age > max) return { valid: false, message: `${label} must be between ${min} and ${max}.` };
  return { valid: true };
}