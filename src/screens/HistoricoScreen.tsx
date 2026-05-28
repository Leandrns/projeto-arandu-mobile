import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiscoBadge } from '../components/RiscoBadge';
import { useData } from '../context/DataContext';
import { AppStackParamList } from '../navigation/types';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { formatDate } from '../utils/format';
import { riscoInfo } from '../utils/risco';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export function HistoricoScreen() {
  const navigation = useNavigation<Nav>();
  const { fazendas, diagnosticosDoUsuario } = useData();
  const [filtro, setFiltro] = useState<string | null>(null);

  const nomeFazenda = useMemo(() => {
    const m: Record<string, string> = {};
    fazendas.forEach((f) => (m[f.id] = f.nome));
    return m;
  }, [fazendas]);

  const lista = useMemo(
    () => (filtro ? diagnosticosDoUsuario.filter((d) => d.fazendaId === filtro) : diagnosticosDoUsuario),
    [diagnosticosDoUsuario, filtro],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Acompanhe a evolução das suas lavouras</Text>
      </View>

      {fazendas.length > 0 && (
        <View style={styles.chipsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            <Chip label="Todas" ativo={!filtro} onPress={() => setFiltro(null)} />
            {fazendas.map((f) => (
              <Chip key={f.id} label={f.nome} ativo={filtro === f.id} onPress={() => setFiltro(f.id)} />
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={lista}
        keyExtractor={(d) => d.id}
        style={styles.flex}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const info = riscoInfo(item.risco);
          const ultimo = index === lista.length - 1;
          return (
            <Pressable
              style={styles.row}
              onPress={() => navigation.navigate('Diagnostico', { fazendaId: item.fazendaId })}
            >
              <View style={styles.timeline}>
                <View style={[styles.dot, { backgroundColor: info.color }]} />
                {!ultimo && <View style={styles.line} />}
              </View>
              <View style={styles.cardItem}>
                <View style={styles.rowTop}>
                  <Text style={styles.data}>{formatDate(item.data)}</Text>
                  <RiscoBadge risco={item.risco} />
                </View>
                {!filtro && <Text style={styles.fazenda}>{nomeFazenda[item.fazendaId]}</Text>}
                <Text style={styles.orientacao} numberOfLines={2}>{item.orientacaoTexto}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>NDVI {item.ndviMedio.toFixed(2)}</Text>
                  <Text style={styles.meta}>· {item.tempMedia}°C</Text>
                  <Text style={styles.meta}>· {item.precip30d}mm</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="timeline-text-outline" size={56} color={colors.primary} />
            <Text style={styles.emptyText}>Nenhum diagnóstico ainda.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function Chip({ label, ativo, onPress }: { label: string; ativo: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, ativo && styles.chipAtivo]}>
      <Text style={[styles.chipText, ativo && styles.chipTextAtivo]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { fontFamily: fonts.black, fontSize: fontSizes.heading, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textMuted },
  chipsWrap: { height: 52, marginBottom: spacing.sm },
  chips: { paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 180,
  },
  chipAtivo: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  chipText: { fontFamily: fonts.bold, fontSize: fontSizes.caption, color: colors.text },
  chipTextAtivo: { color: colors.textOnPrimary },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md },
  timeline: { alignItems: 'center', width: 16 },
  dot: { width: 16, height: 16, borderRadius: 8, marginTop: 6, borderWidth: 3, borderColor: colors.background },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  cardItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: 4,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  data: { fontFamily: fonts.bold, fontSize: fontSizes.caption, color: colors.textMuted },
  fazenda: { fontFamily: fonts.bold, fontSize: fontSizes.body, color: colors.text },
  orientacao: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.text, lineHeight: 20 },
  metaRow: { flexDirection: 'row', gap: spacing.xs, marginTop: 2 },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  emptyText: { fontFamily: fonts.regular, fontSize: fontSizes.body, color: colors.textMuted },
});
