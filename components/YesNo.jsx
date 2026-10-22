import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ThemaText from './ThemaText'; // Adjust the path if needed

const YesNo = ({ label, value, onChange, theme }) => {
  const options = [
    {
      label: 'Yes',
      value: true,
      icon: 'checkmark-circle-outline',
    },
    {
      label: 'No',
      value: false,
      icon: 'close-circle-outline',
    },
  ];

  return (
    <View style={styles.field}>
      {/* Label */}
      <ThemaText style={[styles.label, { color: theme.title }]}>
        {label}
      </ThemaText>

      {/* Yes / No Options */}
      <View style={styles.choiceRow}>
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.choiceButton,
                {
                  backgroundColor: selected
                    ? theme.uiBackground
                    : theme.background,
                  borderColor: selected
                    ? theme.primary
                    : theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={
                  selected ? theme.primary : theme.iconColor
                }
              />

              <ThemaText
                style={[
                  styles.choiceText,
                  {
                    color: selected ? theme.primary : theme.text,
                    fontWeight: selected ? '600' : '400',
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
};

export default YesNo;

const styles = StyleSheet.create({
  field: {
    width: '100%',
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  choiceRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  choiceButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  choiceText: {
    fontSize: 14,
  },
});