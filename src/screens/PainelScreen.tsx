import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FazendaCard } from '../components/FazendaCard';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { gerarAlerta } from '../data/orientacoes';
import { AppStackParamList } from '../navigation/types';
import { colors, fonts, fontSizes, radius, shadow, spacing } from '../theme';
import { Risco } from '../types';
import { nomeSaudacao } from '../utils/format';
import { riscoInfo } from '../utils/risco';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const PESO: Record<Risco, number> = { baixo: 0, moderado: 1, alto: 2 };

export function PainelScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { fazendas, ultimoDiagnostico } = useData();

  const primeiroNome = user ? nomeSaudacao(user.nome) : '';

  const comDiag = fazendas.map((f) => ({ f, d: ultimoDiagnostico(f.id) }));
  const piores = comDiag
    .filter((x) => x.d)
    .sort((a, b) => PESO[b.d!.risco] - PESO[a.d!.risco]);
  const alerta = piores[0];
  const mostrarAlerta = alerta && alerta.d!.risco !== 'baixo';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={fazendas}
        keyExtractor={(f) => f.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={styles.flex}>
                <Text style={styles.ola}>Olá, {primeiroNome} 👋</Text>
                <View style={styles.locRow}>
                  <MaterialCommunityIcons name="map-marker" size={16} color={colors.textOnPrimary} />
                  <Text style={styles.loc}>{user?.municipio}</Text>
                </View>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countNum}>{fazendas.length}</Text>
                <Text style={styles.countLbl}>fazenda(s)</Text>
              </View>
            </View>

            {mostrarAlerta && (
              <Pressable
                style={[styles.alerta, { borderLeftColor: riscoInfo(alerta!.d!.risco).color }]}
                onPress={() => navigation.navigate('Diagnostico', { fazendaId: alerta!.f.id })}
              >
                <MaterialCommunityIcons name="bell-ring" size={22} color={riscoInfo(alerta!.d!.risco).color} />
                <View style={styles.flex}>
                  <Text style={styles.alertaTitle}>Arandu · Atenção</Text>
                  <Text style={styles.alertaText} numberOfLines={2}>
                    {gerarAlerta(alerta!.d!.risco, user?.nome ?? '')}
                  </Text>
                </View>
              </Pressable>
            )}

            <Text style={styles.section}>Suas lavouras</Text>
          </View>
        }
        renderItem={({ item }) => (
          <FazendaCard
            fazenda={item}
            diagnostico={ultimoDiagnostico(item.id)}
            onPress={() => navigation.navigate('Diagnostico', { fazendaId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="sprout-outline" size={64} color={colors.primary} />
            <Text style={styles.emptyTitle}>Nenhuma lavoura ainda</Text>
            <Text style={styles.emptyText}>
              Cadastre sua primeira propriedade para começar a receber diagnósticos.
            </Text>
          </View>
        }
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate('NovaFazenda')}>
        <MaterialCommunityIcons name="plus" size={26} color={colors.textOnPrimary} />
        <Text style={styles.fabText}>Nova fazenda</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  list: { padding: spacing.lg, paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  ola: { fontFamily: fonts.black, fontSize: fontSizes.title, color: colors.textOnPrimary },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  loc: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textOnPrimary, opacity: 0.95 },
  countBadge: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  countNum: { fontFamily: fonts.black, fontSize: fontSizes.heading, color: colors.textOnPrimary },
  countLbl: { fontFamily: fonts.regular, fontSize: 12, color: colors.textOnPrimary },
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderLeftWidth: 6,
    ...shadow.card,
  },
  alertaTitle: { fontFamily: fonts.bold, fontSize: fontSizes.caption, color: colors.text },
  alertaText: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textMuted, marginTop: 2 },
  section: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  emptyTitle: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.text },
  emptyText: { fontFamily: fonts.regular, fontSize: fontSizes.body, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.lg },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    ...shadow.card,
  },
  fabText: { fontFamily: fonts.bold, fontSize: fontSizes.body, color: colors.textOnPrimary },
});
