import { defineRouting } from 'next-intl/routing';

// fr-first by default (see spec §19). Arabic renders RTL; darija uses Latin
// script and stays LTR. Flip `defaultLocale` to change the primary language.
export const routing = defineRouting({
  locales: ['fr', 'ar', 'darija'],
  defaultLocale: 'fr'
});

export type Locale = (typeof routing.locales)[number];

/** Locales that must render right-to-left. */
export const rtlLocales: Locale[] = ['ar'];

export function dirFor(locale: string): 'rtl' | 'ltr' {
  return rtlLocales.includes(locale as Locale) ? 'rtl' : 'ltr';
}
