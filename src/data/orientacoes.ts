import { CulturaId, Risco } from '../types';
import { nomeSaudacao } from '../utils/format';
import { getCultura } from './culturas';

const primeiroNome = nomeSaudacao;

/**
 * Mock da camada de IA Generativa (Gemini): transforma o diagnóstico
 * numérico em orientação humanizada e regional. Sem chamada externa.
 */
export function gerarOrientacao(
  risco: Risco,
  cultura: CulturaId,
  nome: string,
  precip30d: number,
): string {
  const n = primeiroNome(nome);
  const c = getCultura(cultura).nome.toLowerCase();

  if (risco === 'baixo') {
    return `${n}, tá tudo tranquilo por aqui! O ${c} está verdinho e bem hidratado, a chuva das últimas semanas deu conta do recado. Pode seguir o trato normal e aproveitar o bom momento da lavoura.`;
  }
  if (risco === 'moderado') {
    return `${n}, o ${c} ainda está firme, mas a chuva andou rareando e a terra começa a secar (só ${Math.round(precip30d)} mm no último mês). Fique de olho nos próximos dias e, se puder, já deixe a irrigação pronta pra não deixar a planta sentir sede.`;
  }
  return `${n}, a terra tá pedindo água! Faltou chuva (só ${Math.round(precip30d)} mm em 30 dias) e o ${c} já começa a sofrer com o calor. Se puder molhar amanhã cedinho, antes do sol esquentar, ajuda muito a salvar a safra.`;
}

/** Texto curto da notificação push (mockada). */
export function gerarAlerta(risco: Risco, nome: string): string {
  const n = primeiroNome(nome);
  if (risco === 'alto') {
    return `Atenção, ${n}: previsão de estiagem forte nos próximos 12 dias. Toque para ver o que fazer.`;
  }
  return `${n}, sua lavoura mostra sinais precoces de estresse. Dê uma olhada no painel.`;
}
