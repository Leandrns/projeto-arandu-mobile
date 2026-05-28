import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getCultura } from '../data/culturas';
import { colors, fonts, fontSizes, radius, shadow, spacing } from '../theme';
import { Diagnostico, Fazenda } from '../types';
import { diasDesde } from '../utils/format';
import { riscoInfo } from '../utils/risco';
import { Semaforo } from './Semaforo';

interface Props {
  fazenda: Fazenda;
  diagnostico?: Diagnostico;
  onPress: () => void;
}

export function FazendaCard({ fazenda, diagnostico, onPress }: Props) {
  const cultura = getCultura(fazenda.cultura);
  const info = diagnostico ? riscoInfo(diagnostico.risco) : null;
  const dias = diagnostico ? diasDesde(diagnostico.data) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        info && { borderLeftColor: info.color, borderLeftWidth: 6 },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          name={cultura.icon as any}
          size={28}
          color={colors.primaryDark}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.nome} numberOfLines={1}>
          {fazenda.nome}
        </Text>
        <Text style={styles.meta}>
          {cultura.nome} · {fazenda.areaHa} ha
        </Text>
        {diagnostico && (
          <Text style={styles.meta}>
            {dias === 0 ? 'Atualizado hoje' : `há ${dias} dia${dias === 1 ? '' : 's'}`}
          </Text>
        )}
      </View>

      {diagnostico && <Semaforo risco={diagnostico.risco} compact />}
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 2 },
  nome: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.text },
  meta: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textMuted },
});
