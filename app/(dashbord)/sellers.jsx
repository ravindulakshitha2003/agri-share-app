
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import TheamView from '../../components/TheamView';
import ThemaText from '../../components/ThemaText';
import ThemedInput from '../../components/ThemedInput';
import TheamedButton from '../../components/TheamedButton';
import { color } from '../../styles/colors';
import { getToken } from '../../services/tokenStorage';
import Section from '../../components/Section';
import Dropdown from '../../components/Dropdown';
import YesNo from '../../components/YesNo';
import { useProducts } from '../../context/ProductContext';
import { useRouter } from 'expo-router';

const CATEGORIES = ['Fruit', 'Vegetable'];
const UNITS = ['kg', 'g', 'piece', 'dozen', 'crate', 'box', 'bag'];
const CONDITIONS = [
  'Freshly harvested',
  'Fresh',
  'Good',
  'Near expiry',
];
const PACKAGING_OPTIONS = [
  'Loose',
  'Plastic crates',
  'Cardboard boxes',
  'Bags',
  'Other',
];
const STORAGE_OPTIONS = [
  'Room temperature',
  'Shaded area',
  'Refrigerated',
];
const FRESHNESS_OPTIONS = [
  'Less than 1 day',
  '1 day',
  '2 days',
  '3 days',
  '5 days',
  '7 days',
  'More than 7 days',
];
const URGENCY_OPTIONS = ['Normal', 'Urgent', 'Critical'];










