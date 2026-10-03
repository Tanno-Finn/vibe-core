import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ContentHubTemplateComponent, ContentItem } from '../components/shared/content-hub-template.component';
import { NotificationEntry } from '../models/notification.model';
import { NewsComponent } from '../pages/news/news.component';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';

/**
 * The page-local searches outside the glossary fold both sides with
 * foldForSearch too: Easy German writes "Sprach·modell", a visitor types
 * "Sprachmodell" or "Sprach-Modell". Only the filter logic is under test, so
 * the templates are emptied and nothing renders.
 */
const COPY: Record<string, string> = {
  'n.model.title': 'Neues Sprach·modell',
  'n.model.desc': 'Ein Modell für alle.',
  'n.review.title': 'Code-Review Werkzeug',
  'n.review.desc': 'Prüft deinen Code.',
  'c.model.title': 'Was ist ein Sprach·modell?',
  'c.model.desc': 'Eine Einführung.',
  'c.review.title': 'Code-Review lernen',
  'c.review.desc': 'Mit Open·Source Beispielen.',
};
const translation = { translate: (key: string) => COPY[key] ?? key, currentLanguage: 'de-easy' };

const QUERIES: [string, string][] = [
  ['sprachmodell', 'model'],
  ['Sprach-Modell', 'model'],
  ['sprach·modell', 'model'],
  ['codereview', 'review'],
  ['Code·Review', 'review'],
];

describe('NewsComponent search across compound joiners', () => {
  const entry = (id: string): NotificationEntry =>
    ({
      id,
      publishedAt: '2026-01-01T00:00:00Z',
      type: 'feature',
      titleKey: `n.${id}.title`,
      descriptionKey: `n.${id}.desc`,
    }) as NotificationEntry;

  it.each(QUERIES)('finds %s', (query, expected) => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslationService, useValue: translation },
        { provide: NotificationService, useValue: { allNotifications: signal([entry('model'), entry('review')]) } },
      ],
    });
    TestBed.overrideComponent(NewsComponent, { set: { template: '', imports: [] } });
    const news = TestBed.createComponent(NewsComponent).componentInstance;
    news.searchQuery.set(query);
    expect(news.filteredNotifications().map((n) => n.id)).toEqual([expected]);
  });
});

describe('ContentHubTemplateComponent search across compound joiners', () => {
  const item = (id: string): ContentItem =>
    ({ id, path: `/${id}`, titleKey: `c.${id}.title`, descriptionKey: `c.${id}.desc`, category: 'x' }) as ContentItem;

  it.each([...QUERIES, ['opensource', 'review'] as [string, string]])('finds %s', (query, expected) => {
    TestBed.configureTestingModule({ providers: [{ provide: TranslationService, useValue: translation }] });
    TestBed.overrideComponent(ContentHubTemplateComponent, { set: { template: '', imports: [] } });
    const fixture = TestBed.createComponent(ContentHubTemplateComponent);
    fixture.componentRef.setInput('items', [item('model'), item('review')]);
    fixture.componentInstance.searchTerm.set(query);
    expect(fixture.componentInstance.filteredItems().map((i) => i.id)).toEqual([expected]);
  });
});
