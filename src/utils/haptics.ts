import * as Haptics from 'expo-haptics';

// ميزات الاهتزاز للتفاعلات
export const HapticFeedback = {
  // اهتزاز خفيف للتفاعلات العادية
  light: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  // اهتزاز متوسط للتفاعلات المهمة
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  // اهتزاز قوي للتفاعلات المهمة جداً
  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  // اهتزاز للنجاح
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  // اهتزاز للتحذير
  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  // اهتزاز للخطأ
  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  // اهتزاز للاختيار
  selection: () => {
    Haptics.selectionAsync();
  },
};
