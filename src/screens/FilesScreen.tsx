import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import Card from '../components/Card';
import Button from '../components/Button';
import { Theme } from '../constants/theme';
import * as Haptics from 'expo-haptics';

// بيانات وهمية للملفات
const filesData = [
  {
    id: '1',
    name: 'محاضرة البرمجة - الفصل الأول',
    type: 'pdf',
    size: '2.5 MB',
    course: 'مقدمة في البرمجة',
    chapter: 'الفصل الأول',
    uploadedAt: '2024-01-10',
    isProcessed: true,
    summary: 'ملخص شامل لمفاهيم البرمجة الأساسية',
  },
  {
    id: '2',
    name: 'شرائح قواعد البيانات',
    type: 'pdf',
    size: '1.8 MB',
    course: 'قواعد البيانات',
    chapter: 'الفصل الثالث',
    uploadedAt: '2024-01-09',
    isProcessed: false,
  },
  {
    id: '3',
    name: 'تسجيل صوتي - هيكلة البيانات',
    type: 'audio',
    size: '15.2 MB',
    course: 'هيكلة البيانات',
    chapter: 'الفصل الثاني',
    uploadedAt: '2024-01-08',
    isProcessed: true,
    summary: 'شرح مفصل لخوارزميات الترتيب والبحث',
  },
  {
    id: '4',
    name: 'صورة السبورة - الذكاء الاصطناعي',
    type: 'image',
    size: '3.1 MB',
    course: 'الذكاء الاصطناعي',
    chapter: 'الفصل الرابع',
    uploadedAt: '2024-01-07',
    isProcessed: false,
  },
];

const courses = ['الكل', 'مقدمة في البرمجة', 'قواعد البيانات', 'هيكلة البيانات', 'الذكاء الاصطناعي'];

