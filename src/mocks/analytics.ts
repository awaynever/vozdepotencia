import type { ActivityLogEntry, CheckIn, DimensionId } from '@/types'
import { daysAgo } from '@/utils/date'

// Histórico demonstrativo de atividades da usuária Marina.
// Os totais derivados deste log reproduzem os números da especificação:
// 19 atividades (7 dias + 6 rituais + 6 leituras), 7 missões, 5 oratória,
// 8 simulações, 155 minutos e 780 pontos de evolução. Sequência atual: 5 dias.

type Seed = [number, ActivityLogEntry['type'], string, number, number, DimensionId?]

const seeds: Seed[] = [
  // [diasAtrás, tipo, rótulo, minutos, pontos, habilidade]
  [20, 'atividade', 'Dia 1 · Quem sou eu além das expectativas?', 8, 20, 'autoconfianca'],
  [20, 'missao', 'Missão: Uma escolha consciente', 3, 30, 'autonomia'],
  [20, 'checkin', 'Check-in diário', 0, 3],
  [19, 'leitura', 'Leitura: Voz de Potência (e-book)', 3, 5, 'autoconfianca'],
  [18, 'atividade', 'Dia 2 · Reconhecendo minhas habilidades', 8, 20, 'autoconfianca'],
  [18, 'missao', 'Missão: Aceite um elogio', 3, 30, 'autoconfianca'],
  [17, 'oratoria', 'Academia: Apresente-se em 30 segundos', 3, 25, 'comunicacao'],
  [16, 'simulacao', 'Simulação: Interromperam sua fala', 3, 25, 'comunicacao'],
  [15, 'atividade', 'Dia 3 · Compreendendo minhas inseguranças', 8, 20, 'inteligencia-emocional'],
  [15, 'ritual', 'Ritual: Redirecione sua atenção', 4, 10, 'energia'],
  [15, 'simulacao', 'Simulação: Sua amiga desmarca sempre', 3, 25, 'limites'],
  [14, 'missao', 'Missão: Ação apesar do desconforto', 3, 30, 'autoconfianca'],
  [13, 'leitura', 'Leitura: Guia da comunicação assertiva', 2, 5, 'comunicacao'],
  [13, 'simulacao', 'Simulação: Pedido de favor no fim de semana', 3, 25, 'limites'],
  [12, 'atividade', 'Dia 4 · O que consome minha energia', 8, 20, 'energia'],
  [12, 'oratoria', 'Academia: Explique uma ideia em 60 segundos', 3, 25, 'comunicacao'],
  [11, 'ritual', 'Ritual: Cinco minutos para começar o dia', 4, 10, 'energia'],
  [11, 'simulacao', '"Fale um pouco sobre você"', 3, 25, 'comunicacao'],
  [10, 'atividade', 'Dia 5 · Aprendendo a estabelecer limites', 8, 20, 'limites'],
  [10, 'missao', 'Missão: Um limite pequeno', 3, 30, 'limites'],
  [9, 'leitura', 'Leitura: Construindo limites saudáveis', 3, 5, 'limites'],
  [9, 'simulacao', 'Simulação: Abordar um cliente', 3, 25, 'lideranca'],
  [8, 'oratoria', 'Academia: Conte uma história', 3, 25, 'comunicacao'],
  [7, 'ritual', 'Ritual: Organize suas prioridades', 4, 10, 'disciplina'],
  [7, 'simulacao', 'Simulação: Delegar uma tarefa', 3, 25, 'lideranca'],
  [6, 'leitura', 'Leitura: A pausa que comunica', 2, 5, 'comunicacao'],
  [6, 'atividade', 'Dia 6 · O poder de dizer não', 8, 20, 'limites'],
  [6, 'missao', 'Missão: Um não sem justificativa longa', 3, 30, 'limites'],
  [4, 'ritual', 'Ritual: Descanse sem culpa', 4, 10, 'energia'],
  [4, 'oratoria', 'Academia: Simule uma entrevista', 3, 25, 'comunicacao'],
  [4, 'checkin', 'Check-in diário', 0, 3],
  [3, 'simulacao', 'Simulação: Comentário sobre aparência', 3, 25, 'limites'],
  [3, 'leitura', 'Leitura: Autoconfiança na prática', 3, 5, 'autoconfianca'],
  [3, 'checkin', 'Check-in diário', 0, 3],
  [2, 'atividade', 'Dia 7 · Meu compromisso comigo mesma', 8, 20, 'autoconfianca'],
  [2, 'missao', 'Missão: Compartilhe seu compromisso', 3, 30, 'autonomia'],
  [2, 'ritual', 'Ritual: Reconheça suas conquistas', 4, 10, 'autoconfianca'],
  [2, 'checkin', 'Check-in diário', 0, 3],
  [1, 'oratoria', 'Academia: Defenda um ponto de vista', 3, 25, 'comunicacao'],
  [1, 'simulacao', 'Simulação: Pressão para gastar a reserva', 3, 25, 'autonomia'],
  [1, 'missao', 'Missão: Sua opinião merece espaço (prática)', 3, 30, 'comunicacao'],
  [1, 'ritual', 'Ritual: Reflexão noturna', 4, 10, 'energia'],
  [1, 'leitura', 'Leitura: Organização de prioridades', 2, 5, 'disciplina'],
  [0, 'checkin', 'Check-in diário', 0, 3],
]

export const buildDemoActivityLog = (): ActivityLogEntry[] =>
  seeds.map(([ago, type, label, minutes, points, skill], i) => ({
    id: `log-seed-${i}`,
    date: daysAgo(ago),
    type,
    label,
    minutes,
    points,
    skill,
  }))

export const buildDemoCheckins = (): CheckIn[] => [
  { date: daysAgo(20), mood: 'motivada' },
  { date: daysAgo(4), mood: 'cansada' },
  { date: daysAgo(3), mood: 'insegura' },
  { date: daysAgo(2), mood: 'tranquila' },
  { date: daysAgo(0), mood: 'motivada' },
]

export const weeklyRetrospective = {
  title: 'Sua retrospectiva da semana',
  highlights: [
    'Você concluiu a fase Despertar e assumiu um compromisso consigo mesma.',
    'Limites pessoais foi a habilidade mais praticada nos últimos 7 dias.',
    'Você realizou rituais de energia em 3 dias diferentes.',
  ],
  focus: 'Na próxima semana, a fase Expressar vai trabalhar voz, pausas e segurança. Reserve 10 minutos por dia.',
}

// Indicadores comerciais — DADOS FICTÍCIOS de demonstração (painel administrativo)
export const adminKpis = [
  { label: 'Cadastros', value: '1.248' },
  { label: 'Clientes premium', value: '326' },
  { label: 'Usuárias ativas na semana', value: '184' },
  { label: 'Conversão simulada', value: '26,1%' },
  { label: 'Conclusão do onboarding', value: '68%' },
]

export const adminSignupsSeries = [
  { mes: 'jun', cadastros: 62, premium: 14 },
  { mes: 'jul', cadastros: 118, premium: 29 },
  { mes: 'ago', cadastros: 176, premium: 44 },
  { mes: 'set', cadastros: 241, premium: 63 },
  { mes: 'out', cadastros: 305, premium: 81 },
  { mes: 'nov', cadastros: 346, premium: 95 },
]
