import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Theme } from '../constants/theme';

interface CustomTimePickerProps {
  visible: boolean;
  value: Date;
  onTimeChange: (time: Date) => void;
  onClose: () => void;
  title: string;
}

export default function CustomTimePicker({
  visible,
  value,
  onTimeChange,
  onClose,
  title,
}: CustomTimePickerProps) {
  const [selectedHour, setSelectedHour] = useState(value.getHours());
  const [selectedMinute, setSelectedMinute] = useState(value.getMinutes());

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    const newTime = new Date(value);
    newTime.setHours(selectedHour);
    newTime.setMinutes(selectedMinute);
    onTimeChange(newTime);
    onClose();
  };

  const handleNativeTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      onTimeChange(selectedTime);
    }
    if (Platform.OS === 'android') {
      onClose();
    }
  };

  if (!visible) return null;

  // استخدام DateTimePicker الأصلي على iOS و Android
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={value}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleNativeTimeChange}
              style={{ backgroundColor: Theme.colors.surface }}
              textColor={Theme.colors.text}
            />
            {Platform.OS === 'android' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
                  <Text style={styles.confirmButtonText}>تم</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  // TimePicker مخصص للويب
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.webPickerContainer}>
          <View style={styles.timeDisplay}>
            <Text style={styles.timeDisplayText}>
              {selectedHour.toString().padStart(2, '0')}:
              {selectedMinute.toString().padStart(2, '0')}
            </Text>
          </View>
          
          <View style={styles.wheelContainer}>
            <View style={styles.wheel}>
              <Text style={styles.wheelLabel}>الساعة</Text>
              <ScrollView 
                style={styles.wheelScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.wheelContent}
              >
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.wheelItem,
                      selectedHour === hour && styles.selectedWheelItem,
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text
                      style={[
                        styles.wheelItemText,
                        selectedHour === hour && styles.selectedWheelItemText,
                      ]}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.wheel}>
              <Text style={styles.wheelLabel}>الدقيقة</Text>
              <ScrollView 
                style={styles.wheelScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.wheelContent}
              >
                {minutes.filter(m => m % 5 === 0).map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.wheelItem,
                      selectedMinute === minute && styles.selectedWheelItem,
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text
                      style={[
                        styles.wheelItemText,
                        selectedMinute === minute && styles.selectedWheelItemText,
                      ]}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>تأكيد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.large,
    margin: Theme.spacing.lg,
    maxHeight: '80%',
    width: Platform.OS === 'web' ? 400 : '90%',
    ...Theme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  title: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  pickerContainer: {
    padding: Theme.spacing.lg,
  },
  webPickerContainer: {
    padding: Theme.spacing.lg,
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary + '20',
    borderRadius: Theme.borderRadius.medium,
  },
  timeDisplayText: {
    ...Theme.typography.h2,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  wheelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Theme.spacing.lg,
  },
  wheel: {
    flex: 1,
    marginHorizontal: Theme.spacing.sm,
  },
  wheelLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
    fontWeight: '600',
  },
  wheelScroll: {
    height: 200,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.medium,
  },
  wheelContent: {
    paddingVertical: Theme.spacing.sm,
  },
  wheelItem: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    alignItems: 'center',
  },
  selectedWheelItem: {
    backgroundColor: Theme.colors.primary,
    marginHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.small,
  },
  wheelItemText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  selectedWheelItemText: {
    color: Theme.colors.surface,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
  cancelButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cancelButtonText: {
    color: Theme.colors.text,
    fontWeight: '600',
  },
  confirmButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.medium,
  },
  confirmButtonText: {
    color: Theme.colors.surface,
    fontWeight: '600',
  },
});