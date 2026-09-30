import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useResQStore } from '../../store/useResQStore';

export const Toast: React.FC = () => {
  const { toast } = useResQStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-28 lg:bottom-8 right-4 sm:right-8 z-50 max-w-md">
      <div
        role="status"
        aria-live="polite"
        className={`flex items-center gap-3.5 px-6 py-4 rounded-[20px] shadow-soft-hover border-2 text-lg font-extrabold bg-white ${
          toast.type === 'warning'
            ? 'border-[#F59E0B] text-amber-900'
            : toast.type === 'success'
            ? 'border-[#22C55E] text-emerald-900'
            : 'border-[#2563EB] text-slate-900'
        }`}
      >
        {toast.type === 'warning' && (
          <AlertTriangle className="w-6 h-6 text-[#F59E0B] shrink-0" />
        )}
        {toast.type === 'success' && (
          <CheckCircle2 className="w-6 h-6 text-[#22C55E] shrink-0" />
        )}
        {toast.type === 'info' && (
          <Info className="w-6 h-6 text-[#2563EB] shrink-0" />
        )}
        <span>{toast.text}</span>
      </div>
    </div>
  );
};
