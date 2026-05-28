import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { Input } from '../components/Input';
import { PoligonoDraw } from '../components/PoligonoDraw';
import { CULTURAS } from '../data/culturas';
import { useData } from '../context/DataContext';
import { AppStackParamList } from '../navigation/types';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { CulturaId, Ponto } from '../types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function NovaFazendaScreen() {
  const navigation = useNavigation<Nav>();
  const { addFazenda } = useData();
  const hoje = new Date();

  const [nome, setNome] = useState('');
  const [cultura, setCultura] = useState<CulturaId | null>(null);
  const [area, setArea] = useState('');
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const [poligono, setPoligono] = useState<Ponto[]>([]);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    setErro('');
    if (!nome.trim()) return setErro('Dê um nome para a fazenda.');
    if (!cultura) return setErro('Escolha a cultura plantada.');
    const areaNum = Number(area.replace(',', '.'));
    if (!areaNum || areaNum <= 0) return setErro('Informe a área em hectares.');

    setSalvando(true);
    try {
      const dataPlantio = new Date(ano, mes, 1).toISOString();
      const fazenda = await addFazenda({
        nome,
        cultura,
        dataPlantio,
        areaHa: Number(areaNum.toFixed(1)),
        poligono: poligono.length >= 3 ? poligono : undefined,
      });
      navigation.replace('Diagnostico', { fazendaId: fazenda.id });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao salvar.');
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Nova fazenda</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Input label="Nome da fazenda" icon="barn" placeholder="Ex.: Sítio Boa Esperança" value={nome} onChangeText={setNome} />

          <Text style={styles.label}>Cultura plantada</Text>
          <View style={styles.culturaGrid}>
            {CULTURAS.map((c) => {
              const ativo = cultura === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCultura(c.id)}
                  style={[styles.culturaItem, ativo && styles.culturaItemAtivo]}
                >
                  <MaterialCommunityIcons
                    name={c.icon as any}
                    size={34}
                    color={ativo ? colors.textOnPrimary : colors.primaryDark}
                  />
                  <Text style={[styles.culturaNome, ativo && styles.culturaNomeAtivo]}>{c.nome}</Text>
                </Pressable>
              );
            })}
          </View>

          <Input
            label="Área (hectares)"
            icon="ruler-square"
            placeholder="Ex.: 4"
            keyboardType="numeric"
            value={area}
            onChangeText={setArea}
          />

          <Text style={styles.label}>Mês de plantio</Text>
          <View style={styles.anoRow}>
            <Pressable onPress={() => setAno((a) => a - 1)} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-left" size={26} color={colors.primaryDark} />
            </Pressable>
            <Text style={styles.ano}>{ano}</Text>
            <Pressable onPress={() => setAno((a) => Math.min(hoje.getFullYear(), a + 1))} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-right" size={26} color={colors.primaryDark} />
            </Pressable>
          </View>
          <View style={styles.mesGrid}>
            {MESES.map((m, i) => {
              const ativo = mes === i;
              const futuro = ano === hoje.getFullYear() && i > hoje.getMonth();
              return (
                <Pressable
                  key={m}
                  disabled={futuro}
                  onPress={() => setMes(i)}
                  style={[styles.mesItem, ativo && styles.mesItemAtivo, futuro && styles.mesFuturo]}
                >
                  <Text style={[styles.mesText, ativo && styles.mesTextAtivo]}>{m}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Mapeamento da propriedade</Text>
          <Text style={styles.hint}>
            Modo toque: marque os cantos da plantação no mapa. (opcional — geramos um contorno se preferir)
          </Text>
          <PoligonoDraw pontos={poligono} onChange={setPoligono} />

          {!!erro && (
            <View style={styles.erroBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.vermelho} />
              <Text style={styles.erroText}>{erro}</Text>
            </View>
          )}

          <AppButton title="Salvar fazenda" icon="content-save-outline" onPress={salvar} loading={salvando} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topTitle: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.text },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  label: { fontFamily: fonts.bold, fontSize: fontSizes.caption, color: colors.text, marginBottom: spacing.sm },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  culturaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  culturaItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  culturaItemAtivo: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  culturaNome: { fontFamily: fonts.bold, fontSize: 13, color: colors.text },
  culturaNomeAtivo: { color: colors.textOnPrimary },
  anoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, marginBottom: spacing.sm },
  ano: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.text },
  mesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  mesItem: {
    width: '22%',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  mesItemAtivo: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  mesFuturo: { opacity: 0.35 },
  mesText: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.text },
  mesTextAtivo: { fontFamily: fonts.bold, color: colors.textOnPrimary },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FBE5E0',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  erroText: { flex: 1, fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.vermelho },
});
