import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import CustomTimePicker from '../components/CustomTimePicker';
import { Theme } from '../constants/theme';
import { HapticFeedback } from '../utils/haptics';

// بيانات أولية للجدولة
const initialScheduleData = [
  {
    id: '1',
    title: 'مقدمة في البرمجة',
    professor: 'د. أحمد محمد',
    startTime: '09:00',
    endTime: '10:30',
    location: 'قاعة 101',
    day: 'الأحد',
    color: '#4A90E2',
  },
  {
    id: '2',
    title: 'قواعد البيانات',
    professor: 'د. فاطمة علي',
    startTime: '10:45',
    endTime: '12:15',
    location: 'قاعة 205',
    day: 'الأحد',
    color: '#50C878',
  },
  {
    id: '3',
    title: 'هيكلة البيانات',
    professor: 'د. محمد السعيد',
    startTime: '14:00',
    endTime: '15:30',
    location: 'قاعة 301',
    day: 'الاثنين',
    color: '#FF6B6B',
  },
  {
    id: '4',
    title: 'الذكاء الاصطناعي',
    professor: 'د. نورا أحمد',
    startTime: '09:00',
    endTime: '10:30',
    location: 'قاعة 102',
    day: 'الثلاثاء',
    color: '#FFA726',
  },
];

