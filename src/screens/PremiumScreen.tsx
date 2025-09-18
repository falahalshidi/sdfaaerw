import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import Card from '../components/Card';
import Button from '../components/Button';
import { Theme } from '../constants/theme';
import { PremiumColors } from '../constants/colors';

const premiumFeatures = [
  {
    icon: 'infinite',
    title: 'ملفات غير محدودة',
    description: 'ارفع عدد غير محدود من الملفات والملاحظات',
    color: Theme.colors.primary,
  },
  {
    icon: 'sparkles',
    title: 'ذكاء اصطناعي متقدم',
    description: 'ملخصات ذكية واختبارات مخصصة من محتواك',
    color: Theme.colors.secondary,
  },
  {
    icon: 'flash',
    title: 'معالجة سريعة',
    description: 'معالجة فورية للملفات والملاحظات',
    color: Theme.colors.warning,
  },
  {
    icon: 'shield-checkmark',
    title: 'نسخ احتياطي آمن',
    description: 'حفظ آمن لجميع بياناتك في السحابة',
    color: Theme.colors.success,
  },
  {
    icon: 'star',
    title: 'عروض التوصيل الحصرية',
    description: 'وصول مبكر لعروض التوصيل المربحة',
    color: PremiumColors.gold,
  },
  {
    icon: 'headset',
    title: 'دعم فني متميز',
    description: 'دعم فني سريع ومتاح 24/7',
    color: Theme.colors.accent,
  },
];

const pricingPlans = [
  {
    id: 'monthly',
    name: 'شهري',
    price: '29.99',
    period: 'ريال/شهر',
    features: ['جميع الميزات الأساسية', 'ملفات غير محدودة', 'ذكاء اصطناعي متقدم'],
    popular: false,
  },
  {
    id: 'yearly',
    name: 'سنوي',
    price: '299.99',
    period: 'ريال/سنة',
    originalPrice: '359.88',
    discount: '17%',
    features: ['جميع الميزات الأساسية', 'ملفات غير محدودة', 'ذكاء اصطناعي متقدم', 'دعم فني متميز'],
    popular: true,
  },
  {
    id: 'lifetime',
    name: 'مدى الحياة',
    price: '599.99',
    period: 'ريال مرة واحدة',
    features: ['جميع الميزات', 'تحديثات مجانية مدى الحياة', 'دعم فني متميز'],
    popular: false,
  },
];

