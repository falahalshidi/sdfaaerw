// إعدادات التطبيق العامة

export const AppConfig = {
  // معلومات التطبيق
  appName: 'AN',
  appNameArabic: 'حان',
  version: '1.0.0',
  buildNumber: '1',
  
  // إعدادات API
  apiBaseUrl: 'https://api.an-app.com', // سيتم استبدالها بالرابط الفعلي
  apiTimeout: 10000, // 10 ثواني
  
  // إعدادات التخزين المحلي
  storageKeys: {
    user: 'user_data',
    settings: 'app_settings',
    lectures: 'lectures_data',
    notes: 'notes_data',
    files: 'files_data',
    theme: 'theme_preference',
  },
  
  // إعدادات الإشعارات
  notifications: {
    lectureReminder: {
      defaultTime: 15, // 15 دقيقة قبل المحاضرة
      minTime: 5,
      maxTime: 60,
    },
    taskReminder: {
      defaultTime: 30, // 30 دقيقة قبل الموعد النهائي
      minTime: 10,
      maxTime: 120,
    },
  },
  
  // إعدادات الملفات
  files: {
    maxSize: 50 * 1024 * 1024, // 50 MB
    allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'mp3', 'mp4', 'doc', 'docx'],
    freeUserLimit: 3, // 3 ملفات للمستخدم المجاني
    premiumUserLimit: -1, // غير محدود للمستخدم المدفوع
  },
  
  // إعدادات التوصيل
  delivery: {
    minPrice: 2, // ريال
    maxPrice: 5, // ريال
    maxDistance: 10, // كم
    commissionRate: 0.1, // 10%
  },
  
  // إعدادات الذكاء الاصطناعي
  ai: {
    summaryMaxLength: 500, // كلمة
    quizQuestionsCount: 10,
    flashCardCount: 20,
  },
  
  // إعدادات التطبيق
  app: {
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
    defaultTheme: 'light',
    supportedThemes: ['light', 'dark'],
  },
  
  // روابط خارجية
  links: {
    website: 'https://an-app.com',
    support: 'https://support.an-app.com',
    privacy: 'https://an-app.com/privacy',
    terms: 'https://an-app.com/terms',
    social: {
      twitter: 'https://twitter.com/AN_App',
      instagram: 'https://instagram.com/AN_App',
      linkedin: 'https://linkedin.com/company/AN_App',
    },
  },
  
  // إعدادات التطوير
  development: {
    enableLogging: __DEV__,
    enableAnalytics: !__DEV__,
    enableCrashReporting: !__DEV__,
  },
};
