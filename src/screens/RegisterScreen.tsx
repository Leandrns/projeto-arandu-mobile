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
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/types';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { formatTelefone } from '../utils/format';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function cadastrar() {
    setErro('');
    if (!nome.trim() || !email.trim() || !telefone.trim() || !municipio.trim() || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (senha !== confirma) {
      setErro('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await register({ nome, email, telefone, municipio, senha });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao cadastrar.');
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topbar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <MaterialCommunityIcons name="arrow-left" size={26} color={colors.textOnPrimary} />
          </Pressable>
          <Text style={styles.topTitle}>Criar conta</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.intro}>
            Cadastre-se para começar a acompanhar suas lavouras.
          </Text>

          <Input label="Nome" icon="account-outline" placeholder="Seu nome" value={nome} onChangeText={setNome} />
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
            label="Telefone"
            icon="phone-outline"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={(v) => setTelefone(formatTelefone(v))}
          />
          <Input
            label="Município"
            icon="map-marker-outline"
            placeholder="Cidade - UF"
            value={municipio}
            onChangeText={setMunicipio}
          />
          <Input
            label="Senha"
            icon="lock-outline"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <Input
            label="Confirmar senha"
            icon="lock-check-outline"
            placeholder="Repita a senha"
            secureTextEntry
            value={confirma}
            onChangeText={setConfirma}
          />

          {!!erro && (
            <View style={styles.erroBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.vermelho} />
              <Text style={styles.erroText}>{erro}</Text>
            </View>
          )}

          <AppButton title="Cadastrar" icon="account-plus-outline" onPress={cadastrar} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  flex: { flex: 1 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topTitle: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.textOnPrimary },
  scroll: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  intro: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FBE5E0',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  erroText: { flex: 1, fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.vermelho },
});
