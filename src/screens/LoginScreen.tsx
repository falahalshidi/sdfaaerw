import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Theme } from '../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    setIsLoading(true);
    
    // محاكاة تسجيل الدخول
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Main' as never);
    }, 2000);
  };

  const handleSignUp = () => {
    Alert.alert('تسجيل جديد', 'سيتم إضافة صفحة التسجيل في التحديث القادم');
  };

  const handleForgotPassword = () => {
    Alert.alert('نسيت كلمة المرور', 'سيتم إضافة هذه الميزة في التحديث القادم');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Theme.colors.gradient.background}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* الشعار */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Ionicons name="school" size={60} color={Theme.colors.primary} />
              </View>
              <Text style={styles.logoText}>AN</Text>
              <Text style={styles.logoSubtext}>تطبيق الطلاب للطلاب</Text>
            </View>

            {/* نموذج تسجيل الدخول */}
            <Card style={styles.loginCard} variant="elevated">
              <Text style={styles.welcomeText}>مرحباً بعودتك!</Text>
              <Text style={styles.subtitleText}>سجل دخولك للمتابعة</Text>

              <Input
                label="البريد الإلكتروني"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                containerStyle={styles.inputContainer}
              />

              <Input
                label="كلمة المرور"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChangeText={setPassword}
                isPassword
                leftIcon="lock-closed-outline"
                containerStyle={styles.inputContainer}
              />

              <Button
                title="تسجيل الدخول"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
                size="large"
              />

              <Button
                title="نسيت كلمة المرور؟"
                onPress={handleForgotPassword}
                variant="outline"
                style={styles.forgotButton}
                textStyle={styles.forgotButtonText}
              />
            </Card>

            {/* تسجيل جديد */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>ليس لديك حساب؟</Text>
              <Button
                title="إنشاء حساب جديد"
                onPress={handleSignUp}
                variant="secondary"
                style={styles.signUpButton}
              />
            </View>

            {/* الميزات السريعة */}
            <Card style={styles.featuresCard}>
              <Text style={styles.featuresTitle}>ميزات التطبيق</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="calendar" size={20} color={Theme.colors.primary} />
                  <Text style={styles.featureText}>جدولة المحاضرات</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="document-text" size={20} color={Theme.colors.primary} />
                  <Text style={styles.featureText}>تسجيل الملاحظات</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="star" size={20} color={Theme.colors.primary} />
                  <Text style={styles.featureText}>نسخة بريميوم</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="car" size={20} color={Theme.colors.primary} />
                  <Text style={styles.featureText}>عروض التوصيل</Text>
                </View>
              </View>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
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
  
  keyboardView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.xl,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.large,
  },
  
  logoText: {
    ...Theme.typography.h1,
    color: Theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  
  logoSubtext: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  loginCard: {
    marginBottom: Theme.spacing.lg,
  },
  
  welcomeText: {
    ...Theme.typography.h2,
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  
  subtitleText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  
  inputContainer: {
    marginBottom: Theme.spacing.md,
  },
  
  loginButton: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  
  forgotButton: {
    backgroundColor: 'transparent',
  },
  
  forgotButtonText: {
    color: Theme.colors.primary,
    fontSize: 14,
  },
  
  signUpContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  
  signUpText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  
  signUpButton: {
    width: '100%',
  },
  
  featuresCard: {
    backgroundColor: Theme.colors.surface,
  },
  
  featuresTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: Theme.spacing.sm,
  },
  
  featureText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
});
