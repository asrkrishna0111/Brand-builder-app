import React, { useRef } from 'react';
import { Sparkles, Download, Eye, Upload, RefreshCw, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

interface MasterProductCardProps {
  masterImage?: {
    imageUrl: string;
    promptUsed: string;
    createdAt: number;
  };
  productName: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onUploadCustomImage: (base64Url: string) => void;
  onViewPrompt: (prompt: string, title: string) => void;
  onOpenImageModal: (imageUrl: string, title: string) => void;
}

export const MasterProductCard: React.FC<MasterProductCardProps> = ({
  masterImage,
  productName,
  isGenerating,
  onGenerate,
  onUploadCustomImage,
  onViewPrompt,
  onOpenImageModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadCustomImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!masterImage?.imageUrl) return;
    const link = document.createElement('a');
    link.href = masterImage.imageUrl;
    link.download = `${productName.toLowerCase().replace(/\s+/g, '-')}-master-anchor.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">Master Product Reference Anchor</h3>
            {masterImage ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Active Anchor
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Awaiting Generation
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            This canonical hero shot is fed directly into Nano-Banana to anchor product consistency across billboards, newspapers, and social posts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            id="upload-master-ref-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Upload an existing photo or render to use as the Master Anchor"
          >
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Upload Custom Anchor</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isGenerating ? (
        <div className="aspect-square max-w-sm mx-auto rounded-xl border border-stone-200 bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
          <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-800">Generating Master Product Shot...</p>
          <p className="text-xs text-stone-500 max-w-xs mt-1">
            Synthesizing lighting, materials, and form with Nano-Banana (<code className="font-mono text-[11px] text-amber-700">gemini-3.1-flash-lite-image</code>).
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-stone-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Zero-person filter active
          </div>
        </div>
      ) : masterImage ? (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group w-full md:w-64 shrink-0 aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs">
            <img
              src={masterImage.imageUrl}
              alt={`${productName} Master Anchor`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onOpenImageModal(masterImage.imageUrl, `${productName} — Master Product Anchor`)}
                className="p-2 rounded-lg bg-white/90 hover:bg-white text-stone-900 transition-transform hover:scale-105 cursor-pointer"
                title="Expand view"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 rounded-lg bg-white/90 hover:bg-white text-stone-900 transition-transform hover:scale-105 cursor-pointer"
                title="Download image"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between text-stone-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Product Identity Vector Established
                </span>
                <span className="text-stone-400 font-mono text-[11px]">Aspect: 1:1</span>
              </div>
              <p className="text-stone-600 line-clamp-2 text-[11px] leading-relaxed">
                {masterImage.promptUsed}
              </p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onViewPrompt(masterImage.promptUsed, 'Master Product Prompt')}
                  className="text-stone-700 hover:text-stone-900 font-semibold underline text-[11px] cursor-pointer"
                >
                  View Full Prompt & Directives
                </button>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500 text-[11px]">Model: Nano-Banana</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onGenerate}
                className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                Regenerate Master
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                Download PNG
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 px-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/70 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-stone-800">No Master Product Anchor Yet</h4>
          <p className="text-xs text-stone-500 max-w-md mt-1 mb-4">
            Click &ldquo;Generate Master Product Anchor&rdquo; above to render the baseline studio shot. All subsequent billboard, newspaper, and social medium shots will maintain product consistency with this image!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              id="cta-generate-master"
              type="button"
              onClick={onGenerate}
              disabled={isGenerating || !productName}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Master Anchor (Nano-Banana)
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-stone-500" />
              Upload Reference File Instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
