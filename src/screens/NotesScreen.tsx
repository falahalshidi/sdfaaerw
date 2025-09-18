import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import Card from '../components/Card';
import Button from '../components/Button';
import { Theme } from '../constants/theme';

// بيانات وهمية للملاحظات
const notesData = [
  {
    id: '1',
    title: 'ملاحظات مقدمة في البرمجة',
    content: 'تحدثنا اليوم عن المتغيرات والدوال في JavaScript...',
    course: 'مقدمة في البرمجة',
    date: '2024-01-10',
    type: 'text',
    isImportant: true,
  },
  {
    id: '2',
    title: 'ملخص قواعد البيانات',
    content: 'العلاقات بين الجداول وأنواع البيانات المختلفة...',
    course: 'قواعد البيانات',
    date: '2024-01-09',
    type: 'text',
    isImportant: false,
  },
  {
    id: '3',
    title: 'تسجيل صوتي - هيكلة البيانات',
    content: 'تسجيل صوتي لمحاضرة هيكلة البيانات',
    course: 'هيكلة البيانات',
    date: '2024-01-08',
    type: 'audio',
    duration: '15:30',
    isImportant: false,
  },
];

export default function NotesScreen({ route }: any) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [noteType, setNoteType] = useState<'text' | 'audio'>('text');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    course: '',
  });
  
  // حالة التسجيل الصوتي
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const filters = [
    { key: 'all', label: 'الكل', icon: 'list' },
    { key: 'text', label: 'نص', icon: 'document-text' },
    { key: 'audio', label: 'صوت', icon: 'mic' },
    { key: 'important', label: 'مهم', icon: 'star' },
  ];
  
  useEffect(() => {
    // طلب الإذن للتسجيل الصوتي
    const getPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'لم يتم منح إذن التسجيل الصوتي');
      }
    };
    
    getPermissions();
    
    // إذا تم فتح الشاشة مع طلب فتح نافذة الإضافة
    if (route?.params?.openAddModal) {
      setShowAddModal(true);
    }
    
    // تنظيف عند مغادرة الشاشة
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, []);

  const filteredNotes = notesData.filter(note => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'text') return note.type === 'text';
    if (selectedFilter === 'audio') return note.type === 'audio';
    if (selectedFilter === 'important') return note.isImportant;
    return true;
  });

  const handleAddNote = () => {
    if (noteType === 'text' && (!newNote.title || !newNote.content || !newNote.course)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }
    // في الملاحظة الصوتية: لا نفرض حقول نصية إذا كان هناك تسجيل
    if (noteType === 'audio') {
      if (!audioUri) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('خطأ', 'يرجى تسجيل ملاحظة صوتية قبل الحفظ');
        return;
      }
    }

    // هنا سيتم إضافة الملاحظة الجديدة
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('تم الحفظ', 'تم حفظ الملاحظة بنجاح');
    console.log('إضافة ملاحظة:', { 
      ...newNote, 
      type: noteType,
      audioUri: audioUri,
      duration: recordingDuration
    });
    
    setShowAddModal(false);
    setNewNote({ title: '', content: '', course: '' });
    setAudioUri(null);
    setRecordingDuration(0);
    setIsPlaying(false);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  const startRecording = async () => {
    try {
      // إعداد الجلسة الصوتية
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setNoteType('audio');
      
      // بدء التسجيل
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // بدء العداد
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      setRecordingTimer(timer);
      
    } catch (err) {
      console.error('فشل في بدء التسجيل', err);
      Alert.alert('خطأ', 'حدث خطأ أثناء بدء التسجيل');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      
      // إيقاف العداد
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
      
      // الحصول على URI للتسجيل
      const uri = recording.getURI();
      setAudioUri(uri || null);
      setIsRecording(false);
      setRecording(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
    } catch (err) {
      console.error('فشل في إيقاف التسجيل', err);
      Alert.alert('خطأ', 'حدث خطأ أثناء إيقاف التسجيل');
    }
  };

  const playRecording = async () => {
    if (!audioUri) return;
    try {
      // إذا كان هناك صوت قيد التشغيل، قم بالإيقاف المؤقت/الإلغاء
      if (sound) {
        const status = await sound.getStatusAsync();
        if ((status as any).isLoaded && (status as any).isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
          return;
        }
      }

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, volume: 1.0, isLooping: false }
      );

      setSound(newSound);
      setIsPlaying(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish || status.positionMillis === status.durationMillis) {
          setIsPlaying(false);
          // إعادة المؤشر للبداية
          newSound.setPositionAsync(0);
        }
      });
    } catch (err) {
      console.error('فشل في تشغيل التسجيل', err);
      Alert.alert('خطأ', 'حدث خطأ أثناء تشغيل التسجيل');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  const renderNoteItem = (note: any) => (
    <Card key={note.id} style={styles.noteCard} variant="elevated">
      <View style={styles.noteHeader}>
        <View style={styles.noteInfo}>
          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.noteCourse}>{note.course}</Text>
          <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
        </View>
        <View style={styles.noteActions}>
          {note.isImportant && (
            <Ionicons name="star" size={20} color={Theme.colors.warning} />
          )}
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={Theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.noteContent}>
        {note.type === 'audio' ? (
          <View style={styles.audioNote}>
            <Ionicons name="play-circle" size={40} color={Theme.colors.primary} />
            <View style={styles.audioInfo}>
              <Text style={styles.audioTitle}>تسجيل صوتي</Text>
              <Text style={styles.audioDuration}>{note.duration}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noteText} numberOfLines={3}>
            {note.content}
          </Text>
        )}
      </View>

      <View style={styles.noteFooter}>
        <View style={styles.noteTags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{note.type === 'text' ? 'نص' : 'صوت'}</Text>
          </View>
          {note.isImportant && (
            <View style={[styles.tag, { backgroundColor: Theme.colors.warning }]}>
              <Text style={[styles.tagText, { color: Theme.colors.surface }]}>مهم</Text>
            </View>
          )}
        </View>
        <Button
          title="عرض"
          onPress={() => {}}
          variant="outline"
          size="small"
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* شريط الفلاتر */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Ionicons 
              name={filter.icon as keyof typeof Ionicons.glyphMap} 
              size={16} 
              color={selectedFilter === filter.key ? Theme.colors.surface : Theme.colors.primary} 
            />
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.selectedFilterText,
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* المحتوى الرئيسي */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>
            ملاحظاتي ({filteredNotes.length})
          </Text>
          <Button
            title="إضافة ملاحظة"
            onPress={() => setShowAddModal(true)}
            icon={<Ionicons name="add" size={20} color={Theme.colors.surface} />}
            size="small"
          />
        </View>

        {filteredNotes.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredNotes.map(renderNoteItem)}
          </ScrollView>
        ) : (
          <Card style={styles.emptyCard} variant="elevated">
            <Ionicons name="document-text-outline" size={60} color={Theme.colors.textLight} />
            <Text style={styles.emptyTitle}>لا توجد ملاحظات</Text>
            <Text style={styles.emptyText}>
              ابدأ بتسجيل ملاحظاتك الأولى
            </Text>
            <Button
              title="إضافة ملاحظة"
              onPress={() => setShowAddModal(true)}
              style={styles.emptyButton}
            />
          </Card>
        )}
      </View>

      {/* نافذة إضافة ملاحظة */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>إضافة ملاحظة جديدة</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* نوع الملاحظة */}
            <View style={styles.noteTypeContainer}>
              <Text style={styles.inputLabel}>نوع الملاحظة</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    noteType === 'text' && styles.selectedTypeButton,
                  ]}
                  onPress={() => setNoteType('text')}
                >
                  <Ionicons 
                    name="document-text" 
                    size={24} 
                    color={noteType === 'text' ? Theme.colors.surface : Theme.colors.primary} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    noteType === 'text' && styles.selectedTypeButtonText,
                  ]}>
                    نص
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    noteType === 'audio' && styles.selectedTypeButton,
                  ]}
                  onPress={() => setNoteType('audio')}
                >
                  <Ionicons 
                    name="mic" 
                    size={24} 
                    color={noteType === 'audio' ? Theme.colors.surface : Theme.colors.primary} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    noteType === 'audio' && styles.selectedTypeButtonText,
                  ]}>
                    صوت
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {noteType === 'text' ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>عنوان الملاحظة</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="أدخل عنوان الملاحظة"
                      value={newNote.title}
                      onChangeText={(text) => setNewNote({ ...newNote, title: text })}
                      placeholderTextColor={Theme.colors.textLight}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>المادة</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="أدخل اسم المادة"
                      value={newNote.course}
                      onChangeText={(text) => setNewNote({ ...newNote, course: text })}
                      placeholderTextColor={Theme.colors.textLight}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>محتوى الملاحظة</Text>
                  <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      placeholder="اكتب ملاحظاتك هنا..."
                      value={newNote.content}
                      onChangeText={(text) => setNewNote({ ...newNote, content: text })}
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      placeholderTextColor={Theme.colors.textLight}
                    />
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.audioContainer}>
                {audioUri ? (
                  <View style={styles.audioPreview}>
                    <View style={styles.audioPreviewHeader}>
                      <Text style={styles.audioPreviewTitle}>التسجيل الصوتي</Text>
                      <Text style={styles.audioDuration}>{formatTime(recordingDuration)}</Text>
                    </View>
                    <View style={styles.audioControls}>
                      <TouchableOpacity 
                        style={styles.audioControlButton}
                        onPress={playRecording}
                      >
                        <Ionicons 
                          name={isPlaying ? "pause-circle" : "play-circle"} 
                          size={60} 
                          color={Theme.colors.primary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.audioDeleteButton}
                        onPress={() => {
                          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                          setAudioUri(null);
                          setRecordingDuration(0);
                        }}
                      >
                        <Ionicons name="trash" size={24} color={Theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.audioPlaceholder}>
                    <Ionicons 
                      name={isRecording ? "radio" : "mic"} 
                      size={60} 
                      color={isRecording ? Theme.colors.error : Theme.colors.primary} 
                    />
                    <Text style={styles.audioPlaceholderText}>
                      {isRecording 
                        ? `جاري التسجيل... ${formatTime(recordingDuration)}` 
                        : 'اضغط لبدء التسجيل الصوتي'
                      }
                    </Text>
                    <Button
                      title={isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
                      onPress={handleStartRecording}
                      style={StyleSheet.flatten([
                        styles.recordButton,
                        isRecording && styles.stopRecordButton
                      ])}
                      variant={isRecording ? "outline" : "primary"}
                    />
                  </View>
                )}
              </View>
            )}

            <View style={styles.modalActions}>
              <Button
                title="إلغاء"
                onPress={() => setShowAddModal(false)}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="حفظ الملاحظة"
                onPress={handleAddNote}
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
  
  filtersContainer: {
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  filtersContent: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.medium,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  
  selectedFilterButton: {
    backgroundColor: Theme.colors.primary,
  },
  
  filterText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.xs,
    fontWeight: '500',
  },
  
  selectedFilterText: {
    color: Theme.colors.surface,
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
  
  noteCard: {
    marginBottom: Theme.spacing.md,
  },
  
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  
  noteInfo: {
    flex: 1,
  },
  
  noteTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  noteCourse: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  
  noteDate: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
  },
  
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  actionButton: {
    marginLeft: Theme.spacing.sm,
    padding: Theme.spacing.xs,
  },
  
  noteContent: {
    marginBottom: Theme.spacing.sm,
  },
  
  noteText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    lineHeight: 22,
  },
  
  audioNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.medium,
  },
  
  audioInfo: {
    marginLeft: Theme.spacing.md,
  },
  
  audioTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
  },
  
  audioDuration: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  noteTags: {
    flexDirection: 'row',
  },
  
  tag: {
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.small,
    marginRight: Theme.spacing.xs,
  },
  
  tagText: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
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
  
  noteTypeContainer: {
    marginBottom: Theme.spacing.lg,
  },
  
  inputLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    fontWeight: '500',
  },
  
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  typeButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.background,
  },
  
  selectedTypeButton: {
    backgroundColor: Theme.colors.primary,
  },
  
  typeButtonText: {
    ...Theme.typography.body,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.sm,
    fontWeight: '500',
  },
  
  selectedTypeButtonText: {
    color: Theme.colors.surface,
  },
  
  inputContainer: {
    marginBottom: Theme.spacing.lg,
  },
  
  inputWrapper: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  
  textInput: {
    padding: Theme.spacing.md,
    ...Theme.typography.body,
    color: Theme.colors.text,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  textAreaWrapper: {
    minHeight: 120,
  },
  
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  
  audioContainer: {
    marginBottom: Theme.spacing.lg,
  },
  
  audioPlaceholder: {
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.xl,
  },
  
  audioPlaceholderText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: Theme.spacing.md,
  },
  
  recordButton: {
    marginTop: Theme.spacing.sm,
    minWidth: 150,
  },
  
  stopRecordButton: {
    borderColor: Theme.colors.error,
  },
  
  audioPreview: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  
  audioPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  
  audioPreviewTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  audioControlButton: {
    padding: Theme.spacing.sm,
  },
  
  audioDeleteButton: {
    padding: Theme.spacing.sm,
    marginLeft: Theme.spacing.md,
  },
  
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xl,
  },
  
  cancelButton: {
    flex: 0.45,
  },
  
  saveButton: {
    flex: 0.45,
  },
});
