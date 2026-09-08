import { MediumConfig, ProductDetails, CampaignMood } from '../types';

export interface CampaignMoodOption {
  id: CampaignMood;
  label: string;
  description: string;
  promptInjection: string;
}

export const CAMPAIGN_MOODS: CampaignMoodOption[] = [
  {
    id: 'golden_hour',
    label: 'Sunset Golden Hour',
    description: 'Warm, low-angle honey illumination and rich soft shadows',
    promptInjection: 'Atmospheric sunset golden hour lighting, rich amber low-angle sunlight, warm glow, soft elongated cinematic shadows.',
  },
  {
    id: 'minimalist_studio',
    label: 'Clean Minimal Studio',
    description: 'Even, diffused architectural studio light with neutral backdrop',
    promptInjection: 'Ultra-clean minimalist studio lighting, diffused softboxes, neutral tonal balance, crisp contact shadows, immaculate commercial art direction.',
  },
  {
    id: 'morning_light',
    label: 'Crisp Morning Sun',
    description: 'Fresh, bright natural daylight streaming through architecture',
    promptInjection: 'Pristine early morning sunlight, fresh crisp highlights, clean airy atmosphere, radiant natural architectural illumination.',
  },
  {
    id: 'twilight_architectural',
    label: 'Twilight & Ambient Light',
    description: 'Dusk deep indigo sky with warm interior spotlighting',
    promptInjection: 'Cinematic evening twilight, deep blue hour sky, warm artificial interior spotlights, subtle glass reflections, contemporary mood.',
  },
  {
    id: 'editorial_moody',
    label: 'High-Fashion Editorial',
    description: 'Dramatic chiaroscuro shadows and sculptural contrasts',
    promptInjection: 'High-contrast editorial chiaroscuro lighting, deep velvety negative space, sharp sculpted rim highlights, high-fashion campaign atmosphere.',
  },
];

export const MEDIUM_PRESETS: MediumConfig[] = [
  {
    id: 'billboard',
    title: 'Highway Billboard',
    subtitle: 'High-impact 16:9 outdoor display',
    category: 'outdoor',
    aspectRatio: '16:9',
    description: 'A grand roadside billboard towering along a modern scenic architectural bypass at sunset golden hour, illuminated by clean structural floodlights.',
    defaultPromptContext: 'A grand outdoor roadside billboard alongside a clean architectural highway with a dramatic sunset twilight sky, dramatic lighting, modern commercial advertising display.',
    iconName: 'Maximize2',
  },
  {
    id: 'newspaper',
    title: 'Newspaper Print Ad',
    subtitle: 'Classic 4:3 broadsheet editorial',
    category: 'print',
    aspectRatio: '4:3',
    description: 'An authentic printed newspaper broadsheet open on a clean wooden studio desk, showcasing a crisp editorial advertisement block with rich ink texture and typography.',
    defaultPromptContext: 'An authentic printed broadsheet newspaper spread lying open on an oak table, with crisp halftone ink texture, editorial columns framing a dedicated full-page advertisement for the product, warm morning ambient light.',
    iconName: 'Newspaper',
  },
  {
    id: 'social_post',
    title: 'Social Campaign Post',
    subtitle: '1:1 square digital lifestyle aesthetic',
    category: 'digital',
    aspectRatio: '1:1',
    description: 'A curated social media flatlay or pedestal product shot with sculptural props, soft cast shadows, and clean negative space tailored for an Instagram campaign.',
    defaultPromptContext: 'A contemporary luxury social media brand campaign visual, styled on an organic stone podium with crisp sculptural shadows, soft diffused studio light, minimalist geometric props, premium commercial photography.',
    iconName: 'Instagram',
  },
  {
    id: 'magazine',
    title: 'Magazine Editorial Spread',
    subtitle: '3:4 glossy print magazine layout',
    category: 'print',
    aspectRatio: '3:4',
    description: 'A premium glossy lifestyle publication opened to a full-page feature ad with crisp typographic accents and high-end editorial styling.',
    defaultPromptContext: 'A luxury glossy design magazine opened flat, showing a full-page art-directed editorial advertisement of the product with refined typography and exquisite tactile paper sheen, soft natural window light.',
    iconName: 'BookOpen',
  },
  {
    id: 'subway_ad',
    title: 'Subway Station Ad',
    subtitle: '3:4 backlit transit poster',
    category: 'outdoor',
    aspectRatio: '3:4',
    description: 'A sleek, backlit advertising lightbox mounted on a polished concrete wall in a minimalist, empty modern metropolitan subway terminal.',
    defaultPromptContext: 'A sleek backlit poster frame inside a quiet, modern metropolitan underground transit terminal. Polished terrazzo floors, clean architectural lines, pristine advertising display, quiet ambient glow.',
    iconName: 'Train',
  },
  {
    id: 'storefront',
    title: 'Storefront Window Display',
    subtitle: '16:9 luxury retail boutique window',
    category: 'outdoor',
    aspectRatio: '16:9',
    description: 'An elegant glass boutique storefront window display at twilight, featuring the product elevated on illuminated pedestals with subtle glass reflections.',
    defaultPromptContext: 'A high-end designer boutique exterior storefront window at dusk, showcasing the product elevated on illuminated satin-finish pedestals, warm interior spotlighting, clean glass reflections of evening city architecture.',
    iconName: 'Store',
  },
  {
    id: 'digital_kiosk',
    title: 'Digital Plaza Totem',
    subtitle: '9:16 vertical smart city kiosk',
    category: 'digital',
    aspectRatio: '9:16',
    description: 'A freestanding vertical digital totem kiosk on a contemporary stone plaza, displaying the animated aesthetic product ad under ambient twilight.',
    defaultPromptContext: 'A sleek vertical outdoor digital advertising kiosk on an empty contemporary stone plaza at dusk. The vibrant high-definition vertical screen showcases the crisp product ad, surrounded by ambient architectural lighting.',
    iconName: 'Smartphone',
  },
];

