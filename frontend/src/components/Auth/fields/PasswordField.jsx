import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export const PasswordField = ({
  label,
  name,
  value,
  onChange,
  onPaste,
  helperText,
  rightAction,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between ml-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {rightAction}
      </div>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder="••••••••"
          className="input-field pl-10 pr-10"
          value={value}
          onChange={onChange}
          onPaste={onPaste}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          title={showPassword ? 'Hide Password' : 'Show Password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {helperText && <p className="text-xs text-gray-500 ml-1 mt-1">{helperText}</p>}
    </div>
  );
};
