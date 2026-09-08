import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, Cpu } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  prompt: string;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  title,
  prompt,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900">{title}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              gemini-3.1-flash-lite-image
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-auto space-y-4">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-800 whitespace-pre-wrap leading-relaxed">
            {prompt}
          </div>

          <div className="p-3 bg-stone-100/70 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
            <div className="font-semibold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Strict Negative Directives Applied
            </div>
            <p className="text-stone-600 text-[11px]">
              Every prompt passed to Nano-Banana enforces zero human presence:
              <span className="font-medium text-stone-800">
                {' '}
                &ldquo;CRITICAL MANDATE: ABSOLUTELY NO PEOPLE, NO HUMANS, NO FACES, NO HANDS, NO BODIES, NO PERSON SILHOUETTES.&rdquo;
              </span>
            </p>
          </div>
        </div>

        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Prompt
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
