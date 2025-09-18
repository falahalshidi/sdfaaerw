// إعدادات Firebase للربط المستقبلي
// هذا الملف يحتوي على إعدادات Firebase التي سيتم استخدامها لاحقاً

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// إعدادات Firebase - سيتم استبدالها بالإعدادات الفعلية
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير الخدمات
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// تصدير التطبيق
export default app;

// ملاحظات للمطور:
// 1. قم بإنشاء مشروع Firebase جديد
// 2. استبدل الإعدادات أعلاه بالإعدادات الفعلية من Firebase Console
// 3. أضف ملف google-services.json للـ Android
// 4. أضف ملف GoogleService-Info.plist للـ iOS
// 5. قم بتثبيت المكتبات المطلوبة:
//    npm install firebase
//    expo install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
