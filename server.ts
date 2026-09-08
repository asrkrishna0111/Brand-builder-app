import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 image reference payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Nano-Banana model alias specified by the user & skill guidelines
const NANO_BANANA_MODEL = 'gemini-3.1-flash-lite-image';
const TEXT_ASSISTANT_MODEL = 'gemini-3.8-flash';

// Health and capability check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    model: NANO_BANANA_MODEL,
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
  });
});

// Helper to extract image data from Gemini response
function extractImageFromResponse(response: any): { imageUrl: string; text?: string } | null {
  if (!response?.candidates?.[0]?.content?.parts) {
    return null;
  }

  let base64Data = '';
  let mimeType = 'image/png';
  let text = '';

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData?.data) {
      base64Data = part.inlineData.data;
      if (part.inlineData.mimeType) {
        mimeType = part.inlineData.mimeType;
      }
    } else if (part.text) {
      text += part.text;
    }
  }

  if (base64Data) {
    return {
      imageUrl: `data:${mimeType};base64,${base64Data}`,
      text: text.trim(),
    };
  }

  return null;
}

function parseGeminiError(error: any): { message: string; isQuota: boolean; retryDelay?: string } {
  const rawMsg = error?.message || (typeof error === 'string' ? error : '');
  let isQuota = false;
  let retryDelay: string | undefined;

  if (
    error?.status === 'RESOURCE_EXHAUSTED' ||
    error?.code === 429 ||
    rawMsg.includes('429') ||
    rawMsg.includes('RESOURCE_EXHAUSTED') ||
    rawMsg.includes('Quota exceeded')
  ) {
    isQuota = true;
  }

  try {
    const jsonMatch = rawMsg.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.error) {
        if (parsed.error.code === 429 || parsed.error.status === 'RESOURCE_EXHAUSTED') {
          isQuota = true;
        }
        if (parsed.details) {
          const retryInfo = parsed.details.find((d: any) => d.retryDelay);
          if (retryInfo?.retryDelay) {
            retryDelay = retryInfo.retryDelay;
          }
        }
      }
    }
  } catch {
    // Ignore JSON parse errors
  }

  if (isQuota) {
    let cleanMessage = 'Rate limit or quota reached for Nano-Banana (gemini-3.1-flash-lite-image).';
    if (rawMsg.includes('limit: 0') || rawMsg.includes('free_tier')) {
      cleanMessage =
        'Image generation with Nano-Banana (gemini-3.1-flash-lite-image) requires a paid Gemini API key with billing enabled. Please select or attach an active billable API key in Settings > Secrets.';
    } else if (retryDelay) {
      cleanMessage = `Quota rate limit reached for Nano-Banana. Please retry in ${retryDelay}.`;
    }
    return { message: cleanMessage, isQuota: true, retryDelay };
  }

  return { message: rawMsg || 'An error occurred during Gemini image generation.', isQuota: false };
}

// 1. Generate Master Product Hero Shot
app.post('/api/generate-master', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'Missing GEMINI_API_KEY. Please ensure your API key is configured in Settings > Secrets.',
      });
    }

    const { product, customPrompt } = req.body;
    if (!product || !product.name) {
      return res.status(400).json({ error: 'Product name and details are required.' });
    }

    const promptText =
      customPrompt ||
      `Hero commercial studio product photography of ${product.name}, a ${product.category || 'luxury product'}. ` +
      `Product Specifications: ${product.description || ''}. ` +
      `Materials and Textures: ${product.materials || 'premium finishes'}. ` +
      `Exact Color Scheme: ${product.colors || 'neutral tones'}. ` +
      `Distinctive Features & Branding: ${product.distinctiveFeatures || 'clean refined typography and logo'}. ` +
      `Brand Aesthetic: ${product.brandVibe || 'minimalist high-end design'}. ` +
      `Lighting & Setting: Centered on a sculpted stone or matte ceramic exhibition plinth, soft cinematic directional lighting with crisp, subtle contact shadows, hyper-detailed commercial catalog photography, sharp focus. ` +
      `CRITICAL MANDATE: ABSOLUTELY NO PEOPLE, NO HUMANS, NO HANDS, NO FACES, NO BODIES, NO PERSON SILHOUETTES. The scene must be 100% devoid of human beings. Pure standalone product study.`;

    const response = await ai.models.generateContent({
      model: NANO_BANANA_MODEL,
      contents: {
        parts: [{ text: promptText }],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
        },
      },
    });

    const result = extractImageFromResponse(response);
    if (!result) {
      return res.status(500).json({
        error: 'The Nano-Banana model did not return an image part. Please try again with slightly different parameters.',
      });
    }

    res.json({
      imageUrl: result.imageUrl,
      promptUsed: promptText,
      model: NANO_BANANA_MODEL,
    });
  } catch (error: any) {
    console.error('Error generating master image:', error);
    const parsed = parseGeminiError(error);
    res.status(parsed.isQuota ? 429 : 500).json({
      error: parsed.message,
      isQuota: parsed.isQuota,
      retryDelay: parsed.retryDelay,
    });
  }
});

