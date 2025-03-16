
import React from "react";

export interface PasswordStrength {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  valid: boolean;
}

interface PasswordStrengthIndicatorProps {
  passwordStrength: PasswordStrength;
}

export default function PasswordStrengthIndicator({ passwordStrength }: PasswordStrengthIndicatorProps) {
  return (
    <div className="text-xs space-y-1 mt-1">
      <p className={passwordStrength.length ? "text-green-500" : "text-gray-500"}>
        ✓ At least 8 characters
      </p>
      <p className={
        (passwordStrength.uppercase && passwordStrength.lowercase && passwordStrength.number) || 
        (passwordStrength.uppercase && passwordStrength.lowercase && passwordStrength.special) || 
        (passwordStrength.uppercase && passwordStrength.number && passwordStrength.special) || 
        (passwordStrength.lowercase && passwordStrength.number && passwordStrength.special) 
        ? "text-green-500" : "text-gray-500"
      }>
        ✓ At least 3 of: uppercase, lowercase, numbers, special characters
      </p>
    </div>
  );
}