export const PRODUCT_PRESETS: { label: string; product: ProductDetails }[] = [
  {
    label: 'Solstice Cold Brew Bottle',
    product: {
      name: 'Solstice Botanical Cold Brew',
      category: 'Artisanal Beverage',
      tagline: 'Slow-steeped under mountain sun.',
      description: 'A 330ml cylindrical amber glass bottle with embossed sunburst glass textures, sealed with a brushed gold crown cap and an ivory textured paper label with foil-stamped typography.',
      materials: 'Heavy amber glass, brushed brass cap, tactile deckled-edge cotton paper label with gold foil embossing',
      colors: 'Deep amber glass, warm sunburst gold, ivory cream, dark espresso brown',
      distinctiveFeatures: 'Embossed geometric sun emblem pressed directly into the glass shoulders, minimalist apothecary typography',
      brandVibe: 'Artisanal, mindful luxury, grounded organic sophistication',
    },
  },
  {
    label: 'Aura Spatial Headphones',
    product: {
      name: 'Aura One Wireless Headset',
      category: 'Consumer Electronics & Audio',
      tagline: 'Silence the noise, feel the soundscape.',
      description: 'Over-ear headphones crafted from aerospace-grade frosted titanium, anodized mist-silver earcups with acoustic perforated leather pads, and an unbroken arched stainless steel headband.',
      materials: 'Matte bead-blasted titanium, mist-silver anodized aluminum, micro-perforated memory foam leather',
      colors: 'Space silver, lunar mist white, obsidian dark gray accents',
      distinctiveFeatures: 'Unbroken monolithic arc headband, recessed capacitive dial with subtle chamfered edge',
      brandVibe: 'Ultra-modern, minimalist Nordic engineering, architectural precision',
    },
  },
  {
    label: 'Komorebi Ceramic Diffuser',
    product: {
      name: 'Komorebi Ultrasonic Diffuser',
      category: 'Home & Wellness',
      tagline: 'Filtered light, scented mist.',
      description: 'A sculptural conical ultrasonic aroma diffuser crafted from speckled unglazed stoneware pottery with a fluted wooden cedar base and a delicate vertical mist plume.',
      materials: 'Unglazed speckled ivory stoneware ceramic, Japanese Hinoki cedar wood base',
      colors: 'Off-white chalk ceramic, warm honey cedar wood, soft warm amber glow',
      distinctiveFeatures: 'Subtle fluted ribs along the conical ceramic cover, seamless bottom ring glow, ultra-fine vapor ribbon',
      brandVibe: 'Wabi-sabi elegance, Japanese minimalism, serene spa sanctuary',
    },
  },
  {
    label: 'Lumina Peptide Serum',
    product: {
      name: 'Lumina Cellular Bio-Serum',
      category: 'Luxury Skincare',
      tagline: 'Radiance at the molecular horizon.',
      description: 'A 50ml heavyweight frosted acrylic flacon with a rose-gold magnetic dropper pipette, housing an iridescent pearlescent lavender serum inside.',
      materials: 'Heavy frosted crystal glass, brushed champagne rose-gold metal collar, glass dropper pipette',
      colors: 'Translucent frosted white, iridescent lavender glow, champagne rose-gold',
      distinctiveFeatures: 'Square-silhouette bottle with soft rounded inner chamber, sleek micro-embossed sans-serif typography',
      brandVibe: 'Dermatological biotech, high-fashion luminescence, scientific purity',
    },
  },
];
