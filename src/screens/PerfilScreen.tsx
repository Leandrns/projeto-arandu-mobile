import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ensureSeed, resetAll } from '../services/storage';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { formatMesAno } from '../utils/format';

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

function InfoRow({
  icon,
  label,
  valor,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  valor: string;
}) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.primaryDark} />
      <View style={styles.flex}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{valor}</Text>
      </View>
    </View>
  );
}

interface Confirmacao {
  titulo: string;
  mensagem: string;
  cta: string;
  ctaColor: string;
  onConfirm: () => void | Promise<void>;
}

export function PerfilScreen() {
  const { user, logout } = useAuth();
  const { fazendas } = useData();
  const [confirm, setConfirm] = useState<Confirmacao | null>(null);

  function confirmarSair() {
    setConfirm({
      titulo: 'Sair da conta',
      mensagem: 'Deseja realmente sair?',
      cta: 'Sair',
      ctaColor: colors.vermelho,
      onConfirm: logout,
    });
  }

  function confirmarReset() {
    setConfirm({
      titulo: 'Redefinir demonstração',
      mensagem:
        'Isso apaga as fazendas que você criou e restaura os dados de exemplo. Você será desconectado.',
      cta: 'Redefinir',
      ctaColor: colors.vermelho,
      onConfirm: async () => {
        await resetAll();
        await ensureSeed();
        await logout();
      },
    });
  }

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciais(user.nome)}</Text>
          </View>
          <Text style={styles.nome}>{user.nome}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <Card style={styles.statCard}>
          <MaterialCommunityIcons name="barn" size={28} color={colors.primaryDark} />
          <Text style={styles.statNum}>{fazendas.length}</Text>
          <Text style={styles.statLabel}>
            {fazendas.length === 1 ? 'fazenda cadastrada' : 'fazendas cadastradas'}
          </Text>
        </Card>

        <Card style={{ gap: spacing.md }}>
          <InfoRow icon="phone-outline" label="Telefone" valor={user.telefone} />
          <View style={styles.divider} />
          <InfoRow icon="map-marker-outline" label="Município" valor={user.municipio} />
          <View style={styles.divider} />
          <InfoRow icon="calendar-outline" label="Membro desde" valor={formatMesAno(user.createdAt)} />
        </Card>

        <Card style={styles.sobre}>
          <Logo variant="black" width={120} />
          <Text style={styles.sobreText}>
            Arandu democratiza o acesso à tecnologia aeroespacial para o pequeno
            agricultor familiar. Protótipo — dados simulados, sem conexões externas.
          </Text>
          <View style={styles.ods}>
            {['ODS 1', 'ODS 2', 'ODS 9', 'ODS 13'].map((o) => (
              <View key={o} style={styles.odsBadge}>
                <Text style={styles.odsText}>{o}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.versao}>Versão 1.0</Text>
        </Card>

        <AppButton title="Redefinir demonstração" icon="refresh" variant="outline" onPress={confirmarReset} />
        <AppButton title="Sair da conta" icon="logout" variant="secondary" onPress={confirmarSair} />
      </ScrollView>

      <Modal
        visible={!!confirm}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirm(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setConfirm(null)}>
          <Pressable style={styles.dialog} onPress={() => {}}>
            <Text style={styles.dialogTitle}>{confirm?.titulo}</Text>
            <Text style={styles.dialogMsg}>{confirm?.mensagem}</Text>
            <View style={styles.dialogActions}>
              <Pressable style={styles.dialogBtn} onPress={() => setConfirm(null)}>
                <Text style={styles.dialogCancel}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.dialogBtn, { backgroundColor: confirm?.ctaColor }]}
                onPress={() => {
                  const acao = confirm?.onConfirm;
                  setConfirm(null);
                  acao?.();
                }}
              >
                <Text style={styles.dialogConfirm}>{confirm?.cta}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  head: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: { fontFamily: fonts.black, fontSize: fontSizes.heading, color: colors.textOnPrimary },
  nome: { fontFamily: fonts.bold, fontSize: fontSizes.title, color: colors.text },
  email: { fontFamily: fonts.regular, fontSize: fontSizes.body, color: colors.textMuted },
  statCard: { alignItems: 'center', gap: 2 },
  statNum: { fontFamily: fonts.black, fontSize: fontSizes.display, color: colors.text },
  statLabel: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textMuted },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  infoLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  infoValor: { fontFamily: fonts.bold, fontSize: fontSizes.body, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  sobre: { alignItems: 'center', gap: spacing.md },
  sobreText: { fontFamily: fonts.regular, fontSize: fontSizes.caption, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  ods: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  odsBadge: { backgroundColor: colors.primaryLight, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  odsText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
  versao: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31,42,36,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  dialogTitle: { fontFamily: fonts.bold, fontSize: fontSizes.subtitle, color: colors.text },
  dialogMsg: { fontFamily: fonts.regular, fontSize: fontSizes.body, color: colors.textMuted, lineHeight: 24 },
  dialogActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  dialogBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  dialogCancel: { fontFamily: fonts.bold, fontSize: fontSizes.body, color: colors.text },
  dialogConfirm: { fontFamily: fonts.bold, fontSize: fontSizes.body, color: colors.textOnPrimary },
});
