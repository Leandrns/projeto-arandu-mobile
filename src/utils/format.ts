const MESES = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

const MESES_LONGOS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} de ${MESES_LONGOS[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatMesAno(iso: string): string {
  const d = new Date(iso);
  return `${MESES_LONGOS[d.getMonth()]} de ${d.getFullYear()}`;
}

export function diasDesde(iso: string): number {
  const d = new Date(iso).getTime();
  return Math.max(0, Math.floor((Date.now() - d) / 86_400_000));
}

const HONORIFICOS = new Set([
  'seu', 'sr', 'sr.', 'sra', 'sra.', 'dona', 'dna', 'dr', 'dr.', 'dra', 'dra.',
]);

/** Nome para saudação: mantém o pronome de tratamento ("Seu João"). */
export function nomeSaudacao(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (!partes[0]) return 'amigo';
  if (HONORIFICOS.has(partes[0].toLowerCase()) && partes[1]) {
    return `${partes[0]} ${partes[1]}`;
  }
  return partes[0];
}

export function formatTelefone(v: string): string {
  const n = v.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}
