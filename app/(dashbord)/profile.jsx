
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';

import TheamView from '../../components/TheamView';
import ThemaText from '../../components/ThemaText';
import ThemedInput from '../../components/ThemedInput';
import TheamedButton from '../../components/TheamedButton';

import { color } from '../../styles/colors';
import { listings } from '../../context/listings.js'
import LOGO from '../../assets/logo.png';

const Profile = () => {
  const router = useRouter();
  const colorTheme = useColorScheme() ?? 'light';
  const theme = color[colorTheme] ?? color.light;

  // Demo profile. Replace this with the authenticated user's data later.
  const [username, setUsername] = useState('farmer_gampaha');
  const [age, setAge] = useState('28');
  const [province, setProvince] = useState('Western Province');
  const [whatsappNumber, setWhatsappNumber] = useState('+94771234567');

  const [isEditing, setIsEditing] = useState(false);

  // Display only listings belonging to this user.
  const myListings = useMemo(
    () =>
      listings.filter(
        (item) =>
          item.seller.username.toLowerCase() === username.trim().toLowerCase()
      ),
    [username]
  );

  const handleSaveProfile = () => {
    if (!username.trim()) {
      Alert.alert('Required', 'Please enter a username.');
      return;
    }

    if (!age.trim() || !Number.isFinite(Number(age)) || Number(age) < 18) {
      Alert.alert('Invalid age', 'Please enter a valid age of 18 or older.');
      return;
    }

    if (!province.trim()) {
      Alert.alert('Required', 'Please enter your province.');
      return;
    }

    if (!whatsappNumber.trim()) {
      Alert.alert('Required', 'Please enter your WhatsApp number.');
      return;
    }

    setIsEditing(false);

    Alert.alert(
      'Profile updated',
      'Your changes have been saved locally for this demo.'
    );
  };

  const handleCancelEdit = () => {
    // Reset the form to the demo account's initial values.
    setUsername('farmer_gampaha');
    setAge('28');
    setProvince('Western Province');
    setWhatsappNumber('+94771234567');
    setIsEditing(false);
  };

  const openListing = (id) => {
    router.push({
      pathname: '/selle',
      params: { id },
    });
  };

  const openSellPage = () => {
    router.push('/sellers');
  };

  const openShopPage = () => {
    router.push('/shop');
  };

  return (
    <TheamView safe={true} styles={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page heading */}
        <View style={styles.header}>
          <ThemaText style={[styles.heading, { color: theme.title }]}>
            My Profile
          </ThemaText>

          <ThemaText style={[styles.subtitle, { color: theme.text }]}>
            Manage your account and produce listings.
          </ThemaText>
        </View>

        {/* Profile summary */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.inputbox,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.uiBackground },
            ]}
          >
            <Image
              source={LOGO}
              resizeMode="contain"
              style={styles.avatarImage}
            />
          </View>

          <ThemaText style={[styles.username, { color: theme.title }]}>
            @{username || 'username'}
          </ThemaText>

          <ThemaText style={[styles.provinceText, { color: theme.text }]}>
            {province || 'Province not provided'}
          </ThemaText>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemaText style={[styles.statNumber, { color: theme.primary }]}>
                {myListings.length}
              </ThemaText>
              <ThemaText style={[styles.statLabel, { color: theme.text }]}>
                My listings
              </ThemaText>
            </View>
          </View>
        </View>

        {/* Edit profile */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.inputbox,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <ThemaText style={[styles.sectionTitle, { color: theme.title }]}>
              Personal Details
            </ThemaText>

            {!isEditing && (
              <Pressable onPress={() => setIsEditing(true)}>
                <ThemaText
                  style={[styles.editText, { color: theme.primary }]}
                >
                  Edit
                </ThemaText>
              </Pressable>
            )}
          </View>

          <ThemedInput
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            editable={isEditing}
            autoCapitalize="none"
          />

          <ThemedInput
            label="Age"
            placeholder="Enter age"
            value={age}
            onChangeText={setAge}
            editable={isEditing}
            keyboardType="number-pad"
          />

          <ThemedInput
            label="Province"
            placeholder="Enter province"
            value={province}
            onChangeText={setProvince}
            editable={isEditing}
            autoCapitalize="words"
          />

          <ThemedInput
            label="WhatsApp Number"
            placeholder="Enter WhatsApp number"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            editable={isEditing}
            keyboardType="phone-pad"
          />

          {isEditing && (
            <View style={styles.editActions}>
              <View style={styles.actionButton}>
                <TheamedButton
                  label="Save Changes"
                  onPress={handleSaveProfile}
                />
              </View>

              <Pressable
                style={[
                  styles.cancelButton,
                  { borderColor: theme.inputbox },
                ]}
                onPress={handleCancelEdit}
              >
                <ThemaText style={{ color: theme.text, fontWeight: '600' }}>
                  Cancel
                </ThemaText>
              </Pressable>
            </View>
          )}
        </View>

        {/* My produce */}
        <View style={styles.listingHeading}>
          <View style={styles.listingHeadingText}>
            <ThemaText style={[styles.sectionTitle, { color: theme.title }]}>
              My Produce
            </ThemaText>

            <ThemaText style={[styles.subtitle, { color: theme.text }]}>
              Products you have published for sale.
            </ThemaText>
          </View>

          <Pressable
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={openSellPage}
          >
            <ThemaText style={styles.addButtonText}>+ Add</ThemaText>
          </Pressable>
        </View>

        {myListings.length > 0 ? (
          myListings.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => openListing(item.id)}
              style={({ pressed }) => [
                styles.listingCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.inputbox,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.listingTop}>
                <View style={styles.listingInfo}>
                  <ThemaText
                    style={[styles.productName, { color: theme.title }]}
                  >
                    {item.name}
                  </ThemaText>

                  <ThemaText style={[styles.subtitle, { color: theme.text }]}>
                    {item.variety} · {item.location}
                  </ThemaText>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.urgency === 'Critical'
                          ? '#FCE7E7'
                          : item.urgency === 'Urgent'
                            ? '#FFF1D6'
                            : '#E3F5E8',
                    },
                  ]}
                >
                  <ThemaText
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.urgency === 'Critical'
                            ? '#B42318'
                            : item.urgency === 'Urgent'
                              ? '#995C00'
                              : '#21834A',
                      },
                    ]}
                  >
                    {item.urgency}
                  </ThemaText>
                </View>
              </View>

              <ThemaText
                style={[styles.listingPrice, { color: theme.primary }]}
              >
                Rs. {item.pricePerUnit.toFixed(2)} / {item.unit}
              </ThemaText>

              <View style={styles.listingBottom}>
                <ThemaText style={[styles.subtitle, { color: theme.text }]}>
                  {item.quantity} {item.unit} available
                </ThemaText>

                <ThemaText
                  style={[styles.viewText, { color: theme.primary }]}
                >
                  View details →
                </ThemaText>
              </View>
            </Pressable>
          ))
        ) : (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.inputbox,
              },
            ]}
          >
            <ThemaText style={styles.emptyEmoji}>🌱</ThemaText>

            <ThemaText style={[styles.emptyTitle, { color: theme.title }]}>
              No produce listed yet
            </ThemaText>

            <ThemaText
              style={[
                styles.subtitle,
                styles.emptyDescription,
                { color: theme.text },
              ]}
            >
              Have fresh fruit or vegetables to sell? Publish your first
              listing to connect with buyers.
            </ThemaText>

            <TheamedButton
              label="Add Produce for Sale"
              onPress={openSellPage}
            />
          </View>
        )}

        {/* Buying shortcut */}
        <View
          style={[
            styles.buyCard,
            { backgroundColor: theme.uiBackground },
          ]}
        >
          <ThemaText style={[styles.buyTitle, { color: theme.title }]}>
            Looking for fresh produce?
          </ThemaText>

          <ThemaText style={[styles.subtitle, { color: theme.text }]}>
            Explore produce from farmers around Sri Lanka.
          </ThemaText>

          <View style={styles.buyButton}>
            <TheamedButton
              label="Browse Shop"
              onPress={openShopPage}
            />
          </View>
        </View>

        <ThemaText style={[styles.footer, { color: theme.text }]}>
          Seasona Fruit · Freshness starts here.
        </ThemaText>
      </ScrollView>
    </TheamView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 35,
    gap: 16,
  },
  header: {
    gap: 5,
    marginBottom: 3,
  },
  heading: {
    fontSize: 27,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    gap: 7,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  avatarImage: {
    width: 66,
    height: 66,
  },
  username: {
    fontSize: 20,
    fontWeight: '800',
  },
  provinceText: {
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D6E3D7',
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 3,
  },
  statNumber: {
    fontSize: 21,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  editText: {
    fontSize: 14,
    fontWeight: '700',
  },
  editActions: {
    gap: 10,
  },
  actionButton: {
    width: '100%',
  },
  cancelButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  listingHeadingText: {
    flex: 1,
    gap: 4,
  },
  addButton: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listingCard: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    gap: 12,
  },
  listingTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  listingInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listingPrice: {
    fontSize: 19,
    fontWeight: '800',
  },
  listingBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  viewText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 35,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: 4,
  },
  buyCard: {
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  buyTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  buyButton: {
    marginTop: 6,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 3,
  },
});
