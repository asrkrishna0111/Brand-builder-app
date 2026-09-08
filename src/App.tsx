/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  RefreshCw,
  Plus,
  Download,
  Grid,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Header } from './components/Header';
import { ProductForm } from './components/ProductForm';
import { MasterProductCard } from './components/MasterProductCard';
import { MediumCard } from './components/MediumCard';
import { ImageModal } from './components/ImageModal';
import { PromptModal } from './components/PromptModal';
import { CustomMediumModal } from './components/CustomMediumModal';
import { ProductDetails, GeneratedMediumItem, AspectRatio, MediumCategory, CampaignMood } from './types';
import { MEDIUM_PRESETS, PRODUCT_PRESETS, CAMPAIGN_MOODS } from './data/presets';
import { CampaignLookbookModal } from './components/CampaignLookbookModal';

export default function App() {
  // Initialize with the first curated preset
  const [product, setProduct] = useState<ProductDetails>(PRODUCT_PRESETS[0].product);

  // Master product anchor state
  const [masterImage, setMasterImage] = useState<{
    imageUrl: string;
    promptUsed: string;
    createdAt: number;
  } | null>(null);
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false);

  // Mediums list
  const [mediums, setMediums] = useState<GeneratedMediumItem[]>(() =>
    MEDIUM_PRESETS.map((preset) => ({
      id: preset.id,
      mediumType: preset.id,
      mediumTitle: preset.title,
      category: preset.category,
      aspectRatio: preset.aspectRatio,
      imageUrl: '',
      promptUsed: '',
      createdAt: 0,
      loading: false,
    }))
  );

  // Campaign Mood & Filter state
  const [selectedMood, setSelectedMood] = useState<CampaignMood>('golden_hour');
  const [selectedCategory, setSelectedCategory] = useState<MediumCategory>('all');
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);

  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Modals state
  const [activeImageModal, setActiveImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  const [activePromptModal, setActivePromptModal] = useState<{
    isOpen: boolean;
    title: string;
    prompt: string;
  }>({
    isOpen: false,
    title: '',
    prompt: '',
  });

  const [isCustomMediumModalOpen, setIsCustomMediumModalOpen] = useState(false);
  const [generationError, setGenerationError] = useState<{
    message: string;
    isQuota?: boolean;
  } | null>(null);

  // Generate Master Anchor Shot
  const handleGenerateMaster = async () => {
    setIsGeneratingMaster(true);
    setGenerationError(null);
    try {
      const res = await fetch('/api/generate-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errObj: any = new Error(errorData.error || 'Failed to generate master anchor.');
        errObj.isQuota = errorData.isQuota;
        throw errObj;
      }

      const data = await res.json();
      setMasterImage({
        imageUrl: data.imageUrl,
        promptUsed: data.promptUsed,
        createdAt: Date.now(),
      });
    } catch (err: any) {
      console.error('Master generation error:', err);
      setGenerationError({
        message: err.message || 'Error generating master product image with Nano-Banana.',
        isQuota: Boolean(err.isQuota),
      });
    } finally {
      setIsGeneratingMaster(false);
    }
  };

  // Generate a single medium shot
  const handleGenerateMedium = async (id: string, customContext?: string) => {
    const targetItem = mediums.find((m) => m.id === id);
    if (!targetItem) return;

    setMediums((prev) =>
      prev.map((m) => (m.id === id ? { ...m, loading: true, error: undefined } : m))
    );

    try {
      const moodConfig = CAMPAIGN_MOODS.find((m) => m.id === selectedMood);
      const res = await fetch('/api/generate-medium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          mediumType: targetItem.mediumType,
          mediumTitle: targetItem.mediumTitle,
          aspectRatio: targetItem.aspectRatio,
          customContext: customContext,
          moodPrompt: moodConfig?.promptInjection,
          masterImage: masterImage?.imageUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errObj: any = new Error(errorData.error || 'Failed to generate medium image.');
        errObj.isQuota = errorData.isQuota;
        throw errObj;
      }

      const data = await res.json();
      setMediums((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                imageUrl: data.imageUrl,
                promptUsed: data.promptUsed,
                createdAt: Date.now(),
                loading: false,
              }
            : m
        )
      );
    } catch (err: any) {
      console.error('Medium generation error:', err);
      if (err.isQuota) {
        setGenerationError({
          message: err.message || 'API quota reached for Nano-Banana.',
          isQuota: true,
        });
      }
      setMediums((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                loading: false,
                error: err.message || 'Error generating medium image with Nano-Banana.',
              }
            : m
        )
      );
    }
  };

  // Batch generate all unrendered or all mediums
  const handleGenerateAllMediums = async () => {
    setIsBatchGenerating(true);

    for (const item of mediums) {
      // Generate one by one to avoid rate-limiting and show progress
      await handleGenerateMedium(item.id);
    }

    setIsBatchGenerating(false);
  };

  // Add a new custom medium
  const handleAddCustomMedium = (title: string, aspectRatio: AspectRatio, sceneContext: string) => {
    const newId = `custom_${Date.now()}`;
    const newItem: GeneratedMediumItem = {
      id: newId,
      mediumType: 'custom',
      mediumTitle: title,
      aspectRatio,
      imageUrl: '',
      promptUsed: '',
      createdAt: 0,
      loading: false,
    };

    setMediums((prev) => [newItem, ...prev]);

    // Automatically trigger render for the new custom medium
    setTimeout(() => {
      handleGenerateMedium(newId, sceneContext);
    }, 100);
  };

  // Upload custom anchor
  const handleUploadCustomAnchor = (base64Url: string) => {
    setMasterImage({
      imageUrl: base64Url,
      promptUsed: 'User uploaded master product reference anchor.',
      createdAt: Date.now(),
    });
  };

  const renderedCount = mediums.filter((m) => Boolean(m.imageUrl)).length;

  const filteredMediums = mediums.filter((m) => {
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Top Hero Guidance & Status Banner */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-7 shadow-sm border border-stone-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-400 text-stone-950">
                  Model: Nano-Banana
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Strict Zero-Person Policy
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Cross-Medium Consistency Engine
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Visualize your product across billboards, print & digital
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                Describe your product below, generate the canonical master product shot, and watch
                Nano-Banana (<code className="text-amber-300 font-mono">gemini-3.1-flash-lite-image</code>)
                faithfully reproduce identical product geometry, finishes, and colors across every marketing medium.
              </p>
            </div>

            {/* Quick Stats & Lookbook Action */}
            <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700/80 flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-2xl font-bold text-white font-mono">{renderedCount}/{mediums.length}</div>
                  <div className="text-[11px] text-stone-400 font-medium">Medium Shots Ready</div>
                </div>
                <div className="w-px h-10 bg-stone-700" />
                <div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {masterImage ? 'Master Synced' : 'Ready to Start'}
                  </div>
                  <div className="text-[11px] text-stone-400">Consistency Anchor</div>
                </div>
              </div>

              {renderedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsLookbookOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  View Lookbook & Deck
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error / Quota Notice Banner */}
        {generationError && (
          <div
            id="generation-error-banner"
            className={`p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-xs ${
              generationError.isQuota
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  generationError.isQuota ? 'text-amber-600' : 'text-red-600'
                }`}
              />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-sm">
                  {generationError.isQuota ? 'API Quota Notice: Nano-Banana' : 'Generation Failed'}
                </div>
                <p className="leading-relaxed">{generationError.message}</p>
                {generationError.isQuota && (
                  <p className="text-stone-600 text-[11px] pt-1">
                    Image generation with Nano-Banana (<code className="font-mono text-stone-800">gemini-3.1-flash-lite-image</code>) is a premium capability requiring an active Gemini API key with billing enabled. You can manage or update your API key in AI Studio.
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGenerationError(null)}
              className="p-1.5 rounded-lg hover:bg-black/5 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1: Product Specifications & Master Anchor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ProductForm
              product={product}
              onChange={setProduct}
              onMasterGenerate={handleGenerateMaster}
              isGeneratingMaster={isGeneratingMaster}
              hasMasterImage={Boolean(masterImage)}
            />
          </div>

          <div className="lg:col-span-5">
            <MasterProductCard
              masterImage={masterImage || undefined}
              productName={product.name}
              isGenerating={isGeneratingMaster}
              onGenerate={handleGenerateMaster}
              onUploadCustomImage={handleUploadCustomAnchor}
              onViewPrompt={(prompt, title) =>
                setActivePromptModal({ isOpen: true, title, prompt })
              }
              onOpenImageModal={(imageUrl, title) =>
                setActiveImageModal({ isOpen: true, imageUrl, title })
              }
            />
          </div>
        </div>

        {/* Step 2: Imagine Across Mediums */}
        <div className="space-y-5 pt-4 border-t border-stone-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Grid className="w-5 h-5 text-stone-700" />
                  2. Imagine Across Mediums
                </h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                  {mediums.length} Mediums Available
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Each shot places the consistent product into architectural, print, and social environments without any people.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="add-custom-medium-btn"
                type="button"
                onClick={() => setIsCustomMediumModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Custom Medium
              </button>

              <button
                id="open-campaign-lookbook-btn"
                type="button"
                onClick={() => setIsLookbookOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Lookbook & Export
              </button>

              <button
                id="generate-all-mediums-btn"
                type="button"
                onClick={handleGenerateAllMediums}
                disabled={isBatchGenerating || !product.name}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                {isBatchGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Rendering All Mediums...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Render All Mediums
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Campaign Atmosphere Lighting Mood Selector + Category Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-4">
            {/* Campaign Mood */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Campaign Lighting & Atmosphere:
                </span>
                <span className="text-[11px] text-stone-500 hidden md:inline">
                  Ties together lighting across every medium
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CAMPAIGN_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      selectedMood === mood.id
                        ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                    title={mood.description}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'all', label: 'All Mediums' },
                    { id: 'outdoor', label: 'Outdoor & Transit' },
                    { id: 'print', label: 'Print & Editorial' },
                    { id: 'digital', label: 'Digital & Social' },
                  ] as { id: MediumCategory; label: string }[]
                ).map((cat) => {
                  const count =
                    cat.id === 'all'
                      ? mediums.length
                      : mediums.filter((m) => m.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-amber-100 text-amber-900 font-semibold'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {cat.label}
                      <span className="text-[10px] opacity-75 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                Showing {filteredMediums.length} items
              </span>
            </div>
          </div>

          {/* Mediums Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMediums.map((item) => (
              <MediumCard
                key={item.id}
                item={item}
                hasMasterAnchor={Boolean(masterImage)}
                onGenerate={(id, context) => handleGenerateMedium(id, context)}
                onViewPrompt={(prompt, title) =>
                  setActivePromptModal({ isOpen: true, title, prompt })
                }
                onOpenImageModal={(imageUrl, title) =>
                  setActiveImageModal({ isOpen: true, imageUrl, title })
                }
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Brand builder app</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-600">
              <Cpu className="w-3 h-3 text-amber-600" />
              Powered by Nano-Banana (<code className="font-mono text-[11px]">gemini-3.1-flash-lite-image</code>)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-700 font-medium">✓ Zero-Person Mandate Enforced</span>
            <span>•</span>
            <span className="text-stone-500">Master Product Consistency Pipeline</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CampaignLookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        product={product}
        masterImage={masterImage || undefined}
        mediums={mediums}
      />

      <ImageModal
        isOpen={activeImageModal.isOpen}
        onClose={() => setActiveImageModal({ isOpen: false, imageUrl: '', title: '' })}
        imageUrl={activeImageModal.imageUrl}
        title={activeImageModal.title}
        masterImageUrl={masterImage?.imageUrl}
        productName={product.name}
      />

      <PromptModal
        isOpen={activePromptModal.isOpen}
        onClose={() => setActivePromptModal({ isOpen: false, title: '', prompt: '' })}
        title={activePromptModal.title}
        prompt={activePromptModal.prompt}
      />

      <CustomMediumModal
        isOpen={isCustomMediumModalOpen}
        onClose={() => setIsCustomMediumModalOpen(false)}
        onAdd={handleAddCustomMedium}
      />
    </div>
  );
}
