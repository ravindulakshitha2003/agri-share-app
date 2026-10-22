import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ThemaText from './ThemaText'; // Adjust the path if needed

const Section = ({ title, subtitle, icon, theme, children }) => {
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
      {/* Section Header */}
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

      {/* Section Content */}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  section: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  sectionHeading: {
    flex: 1,
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },

  sectionContent: {
    width: '100%',
    gap: 12,
  },
});