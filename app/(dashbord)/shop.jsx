
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProducts } from '../../hooks/useProduct';

const PRIMARY = '#21834A';

const CATEGORIES = [
  'All',
  'Fruit',
  'Vegetable',
  'Other',
];

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

const ProductCard = ({ item, onPress, dark }) => {
  const name = item.productName?.trim() || 'Unnamed product';
  const location = item.location?.trim() || 'Location not provided';
  const quantity = Number(item.quantity);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: dark ? '#1C2921' : '#FFFFFF' },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={styles.productIcon}>
          <Ionicons
            name={
              (item.category || '').toLowerCase() === 'vegetable'
                ? 'leaf-outline'
                : 'nutrition-outline'
            }
            size={28}
            color={PRIMARY}
          />
        </View>

        <View style={styles.cardHeading}>
          <Text
            numberOfLines={1}
            style={[styles.productName, { color: dark ? '#FFFFFF' : '#17231B' }]}
          >
            {name}
          </Text>

          <Text style={styles.categoryText}>
            {item.category || 'Uncategorized'}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#77847B" />
            <Text
              numberOfLines={1}
              style={[styles.locationText, { color: dark ? '#B7C4BA' : '#69766D' }]}
            >
              {location}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#87938A" />
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.smallLabel}>Available quantity</Text>
          <Text style={[styles.quantityText, { color: dark ? '#FFFFFF' : '#26352A' }]}>
            {Number.isFinite(quantity) && quantity > 0
              ? `${quantity.toLocaleString('en-LK')} ${item.unit || ''}`.trim()
              : 'Not specified'}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.smallLabel}>Price</Text>
          <Text style={styles.priceText}>
            {formatPrice(item.price, item.priceNegotiable)}
          </Text>
        </View>
      </View>

      {item.priceNegotiable ? (
        <View style={styles.negotiableTag}>
          <Ionicons name="chatbubble-ellipses-outline" size={13} color={PRIMARY} />
          <Text style={styles.negotiableText}>Negotiable</Text>
        </View>
      ) : null}
    </Pressable>
  );
};

export default function Shop() {
  const router = useRouter();
  const { products = [], getallProduct, loading, error } = useProducts();

  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      await getallProduct();
    } catch (err) {
      console.error('Unable to load products:', err);
    }
  }, [getallProduct]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getallProduct();
    } finally {
      setRefreshing(false);
    }
  }, [getallProduct]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (item.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const searchableText = [
        item.productName,
        item.category,
        item.location,
        item.username,
        item.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [products, search, selectedCategory]);

  const openProduct = (item) => {
    if (!item?.id) {
      console.warn('This product has no backend ID:', item);
      return;
    }

    router.push({
      pathname: '/(dashbord)/selle',
      params: { id: String(item.id) },
    });
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: dark ? '#101812' : '#F5F8F5' },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: dark ? '#FFFFFF' : '#17231B' }]}>
            Fresh Market
          </Text>
          <Text style={styles.headerSubtitle}>
            Discover fresh produce from local sellers
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="leaf" size={24} color={PRIMARY} />
        </View>
      </View>

      <View
        style={[
          styles.searchBox,
          { backgroundColor: dark ? '#1C2921' : '#FFFFFF' },
        ]}
      >
        <Ionicons name="search-outline" size={21} color="#7D8A80" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search fruits, vegetables, sellers..."
          placeholderTextColor={dark ? '#98A59B' : '#89948C'}
          style={[styles.searchInput, { color: dark ? '#FFFFFF' : '#17231B' }]}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {search.length > 0 ? (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color="#7D8A80" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.categoryHeadingRow}>
        <Text style={[styles.sectionTitle, { color: dark ? '#FFFFFF' : '#17231B' }]}>
          Categories
        </Text>
        <Text style={styles.resultCount}>
          {filteredProducts.length} listings
        </Text>
      </View>

      <View style={styles.categoryList}>
        {CATEGORIES.map((category) => {
          const selected = selectedCategory === category;

          return (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selected
                  ? styles.categoryChipSelected
                  : {
                      backgroundColor: dark ? '#1C2921' : '#FFFFFF',
                      borderColor: dark ? '#34483A' : '#E0E8E1',
                    },
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  { color: selected ? '#FFFFFF' : dark ? '#D8E2DA' : '#536158' },
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.stateText}>Loading fresh produce...</Text>
        </View>
      ) : error && products.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons name="cloud-offline-outline" size={42} color="#9AA69D" />
          <Text style={[styles.stateTitle, { color: dark ? '#FFFFFF' : '#17231B' }]}>
            Could not load listings
          </Text>
          <Text style={styles.stateText}>{String(error)}</Text>
          <Pressable onPress={loadProducts} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              dark={dark}
              onPress={() => openProduct(item)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            filteredProducts.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PRIMARY}
              colors={[PRIMARY]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons name="basket-outline" size={48} color="#9AA69D" />
              <Text style={[styles.stateTitle, { color: dark ? '#FFFFFF' : '#17231B' }]}>
                No products found
              </Text>
              <Text style={styles.stateText}>
                Try another search or choose a different category.
              </Text>
              <Pressable
                onPress={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Clear filters</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#849087',
    fontSize: 13,
    marginTop: 5,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#E6F3E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    minHeight: 52,
    borderRadius: 15,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E6ECE7',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
  },
  categoryHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  resultCount: {
    fontSize: 12,
    color: '#849087',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
  },
  categoryChipSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 30,
    gap: 13,
  },
  card: {
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5EBE6',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: '#E9F5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeading: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryText: {
    fontSize: 12,
    color: PRIMARY,
    marginTop: 4,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 5,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E7ECE8',
    marginVertical: 14,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  smallLabel: {
    fontSize: 11,
    color: '#89948C',
    marginBottom: 5,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
  },
  priceContainer: {
    alignItems: 'flex-end',
    maxWidth: '55%',
  },
  priceText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
  },
  negotiableTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EAF5ED',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 12,
  },
  negotiableText: {
    fontSize: 11,
    color: PRIMARY,
    fontWeight: '600',
  },
  centerState: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
    gap: 10,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  stateTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },
  stateText: {
    color: '#89948C',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
  },
  retryButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 11,
    marginTop: 7,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
