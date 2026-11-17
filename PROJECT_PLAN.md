# Voz de Potência · Plano do projeto

Protótipo de alta fidelidade (somente frontend, dados mockados) da plataforma **Voz de Potência**, uma experiência de desenvolvimento comportamental feminino.

## 1. Arquitetura

| Camada | Tecnologia | Local |
|---|---|---|
| Build e dev server | Vite 8 + React 19 + TypeScript (strict) | `vite.config.ts`, `tsconfig.app.json` |
| Estilo | Tailwind CSS 4 com tokens da marca (`@theme`) | `src/styles/index.css` |
| Componentes | Primitivos próprios no estilo shadcn/ui + Radix Dialog | `src/components/ui` |
| Ícones | Lucide (lineares) | — |
| Gráficos | Recharts (radar, barras, linhas, rosca) | `src/components/charts` |
| Animações | Framer Motion (respeita `prefers-reduced-motion`) | — |
| Formulários | React Hook Form + Zod (Diário, Checkout, Configurações) | — |
| Estado global | Zustand com `persist` (localStorage) | `src/store` |
| Áudio | MediaRecorder API + IndexedDB | `src/services/audioStore.ts` |
| Rotas | React Router 7 (lazy loading por página) | `src/App.tsx` |

```
src/
  components/   ui/ (primitivos), charts/, feedback/, AudioPlayerDemo, MissionModal
  layouts/      AppLayout (sidebar desktop, barra inferior mobile, menu secundário), navigation
  pages/        Landing, Onboarding, NotFound, app/* (19 telas), admin/* (painel)
  hooks/        useProgress (estatísticas, jornada, controle de acesso por plano)
  services/     storage, progressService, auroraService, audioStore, exportService
  store/        useAppStore (dados da usuária), useContentStore (conteúdo editável), useToastStore
  mocks/        users, assessments, journeys, method, simulations, voiceExercises, rituals,
                responseCards, library, journal, achievements, community, plans, analytics,
                aurora, admin, images
  types/        interfaces de todas as entidades
  utils/        datas pt-BR, cn()
```

### Fluxo de dados
1. **Mocks** (`src/mocks`) definem o estado inicial.
2. **Stores** carregam os mocks, persistem no `localStorage` e expõem ações (`completeJourneyDay`, `completeSimulation`, `saveJournal`…).
3. **Serviços** concentram regras (cálculo de autopercepção, sequência, estatísticas, Aurora, exportações) e são o ponto de troca por APIs reais.
4. **Páginas** só leem stores/hooks; não há dados fixos dentro dos componentes.

## 2. Funcionalidades e critérios de aceitação

| Área | Critério de aceitação | Status |
|---|---|---|
| Landing | Hero, apresentação, Método, problemas, demo do Laboratório interativa, Academia, Jornada, Mapa, Aurora, benefícios, planos, FAQ, rodapé; sem depoimentos/números inventados | ✅ |
| Onboarding | 5 etapas com progresso e transições; até 3 objetivos; 24 perguntas em 8 dimensões; tempo diário; resultado calculado localmente + aviso de não diagnóstico | ✅ |
| Home | Saudação, banner da jornada, check-in com sugestão, missão do dia, player demonstrativo, evolução + gráfico semanal, cards de exploração, reflexão (favoritar/copiar) | ✅ |
| Método POTÊNCIA | 8 pilares interativos com descrição, imagem, conteúdos, exercícios, missões, progresso e habilidades | ✅ |
| Jornada | 21 dias originais em 3 fases; linha do tempo com checkpoints; cada dia com introdução, conteúdo, exemplo, exercício, missão, reflexão, material e “Concluir”; acesso livre a qualquer dia; sem penalidades | ✅ |
| Mapa da Potência | Radar inicial × atual, indicadores, histórico, áreas prioritárias, habilidades mais praticadas, recomendações, refazer avaliação que substitui os valores atuais | ✅ |
| Laboratório | 30 simulações em 10 categorias, filtros (categoria, dificuldade, duração, status, busca), feedback predefinido (consequências, clareza, assertividade, respeito, contexto, sugestões), resposta livre sem “análise por IA”, repetição | ✅ |
| Academia da Voz | 12 módulos, 7 exercícios, gravação real (MediaRecorder) com cronômetro, indicador, iniciar/pausar/finalizar/reproduzir/excluir, IndexedDB, análise de exemplo identificada | ✅ |
| Aurora IA | Orbe animado, sugestões, 10 conversas predefinidas, digitação simulada, 6 personagens de simulação, fallback e aviso de segurança, interface `AuroraProvider` para API real | ✅ |
| Respostas Poderosas | 60 cards, busca, filtros, copiar, favoritar, compartilhar, variações, explicação, simulação relacionada, exportar PNG | ✅ |
| Rituais | 12 experiências com capa, duração, texto guiado, player com etapas, favoritos e histórico; seção educacional sobre física quântica | ✅ |
| Diário | Criar/editar/excluir, data, título, sentimento, categorias, busca, favoritos, exportação (Markdown/JSON), 6 registros iniciais, aviso de armazenamento local | ✅ |
| Biblioteca | 20 conteúdos originais, filtros por formato/categoria, favoritos, leitor interno com progresso e ajuste de fonte | ✅ |
| Evolução | 8 métricas, 6 gráficos, filtros 7/30/todo período, atualização ao concluir atividades, retrospectiva | ✅ |
| Gamificação | 8 medalhas, regras de pontos, sem pontos duplicados, animação de conquista, sem rankings | ✅ |
| Comunidade | 12 perfis e 15 publicações fictícias identificadas, reações, comentários, publicações locais, grupos, desafios, compartilhar conquista | ✅ |
| Planos | 3 planos, Clube como lançamento futuro, checkout simulado sem dados bancários, alternância de estados gratuito/premium | ✅ |
| Admin | Rota `/admin` com dashboard (KPIs fictícios), CRUD local de usuárias, atividades, missões, simulações, cards, biblioteca, rituais, banners, planos, notificações, moderação da comunidade e configurações | ✅ |
| Configurações | Perfil, avatar, objetivos, preferências, jornada, plano, notificações, favoritos, histórico, acessibilidade, privacidade, termos, sair, restaurar demonstração | ✅ |

## 3. Etapas executadas
1. **Fundação visual:** design system, componentes, landing, navegação, serviços e mocks.
2. **Experiência principal:** onboarding, home, Mapa, jornada, Laboratório, Evolução.
3. **Diferenciais:** Academia, Aurora, Baralho, Rituais, Diário, Biblioteca, gamificação.
4. **Demonstração comercial:** comunidade, planos, admin, configurações, responsividade e testes.

## 4. Verificação
- `npm run lint` (oxlint), `npm run typecheck` e `npm run build` sem erros.
- Navegação automatizada (Playwright) em 375 px e 1280 px de todas as rotas: sem rolagem horizontal e sem erros de console.
- Fluxos testados: concluir dia, simulação (desbloqueio de medalha), repetição sem pontos duplicados, diário, missão, troca de plano + bloqueios, checkout, edição no admin refletida na plataforma, Aurora (tema e fallback), restauração da demo e onboarding completo.
