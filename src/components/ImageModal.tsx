import React from 'react';
import { X, Download, Columns, Layers } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  masterImageUrl?: string;
  productName: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  masterImageUrl,
  productName,
}) => {
  const [compareMode, setCompareMode] = React.useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between text-stone-200">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {title}
            </h3>
            <p className="text-xs text-stone-400">{productName} — Rendered via Nano-Banana</p>
          </div>

          <div className="flex items-center space-x-2">
            {masterImageUrl && (
              <button
                type="button"
                onClick={() => setCompareMode(!compareMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  compareMode
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                {compareMode ? 'Exit Compare' : 'Compare vs Master'}
              </button>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-stone-950/60">
          {compareMode && masterImageUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full items-center">
              <div className="flex flex-col items-center">
                <span className="text-xs text-amber-400 font-semibold mb-2 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  Canonical Master Product Anchor
                </span>
                <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-900 max-h-[70vh] flex items-center justify-center">
                  <img
                    src={masterImageUrl}
                    alt="Master Anchor"
                    referrerPolicy="no-referrer"
                    className="max-h-[65vh] object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-emerald-400 font-semibold mb-2 flex items-center gap-1">
                  Current Medium Shot ({title})
                </span>
                <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-900 max-h-[70vh] flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="max-h-[65vh] object-contain"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-[75vh] flex items-center justify-center">
              <img
                src={imageUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
