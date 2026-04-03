import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    ...theme.shadows.soft,
    marginBottom: theme.spacing.m,
  },
});