export default function PremiumScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    
    // محاكاة عملية الاشتراك
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'تم الاشتراك بنجاح!',
        'مرحباً بك في النسخة المدفوعة من AN. استمتع بجميع الميزات الحصرية!',
        [{ text: 'ممتاز!', style: 'default' }]
      );
    }, 2000);
  };

  const handleRestorePurchase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('استعادة المشتريات', 'سيتم إضافة هذه الميزة في التحديث القادم');
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const selectedPlanData = pricingPlans.find(plan => plan.id === selectedPlan);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* الهيدر المحسن */}
        <View style={styles.header}>
          <LinearGradient
            colors={Theme.colors.gradient.purple}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.crownContainer}>
                <Ionicons name="star" size={40} color={Theme.colors.surface} />
              </View>
              <Text style={styles.headerTitle}>AN Premium</Text>
              <Text style={styles.headerSubtitle}>
                ارفع تجربتك الجامعية إلى مستوى جديد
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* الميزات */}
        <Card style={styles.featuresCard} variant="elevated">
          <Text style={styles.sectionTitle}>ميزات Premium</Text>
          <Text style={styles.sectionSubtitle}>
            احصل على تجربة تعليمية متقدمة مع جميع الميزات الحصرية
          </Text>

          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={24} color={Theme.colors.surface} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* خطط الأسعار */}
        <Card style={styles.pricingCard} variant="elevated">
          <Text style={styles.sectionTitle}>اختر خطتك</Text>
          <Text style={styles.sectionSubtitle}>
            اختر الخطة التي تناسب احتياجاتك
          </Text>

          {pricingPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlanCard,
                plan.popular && styles.popularPlanCard,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>الأكثر شعبية</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planPrice}>
                  <Text style={styles.priceValue}>{plan.price}</Text>
                  <Text style={styles.pricePeriod}>{plan.period}</Text>
                </View>
                {plan.originalPrice && (
                  <View style={styles.originalPriceContainer}>
                    <Text style={styles.originalPrice}>{plan.originalPrice} ريال</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{plan.discount} خصم</Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.planFeatureItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Theme.colors.success} />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.planFooter}>
                <View style={[
                  styles.radioButton,
                  selectedPlan === plan.id && styles.selectedRadioButton,
                ]}>
                  {selectedPlan === plan.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* عروض التوصيل */}
        <Card style={styles.deliveryCard} variant="elevated">
          <View style={styles.deliveryHeader}>
            <Ionicons name="car" size={24} color={Theme.colors.primary} />
            <Text style={styles.deliveryTitle}>عروض التوصيل الحصرية</Text>
          </View>
          <Text style={styles.deliveryDescription}>
            مع النسخة المدفوعة، احصل على وصول مبكر لعروض التوصيل المربحة
          </Text>
          
          <View style={styles.earningsContainer}>
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>50+</Text>
              <Text style={styles.earningLabel}>ريال في اليوم</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>1,500+</Text>
              <Text style={styles.earningLabel}>ريال في الشهر</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>18,000+</Text>
              <Text style={styles.earningLabel}>ريال في السنة</Text>
            </View>
          </View>
        </Card>

        {/* أزرار العمل */}
        <View style={styles.actionButtons}>
          <Button
            title="اشترك الآن"
            onPress={handleSubscribe}
            loading={isLoading}
            variant="premium"
            size="large"
            style={styles.subscribeButton}
          />
          
          <Button
            title="استعادة المشتريات"
            onPress={handleRestorePurchase}
            variant="outline"
            style={styles.restoreButton}
          />
        </View>

        {/* ضمان الاسترداد */}
        <Card style={styles.guaranteeCard}>
          <View style={styles.guaranteeContent}>
            <Ionicons name="shield-checkmark" size={24} color={Theme.colors.success} />
            <View style={styles.guaranteeText}>
              <Text style={styles.guaranteeTitle}>ضمان الاسترداد 30 يوم</Text>
              <Text style={styles.guaranteeDescription}>
                إذا لم تكن راضياً عن الخدمة، يمكنك استرداد أموالك خلال 30 يوماً
              </Text>
            </View>
          </View>
        </Card>

        {/* الشروط والأحكام */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            بالاشتراك، فإنك توافق على{' '}
            <Text style={styles.termsLink}>شروط الاستخدام</Text>
            {' '}و{' '}
            <Text style={styles.termsLink}>سياسة الخصوصية</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  
  scrollContent: {
    paddingBottom: Theme.spacing.xl,
  },
  
  header: {
    margin: Theme.spacing.md,
    borderRadius: Theme.borderRadius.xlarge,
    overflow: 'hidden',
    ...Theme.shadows.large,
  },
  
  headerGradient: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  
  headerContent: {
    alignItems: 'center',
  },
  
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.medium,
  },
  
  headerTitle: {
    ...Theme.typography.h1,
    color: Theme.colors.surface,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.sm,
  },
  
  headerSubtitle: {
    ...Theme.typography.body,
    color: Theme.colors.surface,
    textAlign: 'center',
    opacity: 0.9,
  },
  
  featuresCard: {
    margin: Theme.spacing.md,
  },
  
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.sm,
  },
  
  sectionSubtitle: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
    lineHeight: 22,
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.lg,
  },
  
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  
  featureContent: {
    flex: 1,
  },
  
  featureTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  featureDescription: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  
  pricingCard: {
    margin: Theme.spacing.md,
  },
  
  planCard: {
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    position: 'relative',
  },
  
  selectedPlanCard: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.background,
  },
  
  popularPlanCard: {
    borderColor: PremiumColors.gold,
  },
  
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -60,
    backgroundColor: PremiumColors.gold,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.medium,
  },
  
  popularText: {
    ...Theme.typography.caption,
    color: Theme.colors.surface,
    fontWeight: 'bold',
  },
  
  planHeader: {
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  
  planName: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.sm,
  },
  
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Theme.spacing.xs,
  },
  
  priceValue: {
    ...Theme.typography.h1,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  
  pricePeriod: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  originalPrice: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: Theme.spacing.sm,
  },
  
  discountBadge: {
    backgroundColor: Theme.colors.error,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.small,
  },
  
  discountText: {
    ...Theme.typography.caption,
    color: Theme.colors.surface,
    fontWeight: 'bold',
  },
  
  planFeatures: {
    marginBottom: Theme.spacing.md,
  },
  
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  
  planFeatureText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
  
  planFooter: {
    alignItems: 'center',
  },
  
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  selectedRadioButton: {
    borderColor: Theme.colors.primary,
  },
  
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.primary,
  },
  
  deliveryCard: {
    margin: Theme.spacing.md,
  },
  
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  
  deliveryTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginLeft: Theme.spacing.sm,
  },
  
  deliveryDescription: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
    lineHeight: 22,
  },
  
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  earningItem: {
    alignItems: 'center',
  },
  
  earningValue: {
    ...Theme.typography.h3,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  
  earningLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  actionButtons: {
    padding: Theme.spacing.md,
  },
  
  subscribeButton: {
    marginBottom: Theme.spacing.md,
  },
  
  restoreButton: {
    backgroundColor: 'transparent',
  },
  
  guaranteeCard: {
    margin: Theme.spacing.md,
  },
  
  guaranteeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  guaranteeText: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  
  guaranteeTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  guaranteeDescription: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  
  termsContainer: {
    padding: Theme.spacing.md,
  },
  
  termsText: {
    ...Theme.typography.caption,
    color: Theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  
  termsLink: {
    color: Theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
