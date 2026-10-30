'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';

import { setLocationEnabledAction } from '@/app/actions/location';
import { CategoryIcon } from '@/components/ui/category-icon';
import {
  requestNotificationPermission,
  sendWelcomeNotification,
} from '@/lib/notifications';

// Keeps the old name (Reasonny) on purpose: renaming it would wipe what is
// already saved on users' phones. docs/PILO.md §8.3.
const PERMISSIONS_STORAGE_KEY = 'reasonny_permissions_prompted_v1';

export function AppPermissionsPrompt(): React.ReactElement | null {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Not over onboarding: it is the first screen a new user sees, and two
    // sheets at once ask for two things before either is understood. The
    // layout survives the move to /dashboard, so the effect has to run again
    // on the new path rather than once on mount.
    if (pathname === '/bienvenida' || pathname?.startsWith('/preview')) return;
    try {
      const alreadyPrompted = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
      if (!alreadyPrompted) {
        // Subtle micro-delay so the dashboard finishes rendering smoothly first
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may fail in strict privacy modes; fail gracefully
    }
  }, [pathname]);

  function markDismissed(): void {
    try {
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsOpen(false);
  }

  function handleEnableAll(): void {
    startTransition(async () => {
      // 1. Request notification permission
      const notifStatus = await requestNotificationPermission();
      if (notifStatus === 'granted') {
        void sendWelcomeNotification();
      }

      // 2. Request geolocation permission & sync with profile
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            void setLocationEnabledAction(true);
          },
          () => {
            // Permission denied or timeout: do not block flow
          },
          { enableHighAccuracy: true, timeout: 8000 },
        );
      }

      markDismissed();
    });
  }

  if (!isOpen) return null;

  return (
    <div
      className="perm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="perm-dialog-title"
    >
      <div className="perm-card">
        {/* Brand visual header */}
        <div className="perm-header">
          <div className="perm-brand-mark" aria-hidden="true">
            <Image className="perm-brand-img" src="/icons/icon-192.png" alt="" width={54} height={54} />
          </div>
          <h2 id="perm-dialog-title" className="perm-title">
            Activa tu experiencia Pilo
          </h2>
          <p className="perm-subtitle">
            Notificaciones en tiempo real y ubicación inteligente para registrar tus
            finanzas sin esfuerzo.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="perm-features">
          <div className="perm-feature-row">
            <div className="perm-feature-icon" aria-hidden="true">
              <CategoryIcon name="Bell" size={18} />
            </div>
            <div className="perm-feature-content">
              <strong className="perm-feature-title">Notificaciones instantáneas</strong>
              <p className="perm-feature-desc">
                Avisos cada vez que registres un gasto, alertas para categorizar
                compras y recordatorios de presupuesto.
              </p>
            </div>
          </div>

          <div className="perm-feature-row">
            <div className="perm-feature-icon" aria-hidden="true">
              <CategoryIcon name="MapPin" size={18} />
            </div>
            <div className="perm-feature-content">
              <strong className="perm-feature-title">Ubicación inteligente</strong>
              <p className="perm-feature-desc">
                Asocia comercios cercanos a tus compras para autocompletar categorías y
                reconocer lugares automáticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="perm-actions">
          <button
            type="button"
            className="perm-btn-primary"
            onClick={handleEnableAll}
            disabled={isPending}
          >
            {isPending ? 'Activando...' : 'Activar Notificaciones y Ubicación'}
          </button>
          <button
            type="button"
            className="perm-btn-secondary"
            onClick={markDismissed}
            disabled={isPending}
          >
            Quizás más tarde
          </button>
        </div>
      </div>
    </div>
  );
}
