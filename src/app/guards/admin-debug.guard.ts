/**
 * Dev-Only Route Guard
 *
 * Blocks development-only routes (e.g. /dev/theme-tokens) in production.
 * In dev mode the routes are accessible; in effective production they
 * redirect to home.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DevModeService } from '../services/dev-mode.service';

export const adminDebugGuard: CanActivateFn = () => {
  const devModeService = inject(DevModeService);
  const router = inject(Router);

  if (devModeService.isEffectivelyProd()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