export default function Sellers() {
  const scheme = useColorScheme() ?? 'light';
  const theme = color[scheme] ?? color.light;

  const [category, setCategory] = useState('Fruit');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Freshly harvested');
  const [packaging, setPackaging] = useState('Plastic crates');
  const [minimumQuantity, setMinimumQuantity] = useState('1');
  const [location, setLocation] = useState('');

  const [availableDate, setAvailableDate] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [datePickerTarget, setDatePickerTarget] = useState(null);
  const [freshness, setFreshness] = useState('2 days');
  const [storage, setStorage] = useState('Shaded area');

  const [urgency, setUrgency] = useState('Normal');
  const [canDeliver, setCanDeliver] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [description, setDescription] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {addProduct}  = useProducts();
  const router = useRouter();


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (value) => {
    if (!value) return new Date();
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') setDatePickerTarget(null);
    if (event?.type === 'dismissed' || !selectedDate) return;

    const formattedDate = formatDate(selectedDate);
    if (datePickerTarget === 'availableDate') {
      setAvailableDate(formattedDate);
    } else if (datePickerTarget === 'deadlineDate') {
      setDeadlineDate(formattedDate);
    }

    if (Platform.OS === 'ios') setDatePickerTarget(null);
  };

  const quantityNumber = Number(quantity);
  const priceNumber = Number(price);




  const totalPrice =
    quantity.trim() !== '' &&
    price.trim() !== '' &&
    Number.isFinite(quantityNumber) &&
    Number.isFinite(priceNumber) &&
    quantityNumber > 0 &&
    priceNumber >= 0
      ? quantityNumber * priceNumber
      : null;

  const formattedTotal =
    totalPrice !== null
      ? `Rs. ${totalPrice.toLocaleString('en-LK', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : 'Enter quantity and price';

  const toggleDropdown = (name) => {
    Keyboard.dismiss();
    setOpenDropdown((current) => (current === name ? null : name));
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setProductName('');
    setOpenDropdown(null);
  };


  // Submit directly to the product API with the saved JWT.
  const handlePublish = async () => {
    if (isSubmitting) return;

    Keyboard.dismiss();
    setOpenDropdown(null);

    if (!productName.trim()) {
      Alert.alert('Required', 'Please enter the product name.');
      return;
    }

    if (!quantity.trim() || !Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      Alert.alert('Invalid quantity', 'Enter a quantity greater than zero.');
      return;
    }

    if (!price.trim() || !Number.isFinite(priceNumber) || priceNumber <= 0) {
      Alert.alert('Invalid price', 'Enter a price greater than zero.');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Required', 'Please enter the collection location.');
      return;
    }

    const minimumQuantityNumber = Number(minimumQuantity);
    if (!minimumQuantity.trim() || !Number.isFinite(minimumQuantityNumber) || minimumQuantityNumber <= 0) {
      Alert.alert('Invalid minimum quantity', 'Enter a minimum purchase quantity greater than zero.');
      return;
    }

    if (minimumQuantityNumber > quantityNumber) {
      Alert.alert('Invalid minimum quantity', 'Minimum quantity cannot exceed the available quantity.');
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (availableDate.trim() && !datePattern.test(availableDate.trim())) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD for the available date.');
      return;
    }
    if (deadlineDate.trim() && !datePattern.test(deadlineDate.trim())) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD for the collection deadline.');
      return;
    }
    if (availableTime.trim() && !timePattern.test(availableTime.trim())) {
      Alert.alert('Invalid time', 'Use HH:MM in 24-hour format.');
      return;
    }
    if (deadlineTime.trim() && !timePattern.test(deadlineTime.trim())) {
      Alert.alert('Invalid time', 'Use HH:MM in 24-hour format.');
      return;
    }
    if (availableDate && deadlineDate && deadlineDate < availableDate) {
      Alert.alert('Invalid dates', 'The collection deadline cannot be before the available date.');
      return;
    }
    if (availableDate && deadlineDate === availableDate && availableTime && deadlineTime && deadlineTime < availableTime) {
      Alert.alert('Invalid time', 'The collection deadline cannot be before the available time.');
      return;
    }

    // Keep field names aligned with your Spring Boot request DTO.
    const productData = {
      category,
      productName: productName.trim(),
      quantity: quantityNumber,
      unit,
      // Spring Boot ProductRequestDTO expects the JSON property "price".
      price: priceNumber,
      condition,
      packaging,
      minimumQuantity: minimumQuantityNumber,
      location: location.trim(),
      availableDate: availableDate.trim() || null,
      availableTime: availableTime.trim() || null,
      deadlineDate: deadlineDate.trim() || null,
      deadlineTime: deadlineTime.trim() || null,
      freshness,
      storage,
      urgency,
      canDeliver,
      priceNegotiable,
      description: description.trim(),
    };

    try {
      setIsSubmitting(true);
      console.log('[Seller] POST product payload:', JSON.stringify(productData, null, 2));

      const token = await getToken();
      if (!token) {
        throw new Error('No saved access token was found. Please log in again.');
      }


      const response  = await addProduct(productData);

      if(response!= null){
          router.replace('/shop');
      }

      // const response = await apiClientProduct.post(
      //   '/product/create',
      //   productData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );



      // const result = response.data;
      // console.log('[Seller] HTTP status:', response.status);
      // console.log('[Seller] POST product response:', result);

      // Alert.alert('Success', 'Product listing created successfully.', [
      //   { text: 'OK', onPress: handleReset },
      // ]);
    } catch (error) {
      const status = error?.response?.status;
      const responseBody = error?.response?.data;
      console.error('[Seller] Product creation failed:', {
        status,
        responseBody,
        message: error?.message,
      });

      let message =
        responseBody?.message ||
        responseBody?.error ||
        error?.message ||
        'Unknown error';

      if (status === 400) {
        message = `Backend rejected the product data (400). Check DTO field names and types.\n${message}`;
      } else if (status === 401) {
        message = '401 Unauthorized: your token may be missing, invalid, or expired. Please log in again.';
      } else if (status === 403) {
        message = '403 Forbidden: your account may not have permission to create products.';
      } else if (status === 404) {
        message = '404 Not Found: check the product API URL and endpoint path.';
      } else if (!error?.response) {
        message = `No HTTP response. Check the phone/laptop network, backend URL, and firewall.\n${message}`;
      }

      Alert.alert('Could not publish listing', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCategory('Fruit');
    setProductName('');
    setQuantity('');
    setUnit('kg');
    setPrice('');
    setCondition('Freshly harvested');
    setPackaging('Plastic crates');
    setMinimumQuantity('1');
    setLocation('');
    setAvailableDate('');
    setAvailableTime('');
    setDeadlineDate('');
    setDeadlineTime('');
    setDatePickerTarget(null);
    setFreshness('2 days');
    setStorage('Shaded area');
    setUrgency('Normal');
    setCanDeliver(false);
    setPriceNegotiable(true);
    setDescription('');
    setOpenDropdown(null);
    Keyboard.dismiss();
  };

  return (
    <TheamView safe styles={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <ThemaText
                style={[styles.eyebrow, { color: theme.primary }]}
              >
                SELL WITH SEASONA
              </ThemaText>

              <ThemaText
                style={[styles.title, { color: theme.title }]}
              >
                Share your{"\n"}fresh harvest.
              </ThemaText>
            </View>

            <View
              style={[
                styles.headerIcon,
                { backgroundColor: theme.uiBackground },
              ]}
            >
              <Ionicons name="leaf" size={34} color={theme.primary} />
            </View>
          </View>

          <ThemaText style={[styles.subtitle, { color: theme.text }]}>
            Create a listing and connect your produce with local buyers.
          </ThemaText>

          <View
            style={[
              styles.notice,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={theme.primary}
            />
            <View style={styles.noticeText}>
              <ThemaText
                style={[styles.noticeTitle, { color: theme.title }]}
              >
                Ready to publish
              </ThemaText>
              <ThemaText
                style={[styles.noticeDescription, { color: theme.text }]}
              >
Your listing will be submitted to the product service.
              </ThemaText>
            </View>
          </View>
        </View>

        <Section
          title="Product information"
          subtitle="Tell buyers what you have available."
          icon="basket-outline"
          theme={theme}
        >
          <Dropdown
            label="Category"
            value={category}
            options={CATEGORIES}
            onSelect={handleCategoryChange}
            open={openDropdown === 'category'}
            onToggle={() => toggleDropdown('category')}
            theme={theme}
          />

          <ThemedInput
            label="Product name"
            placeholder={
              category === 'Fruit'
                ? 'e.g. Pineapple, Mango, Banana'
                : 'e.g. Carrot, Potato, Tomato'
            }
            value={productName}
            onChangeText={setProductName}
            autoCapitalize="words"
          />

          <View style={styles.row}>
            <View style={styles.flexField}>
              <ThemedInput
                label="Quantity"
                placeholder="e.g. 400"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.flexField}>
              <Dropdown
                label="Unit"
                value={unit}
                options={UNITS}
                onSelect={(value) => {
                  setUnit(value);
                  setOpenDropdown(null);
                }}
                open={openDropdown === 'unit'}
                onToggle={() => toggleDropdown('unit')}
                theme={theme}
              />
            </View>
          </View>

          <ThemedInput
            label={`Price per ${unit} (Rs.)`}
            placeholder="e.g. 250.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />

          <View
            style={[
              styles.totalCard,
              {
                backgroundColor: theme.uiBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.totalTop}>
              <View style={styles.totalIcon}>
                <Ionicons
                  name="calculator-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>

              <View style={styles.totalLabels}>
                <ThemaText
                  style={[styles.totalLabel, { color: theme.text }]}
                >
                  Total asking value
                </ThemaText>
                <ThemaText
                  style={[styles.totalHint, { color: theme.text }]}
                >
                  Quantity × price per unit
                </ThemaText>
              </View>
            </View>

            <ThemaText
              style={[styles.totalAmount, { color: theme.primary }]}
            >
              {formattedTotal}
            </ThemaText>
          </View>

          <Dropdown
            label="Product condition"
            value={condition}
            options={CONDITIONS}
            onSelect={(value) => {
              setCondition(value);
              setOpenDropdown(null);
            }}
            open={openDropdown === 'condition'}
            onToggle={() => toggleDropdown('condition')}
            theme={theme}
          />

          <Dropdown
            label="Packaging"
            value={packaging}
            options={PACKAGING_OPTIONS}
            onSelect={(value) => {
              setPackaging(value);
              setOpenDropdown(null);
            }}
            open={openDropdown === 'packaging'}
            onToggle={() => toggleDropdown('packaging')}
            theme={theme}
          />

          <ThemedInput
            label={`Minimum purchase quantity (${unit})`}
            placeholder={`e.g. 5 ${unit}`}
            value={minimumQuantity}
            onChangeText={setMinimumQuantity}
            keyboardType="decimal-pad"
          />
        </Section>

        <Section
          title="Collection details"
          subtitle="Help buyers plan when and where to collect."
          icon="location-outline"
          theme={theme}
        >
          <ThemedInput
            label="Collection location"
            placeholder="e.g. Gampaha, Sri Lanka"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
          />

          <View
            style={[
              styles.helperCard,
              { backgroundColor: theme.uiBackground },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={theme.primary}
            />
            <ThemaText
              style={[styles.helper, { color: theme.text }]}
            >
              Date format: YYYY-MM-DD. Time format: HH:MM using a
              24-hour clock. Dates and times are optional.
            </ThemaText>
          </View>

          <View style={styles.field}>
            <ThemaText style={[styles.label, { color: theme.title }]}>
              Available from — date
            </ThemaText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Choose available date${availableDate ? `, ${availableDate}` : ''}`}
              onPress={() => {
                Keyboard.dismiss();
                setDatePickerTarget('availableDate');
              }}
              style={({ pressed }) => [
                styles.dateInput,
                {
                  backgroundColor: theme.background,
                  borderColor: datePickerTarget === 'availableDate' ? theme.primary : theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <ThemaText style={{ color: availableDate ? theme.inputText : theme.text }}>
                {availableDate || 'Select available date'}
              </ThemaText>
              <Ionicons name="calendar-outline" size={20} color={theme.primary} />
            </Pressable>
            {datePickerTarget === 'availableDate' && (
              <DateTimePicker
                value={parseDate(availableDate)}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date(2000, 0, 1)}
              />
            )}
          </View>

          <ThemedInput
            label="Available from — time"
            placeholder="HH:MM"
            value={availableTime}
            onChangeText={setAvailableTime}
          />

          <View style={styles.field}>
            <ThemaText style={[styles.label, { color: theme.title }]}>
              Collection deadline — date
            </ThemaText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Choose collection deadline${deadlineDate ? `, ${deadlineDate}` : ''}`}
              onPress={() => {
                Keyboard.dismiss();
                setDatePickerTarget('deadlineDate');
              }}
              style={({ pressed }) => [
                styles.dateInput,
                {
                  backgroundColor: theme.background,
                  borderColor: datePickerTarget === 'deadlineDate' ? theme.primary : theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <ThemaText style={{ color: deadlineDate ? theme.inputText : theme.text }}>
                {deadlineDate || 'Select collection deadline'}
              </ThemaText>
              <Ionicons name="calendar-outline" size={20} color={theme.primary} />
            </Pressable>
            {datePickerTarget === 'deadlineDate' && (
              <DateTimePicker
                value={parseDate(deadlineDate || availableDate)}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
                minimumDate={availableDate ? parseDate(availableDate) : new Date(2000, 0, 1)}
              />
            )}
          </View>

          <ThemedInput
            label="Collection deadline — time"
            placeholder="HH:MM"
            value={deadlineTime}
            onChangeText={setDeadlineTime}
          />

          <Dropdown
            label="Estimated freshness"
            value={freshness}
            options={FRESHNESS_OPTIONS}
            onSelect={(value) => {
              setFreshness(value);
              setOpenDropdown(null);
            }}
            open={openDropdown === 'freshness'}
            onToggle={() => toggleDropdown('freshness')}
            theme={theme}
          />

          <Dropdown
            label="Storage conditions"
            value={storage}
            options={STORAGE_OPTIONS}
            onSelect={(value) => {
              setStorage(value);
              setOpenDropdown(null);
            }}
            open={openDropdown === 'storage'}
            onToggle={() => toggleDropdown('storage')}
            theme={theme}
          />
        </Section>

        <Section
          title="Selling preferences"
          subtitle="Set expectations for potential buyers."
          icon="options-outline"
          theme={theme}
        >
          <Dropdown
            label="Listing urgency"
            value={urgency}
            options={URGENCY_OPTIONS}
            onSelect={(value) => {
              setUrgency(value);
              setOpenDropdown(null);
            }}
            open={openDropdown === 'urgency'}
            onToggle={() => toggleDropdown('urgency')}
            theme={theme}
          />

          <YesNo
            label="Can you deliver the produce?"
            value={canDeliver}
            onChange={setCanDeliver}
            theme={theme}
          />

          <YesNo
            label="Is the price negotiable?"
            value={priceNegotiable}
            onChange={setPriceNegotiable}
            theme={theme}
          />

          <ThemedInput
            label="Additional description"
            placeholder="Describe the harvest, quality, or collection instructions..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </Section>

        <View style={styles.actions}>
          <TheamedButton
            label={isSubmitting ? 'Publishing...' : 'Publish listing'}
            onPress={handlePublish}
            disabled={isSubmitting}
          />

          {isSubmitting && (
            <ActivityIndicator
              size="small"
              color={theme.primary}
              style={{ marginTop: 8 }}
            />
          )}

          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [
              styles.resetButton,
              {
                borderColor: theme.border,
                backgroundColor: theme.card,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={theme.primary}
            />
            <ThemaText
              style={[styles.resetText, { color: theme.primary }]}
            >
              Reset form
            </ThemaText>
          </Pressable>

          <ThemaText
            style={[styles.footerNote, { color: theme.text }]}
          >
            Make sure your quantity, price, and collection details are
            correct before publishing.
          </ThemaText>
        </View>
      </ScrollView>
    </TheamView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 36,
    gap: 17,
  },

  header: {
    marginBottom: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  headerIcon: {
    width: 70,
    height: 70,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 11,
    marginBottom: 18,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 13,
    borderRadius: 15,
    borderWidth: 1,
  },
  noticeText: {
    flex: 1,
    gap: 3,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  noticeDescription: {
    fontSize: 11,
    lineHeight: 16,
  },


  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  flexField: {
    flex: 1,
    minWidth: 0,
  },


  totalCard: {
    borderRadius: 17,
    borderWidth: 1,
    padding: 15,
    marginBottom: 18,
  },
  totalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  totalIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabels: {
    flex: 1,
    gap: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  totalHint: {
    fontSize: 10,
  },
  totalAmount: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 14,
  },

  field: {
    marginBottom: 15,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  dateInput: {
    minHeight: 49,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  helperCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  helper: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
  },


  actions: {
    gap: 12,
    marginTop: 2,
  },
  resetButton: {
    minHeight: 49,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    paddingHorizontal: 12,
    marginTop: 2,
  },
});
