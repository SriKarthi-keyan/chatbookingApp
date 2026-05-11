import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  title: {
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.textMuted,
  },
  chat: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
};
