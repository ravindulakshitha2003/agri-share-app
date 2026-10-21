
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import TheamView from '../../components/TheamView';
import ThemaText from '../../components/ThemaText';
import { color } from '../../styles/colors';
import { listings } from '../../context/listings.js'

const GREEN = '#21834A';

const LOCATIONS = {
  gampaha: { latitude: 7.0917, longitude: 79.9997 },
  colombo: { latitude: 6.9271, longitude: 79.8612 },
  kurunegala: { latitude: 7.4863, longitude: 80.3623 },
  anuradhapura: { latitude: 8.3114, longitude: 80.4037 },
  hambantota: { latitude: 6.1429, longitude: 81.1212 },
  kandy: { latitude: 7.2906, longitude: 80.6337 },
  galle: { latitude: 6.0535, longitude: 80.2210 },
  matara: { latitude: 5.9549, longitude: 80.5550 },
  badulla: { latitude: 6.9934, longitude: 81.0550 },
  jaffna: { latitude: 9.6615, longitude: 80.0255 },
  ratnapura: { latitude: 6.6828, longitude: 80.3992 },
  batticaloa: { latitude: 7.7102, longitude: 81.6924 },
};

const getCoordinates = (item) => {
  const lat = item.latitude ?? item.lat;
  const lng = item.longitude ?? item.lng ?? item.lon;

  if (
    lat != null &&
    lng != null &&
    Number.isFinite(Number(lat)) &&
    Number.isFinite(Number(lng))
  ) {
    return { latitude: Number(lat), longitude: Number(lng) };
  }

  const location = String(item.location || '').toLowerCase();
  const town = Object.keys(LOCATIONS).find((key) =>
    location.includes(key)
  );

  if (town) return LOCATIONS[town];

  return { latitude: 7.8731, longitude: 80.7718 };
};

const getIcon = (name, category) => {
  const value = String(name || '').toLowerCase();

  if (value.includes('banana')) return '🍌';
  if (value.includes('mango')) return '🥭';
  if (value.includes('pineapple')) return '🍍';
  if (value.includes('papaya')) return '🥭';
  if (value.includes('watermelon')) return '🍉';
  if (value.includes('orange')) return '🍊';
  if (value.includes('coconut')) return '🥥';
  if (value.includes('carrot')) return '🥕';
  if (value.includes('tomato')) return '🍅';
  if (value.includes('eggplant')) return '🍆';

  return String(category).toLowerCase() === 'vegetable'
    ? '🥬'
    : '🍎';
};

const ratingColor = (rating) => {
  if (rating >= 4.5) return '#21834A';
  if (rating >= 3.5) return '#E5A000';
  return '#D64545';
};

