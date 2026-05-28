import { CulturaId, Diagnostico, Fazenda, Ponto, Risco, User } from '../types';
import { gerarOrientacao } from './orientacoes';

let counter = 0;
export function makeId(prefix = 'id'): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const round = (v: number, d = 1) => Number(v.toFixed(d));

/** Gera um polígono irregular (pontos relativos 0-1) para o mapa simulado. */
export function gerarPoligono(): Ponto[] {
  const cx = rand(0.42, 0.58);
  const cy = rand(0.42, 0.58);
  const n = 5 + Math.floor(rand(0, 3));
  const pts: Ponto[] = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const r = rand(0.22, 0.34);
    pts.push({
      x: round(Math.min(0.95, Math.max(0.05, cx + Math.cos(ang) * r)), 3),
      y: round(Math.min(0.95, Math.max(0.05, cy + Math.sin(ang) * r * 0.85)), 3),
    });
  }
  return pts;
}

function valoresPorRisco(risco: Risco) {
  if (risco === 'baixo') {
    return {
      ndvi: round(rand(0.62, 0.82), 2),
      temp: round(rand(23, 27)),
      precip: round(rand(80, 150)),
    };
  }
  if (risco === 'moderado') {
    return {
      ndvi: round(rand(0.42, 0.58), 2),
      temp: round(rand(27, 31)),
      precip: round(rand(28, 55)),
    };
  }
  return {
    ndvi: round(rand(0.22, 0.38), 2),
    temp: round(rand(31, 36)),
    precip: round(rand(2, 18)),
  };
}

export function gerarDiagnostico(
  fazendaId: string,
  risco: Risco,
  nome: string,
  cultura: CulturaId,
  data: Date = new Date(),
): Diagnostico {
  const v = valoresPorRisco(risco);
  return {
    id: makeId('diag'),
    fazendaId,
    data: data.toISOString(),
    ndviMedio: v.ndvi,
    tempMedia: v.temp,
    precip30d: v.precip,
    risco,
    orientacaoTexto: gerarOrientacao(risco, cultura, nome, v.precip),
  };
}

/** Série histórica de diagnósticos evoluindo até o risco atual. */
function gerarHistorico(
  fazendaId: string,
  nome: string,
  cultura: CulturaId,
  trajetoria: Risco[],
): Diagnostico[] {
  const total = trajetoria.length;
  return trajetoria.map((risco, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (total - 1 - i) * 5);
    return gerarDiagnostico(fazendaId, risco, nome, cultura, d);
  });
}

const TEST_NOME = 'Seu João';
const TEST_MUNICIPIO = 'Patrocínio - MG';

export const TEST_USER: User = {
  id: 'user_fiap',
  nome: TEST_NOME,
  email: 'fiap@teste.com',
  telefone: '(34) 99876-5432',
  municipio: TEST_MUNICIPIO,
  senha: '123456',
  createdAt: new Date('2026-03-01').toISOString(),
};

interface SeedFazenda {
  id: string;
  nome: string;
  cultura: CulturaId;
  areaHa: number;
  plantioMesesAtras: number;
  trajetoria: Risco[];
}

const SEED_FAZENDAS: SeedFazenda[] = [
  {
    id: 'faz_milho',
    nome: 'Sítio Boa Esperança',
    cultura: 'milho',
    areaHa: 4,
    plantioMesesAtras: 3,
    trajetoria: ['baixo', 'baixo', 'baixo', 'moderado', 'moderado'],
  },
  {
    id: 'faz_feijao',
    nome: 'Roça do Feijão',
    cultura: 'feijao',
    areaHa: 2,
    plantioMesesAtras: 2,
    trajetoria: ['moderado', 'baixo', 'baixo', 'baixo', 'baixo'],
  },
  {
    id: 'faz_cafe',
    nome: 'Lavoura do Córrego',
    cultura: 'cafe',
    areaHa: 3,
    plantioMesesAtras: 8,
    trajetoria: ['baixo', 'moderado', 'moderado', 'alto', 'alto'],
  },
];

export function seedData(): {
  users: User[];
  fazendas: Fazenda[];
  diagnosticos: Diagnostico[];
} {
  const fazendas: Fazenda[] = [];
  const diagnosticos: Diagnostico[] = [];

  for (const s of SEED_FAZENDAS) {
    const plantio = new Date();
    plantio.setMonth(plantio.getMonth() - s.plantioMesesAtras);
    fazendas.push({
      id: s.id,
      userId: TEST_USER.id,
      nome: s.nome,
      cultura: s.cultura,
      dataPlantio: plantio.toISOString(),
      municipio: TEST_MUNICIPIO,
      areaHa: s.areaHa,
      poligono: gerarPoligono(),
      criadoEm: plantio.toISOString(),
    });
    diagnosticos.push(
      ...gerarHistorico(s.id, TEST_NOME, s.cultura, s.trajetoria),
    );
  }

  return { users: [TEST_USER], fazendas, diagnosticos };
}