export default function FilesScreen({ route }: any) {
  const [selectedCourse, setSelectedCourse] = useState('الكل');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<any | null>(null);
  const [files, setFiles] = useState<any[]>(filesData);
  const [selectedFileType, setSelectedFileType] = useState<'pdf' | 'image' | 'audio' | 'video'>('pdf');
  const [newFile, setNewFile] = useState({
    name: '',
    course: '',
    chapter: '',
    uri: '',
    size: 0,
    type: '',
  });
  
  const [pickedDocument, setPickedDocument] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  
  useEffect(() => {
    // إذا تم فتح الشاشة مع طلب فتح نافذة الرفع
    if (route?.params?.openUploadModal) {
      setShowUploadModal(true);
    }
  }, []);

  const filteredFiles = files.filter(file => 
    selectedCourse === 'الكل' || file.course === selectedCourse
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'image':
        return 'image';
      case 'audio':
        return 'musical-notes';
      case 'video':
        return 'videocam';
      default:
        return 'document';
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return Theme.colors.error;
      case 'image':
        return Theme.colors.success;
      case 'audio':
        return Theme.colors.warning;
      case 'video':
        return Theme.colors.primary;
      default:
        return Theme.colors.textSecondary;
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setPickedDocument(result);
        
        // تحديث معلومات الملف
        setNewFile(prev => ({
          ...prev,
          name: file.name || 'ملف جديد',
          uri: file.uri,
          size: file.size || 0,
          type: file.mimeType || 'application/pdf',
        }));
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (err) {
      console.error('خطأ في اختيار الملف:', err);
      Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الملف');
    }
  };
  
  const handleUploadFile = async () => {
    if (!newFile.name || !newFile.course || !newFile.chapter) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }
    
    if (!newFile.uri) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('خطأ', 'يرجى اختيار ملف للرفع');
      return;
    }

    try {
      // محاكاة رفع الملف
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // عرض رسالة نجاح
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('تم الرفع', 'تم رفع الملف بنجاح وسيتم معالجته قريباً');
      
      // إضافة الملف إلى القائمة (في تطبيق حقيقي، سيتم حفظه في قاعدة البيانات)
      const id = String(Date.now());
      const normalized: any = {
        id,
        name: newFile.name,
        type: (newFile.type.includes('pdf') ? 'pdf' : newFile.type.includes('image') ? 'image' : newFile.type.includes('audio') ? 'audio' : newFile.type.includes('video') ? 'video' : 'document'),
        size: `${(newFile.size / 1024 / 1024).toFixed(2)} MB`,
        course: newFile.course,
        chapter: newFile.chapter,
        uploadedAt: new Date().toISOString().slice(0,10),
        isProcessed: false,
      };
      setFiles(prev => [normalized, ...prev]);
      
      // إعادة تعيين النموذج
      setShowUploadModal(false);
      setNewFile({
        name: '',
        course: '',
        chapter: '',
        uri: '',
        size: 0,
        type: '',
      });
      setPickedDocument(null);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('خطأ', 'حدث خطأ أثناء رفع الملف');
    }
  };

  const handleViewFile = (fileId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const file = files.find(f => f.id === fileId);
    if (file) {
      setPreviewFile(file);
      setShowPreviewModal(true);
    } else {
      Alert.alert('خطأ', 'تعذر فتح الملف');
    }
  };

  const handleProcessFile = (fileId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('معالجة الملف', 'سيتم معالجة الملف باستخدام الذكاء الاصطناعي');
  };

  const handleGenerateSummary = (fileId: string) => {
    HapticFeedback.medium();
    Alert.alert('إنشاء ملخص', 'سيتم إنشاء ملخص ذكي للملف');
  };

  const handleGenerateQuiz = (fileId: string) => {
    HapticFeedback.medium();
    Alert.alert('إنشاء اختبار', 'سيتم إنشاء اختبار من محتوى الملف');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  const renderFileItem = ({ item }: { item: any }) => (
    <Card style={styles.fileCard} variant="elevated">
      <View style={styles.fileHeader}>
        <View style={styles.fileIconContainer}>
          <Ionicons 
            name={getFileIcon(item.type) as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={getFileTypeColor(item.type)} 
          />
        </View>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.fileCourse}>{item.course} - {item.chapter}</Text>
          <View style={styles.fileMeta}>
            <Text style={styles.fileSize}>{item.size}</Text>
            <Text style={styles.fileDate}>{formatDate(item.uploadedAt)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {item.isProcessed && item.summary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>الملخص الذكي:</Text>
          <Text style={styles.summaryText}>{item.summary}</Text>
        </View>
      )}

      <View style={styles.fileActions}>
        <Button
          title="عرض"
          onPress={() => handleViewFile(item.id)}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
        
        {!item.isProcessed && (
          <Button
            title="معالجة"
            onPress={() => handleProcessFile(item.id)}
            variant="primary"
            size="small"
            style={styles.actionButton}
          />
        )}
        
        {item.isProcessed && (
          <>
            <Button
              title="ملخص"
              onPress={() => handleGenerateSummary(item.id)}
              variant="secondary"
              size="small"
              style={styles.actionButton}
            />
            <Button
              title="اختبار"
              onPress={() => handleGenerateQuiz(item.id)}
              variant="outline"
              size="small"
              style={styles.actionButton}
            />
          </>
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* شريط المقررات */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.coursesContainer}
        contentContainerStyle={styles.coursesContent}
      >
        {courses.map((course) => (
          <TouchableOpacity
            key={course}
            style={[
              styles.courseButton,
              selectedCourse === course && styles.selectedCourseButton,
            ]}
            onPress={() => setSelectedCourse(course)}
          >
            <Text style={[
              styles.courseText,
              selectedCourse === course && styles.selectedCourseText,
            ]}>
              {course}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* المحتوى الرئيسي */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>
            ملفاتي ({filteredFiles.length})
          </Text>
          <Button
            title="رفع ملف"
            onPress={() => setShowUploadModal(true)}
            icon={<Ionicons name="cloud-upload" size={20} color={Theme.colors.surface} />}
            size="small"
          />
        </View>

        {filteredFiles.length > 0 ? (
          <FlatList
            data={filteredFiles}
            renderItem={renderFileItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.filesList}
          />
        ) : (
          <Card style={styles.emptyCard} variant="elevated">
            <Ionicons name="folder-outline" size={60} color={Theme.colors.textLight} />
            <Text style={styles.emptyTitle}>لا توجد ملفات</Text>
            <Text style={styles.emptyText}>
              ابدأ برفع ملفاتك الأولى
            </Text>
            <Button
              title="رفع ملف"
              onPress={() => setShowUploadModal(true)}
              style={styles.emptyButton}
            />
          </Card>
        )}
      </View>

      {/* نافذة رفع الملف */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>رفع ملف جديد</Text>
            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
              <Ionicons name="close" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* نوع الملف */}
            <View style={styles.fileTypeContainer}>
              <Text style={styles.inputLabel}>نوع الملف</Text>
              <View style={styles.fileTypeButtons}>
                {[
                  { type: 'pdf', label: 'PDF', icon: 'document-text' },
                  { type: 'image', label: 'صورة', icon: 'image' },
                  { type: 'audio', label: 'صوت', icon: 'musical-notes' },
                  { type: 'video', label: 'فيديو', icon: 'videocam' },
                ].map((fileType) => (
                  <TouchableOpacity
                    key={fileType.type}
                    style={[
                      styles.fileTypeButton,
                      selectedFileType === fileType.type && styles.selectedFileTypeButton,
                    ]}
                    onPress={() => setSelectedFileType(fileType.type as any)}
                  >
                    <Ionicons 
                      name={fileType.icon as keyof typeof Ionicons.glyphMap} 
                      size={24} 
                      color={selectedFileType === fileType.type ? Theme.colors.surface : getFileTypeColor(fileType.type)} 
                    />
                    <Text style={[
                      styles.fileTypeButtonText,
                      selectedFileType === fileType.type && styles.selectedFileTypeButtonText,
                    ]}>
                      {fileType.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* تفاصيل الملف */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>اسم الملف</Text>
              <TextInput
                style={styles.textInput}
                placeholder="أدخل اسم الملف"
                value={newFile.name}
                onChangeText={(text) => setNewFile({ ...newFile, name: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>المقرر</Text>
              <TextInput
                style={styles.textInput}
                placeholder="أدخل اسم المقرر"
                value={newFile.course}
                onChangeText={(text) => setNewFile({ ...newFile, course: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>الفصل</Text>
              <TextInput
                style={styles.textInput}
                placeholder="أدخل اسم الفصل"
                value={newFile.chapter}
                onChangeText={(text) => setNewFile({ ...newFile, chapter: text })}
              />
            </View>

            {/* منطقة رفع الملف */}
            <TouchableOpacity 
              style={styles.uploadArea}
              onPress={pickDocument}
            >
              {pickedDocument && pickedDocument.assets && pickedDocument.assets.length > 0 ? (
                <View style={styles.selectedFile}>
                  <Ionicons 
                    name="document-text" 
                    size={40} 
                    color={Theme.colors.primary} 
                  />
                  <Text style={styles.selectedFileName}>
                    {pickedDocument.assets[0].name}
                  </Text>
                  <Text style={styles.selectedFileSize}>
                    {((pickedDocument.assets[0].size || 0) / 1024 / 1024).toFixed(2)} MB
                  </Text>
                  <TouchableOpacity 
                    style={styles.removeFileButton}
                    onPress={() => {
                      setPickedDocument(null);
                      setNewFile(prev => ({
                        ...prev,
                        uri: '',
                        size: 0,
                        type: '',
                      }));
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color={Theme.colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={60} color={Theme.colors.primary} />
                  <Text style={styles.uploadText}>
                    اضغط لاختيار الملف
                  </Text>
                  <Text style={styles.uploadSubtext}>
                    (PDF, Word, أو نص) - الحد الأقصى: 50 MB
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <Button
                title="إلغاء"
                onPress={() => setShowUploadModal(false)}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="رفع الملف"
                onPress={handleUploadFile}
                style={styles.uploadButton}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* نافذة معاينة الملف */}
      <Modal
        visible={showPreviewModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>معاينة الملف</Text>
            <TouchableOpacity onPress={() => setShowPreviewModal(false)}>
              <Ionicons name="close" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {previewFile ? (
              <>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <Ionicons 
                    name={getFileIcon(previewFile.type) as any}
                    size={64}
                    color={getFileTypeColor(previewFile.type)}
                  />
                </View>
                <Text style={styles.fileName}>{previewFile.name}</Text>
                <Text style={styles.fileCourse}>{previewFile.course} - {previewFile.chapter}</Text>
                <View style={{ height: 12 }} />
                {previewFile.summary ? (
                  <View style={styles.summaryContainer}>
                    <Text style={styles.summaryLabel}>الملخص:</Text>
                    <Text style={styles.summaryText}>{previewFile.summary}</Text>
                  </View>
                ) : (
                  <Text style={styles.uploadSubtext}>لا يوجد ملخص متاح لهذا الملف</Text>
                )}
              </>
            ) : (
              <Text style={styles.uploadSubtext}>لا توجد بيانات ملف</Text>
            )}
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
  
  coursesContainer: {
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  coursesContent: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  
  courseButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.medium,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  
  selectedCourseButton: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  
  courseText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  
  selectedCourseText: {
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
  
  filesList: {
    paddingBottom: Theme.spacing.lg,
  },
  
  fileCard: {
    marginBottom: Theme.spacing.md,
  },
  
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  
  fileInfo: {
    flex: 1,
  },
  
  fileName: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  fileCourse: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  
  fileMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  fileSize: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
  },
  
  fileDate: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
  },
  
  moreButton: {
    padding: Theme.spacing.xs,
  },
  
  summaryContainer: {
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.medium,
    marginBottom: Theme.spacing.sm,
  },
  
  summaryLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  summaryText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    lineHeight: 20,
  },
  
  fileActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  
  actionButton: {
    marginLeft: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
    minWidth: 70,
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
  
  fileTypeContainer: {
    marginBottom: Theme.spacing.lg,
  },
  
  inputLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    fontWeight: '500',
  },
  
  fileTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  fileTypeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
  },
  
  selectedFileTypeButton: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  
  fileTypeButtonText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
    fontWeight: '500',
  },
  
  selectedFileTypeButtonText: {
    color: Theme.colors.surface,
  },
  
  inputContainer: {
    marginBottom: Theme.spacing.lg,
  },
  
  textInput: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  
  uploadArea: {
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderStyle: 'dashed',
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  
  uploadText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    textAlign: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  
  uploadSubtext: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  selectedFile: {
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  
  selectedFileName: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '500',
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  
  selectedFileSize: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  
  removeFileButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: Theme.spacing.xs,
  },
  
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xl,
  },
  
  cancelButton: {
    flex: 0.45,
  },
  
  uploadButton: {
    flex: 0.45,
  },
});
