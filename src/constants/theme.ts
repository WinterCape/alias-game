export const COLORS = {
  // The felt table (shared)
  background: '#0D0A1A',
  backgroundMid: '#161230',
  backgroundLight: '#1E1840',

  // Parchment card (shared)
  parchment: '#F2E4C9',
  parchmentDark: '#DDD0B0',
  parchmentEdge: '#C4B48A',
  ink: '#2C1810',
  inkSoft: '#5C4033',

  // Arena accent — warm gold (torchlight, competition)
  gold: '#D4A853',
  goldBright: '#F0C75E',
  goldDim: '#8B6914',

  // Quest accent — mystic blue (moonlight, wisdom)
  quest: '#4EA8DE',
  questBright: '#7EC8F2',
  questDim: '#2B7AAD',

  // Game actions (shared)
  correct: '#2D6A4F',
  correctGlow: '#40916C',
  skip: '#9B2335',
  skipGlow: '#C63048',

  // UI (shared)
  text: '#F2E4C9',
  textSecondary: '#A89B80',
  danger: '#C63048',
  warning: '#D4A853',
  success: '#40916C',

  // Team guild colors
  teamColors: ['#D4A853', '#9B2335', '#2D6A4F', '#5E548E'],

  // Gradients
  gradientTable: ['#0D0A1A', '#161230', '#0D0A1A'] as const,
};

export const FONTS = {
  display: 'Alegreya_700Bold',
  displayBlack: 'Alegreya_900Black',
  body: 'Nunito_400Regular',
  bodyBold: 'Nunito_700Bold',
  bodyBlack: 'Nunito_900Black',
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  padding: 16,
  radius: 14,
  cardRadius: 16,
};
