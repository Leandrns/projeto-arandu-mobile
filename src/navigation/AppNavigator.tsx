import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { DiagnosticoScreen } from '../screens/DiagnosticoScreen';
import { HistoricoScreen } from '../screens/HistoricoScreen';
import { NovaFazendaScreen } from '../screens/NovaFazendaScreen';
import { PainelScreen } from '../screens/PainelScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { colors, fonts } from '../theme';
import { AppStackParamList, TabsParamList } from './types';

const Tab = createBottomTabNavigator<TabsParamList>();

const ICONS: Record<keyof TabsParamList, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Painel: 'view-dashboard-outline',
  Historico: 'timeline-text-outline',
  Perfil: 'account-outline',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12 },
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name={ICONS[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="Painel" component={PainelScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen
        name="NovaFazenda"
        component={NovaFazendaScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="Diagnostico" component={DiagnosticoScreen} />
    </Stack.Navigator>
  );
}
