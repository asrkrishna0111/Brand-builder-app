import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { AspectRatio } from '../types';

interface CustomMediumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, aspectRatio: AspectRatio, sceneContext: string) => void;
}

export const CustomMediumModal: React.FC<CustomMediumModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [sceneContext, setSceneContext] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), aspectRatio, sceneContext.trim());
    setTitle('');
    setSceneContext('');
    onClose();
  };

  const sampleIdeas = [
    'Airport Departure Concourse Banner',
    'Museum Modern Art Exhibition Plinth',
    'Coffee Table Hardcover Book Cover',
    'Tokyo Shibuya Elevated Billboard',
    'Vintage Matchbook Cover',
    'Bus Shelter Backlit Glass Ad',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-stone-900" />
            <h3 className="text-sm font-bold text-stone-900">Add Custom Advertising Medium</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Medium Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Airport Departure Concourse Display"
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['16:9', '4:3', '1:1', '3:4', '9:16'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-1.5 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Scene & Lighting Art Direction (Optional)
            </label>
            <textarea
              rows={2}
              value={sceneContext}
              onChange={(e) => setSceneContext(e.target.value)}
              placeholder="Describe the environment, architectural styling, lighting, textures (no people)..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 text-stone-900 resize-none"
            />
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="text-[11px] font-medium text-stone-500 block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleIdeas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setTitle(idea)}
                  className="px-2 py-0.5 text-[11px] rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Add Medium
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