// 2. Generate Product Across Mediums (Billboard, Newspaper, Social, etc.)
app.post('/api/generate-medium', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'Missing GEMINI_API_KEY. Please ensure your API key is configured.',
      });
    }

    const {
      product,
      mediumType,
      mediumTitle,
      aspectRatio = '1:1',
      customContext,
      moodPrompt,
      masterImage,
    } = req.body;

    if (!product || !product.name) {
      return res.status(400).json({ error: 'Product details are required.' });
    }

    // Medium specific scene definitions
    let sceneDescription = '';
    switch (mediumType) {
      case 'billboard':
        sceneDescription =
          'A monumental outdoor roadside billboard advertisement overlooking a scenic architectural mountain highway at twilight golden hour. The elevated advertising board cleanly displays the featured product with crisp commercial billboard graphics and typography, dramatic overhead spotlight illumination, cinematic landscape vista with zero traffic and empty road.';
        break;
      case 'newspaper':
        sceneDescription =
          'An authentic printed broadsheet newspaper spread lying open on a clean modern oak wood studio table, soft morning natural window light. The newspaper features sharp halftone ink textures and multi-column journalism framing a dedicated prominent full-page printed advertisement showcasing the featured product with elegant printed graphic layout and tactile paper fiber grain.';
        break;
      case 'social_post':
        sceneDescription =
          'A contemporary editorial social media campaign photograph, styled as a flatlay or pedestal composition on an organic travertine plinth. Crisp geometric cast shadows, soft diffused studio daylight, minimalist tactile aesthetic props complementing the product, clean negative space, high-fashion brand campaign art direction.';
        break;
      case 'magazine':
        sceneDescription =
          'A luxury heavyweight glossy lifestyle design magazine opened flat on a minimalist concrete surface. High-contrast editorial page layout showing a pristine full-page print advertisement of the product with refined serif typographic accents, subtle paper gloss reflection, immaculate commercial art direction.';
        break;
      case 'subway_ad':
        sceneDescription =
          'A sleek architectural backlit advertising poster lightbox mounted inside a pristine, quiet contemporary underground transit station terminal. Polished terrazzo stone flooring, geometric architectural ceiling linear lights, clean glass walls, empty quiet subway platform.';
        break;
      case 'storefront':
        sceneDescription =
          'A luxury flagship retail boutique window storefront display at evening dusk. The product is elevated on an illuminated matte satin plinth inside the display window, framed by warm interior spot illumination and subtle outer reflections of architectural city facades, clean empty sidewalk.';
        break;
      case 'digital_kiosk':
        sceneDescription =
          'A freestanding vertical outdoor digital advertising totem kiosk on a contemporary polished stone plaza at twilight. The vibrant high-definition vertical LED screen displays the bold product advertising visual, surrounded by ambient ground uplights and evening sky.';
        break;
      default:
        sceneDescription =
          customContext ||
          `An advertising installation showcasing the product in a ${mediumTitle || 'commercial setting'}.`;
        break;
    }

    if (moodPrompt) {
      sceneDescription += ` Campaign Lighting & Atmosphere: ${moodPrompt}`;
    }

    if (customContext && mediumType !== 'custom') {
      sceneDescription += ` Additional art direction notes: ${customContext}`;
    }

    // Build the parts payload
    const parts: any[] = [];

    // If master image reference is provided, pass it as inlineData for visual continuity!
    let hasReferenceImage = false;
    if (masterImage && typeof masterImage === 'string' && masterImage.startsWith('data:image/')) {
      const match = masterImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (match && match.length === 3) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
        hasReferenceImage = true;
      }
    }

    // Comprehensive prompt enforcing product consistency and the strict zero-person mandate
    const promptText =
      (hasReferenceImage
        ? `[Visual Reference Image: The attached image shows the canonical MASTER PRODUCT design]. ` +
          `CRITICAL PRODUCT CONSISTENCY DIRECTIVE: The advertisement MUST feature the exact same product shown in the reference image. `
        : `CRITICAL PRODUCT CONSISTENCY DIRECTIVE: Feature the exact specified product: `) +
      `Product Name: ${product.name}. ` +
      `Form Factor & Packaging: ${product.description || ''}. ` +
      `Materials & Finishes: ${product.materials || 'premium finishes'}. ` +
      `Exact Color Scheme: ${product.colors || 'authentic brand colors'}. ` +
      `Distinctive Markings: ${product.distinctiveFeatures || 'consistent branding geometry'}. ` +
      `Medium Context & Scene: ${sceneDescription}. ` +
      `STRICT MANDATE - ZERO HUMANS: ABSOLUTELY NO PEOPLE, NO HUMANS, NO FACES, NO HANDS, NO BODIES, NO PERSON SILHOUETTES ANYWHERE IN THE ENTIRE IMAGE. The scene must be completely devoid of human beings. Pure focus on the product, its medium presentation, and architectural environment.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: NANO_BANANA_MODEL,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    const result = extractImageFromResponse(response);
    if (!result) {
      return res.status(500).json({
        error: `The Nano-Banana model did not return an image for ${mediumTitle}. Please try again.`,
      });
    }

    res.json({
      imageUrl: result.imageUrl,
      promptUsed: promptText,
      model: NANO_BANANA_MODEL,
      mediumType,
      aspectRatio,
    });
  } catch (error: any) {
    console.error('Error generating medium image:', error);
    const parsed = parseGeminiError(error);
    res.status(parsed.isQuota ? 429 : 500).json({
      error: parsed.message,
      isQuota: parsed.isQuota,
      retryDelay: parsed.retryDelay,
    });
  }
});

// 3. AI Brand Strategy & Concept Enhancer (using gemini-3.8-flash)
app.post('/api/enhance-concept', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'Missing GEMINI_API_KEY. Please ensure your API key is configured.',
      });
    }

    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Concept idea is required.' });
    }

    const prompt = `You are a world-class industrial product designer and brand creative director.
