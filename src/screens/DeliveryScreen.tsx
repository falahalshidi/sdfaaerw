import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/Card';
import Button from '../components/Button';
import { Theme } from '../constants/theme';

// بيانات وهمية لعروض التوصيل
const deliveryOffers = [
  {
    id: '1',
    title: 'توصيل طلب من مطعم الكويت',
    description: 'توصيل طلب من مطعم الكويت إلى حي النرجس',
    price: 3,
    distance: 2.5,
    estimatedTime: 15,
    pickupLocation: 'مطعم الكويت - شارع الملك فهد',
    deliveryLocation: 'حي النرجس - شارع العليا',
    isAvailable: true,
    studentName: 'أحمد محمد',
    rating: 4.8,
    completedDeliveries: 45,
    createdAt: '2024-01-10T10:30:00Z',
  },
  {
    id: '2',
    title: 'توصيل طلب من ستاربكس',
    description: 'توصيل مشروبات من ستاربكس إلى جامعة الملك سعود',
    price: 2.5,
    distance: 1.8,
    estimatedTime: 12,
    pickupLocation: 'ستاربكس - مول النخيل',
    deliveryLocation: 'جامعة الملك سعود - كلية الهندسة',
    isAvailable: true,
    studentName: 'فاطمة علي',
    rating: 4.9,
    completedDeliveries: 32,
    createdAt: '2024-01-10T11:15:00Z',
  },
  {
    id: '3',
    title: 'توصيل طلب من ماكدونالدز',
    description: 'توصيل وجبة سريعة من ماكدونالدز',
    price: 2,
    distance: 1.2,
    estimatedTime: 8,
    pickupLocation: 'ماكدونالدز - شارع التحلية',
    deliveryLocation: 'حي الملز - شارع العليا',
    isAvailable: false,
    studentName: 'محمد السعيد',
    rating: 4.7,
    completedDeliveries: 28,
    createdAt: '2024-01-10T09:45:00Z',
  },
];

const myEarnings = {
  today: 45,
  thisWeek: 280,
  thisMonth: 1200,
  total: 3500,
};

const myDeliveries = [
  {
    id: '1',
    title: 'توصيل طلب من مطعم الكويت',
    price: 3,
    status: 'completed',
    completedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '2',
    title: 'توصيل طلب من ستاربكس',
    price: 2.5,
    status: 'in_progress',
    startedAt: '2024-01-10T15:00:00Z',
  },
  {
    id: '3',
    title: 'توصيل طلب من ماكدونالدز',
    price: 2,
    status: 'completed',
    completedAt: '2024-01-09T18:45:00Z',
  },
];

