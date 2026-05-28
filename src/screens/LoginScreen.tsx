import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/types';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar() {
    setErro('');
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao entrar.');
    } finally {
      setLoading(false);
    }
  }

  function preencherTeste() {
    setEmail('fiap@teste.com');
    setSenha('123456');
    setErro('');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Logo variant="white" width={170} />
            <Text style={styles.subtitle}>Bem-vindo de volta ao campo</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Entrar</Text>

            <Input
              label="E-mail"
              icon="email-outline"
              placeholder="seu@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Senha"
              icon="lock-outline"
              placeholder="••••••"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            {!!erro && (
              <View style={styles.erroBox}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.vermelho} />
                <Text style={styles.erroText}>{erro}</Text>
              </View>
            )}

            <AppButton title="Entrar" icon="login" onPress={entrar} loading={loading} />

            <Pressable onPress={preencherTeste} style={styles.testBox}>
              <MaterialCommunityIcons name="flask-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.testText}>
                Usar conta de teste (fiap@teste.com)
              </Text>
            </Pressable>

            <View style={styles.registerRow}>
              <Text style={styles.muted}>Ainda não tem conta?</Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Cadastre-se</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  header: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  subtitle: { fontFamily: fonts.regular, fontSize: fontSizes.body, color: colors.textOnPrimary, opacity: 0.95 },
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.xs,
  },
  title: { fontFamily: fonts.black, fontSize: fontSizes.heading, color: colors.text, marginBottom: spacing.md },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FBE5E0',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  erroText: { flex: 1, fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.vermelho },
  testBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  testText: { fontFamily: fonts.bold, fontSize: fontSizes.caption, color: colors.primaryDark },
  registerRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.lg },
  muted: { fontFamily: fonts.regular, fontSize: fontSizes.body, color: colors.textMuted },
  link: { fontFamily: fonts.bold, fontSize: fontSizes.body, color: colors.primaryDark },
});