Given this product idea: "${idea}", develop a cohesive, highly detailed physical product identity optimized for brand consistency across billboards, newspapers, social media, and print mediums.
IMPORTANT: Note that this brand's visual identity strictly forbids depicting human figures or people in any advertising photography (zero-person rule).

Respond strictly with a JSON object matching this structure:
{
  "name": "Concise distinctive product name",
  "category": "e.g. Artisanal Beverage, Consumer Electronics, Luxury Fragrance, Home Decor, Outdoor Gear",
  "tagline": "Memorable 4-7 word brand slogan",
  "description": "2-3 sentences describing the exact physical silhouette, container/form factor, geometry, scale, and packaging presentation",
  "materials": "Specific tactile materials, e.g. frosted amber borosilicate glass, bead-blasted raw titanium, unglazed ivory ceramic, debossed cotton paper",
  "colors": "3-4 exact harmonious colors with finishes, e.g. Matte Sage Green, Brushed Warm Brass, Alabaster White",
  "distinctiveFeatures": "Unique identifying visual motifs or branding elements that must remain consistent in every camera angle (e.g. geometric sun logo debossed into shoulder, faceted hex cap)",
  "brandVibe": "3-4 mood descriptors, e.g. Minimalist Nordic Luxury, Wabi-Sabi Organic, Precision Bauhaus"
}`;

    const response = await ai.models.generateContent({
      model: TEXT_ASSISTANT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error enhancing concept:', error);
    res.status(500).json({
      error: error?.message || 'Failed to enhance product concept.',
    });
  }
});

// Setup Vite development middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand builder app server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
