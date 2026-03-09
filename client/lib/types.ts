// lib/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// Type definitions for services, settings, and other shared data structures
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Service item from the database
 */
export interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  short_desc: string;
  content: string;
  icon?: string;
  image?: string;
  sort_order: number;
  status: 'published' | 'draft';
  meta_title?: string;
  meta_description?: string;
}

/**
 * Service block structure for the ServiceBlocks component
 */
export interface ServiceBlock {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  highlights: ServiceHighlight[];
  color: string;
}

/**
 * Service highlight item within a service block
 */
export interface ServiceHighlight {
  label: string;
  detail: string;
}

/**
 * Site settings/configuration from database
 */
export interface SiteSettings {
  setting_key: string;
  setting_value: string;
  data_type?: string;
}

/**
 * Media file metadata
 */
export interface MediaItem {
  media_key: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  media_type: 'logo' | 'favicon' | 'social_image';
}