import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-bg flex items-center justify-center p-4 min-h-screen relative">
      {/* Top Left Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md text-sm font-semibold border border-white/20 transition-all shadow-md group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-md animate-slide-up pt-12 sm:pt-0">
        <Link to="/" className="block text-center mb-8 group" title="Go to Homepage">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl backdrop-blur-md mb-4 shadow-xl border border-white/20 group-hover:scale-105 transition-transform">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
              alt="NIT KKR"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-100 transition-colors">
            NIT KKR Academic Portal
          </h1>
          <p className="text-blue-200/80 font-medium">Your academic resource hub</p>
        </Link>

        {children}
      </div>
    </div>
  );
};
