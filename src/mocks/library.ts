import type { LibraryFormat, LibraryItem } from '@/types'
import { images } from './images'

export const libraryFormats: LibraryFormat[] = ['E-book', 'Artigo', 'Áudio', 'Guia', 'Exercício', 'Planner', 'Checklist']

export const libraryCategories = [
  'Oratória', 'Autoconhecimento', 'Inteligência emocional', 'Liderança', 'Autonomia financeira',
  'Disciplina', 'Relacionamentos', 'Energia pessoal', 'Representatividade', 'Desenvolvimento profissional',
]

export const library: LibraryItem[] = [
  {
    id: 'lib-ebook-principal', title: 'Voz de Potência', format: 'E-book', category: 'Autoconhecimento', minutes: 25, cover: 'rubi', featured: true, published: true, image: images.heroDuo,
    description: 'O e-book principal da plataforma: fundamentos do Método POTÊNCIA e um convite para ocupar seu espaço.',
    sections: [
      { heading: 'Por que a sua voz importa', paragraphs: ['Durante muito tempo, mulheres foram ensinadas a falar baixo, a não interromper, a não incomodar. Essas lições, repetidas em casa, na escola e no trabalho, deixaram marcas na forma como muitas de nós nos expressamos.', 'A Voz de Potência nasce de uma convicção simples: comunicar-se com segurança é uma habilidade que se aprende e se pratica. Não é um dom reservado a poucas pessoas.'] },
      { heading: 'O Método POTÊNCIA', paragraphs: ['O método organiza o desenvolvimento em oito pilares: Presença, Oratória, Transformação, Ênfase no essencial, Novas possibilidades, Coragem, Identidade e Autonomia.', 'Os pilares se conectam. A Identidade sustenta a Coragem; a Presença amplia a Oratória; a Autonomia depende de Limites e de Ênfase no essencial.'], list: ['Presença: estar inteira onde você está.', 'Oratória: dar forma ao que você pensa.', 'Transformação: mudar o que já não serve.', 'Ênfase no essencial: proteger o que importa.', 'Novas possibilidades: enxergar e criar caminhos.', 'Coragem: agir mesmo com a voz tremendo.', 'Identidade: saber quem você é.', 'Autonomia: decidir por si.'] },
      { heading: 'Aprender, praticar, evoluir', paragraphs: ['Conhecimento sem prática se perde. Por isso, cada conteúdo da plataforma vem acompanhado de exercícios, missões e simulações.', 'A evolução não é linear. Haverá dias de avanço e dias de pausa. A plataforma não pune ausências: você retoma de onde parou.'] },
      { heading: 'Um compromisso com você', paragraphs: ['Este é um espaço educacional de autodesenvolvimento. Ele não substitui acompanhamento psicológico, médico ou jurídico quando necessário.', 'Que este material seja um ponto de partida para que mais mulheres falem, decidam e ocupem os espaços que desejam.'] },
    ],
  },
  {
    id: 'lib-assertiva', title: 'Guia da comunicação assertiva', format: 'Guia', category: 'Oratória', minutes: 12, cover: 'champagne', featured: true, published: true,
    description: 'Como expressar necessidades e opiniões com firmeza e respeito.',
    sections: [
      { heading: 'Três estilos de comunicação', paragraphs: ['O estilo passivo prioriza o outro e silencia as próprias necessidades. O reativo defende as próprias necessidades sem considerar o outro. O assertivo busca equilíbrio: respeita a si e ao outro.'] },
      { heading: 'A estrutura assertiva', list: ['Fato: descreva a situação sem julgamento.', 'Impacto: diga como isso afeta você.', 'Pedido: proponha algo concreto.'], paragraphs: ['Exemplo: "Quando a reunião começa 20 minutos atrasada (fato), perco o horário do próximo compromisso (impacto). Podemos começar pontualmente? (pedido)"'] },
      { heading: 'Atenuadores a evitar', list: ['"Desculpa, mas..."', '"Pode ser bobagem..."', '"Só uma ideia..."', '"Acho que talvez..."'] },
      { heading: 'Quando não ser assertiva', paragraphs: ['Em situações de risco à sua segurança física ou emocional, a prioridade é proteger-se. A assertividade é uma ferramenta, não uma obrigação em todos os contextos.'] },
    ],
  },
  {
    id: 'lib-conversas-dificeis', title: 'Manual de conversas difíceis', format: 'Guia', category: 'Relacionamentos', minutes: 15, cover: 'onix', published: true,
    description: 'Preparação, condução e encerramento de conversas que você vem adiando.',
    sections: [
      { heading: 'Antes da conversa', list: ['Defina seu objetivo em uma frase.', 'Separe fatos de interpretações.', 'Escolha um momento e um local adequados.', 'Avalie se há segurança para a conversa.'] },
      { heading: 'Durante a conversa', paragraphs: ['Comece pela intenção: "Quero conversar porque nossa relação é importante para mim." Depois, apresente os fatos, o impacto e o pedido. Escute a resposta com curiosidade.', 'Se a emoção subir, proponha uma pausa. Conversas difíceis não precisam ser resolvidas em uma única vez.'] },
      { heading: 'Depois da conversa', paragraphs: ['Registre o que foi combinado. Se necessário, marque uma data para retomar. Reconheça sua coragem por ter iniciado a conversa, independentemente do resultado.'] },
    ],
  },
  {
    id: 'lib-planner-21', title: 'Planner de 21 dias', format: 'Planner', category: 'Disciplina', minutes: 8, cover: 'bege', published: true,
    description: 'Acompanhe sua jornada com espaços para intenção, missão e reflexão diárias.',
    sections: [
      { heading: 'Como usar', paragraphs: ['Use este planner junto com a jornada "Despertar minha voz". A cada dia, anote sua intenção, a missão escolhida e uma reflexão curta.'] },
      { heading: 'Estrutura diária', list: ['Intenção do dia', 'Missão prática', 'Como me senti ao realizar', 'Uma frase de reflexão'] },
      { heading: 'Revisões semanais', list: ['Dia 7: o que descobri sobre mim?', 'Dia 14: como minha voz mudou?', 'Dia 21: o que levo para os próximos 90 dias?'] },
    ],
  },
  {
    id: 'lib-negociacao', title: 'Guia de negociação feminina', format: 'Guia', category: 'Autonomia financeira', minutes: 18, cover: 'rubi', featured: true, published: true, image: images.blazerRosa,
    description: 'Preparação, abertura e fechamento de negociações de salário, preço e parcerias.',
    sections: [
      { heading: 'Por que negociar é difícil', paragraphs: ['Muitas mulheres aprendem que pedir é egoísmo e que falar de dinheiro é deselegante. Negociar não é tirar algo de alguém; é construir um acordo que funcione para os dois lados.'] },
      { heading: 'Preparação', list: ['Pesquise referências de mercado.', 'Liste suas entregas e resultados.', 'Defina valor ideal, aceitável e limite.', 'Prepare alternativas caso a resposta seja não.'] },
      { heading: 'Na conversa', paragraphs: ['Apresente valor antes de preço. Diga o número com tom neutro e faça silêncio. Se ouvir um "não", pergunte: "O que seria necessário para chegarmos lá?"'] },
      { heading: 'Além do valor', list: ['Prazo de pagamento', 'Escopo', 'Benefícios', 'Data de revisão', 'Modelo de trabalho'] },
    ],
  },
  {
    id: 'lib-apresentar-ideia', title: 'Como apresentar uma ideia', format: 'Artigo', category: 'Oratória', minutes: 7, cover: 'marfim', published: true,
    description: 'Uma estrutura simples para ideias que convencem.',
    sections: [
      { heading: 'Comece pela mensagem central', paragraphs: ['Antes de pensar em slides, defina a frase que você quer que as pessoas lembrem. Tudo o mais deve servir a ela.'] },
      { heading: 'Estrutura em três partes', list: ['Abertura: uma pergunta, um dado ou uma história.', 'Desenvolvimento: até três pontos.', 'Encerramento: um pedido ou próximo passo.'] },
      { heading: 'Ensaie em voz alta', paragraphs: ['Ler mentalmente não é ensaiar. Grave sua apresentação, ouça e ajuste. A segunda versão quase sempre é melhor.'] },
    ],
  },
  {
    id: 'lib-dez-exercicios', title: 'Dez exercícios de oratória', format: 'Exercício', category: 'Oratória', minutes: 20, cover: 'champagne', published: true,
    description: 'Práticas curtas para voz, ritmo, clareza e improvisação.',
    sections: [
      { heading: 'Exercícios', list: ['Respiração 4-6 por cinco ciclos.', 'Vibração de lábios por 30 segundos.', 'Trava-línguas em três velocidades.', 'Leitura com pausas marcadas.', 'Apresente-se em 30 segundos.', 'Explique sua profissão para uma criança.', 'Fale 45 segundos sobre um tema sorteado.', 'Conte uma história em quatro tempos.', 'Defenda um ponto de vista em um minuto.', 'Grave, ouça e regrave com um ajuste.'] },
      { heading: 'Frequência sugerida', paragraphs: ['Escolha dois exercícios por dia, por cinco minutos. A constância importa mais que a duração.'] },
    ],
  },
  {
    id: 'lib-limites', title: 'Construindo limites saudáveis', format: 'E-book', category: 'Relacionamentos', minutes: 22, cover: 'onix', published: true, image: images.cachosEstudio,
    description: 'O que são limites, por que eles importam e como comunicá-los.',
    sections: [
      { heading: 'O que é um limite', paragraphs: ['Um limite é uma informação sobre você: o que você aceita, o que não aceita e o que fará caso ele não seja respeitado.'] },
      { heading: 'Tipos de limites', list: ['Tempo: horários e disponibilidade.', 'Emocional: o que você está disposta a ouvir ou sustentar.', 'Físico: espaço e contato.', 'Financeiro: empréstimos, gastos e contribuições.', 'Digital: mensagens, redes e exposição.'] },
      { heading: 'Comunicando limites', paragraphs: ['Use a fórmula: "Quando ___, eu ___. Preciso que ___." Seja breve e evite justificativas longas.'] },
      { heading: 'Lidando com a reação do outro', paragraphs: ['Algumas pessoas vão estranhar seus novos limites. Isso não significa que você está errada. Mantenha a calma e repita, se necessário.'] },
    ],
  },
  {
    id: 'lib-autoconfianca', title: 'Autoconfiança na prática', format: 'E-book', category: 'Autoconhecimento', minutes: 20, cover: 'champagne', published: true, image: images.sorrisoAberto,
    description: 'Confiança como resultado de ação, e não como pré-requisito.',
    sections: [
      { heading: 'A confiança vem depois', paragraphs: ['Esperamos nos sentir confiantes para agir, mas costuma ser o contrário: agir, mesmo com medo, é o que gera confiança.'] },
      { heading: 'Evidências a seu favor', paragraphs: ['Mantenha um registro de conquistas. Nos dias de dúvida, ele lembra do que você já foi capaz.'] },
      { heading: 'Pequenas exposições', list: ['Faça uma pergunta em público.', 'Dê uma opinião em uma reunião.', 'Aceite um elogio sem diminuí-lo.', 'Peça algo que deseja.'] },
    ],
  },
  {
    id: 'lib-prioridades', title: 'Organização de prioridades', format: 'Guia', category: 'Energia pessoal', minutes: 10, cover: 'bege', published: true,
    description: 'Como decidir o que fazer primeiro, o que delegar e o que deixar de lado.',
    sections: [
      { heading: 'Importante × urgente', paragraphs: ['Urgente é o que pede atenção agora; importante é o que contribui para seus objetivos. O risco é passar a vida apagando incêndios e nunca chegar ao importante.'] },
      { heading: 'Quatro decisões', list: ['Fazer: importante e urgente.', 'Agendar: importante, não urgente.', 'Delegar: urgente, não importante.', 'Descartar: nem urgente, nem importante.'] },
      { heading: 'Energia e agenda', paragraphs: ['Coloque as tarefas mais exigentes nos horários em que você tem mais disposição.'] },
    ],
  },
  {
    id: 'lib-pausas', title: 'A pausa que comunica', format: 'Artigo', category: 'Oratória', minutes: 5, cover: 'marfim', published: true,
    description: 'Por que o silêncio estratégico fortalece sua fala.',
    sections: [
      { heading: 'O silêncio não é vazio', paragraphs: ['Pausas dão tempo para a ideia ser absorvida, para você respirar e para organizar o próximo pensamento.'] },
      { heading: 'Onde pausar', list: ['Antes de uma informação importante.', 'Depois de uma pergunta.', 'Ao mudar de assunto.', 'Quando precisar pensar.'] },
    ],
  },
  {
    id: 'lib-dinheiro', title: 'Primeiros passos para a autonomia financeira', format: 'Guia', category: 'Autonomia financeira', minutes: 14, cover: 'rubi', published: true,
    description: 'Educação financeira básica, sem fórmulas mágicas.',
    sections: [
      { heading: 'Conheça seus números', paragraphs: ['Anote por um mês tudo o que entra e sai. Sem esse retrato, é difícil decidir com segurança.'] },
      { heading: 'Reserva de emergência', paragraphs: ['Uma reserva para imprevistos traz liberdade para recusar situações ruins e tomar decisões com calma.'] },
      { heading: 'Busque orientação', paragraphs: ['Este guia é educacional. Para investimentos, dívidas ou planejamento complexo, procure profissionais habilitados.'] },
    ],
  },
  {
    id: 'lib-checklist-reuniao', title: 'Checklist: antes da reunião importante', format: 'Checklist', category: 'Desenvolvimento profissional', minutes: 4, cover: 'bege', published: true,
    description: 'Itens para revisar antes de uma reunião em que você precisa se posicionar.',
    sections: [
      { heading: 'Checklist', list: ['Sei qual é o meu objetivo na reunião.', 'Tenho minha mensagem central em uma frase.', 'Preparei dados ou exemplos.', 'Antecipei duas objeções.', 'Fiz o ritual "Prepare sua voz".', 'Sei qual pedido farei no final.'] },
    ],
  },
  {
    id: 'lib-energia', title: 'Energia pessoal sem misticismo', format: 'Artigo', category: 'Energia pessoal', minutes: 8, cover: 'champagne', published: true,
    description: 'Disposição, foco e descanso como pilares práticos do bem-estar.',
    sections: [
      { heading: 'O que chamamos de energia', paragraphs: ['Energia pessoal é a combinação de disposição física, foco mental e equilíbrio emocional. Ela é influenciada por sono, alimentação, movimento, pausas e relações.'] },
      { heading: 'Sinais de alerta', list: ['Irritação frequente', 'Dificuldade de concentração', 'Cansaço ao acordar', 'Sensação de estar sempre atrasada'] },
      { heading: 'Pequenas mudanças', paragraphs: ['Pausas curtas ao longo do dia, limites de horário e um ritual noturno podem ter mais impacto que grandes mudanças difíceis de sustentar. Se o cansaço persistir, procure avaliação profissional.'] },
    ],
  },
  {
    id: 'lib-representatividade', title: 'Representatividade e redes de apoio', format: 'Artigo', category: 'Representatividade', minutes: 9, cover: 'onix', published: true, image: images.duasNegrasReuniao,
    description: 'Por que ver mulheres diversas em posições de liderança importa, e como construir redes.',
    sections: [
      { heading: 'Ver para acreditar', paragraphs: ['Quando mulheres pretas, indígenas, periféricas, maduras e com deficiência ocupam espaços de decisão, outras mulheres passam a enxergar esses lugares como possíveis.'] },
      { heading: 'Redes que sustentam', paragraphs: ['Redes de apoio trocam informações, indicações e encorajamento. Elas podem ser formais, como associações, ou informais, como grupos de amigas.'] },
      { heading: 'Como começar', list: ['Identifique mulheres que você admira.', 'Ofereça ajuda antes de pedir.', 'Celebre conquistas de outras mulheres.', 'Indique mulheres para oportunidades.'] },
    ],
  },
  {
    id: 'lib-feedback', title: 'Guia do feedback respeitoso', format: 'Guia', category: 'Liderança', minutes: 10, cover: 'marfim', published: true,
    description: 'Como dar e receber feedback com clareza e cuidado.',
    sections: [
      { heading: 'Dando feedback', list: ['Seja específica sobre o comportamento.', 'Descreva o impacto.', 'Combine um próximo passo.', 'Reconheça em público, ajuste em particular.'] },
      { heading: 'Recebendo feedback', list: ['Escute até o fim.', 'Peça exemplos.', 'Agradeça.', 'Decida o que fazer com ele.'] },
    ],
  },
  {
    id: 'lib-storytelling', title: 'Storytelling em 90 segundos', format: 'Exercício', category: 'Oratória', minutes: 10, cover: 'rubi', published: true,
    description: 'Monte e grave uma história pessoal com estrutura clara.',
    sections: [
      { heading: 'Estrutura', list: ['Contexto: onde e quando?', 'Desafio: o que estava em jogo?', 'Escolha: o que você decidiu?', 'Resultado: o que mudou?'] },
      { heading: 'Prática', paragraphs: ['Escreva cada parte em uma frase. Depois, conte a história em voz alta, sem ler, e grave na Academia da Voz.'] },
    ],
  },
  {
    id: 'lib-entrevista', title: 'Checklist: entrevista de emprego', format: 'Checklist', category: 'Desenvolvimento profissional', minutes: 5, cover: 'bege', published: true,
    description: 'Preparação prática para entrevistas.',
    sections: [
      { heading: 'Checklist', list: ['Pesquisei sobre a empresa.', 'Preparei minha apresentação de 60 segundos.', 'Tenho três conquistas com resultados.', 'Pesquisei a faixa salarial.', 'Preparei duas perguntas para fazer.', 'Sei que posso não responder perguntas pessoais.'] },
    ],
  },
  {
    id: 'lib-audio-coragem', title: 'A coragem de ocupar espaços', format: 'Áudio', category: 'Autoconhecimento', minutes: 7, cover: 'onix', published: true, image: images.palcoMicrofone,
    description: 'Áudio guiado sobre presença e coragem (transcrição disponível).',
    sections: [
      { heading: 'Transcrição', paragraphs: ['Respire. Perceba onde você está agora. Este espaço, por menor que seja, é seu.', 'Pense em um lugar onde você gostaria de falar mais: uma reunião, um almoço de família, uma sala de aula. Imagine-se entrando nesse lugar. Os pés firmes, os ombros soltos.', 'Ocupar espaço não é tirar o lugar de ninguém. É deixar de abrir mão do seu. Você pode falar com a voz tremendo. A coragem fala junto.', 'Antes de terminar, escolha uma pequena ação para esta semana. Uma pergunta, uma opinião, um pedido. Comece por ela.'] },
    ],
  },
  {
    id: 'lib-90-dias', title: 'Planner: Meus próximos 90 dias', format: 'Planner', category: 'Disciplina', minutes: 15, cover: 'champagne', published: true,
    description: 'Planejamento trimestral com prioridades, indicadores e revisões.',
    sections: [
      { heading: 'Três prioridades', list: ['Prioridade 1: resultado esperado e indicador.', 'Prioridade 2: resultado esperado e indicador.', 'Prioridade 3: resultado esperado e indicador.'] },
      { heading: 'Hábitos semanais', paragraphs: ['Para cada prioridade, defina um hábito que caiba na sua semana real.'] },
      { heading: 'Revisões', list: ['Dia 30: o que ajustar?', 'Dia 60: o que acelerar?', 'Dia 90: o que celebrar?'] },
    ],
  },
]
