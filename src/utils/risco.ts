import { colors } from '../theme';
import { Risco } from '../types';

interface RiscoInfo {
  label: string;
  color: string;
  cor10: string;
  semaforo: string;
  icon: string;
  resumo: string;
}

const MAP: Record<Risco, RiscoInfo> = {
  baixo: {
    label: 'Baixo',
    color: colors.verde,
    cor10: '#E4F6E9',
    semaforo: 'VERDE',
    icon: 'check-circle',
    resumo: 'Plantação saudável',
  },
  moderado: {
    label: 'Moderado',
    color: colors.amarelo,
    cor10: '#FDF4D9',
    semaforo: 'AMARELO',
    icon: 'alert',
    resumo: 'Sinais precoces de estresse',
  },
  alto: {
    label: 'Alto',
    color: colors.vermelho,
    cor10: '#FBE5E0',
    semaforo: 'VERMELHO',
    icon: 'alert-octagon',
    resumo: 'Risco crítico — ação imediata',
  },
};

export function riscoInfo(risco: Risco): RiscoInfo {
  return MAP[risco];
}

/** Deriva o risco a partir do NDVI (0-1): mock da camada de ML. */
export function riscoFromNdvi(ndvi: number): Risco {
  if (ndvi >= 0.6) return 'baixo';
  if (ndvi >= 0.4) return 'moderado';
  return 'alto';
}