function Chip({ label, active, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.primary : theme.card,
          borderColor: active ? theme.primary : theme.inputbox,
        },
      ]}
    >
      <Text
        style={{
          color: active ? '#FFFFFF' : theme.text,
          fontWeight: '600',
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function MapExplore() {
  const scheme = useColorScheme() ?? 'light';
  const theme = color[scheme];
  const router = useRouter();
  const { height, width } = useWindowDimensions();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [province, setProvince] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const provinces = useMemo(
    () => [
      'All',
      ...new Set(listings.map((item) => item.province).filter(Boolean)),
    ],
    []
  );

  const results = useMemo(() => {
    return listings.filter((item) => {
      const query = search.trim().toLowerCase();

      const searchMatch =
        !query ||
        String(item.name || '').toLowerCase().includes(query) ||
        String(item.location || '').toLowerCase().includes(query);

      const categoryMatch =
        category === 'All' ||
        String(item.category || '').toLowerCase() ===
          category.toLowerCase();

      const provinceMatch =
        province === 'All' || item.province === province;

      const rating = Number(item.seller?.rating || 0);
      const ratingMatch = rating >= minRating;

      const deliveryMatch =
        !deliveryOnly || item.canDeliver === true;

      const priceMatch =
        !maxPrice.trim() ||
        (
          Number.isFinite(Number(maxPrice)) &&
          Number(maxPrice) >= 0 &&
          Number(item.pricePerUnit) <= Number(maxPrice)
        );

      return (
        searchMatch &&
        categoryMatch &&
        provinceMatch &&
        ratingMatch &&
        deliveryMatch &&
        priceMatch
      );
    });
  }, [
    search,
    category,
    province,
    minRating,
    deliveryOnly,
    maxPrice,
  ]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setProvince('All');
    setMinRating(0);
    setDeliveryOnly(false);
    setMaxPrice('');
    setSelected(null);
    Keyboard.dismiss();
  };

  const openDetails = (item) => {
    router.push({
      pathname: '/selle',
      params: { id: String(item.id) },
    });
  };

  // Keep the map large on both short and tall phones.
  const mapHeight = Math.max(250, Math.min(height * 0.48, 480));

  return (
    <TheamView safe styles={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headingRow}>
          <View style={styles.headingText}>
            <ThemaText style={styles.heading}>
              Explore produce
            </ThemaText>
            <ThemaText style={[styles.subtitle, { color: theme.text }]}>
              Fresh from sellers across Sri Lanka
            </ThemaText>
          </View>

          <Pressable
            onPress={() => router.push('/shop')}
            style={[
              styles.shopButton,
              { backgroundColor: theme.uiBackground },
            ]}
            accessibilityLabel="Open shop"
          >
            <Ionicons name="basket-outline" size={23} color={theme.primary} />
          </Pressable>
        </View>

        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.inputbox,
            },
          ]}
        >
          <Ionicons name="search-outline" size={20} color={theme.iconColor} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search banana, mango, or town"
            placeholderTextColor={theme.iconColor}
            returnKeyType="search"
            style={[styles.searchInput, { color: theme.inputText }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={10}>
              <Ionicons name="close-circle" size={20} color={theme.iconColor} />
            </Pressable>
          )}
        </View>

        <View style={styles.categoryHeader}>
          <ThemaText style={styles.smallHeading}>Categories</ThemaText>
          <Pressable
            onPress={() => setFiltersOpen((value) => !value)}
            style={[
              styles.filterButton,
              {
                backgroundColor: filtersOpen ? theme.primary : theme.card,
                borderColor: theme.inputbox,
              },
            ]}
          >
            <Ionicons
              name="options-outline"
              size={17}
              color={filtersOpen ? '#FFFFFF' : theme.primary}
            />
            <Text
              style={{
                color: filtersOpen ? '#FFFFFF' : theme.primary,
                fontWeight: '700',
                fontSize: 13,
              }}
            >
              Filters
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {['All', 'Fruit', 'Vegetable'].map((item) => (
            <Chip
              key={item}
              label={
                item === 'All'
                  ? '🌱 All'
                  : item === 'Fruit'
                    ? '🍎 Fruits'
                    : '🥬 Vegetables'
              }
              active={category === item}
              onPress={() => setCategory(item)}
              theme={theme}
            />
          ))}
        </ScrollView>

        {filtersOpen && (
          <View
            style={[
              styles.filterPanel,
              {
                backgroundColor: theme.card,
                borderColor: theme.inputbox,
              },
            ]}
          >
            <View style={styles.filterPanelHeader}>
              <ThemaText style={styles.smallHeading}>Refine results</ThemaText>
              <Pressable onPress={resetFilters}>
                <Text style={{ color: theme.primary, fontWeight: '700' }}>
                  Reset
                </Text>
              </Pressable>
            </View>

            <ThemaText style={styles.filterLabel}>Province</ThemaText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterOptions}
            >
              {provinces.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  active={province === item}
                  onPress={() => setProvince(item)}
                  theme={theme}
                />
              ))}
            </ScrollView>

            <ThemaText style={styles.filterLabel}>Seller rating</ThemaText>
            <View style={styles.inlineOptions}>
              {[0, 3, 4, 4.5].map((rating) => (
                <Chip
                  key={rating}
                  label={rating === 0 ? 'Any' : `${rating}+ ⭐`}
                  active={minRating === rating}
                  onPress={() => setMinRating(rating)}
                  theme={theme}
                />
              ))}
            </View>

            <View style={styles.deliveryRow}>
              <View style={{ flex: 1 }}>
                <ThemaText style={styles.filterLabel}>
                  Delivery available
                </ThemaText>
                <Text style={{ color: theme.text, fontSize: 12 }}>
                  Show sellers who deliver
                </Text>
              </View>
              <Pressable
                onPress={() => setDeliveryOnly((value) => !value)}
                style={[
                  styles.toggle,
                  {
                    backgroundColor: deliveryOnly
                      ? theme.primary
                      : theme.uiBackground,
                  },
                ]}
              >
                <Ionicons
                  name={deliveryOnly ? 'checkmark' : 'close'}
                  size={18}
                  color={deliveryOnly ? '#FFFFFF' : theme.text}
                />
              </Pressable>
            </View>

            <ThemaText style={styles.filterLabel}>
              Maximum price per unit (LKR)
            </ThemaText>
            <TextInput
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
              placeholder="e.g. 300"
              placeholderTextColor={theme.iconColor}
              style={[
                styles.priceInput,
                {
                  color: theme.inputText,
                  backgroundColor: theme.background,
                  borderColor: theme.inputbox,
                },
              ]}
            />
          </View>
        )}
      </View>

      <View style={styles.mapHeading}>
        <View>
          <ThemaText style={styles.smallHeading}>Seller map</ThemaText>
          <Text style={{ color: theme.text, fontSize: 12, marginTop: 2 }}>
            {results.length} matching listings
          </Text>
        </View>
        <View style={styles.ratingLegend}>
          <View style={[styles.legendDot, { backgroundColor: GREEN }]} />
          <Text style={{ color: theme.text, fontSize: 11 }}>Top rated</Text>
        </View>
      </View>

      <View
        style={[
          styles.mapContainer,
          {
            height: filtersOpen
              ? Math.max(200, mapHeight * 0.7)
              : mapHeight,
            borderColor: theme.inputbox,
          },
        ]}
      >
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 7.8731,
            longitude: 80.7718,
            latitudeDelta: 4.5,
            longitudeDelta: 4.3,
          }}
          mapType="standard"
          showsCompass
          showsScale
          toolbarEnabled
        >
          {results.map((item) => (
            <Marker
              key={String(item.id)}
              coordinate={getCoordinates(item)}
              onPress={() => setSelected(item)}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor: ratingColor(
                      Number(item.seller?.rating || 0)
                    ),
                    borderColor:
                      selected?.id === item.id ? '#183D27' : '#FFFFFF',
                    transform: [
                      { scale: selected?.id === item.id ? 1.12 : 1 },
                    ],
                  },
                ]}
              >
                <Text style={styles.markerIcon}>
                  {getIcon(item.name, item.category)}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>

        {results.length === 0 && (
          <View
            style={[
              styles.emptyMap,
              { backgroundColor: theme.card },
            ]}
          >
            <Ionicons name="search-outline" size={28} color={theme.iconColor} />
            <Text style={{ color: theme.title, fontWeight: '700', marginTop: 8 }}>
              No matching produce
            </Text>
            <Text style={{ color: theme.text, textAlign: 'center', marginTop: 4 }}>
              Try another product or clear your filters.
            </Text>
            <Pressable onPress={resetFilters} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Clear filters</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.mapFooter}>
        <View style={styles.legendGroup}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#21834A' }]} />
            <Text style={{ color: theme.text, fontSize: 11 }}>4.5+</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E5A000' }]} />
            <Text style={{ color: theme.text, fontSize: 11 }}>3.5–4.4</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#D64545' }]} />
            <Text style={{ color: theme.text, fontSize: 11 }}>Below 3.5</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/shop')}
          style={styles.browseButton}
        >
          <Text style={styles.browseButtonText}>Browse shop</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      </View>

      {selected && (
        <View
          style={[
            styles.productCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.inputbox,
            },
          ]}
        >
          <View style={styles.productTop}>
            <View
              style={[
                styles.productIconBox,
                { backgroundColor: theme.uiBackground },
              ]}
            >
              <Text style={{ fontSize: 27 }}>
                {getIcon(selected.name, selected.category)}
              </Text>
            </View>

            <View style={styles.productInfo}>
              <ThemaText style={styles.productName}>
                {selected.name}
              </ThemaText>
              <Text style={{ color: theme.text, fontSize: 12, marginTop: 3 }}>
                {selected.location} · {selected.province}
              </Text>
              <Text style={{ color: theme.text, fontSize: 12, marginTop: 3 }}>
                ⭐ {Number(selected.seller?.rating || 0).toFixed(1)} ·{' '}
                {selected.seller?.username || 'Seller'}
              </Text>
            </View>

            <Pressable
              onPress={() => setSelected(null)}
              hitSlop={10}
              accessibilityLabel="Close product preview"
            >
              <Ionicons name="close-circle" size={24} color={theme.iconColor} />
            </Pressable>
          </View>

          <View style={styles.productBottom}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.primary, fontSize: 17, fontWeight: '800' }}>
                LKR {selected.pricePerUnit}
              </Text>
              <Text style={{ color: theme.text, fontSize: 12, marginTop: 2 }}>
                per {selected.unit} · {selected.quantity} {selected.unit} available
              </Text>
            </View>

            <Pressable
              onPress={() => openDetails(selected)}
              style={styles.detailsButton}
            >
              <Text style={styles.detailsButtonText}>View details</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      )}
    </TheamView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  header: {
    gap: 12,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingText: {
    flex: 1,
    gap: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
  },
  shopButton: {
    height: 44,
    width: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  searchBox: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallHeading: {
    fontSize: 15,
    fontWeight: '800',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryList: {
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 20,
  },
  filterPanel: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  filterPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  filterOptions: {
    gap: 7,
    paddingVertical: 2,
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  toggle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
  },
  mapHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  ratingLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mapContainer: {
    width: '100%',
    flexGrow: 0,
    flexShrink: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
  marker: {
    minWidth: 42,
    height: 42,
    paddingHorizontal: 4,
    borderRadius: 22,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  markerIcon: {
    fontSize: 21,
  },
  emptyMap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resetButton: {
    marginTop: 14,
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 10,
  },
  legendGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GREEN,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 11,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  productCard: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 13,
    marginBottom: 5,
  },
  productTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  productIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: '800',
  },
  productBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#9AA99C',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: GREEN,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
