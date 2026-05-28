export type Risco = 'baixo' | 'moderado' | 'alto';

export type CulturaId =
  | 'milho'
  | 'feijao'
  | 'cafe'
  | 'soja'
  | 'mandioca'
  | 'hortalicas';

export interface Cultura {
  id: CulturaId;
  nome: string;
  /** nome de ícone do MaterialCommunityIcons */
  icon: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  municipio: string;
  /** mock — armazenado apenas localmente (AsyncStorage) */
  senha: string;
  createdAt: string;
}

export interface Ponto {
  x: number;
  y: number;
}

export interface Fazenda {
  id: string;
  userId: string;
  nome: string;
  cultura: CulturaId;
  dataPlantio: string;
  municipio: string;
  areaHa: number;
  /** polígono simulado: pontos relativos (0-1) no mapa mockado */
  poligono: Ponto[];
  criadoEm: string;
}

export interface Diagnostico {
  id: string;
  fazendaId: string;
  data: string;
  /** Índice de Vegetação por Diferença Normalizada (0-1) */
  ndviMedio: number;
  tempMedia: number;
  precip30d: number;
  risco: Risco;
  orientacaoTexto: string;
}
