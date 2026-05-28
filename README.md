# Arandu — A tecnologia dos satélites no bolso do pequeno agricultor

## Sobre a solução

A **Arandu** é uma plataforma mobile que democratiza o acesso à tecnologia aeroespacial para pequenos agricultores familiares brasileiros. Combinando imagens de satélite (Copernicus/Sentinel-2 e NASA POWER), modelos de Machine Learning para previsão de risco agrícola e IA Generativa para acessibilidade linguística, o app traduz dados técnicos complexos em orientações simples, visuais e em áudio, ajudando o agricultor a tomar decisões antes que o problema fique visível a olho nu.

**Problema atacado:** Pequenos agricultores não têm acesso aos dados aeroespaciais usados pelo grande agronegócio, resultando em perdas evitáveis de safra por secas, pragas e estresse hídrico.

**Solução:** Um aplicativo "semáforo" simples (verde / amarelo / vermelho), alimentado por satélites, IA preditiva e orientações faladas em linguagem regional acessível.

### Principais funcionalidades

- Cadastro do agricultor e mapeamento da propriedade via desenho de polígono no mapa.
- Coleta diária de imagens de satélite e dados meteorológicos por coordenada.
- Cálculo do NDVI (Índice de Vegetação por Diferença Normalizada) por área.
- Classificação de risco da safra (Baixo / Moderado / Alto) por modelo de ML.
- Orientação humanizada gerada por IA Generativa, com leitura em áudio (TTS).
- Notificações push em caso de mudança crítica de status.
- Histórico dos diagnósticos da propriedade.

### Alinhamento com as ODS da ONU

- ODS 1 — Erradicação da Pobreza
- ODS 2 — Fome Zero e Agricultura Sustentável
- ODS 9 — Indústria, Inovação e Infraestrutura
- ODS 13 — Ação contra a Mudança Global do Clima

## Integrantes

| Nome | RM |
| --- | --- |
| Caio Alexandre dos Santos | 558460 |
| Leandro do Nascimento Souza | 558893 |
| Rafael de Mônaco Maniezo | 556079 |
| Vinicius Rozas Pannuci de Paula Cont | 555338 |

## Como rodar o projeto

Pré-requisitos: Node.js LTS instalado e o app **Expo Go** no celular (ou um emulador Android/iOS).

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o projeto:

   ```bash
   npx expo start
   ```

3. Escaneie o QR Code exibido no terminal com o app Expo Go (Android) ou com a câmera (iOS).

## Usuário de teste

Para avaliação, utilize as credenciais abaixo na tela de login:

- **Login:** `fiap@teste.com`
- **Senha:** `123456`
