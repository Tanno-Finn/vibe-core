/**
 * AI Resource Data Models and Interfaces
 *
 * This file defines the data structures for AI learning resources including
 * blogs, videos, infographics, documents, and regulatory content.
 * Supports full internationalization and categorization for educational content.
 */

// Processed resource for component consumption
export interface AIResource {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  mediaType:
    | 'blog'
    | 'video'
    | 'infographic'
    | 'document'
    | 'course'
    | 'podcast'
    | 'tool-guide'
    | 'research-paper'
    | 'tutorial'
    | 'guideline';
  topic:
    'regulation' | 'ethics' | 'technology' | 'business' | 'research' | 'education' | 'society' | 'tools' | 'career';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  language: 'de' | 'en' | 'multilingual';
  url: string;
  source: string;
  author?: string;
  publishedDate?: string;
  lastUpdated?: string;
  estimatedTime?: string;
  rating?: number;
  isFreeBehindPaywall?: boolean;
  requiresRegistration?: boolean;
  tags: string[];
  // Internal metadata for tracking
  createdAt?: string; // When added to our system
  updatedAt?: string; // When last updated in our system
}

// Filter options for the resources
export interface ResourceFilters {
  searchTerm: string;
  mediaTypes: string[];
  topics: string[];
  difficulties: string[];
  languages: string[];
  onlyFree: boolean;
  maxEstimatedTime?: number; // in minutes
  minRating?: number;
}

// Category definitions for UI display
export interface ResourceCategory {
  key: string;
  labelKey: string;
  icon: string;
  description?: string;
}

// Media type definitions with metadata
export interface MediaTypeInfo {
  key: string;
  labelKey: string;
  icon: string;
  color: string;
  description?: string;
}

// Topic definitions with metadata
export interface TopicInfo {
  key: string;
  labelKey: string;
  icon: string;
  color: string;
  description?: string;
}

// Predefined categories for consistent UI
export const MEDIA_TYPES: MediaTypeInfo[] = [
  { key: 'blog', labelKey: 'aiResources.mediaType.blog', icon: 'pi pi-file-edit', color: 'primary' },
  { key: 'video', labelKey: 'aiResources.mediaType.video', icon: 'pi pi-video', color: 'success' },
  { key: 'infographic', labelKey: 'aiResources.mediaType.infographic', icon: 'pi pi-chart-bar', color: 'info' },
  { key: 'document', labelKey: 'aiResources.mediaType.document', icon: 'pi pi-file', color: 'secondary' },
  { key: 'course', labelKey: 'aiResources.mediaType.course', icon: 'pi pi-graduation-cap', color: 'warning' },
  { key: 'podcast', labelKey: 'aiResources.mediaType.podcast', icon: 'pi pi-microphone', color: 'help' },
  { key: 'tool-guide', labelKey: 'aiResources.mediaType.toolGuide', icon: 'pi pi-wrench', color: 'primary' },
  { key: 'research-paper', labelKey: 'aiResources.mediaType.researchPaper', icon: 'pi pi-book', color: 'secondary' },
  { key: 'tutorial', labelKey: 'aiResources.mediaType.tutorial', icon: 'pi pi-play-circle', color: 'warning' },
  { key: 'guideline', labelKey: 'aiResources.mediaType.guideline', icon: 'pi pi-compass', color: 'info' },
];

export const TOPICS: TopicInfo[] = [
  { key: 'regulation', labelKey: 'aiResources.topic.regulation', icon: 'pi pi-shield', color: 'danger' },
  { key: 'ethics', labelKey: 'aiResources.topic.ethics', icon: 'pi pi-heart', color: 'info' },
  { key: 'technology', labelKey: 'aiResources.topic.technology', icon: 'pi pi-cog', color: 'primary' },
  { key: 'business', labelKey: 'aiResources.topic.business', icon: 'pi pi-briefcase', color: 'success' },
  { key: 'research', labelKey: 'aiResources.topic.research', icon: 'pi pi-search', color: 'secondary' },
  { key: 'education', labelKey: 'aiResources.topic.education', icon: 'pi pi-graduation-cap', color: 'warning' },
  { key: 'society', labelKey: 'aiResources.topic.society', icon: 'pi pi-users', color: 'help' },
  { key: 'tools', labelKey: 'aiResources.topic.tools', icon: 'pi pi-wrench', color: 'primary' },
  { key: 'career', labelKey: 'aiResources.topic.career', icon: 'pi pi-star', color: 'info' },
];

export const DIFFICULTIES: ResourceCategory[] = [
  { key: 'beginner', labelKey: 'aiResources.difficulty.beginner', icon: 'pi pi-circle' },
  { key: 'intermediate', labelKey: 'aiResources.difficulty.intermediate', icon: 'pi pi-circle-fill' },
  { key: 'expert', labelKey: 'aiResources.difficulty.expert', icon: 'pi pi-star-fill' },
];

export const LANGUAGES: ResourceCategory[] = [
  { key: 'de', labelKey: 'aiResources.language.german', icon: 'pi pi-flag' },
  { key: 'en', labelKey: 'aiResources.language.english', icon: 'pi pi-flag' },
  { key: 'multilingual', labelKey: 'aiResources.language.multilingual', icon: 'pi pi-globe' },
];
