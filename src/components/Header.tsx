import React from 'react';
import { Sparkles, ShieldAlert, Cpu, Layers } from 'lucide-react';

interface HeaderProps {
  hasKey?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-sm border border-stone-800">
            <span className="font-mono tracking-tighter">B</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">Brand builder app</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                <Cpu className="w-3 h-3 text-amber-600" />
                Nano-Banana
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Multi-medium visual campaign generator with strict product consistency
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Zero Person Mandate Badge */}
          <div
            id="zero-person-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium"
            title="Every prompt strictly filters out humans, hands, faces, and silhouettes."
          >
            <ShieldAlert className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden md:inline">Zero-Person Policy:</span>
            <span className="text-stone-900 font-semibold">No People</span>
          </div>

          {/* Consistency Badge */}
          <div
            id="consistency-status-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
            title="Medium shots anchor to the Master Product image and detailed visual descriptors."
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Consistency:</span>
            <span className="font-semibold">Master Anchored</span>
          </div>
        </div>
      </div>
    </header>
  );
};
