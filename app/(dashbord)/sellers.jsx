
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TheamView from '../../components/TheamView';
import ThemaText from '../../components/ThemaText';
import ThemedInput from '../../components/ThemedInput';
import TheamedButton from '../../components/TheamedButton';
import { color } from '../../styles/colors';

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

function Section({ title, subtitle, icon, theme, children }) {
  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionIcon,
            { backgroundColor: theme.uiBackground },
          ]}
        >
          <Ionicons name={icon} size={21} color={theme.primary} />
        </View>

        <View style={styles.sectionHeading}>
          <ThemaText
            style={[styles.sectionTitle, { color: theme.title }]}
          >
            {title}
          </ThemaText>

          <ThemaText
            style={[styles.sectionSubtitle, { color: theme.text }]}
          >
            {subtitle}
          </ThemaText>
        </View>
      </View>

      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function Dropdown({
  label,
  value,
  options,
  onSelect,
  open,
  onToggle,
  theme,
}) {
  return (
    <View style={styles.field}>
      <ThemaText style={[styles.label, { color: theme.title }]}>
        {label}
      </ThemaText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}. Tap to change`}
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.dropdownButton,
          {
            backgroundColor: theme.background,
            borderColor: open ? theme.primary : theme.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <ThemaText
          style={[styles.dropdownValue, { color: theme.inputText }]}
          numberOfLines={1}
        >
          {value || `Select ${label.toLowerCase()}`}
        </ThemaText>

        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.primary}
        />
      </Pressable>

      {open && (
        <View
          style={[
            styles.dropdownList,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {options.map((option) => {
            const selected = value === option;

            return (
              <Pressable
                key={option}
                onPress={() => {
                  onSelect(option);
                  Keyboard.dismiss();
                }}
                style={({ pressed }) => [
                  styles.dropdownOption,
                  {
                    backgroundColor: selected
                      ? theme.uiBackground
                      : pressed
                        ? theme.background
                        : 'transparent',
                  },
                ]}
              >
                <ThemaText
                  style={[
                    styles.optionText,
                    {
                      color: selected ? theme.primary : theme.text,
                      fontWeight: selected ? '700' : '400',
                    },
                  ]}
                >
                  {option}
                </ThemaText>

                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={19}
                    color={theme.primary}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function YesNo({ label, value, onChange, theme }) {
  return (
    <View style={styles.field}>
      <ThemaText style={[styles.label, { color: theme.title }]}>
        {label}
      </ThemaText>

      <View style={styles.choiceRow}>
        {[
          { label: 'Yes', value: true, icon: 'checkmark-circle-outline' },
          { label: 'No', value: false, icon: 'close-circle-outline' },
        ].map((option) => {
          const selected = value === option.value;

          return (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(option.value)}
              style={[
                styles.choiceButton,
                {
                  backgroundColor: selected
                    ? theme.uiBackground
                    : theme.background,
                  borderColor: selected
                    ? theme.primary
                    : theme.border,
                },
              ]}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={selected ? theme.primary : theme.iconColor}
              />

              <ThemaText
                style={[
                  styles.choiceText,
                  {
                    color: selected ? theme.primary : theme.text,
                  },
                ]}
              >
                {option.label}
              </ThemaText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

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
  const [freshness, setFreshness] = useState('2 days');
  const [storage, setStorage] = useState('Shaded area');

  const [urgency, setUrgency] = useState('Normal');
  const [canDeliver, setCanDeliver] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [description, setDescription] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const handlePublish = () => {
    Keyboard.dismiss();
    setOpenDropdown(null);

    if (!productName.trim()) {
      Alert.alert('Required', 'Please enter the product name.');
      return;
    }

    if (
      quantity.trim() === '' ||
      !Number.isFinite(quantityNumber) ||
      quantityNumber <= 0
    ) {
      Alert.alert(
        'Invalid quantity',
        'Enter a quantity greater than zero.'
      );
      return;
    }

    if (
      price.trim() === '' ||
      !Number.isFinite(priceNumber) ||
      priceNumber <= 0
    ) {
      Alert.alert('Invalid price', 'Enter a price greater than zero.');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Required', 'Please enter the collection location.');
      return;
    }

    if (
      minimumQuantity.trim() === '' ||
      !Number.isFinite(Number(minimumQuantity)) ||
      Number(minimumQuantity) <= 0
    ) {
      Alert.alert(
        'Invalid minimum quantity',
        'Enter a minimum purchase quantity greater than zero.'
      );
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
      availableDate.trim() &&
      !datePattern.test(availableDate.trim())
    ) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD for the available date.');
      return;
    }

    if (
      deadlineDate.trim() &&
      !datePattern.test(deadlineDate.trim())
    ) {
      Alert.alert(
        'Invalid date',
        'Use YYYY-MM-DD for the collection deadline.'
      );
      return;
    }

    if (
      availableTime.trim() &&
      !timePattern.test(availableTime.trim())
    ) {
      Alert.alert('Invalid time', 'Use HH:MM in 24-hour format.');
      return;
    }

    if (
      deadlineTime.trim() &&
      !timePattern.test(deadlineTime.trim())
    ) {
      Alert.alert('Invalid time', 'Use HH:MM in 24-hour format.');
      return;
    }

    if (
      availableDate &&
      deadlineDate &&
      deadlineDate < availableDate
    ) {
      Alert.alert(
        'Invalid dates',
        'The collection deadline cannot be before the available date.'
      );
      return;
    }

    if (
      availableDate &&
      deadlineDate === availableDate &&
      availableTime &&
      deadlineTime &&
      deadlineTime < availableTime
    ) {
      Alert.alert(
        'Invalid time',
        'The collection deadline cannot be before the available time.'
      );
      return;
    }

    const listing = {
      category,
      productName: productName.trim(),
      quantity: quantityNumber,
      unit,
      pricePerUnit: priceNumber,
      totalPrice,
      condition,
      packaging,
      minimumQuantity: Number(minimumQuantity),
      location: location.trim(),
      availableDate,
      availableTime,
      deadlineDate,
      deadlineTime,
      freshness,
      storage,
      urgency,
      canDeliver,
      priceNegotiable,
      description: description.trim(),
    };

    Alert.alert(
      'Listing preview',
      `${listing.productName}\n` +
        `Category: ${listing.category}\n` +
        `Quantity: ${listing.quantity} ${listing.unit}\n` +
        `Price: Rs. ${listing.pricePerUnit.toFixed(2)} per ${listing.unit}\n` +
        `Total asking value: ${formattedTotal}\n` +
        `Minimum purchase: ${listing.minimumQuantity} ${listing.unit}\n` +
        `Location: ${listing.location}\n\n` +
        'This is a preview only. No listing has been saved to a server.'
    );
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
                Listing preview mode
              </ThemaText>
              <ThemaText
                style={[styles.noticeDescription, { color: theme.text }]}
              >
                Your details are not sent to a server yet.
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

          <ThemedInput
            label="Available from — date"
            placeholder="YYYY-MM-DD"
            value={availableDate}
            onChangeText={setAvailableDate}
          />

          <ThemedInput
            label="Available from — time"
            placeholder="HH:MM"
            value={availableTime}
            onChangeText={setAvailableTime}
          />

          <ThemedInput
            label="Collection deadline — date"
            placeholder="YYYY-MM-DD"
            value={deadlineDate}
            onChangeText={setDeadlineDate}
          />

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
            label="Preview listing"
            onPress={handlePublish}
          />

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
            correct before previewing.
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

  section: {
    borderWidth: 1,
    borderRadius: 21,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 22,
  },
  sectionIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    lineHeight: 16,
  },
  sectionContent: {
    gap: 4,
  },

  field: {
    flex: 1,
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
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

  dropdownButton: {
    minHeight: 49,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 13,
  },
  dropdownList: {
    borderWidth: 1,
    borderRadius: 13,
    overflow: 'hidden',
    marginTop: 5,
  },
  dropdownOption: {
    minHeight: 46,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionText: {
    fontSize: 13,
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

  choiceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceButton: {
    flex: 1,
    minHeight: 47,
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  choiceText: {
    fontSize: 13,
    fontWeight: '700',
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
