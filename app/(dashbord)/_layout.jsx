import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProductProvider } from '../../context/ProductContext';

const _Layout = () => {
  return (
    <ProductProvider>

   
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#48D1B0',
          height: 65,
          paddingTop: 8,
          paddingBottom: 8,
          marginBottom: 10,
          marginHorizontal: 12,
          borderRadius: 18,
          borderTopWidth: 0,
          elevation: 5,
        },

        tabBarActiveTintColor: '#02380d',
        tabBarInactiveTintColor: '#121312',

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'storefront' : 'storefront-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sellers"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
          name="selle"
          options={{
            href: null,
          }}
          />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Explore Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
     </ProductProvider>
    
  );
};

export default _Layout;
