import { daysAgo } from '@/utils/date'
import type { AssessmentQuestion, AssessmentRecord, Dimension, DimensionScores, OnboardingGoal } from '@/types'

export const dimensions: Dimension[] = [
  { id: 'comunicacao', name: 'Comunicação', short: 'Comunicação', icon: 'MessageCircle', description: 'Clareza, objetividade e segurança para expressar ideias, opiniões e necessidades.' },
  { id: 'autoconfianca', name: 'Autoconfiança', short: 'Confiança', icon: 'Sparkles', description: 'Reconhecimento das próprias capacidades e disposição para agir apesar da insegurança.' },
  { id: 'inteligencia-emocional', name: 'Inteligência emocional', short: 'Emoções', icon: 'Heart', description: 'Perceber, nomear e regular emoções, e responder em vez de apenas reagir.' },
  { id: 'autonomia', name: 'Autonomia', short: 'Autonomia', icon: 'Compass', description: 'Tomar decisões próprias, inclusive financeiras, com responsabilidade e independência.' },
  { id: 'disciplina', name: 'Disciplina', short: 'Disciplina', icon: 'CalendarCheck', description: 'Constância para sustentar compromissos consigo mesma, mesmo sem motivação.' },
  { id: 'lideranca', name: 'Liderança', short: 'Liderança', icon: 'Crown', description: 'Influenciar, orientar e mobilizar pessoas em direção a objetivos compartilhados.' },
  { id: 'limites', name: 'Limites pessoais', short: 'Limites', icon: 'Shield', description: 'Reconhecer e comunicar o que é aceitável para você, sem culpa excessiva.' },
  { id: 'energia', name: 'Energia e bem-estar', short: 'Energia', icon: 'Sun', description: 'Gestão de disposição, foco, descanso e prioridades no dia a dia.' },
]

export const dimensionIds = dimensions.map((d) => d.id)

export const scaleLabels = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Quase sempre']

// 24 perguntas de autopercepção — 3 por dimensão. "reverse" inverte a pontuação.
export const assessmentQuestions: AssessmentQuestion[] = [
  { id: 'q1', dimension: 'comunicacao', text: 'Consigo expressar minha opinião quando outras pessoas discordam.' },
  { id: 'q2', dimension: 'comunicacao', text: 'Sinto segurança ao apresentar minhas ideias.' },
  { id: 'q3', dimension: 'comunicacao', text: 'Consigo explicar o que preciso de forma clara e objetiva.' },
  { id: 'q4', dimension: 'autoconfianca', text: 'Reconheço o valor do meu trabalho.' },
  { id: 'q5', dimension: 'autoconfianca', text: 'Consigo realizar atividades importantes mesmo quando sinto insegurança.' },
  { id: 'q6', dimension: 'autoconfianca', text: 'Aceito elogios sem diminuir minhas conquistas.' },
  { id: 'q7', dimension: 'inteligencia-emocional', text: 'Consigo nomear o que estou sentindo em situações de tensão.' },
  { id: 'q8', dimension: 'inteligencia-emocional', text: 'Faço uma pausa antes de responder quando estou irritada.' },
  { id: 'q9', dimension: 'inteligencia-emocional', text: 'Consigo considerar o ponto de vista do outro sem abandonar o meu.' },
  { id: 'q10', dimension: 'autonomia', text: 'Tomo decisões importantes sem precisar da aprovação de outras pessoas.' },
  { id: 'q11', dimension: 'autonomia', text: 'Acompanho e organizo minha vida financeira com regularidade.' },
  { id: 'q12', dimension: 'autonomia', text: 'Busco por conta própria os recursos de que preciso para avançar.' },
  { id: 'q13', dimension: 'disciplina', text: 'Cumpro os compromissos que assumo comigo mesma.' },
  { id: 'q14', dimension: 'disciplina', text: 'Retomo meus hábitos com facilidade depois de uma interrupção.' },
  { id: 'q15', dimension: 'disciplina', text: 'Consigo priorizar o importante antes do urgente.' },
  { id: 'q16', dimension: 'lideranca', text: 'Assumo a condução de situações quando percebo que é necessário.' },
  { id: 'q17', dimension: 'lideranca', text: 'Consigo dar feedbacks difíceis de forma respeitosa.' },
  { id: 'q18', dimension: 'lideranca', text: 'Pessoas costumam me procurar para pedir orientação.' },
  { id: 'q19', dimension: 'limites', text: 'Consigo estabelecer limites sem me justificar excessivamente.' },
  { id: 'q20', dimension: 'limites', text: 'Digo não a pedidos que não posso ou não quero atender.' },
  { id: 'q21', dimension: 'limites', text: 'Aceito compromissos apenas para evitar desagradar alguém.', reverse: true },
  { id: 'q22', dimension: 'energia', text: 'Termino o dia com energia para o que é importante para mim.' },
  { id: 'q23', dimension: 'energia', text: 'Reservo momentos de descanso sem sentir culpa.' },
  { id: 'q24', dimension: 'energia', text: 'Percebo os sinais de cansaço antes de chegar ao limite.' },
]

