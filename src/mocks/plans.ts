import type { Plan } from '@/types'

export const plans: Plan[] = [
  {
    id: 'free', name: 'Gratuito', price: 'R$ 0', priceNote: 'para sempre',
    description: 'Comece a conhecer sua potência.',
    features: ['Mapa da Potência simplificado', 'Três missões iniciais', 'Algumas simulações do Laboratório', 'Conteúdos selecionados da Biblioteca'],
  },
  {
    id: 'experience', name: 'Voz de Potência Experience', price: 'R$ 97,00', priceNote: 'pagamento único',
    description: 'A experiência completa de desenvolvimento.', highlight: true,
    features: ['Jornada completa de 21 dias', 'Academia da Voz', 'Laboratório Comportamental completo', 'Baralho de Respostas Poderosas', 'Meu Diário', 'Rituais de Energia', 'Biblioteca completa', 'Painel de evolução', 'Certificado simbólico de conclusão'],
  },
  {
    id: 'club', name: 'Clube Voz de Potência', price: 'R$ 39,90', priceNote: 'por mês',
    description: 'Desenvolvimento contínuo em comunidade.', comingSoon: true,
    features: ['Novas jornadas', 'Conteúdos exclusivos', 'Aurora IA', 'Comunidade', 'Práticas avançadas', 'Desenvolvimento contínuo'],
  },
]

// Recursos liberados no plano gratuito
export const freeAccess = {
  simulationIds: ['sim-interrupcao-reuniao', 'sim-planos-cancelados', 'sim-favor-fim-de-semana', 'sim-fale-sobre-voce', 'sim-objecao-preco'],
  journeyDays: [1, 2, 3],
  libraryIds: ['lib-ebook-principal', 'lib-assertiva', 'lib-pausas', 'lib-checklist-reuniao'],
  ritualIds: ['rit-manha', 'rit-atencao', 'rit-gratidao'],
  cardsLimit: 10,
}

export const faq = [
  { q: 'A Voz de Potência é um curso?', a: 'Não no formato tradicional. É uma experiência interativa de desenvolvimento comportamental em que você aprende, pratica com simulações e exercícios, estabelece objetivos e acompanha sua evolução.' },
  { q: 'Quanto tempo preciso dedicar por dia?', a: 'Você escolhe entre 5 e 20 minutos diários. As atividades foram pensadas para caber em rotinas reais.' },
  { q: 'E se eu ficar alguns dias sem acessar?', a: 'Nada acontece. A plataforma não penaliza ausências nem bloqueia conteúdos. Você retoma de onde parou.' },
  { q: 'O Mapa da Potência é um teste psicológico?', a: 'Não. É uma ferramenta educacional de autopercepção. Os resultados representam como você se percebe, e não um diagnóstico ou medida objetiva de capacidade.' },
  { q: 'A Aurora substitui terapia ou mentoria profissional?', a: 'Não. A Aurora é uma assistente de prática de comunicação. Nesta versão demonstrativa, ela utiliza respostas predefinidas. Para questões de saúde mental, procure profissionais habilitados.' },
  { q: 'Como funciona o pagamento?', a: 'O plano Experience tem pagamento único. Nesta demonstração, nenhum pagamento é processado e nenhum dado bancário é solicitado.' },
  { q: 'Para quem é a plataforma?', a: 'Para mulheres que desejam fortalecer sua confiança, comunicação e autonomia, em qualquer fase da vida e da carreira.' },
]
