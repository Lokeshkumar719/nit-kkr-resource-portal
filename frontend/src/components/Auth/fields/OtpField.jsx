import React from 'react';
import { KeyRound } from 'lucide-react';

export const OtpField = ({ value, onChange, label = 'Verification Code' }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
      <div className="relative">
        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          name="otp"
          placeholder="000000"
          className="input-field pl-10 tracking-widest font-mono"
          value={value}
          onChange={onChange}
          maxLength={6}
          required
        />
      </div>
    </div>
  );
};
