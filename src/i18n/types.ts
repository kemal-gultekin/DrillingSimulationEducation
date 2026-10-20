export type SupportedLanguage = 'tr' | 'en';

export interface LocalizedString {
  tr: string;
  en: string;
}

export type OptionalLocalizedString = {
  tr?: string;
  en?: string;
};

/**
 * Resolves a localized text string based on current language.
 * If one language is empty or missing, it automatically falls back to the other language.
 */
export function resolveLocalized(
  value: LocalizedString | OptionalLocalizedString | string | undefined | null,
  currentLang: SupportedLanguage,
  fallback: string = ''
): string {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === 'string') {
    return value;
  }

  const trText = (value.tr || '').trim();
  const enText = (value.en || '').trim();

  if (currentLang === 'tr') {
    return trText || enText || fallback;
  } else {
    return enText || trText || fallback;
  }
}

/**
 * Resolves localized array of strings (e.g. options, safety hazards, maintenance checks)
 */
export function resolveLocalizedArray(
  value: { tr?: string[]; en?: string[] } | string[] | undefined | null,
  currentLang: SupportedLanguage
): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  const trArr = value.tr && value.tr.length > 0 ? value.tr : [];
  const enArr = value.en && value.en.length > 0 ? value.en : [];

  if (currentLang === 'tr') {
    return trArr.length > 0 ? trArr : enArr;
  } else {
    return enArr.length > 0 ? enArr : trArr;
  }
}

/**
 * Resolves localized dictionary / specs object
 */
export function resolveLocalizedDict(
  value: { tr?: Record<string, string>; en?: Record<string, string> } | Record<string, string> | undefined | null,
  currentLang: SupportedLanguage
): Record<string, string> {
  if (!value) return {};
  const hasTr = 'tr' in value && typeof (value as any).tr === 'object' && (value as any).tr !== null && !Array.isArray((value as any).tr);
  const hasEn = 'en' in value && typeof (value as any).en === 'object' && (value as any).en !== null && !Array.isArray((value as any).en);

  if (!hasTr && !hasEn) {
    return value as Record<string, string>;
  }

  const trDict: Record<string, string> = hasTr ? ((value as any).tr as Record<string, string>) : {};
  const enDict: Record<string, string> = hasEn ? ((value as any).en as Record<string, string>) : {};

  if (currentLang === 'tr') {
    return Object.keys(trDict).length > 0 ? trDict : enDict;
  } else {
    return Object.keys(enDict).length > 0 ? enDict : trDict;
  }
}
