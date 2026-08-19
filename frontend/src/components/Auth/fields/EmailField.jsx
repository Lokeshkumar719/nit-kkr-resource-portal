import React from 'react';
import { Mail } from 'lucide-react';

export const EmailField = ({ value, onChange }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
      <div className="relative">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="email"
          name="email"
          placeholder="rollno_branch22@nitkkr.ac.in"
          className="input-field pl-10"
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};
