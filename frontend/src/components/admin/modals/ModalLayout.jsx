import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ModalLayout({ children, className = '' }) {
  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px]">
      <div
        className={`bg-white rounded-2xl w-full shadow-xl overflow-hidden flex flex-col scale-100 ${className}`}
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // Render modal at the end of the document body to prevent stacking context issues
  return createPortal(modalContent, document.body);
}
