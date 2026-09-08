import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Palette, Box, Tag, Layers, CheckCircle2 } from 'lucide-react';
import { ProductDetails } from '../types';
import { PRODUCT_PRESETS } from '../data/presets';

interface ProductFormProps {
  product: ProductDetails;
  onChange: (updated: ProductDetails) => void;
  onMasterGenerate: () => void;
  isGeneratingMaster: boolean;
  hasMasterImage: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onChange,
  onMasterGenerate,
  isGeneratingMaster,
  hasMasterImage,
}) => {
  const [ideaInput, setIdeaInput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceSuccess, setEnhanceSuccess] = useState(false);

  const handleFieldChange = (field: keyof ProductDetails, value: string) => {
    onChange({
      ...product,
      [field]: value,
    });
  };

  const handleApplyPreset = (presetProduct: ProductDetails) => {
    onChange({ ...presetProduct });
  };

  const handleEnhanceWithAI = async () => {
    if (!ideaInput.trim()) return;
    setIsEnhancing(true);
    setEnhanceSuccess(false);

    try {
      const res = await fetch('/api/enhance-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaInput }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to enhance idea');
      }

      const enhancedData = await res.json();
      onChange({
        name: enhancedData.name || product.name,
        category: enhancedData.category || product.category,
        tagline: enhancedData.tagline || product.tagline,
        description: enhancedData.description || product.description,
        materials: enhancedData.materials || product.materials,
        colors: enhancedData.colors || product.colors,
        distinctiveFeatures: enhancedData.distinctiveFeatures || product.distinctiveFeatures,
        brandVibe: enhancedData.brandVibe || product.brandVibe,
      });

      setEnhanceSuccess(true);
      setTimeout(() => setEnhanceSuccess(false), 3000);
    } catch (err: any) {
      console.error('Enhance failed:', err);
      alert(err.message || 'Could not enhance idea.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header & Presets */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Box className="w-5 h-5 text-stone-700" />
              1. Define Product Visual Identity
            </h2>
            <p className="text-xs text-stone-500">
              Establish the core product specifications and visual anchors that all medium shots will maintain.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-stone-500 mr-1">Sample Presets:</span>
            {PRODUCT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                id={`preset-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => handleApplyPreset(preset.product)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                  product.name === preset.product.name
                    ? 'bg-stone-900 text-white border-stone-900 font-medium shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {preset.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* AI Idea Quick-Start Box */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 mt-2">
          <label className="block text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              AI Concept Spark: Type any rough product idea to auto-fill specifications
            </span>
            {enhanceSuccess && (
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Enhanced!
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <input
              id="ai-idea-input"
              type="text"
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEnhanceWithAI();
                }
              }}
              placeholder="e.g. A portable titanium espresso tumbler with leather thermal sleeve..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900 placeholder:text-stone-400"
            />
            <button
              id="enhance-idea-btn"
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isEnhancing || !ideaInput.trim()}
              className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  Enhance Concept
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={product.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="e.g. Solstice Botanical Cold Brew"
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="product-category">
            Product Category
          </label>
          <input
            id="product-category"
            type="text"
            value={product.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            placeholder="e.g. Artisanal Beverage, Audio Tech, Luxury Skincare"
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900"
          />
        </div>

        {/* Tagline */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="product-tagline">
            Brand Tagline / Slogan (Optional)
          </label>
          <input
            id="product-tagline"
            type="text"
            value={product.tagline}
            onChange={(e) => handleFieldChange('tagline', e.target.value)}
            placeholder="e.g. Slow-steeped under mountain sun."
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900"
          />
        </div>

        {/* Form Factor Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="product-description">
            Physical Form Factor & Packaging Geometry
          </label>
          <textarea
            id="product-description"
            rows={2}
            value={product.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Describe the exact silhouette, scale, container shape, cap, and silhouette details..."
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900 resize-none"
          />
        </div>

        {/* Materials & Finishes */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="product-materials">
            Materials & Finishes
          </label>
          <input
            id="product-materials"
            type="text"
            value={product.materials}
            onChange={(e) => handleFieldChange('materials', e.target.value)}
            placeholder="e.g. Heavy amber glass, brushed brass, cotton deckled paper"
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900"
          />
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="product-colors">
            Exact Colorway
          </label>
          <input
            id="product-colors"
            type="text"
            value={product.colors}
            onChange={(e) => handleFieldChange('colors', e.target.value)}
            placeholder="e.g. Deep amber, warm sunburst gold, ivory cream"
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900"
          />
        </div>

        {/* Distinctive Signatures (Consistency Key) */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="product-features">
            Distinctive Signatures (Consistency Anchors)
          </label>
          <input
            id="product-features"
            type="text"
            value={product.distinctiveFeatures}
            onChange={(e) => handleFieldChange('distinctiveFeatures', e.target.value)}
            placeholder="e.g. Debossed sun logo on glass shoulders, ribbed cap, italic serif type"
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900"
          />
        </div>

        {/* Brand Vibe */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="product-vibe">
            Brand Aesthetic & Mood
          </label>
          <input
            id="product-vibe"
            type="text"
            value={product.brandVibe}
            onChange={(e) => handleFieldChange('brandVibe', e.target.value)}
            placeholder="e.g. Artisanal, mindful luxury, architectural minimalism"
            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-stone-900"
          />
        </div>
      </div>

      {/* Action Footer for Master Product Generation */}
      <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-stone-500 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-stone-400" />
          <span>Generating a Master Product Shot creates the visual benchmark for all mediums.</span>
        </div>

        <button
          id="generate-master-btn"
          type="button"
          onClick={onMasterGenerate}
          disabled={isGeneratingMaster || !product.name}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          {isGeneratingMaster ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating Master Product (Nano-Banana)...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-stone-950" />
              {hasMasterImage ? 'Regenerate Master Product Shot' : 'Generate Master Product Anchor'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
