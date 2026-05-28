import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts, fontSizes, radius, spacing } from '../theme';
import { Risco } from '../types';
import { riscoInfo } from '../utils/risco';

export function RiscoBadge({ risco }: { risco: Risco }) {
  const info = riscoInfo(risco);
  return (
    <View style={[styles.badge, { backgroundColor: info.cor10 }]}>
      <MaterialCommunityIcons
        name={info.icon as any}
        size={16}
        color={info.color}
      />
      <Text style={[styles.text, { color: info.color }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontFamily: fonts.bold, fontSize: fontSizes.caption },
});
