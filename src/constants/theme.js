// Design System Tokens according to the new UI Design Guide

export const Colors = {
  // Palet Warna
  primary: '#0077E6',      // Biru Laut Modern (Primary)
  secondary: '#38BDF8',    // Sky Blue
  background: '#F8FAFC',   // Background Bersih
  primaryButton: '#0077E6',// Tombol Utama
  activeButton: '#0284C7', // Tombol Aktif
  textPrimary: '#1E293B',  // Teks Utama Slate
  textSecondary: '#64748B',// Teks Sekunder
  cardBackground: '#FFFFFF',// Kartu (Card)
  border: '#E2E8F0',       // Border
  white: '#FFFFFF',
  danger: '#EF4444',
  success: '#10B981',
};

export const Gradients = {
  // Gradasi Utama (#087FC4 -> #4DD0E1)
  primary: ['#087FC4', '#4DD0E1'],
  primaryCoords: {
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Gradasi Header (#0080CA -> #00BAE8)
  header: ['#0080CA', '#00BAE8'],
  headerCoords: {
    start: { x: 0, y: 0 },
    end: { x: 0.5, y: 1 },
  },

  // Splash Screen Wave Gradients
  splash: ['#04659E', '#087FC4', '#4DD0E1'],
};

export const Typography = {
  fontFamily: 'System', // Fallback to system font, compatible with Poppins/Montserrat style
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
};

export const Shadows = {
  card: {
    shadowColor: '#C7EAF2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
  },
  subtle: {
    shadowColor: '#123B5D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  glow: {
    shadowColor: '#087FC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
