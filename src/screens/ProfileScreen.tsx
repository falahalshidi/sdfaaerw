import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/Card';
import Button from '../components/Button';
import { Theme } from '../constants/theme';
import * as Haptics from 'expo-haptics';

const initialProfile = {
  name: 'أحمد محمد الطالب',
  email: 'ahmed.student@university.edu.sa',
  university: 'جامعة الملك سعود',
  major: 'هندسة الحاسوب',
  year: 3,
  isPremium: false,
  joinDate: '2023-09-01',
  totalLectures: 45,
  totalNotes: 128,
  totalFiles: 67,
  totalEarnings: 1250,
};

const menuItems = [
  {
    id: 'edit_profile',
    title: 'تعديل الملف الشخصي',
    icon: 'person-outline',
    color: Theme.colors.primary,
  },
  {
    id: 'notifications',
    title: 'الإشعارات',
    icon: 'notifications-outline',
    color: Theme.colors.warning,
  },
  {
    id: 'privacy',
    title: 'الخصوصية والأمان',
    icon: 'shield-outline',
    color: Theme.colors.success,
  },
  {
    id: 'help',
    title: 'المساعدة والدعم',
    icon: 'help-circle-outline',
    color: Theme.colors.info,
  },
  {
    id: 'about',
    title: 'حول التطبيق',
    icon: 'information-circle-outline',
    color: Theme.colors.textSecondary,
  },
  {
    id: 'logout',
    title: 'تسجيل الخروج',
    icon: 'log-out-outline',
    color: Theme.colors.error,
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const [sectionPositions, setSectionPositions] = useState<Record<string, number>>({});
  const onSectionLayout = (id: string, y: number) => {
    setSectionPositions(prev => ({ ...prev, [id]: y }));
  };
  const [profileData, setProfileData] = useState(initialProfile);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lectureReminders, setLectureReminders] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [deliveryUpdates, setDeliveryUpdates] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: initialProfile.name,
    email: initialProfile.email,
    university: initialProfile.university,
    major: initialProfile.major,
    year: String(initialProfile.year),
  });

  const handleMenuPress = (itemId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (itemId) {
      case 'edit_profile':
        setEditForm({
          name: profileData.name,
          email: profileData.email,
          university: profileData.university,
          major: profileData.major,
          year: String(profileData.year),
        });
        setEditModalVisible(true);
        break;
      case 'notifications':
        scrollToSection('notifications');
        break;
      case 'privacy':
        scrollToSection('privacy');
        break;
      case 'help':
        scrollToSection('help');
        break;
      case 'about':
        scrollToSection('about');
        break;
      case 'logout':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          'تسجيل الخروج',
          'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
          [
            { text: 'إلغاء', style: 'cancel' },
            { 
              text: 'تسجيل الخروج', 
              style: 'destructive',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                navigation.navigate('Login' as never);
              }
            },
          ]
        );
        break;
    }
  };
  
  const scrollToSection = (sectionId: string) => {
    const y = sectionPositions[sectionId] ?? 0;
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  const handleUpgradePremium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'ترقية إلى Premium',
      'هل تريد الترقية إلى النسخة المدفوعة؟',
      [
        { text: 'لا', style: 'cancel' },
        { 
          text: 'نعم', 
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('ترقية', 'سيتم توجيهك إلى صفحة الدفع');
          }
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        {/* الهيدر المحسن */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[Theme.colors.primary, Theme.colors.secondary]}
                style={styles.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="person" size={40} color={Theme.colors.surface} />
              </LinearGradient>
            </View>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{profileData.name}</Text>
              <Text style={styles.userEmail}>{profileData.email}</Text>
              <View style={styles.userDetails}>
                <Text style={styles.userUniversity}>{profileData.university}</Text>
                <Text style={styles.userMajor}>{profileData.major} - السنة {profileData.year}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* إحصائيات المستخدم */}
        <Card style={styles.statsCard} variant="elevated" onLayout={(e) => onSectionLayout('stats', e.nativeEvent.layout.y)}>
          <Text style={styles.statsTitle}>إحصائياتي</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={24} color={Theme.colors.primary} />
              <Text style={styles.statValue}>{profileData.totalLectures}</Text>
              <Text style={styles.statLabel}>محاضرة</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="document-text" size={24} color={Theme.colors.secondary} />
              <Text style={styles.statValue}>{profileData.totalNotes}</Text>
              <Text style={styles.statLabel}>ملاحظة</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="folder" size={24} color={Theme.colors.warning} />
              <Text style={styles.statValue}>{profileData.totalFiles}</Text>
              <Text style={styles.statLabel}>ملف</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cash" size={24} color={Theme.colors.success} />
              <Text style={styles.statValue}>{profileData.totalEarnings}</Text>
              <Text style={styles.statLabel}>ريال</Text>
            </View>
          </View>
        </Card>

        {/* حالة الاشتراك المحسنة */}
        {!profileData.isPremium && (
          <Card style={styles.premiumCard} variant="elevated" onLayout={(e) => onSectionLayout('premium', e.nativeEvent.layout.y)}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.premiumGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.premiumContent}>
                <View style={styles.premiumIcon}>
                  <Ionicons name="star" size={24} color={Theme.colors.surface} />
                </View>
                <View style={styles.premiumText}>
                  <Text style={styles.premiumTitle}>ارتقِ إلى Premium</Text>
                  <Text style={styles.premiumDescription}>
                    احصل على ميزات حصرية وعروض توصيل مذهلة
                  </Text>
                </View>
                <Button
                  title="ترقية"
                  onPress={handleUpgradePremium}
                  variant="outline"
                  size="small"
                  style={styles.premiumButton}
                  textStyle={styles.premiumButtonText}
                />
              </View>
            </LinearGradient>
          </Card>
        )}

        {/* إعدادات الإشعارات */}
        <Card style={styles.settingsCard} variant="elevated" onLayout={(e) => onSectionLayout('notifications', e.nativeEvent.layout.y)}>
          <Text style={styles.settingsTitle}>إعدادات الإشعارات</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color={Theme.colors.primary} />
              <Text style={styles.settingLabel}>الإشعارات العامة</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                Haptics.selectionAsync();
                setNotificationsEnabled(value);
                Alert.alert('تم التحديث', `تم ${value ? 'تفعيل' : 'إلغاء'} الإشعارات العامة`);
              }}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
              thumbColor={notificationsEnabled ? Theme.colors.surface : Theme.colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="calendar" size={20} color={Theme.colors.primary} />
              <Text style={styles.settingLabel}>تذكيرات المحاضرات</Text>
            </View>
            <Switch
              value={lectureReminders}
              onValueChange={(value) => {
                Haptics.selectionAsync();
                setLectureReminders(value);
                Alert.alert('تم التحديث', `تم ${value ? 'تفعيل' : 'إلغاء'} تذكير المحاضرات`);
              }}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
              thumbColor={lectureReminders ? Theme.colors.surface : Theme.colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="checkmark-circle" size={20} color={Theme.colors.primary} />
              <Text style={styles.settingLabel}>تذكيرات المهام</Text>
            </View>
            <Switch
              value={taskReminders}
              onValueChange={(value) => {
                Haptics.selectionAsync();
                setTaskReminders(value);
                Alert.alert('تم التحديث', `تم ${value ? 'تفعيل' : 'إلغاء'} تذكير المهام`);
              }}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
              thumbColor={taskReminders ? Theme.colors.surface : Theme.colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="car" size={20} color={Theme.colors.primary} />
              <Text style={styles.settingLabel}>تحديثات التوصيل</Text>
            </View>
            <Switch
              value={deliveryUpdates}
              onValueChange={(value) => {
                Haptics.selectionAsync();
                setDeliveryUpdates(value);
                Alert.alert('تم التحديث', `تم ${value ? 'تفعيل' : 'إلغاء'} تحديثات التوصيل`);
              }}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
              thumbColor={deliveryUpdates ? Theme.colors.surface : Theme.colors.textLight}
            />
          </View>
        </Card>

        {/* قائمة الخيارات */}
        <Card style={styles.menuCard} variant="elevated" onLayout={(e) => onSectionLayout('menu', e.nativeEvent.layout.y)}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={Theme.colors.surface} />
                </View>
                <Text style={[
                  styles.menuText,
                  item.id === 'logout' && styles.logoutText,
                ]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color={item.id === 'logout' ? Theme.colors.error : Theme.colors.textLight} 
              />
            </TouchableOpacity>
          ))}
        </Card>

        {/* معلومات التطبيق */}
        <Card style={styles.infoCard} onLayout={(e) => onSectionLayout('about', e.nativeEvent.layout.y)}>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>AN - تطبيق الطلاب للطلاب</Text>
            <Text style={styles.infoVersion}>الإصدار 1.0.0</Text>
            <Text style={styles.infoDate}>
              انضم في {formatDate(profileData.joinDate)}
            </Text>
          </View>
        </Card>
      </ScrollView>
      {/* نافذة تعديل الملف الشخصي */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>تعديل الملف الشخصي</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}> 
              <Text style={styles.inputLabel}>الاسم</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.name}
                onChangeText={(t) => setEditForm({ ...editForm, name: t })}
              />
            </View>
            <View style={styles.inputContainer}> 
              <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.email}
                onChangeText={(t) => setEditForm({ ...editForm, email: t })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}> 
              <Text style={styles.inputLabel}>الجامعة</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.university}
                onChangeText={(t) => setEditForm({ ...editForm, university: t })}
              />
            </View>
            <View style={styles.inputContainer}> 
              <Text style={styles.inputLabel}>التخصص</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.major}
                onChangeText={(t) => setEditForm({ ...editForm, major: t })}
              />
            </View>
            <View style={styles.inputContainer}> 
              <Text style={styles.inputLabel}>السنة</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.year}
                onChangeText={(t) => setEditForm({ ...editForm, year: t })}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.modalActions}>
              <Button
                title="إلغاء"
                variant="outline"
                onPress={() => setEditModalVisible(false)}
                style={styles.cancelButton}
              />
              <Button
                title="حفظ"
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setProfileData(prev => ({
                    ...prev,
                    name: editForm.name.trim() || prev.name,
                    email: editForm.email.trim() || prev.email,
                    university: editForm.university.trim() || prev.university,
                    major: editForm.major.trim() || prev.major,
                    year: Number(editForm.year) || prev.year,
                  }));
                  setEditModalVisible(false);
                  Alert.alert('تم الحفظ', 'تم تحديث الملف الشخصي بنجاح');
                }}
                style={styles.saveButton}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Theme.spacing.lg,
    ...Theme.shadows.medium,
  },
  
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  userInfoContainer: {
    flex: 1,
  },
  
  userName: {
    ...Theme.typography.h2,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  
  userEmail: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  
  userDetails: {
    gap: Theme.spacing.xs,
  },
  
  userUniversity: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  
  userMajor: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
  },
  
  statsCard: {
    margin: Theme.spacing.md,
  },
  
  statsTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.lg,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statValue: {
    ...Theme.typography.h3,
    color: Theme.colors.primary,
    fontWeight: 'bold',
    marginVertical: Theme.spacing.xs,
  },
  
  statLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  premiumCard: {
    margin: Theme.spacing.md,
    backgroundColor: 'transparent',
    borderWidth: 0,
    overflow: 'hidden',
  },
  
  premiumGradient: {
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.lg,
  },
  
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  premiumIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  
  premiumText: {
    flex: 1,
  },
  
  premiumTitle: {
    ...Theme.typography.body,
    color: Theme.colors.surface,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  premiumDescription: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.surface,
    opacity: 0.9,
  },
  
  premiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: Theme.colors.surface,
  },
  
  premiumButtonText: {
    color: Theme.colors.surface,
  },
  
  settingsCard: {
    margin: Theme.spacing.md,
  },
  
  settingsTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.lg,
  },
  
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  settingLabel: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
  
  menuCard: {
    margin: Theme.spacing.md,
  },
  
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  
  menuText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  
  logoutText: {
    color: Theme.colors.error,
  },
  
  infoCard: {
    margin: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  
  infoContent: {
    alignItems: 'center',
  },
  
  infoTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  infoVersion: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  
  infoDate: {
    ...Theme.typography.caption,
    color: Theme.colors.textLight,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },

  modalTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },

  modalContent: {
    flex: 1,
    padding: Theme.spacing.lg,
  },

  inputContainer: {
    marginBottom: Theme.spacing.lg,
  },

  inputLabel: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.sm,
  },

  textInput: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.medium,
    padding: Theme.spacing.md,
    ...Theme.typography.body,
    color: Theme.colors.text,
    backgroundColor: Theme.colors.surface,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },

  cancelButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
  },

  saveButton: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
});
