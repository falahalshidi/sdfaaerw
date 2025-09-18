import { Colors } from './colors';

// تصميم التطبيق - حواف مائلة وعصرية مع تأثيرات الزجاج السائل
export const Theme = {
  colors: Colors,
  
  // أنماط الحواف
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    xxlarge: 24, // للزجاج السائل
    round: 50, // للعناصر الدائرية
  },
  
  // تأثيرات الزجاج السائل - iOS 26
  glass: {
    // شدة الضبابية
    blur: {
      light: 15,
      medium: 25,
      strong: 40,
      liquid: 20,
    },
    // ألوان الزجاج
    colors: {
      light: 'rgba(255, 255, 255, 0.12)',
      medium: 'rgba(255, 255, 255, 0.18)',
      strong: 'rgba(255, 255, 255, 0.25)',
      liquid: 'rgba(255, 255, 255, 0.08)',
      // ألوان الحدود
      border: {
        light: 'rgba(255, 255, 255, 0.2)',
        medium: 'rgba(255, 255, 255, 0.3)',
        strong: 'rgba(255, 255, 255, 0.4)',
        liquid: 'rgba(255, 255, 255, 0.15)',
      },
    },
    // تدرجات الزجاج السائل
    gradients: {
      primary: [
        'rgba(100, 102, 241, 0.1)',
        'rgba(139, 92, 246, 0.05)',
        'rgba(100, 102, 241, 0.1)',
      ],
      secondary: [
        'rgba(16, 185, 129, 0.1)',
        'rgba(5, 150, 105, 0.05)',
        'rgba(16, 185, 129, 0.1)',
      ],
      neutral: [
        'rgba(255, 255, 255, 0.15)',
        'rgba(255, 255, 255, 0.05)',
        'rgba(255, 255, 255, 0.15)',
      ],
    },
  },
  
  // الظلال
  shadows: {
    small: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // الخطوط
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      color: Colors.text,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      color: Colors.text,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: Colors.text,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: Colors.text,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      color: Colors.text,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      color: Colors.textSecondary,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      color: Colors.textLight,
    },
  },
  
  // المسافات
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // أحجام العناصر
  sizes: {
    buttonHeight: 48,
    inputHeight: 48,
    iconSize: 24,
    iconSizeLarge: 32,
    avatarSize: 40,
    avatarSizeLarge: 80,
  },
};
