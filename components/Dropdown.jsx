import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ThemaText from './ThemaText'; // Adjust the path if needed

const Dropdown = ({
  label,
  value,
  options = [],
  onSelect,
  open,
  onToggle,
  theme,
}) => {
  return (
    <View style={styles.field}>
      {/* Label */}
      <ThemaText style={[styles.label, { color: theme.title }]}>
        {label}
      </ThemaText>

      {/* Dropdown Button */}
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
          style={[
            styles.dropdownValue,
            { color: theme.inputText },
          ]}
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

      {/* Dropdown Options */}
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
                accessibilityRole="button"
                accessibilityState={{ selected }}
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
                      color: selected
                        ? theme.primary
                        : theme.text,
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
};

export default Dropdown;

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

  dropdownButton: {
    minHeight: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownValue: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },

  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  dropdownOption: {
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionText: {
    flex: 1,
    fontSize: 14,
  },
});