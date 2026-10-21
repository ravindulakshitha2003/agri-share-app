
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { listings } from '../../context/listings.js';
import { color } from '../../styles/colors';
import TheamView from '../../components/TheamView.jsx';

const filters = ['All', 'Fruit', 'Vegetable'];

export default function Shop() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const theme = color[scheme] ?? color.light;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings.filter((item) => {
      const matchesName =
        item.name.toLowerCase().includes(query) ||
        (item.location || '').toLowerCase().includes(query) ||
        (item.seller?.username || '').toLowerCase().includes(query) ||
        (item.variety || '').toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesName && matchesCategory;
    });
  }, [search, selectedCategory]);

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return {
          backgroundColor: scheme === 'dark' ? '#4A2426' : '#FDECEC',
          textColor: scheme === 'dark' ? '#FF9A9A' : '#B42318',
        };
      case 'Urgent':
        return {
          backgroundColor: scheme === 'dark' ? '#49351D' : '#FFF2D9',
          textColor: scheme === 'dark' ? '#FFD08A' : '#995C00',
        };
      default:
        return {
          backgroundColor: scheme === 'dark' ? '#203D2D' : '#E8F5EC',
          textColor: scheme === 'dark' ? '#83D9A0' : '#267744',
        };
    }
  };

  const renderListing = ({ item }) => {
    const urgency = getUrgencyStyle(item.urgency);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${item.name} details`}
        onPress={() =>
          router.push({
            pathname: '/selle',
            params: { id: String(item.id) },
          })
        }
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
      >
        <View style={styles.cardTop}>
          <View style={styles.productIcon}>
            <Ionicons
              name={
                item.category?.toLowerCase() === 'vegetable'
                  ? 'leaf-outline'
                  : 'nutrition-outline'
              }
              size={25}
              color={theme.primary}
            />
          </View>

          <View style={styles.productInfo}>
            <Text
              style={[styles.productName, { color: theme.title }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text
              style={[styles.variety, { color: theme.text }]}
              numberOfLines={1}
            >
              {item.variety || item.category}
            </Text>
          </View>

          <View
            style={[
              styles.urgencyBadge,
              { backgroundColor: urgency.backgroundColor },
            ]}
          >
            <View
              style={[
                styles.urgencyDot,
                { backgroundColor: urgency.textColor },
              ]}
            />
            <Text
              style={[styles.urgencyText, { color: urgency.textColor }]}
            >
              {item.urgency || 'Available'}
            </Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <View>
            <Text style={[styles.priceLabel, { color: theme.text }]}>
              Price per {item.unit}
            </Text>
            <Text style={[styles.price, { color: theme.primary }]}>
              Rs. {Number(item.pricePerUnit || 0).toFixed(2)}
            </Text>
          </View>

          <View
            style={[
              styles.quantityBadge,
              { backgroundColor: theme.uiBackground },
            ]}
          >
            <Ionicons
              name="cube-outline"
              size={14}
              color={theme.primary}
            />
            <Text style={[styles.quantity, { color: theme.title }]}>
              {item.quantity} {item.unit}
            </Text>
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        <View style={styles.cardFooter}>
          <View style={styles.sellerAvatar}>
            <Ionicons
              name="person-outline"
              size={18}
              color={theme.primary}
            />
          </View>

          <View style={styles.sellerInfo}>
            <Text
              style={[styles.sellerName, { color: theme.title }]}
              numberOfLines={1}
            >
              @{item.seller?.username || 'Local seller'}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={13}
                color={theme.iconColor}
              />
              <Text
                style={[styles.location, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.location || 'Sri Lanka'}
                {item.seller?.province
                  ? `, ${item.seller.province}`
                  : ''}
              </Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#E9A23B" />
            <Text style={[styles.rating, { color: theme.title }]}>
              {Number(item.seller?.rating || 0).toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={[styles.reviewCount, { color: theme.text }]}>
            {item.seller?.reviewCount || 0} reviews
          </Text>

          <View style={styles.detailsLink}>
            <Text style={[styles.viewDetails, { color: theme.primary }]}>
              View details
            </Text>
            <Ionicons
              name="arrow-forward"
              size={15}
              color={theme.primary}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <TheamView safe styles={{ backgroundColor: theme.background }}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <FlatList
        data={filteredListings}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderListing}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={[styles.eyebrow, { color: theme.primary }]}>
                  FRESHNESS STARTS HERE
                </Text>

                <Text style={[styles.heading, { color: theme.title }]}>
                  Discover{'\n'}fresh produce.
                </Text>

                <Text style={[styles.subtitle, { color: theme.text }]}>
                  Good food, local farmers, better connections.
                </Text>
              </View>

              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: theme.uiBackground },
                ]}
              >
                <Ionicons
                  name="leaf"
                  size={30}
                  color={theme.primary}
                />
              </View>
            </View>

            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={21}
                color={theme.iconColor}
              />

              <TextInput
                style={[styles.searchInput, { color: theme.inputText }]}
                placeholder="Search produce, sellers, locations..."
                placeholderTextColor={theme.placeholder}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                returnKeyType="search"
                accessibilityLabel="Search produce"
              />

              {search.length > 0 && (
                <Pressable
                  onPress={() => setSearch('')}
                  accessibilityLabel="Clear search"
                  hitSlop={8}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={theme.iconColor}
                  />
                </Pressable>
              )}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.title }]}>
                Browse categories
              </Text>
            </View>

            <View style={styles.filterRow}>
              {filters.map((filter) => {
                const selected = selectedCategory === filter;

                return (
                  <Pressable
                    key={filter}
                    onPress={() => setSelectedCategory(filter)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[
                      styles.filterButton,
                      {
                        backgroundColor: selected
                          ? theme.primary
                          : theme.card,
                        borderColor: selected
                          ? theme.primary
                          : theme.border,
                      },
                    ]}
                  >
                    {filter !== 'All' && (
                      <Ionicons
                        name={
                          filter === 'Fruit'
                            ? 'nutrition-outline'
                            : 'leaf-outline'
                        }
                        size={16}
                        color={selected ? '#FFFFFF' : theme.text}
                      />
                    )}

                    <Text
                      style={[
                        styles.filterText,
                        { color: selected ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.resultsHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.title }]}>
                  Available produce
                </Text>
                <Text style={[styles.resultsSubtitle, { color: theme.text }]}>
                  Discover something fresh today
                </Text>
              </View>

              <View
                style={[
                  styles.countBadge,
                  { backgroundColor: theme.uiBackground },
                ]}
              >
                <Text style={[styles.countText, { color: theme.primary }]}>
                  {filteredListings.length}
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={36}
              color={theme.iconColor}
            />
            <Text style={[styles.emptyTitle, { color: theme.title }]}>
              No produce found
            </Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              Try another keyword or select a different category.
            </Text>

            <Pressable
              onPress={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              style={[
                styles.resetButton,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={styles.resetButtonText}>Clear filters</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      <View
        pointerEvents="box-none"
        style={styles.mapButtonWrapper}
      >
        <Pressable
          onPress={() => router.push('/map')}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.mapButton,
            {
              backgroundColor: theme.primary,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <Ionicons name="map-outline" size={20} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>Explore map</Text>
          <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
        </Pressable>
      </View>
    </TheamView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 9,
  },
  heading: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  headerIcon: {
    width: 66,
    height: 66,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchContainer: {
    minHeight: 54,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 13,
    fontSize: 13,
  },

  sectionHeader: {
    marginTop: 25,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  filterButton: {
    minHeight: 40,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },

  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 27,
    marginBottom: 15,
  },
  resultsSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  countBadge: {
    minWidth: 38,
    height: 38,
    borderRadius: 13,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '800',
  },

  card: {
    borderWidth: 1,
    borderRadius: 21,
    padding: 16,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  variety: {
    fontSize: 12,
    marginTop: 4,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 9,
  },
  urgencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '800',
  },

  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  priceLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  price: {
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  quantityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 11,
  },
  quantity: {
    fontSize: 11,
    fontWeight: '700',
  },

  separator: {
    height: 1,
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sellerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#EAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  sellerName: {
    fontSize: 12,
    fontWeight: '800',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    flex: 1,
    fontSize: 11,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: '#FFF5DF',
  },
  rating: {
    fontSize: 12,
    fontWeight: '800',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  reviewCount: {
    fontSize: 11,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewDetails: {
    fontSize: 12,
    fontWeight: '800',
  },

  emptyState: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 7,
  },
  resetButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 17,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  mapButtonWrapper: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 12,
  },
  mapButton: {
    minHeight: 54,
    borderRadius: 17,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.17,
    shadowRadius: 7,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
});
