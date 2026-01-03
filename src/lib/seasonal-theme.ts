/**
 * Seasonal Theme System
 *
 * Provides season-aware styling that shifts throughout the year,
 * creating a living interface that flows with the garden's rhythm.
 */

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export interface SeasonalTheme {
  season: Season
  // Background classes
  bgPage: string
  bgCard: string
  bgAccent: string
  // Text classes
  textAccent: string
  textMuted: string
  // Border classes
  borderAccent: string
  // Icon/badge accent
  badgeClass: string
  // Decorative element colors
  decorPrimary: string
  decorSecondary: string
  // Background image from Unsplash
  bgImage: string
  bgImageCredit: { name: string; url: string }
}

/**
 * Get the current season based on month
 */
export function getCurrentSeason(month?: number): Season {
  const m = month ?? new Date().getMonth()

  if (m >= 11 || m <= 1) return 'winter'   // Dec, Jan, Feb
  if (m >= 2 && m <= 4) return 'spring'    // Mar, Apr, May
  if (m >= 5 && m <= 7) return 'summer'    // Jun, Jul, Aug
  return 'autumn'                           // Sep, Oct, Nov
}

/**
 * Get theme configuration for a season
 */
export function getSeasonalTheme(season: Season): SeasonalTheme {
  const themes: Record<Season, SeasonalTheme> = {
    winter: {
      season: 'winter',
      bgPage: 'zen-bg-winter',
      bgCard: 'bg-white',
      bgAccent: 'bg-zen-ume-50',
      textAccent: 'text-zen-ume-700',
      textMuted: 'text-zen-stone-500',
      borderAccent: 'border-zen-ume-200',
      badgeClass: 'bg-zen-ume-100 text-zen-ume-700',
      decorPrimary: '#bc728a',  // ume-500
      decorSecondary: '#e3bfcb', // ume-300
      // Frost on kale - calm winter allotment scene
      bgImage: 'https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?w=1920&q=80&auto=format&fit=crop',
      bgImageCredit: { name: 'Markus Spiske', url: 'https://unsplash.com/@markusspiske' },
    },
    spring: {
      season: 'spring',
      bgPage: 'zen-bg-spring',
      bgCard: 'bg-white',
      bgAccent: 'bg-zen-sakura-50',
      textAccent: 'text-zen-sakura-700',
      textMuted: 'text-zen-stone-500',
      borderAccent: 'border-zen-sakura-200',
      badgeClass: 'bg-zen-sakura-100 text-zen-sakura-700',
      decorPrimary: '#e07294',  // sakura-500
      decorSecondary: '#f5c1d1', // sakura-300
      // Cherry blossoms - delicate spring awakening
      bgImage: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80&auto=format&fit=crop',
      bgImageCredit: { name: 'AJ', url: 'https://unsplash.com/@ajcolores' },
    },
    summer: {
      season: 'summer',
      bgPage: 'zen-bg-summer',
      bgCard: 'bg-white',
      bgAccent: 'bg-zen-moss-50',
      textAccent: 'text-zen-moss-700',
      textMuted: 'text-zen-stone-500',
      borderAccent: 'border-zen-moss-200',
      badgeClass: 'bg-zen-moss-100 text-zen-moss-700',
      decorPrimary: '#768a5e',  // moss-500
      decorSecondary: '#b5c2a4', // moss-300
      // Lush vegetable garden - abundant summer growth
      bgImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80&auto=format&fit=crop',
      bgImageCredit: { name: 'Markus Spiske', url: 'https://unsplash.com/@markusspiske' },
    },
    autumn: {
      season: 'autumn',
      bgPage: 'zen-bg-autumn',
      bgCard: 'bg-white',
      bgAccent: 'bg-zen-kitsune-50',
      textAccent: 'text-zen-kitsune-700',
      textMuted: 'text-zen-stone-500',
      borderAccent: 'border-zen-kitsune-200',
      badgeClass: 'bg-zen-kitsune-100 text-zen-kitsune-700',
      decorPrimary: '#d4805a',  // kitsune-500
      decorSecondary: '#ecc2a4', // kitsune-300
      // Autumn harvest vegetables - warm earth tones
      bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80&auto=format&fit=crop',
      bgImageCredit: { name: 'Ella Olsson', url: 'https://unsplash.com/@ellaolsson' },
    },
  }

  return themes[season]
}

/**
 * Get the current theme based on today's date
 */
export function getCurrentTheme(): SeasonalTheme {
  return getSeasonalTheme(getCurrentSeason())
}

/**
 * Seasonal emoji that complements the SEASONAL_PHASES
 * These are more decorative/ambient
 */
export const SEASONAL_DECORATIONS: Record<Season, { motif: string; elements: string[] }> = {
  winter: {
    motif: 'Stillness',
    elements: ['Bare branches', 'Frost', 'Planning seeds'],
  },
  spring: {
    motif: 'Awakening',
    elements: ['Cherry blossoms', 'New growth', 'Birdsong'],
  },
  summer: {
    motif: 'Abundance',
    elements: ['Full foliage', 'Warm earth', 'Long days'],
  },
  autumn: {
    motif: 'Gratitude',
    elements: ['Falling leaves', 'Harvest moon', 'Rich soil'],
  },
}

/**
 * Japanese season names for display
 */
export const SEASON_NAMES: Record<Season, { japanese: string; romaji: string; english: string }> = {
  winter: { japanese: '冬', romaji: 'Fuyu', english: 'Winter' },
  spring: { japanese: '春', romaji: 'Haru', english: 'Spring' },
  summer: { japanese: '夏', romaji: 'Natsu', english: 'Summer' },
  autumn: { japanese: '秋', romaji: 'Aki', english: 'Autumn' },
}
