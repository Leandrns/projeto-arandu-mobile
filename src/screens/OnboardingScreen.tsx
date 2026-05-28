import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/types';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const SLIDES = [
  {
    icon: 'satellite-variant',
    titulo: 'Satélites no seu bolso',
    texto:
      'O Arandu traz a mesma tecnologia espacial do grande agronegócio para a sua lavoura — de graça.',
  },
  {
    icon: 'traffic-light',
    titulo: 'Simples como um semáforo',
    texto:
      'Verde, amarelo ou vermelho. Você vê na hora se a plantação está bem ou precisa de cuidado.',
  },
  {
    icon: 'volume-high',
    titulo: 'Orientação que fala com você',
    texto:
      'Dicas em linguagem simples, com opção de ouvir em voz alta. Sem palavra difícil.',
  },
] as const;

export function OnboardingScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const { completeOnboarding } = useAuth();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  }

  async function avancar() {
    if (index < SLIDES.length - 1) {
      const next = index + 1;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      await completeOnboarding();
      navigation.replace('Login');
    }
  }

  async function pular() {
    await completeOnboarding();
    navigation.replace('Login');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Logo variant="white" width={150} />
        <Text style={styles.tagline}>A tecnologia dos satélites no bolso do agricultor</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={onScroll}
      >
        {SLIDES.map((s) => (
          <View key={s.titulo} style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={s.icon} size={72} color={colors.textOnPrimary} />
            </View>
            <Text style={styles.titulo}>{s.titulo}</Text>
            <Text style={styles.texto}>{s.texto}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton
          title={index === SLIDES.length - 1 ? 'Começar' : 'Próximo'}
          onPress={avancar}
          variant="secondary"
        />
        {index < SLIDES.length - 1 && (
          <Text style={styles.skip} onPress={pular}>
            Pular
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  top: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.lg, gap: spacing.sm },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.caption,
    color: colors.textOnPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, gap: spacing.lg },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: fonts.black,
    fontSize: fontSizes.heading,
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
  texto: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.subtitle,
    color: colors.textOnPrimary,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.95,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: colors.textOnPrimary, width: 22 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  skip: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
});
