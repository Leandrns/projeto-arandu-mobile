import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { NdviMap } from '../components/NdviMap';
import { Semaforo } from '../components/Semaforo';
import { getCultura } from '../data/culturas';
import { useData } from '../context/DataContext';
import { AppStackParamList } from '../navigation/types';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { diasDesde, formatDateLong } from '../utils/format';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Rt = RouteProp<AppStackParamList, 'Diagnostico'>;

function Metrica({
  icon,
  valor,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  valor: string;
  label: string;
}) {
  return (
    <View style={styles.metrica}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.primaryDark} />
      <Text style={styles.metricaValor}>{valor}</Text>
      <Text style={styles.metricaLabel}>{label}</Text>
    </View>
  );
}

export function DiagnosticoScreen() {
  const navigation = useNavigation<Nav>();
  const { fazendaId } = useRoute<Rt>().params;
  const { fazendas, ultimoDiagnostico, novoDiagnostico } = useData();

  const [falando, setFalando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const fazenda = fazendas.find((f) => f.id === fazendaId);
  const diag = fazenda ? ultimoDiagnostico(fazenda.id) : undefined;

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  if (!fazenda || !diag) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Fazenda não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const cultura = getCultura(fazenda.cultura);

  async function ouvir() {
    if (falando) {
      await Speech.stop();
      setFalando(false);
      return;
    }
    setFalando(true);
    Speech.speak(diag!.orientacaoTexto, {
      language: 'pt-BR',
      rate: 0.95,
      onDone: () => setFalando(false),
      onStopped: () => setFalando(false),
      onError: () => setFalando(false),
    });
  }

  async function atualizar() {
    setAtualizando(true);
    await Speech.stop();
    setFalando(false);
    await novoDiagnostico(fazenda!.id);
    setAtualizando(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
        </Pressable>
        <View style={styles.flex}>
          <Text style={styles.topTitle} numberOfLines={1}>{fazenda.nome}</Text>
          <Text style={styles.topSub}>
            {cultura.nome} · {fazenda.areaHa} ha
          </Text>
        </View>
        <View style={styles.culturaIcon}>
          <MaterialCommunityIcons name={cultura.icon as any} size={24} color={colors.primaryDark} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.dataDiag}>
          Diagnóstico de {formatDateLong(diag.data)}
        </Text>

        <Semaforo risco={diag.risco} />

        <Card style={styles.mapCard}>
          <Text style={styles.cardTitle}>Mapa da propriedade</Text>
          <Text style={styles.cardHint}>
            Áreas avermelhadas indicam onde a lavoura sofre mais.
          </Text>
          <NdviMap poligono={fazenda.poligono} ndviBase={diag.ndviMedio} seed={fazenda.id} />
        </Card>

        <Card style={styles.orientacaoCard}>
          <View style={styles.orientacaoHead}>
            <MaterialCommunityIcons name="message-text-outline" size={22} color={colors.primaryDark} />
            <Text style={styles.cardTitle}>Orientação para você</Text>
          </View>
          <Text style={styles.orientacaoTexto}>{diag.orientacaoTexto}</Text>
          <AppButton
            title={falando ? 'Parar' : 'Ouvir orientação'}
            icon={falando ? 'stop' : 'volume-high'}
            onPress={ouvir}
            variant={falando ? 'outline' : 'primary'}
          />
        </Card>

        <View style={styles.metricas}>
          <Metrica icon="leaf" valor={diag.ndviMedio.toFixed(2)} label="NDVI médio" />
          <Metrica icon="thermometer" valor={`${diag.tempMedia}°C`} label="Temp. média" />
          <Metrica icon="weather-pouring" valor={`${diag.precip30d}mm`} label="Chuva 30d" />
          <Metrica icon="calendar-clock" valor={`${diasDesde(fazenda.dataPlantio)}d`} label="Após plantio" />
        </View>

        <AppButton
          title="Atualizar diagnóstico"
          icon="satellite-uplink"
          variant="secondary"
          loading={atualizando}
          onPress={atualizar}
        />
        <Text style={styles.disclaimer}>
          Dados simulados. O Arandu não substitui a opinião de um agrônomo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  notFound: { fontFamily: fonts.regular, fontSize: fontSizes.body, color: colors.text, padding: spacing.lg },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topTitle: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.text },
  topSub: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textMuted },
  culturaIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  dataDiag: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textMuted },
  mapCard: { gap: spacing.xs },
  cardTitle: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.text },
  cardHint: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textMuted, marginBottom: spacing.sm },
  orientacaoCard: { gap: spacing.md, backgroundColor: colors.primaryLight, borderColor: '#CDEBD5' },
  orientacaoHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  orientacaoTexto: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.subtitle,
    color: colors.text,
    lineHeight: 28,
  },
  metricas: { flexDirection: 'row', gap: spacing.sm },
  metrica: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  metricaValor: { fontFamily: fonts.bold, fontSize: fontSizes.body, color: colors.text },
  metricaLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  disclaimer: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
