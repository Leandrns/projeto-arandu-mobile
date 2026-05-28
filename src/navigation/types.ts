import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type TabsParamList = {
  Painel: undefined;
  Historico: undefined;
  Perfil: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  NovaFazenda: undefined;
  Diagnostico: { fazendaId: string };
};
