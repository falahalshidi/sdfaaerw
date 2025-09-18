import React from 'react';
import { View, ViewStyle, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface GlassContainerProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  variant?: 'card' | 'modal' | 'navigation' | 'liquid-flow';
  borderRadius?: number;
  showBorder?: boolean;
  animated?: boolean;
  shadowIntensity?: 'light' | 'medium' | 'strong';
}

const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  style,
  intensity = 25,
  tint = 'light',
  variant = 'card',
  borderRadius = 20,
  showBorder = true,
  animated = false,
  shadowIntensity = 'medium',
}) => {
  const animationValue = useSharedValue(0);

  React.useEffect(() => {
    if (animated) {
      animationValue.value = withRepeat(
        withTiming(1, { duration: 3000 }),
        -1,
        true
      );
    }
  }, [animated]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          shadowOpacity: 0.1,
        };
      case 'modal':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          borderColor: 'rgba(255, 255, 255, 0.35)',
          shadowOpacity: 0.15,
        };
      case 'navigation':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          shadowOpacity: 0.05,
        };
      case 'liquid-flow':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          shadowOpacity: 0.08,
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          shadowOpacity: 0.1,
        };
    }
  };

  const getShadowStyles = () => {
    const baseOpacity = getVariantStyles().shadowOpacity;
    
    switch (shadowIntensity) {
      case 'light':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: baseOpacity * 0.5,
          shadowRadius: 8,
          elevation: 2,
        };
      case 'medium':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: baseOpacity,
          shadowRadius: 12,
          elevation: 4,
        };
      case 'strong':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: baseOpacity * 1.5,
          shadowRadius: 16,
          elevation: 8,
        };
      default:
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: baseOpacity,
          shadowRadius: 12,
          elevation: 4,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const shadowStyles = getShadowStyles();

  const animatedStyle = useAnimatedStyle(() => {
    if (!animated) return {};
    
    const translateX = interpolate(
      animationValue.value,
      [0, 0.5, 1],
      [0, 2, 0]
    );
    
    const scale = interpolate(
      animationValue.value,
      [0, 0.5, 1],
      [1, 1.002, 1]
    );

    return {
      transform: [{ translateX }, { scale }],
    };
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { borderRadius }, 
        shadowStyles,
        style,
        animatedStyle
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius,
            backgroundColor: variantStyles.backgroundColor,
            borderWidth: showBorder ? 1 : 0,
            borderColor: variantStyles.borderColor,
          },
        ]}
      />
      
      {variant === 'liquid-flow' && (
        <>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.15)',
              'rgba(255, 255, 255, 0.05)',
              'rgba(255, 255, 255, 0.15)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderRadius,
                opacity: 0.4,
              },
            ]}
          />
          <LinearGradient
            colors={[
              'rgba(100, 102, 241, 0.1)',
              'rgba(139, 92, 246, 0.05)',
              'rgba(100, 102, 241, 0.1)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderRadius,
                opacity: 0.3,
              },
            ]}
          />
        </>
      )}
      
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
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

export default GlassContainer;