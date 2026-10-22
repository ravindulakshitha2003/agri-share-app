
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProducts } from '../../hooks/useProduct';

const PRIMARY = '#21834A';

// Temporary demo information until a seller/profile API is available.
const DEMO_SELLER = {
  province: 'Uva Province',
  rating: 4.8,
  reviewCount: 24,
  whatsappNumber: null,
};

const formatPrice = (price, negotiable) => {
  if (price === null || price === undefined || price === '') {
    return negotiable ? 'Price negotiable' : 'Price unavailable';
  }

  const value = Number(price);

  if (!Number.isFinite(value)) {
    return negotiable ? 'Price negotiable' : 'Price unavailable';
  }

  return `Rs. ${value.toLocaleString('en-LK')}`;
};

const formatDate = (date) => {
  if (!date) return 'Not provided';

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (time) => {
  if (!time) return 'Not provided';

  const [hours, minutes] = time.split(':');
  if (hours === undefined || minutes === undefined) return time;

  const parsed = new Date();
  parsed.setHours(Number(hours), Number(minutes), 0, 0);

  return parsed.toLocaleTimeString('en-LK', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

function DetailRow({ icon, label, value, dark }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={18} color={PRIMARY} />
      </View>

      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, { color: dark ? '#FFFFFF' : '#243329' }]}>
          {value === null || value === undefined || value === ''
            ? 'Not provided'
            : String(value)}
        </Text>
      </View>
    </View>
  );
}

