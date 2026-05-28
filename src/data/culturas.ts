import { Cultura, CulturaId } from '../types';

export const CULTURAS: Cultura[] = [
  { id: 'milho', nome: 'Milho', icon: 'corn' },
  { id: 'feijao', nome: 'Feijão', icon: 'seed' },
  { id: 'cafe', nome: 'Café', icon: 'coffee' },
  { id: 'soja', nome: 'Soja', icon: 'sprout' },
  { id: 'mandioca', nome: 'Mandioca', icon: 'carrot' },
  { id: 'hortalicas', nome: 'Hortaliças', icon: 'leaf' },
];

export function getCultura(id: CulturaId): Cultura {
  return CULTURAS.find((c) => c.id === id) ?? CULTURAS[0];
}
