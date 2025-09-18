// أنواع البيانات للتطبيق

// نوع المستخدم
export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  year: number;
  isPremium: boolean;
  avatar?: string;
  createdAt: Date;
}

// نوع المحاضرة
export interface Lecture {
  id: string;
  title: string;
  course: string;
  professor: string;
  startTime: Date;
  endTime: Date;
  location: string;
  reminderTime: number; // بالدقائق قبل المحاضرة
  isCompleted: boolean;
  notes?: string;
  tasks?: Task[];
}

// نوع المهمة
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  lectureId: string;
}

// نوع الملف المرفوع
export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'audio' | 'video';
  size: number;
  url: string;
  course: string;
  chapter: string;
  uploadedAt: Date;
  isProcessed: boolean; // هل تم معالجته بواسطة AI
}

// نوع الملخص
export interface Summary {
  id: string;
  title: string;
  content: string;
  fileId: string;
  course: string;
  chapter: string;
  createdAt: Date;
  aiGenerated: boolean;
}

// نوع البطاقة التعليمية
export interface FlashCard {
  id: string;
  front: string;
  back: string;
  course: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: Date;
  nextReview: Date;
  correctCount: number;
  incorrectCount: number;
}

// نوع اختبار
export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  course: string;
  timeLimit: number; // بالدقائق
  createdAt: Date;
}

// نوع سؤال الاختبار
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// نوع عرض التوصيل
export interface DeliveryOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  distance: number; // بالكيلومتر
  estimatedTime: number; // بالدقائق
  pickupLocation: string;
  deliveryLocation: string;
  isAvailable: boolean;
  studentId: string;
  createdAt: Date;
}

// نوع الإشعار
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'lecture' | 'task' | 'delivery' | 'general';
  isRead: boolean;
  createdAt: Date;
  data?: any; // بيانات إضافية
}

// نوع الإعدادات
export interface Settings {
  notifications: {
    lectureReminders: boolean;
    taskReminders: boolean;
    deliveryUpdates: boolean;
  };
  reminderTime: number; // بالدقائق
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
}

// نوع الاستجابة من API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// نوع حالة التطبيق
export interface AppState {
  user: User | null;
  lectures: Lecture[];
  tasks: Task[];
  files: UploadedFile[];
  summaries: Summary[];
  flashCards: FlashCard[];
  quizzes: Quiz[];
  deliveryOffers: DeliveryOffer[];
  notifications: Notification[];
  settings: Settings;
  isLoading: boolean;
  error: string | null;
}
