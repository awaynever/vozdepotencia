import { daysAgo, daysAgoDateTime } from '@/utils/date'
import type { JournalEntry, Mood } from '@/types'

export const journalCategories = ['Reflexões', 'Conquistas', 'Objetivos', 'Gratidão', 'Decisões', 'Aprendizados', 'Desafios']

export const journalPrompts = [
  'O que fiz hoje que me deixou orgulhosa?',
  'Em qual situação consegui respeitar meus limites?',
  'Qual conversa estou adiando?',
  'O que gostaria de comunicar com mais clareza?',
]

export const moods: { id: Mood; label: string; emoji: string; suggestion: { title: string; text: string; link: string; cta: string } }[] = [
  { id: 'confiante', label: 'Confiante', emoji: '✦', suggestion: { title: 'Aproveite esse impulso', text: 'Que tal enfrentar uma simulação avançada de negociação?', link: '/app/laboratorio/sim-aumento-salarial', cta: 'Abrir simulação' } },
  { id: 'motivada', label: 'Motivada', emoji: '↗', suggestion: { title: 'Avance na jornada', text: 'Hoje é um ótimo dia para concluir a atividade do Dia 8.', link: '/app/jornada/8', cta: 'Continuar jornada' } },
  { id: 'tranquila', label: 'Tranquila', emoji: '◡', suggestion: { title: 'Momento de reflexão', text: 'Escreva no Diário sobre algo que deseja comunicar com mais clareza.', link: '/app/diario', cta: 'Abrir diário' } },
  { id: 'insegura', label: 'Insegura', emoji: '~', suggestion: { title: 'Pequeno passo', text: 'Faça o ritual "Redirecione sua atenção" (4 min) e depois uma missão curta.', link: '/app/rituais/rit-atencao', cta: 'Iniciar ritual' } },
  { id: 'cansada', label: 'Cansada', emoji: '☾', suggestion: { title: 'Descanso também é progresso', text: 'Experimente "Descanse sem culpa", um relaxamento de 7 minutos.', link: '/app/rituais/rit-descanso', cta: 'Iniciar ritual' } },
  { id: 'sobrecarregada', label: 'Sobrecarregada', emoji: '≋', suggestion: { title: 'Organize antes de agir', text: 'O ritual "Organize suas prioridades" ajuda a separar o essencial.', link: '/app/rituais/rit-prioridades', cta: 'Iniciar ritual' } },
]

export const demoJournal: JournalEntry[] = [
  { id: 'j-1', date: daysAgo(1), title: 'Falei primeiro na reunião', mood: 'confiante', categories: ['Conquistas'], favorite: true, createdAt: daysAgoDateTime(1, '20:10:00'), updatedAt: daysAgoDateTime(1, '20:10:00'),
    content: 'Hoje, na reunião com a fornecedora, fui a primeira a apresentar a proposta. Senti o coração acelerado nos primeiros segundos, mas lembrei da respiração 4-6. Usei "Proponho" em vez de "Será que a gente poderia". Ela aceitou o novo prazo.' },
  { id: 'j-2', date: daysAgo(3), title: 'O "não" para o evento de sábado', mood: 'tranquila', categories: ['Decisões', 'Reflexões'], favorite: false, createdAt: daysAgoDateTime(3, '22:00:00'), updatedAt: daysAgoDateTime(3, '22:00:00'),
    content: 'Recusei o convite para organizar o bazar do condomínio. Usei duas frases, como no Dia 6. Senti um pouco de culpa, mas passou rápido. Meu sábado vai ser para descansar e planejar a semana.' },
  { id: 'j-3', date: daysAgo(5), title: 'Medo de reajustar preços', mood: 'insegura', categories: ['Desafios'], favorite: false, createdAt: daysAgoDateTime(5, '21:30:00'), updatedAt: daysAgoDateTime(5, '21:30:00'),
    content: 'Estou adiando o reajuste de preços do ateliê há meses. O pensamento que aparece é "vão me achar cara". Evidências contra: tenho fila de espera e as clientes elogiam o acabamento. Vou preparar o comunicado até sexta.' },
  { id: 'j-4', date: daysAgo(8), title: 'Gratidão pelas mulheres da minha vida', mood: 'motivada', categories: ['Gratidão'], favorite: true, createdAt: daysAgoDateTime(8, '19:00:00'), updatedAt: daysAgoDateTime(8, '19:00:00'),
    content: 'Minha avó costurava para fora e nunca cobrou o que valia. Minha mãe voltou a estudar aos 45. Eu estou aprendendo a negociar. Sinto que carrego as três.' },
  { id: 'j-5', date: daysAgo(12), title: 'Meu compromisso para as próximas semanas', mood: 'motivada', categories: ['Objetivos'], favorite: true, createdAt: daysAgoDateTime(12, '21:00:00'), updatedAt: daysAgoDateTime(12, '21:00:00'),
    content: 'Nas próximas duas semanas vou responder mensagens de clientes apenas das 9h às 18h, porque meu descanso também faz parte do negócio.' },
  { id: 'j-6', date: daysAgo(15), title: 'O que aprendi com o Mapa da Potência', mood: 'tranquila', categories: ['Aprendizados'], favorite: false, createdAt: daysAgoDateTime(15, '18:00:00'), updatedAt: daysAgoDateTime(15, '18:00:00'),
    content: 'Limites pessoais apareceu como a dimensão com menor pontuação na minha autopercepção. Faz sentido: tenho dificuldade de dizer não para clientes. Quero olhar para isso com carinho, e não com cobrança.' },
]
