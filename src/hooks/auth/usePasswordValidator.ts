
import { useState } from "react";
import { PasswordStrength } from "@/components/auth/PasswordStrengthIndicator";

export function usePasswordValidator() {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    valid: false
  });

  const checkPasswordStrength = (password: string) => {
    const strength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      valid: false
    };
    
    const criteriaCount = [strength.uppercase, strength.lowercase, strength.number, strength.special]
      .filter(Boolean).length;
    strength.valid = strength.length && criteriaCount >= 3;
    
    setPasswordStrength(strength);
    return strength.valid;
  };

  return {
    passwordStrength,
    checkPasswordStrength
  };
}