const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState('الأحد');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [lectures, setLectures] = useState(initialScheduleData);
  const [editingLecture, setEditingLecture] = useState<any | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<'start' | 'end'>('start');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);
  const [editTimePickerMode, setEditTimePickerMode] = useState<'start' | 'end'>('start');
  const [editSelectedTime, setEditSelectedTime] = useState(new Date());
  
  // بيانات المحاضرة الجديدة
  const [newLecture, setNewLecture] = useState({
    title: '',
    professor: '',
    location: '',
    startTime: new Date(),
    endTime: new Date(),
    day: selectedDay,
  });

  const filteredLectures = lectures.filter(lecture => lecture.day === selectedDay);

  const handleAddLecture = () => {
    const id = String(Date.now());
    const toAdd = {
      id,
      title: newLecture.title || 'محاضرة بدون عنوان',
      professor: newLecture.professor || 'غير محدد',
      location: newLecture.location || 'غير محدد',
      startTime: formatTime(newLecture.startTime),
      endTime: formatTime(newLecture.endTime),
      day: selectedDay,
      color: '#4A90E2',
    };
    setLectures(prev => [...prev, toAdd]);
    setShowAddModal(false);
    setNewLecture({
      title: '',
      professor: '',
      location: '',
      startTime: new Date(),
      endTime: new Date(),
      day: selectedDay,
    });
  };

  const startEditLecture = (lecture: any) => {
    setEditingLecture(lecture);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingLecture) return;
    setLectures(prev => prev.map(l => l.id === editingLecture.id ? {
      ...l,
      title: editingLecture.title,
      professor: editingLecture.professor,
      location: editingLecture.location,
      startTime: editingLecture.startTime,
      endTime: editingLecture.endTime,
      day: editingLecture.day,
    } : l));
    setShowEditModal(false);
    setEditingLecture(null);
  };

  const handleDeleteLecture = (lectureId: string) => {
    setLectures(prev => prev.filter(l => l.id !== lectureId));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const renderLectureItem = ({ item }: { item: any }) => (
    <Card style={styles.lectureCard} variant="elevated">
      <View style={styles.lectureHeader}>
        <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
        <View style={styles.lectureInfo}>
          <Text style={styles.lectureTitle}>{item.title}</Text>
          <Text style={styles.lectureProfessor}>{item.professor}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{item.startTime} - {item.endTime}</Text>
        </View>
      </View>
      
      <View style={styles.lectureDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color={Theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={Theme.colors.textSecondary} />
          <Text style={styles.detailText}>مدة المحاضرة: 1.5 ساعة</Text>
        </View>
      </View>
      
      <View style={styles.lectureActions}>
        <Button
          title="تعديل"
          onPress={() => startEditLecture(item)}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
        <Button
          title="حذف"
          onPress={() => {
            HapticFeedback.light();
            handleDeleteLecture(item.id);
          }}
          variant="outline"
          size="small"
          style={styles.actionButton}
          textStyle={{ color: Theme.colors.error }}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* شريط الأيام */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daysContainer}
        contentContainerStyle={styles.daysContent}
      >
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[
              styles.dayText,
              selectedDay === day && styles.selectedDayText,
            ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* قائمة المحاضرات */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>
            محاضرات {selectedDay} ({filteredLectures.length})
          </Text>
          <Button
            title="إضافة محاضرة"
            onPress={() => {
               HapticFeedback.light();
               navigation.navigate('AddLecture' as never);
             }}
            icon={<Ionicons name="add" size={20} color={Theme.colors.surface} />}
            size="small"
          />
        </View>

        {filteredLectures.length > 0 ? (
          <FlatList
            data={filteredLectures}
            renderItem={renderLectureItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.lecturesList}
          />
        ) : (
          <Card style={styles.emptyCard} variant="elevated">
            <Ionicons name="calendar-outline" size={60} color={Theme.colors.textLight} />
            <Text style={styles.emptyTitle}>لا توجد محاضرات</Text>
            <Text style={styles.emptyText}>
              لا توجد محاضرات مجدولة ليوم {selectedDay}
            </Text>
            <Button
              title="إضافة محاضرة"
              onPress={() => {
                HapticFeedback.light();
                navigation.navigate('AddLecture' as never);
              }}
              style={styles.emptyButton}
            />
          </Card>
        )}
      </View>

      {/* نافذة إضافة محاضرة */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>إضافة محاضرة جديدة</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Card style={styles.formCard} variant="elevated">
              <Input
                label="عنوان المحاضرة"
                placeholder="أدخل عنوان المحاضرة"
                value={newLecture.title}
                onChangeText={(text) => setNewLecture({ ...newLecture, title: text })}
                leftIcon="book-outline"
              />

              <Input
                label="اسم الأستاذ"
                placeholder="أدخل اسم الأستاذ"
                value={newLecture.professor}
                onChangeText={(text) => setNewLecture({ ...newLecture, professor: text })}
                leftIcon="person-outline"
              />

              <Input
                label="مكان المحاضرة"
                placeholder="أدخل مكان المحاضرة"
                value={newLecture.location}
                onChangeText={(text) => setNewLecture({ ...newLecture, location: text })}
                leftIcon="location-outline"
              />

              {/* أوقات المحاضرة */}
              <View style={styles.timeContainer}>
                <View style={styles.timeInput}>
                  <Text style={styles.inputLabel}>وقت البداية</Text>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      HapticFeedback.light();
                      setTimePickerMode('start');
                      setShowTimePicker(true);
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color={Theme.colors.primary} />
                    <Text style={styles.timeText}>{formatTime(newLecture.startTime)}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.timeInput}>
                  <Text style={styles.inputLabel}>وقت النهاية</Text>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      HapticFeedback.light();
                      setTimePickerMode('end');
                      setShowTimePicker(true);
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color={Theme.colors.primary} />
                    <Text style={styles.timeText}>{formatTime(newLecture.endTime)}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowAddModal(false)}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="إضافة المحاضرة"
                  onPress={handleAddLecture}
                  style={styles.addButton}
                />
              </View>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* منتقي الوقت */}
      <CustomTimePicker
        visible={showTimePicker}
        value={selectedTime}
        onTimeChange={(time: Date) => {
          if (timePickerMode === 'start') {
            setNewLecture(prev => ({ ...prev, startTime: time }));
          } else {
            setNewLecture(prev => ({ ...prev, endTime: time }));
          }
        }}
        onClose={() => setShowTimePicker(false)}
        title={timePickerMode === 'start' ? 'وقت البداية' : 'وقت النهاية'}
      />

      {/* نافذة تعديل محاضرة */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>تعديل المحاضرة</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Ionicons name="close" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Input
              label="عنوان المحاضرة"
              placeholder="أدخل عنوان المحاضرة"
              value={editingLecture?.title || ''}
              onChangeText={(text) => setEditingLecture((prev: any) => ({ ...prev, title: text }))}
              leftIcon="book-outline"
            />
            <Input
              label="اسم الأستاذ"
              placeholder="أدخل اسم الأستاذ"
              value={editingLecture?.professor || ''}
              onChangeText={(text) => setEditingLecture((prev: any) => ({ ...prev, professor: text }))}
              leftIcon="person-outline"
            />
            <Input
              label="مكان المحاضرة"
              placeholder="أدخل مكان المحاضرة"
              value={editingLecture?.location || ''}
              onChangeText={(text) => setEditingLecture((prev: any) => ({ ...prev, location: text }))}
              leftIcon="location-outline"
            />
            <View style={styles.timeInputsContainer}>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setEditTimePickerMode('start');
                  setShowEditTimePicker(true);
                }}
              >
                <Text style={styles.timeInputLabel}>وقت البداية</Text>
                <View style={styles.timeInputContent}>
                  <Text style={styles.timeInputText}>{editingLecture?.startTime}</Text>
                  <Ionicons name="time-outline" size={20} color={Theme.colors.primary} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setEditTimePickerMode('end');
                  setShowEditTimePicker(true);
                }}
              >
                <Text style={styles.timeInputLabel}>وقت النهاية</Text>
                <View style={styles.timeInputContent}>
                  <Text style={styles.timeInputText}>{editingLecture?.endTime}</Text>
                  <Ionicons name="time-outline" size={20} color={Theme.colors.primary} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="إلغاء"
                onPress={() => setShowEditModal(false)}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="حفظ التعديلات"
                onPress={handleSaveEdit}
                style={styles.addButton}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* منتقي الوقت للتعديل */}
      <CustomTimePicker
        visible={showEditTimePicker}
        value={editSelectedTime}
        onTimeChange={(time: Date) => {
          const timeString = time.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          
          if (editTimePickerMode === 'start') {
            setEditingLecture((prev: any) => ({ ...prev, startTime: timeString }));
          } else {
            setEditingLecture((prev: any) => ({ ...prev, endTime: timeString }));
          }
        }}
        onClose={() => setShowEditTimePicker(false)}
        title={editTimePickerMode === 'start' ? 'وقت البداية' : 'وقت النهاية'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  
  daysContainer: {
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  daysContent: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  
  dayButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.medium,
    backgroundColor: Theme.colors.background,
  },
  
  selectedDayButton: {
    backgroundColor: Theme.colors.primary,
  },
  
  dayText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  
  selectedDayText: {
    color: Theme.colors.surface,
    fontWeight: 'bold',
  },
  
  content: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  
  header: {
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
  
  lecturesList: {
    paddingBottom: Theme.spacing.lg,
  },
  
  lectureCard: {
    marginBottom: Theme.spacing.md,
  },
  
  lectureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Theme.spacing.sm,
  },
  
  lectureInfo: {
    flex: 1,
  },
  
  lectureTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  lectureProfessor: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
  },
  
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },

  timeText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
  
  lectureDetails: {
    marginBottom: Theme.spacing.sm,
  },
  
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  
  detailText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  
  lectureActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  
  actionButton: {
    marginLeft: Theme.spacing.sm,
    minWidth: 80,
  },
  
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  
  emptyTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  
  emptyText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  
  emptyButton: {
    minWidth: 150,
  },
  
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
    backgroundColor: Theme.colors.surface,
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
  
  timeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Theme.spacing.md,
  },
  
  timeInput: {
    flex: 0.48,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
  },
  
  timeInputLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
    fontWeight: '500',
  },
  
  timeInputContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  timeInputText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xl,
  },
  
  cancelButton: {
    flex: 0.45,
  },
  
  addButton: {
    flex: 0.45,
  },

  formCard: {
    marginBottom: Theme.spacing.lg,
  },

  inputLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    fontWeight: '500',
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
});
