import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';
import { AppNavigator } from './AppNavigator';
import { AuthStack } from './AuthStack';

export function RootNavigator() {
  const { loading, user, onboardingSeen } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <Logo variant="white" width={200} />
        <ActivityIndicator color={colors.textOnPrimary} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthStack onboardingSeen={onboardingSeen} />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
