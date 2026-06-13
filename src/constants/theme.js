// Paleta de cores moderna e clean
export const COLORS = {
  // Primárias
  primary: '#FF6F61',       // Coral vibrante
  primaryDark: '#E85C50',
  primaryLight: '#FF8A75',
  primarySoft: '#FFEAE6',

  // Acentuação
  accent: '#FFD166',        // Amarelo suave
  accentDark: '#E6B955',
  accentLight: '#FFE699',

  // Sucesso
  success: '#06D6A0',
  successDark: '#05B88A',
  successSoft: '#E8FFF7',

  // Alerta
  warning: '#F4A261',
  warningDark: '#E38B4D',
  warningSoft: '#FFF3E6',

  // Fundos
  background: '#F8F9FA',    // Cinza claro
  surface: '#FFFFFF',
  surfaceLight: '#FAFAFA',
  card: '#FFFFFF',

  // Textos
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',

  // Utilitários
  border: '#E0E0E0',
  divider: '#F0F0F0',
  overlay: 'rgba(0,0,0,0.05)',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#EF476F',
  dangerSoft: '#FFE3E8',
};

export const FONTS = {
  regular: 16,
  small: 14,
  xsmall: 12,
  large: 18,
  xlarge: 22,
  title: 26,
  hero: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999, // para botões circulares
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
};
