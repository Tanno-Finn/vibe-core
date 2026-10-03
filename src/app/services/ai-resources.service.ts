/**
 * AI Resources Service
 *
 * Serves the AI learning resources of the current language from the unified
 * content bundle. Readers take `entries$` (related-refs, lesson template) or look
 * one resource up by id; the catalog page filters through CatalogService.
 *
 * @see BaseContentService for bundle loading implementation
 */

import { Injectable } from '@angular/core';
import { BaseContentService } from './base-content.service';
import { AIResource } from '../models/ai-resource.model';

@Injectable({
  providedIn: 'root',
})
export class AiResourcesService extends BaseContentService<AIResource> {
  protected readonly contentType = 'aiResources' as const;

  constructor() {
    super();
    this.initialize();
  }

  /**
   * Get resource by ID
   */
  getResourceById(id: string): AIResource | undefined {
    return this.entriesSubject.value.find((resource) => resource.id === id);
  }
}
