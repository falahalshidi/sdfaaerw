import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import Card from '../components/Card';
import Button from '../components/Button';
import { Theme } from '../constants/theme';

const { width } = Dimensions.get('window');

// بيانات وهمية للمحاضرات القادمة
const upcomingLectures = [
  {
    id: '1',
    title: 'مقدمة في البرمجة',
    professor: 'د. أحمد محمد',
    time: '10:00 - 11:30',
    location: 'قاعة 101',
    isNow: true,
  },
  {
    id: '2',
    title: 'قواعد البيانات',
    professor: 'د. فاطمة علي',
    time: '14:00 - 15:30',
    location: 'قاعة 205',
    isNow: false,
  },
];

// بيانات وهمية للمهام
const recentTasks = [
  {
    id: '1',
    title: 'مشروع البرمجة',
    course: 'مقدمة في البرمجة',
    dueDate: '2024-01-15',
    priority: 'high' as const,
  },
  {
    id: '2',
    title: 'تقرير قواعد البيانات',
    course: 'قواعد البيانات',
    dueDate: '2024-01-20',
    priority: 'medium' as const,
  },
];

// بيانات وهمية للإحصائيات
const stats = [
  { label: 'المحاضرات هذا الأسبوع', value: '12', icon: 'calendar' },
  { label: 'المهام المكتملة', value: '8', icon: 'checkmark-circle' },
  { label: 'الملفات المرفوعة', value: '15', icon: 'folder' },
  { label: 'النقاط المكتسبة', value: '1,250', icon: 'star' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userName] = useState('أحمد الطالب');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return Theme.colors.error;
      case 'medium':
        return Theme.colors.warning;
      case 'low':
        return Theme.colors.success;
      default:
        return Theme.colors.textSecondary;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* بطاقة الترحيب */}
        <Card 
          style={styles.welcomeCard} 
          variant="glass-liquid" 
          animated={true}
          glassIntensity={30}
        >
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>مرحباً،</Text>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.welcomeSubtext}>كيف كان يومك الدراسي؟</Text>
            </View>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={Theme.colors.gradient.primary}
                style={styles.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="person" size={32} color={Theme.colors.surface} />
              </LinearGradient>
            </View>
          </View>
        </Card>

        {/* الإحصائيات المحسنة */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard} variant="elevated">
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={20} color={Theme.colors.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* المحاضرات القادمة */}
        <Card style={styles.sectionCard} variant="elevated">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>المحاضرات القادمة</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          {upcomingLectures.map((lecture) => (
            <View key={lecture.id} style={styles.lectureItem}>
              <View style={styles.lectureInfo}>
                <View style={styles.lectureHeader}>
                  <Text style={styles.lectureTitle}>{lecture.title}</Text>
                  {lecture.isNow && (
                    <View style={styles.nowBadge}>
                      <Text style={styles.nowText}>الآن</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.lectureProfessor}>{lecture.professor}</Text>
                <View style={styles.lectureDetails}>
                  <Ionicons name="time-outline" size={16} color={Theme.colors.textSecondary} />
                  <Text style={styles.lectureDetailText}>{lecture.time}</Text>
                  <Ionicons name="location-outline" size={16} color={Theme.colors.textSecondary} />
                  <Text style={styles.lectureDetailText}>{lecture.location}</Text>
                </View>
              </View>
              <Button
                title={lecture.isNow ? 'انضم' : 'تذكير'}
                onPress={() => {}}
                variant={lecture.isNow ? 'primary' : 'outline'}
                size="small"
              />
            </View>
          ))}
        </Card>

        {/* المهام الأخيرة */}
        <Card style={styles.sectionCard} variant="elevated">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>المهام الأخيرة</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          {recentTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskCourse}>{task.course}</Text>
                <View style={styles.taskDetails}>
                  <Text style={styles.taskDueDate}>الموعد النهائي: {task.dueDate}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                    <Text style={styles.priorityText}>{getPriorityText(task.priority)}</Text>
                  </View>
                </View>
              </View>
              <Button
                title="عرض"
                onPress={() => {}}
                variant="outline"
                size="small"
              />
            </View>
          ))}
        </Card>

        {/* إجراءات سريعة */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('AddLecture' as never);
            }}
          >
            <LinearGradient
              colors={Theme.colors.gradient.primary}
              style={styles.quickActionContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="add" size={24} color={Theme.colors.surface} />
              </View>
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>إضافة محاضرة</Text>
                <Text style={styles.quickActionSubtitle}>جدولة محاضرة جديدة</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Notes' as never, { openAddModal: true } as never);
            }}
          >
            <LinearGradient
              colors={Theme.colors.gradient.secondary}
              style={styles.quickActionContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="document-text" size={24} color={Theme.colors.surface} />
              </View>
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>تسجيل ملاحظة</Text>
                <Text style={styles.quickActionSubtitle}>إضافة ملاحظة نصية أو صوتية</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Files' as never, { openUploadModal: true } as never);
            }}
          >
            <LinearGradient
              colors={Theme.colors.gradient.accent}
              style={styles.quickActionContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="cloud-upload" size={24} color={Theme.colors.surface} />
              </View>
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>رفع ملف</Text>
                <Text style={styles.quickActionSubtitle}>رفع ملفات PDF أو Word</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Premium' as never);
            }}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.quickActionContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="star" size={24} color={Theme.colors.surface} />
              </View>
              <View style={styles.quickActionTextContainer}>
                <Text style={styles.quickActionTitle}>بريميوم</Text>
                <Text style={styles.quickActionSubtitle}>الترقية للنسخة المميزة</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
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
    padding: Theme.spacing.md,
  },
  
  welcomeCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xlarge,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  
  welcomeTextContainer: {
    flex: 1,
  },
  
  welcomeText: {
    ...Theme.typography.h3,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
    fontWeight: '400',
  },
  
  userName: {
    ...Theme.typography.h2,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  
  welcomeSubtext: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
  },
  
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    ...Theme.shadows.small,
  },
  
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  
  statCard: {
    width: (width - Theme.spacing.md * 3) / 2,
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    paddingVertical: Theme.spacing.lg,
  },
  
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  
  statValue: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  
  statLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  
  sectionCard: {
    marginBottom: Theme.spacing.lg,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  
  sectionTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  
  seeAllText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  
  lectureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  lectureInfo: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  
  lectureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  
  lectureTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    flex: 1,
  },
  
  nowBadge: {
    backgroundColor: Theme.colors.error,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.small,
    marginLeft: Theme.spacing.sm,
  },
  
  nowText: {
    ...Theme.typography.caption,
    color: Theme.colors.surface,
    fontWeight: 'bold',
  },
  
  lectureProfessor: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  
  lectureDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  lectureDetailText: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
    marginRight: Theme.spacing.sm,
  },
  
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  taskInfo: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  
  taskTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  taskCourse: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  taskDueDate: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
  },
  
  priorityBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.small,
  },
  
  priorityText: {
    ...Theme.typography.caption,
    color: Theme.colors.surface,
    fontWeight: 'bold',
  },
  
  quickActionsContainer: {
    marginBottom: Theme.spacing.lg,
  },
  
  quickActionCard: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.large,
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  
  quickActionTextContainer: {
    flex: 1,
  },
  
  quickActionTitle: {
    ...Theme.typography.body,
    color: Theme.colors.surface,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  
  quickActionSubtitle: {
    ...Theme.typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
