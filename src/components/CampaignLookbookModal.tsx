import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Box,
  Palette,
  Tag,
  Cpu,
  Archive,
} from 'lucide-react';
import JSZip from 'jszip';
import { ProductDetails, GeneratedMediumItem } from '../types';

interface CampaignLookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetails;
  masterImage?: {
    imageUrl: string;
    promptUsed: string;
    createdAt: number;
  };
  mediums: GeneratedMediumItem[];
}

export const CampaignLookbookModal: React.FC<CampaignLookbookModalProps> = ({
  isOpen,
  onClose,
  product,
  masterImage,
  mediums,
}) => {
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const renderedMediums = mediums.filter((m) => Boolean(m.imageUrl));

  const handleExportZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const campaignFolder = zip.folder(`${product.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_Brand_Campaign`);

      // Add Master Anchor if exists
      if (masterImage?.imageUrl) {
        const base64Data = masterImage.imageUrl.split(',')[1];
        campaignFolder?.file('00_Master_Product_Anchor.png', base64Data, { base64: true });
      }

      // Add Rendered Mediums
      renderedMediums.forEach((m, idx) => {
        if (m.imageUrl) {
          const base64Data = m.imageUrl.split(',')[1];
          const fileName = `${String(idx + 1).padStart(2, '0')}_${m.mediumTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
          campaignFolder?.file(fileName, base64Data, { base64: true });
        }
      });

      // Add Readme / Brand Spec Sheet
      const specContent = `=====================================================
BRAND BUILDER APP — CAMPAIGN SPECIFICATIONS DECK
Model Engine: Nano-Banana (gemini-3.1-flash-lite-image)
Export Timestamp: ${new Date().toISOString()}
=====================================================

1. PRODUCT IDENTITY
-------------------
Product Name: ${product.name}
Category: ${product.category}
Tagline: ${product.tagline || 'N/A'}
Brand Vibe: ${product.brandVibe}

2. PHYSICAL SPECIFICATIONS & FORM FACTOR
---------------------------------------
Packaging & Form Factor:
${product.description}

Tactile Materials & Finishes:
${product.materials}

Colorway:
${product.colors}

Distinctive Visual Signatures (Consistency Anchors):
${product.distinctiveFeatures}

3. MANDATES & POLICIES
----------------------
[✓] Zero-Person Mandate: Every prompt enforced strict negative directives forbidding human figures, faces, hands, bodies, and silhouettes.
[✓] Product Consistency Engine: Cross-medium shots anchor directly to the Master Product image and detailed visual descriptors.
[✓] Image Model: Nano-Banana (gemini-3.1-flash-lite-image).

4. RENDERED MEDIUMS (${renderedMediums.length} total)
--------------------------------------
${renderedMediums
  .map(
    (m, i) =>
      `[${i + 1}] ${m.mediumTitle} (${m.aspectRatio})\nPrompt: ${m.promptUsed}\n`
  )
  .join('\n')}
=====================================================
`;

      campaignFolder?.file('BRAND_CAMPAIGN_GUIDELINES.txt', specContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${product.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-campaign-package.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to create ZIP package:', err);
      alert('Failed to package campaign files into ZIP.');
    } finally {
      setIsZipping(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-stone-950 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="p-4 sm:px-6 border-b border-stone-800 flex items-center justify-between bg-stone-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-mono font-bold text-sm">
              B
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                Brand Campaign Lookbook
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-stone-700 font-mono">
                  Nano-Banana
                </span>
              </h2>
              <p className="text-xs text-stone-400">{product.name} — Cohesive Rollout</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-zip-btn"
              type="button"
              onClick={handleExportZip}
              disabled={isZipping || renderedMediums.length === 0}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download all images and spec sheet as a .zip"
            >
              <Archive className="w-3.5 h-3.5" />
              {isZipping ? 'Packaging ZIP...' : 'Export Campaign ZIP'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print lookbook or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Lookbook Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Brand Cover Banner */}
          <div className="rounded-2xl border border-stone-800 bg-linear-to-b from-stone-900 to-stone-950 p-6 sm:p-8 relative overflow-hidden">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-medium">
                  {product.category || 'Product Design'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Zero-Person Mandate
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-400 border border-sky-800/60 font-medium flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Master Anchored Consistency
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-base sm:text-lg text-amber-400/90 font-medium italic">
                  &ldquo;{product.tagline}&rdquo;
                </p>
              )}

              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-2xl">
                {product.description}
              </p>
            </div>
          </div>

          {/* Master Anchor + Identity Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Master Anchor Visual */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Canonical Master Anchor Shot
                </span>
                <span className="text-stone-500 font-mono text-[11px]">1:1 Studio Plinth</span>
              </div>

              <div className="aspect-square rounded-2xl border border-stone-800 bg-stone-900 overflow-hidden flex items-center justify-center relative group">
                {masterImage?.imageUrl ? (
                  <img
                    src={masterImage.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-stone-500 text-xs">
                    No master anchor generated yet.
                  </div>
                )}
              </div>
            </div>

            {/* Visual Specs Matrix */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 mb-1">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  Exact Color Palette
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{product.colors}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 mb-1">
                  <Box className="w-3.5 h-3.5 text-sky-400" />
                  Tactile Materials & Finishes
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{product.materials}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 mb-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  Distinctive Visual Signatures
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{product.distinctiveFeatures}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Brand Mood & Atmosphere
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{product.brandVibe}</p>
              </div>
            </div>
          </div>

          {/* Mediums Campaign Showcase */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Medium Campaign Visuals
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Visualized across billboards, print journalism, and digital campaigns without human figures.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">
                {renderedMediums.length} Rendered Shots
              </span>
            </div>

            {renderedMediums.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-stone-800 bg-stone-900/50 text-stone-500 text-xs">
                No medium shots rendered yet. Return to the main canvas and click &ldquo;Render Shot&rdquo; or &ldquo;Render All Mediums&rdquo;!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {renderedMediums.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-stone-800 bg-stone-900 overflow-hidden flex flex-col"
                  >
                    <div className="p-3 border-b border-stone-800 flex items-center justify-between bg-stone-950/40">
                      <h4 className="text-xs font-bold text-white">{m.mediumTitle}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-stone-800 text-stone-400">
                        {m.aspectRatio}
                      </span>
                    </div>

                    <div className="bg-stone-950 flex items-center justify-center overflow-hidden min-h-[220px]">
                      <img
                        src={m.imageUrl}
                        alt={m.mediumTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover max-h-[300px]"
                      />
                    </div>

                    <div className="p-3 bg-stone-900/90 text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-800/80">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Nano-Banana Verified
                      </span>
                      <span className="text-stone-500">Zero-Person Strict</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
