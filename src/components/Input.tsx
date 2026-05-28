import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';

interface Props extends TextInputProps {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  error?: string;
}

export function Input({ label, icon, error, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          focused && styles.focused,
          !!error && styles.errored,
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={focused ? colors.primaryDark : colors.textMuted}
          />
        )}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.caption,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 54,
  },
  focused: { borderColor: colors.primary },
  errored: { borderColor: colors.vermelho },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.caption,
    color: colors.vermelho,
    marginTop: spacing.xs,
  },
});
