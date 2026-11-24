'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { CategoryIcon } from '@/components/ui/category-icon';
import { t } from '@/lib/i18n';

/**
 * Floating Glass Capsule Dock:
 * - Positioned fixed at bottom center with safe margins.
 * - Frosted glass with champagne border and high optical blur.
 * - 3 clear, distinct actions:
 *   1. Inicio (/dashboard)
 *   2. Nuevo Registro (+) (/nuevo)
 *   3. Exportar CSV (/api/v1/export)
 */
interface PhoneDockProps {
  /** Movements waiting for a category. Zero hides the badge. */
  readonly reviewCount?: number;
}

export function PhoneDock({ reviewCount = 0 }: PhoneDockProps): React.ReactElement | null {
  const pathname = usePathname();

  // Fullscreen flows like /captura and /bienvenida suppress the floating dock completely
  if (pathname === '/captura' || pathname === '/bienvenida') {
    return null;
  }

  return (
    <nav className="phone-dock" aria-label={t('nav_main')}>
      {/* 1. Dashboard / Resumen */}
      <Link
        href="/dashboard"
        className={`phone-dock-item${
          pathname === '/dashboard' ? ' phone-dock-item--active' : ''
        }`}
        aria-label={t('nav_home')}
        aria-current={pathname === '/dashboard' ? 'page' : undefined}
      >
        <CategoryIcon name="LayoutGrid" size={20} />
        <span className="phone-dock-label">{t('nav_home')}</span>
      </Link>

      {/* 2. El mes: totales, distribución por categoría e histórico */}
      <Link
        href="/mes"
        className={`phone-dock-item${pathname === '/mes' ? ' phone-dock-item--active' : ''}`}
        aria-label={t('nav_month')}
        aria-current={pathname === '/mes' ? 'page' : undefined}
      >
        <CategoryIcon name="PieChart" size={19} />
        <span className="phone-dock-label">{t('nav_month_short')}</span>
      </Link>

      {/* 3. Nuevo Registro (+) */}
      <Link
        href="/nuevo"
        className={`phone-dock-item phone-dock-item--highlight${
          pathname === '/nuevo' ? ' phone-dock-item--active' : ''
        }`}
        aria-label={t('nav_new')}
        aria-current={pathname === '/nuevo' ? 'page' : undefined}
      >
        <CategoryIcon name="Plus" size={22} />
      </Link>

      {/* 4. Por revisar. It used to be reachable only through a callout that
          comes and goes, and no icon was lit while you were there. A fixed
          place with a count is how a queue gets emptied. */}
      <Link
        href="/revisar"
        className={`phone-dock-item${
          pathname === '/revisar' ? ' phone-dock-item--active' : ''
        }`}
        aria-label={
          reviewCount > 0
            ? `${t('nav_review')}: ${reviewCount} ${t('dashboard_pending_review')}`
            : t('nav_review')
        }
        aria-current={pathname === '/revisar' ? 'page' : undefined}
      >
        <span className="phone-dock-icon-wrap">
          <CategoryIcon name="Tag" size={19} />
          {reviewCount > 0 && (
            <span className="phone-dock-badge" aria-hidden="true">
              {reviewCount > 99 ? '99+' : reviewCount}
            </span>
          )}
        </span>
        <span className="phone-dock-label">{t('nav_review')}</span>
      </Link>

      {/* 5. Perfil */}
      <Link
        href="/perfil"
        className={`phone-dock-item${
          pathname === '/perfil' ? ' phone-dock-item--active' : ''
        }`}
        aria-label={t('nav_profile')}
        aria-current={pathname === '/perfil' ? 'page' : undefined}
      >
        <CategoryIcon name="Sliders" size={19} />
        <span className="phone-dock-label">{t('nav_profile')}</span>
      </Link>
    </nav>
  );
}

