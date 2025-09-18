import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  variant?: 'subtle' | 'medium' | 'strong' | 'liquid';
  borderRadius?: number;
  showBorder?: boolean;
}

const GlassView: React.FC<GlassViewProps> = ({
  children,
  style,
  intensity = 20,
  tint = 'light',
  variant = 'medium',
  borderRadius = 16,
  showBorder = true,
}) => {
  const getGlassStyles = () => {
    switch (variant) {
      case 'subtle':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        };
      case 'medium':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        };
      case 'strong':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
        };
      case 'liquid':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        };
    }
  };

  const glassStyles = getGlassStyles();

  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius,
            backgroundColor: glassStyles.backgroundColor,
            borderWidth: showBorder ? 1 : 0,
            borderColor: glassStyles.borderColor,
          },
        ]}
      />
      {variant === 'liquid' && (
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius,
              opacity: 0.6,
            },
          ]}
        />
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default GlassView;