export default function DeliveryScreen() {
  const [selectedTab, setSelectedTab] = useState<'offers' | 'earnings' | 'my_deliveries'>('offers');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const handleAcceptOffer = (offer: any) => {
    setSelectedOffer(offer);
    setShowOfferModal(true);
  };

  const handleConfirmAccept = () => {
    Alert.alert(
      'تم قبول العرض!',
      'تم إرسال تفاصيل التوصيل إلى رقم هاتفك. تأكد من الوصول إلى موقع الاستلام في الوقت المحدد.',
      [{ text: 'ممتاز!', style: 'default' }]
    );
    setShowOfferModal(false);
    setSelectedOffer(null);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Theme.colors.success;
      case 'in_progress':
        return Theme.colors.warning;
      case 'cancelled':
        return Theme.colors.error;
      default:
        return Theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in_progress':
        return 'قيد التنفيذ';
      case 'cancelled':
        return 'ملغي';
      default:
        return '';
    }
  };

  const renderOfferItem = ({ item }: { item: any }) => (
    <Card style={styles.offerCard} variant="elevated">
      <View style={styles.offerHeader}>
        <View style={styles.offerInfo}>
          <Text style={styles.offerTitle}>{item.title}</Text>
          <Text style={styles.offerDescription}>{item.description}</Text>
        </View>
        <View style={styles.offerPrice}>
          <Text style={styles.priceValue}>{item.price}</Text>
          <Text style={styles.priceCurrency}>ريال</Text>
        </View>
      </View>

      <View style={styles.offerDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color={Theme.colors.primary} />
          <Text style={styles.detailText}>{item.pickupLocation}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="navigate" size={16} color={Theme.colors.primary} />
          <Text style={styles.detailText}>{item.deliveryLocation}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={16} color={Theme.colors.primary} />
          <Text style={styles.detailText}>{item.estimatedTime} دقيقة</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="speedometer" size={16} color={Theme.colors.primary} />
          <Text style={styles.detailText}>{item.distance} كم</Text>
        </View>
      </View>

      <View style={styles.offerFooter}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <View style={styles.studentRating}>
            <Ionicons name="star" size={14} color={Theme.colors.warning} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.deliveriesText}>({item.completedDeliveries} توصيلة)</Text>
          </View>
        </View>
        
        <Button
          title={item.isAvailable ? "قبول العرض" : "غير متاح"}
          onPress={() => item.isAvailable && handleAcceptOffer(item)}
          variant={item.isAvailable ? "primary" : "outline"}
          size="small"
          disabled={!item.isAvailable}
        />
      </View>
    </Card>
  );

  const renderEarningsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>أرباحي</Text>
      
      <View style={styles.earningsGrid}>
        <Card style={styles.earningCard} variant="elevated">
          <Text style={styles.earningValue}>{myEarnings.today}</Text>
          <Text style={styles.earningLabel}>اليوم</Text>
        </Card>
        <Card style={styles.earningCard} variant="elevated">
          <Text style={styles.earningValue}>{myEarnings.thisWeek}</Text>
          <Text style={styles.earningLabel}>هذا الأسبوع</Text>
        </Card>
        <Card style={styles.earningCard} variant="elevated">
          <Text style={styles.earningValue}>{myEarnings.thisMonth}</Text>
          <Text style={styles.earningLabel}>هذا الشهر</Text>
        </Card>
        <Card style={styles.earningCard} variant="elevated">
          <Text style={styles.earningValue}>{myEarnings.total}</Text>
          <Text style={styles.earningLabel}>المجموع</Text>
        </Card>
      </View>

      <Card style={styles.statsCard} variant="elevated">
        <Text style={styles.statsTitle}>إحصائياتي</Text>
        <View style={styles.statsList}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>إجمالي التوصيلات</Text>
            <Text style={styles.statValue}>127</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>متوسط التقييم</Text>
            <Text style={styles.statValue}>4.8</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>أفضل يوم</Text>
            <Text style={styles.statValue}>85 ريال</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>أطول مسافة</Text>
            <Text style={styles.statValue}>8.5 كم</Text>
          </View>
        </View>
      </Card>
    </View>
  );

  const renderMyDeliveriesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>توصيلاتي</Text>
      
      {myDeliveries.map((delivery) => (
        <Card key={delivery.id} style={styles.deliveryCard} variant="elevated">
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>{delivery.title}</Text>
            <View style={styles.deliveryPrice}>
              <Text style={styles.deliveryPriceValue}>{delivery.price}</Text>
              <Text style={styles.deliveryPriceCurrency}>ريال</Text>
            </View>
          </View>
          
          <View style={styles.deliveryFooter}>
            <View style={styles.deliveryStatus}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(delivery.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(delivery.status) }]}>
                {getStatusText(delivery.status)}
              </Text>
            </View>
            <Text style={styles.deliveryTime}>
              {delivery.status === 'completed' 
                ? `مكتمل في ${formatTime(delivery.completedAt)}`
                : `بدأ في ${formatTime(delivery.startedAt)}`
              }
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* التبويبات المحسنة */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'offers' && styles.activeTab]}
            onPress={() => setSelectedTab('offers')}
          >
            <Ionicons 
              name="list" 
              size={16} 
              color={selectedTab === 'offers' ? Theme.colors.surface : Theme.colors.primary} 
            />
            <Text style={[styles.tabText, selectedTab === 'offers' && styles.activeTabText]}>
              العروض المتاحة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'earnings' && styles.activeTab]}
            onPress={() => setSelectedTab('earnings')}
          >
            <Ionicons 
              name="cash" 
              size={16} 
              color={selectedTab === 'earnings' ? Theme.colors.surface : Theme.colors.primary} 
            />
            <Text style={[styles.tabText, selectedTab === 'earnings' && styles.activeTabText]}>
              أرباحي
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'my_deliveries' && styles.activeTab]}
            onPress={() => setSelectedTab('my_deliveries')}
          >
            <Ionicons 
              name="car" 
              size={16} 
              color={selectedTab === 'my_deliveries' ? Theme.colors.surface : Theme.colors.primary} 
            />
            <Text style={[styles.tabText, selectedTab === 'my_deliveries' && styles.activeTabText]}>
              توصيلاتي
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* المحتوى */}
      <View style={styles.content}>
        {selectedTab === 'offers' && (
          <FlatList
            data={deliveryOffers}
            renderItem={renderOfferItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.offersList}
          />
        )}
        
        {selectedTab === 'earnings' && renderEarningsTab()}
        
        {selectedTab === 'my_deliveries' && renderMyDeliveriesTab()}
      </View>

      {/* نافذة تأكيد القبول */}
      <Modal
        visible={showOfferModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>تأكيد قبول العرض</Text>
            <TouchableOpacity onPress={() => setShowOfferModal(false)}>
              <Ionicons name="close" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          {selectedOffer && (
            <ScrollView style={styles.modalContent}>
              <Card style={styles.confirmCard} variant="elevated">
                <Text style={styles.confirmTitle}>{selectedOffer.title}</Text>
                <Text style={styles.confirmDescription}>{selectedOffer.description}</Text>
                
                <View style={styles.confirmDetails}>
                  <View style={styles.confirmDetailItem}>
                    <Ionicons name="location" size={20} color={Theme.colors.primary} />
                    <View style={styles.confirmDetailText}>
                      <Text style={styles.confirmDetailLabel}>من:</Text>
                      <Text style={styles.confirmDetailValue}>{selectedOffer.pickupLocation}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.confirmDetailItem}>
                    <Ionicons name="navigate" size={20} color={Theme.colors.primary} />
                    <View style={styles.confirmDetailText}>
                      <Text style={styles.confirmDetailLabel}>إلى:</Text>
                      <Text style={styles.confirmDetailValue}>{selectedOffer.deliveryLocation}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.confirmDetailItem}>
                    <Ionicons name="time" size={20} color={Theme.colors.primary} />
                    <View style={styles.confirmDetailText}>
                      <Text style={styles.confirmDetailLabel}>الوقت المتوقع:</Text>
                      <Text style={styles.confirmDetailValue}>{selectedOffer.estimatedTime} دقيقة</Text>
                    </View>
                  </View>
                  
                  <View style={styles.confirmDetailItem}>
                    <Ionicons name="cash" size={20} color={Theme.colors.primary} />
                    <View style={styles.confirmDetailText}>
                      <Text style={styles.confirmDetailLabel}>المبلغ:</Text>
                      <Text style={styles.confirmDetailValue}>{selectedOffer.price} ريال</Text>
                    </View>
                  </View>
                </View>
              </Card>

              <View style={styles.modalActions}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowOfferModal(false)}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="تأكيد القبول"
                  onPress={handleConfirmAccept}
                  style={styles.confirmButton}
                />
              </View>
            </ScrollView>
          )}
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
  
  tabsContainer: {
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingVertical: Theme.spacing.sm,
  },
  
  tabsContent: {
    paddingHorizontal: Theme.spacing.md,
  },
  
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    marginHorizontal: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.large,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  
  activeTab: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  
  tabText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
    marginLeft: Theme.spacing.xs,
  },
  
  activeTabText: {
    color: Theme.colors.surface,
    fontWeight: 'bold',
  },
  
  content: {
    flex: 1,
  },
  
  tabContent: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  
  sectionTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.lg,
  },
  
  offersList: {
    padding: Theme.spacing.md,
  },
  
  offerCard: {
    marginBottom: Theme.spacing.md,
  },
  
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  
  offerInfo: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  
  offerTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  
  offerDescription: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
  },
  
  offerPrice: {
    alignItems: 'flex-end',
  },
  
  priceValue: {
    ...Theme.typography.h3,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  
  priceCurrency: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
  },
  
  offerDetails: {
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
    flex: 1,
  },
  
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  studentInfo: {
    flex: 1,
  },
  
  studentName: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    fontWeight: '500',
    marginBottom: Theme.spacing.xs,
  },
  
  studentRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  ratingText: {
    ...Theme.typography.caption,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.xs,
    fontWeight: '500',
  },
  
  deliveriesText: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  
  earningCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  
  earningValue: {
    ...Theme.typography.h2,
    color: Theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  
  earningLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  statsCard: {
    marginBottom: Theme.spacing.lg,
  },
  
  statsTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.md,
  },
  
  statsList: {
    gap: Theme.spacing.sm,
  },
  
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  
  statLabel: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  
  statValue: {
    ...Theme.typography.body,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  
  deliveryCard: {
    marginBottom: Theme.spacing.md,
  },
  
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  
  deliveryTitle: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    fontWeight: '600',
    flex: 1,
  },
  
  deliveryPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  
  deliveryPriceValue: {
    ...Theme.typography.h4,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  
  deliveryPriceCurrency: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  deliveryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Theme.spacing.xs,
  },
  
  statusText: {
    ...Theme.typography.bodySmall,
    fontWeight: '500',
  },
  
  deliveryTime: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
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
  
  confirmCard: {
    marginBottom: Theme.spacing.lg,
  },
  
  confirmTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.sm,
  },
  
  confirmDescription: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  
  confirmDetails: {
    gap: Theme.spacing.md,
  },
  
  confirmDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  confirmDetailText: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  
  confirmDetailLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  
  confirmDetailValue: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  cancelButton: {
    flex: 0.45,
  },
  
  confirmButton: {
    flex: 0.45,
  },
});