export default function Selle() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { products = [], getallProduct, loading, error } = useProducts();

  const dark = useColorScheme() === 'dark';
  const [loadingProduct, setLoadingProduct] = useState(false);

  const product = products.find((item) => String(item.id) === String(id));

  useEffect(() => {
    let active = true;

    const loadMissingProduct = async () => {
      if (!id || product) return;

      setLoadingProduct(true);
      try {
        await getallProduct();
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        if (active) setLoadingProduct(false);
      }
    };

    loadMissingProduct();

    return () => {
      active = false;
    };
    // Load when the route ID changes; the context action is called as needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const pageBackground = dark ? '#101812' : '#F5F8F5';
  const cardBackground = dark ? '#1C2921' : '#FFFFFF';
  const mainText = dark ? '#FFFFFF' : '#17231B';

  const handleReserve = () => {
    Alert.alert(
      'Reservation demo',
      'The reservation API is not connected yet. This button is ready to connect when your backend endpoint is available.',
    );
  };

  const handleOffer = () => {
    Alert.alert(
      'Make an offer',
      'The offer or bidding API is not connected yet. You can add it when the backend endpoint is ready.',
    );
  };

  const handleContactSeller = () => {
    Alert.alert(
      'Contact seller',
      DEMO_SELLER.whatsappNumber
        ? `Temporary seller contact: ${DEMO_SELLER.whatsappNumber}`
        : 'The seller WhatsApp number is not available from the current product API. Add it through the seller/profile API when ready.',
    );
  };

  if (!id) {
    return (
      <View style={[styles.center, { backgroundColor: pageBackground }]}>
        <Ionicons name="alert-circle-outline" size={44} color="#9AA69D" />
        <Text style={[styles.errorTitle, { color: mainText }]}>
          Product ID is missing
        </Text>
        <Text style={styles.mutedText}>
          Open this screen by selecting a product from the shop.
        </Text>
        <Pressable onPress={() => router.back()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (!product && (loadingProduct || loading)) {
    return (
      <View style={[styles.center, { backgroundColor: pageBackground }]}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.mutedText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: pageBackground }]}>
        <Ionicons name="search-outline" size={46} color="#9AA69D" />
        <Text style={[styles.errorTitle, { color: mainText }]}>
          Listing not found
        </Text>
        <Text style={styles.mutedText}>
          {error
            ? String(error)
            : 'This product could not be found in the loaded product list. Refresh the shop and try again.'}
        </Text>
        <Pressable
          onPress={async () => {
            setLoadingProduct(true);
            try {
              await getallProduct();
            } finally {
              setLoadingProduct(false);
            }
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.backTextButton}>
          <Text style={styles.backText}>Go back to shop</Text>
        </Pressable>
      </View>
    );
  }

  const productName = product.productName?.trim() || 'Unnamed product';
  const sellerName = product.username || 'Seller';
  const location = product.location?.trim() || 'Location not provided';
  const quantity = Number(product.quantity);
  const minimumQuantity = Number(product.minimumQuantity);

  return (
    <View style={[styles.screen, { backgroundColor: pageBackground }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={23} color={mainText} />
        </Pressable>

        <Text style={[styles.topBarTitle, { color: mainText }]}>
          Product details
        </Text>

        <View style={styles.iconButton}>
          <Ionicons name="leaf-outline" size={22} color={PRIMARY} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.heroCard, { backgroundColor: cardBackground }]}>
          <View style={styles.heroIllustration}>
            <Ionicons
              name={
                (product.category || '').toLowerCase() === 'vegetable'
                  ? 'leaf-outline'
                  : 'nutrition-outline'
              }
              size={70}
              color={PRIMARY}
            />
          </View>

          <View style={styles.tagRow}>
            <Text style={styles.categoryTag}>
              {product.category || 'Uncategorized'}
            </Text>

            {product.urgency ? (
              <Text style={styles.urgencyTag}>{product.urgency}</Text>
            ) : null}
          </View>

          <Text style={[styles.productTitle, { color: mainText }]}>
            {productName}
          </Text>

          <View style={styles.locationLine}>
            <Ionicons name="location-outline" size={17} color={PRIMARY} />
            <Text style={[styles.locationLabel, { color: dark ? '#C5D0C8' : '#657168' }]}>
              {location}
            </Text>
          </View>

          <Text style={styles.priceLabel}>Listed price</Text>
          <Text style={styles.heroPrice}>
            {formatPrice(product.price, product.priceNegotiable)}
            {product.price !== null && product.price !== undefined && product.price !== ''
              ? ` / ${product.unit || 'unit'}`
              : ''}
          </Text>

          {product.priceNegotiable ? (
            <View style={styles.negotiableBanner}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={PRIMARY} />
              <Text style={styles.negotiableBannerText}>
                Seller is open to negotiation
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.sectionTitle, { color: mainText }]}>
          Seller information
        </Text>

        <View style={[styles.sellerCard, { backgroundColor: cardBackground }]}>
          <View style={styles.sellerAvatar}>
            <Ionicons name="person" size={27} color={PRIMARY} />
          </View>

          <View style={styles.sellerDetails}>
            <Text style={[styles.sellerName, { color: mainText }]}>
              {sellerName}
            </Text>
            <Text style={styles.sellerLocation}>
              {DEMO_SELLER.province} · Demo profile
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={15} color="#E5A52E" />
              <Text style={[styles.ratingText, { color: mainText }]}>
                {DEMO_SELLER.rating.toFixed(1)}
              </Text>
              <Text style={styles.reviewText}>
                ({DEMO_SELLER.reviewCount} demo reviews)
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleContactSeller}
            style={styles.contactButton}
            accessibilityLabel="Contact seller"
          >
            <Ionicons name="logo-whatsapp" size={21} color={PRIMARY} />
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: mainText }]}>
          Product information
        </Text>

        <View style={[styles.detailsCard, { backgroundColor: cardBackground }]}>
          <DetailRow
            icon="cube-outline"
            label="Available quantity"
            value={
              Number.isFinite(quantity) && quantity > 0
                ? `${quantity.toLocaleString('en-LK')} ${product.unit || ''}`.trim()
                : 'Not specified'
            }
            dark={dark}
          />
          <DetailRow
            icon="cart-outline"
            label="Minimum order quantity"
            value={
              Number.isFinite(minimumQuantity) && minimumQuantity > 0
                ? `${minimumQuantity.toLocaleString('en-LK')} ${product.unit || ''}`.trim()
                : 'Not specified'
            }
            dark={dark}
          />
          <DetailRow
            icon="checkmark-circle-outline"
            label="Condition"
            value={product.condition}
            dark={dark}
          />
          <DetailRow
            icon="time-outline"
            label="Freshness"
            value={product.freshness}
            dark={dark}
          />
          <DetailRow
            icon="cube-outline"
            label="Packaging"
            value={product.packaging}
            dark={dark}
          />
          <DetailRow
            icon="home-outline"
            label="Storage"
            value={product.storage}
            dark={dark}
          />
          <DetailRow
            icon="calendar-outline"
            label="Available date"
            value={formatDate(product.availableDate)}
            dark={dark}
          />
          <DetailRow
            icon="time-outline"
            label="Available time"
            value={formatTime(product.availableTime)}
            dark={dark}
          />
          <DetailRow
            icon="calendar-clear-outline"
            label="Deadline date"
            value={formatDate(product.deadlineDate)}
            dark={dark}
          />
          <DetailRow
            icon="alarm-outline"
            label="Deadline time"
            value={formatTime(product.deadlineTime)}
            dark={dark}
          />
          <DetailRow
            icon="car-outline"
            label="Delivery"
            value={product.canDeliver ? 'Seller can deliver' : 'Pickup / delivery not offered'}
            dark={dark}
          />
          <DetailRow
            icon="pricetag-outline"
            label="Price negotiation"
            value={product.priceNegotiable ? 'Negotiable' : 'Not negotiable'}
            dark={dark}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: mainText }]}>
          Description
        </Text>

        <View style={[styles.descriptionCard, { backgroundColor: cardBackground }]}>
          <Text style={[styles.descriptionText, { color: dark ? '#D6E0D8' : '#56635A' }]}>
            {product.description?.trim() || 'The seller has not added a description yet.'}
          </Text>
        </View>

        <View style={styles.demoNotice}>
          <Ionicons name="information-circle-outline" size={18} color="#8A6A1F" />
          <Text style={styles.demoNoticeText}>
            Seller rating, reviews, and province are temporary demo values. They are not verified by the current API.
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            onPress={handleOffer}
            style={styles.secondaryButton}
          >
            <Ionicons name="pricetag-outline" size={18} color={PRIMARY} />
            <Text style={styles.secondaryButtonText}>Make an offer</Text>
          </Pressable>

          <Pressable
            onPress={handleReserve}
            style={styles.primaryButton}
          >
            <Ionicons name="checkmark-circle-outline" size={19} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Reserve product</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    paddingTop: 12,
    paddingBottom: 12,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 17,
    paddingBottom: 35,
  },
  heroCard: {
    borderRadius: 21,
    padding: 17,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: '#E5EBE6',
  },
  heroIllustration: {
    height: 165,
    borderRadius: 16,
    backgroundColor: '#E9F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 11,
  },
  categoryTag: {
    color: PRIMARY,
    backgroundColor: '#E9F5EC',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
  },
  urgencyTag: {
    color: '#85651F',
    backgroundColor: '#FFF3D6',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
  },
  productTitle: {
    fontSize: 25,
    fontWeight: '800',
  },
  locationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 9,
  },
  locationLabel: {
    fontSize: 14,
  },
  priceLabel: {
    color: '#849087',
    fontSize: 12,
    marginTop: 20,
  },
  heroPrice: {
    color: PRIMARY,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  negotiableBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#EAF5ED',
    padding: 11,
    borderRadius: 10,
    marginTop: 15,
  },
  negotiableBannerText: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  sellerCard: {
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: '#E5EBE6',
  },
  sellerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E9F5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '800',
  },
  sellerLocation: {
    color: '#849087',
    fontSize: 12,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
  },
  reviewText: {
    color: '#849087',
    fontSize: 11,
  },
  contactButton: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#E9F5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    borderRadius: 17,
    paddingHorizontal: 15,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: '#E5EBE6',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEE9',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#E9F5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#849087',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionCard: {
    borderRadius: 17,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5EBE6',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#FFF5DC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 19,
  },
  demoNoticeText: {
    flex: 1,
    color: '#775D23',
    fontSize: 12,
    lineHeight: 18,
  },
  actionButtons: {
    gap: 11,
  },
  primaryButton: {
    minHeight: 50,
    backgroundColor: PRIMARY,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryButton: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    color: PRIMARY,
    fontWeight: '800',
    fontSize: 14,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    gap: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  mutedText: {
    color: '#849087',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  backTextButton: {
    padding: 12,
  },
  backText: {
    color: PRIMARY,
    fontWeight: '700',
  },
});
