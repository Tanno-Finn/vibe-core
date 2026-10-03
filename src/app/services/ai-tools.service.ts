/**
 * AI Tools Service
 *
 * Serves the AI tools of the current language from the unified content bundle.
 * Readers take `entries$` (related-refs, lesson template) or look one tool up by
 * id; the catalog page filters through CatalogService.
 *
 * @see BaseContentService for bundle loading implementation
 */

import { Injectable } from '@angular/core';
import { BaseContentService } from './base-content.service';

/**
 * AI Tool entry for component consumption
 */
export interface AITool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'text-ai' | 'image-generation' | 'coding' | 'audio-video' | 'productivity' | 'research' | 'design';
  pricing: 'kostenlos' | 'freemium' | 'premium' | 'enterprise' | 'free';
  deployment: 'cloud' | 'on-premise' | 'hybrid';
  difficulty: 'anfänger' | 'fortgeschritten' | 'experte' | 'beginner' | 'intermediate' | 'expert';
  privacy?:
    'dsgvo-konform' | 'eu-server' | 'ende-zu-ende' | 'gdpr-compliant' | 'eu-servers' | 'end-to-end' | 'standard';
  integration?: 'api' | 'webhook' | 'plugin' | 'standalone' | 'discord';
  support?: 'community' | 'email' | 'chat' | 'enterprise' | 'dokumentation' | 'documentation';
  language?: 'deutsch' | 'englisch' | 'mehrsprachig' | 'german' | 'english' | 'multilingual';
  performance?: 'schnell' | 'mittel' | 'langsam' | 'fast' | 'medium' | 'slow';
  targetAudience?:
    | 'einsteiger'
    | 'profis'
    | 'unternehmen'
    | 'bildung'
    | 'beginners'
    | 'professionals'
    | 'enterprise'
    | 'education'
    | 'all';
  platform?: 'web' | 'desktop' | 'mobile' | 'alle' | 'all';
  features?: string[];
  useCases?: string[];
  url: string;
  rating: number;
  tags: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: string[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiToolsService extends BaseContentService<AITool> {
  protected readonly contentType = 'aiTools' as const;

  constructor() {
    super();
    this.initialize();
  }

  /**
   * Get tool by ID
   */
  getToolById(id: string): AITool | undefined {
    return this.entriesSubject.value.find((tool) => tool.id === id);
  }
}
