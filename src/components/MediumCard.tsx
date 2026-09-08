import React, { useState } from 'react';
import {
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  Maximize2,
  Newspaper,
  Instagram,
  BookOpen,
  Train,
  Store,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { GeneratedMediumItem, AspectRatio } from '../types';

interface MediumCardProps {
  item: GeneratedMediumItem;
  hasMasterAnchor: boolean;
  onGenerate: (id: string, customContext?: string) => void;
  onViewPrompt: (prompt: string, title: string) => void;
  onOpenImageModal: (imageUrl: string, title: string) => void;
}

export const MediumCard: React.FC<MediumCardProps> = ({
  item,
  hasMasterAnchor,
  onGenerate,
  onViewPrompt,
  onOpenImageModal,
}) => {
  const [customContext, setCustomContext] = useState('');
  const [showContextInput, setShowContextInput] = useState(false);

  const getMediumIcon = (type: string) => {
    switch (type) {
      case 'billboard':
        return <Maximize2 className="w-4 h-4 text-sky-600" />;
      case 'newspaper':
        return <Newspaper className="w-4 h-4 text-stone-700" />;
      case 'social_post':
        return <Instagram className="w-4 h-4 text-amber-600" />;
      case 'magazine':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'subway_ad':
        return <Train className="w-4 h-4 text-blue-600" />;
      case 'storefront':
        return <Store className="w-4 h-4 text-orange-600" />;
      case 'digital_kiosk':
        return <Smartphone className="w-4 h-4 text-violet-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-stone-600" />;
    }
  };

  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:4':
        return 'aspect-[3/4]';
      case '9:16':
        return 'aspect-[9/16] max-h-96 mx-auto';
      case '1:1':
      default:
        return 'aspect-square';
    }
  };

  const handleDownload = () => {
    if (!item.imageUrl) return;
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `${item.mediumTitle.toLowerCase().replace(/\s+/g, '-')}-shot.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id={`medium-card-${item.id}`}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-2 bg-stone-50/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shadow-2xs">
            {getMediumIcon(item.mediumType)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 leading-tight">{item.mediumTitle}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-sm bg-stone-200/70 text-stone-700">
                {item.aspectRatio}
              </span>
              <span className="text-[10px] text-stone-400 font-medium flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-stone-400" />
                No people
              </span>
            </div>
          </div>
        </div>

        {item.imageUrl && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Rendered
          </span>
        )}
      </div>

      {/* Image Display Area */}
      <div className="relative bg-stone-100 flex items-center justify-center overflow-hidden min-h-[220px] flex-1">
        {item.loading ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            <p className="text-xs font-semibold text-stone-800">Generating with Nano-Banana...</p>
            <p className="text-[11px] text-stone-500 mt-1 max-w-[200px]">
              {hasMasterAnchor ? 'Matching master anchor & zero-person rule' : 'Applying brand descriptors'}
            </p>
          </div>
        ) : item.imageUrl ? (
          <div className={`relative group w-full ${getAspectRatioClass(item.aspectRatio)} overflow-hidden`}>
            <img
              src={item.imageUrl}
              alt={item.mediumTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Hover Overlay Controls */}
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onOpenImageModal(item.imageUrl, `${item.mediumTitle} — Medium Shot`)}
                className="p-2 rounded-lg bg-white/95 hover:bg-white text-stone-900 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                title="Expand fullscreen"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 rounded-lg bg-white/95 hover:bg-white text-stone-900 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                title="Download image"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : item.error ? (
          <div className="p-6 text-center max-w-xs">
            <AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-stone-800">Generation Error</p>
            <p className="text-[11px] text-red-600 mt-1 mb-3 line-clamp-2">{item.error}</p>
            <button
              type="button"
              onClick={() => onGenerate(item.id, customContext)}
              className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 mx-auto mb-2 shadow-2xs">
              {getMediumIcon(item.mediumType)}
            </div>
            <p className="text-xs font-medium text-stone-600">Awaiting Render</p>
            <p className="text-[11px] text-stone-400 mt-0.5 mb-3">
              Ready to imagine across {item.mediumTitle}
            </p>
            <button
              id={`render-btn-${item.id}`}
              type="button"
              onClick={() => onGenerate(item.id, customContext)}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Render Shot
            </button>
          </div>
        )}
      </div>

      {/* Card Actions & Scene Customization */}
      <div className="p-3 border-t border-stone-100 bg-white space-y-2">
        {showContextInput ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-stone-600">
                Custom Scene Setting (Optional):
              </label>
              <button
                type="button"
                onClick={() => setShowContextInput(false)}
                className="text-[10px] text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                Hide
              </button>
            </div>
            <input
              type="text"
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="e.g. at twilight dusk with wet asphalt reflections..."
              className="w-full px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => setShowContextInput(true)}
              className="text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
            >
              + Add Scene Setting
            </button>
            {item.promptUsed && (
              <button
                type="button"
                onClick={() => onViewPrompt(item.promptUsed, `${item.mediumTitle} Prompt`)}
                className="text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
              >
                View Prompt
              </button>
            )}
          </div>
        )}

        {item.imageUrl && (
          <div className="flex items-center justify-between pt-1 gap-2 border-t border-stone-50">
            <button
              type="button"
              onClick={() => onGenerate(item.id, customContext)}
              disabled={item.loading}
              className="flex-1 py-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-stone-500" />
              Regenerate
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="py-1.5 px-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
