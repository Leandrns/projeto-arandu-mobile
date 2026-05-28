import AsyncStorage from '@react-native-async-storage/async-storage';
import { Diagnostico, Fazenda, User } from '../types';
import { seedData } from '../data/mock';

const KEYS = {
  users: '@arandu:users',
  session: '@arandu:session',
  fazendas: '@arandu:fazendas',
  diagnosticos: '@arandu:diagnosticos',
  onboarding: '@arandu:onboarding_seen',
  seeded: '@arandu:seeded',
} as const;

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function write<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/** Popula o AsyncStorage com dados mockados na primeira execução. */
export async function ensureSeed(): Promise<void> {
  const seeded = await AsyncStorage.getItem(KEYS.seeded);
  if (seeded) return;
  const { users, fazendas, diagnosticos } = seedData();
  await write(KEYS.users, users);
  await write(KEYS.fazendas, fazendas);
  await write(KEYS.diagnosticos, diagnosticos);
  await AsyncStorage.setItem(KEYS.seeded, 'true');
}

// ---- Users ----
export const getUsers = () => read<User[]>(KEYS.users, []);
export const saveUsers = (u: User[]) => write(KEYS.users, u);

// ---- Session ----
export const getSession = () => read<string | null>(KEYS.session, null);
export const setSession = (userId: string) => write(KEYS.session, userId);
export const clearSession = () => AsyncStorage.removeItem(KEYS.session);

// ---- Onboarding ----
export const getOnboardingSeen = async () =>
  (await AsyncStorage.getItem(KEYS.onboarding)) === 'true';
export const setOnboardingSeen = () =>
  AsyncStorage.setItem(KEYS.onboarding, 'true');

// ---- Fazendas ----
export const getFazendas = () => read<Fazenda[]>(KEYS.fazendas, []);
export const saveFazendas = (f: Fazenda[]) => write(KEYS.fazendas, f);

// ---- Diagnósticos ----
export const getDiagnosticos = () => read<Diagnostico[]>(KEYS.diagnosticos, []);
export const saveDiagnosticos = (d: Diagnostico[]) =>
  write(KEYS.diagnosticos, d);

/** Apaga tudo — usado em "redefinir dados de demonstração". */
export async function resetAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
