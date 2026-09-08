export type MediumType =
  | 'billboard'
  | 'newspaper'
  | 'social_post'
  | 'subway_ad'
  | 'magazine'
  | 'storefront'
  | 'digital_kiosk'
  | 'custom';

export type MediumCategory = 'all' | 'outdoor' | 'print' | 'digital';

export type CampaignMood =
  | 'golden_hour'
  | 'minimalist_studio'
  | 'morning_light'
  | 'twilight_architectural'
  | 'editorial_moody';

export type AspectRatio = '1:1' | '16:9' | '4:3' | '3:4' | '9:16';

export interface MediumConfig {
  id: MediumType;
  title: string;
  subtitle: string;
  category: 'outdoor' | 'print' | 'digital';
  aspectRatio: AspectRatio;
  description: string;
  defaultPromptContext: string;
  iconName: string;
}

export interface ProductDetails {
  name: string;
  category: string;
  tagline: string;
  description: string;
  materials: string;
  colors: string;
  distinctiveFeatures: string;
  brandVibe: string;
}

export interface GeneratedMediumItem {
  id: string;
  mediumType: MediumType;
  mediumTitle: string;
  category?: 'outdoor' | 'print' | 'digital';
  aspectRatio: AspectRatio;
  imageUrl: string;
  promptUsed: string;
  createdAt: number;
  loading?: boolean;
  error?: string;
}

export interface BrandProject {
  id: string;
  product: ProductDetails;
  masterImage?: {
    imageUrl: string;
    promptUsed: string;
    createdAt: number;
  };
  mediums: GeneratedMediumItem[];
}

