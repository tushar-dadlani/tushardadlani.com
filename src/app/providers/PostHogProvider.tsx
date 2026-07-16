'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';

// Temporary: re-enabled to understand early drop-off in the readiness quiz.
// Safe to remove (provider, layout wrapper, and quiz capture calls) once the
// funnel is understood — see the "readiness_" events in readiness/page.tsx.
// `defaults` turns on automatic (SPA-aware) pageview capture, so no manual
// pageview component is needed. Guarded so it no-ops if the key is unset.
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    defaults: '2026-05-30',
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={posthog}>{children}</Provider>;
}
