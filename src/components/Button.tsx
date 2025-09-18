import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/theme';
import { HapticFeedback } from '../utils/haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'premium';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (variant === 'primary') {
      return [...baseStyle, styles.primary];
    } else if (variant === 'secondary') {
      return [...baseStyle, styles.secondary];
    } else if (variant === 'outline') {
      return [...baseStyle, styles.outline];
    } else if (variant === 'premium') {
      return [...baseStyle, styles.premium];
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'outline') {
      return [...baseTextStyle, styles.outlineText];
    }
    
    return baseTextStyle;
  };

  const handlePress = () => {
    HapticFeedback.light();
    onPress();
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? Theme.colors.primary : Theme.colors.surface} 
          size="small" 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </>
  );

  if (variant === 'premium') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        style={[getButtonStyle(), disabled && styles.disabled, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={Theme.colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[getButtonStyle(), disabled && styles.disabled, style]}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Theme.shadows.small,
  },
  
  // الأحجام
  small: {
    height: 36,
    paddingHorizontal: Theme.spacing.md,
  },
  medium: {
    height: Theme.sizes.buttonHeight,
    paddingHorizontal: Theme.spacing.lg,
  },
  large: {
    height: 56,
    paddingHorizontal: Theme.spacing.xl,
  },
  
  // الأنماط
  primary: {
    backgroundColor: Theme.colors.primary,
  },
  secondary: {
    backgroundColor: Theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  premium: {
    backgroundColor: 'transparent',
  },
  
  // النص
  text: {
    fontWeight: '600',
    color: Theme.colors.surface,
  },
  outlineText: {
    color: Theme.colors.primary,
  },
  
  // أحجام النص
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // الحالات
  disabled: {
    opacity: 0.5,
  },
  
  // التدرج
  gradient: {
    flex: 1,
    borderRadius: Theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
