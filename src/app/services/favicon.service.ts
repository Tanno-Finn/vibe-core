/**
 * Favicon Service
 * Static favicon - no longer changes based on achievements
 * The app favicon (favicon.svg) is always used
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FaviconService {
  constructor() {
    // Static favicon - no dynamic switching
    // The favicon.svg is set in index.html and never changes
  }
}