export const onboardingGoals: OnboardingGoal[] = [
  { id: 'falar-seguranca', label: 'Falar com mais segurança', dimensions: ['comunicacao', 'autoconfianca'] },
  { id: 'autoestima', label: 'Desenvolver autoestima', dimensions: ['autoconfianca', 'inteligencia-emocional'] },
  { id: 'dizer-nao', label: 'Aprender a dizer não', dimensions: ['limites', 'comunicacao'] },
  { id: 'vida-profissional', label: 'Melhorar minha vida profissional', dimensions: ['lideranca', 'comunicacao'] },
  { id: 'inteligencia-emocional', label: 'Desenvolver inteligência emocional', dimensions: ['inteligencia-emocional'] },
  { id: 'autonomia-financeira', label: 'Conquistar autonomia financeira', dimensions: ['autonomia', 'disciplina'] },
  { id: 'liderar', label: 'Aprender a liderar', dimensions: ['lideranca', 'comunicacao'] },
  { id: 'relacionamentos', label: 'Melhorar meus relacionamentos', dimensions: ['limites', 'inteligencia-emocional'] },
  { id: 'disciplina', label: 'Desenvolver disciplina', dimensions: ['disciplina'] },
  { id: 'energia', label: 'Organizar minha energia e minhas prioridades', dimensions: ['energia', 'disciplina'] },
]

// Rótulos dos objetivos da usuária demo (Configurações)
export const extraGoals = [
  { id: 'comunicacao-assertiva', label: 'Desenvolver comunicação assertiva' },
  { id: 'autoconfianca', label: 'Fortalecer a autoconfiança' },
  { id: 'negociar-valor', label: 'Aprender a negociar meu valor' },
]

export const initialAssessmentScores: DimensionScores = {
  comunicacao: 42,
  autoconfianca: 48,
  'inteligencia-emocional': 55,
  autonomia: 45,
  disciplina: 60,
  lideranca: 38,
  limites: 35,
  energia: 50,
}

export const currentAssessmentScores: DimensionScores = {
  comunicacao: 64,
  autoconfianca: 67,
  'inteligencia-emocional': 72,
  autonomia: 58,
  disciplina: 70,
  lideranca: 52,
  limites: 57,
  energia: 66,
}

export const assessmentHistory: AssessmentRecord[] = [
  { id: 'a-1', date: daysAgo(21), label: 'Avaliação inicial', scores: initialAssessmentScores },
  {
    id: 'a-2',
    date: daysAgo(11),
    label: 'Reavaliação · semana 1',
    scores: { comunicacao: 55, autoconfianca: 58, 'inteligencia-emocional': 64, autonomia: 51, disciplina: 66, lideranca: 45, limites: 47, energia: 58 },
  },
  { id: 'a-3', date: daysAgo(3), label: 'Reavaliação · semana 2', scores: currentAssessmentScores },
]

export const dimensionInsights: Record<string, { strong: string; growth: string; next: string }> = {
  comunicacao: {
    strong: 'Você já consegue organizar ideias e se fazer entender na maior parte das situações.',
    growth: 'Expressar opiniões em momentos de discordância ainda pode exigir mais energia.',
    next: 'Pratique o Laboratório Comportamental na categoria Trabalho e a Academia da Voz.',
  },
  autoconfianca: {
    strong: 'Há um reconhecimento crescente das suas capacidades.',
    growth: 'A insegurança pode estar adiando decisões ou exposições importantes.',
    next: 'Registre conquistas no Diário e faça as missões de coragem.',
  },
  'inteligencia-emocional': {
    strong: 'Você percebe bem suas emoções e as do entorno.',
    growth: 'Nomear a emoção antes de responder pode ampliar suas escolhas.',
    next: 'Experimente o ritual "Redirecione sua atenção" antes de conversas difíceis.',
  },
  autonomia: {
    strong: 'Você toma iniciativa para buscar o que precisa.',
    growth: 'Decisões financeiras e profissionais podem ganhar mais estrutura.',
    next: 'Explore a Fase 3 da jornada e o Guia de negociação feminina.',
  },
  disciplina: {
    strong: 'Você sustenta compromissos com consistência.',
    growth: 'Retomar hábitos após interrupções pode ficar mais leve.',
    next: 'Use o ritual "Planejamento semanal" e mantenha missões curtas.',
  },
  lideranca: {
    strong: 'Você já é referência para algumas pessoas ao seu redor.',
    growth: 'Conduzir conversas e dar feedbacks difíceis pode ganhar mais segurança.',
    next: 'Faça as simulações da categoria Liderança.',
  },
  limites: {
    strong: 'Você começou a identificar o que consome sua energia.',
    growth: 'Dizer não sem justificar excessivamente ainda é um desafio.',
    next: 'Use o Baralho "Como dizer não" e o Dia 6 da jornada.',
  },
  energia: {
    strong: 'Você reconhece a importância do descanso.',
    growth: 'Perceber sinais de cansaço mais cedo pode proteger seu foco.',
    next: 'Inclua o ritual "Descanse sem culpa" na sua semana.',
  },
}
