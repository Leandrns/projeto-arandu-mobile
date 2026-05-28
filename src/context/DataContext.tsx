import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CulturaId, Diagnostico, Fazenda, Ponto, Risco } from '../types';
import {
  gerarDiagnostico,
  gerarPoligono,
  makeId,
} from '../data/mock';
import {
  getDiagnosticos,
  getFazendas,
  saveDiagnosticos,
  saveFazendas,
} from '../services/storage';
import { useAuth } from './AuthContext';

interface NovaFazendaInput {
  nome: string;
  cultura: CulturaId;
  dataPlantio: string;
  areaHa: number;
  poligono?: Ponto[];
}

interface DataContextValue {
  loading: boolean;
  fazendas: Fazenda[];
  diagnosticosDoUsuario: Diagnostico[];
  diagnosticosDaFazenda: (fazendaId: string) => Diagnostico[];
  ultimoDiagnostico: (fazendaId: string) => Diagnostico | undefined;
  addFazenda: (input: NovaFazendaInput) => Promise<Fazenda>;
  novoDiagnostico: (fazendaId: string) => Promise<Diagnostico | undefined>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

function sortDesc(list: Diagnostico[]): Diagnostico[] {
  return [...list].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );
}

function sortearRisco(): Risco {
  const r = Math.random();
  if (r < 0.5) return 'baixo';
  if (r < 0.85) return 'moderado';
  return 'alto';
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allFazendas, setAllFazendas] = useState<Fazenda[]>([]);
  const [allDiag, setAllDiag] = useState<Diagnostico[]>([]);

  const reload = useCallback(async () => {
    const [f, d] = await Promise.all([getFazendas(), getDiagnosticos()]);
    setAllFazendas(f);
    setAllDiag(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) reload();
    else setLoading(false);
  }, [user, reload]);

  const fazendas = useMemo(
    () => allFazendas.filter((f) => f.userId === user?.id),
    [allFazendas, user],
  );

  const diagnosticosDoUsuario = useMemo(() => {
    const ids = new Set(fazendas.map((f) => f.id));
    return sortDesc(allDiag.filter((d) => ids.has(d.fazendaId)));
  }, [allDiag, fazendas]);

  const diagnosticosDaFazenda = useCallback(
    (fazendaId: string) =>
      sortDesc(allDiag.filter((d) => d.fazendaId === fazendaId)),
    [allDiag],
  );

  const ultimoDiagnostico = useCallback(
    (fazendaId: string) => diagnosticosDaFazenda(fazendaId)[0],
    [diagnosticosDaFazenda],
  );

  const addFazenda = useCallback(
    async (input: NovaFazendaInput): Promise<Fazenda> => {
      if (!user) throw new Error('Sem usuário autenticado.');
      const fazenda: Fazenda = {
        id: makeId('faz'),
        userId: user.id,
        nome: input.nome.trim(),
        cultura: input.cultura,
        dataPlantio: input.dataPlantio,
        municipio: user.municipio,
        areaHa: input.areaHa,
        poligono: input.poligono?.length ? input.poligono : gerarPoligono(),
        criadoEm: new Date().toISOString(),
      };
      const diag = gerarDiagnostico(
        fazenda.id,
        sortearRisco(),
        user.nome,
        fazenda.cultura,
      );

      const nextFaz = [...allFazendas, fazenda];
      const nextDiag = [...allDiag, diag];
      setAllFazendas(nextFaz);
      setAllDiag(nextDiag);
      await Promise.all([saveFazendas(nextFaz), saveDiagnosticos(nextDiag)]);
      return fazenda;
    },
    [user, allFazendas, allDiag],
  );

  const novoDiagnostico = useCallback(
    async (fazendaId: string) => {
      if (!user) return undefined;
      const fazenda = allFazendas.find((f) => f.id === fazendaId);
      if (!fazenda) return undefined;
      const diag = gerarDiagnostico(
        fazendaId,
        sortearRisco(),
        user.nome,
        fazenda.cultura,
      );
      const nextDiag = [...allDiag, diag];
      setAllDiag(nextDiag);
      await saveDiagnosticos(nextDiag);
      return diag;
    },
    [user, allFazendas, allDiag],
  );

  const value = useMemo(
    () => ({
      loading,
      fazendas,
      diagnosticosDoUsuario,
      diagnosticosDaFazenda,
      ultimoDiagnostico,
      addFazenda,
      novoDiagnostico,
    }),
    [
      loading,
      fazendas,
      diagnosticosDoUsuario,
      diagnosticosDaFazenda,
      ultimoDiagnostico,
      addFazenda,
      novoDiagnostico,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData deve ser usado dentro de DataProvider');
  return ctx;
}
