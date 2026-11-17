# Voz de Potência

**Sua voz. Sua essência. Sua potência.**

Protótipo navegável de alta fidelidade de uma plataforma de desenvolvimento comportamental, pessoal e profissional para mulheres. Todo o frontend funciona com dados mockados e persistência local. Não há backend, autenticação, IA real ou pagamentos.

## Executar localmente

Requisitos: Node.js 20.19+ (recomendado 22) e npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

Outros comandos:

```bash
npm run lint       # oxlint
npm run typecheck  # tsc -b
npm run build      # typecheck + build de produção em dist/
npm run preview    # serve o build (http://localhost:4173)
```

> Para publicar o `dist/` em uma hospedagem estática, configure o fallback de SPA (todas as rotas → `index.html`).
> Sem fallback, use `npm run build:static` (rotas com `#/`, caminhos relativos). Para ambientes embutidos em iframe, use `npm run build:embed` (navegação em memória).

## Executar com Docker

Requisitos: Docker 24+ (com Docker Compose v2).

```bash
docker compose up -d --build     # http://localhost:8080
docker compose logs -f           # acompanhar logs
docker compose down              # parar
```

Para usar outra porta: `PORT=3000 docker compose up -d --build`.

Sem Compose:

```bash
docker build -t voz-de-potencia .
docker run -d --name voz-de-potencia -p 8080:80 voz-de-potencia
```

Como funciona:
- `Dockerfile` multi-stage: a etapa `node:22-bookworm-slim` roda `npm ci` + `npm run build`; a etapa final é `nginx:1.27-alpine` servindo apenas o `dist/` (imagem leve, sem Node em produção).
- `docker/nginx.conf`: fallback de SPA (todas as rotas → `index.html`), cache longo para `/assets` (arquivos com hash), gzip, cabeçalhos de segurança e endpoint `/healthz` usado pelo `HEALTHCHECK`.
- A gravação de voz (microfone) exige contexto seguro: funciona em `localhost`; em servidor remoto, publique atrás de HTTPS (proxy reverso como Traefik, Caddy ou Nginx com TLS).

## Rotas principais

| Rota | Tela |
|---|---|
| `/` | Landing page pública |
| `/onboarding` | Primeiro acesso (5 etapas) |
| `/app` | Home da usuária demo (Marina Almeida) |
| `/app/jornada`, `/app/jornada/:dia` | Jornada de 21 dias |
| `/app/metodo` | Método POTÊNCIA |
| `/app/mapa` | Mapa da Potência |
| `/app/academia`, `/app/academia/:exercicio` | Academia da Voz e gravação |
| `/app/laboratorio`, `/app/laboratorio/:id` | Laboratório Comportamental |
| `/app/respostas` | Baralho de Respostas Poderosas |
| `/app/rituais`, `/app/rituais/:id` | Rituais de Energia |
| `/app/diario` | Meu Diário |
| `/app/biblioteca`, `/app/biblioteca/:id` | Biblioteca e leitor |
| `/app/aurora` | Aurora IA (demonstrativa) |
| `/app/evolucao` | Minha Evolução e conquistas |
| `/app/comunidade` | Círculo de Potência (demonstrativo) |
| `/app/planos`, `/app/checkout/:plano` | Planos e checkout simulado |
| `/app/configuracoes` | Perfil, preferências e restauração da demo |
| `/app/praticar` | Hub “Praticar” (navegação mobile) |
| `/admin`, `/admin/:secao` | Painel administrativo mockado |

## Documentação técnica

- **Arquitetura e critérios de aceitação:** veja [`PROJECT_PLAN.md`](./PROJECT_PLAN.md).
- **Mocks centralizados:** `src/mocks/*`. Para trocar a persona demo, edite `src/mocks/users.ts`; o histórico de atividades que gera os números do painel está em `src/mocks/analytics.ts`.
- **Tipos:** `src/types/index.ts`.
- **Persistência:** `localStorage` (`vdp-app-state-v1` para dados da usuária e `vdp-content-v1` para conteúdo editável no admin) e IndexedDB (`vdp-audio`) para gravações. “Configurações → Restaurar demonstração” limpa tudo.
- **Pontuação:** atividade 20, missão 30, oratória 25, simulação 25 (ritual 10, leitura 5, check-in 3). Cada atividade gera pontos uma única vez (missões e rituais: uma vez por dia).
- **Controle de acesso por plano:** `src/hooks/useProgress.ts` (`useAccess`) e `src/mocks/plans.ts` (`freeAccess`).
- **Imagens:** fotografias do Unsplash (Licença Unsplash) salvas em `public/images` e registradas em `src/mocks/images.ts`. Uso ilustrativo.

