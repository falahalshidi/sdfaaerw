import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Theme } from '../constants/theme';
import GlassContainer from './GlassContainer';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'glass-liquid';
  padding?: 'small' | 'medium' | 'large';
  glassIntensity?: number;
  animated?: boolean;
}

export default function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'medium',
  glassIntensity = 25,
  animated = false,
  ...props
}: CardProps) {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    if (variant === 'elevated') {
      return [...baseStyle, styles.elevated];
    } else if (variant === 'outlined') {
      return [...baseStyle, styles.outlined];
    } else if (variant === 'glass' || variant === 'glass-liquid') {
      return [...baseStyle, styles.glass];
    }
    
    return baseStyle;
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'small':
        return styles.paddingSmall;
      case 'large':
        return styles.paddingLarge;
      default:
        return styles.paddingMedium;
    }
  };

  const cardStyle = [
    getCardStyle(),
    getPaddingStyle(),
    style,
  ];

  // إذا كان النوع زجاجي، استخدم GlassContainer
  if (variant === 'glass' || variant === 'glass-liquid') {
    const glassVariant = variant === 'glass-liquid' ? 'liquid-flow' : 'card';
    
    if (onPress) {
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={style}
          {...props}
        >
          <GlassContainer
            variant={glassVariant}
            intensity={glassIntensity}
            animated={animated}
            borderRadius={Theme.borderRadius.large}
            shadowIntensity="medium"
          >
            <View style={getPaddingStyle()}>
              {children}
            </View>
          </GlassContainer>
        </TouchableOpacity>
      );
    }

    return (
      <GlassContainer
        variant={glassVariant}
        intensity={glassIntensity}
        animated={animated}
        borderRadius={Theme.borderRadius.large}
        shadowIntensity="medium"
        style={style}
      >
        <View style={getPaddingStyle()}>
          {children}
        </View>
      </GlassContainer>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    marginVertical: Theme.spacing.xs,
  },
  
  // الأنماط
  elevated: {
    ...Theme.shadows.medium,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  glass: {
    backgroundColor: 'transparent',
    marginVertical: Theme.spacing.xs,
  },
  
  // المسافات الداخلية
  paddingSmall: {
    padding: Theme.spacing.sm,
  },
  paddingMedium: {
    padding: Theme.spacing.md,
  },
  paddingLarge: {
    padding: Theme.spacing.lg,
  },
});
