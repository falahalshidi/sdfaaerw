import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import CustomTimePicker from '../components/CustomTimePicker';
import { Theme } from '../constants/theme';

const courses = [
  'مقدمة في البرمجة',
  'قواعد البيانات',
  'هيكلة البيانات',
  'الذكاء الاصطناعي',
  'شبكات الحاسوب',
  'أمن المعلومات',
  'تطوير التطبيقات',
  'الذكاء الاصطناعي',
];

const professors = [
  'د. أحمد محمد',
  'د. فاطمة علي',
  'د. محمد السعيد',
  'د. نورا أحمد',
  'د. خالد العتيبي',
  'د. سارة القحطاني',
];

const locations = [
  'قاعة 101',
  'قاعة 102',
  'قاعة 205',
  'قاعة 301',
  'قاعة 302',
  'مختبر الحاسوب 1',
  'مختبر الحاسوب 2',
  'قاعة المحاضرات الكبرى',
];

export default function AddLectureScreen({ navigation }: any) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<'start' | 'end'>('start');
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [showProfessorPicker, setShowProfessorPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  const [lecture, setLecture] = useState({
    title: '',
    course: '',
    professor: '',
    location: '',
    startTime: new Date(),
    endTime: new Date(),
    reminderTime: 15, // بالدقائق
  });

  const handleSaveLecture = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!lecture.title.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال عنوان المحاضرة');
      return;
    }

    if (!lecture.course) {
      Alert.alert('خطأ', 'يرجى اختيار المقرر');
      return;
    }

    if (!lecture.professor) {
      Alert.alert('خطأ', 'يرجى اختيار الأستاذ');
      return;
    }

    if (!lecture.location) {
      Alert.alert('خطأ', 'يرجى اختيار المكان');
      return;
    }

    // محاكاة حفظ المحاضرة
    Alert.alert(
      'تم بنجاح',
      'تم إضافة المحاضرة بنجاح',
      [
        {
          text: 'موافق',
          onPress: () => {
            // إعادة تعيين النموذج
            setLecture({
              title: '',
              course: '',
              professor: '',
              location: '',
              startTime: new Date(),
              endTime: new Date(Date.now() + 60 * 60 * 1000), // ساعة واحدة لاحقاً
              reminderTime: 15,
            });
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleTimeChange = (selectedTime: Date) => {
    if (timePickerMode === 'start') {
      setLecture({ ...lecture, startTime: selectedTime });
    } else {
      setLecture({ ...lecture, endTime: selectedTime });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleSelectCourse = (course: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLecture({ ...lecture, course });
    setShowCoursePicker(false);
  };

  const handleSelectProfessor = (professor: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLecture({ ...lecture, professor });
    setShowProfessorPicker(false);
  };

  const handleSelectLocation = (location: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLecture({ ...lecture, location });
    setShowLocationPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إضافة محاضرة جديدة</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard} variant="elevated">
          <Input
            label="عنوان المحاضرة"
            placeholder="أدخل عنوان المحاضرة"
            value={lecture.title}
            onChangeText={(text) => setLecture({ ...lecture, title: text })}
            leftIcon="book-outline"
          />

          {/* اختيار المقرر */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>المقرر</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCoursePicker(true);
              }}
            >
              <Text style={[styles.pickerText, !lecture.course && styles.placeholderText]}>
                {lecture.course || 'اختر المقرر'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* اختيار الأستاذ */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>الأستاذ</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowProfessorPicker(true);
              }}
            >
              <Text style={[styles.pickerText, !lecture.professor && styles.placeholderText]}>
                {lecture.professor || 'اختر الأستاذ'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* اختيار المكان */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>مكان المحاضرة</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowLocationPicker(true);
              }}
            >
              <Text style={[styles.pickerText, !lecture.location && styles.placeholderText]}>
                {lecture.location || 'اختر المكان'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* اختيار الوقت */}
          <View style={styles.timeContainer}>
            <View style={styles.timeInput}>
              <Text style={styles.inputLabel}>وقت البداية</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTimePickerMode('start');
                  setShowTimePicker(true);
                }}
              >
                <Ionicons name="time-outline" size={20} color={Theme.colors.primary} />
                <Text style={styles.timeText}>{formatTime(lecture.startTime)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeInput}>
              <Text style={styles.inputLabel}>وقت النهاية</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTimePickerMode('end');
                  setShowTimePicker(true);
                }}
              >
                <Ionicons name="time-outline" size={20} color={Theme.colors.primary} />
                <Text style={styles.timeText}>{formatTime(lecture.endTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* إعدادات التذكير */}
          <View style={styles.reminderContainer}>
            <Text style={styles.inputLabel}>التذكير قبل المحاضرة</Text>
            <View style={styles.reminderOptions}>
              {[5, 15, 30, 60].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.reminderOption,
                    lecture.reminderTime === minutes && styles.selectedReminderOption,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setLecture({ ...lecture, reminderTime: minutes });
                  }}
                >
                  <Text style={[
                    styles.reminderText,
                    lecture.reminderTime === minutes && styles.selectedReminderText,
                  ]}>
                    {minutes} دقيقة
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="إضافة المحاضرة"
            onPress={handleSaveLecture}
            size="large"
            style={styles.saveButton}
          />
        </View>
      </ScrollView>

      {/* منتقي الوقت */}
      <CustomTimePicker
        visible={showTimePicker}
        value={timePickerMode === 'start' ? lecture.startTime : lecture.endTime}
        onTimeChange={handleTimeChange}
        onClose={() => setShowTimePicker(false)}
        title={timePickerMode === 'start' ? 'اختر وقت البداية' : 'اختر وقت النهاية'}
      />

      {/* منتقي المقرر */}
      {showCoursePicker && (
        <View style={styles.pickerModal}>
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>اختر المقرر</Text>
              <TouchableOpacity onPress={() => setShowCoursePicker(false)}>
                <Ionicons name="close" size={24} color={Theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course}
                  style={styles.pickerItem}
                  onPress={() => handleSelectCourse(course)}
                >
                  <Text style={styles.pickerItemText}>{course}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* منتقي الأستاذ */}
      {showProfessorPicker && (
        <View style={styles.pickerModal}>
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>اختر الأستاذ</Text>
              <TouchableOpacity onPress={() => setShowProfessorPicker(false)}>
                <Ionicons name="close" size={24} color={Theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {professors.map((professor) => (
                <TouchableOpacity
                  key={professor}
                  style={styles.pickerItem}
                  onPress={() => handleSelectProfessor(professor)}
                >
                  <Text style={styles.pickerItemText}>{professor}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* منتقي المكان */}
      {showLocationPicker && (
        <View style={styles.pickerModal}>
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>اختر المكان</Text>
              <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                <Ionicons name="close" size={24} color={Theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={styles.pickerItem}
                  onPress={() => handleSelectLocation(location)}
                >
                  <Text style={styles.pickerItemText}>{location}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  backButton: {
    padding: Theme.spacing.sm,
  },
  
  headerTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  
  placeholder: {
    width: 40,
  },
  
  content: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  
  formCard: {
    marginBottom: Theme.spacing.lg,
  },
  
  inputContainer: {
    marginBottom: Theme.spacing.lg,
  },
  
  inputLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    fontWeight: '500',
  },
  
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  
  pickerText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  
  placeholderText: {
    color: Theme.colors.textLight,
  },
  
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  
  timeInput: {
    flex: 0.48,
  },
  
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  
  timeText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
  
  reminderContainer: {
    marginBottom: Theme.spacing.lg,
  },
  
  reminderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  
  reminderOption: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  
  selectedReminderOption: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  
  reminderText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
  },
  
  selectedReminderText: {
    color: Theme.colors.surface,
    fontWeight: '600',
  },
  
  buttonContainer: {
    paddingBottom: Theme.spacing.xl,
  },
  
  saveButton: {
    width: '100%',
  },
  
  pickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  pickerContent: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.large,
    margin: Theme.spacing.lg,
    maxHeight: '70%',
    width: '90%',
    ...Theme.shadows.large,
  },
  
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  pickerTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  
  pickerList: {
    maxHeight: 300,
  },
  
  pickerItem: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  pickerItemText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
});