## Funcionalidades implementadas (funcionam de verdade, localmente)

- Onboarding completo com cálculo de autopercepção em 8 dimensões e sugestão de jornada.
- Jornada de 21 dias com conteúdo original, conclusão de atividades, missões, reflexões salvas no diário e navegação livre entre dias.
- Mapa da Potência com reavaliação (24 perguntas) que substitui os valores atuais e mantém histórico.
- 30 simulações com feedback predefinido, filtros, repetição e acompanhamento.
- Gravação de voz real no navegador (MediaRecorder), com reprodução, exclusão e armazenamento em IndexedDB.
- 60 cards com busca, filtros, favoritos, cópia, compartilhamento (Web Share ou cópia) e **exportação em PNG** com a identidade visual.
- 12 rituais com player por etapas, favoritos e histórico.
- Diário com CRUD, busca, filtros, favoritos e exportação Markdown/JSON.
- Biblioteca com 20 conteúdos e leitor interno.
- Painel de evolução com filtros de período, atualizado a cada atividade.
- Gamificação: 8 medalhas com desbloqueio e animação discreta; sem rankings ou punições.
- Comunidade com reações, comentários, publicações, grupos e desafios locais.
- Alternância de plano (Gratuito/Experience) com bloqueios de conteúdo correspondentes.
- Painel administrativo com criação, edição, publicação/despublicação e exclusão locais, refletidas imediatamente na plataforma.
- Acessibilidade: navegação por teclado, foco visível, link “pular para o conteúdo”, textos alternativos, ARIA em controles, texto ampliado, alto contraste e redução de movimento.

## Funcionalidades simuladas (identificadas na interface)

| Funcionalidade | Como é simulada |
|---|---|
| Aurora IA | Respostas predefinidas por palavras-chave e roteiros de personagens; fallback para perguntas não previstas |
| Análise de voz | Indicadores de exemplo (1min12s, 128 ppm, 4 preenchimentos, 6 pausas), não calculados a partir da gravação |
| Áudio do dia / players de ritual | Player demonstrativo sem arquivo de som |
| Comunidade | 12 perfis e 15 publicações fictícias; interações salvas apenas no navegador |
| Checkout | Fluxo sem coleta de dados bancários e sem cobrança |
| Indicadores comerciais do admin | Dados fictícios rotulados |
| Notificações | Exibidas no sino; preferências salvas, sem envio real |
| Autenticação | Inexistente; usuária demo fixa |

## Orientações para integração com backend

1. **Camada de serviços:** substitua as leituras dos stores por chamadas HTTP mantendo as mesmas interfaces de `src/types`. Sugestão: criar `src/services/api/*.ts` (ex.: `getSimulations()`, `saveJournalEntry()`) e usar TanStack Query para cache, mantendo o Zustand apenas para estado de interface.
2. **Conteúdo (CMS/admin):** `useContentStore` espelha as coleções que o backend deve expor (simulações, cards, biblioteca, rituais, banners, planos, notificações, missões). As operações `upsert`/`remove` mapeiam para `POST/PUT/DELETE`.
3. **Progresso e gamificação:** as regras de pontos e conquistas estão em `useAppStore` (`record`, `evaluateAchievements`). No backend, mova essas regras para o servidor e use chaves idempotentes (`day:8`, `sim:<id>`, `mission:<id>:<data>`) para evitar pontos duplicados.
4. **Aurora:** implemente `AuroraProvider` (`src/services/auroraService.ts`) chamando seu backend, que por sua vez fala com o provedor de IA. Mantenha o filtro de segurança e as mensagens sobre limites (sem atendimento psicológico).
5. **Áudio:** para análise real, envie gravações apenas com consentimento explícito para um endpoint próprio; hoje `audioStore` é 100% local.
6. **Autenticação:** introduza um provedor (ex.: Supabase Auth, Auth0, Clerk) e substitua `demoUser` pelo perfil autenticado. Remova “Restaurar demonstração” em produção.
7. **Pagamentos:** integre um provedor (ex.: Stripe, Mercado Pago, Pagar.me) via checkout hospedado, sem coletar dados de cartão nesta aplicação.
8. **Comunidade:** requer moderação, denúncia, políticas de uso e LGPD antes de abrir para clientes reais.
9. **Imagens:** substitua as fotos de banco por um ensaio próprio quando disponível, mantendo a diversidade definida na identidade.

## Avisos

- O Mapa da Potência e o questionário são ferramentas educacionais de autopercepção, não diagnósticos.
- O Método POTÊNCIA é uma estrutura educacional autoral, sem alegação de validação científica específica.
- Não armazene dados reais, confidenciais ou de pagamento nesta demonstração.
