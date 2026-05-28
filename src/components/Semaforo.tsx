import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { Risco } from '../types';
import { riscoInfo } from '../utils/risco';

const ORDEM: Risco[] = ['baixo', 'moderado', 'alto'];

interface Props {
  risco: Risco;
  compact?: boolean;
}

export function Semaforo({ risco, compact }: Props) {
  const info = riscoInfo(risco);
  const size = compact ? 18 : 28;

  return (
    <View style={[styles.wrap, { backgroundColor: info.cor10 }]}>
      <View style={[styles.lights, compact && styles.lightsCompact]}>
        {ORDEM.map((r) => {
          const ativo = r === risco;
          const c = riscoInfo(r).color;
          return (
            <View
              key={r}
              style={[
                styles.light,
                { width: size, height: size, borderRadius: size / 2 },
                { backgroundColor: ativo ? c : colors.border },
                ativo && { shadowColor: c, shadowOpacity: 0.6, shadowRadius: 8, elevation: 4 },
              ]}
            />
          );
        })}
      </View>
      {!compact && (
        <View style={styles.textWrap}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name={info.icon as any}
              size={22}
              color={info.color}
            />
            <Text style={[styles.status, { color: info.color }]}>
              {info.semaforo}
            </Text>
          </View>
          <Text style={styles.resumo}>{info.resumo}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  lights: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  lightsCompact: { gap: spacing.xs },
  light: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  textWrap: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  status: { fontFamily: fonts.black, fontSize: fontSizes.title },
  resumo: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.text },
});
