import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '../types';
import { makeId } from '../data/mock';
import {
  clearSession,
  ensureSeed,
  getOnboardingSeen,
  getSession,
  getUsers,
  saveUsers,
  setOnboardingSeen,
  setSession,
} from '../services/storage';

interface RegisterInput {
  nome: string;
  email: string;
  telefone: string;
  municipio: string;
  senha: string;
}

interface AuthContextValue {
  loading: boolean;
  user: User | null;
  onboardingSeen: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [onboardingSeen, setOnboardingSeenState] = useState(false);

  useEffect(() => {
    (async () => {
      await ensureSeed();
      const [seen, sessionId, users] = await Promise.all([
        getOnboardingSeen(),
        getSession(),
        getUsers(),
      ]);
      setOnboardingSeenState(seen);
      if (sessionId) {
        setUser(users.find((u) => u.id === sessionId) ?? null);
      }
      setLoading(false);
    })();
  }, []);

  async function login(email: string, senha: string) {
    const users = await getUsers();
    const found = users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase(),
    );
    if (!found) throw new Error('E-mail não encontrado. Verifique ou cadastre-se.');
    if (found.senha !== senha) throw new Error('Senha incorreta. Tente novamente.');
    await setSession(found.id);
    setUser(found);
  }

  async function register(data: RegisterInput) {
    const users = await getUsers();
    const exists = users.some(
      (u) => u.email.trim().toLowerCase() === data.email.trim().toLowerCase(),
    );
    if (exists) throw new Error('Já existe uma conta com esse e-mail.');
    const novo: User = {
      id: makeId('user'),
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
      telefone: data.telefone.trim(),
      municipio: data.municipio.trim(),
      senha: data.senha,
      createdAt: new Date().toISOString(),
    };
    await saveUsers([...users, novo]);
    await setSession(novo.id);
    setUser(novo);
  }

  async function logout() {
    await clearSession();
    setUser(null);
  }

  async function completeOnboarding() {
    await setOnboardingSeen();
    setOnboardingSeenState(true);
  }

  const value = useMemo(
    () => ({ loading, user, onboardingSeen, login, register, logout, completeOnboarding }),
    [loading, user, onboardingSeen],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
