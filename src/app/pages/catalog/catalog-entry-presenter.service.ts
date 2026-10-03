/**
 * CatalogEntryPresenter — how one catalog entry is labeled, colored and
 * acted on, shared by every piece of the catalog page (card grid, compare
 * view, details drawer).
 *
 * Moved verbatim out of CatalogComponent when the page was split; the maps
 * below are the same, only their owner changed. Labels go through
 * TranslationService, whose translate() reads its version signal, so an
 * OnPush template that calls these re-renders on a language switch.
 */
import { Injectable, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { ShareService } from '../../services/share.service';
import { CardChip } from '../../components/ui/generic-card.component';
import { CatalogEntry, CatalogToolEntry, CatalogResourceEntry, getDisplayName } from '../../models/catalog.model';
import { MEDIA_TYPES, TOPICS } from '../../models/ai-resource.model';
import { openExternal } from '../../utils/open-external';

/** One line of card meta (icon, label, value). */
export interface CatalogCardMeta {
  icon?: string;
  label?: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogEntryPresenter {
  private translationService = inject(TranslationService);
  private shareService = inject(ShareService);

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // --- Entry actions ---

  openEntry(url: string): void {
    // Scheme-checked: catalog URLs come from content JSON, and window.open
    // is not covered by Angular's URL sanitizer. See utils/open-external.
    openExternal(url);
  }

  async shareEntry(entry: CatalogEntry): Promise<void> {
    const displayName = getDisplayName(entry);
    const shareData = this.shareService.createShareData(displayName, entry.description, entry.url);
    await this.shareService.share(shareData);
  }

  trackByEntry = (_index: number, entry: CatalogEntry) => entry.id;

  getEntryDisplayName(entry: CatalogEntry): string {
    return getDisplayName(entry);
  }

  asToolEntry(entry: CatalogEntry): CatalogToolEntry {
    return entry as CatalogToolEntry;
  }

  asResourceEntry(entry: CatalogEntry): CatalogResourceEntry {
    return entry as CatalogResourceEntry;
  }

  getEntryIcon(entry: CatalogEntry): string {
    if (entry.entryType === 'tool') {
      return this.getToolIcon((entry as CatalogToolEntry).category);
    } else {
      return this.getMediaTypeIcon((entry as CatalogResourceEntry).mediaType);
    }
  }

  getEntryIconColor(entry: CatalogEntry): string {
    if (entry.entryType === 'tool') {
      return this.getToolCategoryColor((entry as CatalogToolEntry).category);
    } else {
      return this.getMediaTypeColor((entry as CatalogResourceEntry).mediaType);
    }
  }

  getEntryChips(entry: CatalogEntry): CardChip[] {
    const typeChip: CardChip =
      entry.entryType === 'tool'
        ? {
            label: this.translate('catalog.entryType.tool'),
            icon: 'pi-wrench',
            style: { color: 'var(--blue-500)', fontWeight: '600' },
          }
        : {
            label: this.translate('catalog.entryType.resource'),
            icon: 'pi-book',
            style: { color: 'var(--green-500)', fontWeight: '600' },
          };

    if (entry.entryType === 'tool') {
      const tool = entry as CatalogToolEntry;
      return [
        typeChip,
        {
          label: this.getPricingLabel(tool.pricing),
          icon: this.getPricingIcon(tool.pricing),
          style: { color: this.getPricingColor(tool.pricing) },
        },
        {
          label: this.getDeploymentLabel(tool.deployment),
          icon: this.getDeploymentIcon(tool.deployment),
          style: { color: this.getDeploymentColor(tool.deployment) },
        },
        {
          label: this.getDifficultyLabel(tool.difficulty),
          icon: this.getDifficultyIcon(tool.difficulty),
          style: { color: this.getDifficultyColorSimple(tool.difficulty) },
        },
      ];
    } else {
      const resource = entry as CatalogResourceEntry;
      return [
        typeChip,
        {
          label: this.translate('aiResources.mediaType.' + resource.mediaType),
          icon: this.getMediaTypeIcon(resource.mediaType),
          style: { color: this.getMediaTypeColor(resource.mediaType) },
        },
        {
          label: this.translate('aiResources.topic.' + resource.topic),
          icon: this.getTopicIcon(resource.topic),
          style: { color: this.getTopicColor(resource.topic) },
        },
        {
          label: this.translate('aiResources.difficulty.' + resource.difficulty),
          icon: this.getResourceDifficultyIcon(resource.difficulty),
          style: { color: this.getResourceDifficultyColor(resource.difficulty) },
        },
      ];
    }
  }

  getEntryMeta(entry: CatalogEntry): { icon?: string; label?: string; value: string }[] {
    const meta: { icon?: string; label?: string; value: string }[] = [];

    if (entry.entryType === 'tool') {
      const tool = entry as CatalogToolEntry;
      if (tool.category) {
        const categoryTranslationKey = this.getCategoryTranslationKey(tool.category);
        meta.push({
          icon: 'pi-tag',
          label: this.translate('catalog.details.category'),
          value: this.translate(`aiTools.categories.${categoryTranslationKey}`),
        });
      }
      if (tool.features && tool.features.length > 0) {
        meta.push({
          icon: 'pi-star',
          label: this.translate('catalog.details.features'),
          value: `${tool.features.length} ${this.translate('catalog.details.features')}`,
        });
      }
    } else {
      const resource = entry as CatalogResourceEntry;
      if (resource.source) {
        meta.push({
          icon: 'pi-globe',
          label: this.translate('catalog.details.source'),
          value: resource.source,
        });
      }
      if (resource.author) {
        meta.push({
          icon: 'pi-user',
          label: this.translate('catalog.details.author'),
          value: resource.author,
        });
      }
      if (resource.estimatedTime) {
        meta.push({
          icon: 'pi-clock',
          label: this.translate('catalog.details.estimatedTime'),
          value: resource.estimatedTime,
        });
      }
    }

    return meta;
  }

  getToolIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'text-ai': 'pi-comment',
      'image-generation': 'pi-image',
      coding: 'pi-code',
      'audio-video': 'pi-video',
      productivity: 'pi-briefcase',
      research: 'pi-search',
      design: 'pi-palette',
    };
    return icons[category] || 'pi-cog';
  }

  getToolCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'text-ai': '#10B981',
      'image-generation': '#8B5CF6',
      coding: '#3B82F6',
      'audio-video': '#EF4444',
      productivity: '#F59E0B',
      research: '#6B7280',
      design: '#EC4899',
    };
    return colors[category] || 'var(--primary-color)';
  }

  /** Daten liefern engl. pricing-Keys ('free'), Maps kennen 'kostenlos' —
   *  auf die kanonischen Map-Keys normalisieren (case-insensitiv). */
  private canonicalPricing(pricing: string): string {
    const p = (pricing || '').toLowerCase();
    return p === 'free' ? 'kostenlos' : p;
  }

  /** difficulty kommt lokalisiert/kapitalisiert aus den Bundles ('Anfänger',
   *  'Beginner') — Maps nutzen lowercase-deutsche Keys. */
  private canonicalDifficulty(difficulty: string): string {
    const d = (difficulty || '').toLowerCase();
    const alias: { [key: string]: string } = {
      beginner: 'anfänger',
      advanced: 'fortgeschritten',
      expert: 'experte',
    };
    return alias[d] || d;
  }

  getPricingLabel(pricing: string): string {
    const labels: { [key: string]: string } = {
      kostenlos: this.translate('aiTools.pricing.free'),
      freemium: this.translate('aiTools.pricing.freemium'),
      premium: this.translate('aiTools.pricing.premium'),
      enterprise: this.translate('aiTools.pricing.enterprise'),
    };
    return labels[this.canonicalPricing(pricing)] || pricing;
  }

  getPricingChipStyle(pricing: string): Record<string, string> {
    const styles: { [key: string]: Record<string, string> } = {
      kostenlos: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(34, 197, 94, 0.3)',
      },
      freemium: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(59, 130, 246, 0.3)',
      },
      premium: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(245, 158, 11, 0.3)',
      },
      enterprise: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(139, 92, 246, 0.3)',
      },
    };

    return {
      ...(styles[this.canonicalPricing(pricing)] || {
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(107, 114, 128, 0.3)',
      }),
      'font-size': '0.75rem',
      border: 'none',
    };
  }

  getPricingIcon(pricing: string): string {
    const icons: { [key: string]: string } = {
      kostenlos: 'pi-check-circle',
      freemium: 'pi-dollar',
      premium: 'pi-credit-card',
      enterprise: 'pi-building',
    };
    return icons[this.canonicalPricing(pricing)] || 'pi-dollar';
  }

  getPricingColor(pricing: string): string {
    const colors: { [key: string]: string } = {
      kostenlos: '#22c55e',
      free: '#22c55e',
      freemium: '#3b82f6',
      premium: '#f59e0b',
      enterprise: '#8b5cf6',
    };
    return colors[this.canonicalPricing(pricing)] || '#a3a3a3';
  }

  getDeploymentLabel(deployment: string): string {
    const labels: { [key: string]: string } = {
      cloud: this.translate('aiTools.deployment.cloud'),
      'on-premise': this.translate('aiTools.deployment.onPremise'),
      hybrid: this.translate('aiTools.deployment.hybrid'),
    };
    return labels[deployment] || deployment;
  }

  getDeploymentChipStyle(deployment: string): Record<string, string> {
    const styles: { [key: string]: Record<string, string> } = {
      cloud: {
        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(6, 182, 212, 0.3)',
      },
      'on-premise': {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(16, 185, 129, 0.3)',
      },
      hybrid: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(139, 92, 246, 0.3)',
      },
    };

    return {
      ...(styles[deployment] || {
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(107, 114, 128, 0.3)',
      }),
      'font-size': '0.75rem',
      border: 'none',
    };
  }

  getDeploymentIcon(deployment: string): string {
    const icons: { [key: string]: string } = {
      cloud: 'pi-cloud',
      'on-premise': 'pi-server',
      hybrid: 'pi-share-alt',
    };
    return icons[deployment] || 'pi-desktop';
  }

  getDeploymentColor(deployment: string): string {
    const colors: { [key: string]: string } = {
      cloud: '#06b6d4',
      'on-premise': '#10b981',
      hybrid: '#8b5cf6',
    };
    return colors[deployment] || '#a3a3a3';
  }

  getDifficultyLabel(difficulty: string): string {
    const labels: { [key: string]: string } = {
      anfänger: this.translate('aiTools.difficulty.beginner'),
      fortgeschritten: this.translate('aiTools.difficulty.advanced'),
      experte: this.translate('aiTools.difficulty.expert'),
    };
    return labels[this.canonicalDifficulty(difficulty)] || difficulty;
  }

  getDifficultyChipStyle(difficulty: string): Record<string, string> {
    const styles: { [key: string]: Record<string, string> } = {
      anfänger: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(34, 197, 94, 0.3)',
      },
      fortgeschritten: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(245, 158, 11, 0.3)',
      },
      experte: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(239, 68, 68, 0.3)',
      },
    };

    return {
      ...(styles[difficulty] || {
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        color: 'white',
        'font-weight': '600',
        'box-shadow': '0 2px 4px rgba(107, 114, 128, 0.3)',
      }),
      'font-size': '0.75rem',
      border: 'none',
    };
  }

  getDifficultyIcon(difficulty: string): string {
    const icons: { [key: string]: string } = {
      anfänger: 'pi-star',
      fortgeschritten: 'pi-star-fill',
      experte: 'pi-crown',
    };
    return icons[difficulty] || 'pi-bookmark';
  }

  getDifficultyColorSimple(difficulty: string): string {
    const colors: { [key: string]: string } = {
      anfänger: '#22c55e',
      beginner: '#22c55e',
      fortgeschritten: '#f59e0b',
      advanced: '#f59e0b',
      experte: '#ef4444',
      expert: '#ef4444',
    };
    return colors[difficulty] || '#a3a3a3';
  }

  getCategoryTranslationKey(category: string): string {
    const mapping: { [key: string]: string } = {
      'text-ai': 'textAi',
      'image-generation': 'imageGeneration',
      coding: 'coding',
      'audio-video': 'audioVideo',
      productivity: 'productivity',
      research: 'research',
      design: 'design',
    };
    return mapping[category] || category;
  }

  getMediaTypeIcon(mediaType: string): string {
    return MEDIA_TYPES.find((mt) => mt.key === mediaType)?.icon || 'pi pi-file';
  }

  getMediaTypeColor(mediaType: string): string {
    const colors: { [key: string]: string } = {
      blog: '#10B981',
      video: '#EF4444',
      infographic: '#F59E0B',
      document: '#DC2626',
      course: '#7C3AED',
      podcast: '#059669',
      'tool-guide': '#0891B2',
      'research-paper': '#1D4ED8',
      tutorial: '#C2410C',
      guideline: '#7C2D12',
    };
    return colors[mediaType] || 'var(--primary-color)';
  }

  getTopicIcon(topic: string): string {
    return TOPICS.find((t) => t.key === topic)?.icon || 'pi pi-tag';
  }

  getTopicColor(topic: string): string {
    const colors: { [key: string]: string } = {
      regulation: '#DC2626',
      ethics: '#3B82F6',
      technology: '#6B7280',
      business: '#10B981',
      research: '#8B5CF6',
      education: '#F59E0B',
      society: '#EC4899',
      tools: '#06B6D4',
      career: '#84CC16',
    };
    return colors[topic] || 'var(--primary-color)';
  }

  getResourceDifficultyIcon(difficulty: string): string {
    const icons: { [key: string]: string } = {
      beginner: 'pi-star',
      intermediate: 'pi-star-fill',
      expert: 'pi-crown',
    };
    return icons[difficulty] || 'pi-bookmark';
  }

  getResourceDifficultyColor(difficulty: string): string {
    const colors: { [key: string]: string } = {
      beginner: '#10B981',
      intermediate: '#F59E0B',
      expert: '#DC2626',
    };
    return colors[difficulty] || 'var(--primary-color)';
  }

  getEnhancedTagStyle(): Record<string, string> {
    return {
      background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%)',
      color: 'white',
      border: 'none',
      'font-size': '0.8rem',
      'font-weight': '500',
      'box-shadow': '0 2px 4px rgba(0,0,0,0.1)',
    };
  }

  getEnhancedAlternativeStyle(): Record<string, string> {
    return this.getEnhancedTagStyle();
  }
}
