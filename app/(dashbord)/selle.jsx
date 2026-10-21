
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { listings } from "../../context/listings.js"
import { color } from '../../styles/colors';

export default function Selle() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const theme = color.light;
  const [maximumOffer, setMaximumOffer] = useState('');

  const product = listings.find((item) => item.id === String(id));

  if (!product) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.heading, { color: theme.title }]}>
          Listing not found
        </Text>
        <Text style={[styles.description, { color: theme.text }]}>
          This listing may no longer be available.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const seller = product.seller;

  const submitOffer = () => {
    const offer = Number(maximumOffer);

    if (
      maximumOffer.trim() === '' ||
      !Number.isFinite(offer) ||
      offer <= 0
    ) {
      Alert.alert(
        'Invalid offer',
        `Enter a valid maximum offer per ${product.unit}.`
      );
      return;
    }

    if (offer < product.pricePerUnit) {
      Alert.alert(
        'Offer too low',
        `The asking price is Rs. ${product.pricePerUnit.toFixed(2)} per ${product.unit}. Enter at least the asking price for this demo.`
      );
      return;
    }

    Alert.alert(
      'Offer preview',
      `Product: ${product.name}\n` +
        `Your maximum offer: Rs. ${offer.toFixed(2)}/${product.unit}\n` +
        `Quantity: ${product.quantity} ${product.unit}\n\n` +
        'Demo only: this offer has not been submitted to a server.'
    );
  };

  const reserveProduct = () => {
    Alert.alert(
      'Reservation preview',
      `You selected ${product.name} (${product.quantity} ${product.unit}).\n\n` +
        'This is a demo only. No quantity has been reserved.'
    );
  };

  const contactSeller = async () => {
    const phone = seller.whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${phone}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'Unable to open WhatsApp',
        `Contact ${seller.whatsappNumber} directly.`
      );
    }
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.text }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: theme.title }]}>
        {String(value)}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backText, { color: theme.primary }]}>
          ← Back to shop
        </Text>
      </Pressable>

      <View style={[styles.productCard, { backgroundColor: theme.card }]}>
        <View style={styles.productIcon}>
          <Text style={styles.fruitEmoji}>
            {product.category === 'Fruit' ? '🍍' : '🥕'}
          </Text>
        </View>

        <Text style={[styles.heading, { color: theme.title }]}>
          {product.name}
        </Text>

        <Text style={[styles.description, { color: theme.text }]}>
          {product.variety} · {product.category}
        </Text>

        <Text style={[styles.price, { color: theme.primary }]}>
          Rs. {product.pricePerUnit.toFixed(2)} / {product.unit}
        </Text>

        <Text style={[styles.description, { color: theme.text }]}>
          {product.quantity} {product.unit} available
        </Text>

        <View
          style={[
            styles.urgencyBadge,
            {
              backgroundColor:
                product.urgency === 'Critical'
                  ? '#FCE7E7'
                  : product.urgency === 'Urgent'
                    ? '#FFF1D6'
                    : '#E3F5E8',
            },
          ]}
        >
          <Text style={styles.urgencyText}>
            {product.urgency}
          </Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.title }]}>
          Product details
        </Text>

        <DetailRow label="Category" value={product.category} />
        <DetailRow label="Variety" value={product.variety} />
        <DetailRow label="Available quantity" value={`${product.quantity} ${product.unit}`} />
        <DetailRow label="Asking price" value={`Rs. ${product.pricePerUnit.toFixed(2)} / ${product.unit}`} />
        <DetailRow label="Condition" value={product.condition} />
        <DetailRow label="Packaging" value={product.packaging} />
        <DetailRow label="Collection location" value={product.location} />
        <DetailRow label="Province" value={product.province} />
        <DetailRow label="Available from" value={`${product.availableDate} at ${product.availableTime}`} />
        <DetailRow label="Collect by" value={`${product.deadlineDate} at ${product.deadlineTime}`} />
        <DetailRow label="Estimated freshness" value={product.freshness} />
        <DetailRow label="Storage" value={product.storage} />
        <DetailRow label="Urgency" value={product.urgency} />
        <DetailRow label="Delivery available" value={product.canDeliver ? 'Yes' : 'No'} />
        <DetailRow label="Price negotiable" value={product.priceNegotiable ? 'Yes' : 'No'} />

        <Text style={[styles.descriptionText, { color: theme.text }]}>
          {product.description}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.title }]}>
          Seller information
        </Text>

        <DetailRow label="Username" value={`@${seller.username}`} />
        <DetailRow label="WhatsApp" value={seller.whatsappNumber} />
        <DetailRow label="Province" value={seller.province} />
        <DetailRow
          label="Seller rating"
          value={`★ ${seller.rating} / 5 (${seller.reviewCount} reviews)`}
        />

        <Pressable
          style={[styles.secondaryButton, { borderColor: theme.primary }]}
          onPress={contactSeller}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
            Contact seller on WhatsApp
          </Text>
        </Pressable>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.title }]}>
          Make an offer
        </Text>

        <Text style={[styles.description, { color: theme.text }]}>
          Enter the maximum amount you are willing to pay per {product.unit}.
        </Text>

        <Text style={[styles.detailLabel, { color: theme.title }]}>
          Your maximum offer (Rs. / {product.unit})
        </Text>

        <TextInput
          style={[
            styles.offerInput,
            {
              color: theme.inputText,
              borderColor: theme.inputbox,
              backgroundColor: theme.background,
            },
          ]}
          value={maximumOffer}
          onChangeText={setMaximumOffer}
          placeholder={`e.g. ${(product.pricePerUnit * 1.1).toFixed(2)}`}
          placeholderTextColor={theme.iconColor}
          keyboardType="decimal-pad"
        />

        <Text style={[styles.description, { color: theme.text }]}>
          Demo highest offer: Rs. {product.highestOffer.toFixed(2)} / {product.unit}
        </Text>

        <Pressable style={styles.primaryButton} onPress={submitOffer}>
          <Text style={styles.primaryButtonText}>Submit Maximum Offer</Text>
        </Pressable>

        <Pressable style={styles.reserveButton} onPress={reserveProduct}>
          <Text style={styles.primaryButtonText}>Reserve Produce</Text>
        </Pressable>

        <Text style={[styles.note, { color: theme.text }]}>
          Offers and reservations are not saved. Connect these buttons to your
          backend before using this feature in the real marketplace.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 36,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  mapButton: {
  backgroundColor: '#21834A',
  padding: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginVertical: 10,
},
mapButtonText: {
  color: '#FFFFFF',
  fontWeight: '700',
  fontSize: 15,
}, 
  backText: {
    fontSize: 15,
    fontWeight: '700',
  },
  productCard: {
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    gap: 8,
  },
  productIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E3F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  fruitEmoji: {
    fontSize: 46,
  },
  heading: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
  },
  price: {
    fontSize: 23,
    fontWeight: '800',
    marginTop: 8,
  },
  urgencyBadge: {
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  urgencyText: {
    color: '#34483A',
    fontWeight: '700',
    fontSize: 12,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    gap: 13,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D9E3D9',
  },
  detailLabel: {
    flex: 1,
    fontSize: 13,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 2,
  },
  secondaryButton: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  offerInput: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 11,
    backgroundColor: '#21834A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 5,
  },
  reserveButton: {
    minHeight: 48,
    borderRadius: 11,
    backgroundColor: '#176A3A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
});
