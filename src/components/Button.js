import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export default function Button({ title, onPress, style, variant = 'primary' }) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'accent': return theme.colors.softAccent;
      case 'outline': return 'transparent';
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline': return theme.colors.primary;
      default: return theme.colors.card;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outline,
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.s,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
});
