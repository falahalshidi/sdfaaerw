import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Button from '../components/Button';
import { Theme } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'مرحباً بك في AN',
    subtitle: 'تطبيق الطلاب للطلاب',
    description: 'منصة شاملة لإدارة حياتك الجامعية بسهولة وذكاء',
    icon: 'school-outline',
    gradient: ['#4A90E2', '#357ABD'],
  },
  {
    id: 2,
    title: 'جدولة ذكية',
    subtitle: 'نظم محاضراتك بسهولة',
    description: 'سجل محاضراتك واحصل على تذكيرات ذكية قبل كل محاضرة',
    icon: 'calendar-outline',
    gradient: ['#50C878', '#38A169'],
  },
  {
    id: 3,
    title: 'ملاحظات ذكية',
    subtitle: 'سجل وارفع ملاحظاتك',
    description: 'سجل ملاحظاتك بالصوت أو النص واحصل على ملخصات ذكية',
    icon: 'document-text-outline',
    gradient: ['#FF6B6B', '#E53E3E'],
  },
  {
    id: 4,
    title: 'فرص دخل إضافية',
    subtitle: 'اكسب من وقت فراغك',
    description: 'انضم لعروض التوصيل واكسب دخل إضافي أثناء الدراسة',
    icon: 'car-outline',
    gradient: ['#FFA726', '#FF9800'],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Login' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login' as never);
  };

  const currentData = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={currentData.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* شريط التقدم */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentIndex + 1) / onboardingData.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} من {onboardingData.length}
          </Text>
        </View>

        {/* المحتوى الرئيسي */}
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* الأيقونة */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons 
                name={currentData.icon as keyof typeof Ionicons.glyphMap} 
                size={80} 
                color={Theme.colors.surface} 
              />
            </View>
          </View>

          {/* النصوص */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentData.title}</Text>
            <Text style={styles.subtitle}>{currentData.subtitle}</Text>
            <Text style={styles.description}>{currentData.description}</Text>
          </View>
        </ScrollView>

        {/* الأزرار */}
        <View style={styles.buttonContainer}>
          <Button
            title="تخطي"
            onPress={handleSkip}
            variant="outline"
            style={styles.skipButton}
            textStyle={styles.skipButtonText}
          />
          
          <Button
            title={currentIndex === onboardingData.length - 1 ? 'ابدأ الآن' : 'التالي'}
            onPress={handleNext}
            variant="primary"
            style={styles.nextButton}
          />
        </View>

        {/* النقاط المؤشرة */}
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  gradient: {
    flex: 1,
  },
  
  progressContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: Theme.spacing.sm,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.surface,
    borderRadius: 2,
  },
  
  progressText: {
    ...Theme.typography.caption,
    color: Theme.colors.surface,
    textAlign: 'center',
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  
  iconContainer: {
    marginBottom: Theme.spacing.xxl,
  },
  
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.large,
  },
  
  textContainer: {
    alignItems: 'center',
  },
  
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.surface,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  
  subtitle: {
    ...Theme.typography.h3,
    color: Theme.colors.surface,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    opacity: 0.9,
  },
  
  description: {
    ...Theme.typography.body,
    color: Theme.colors.surface,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.lg,
  },
  
  skipButton: {
    flex: 0.4,
    backgroundColor: 'transparent',
    borderColor: Theme.colors.surface,
  },
  
  skipButtonText: {
    color: Theme.colors.surface,
  },
  
  nextButton: {
    flex: 0.5,
    backgroundColor: Theme.colors.surface,
  },
  
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Theme.spacing.xl,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  
  activeDot: {
    backgroundColor: Theme.colors.surface,
    width: 24,
  },
});
