import type { Ritual } from '@/types'
import { images } from './images'

export const ritualCategories = [
  'Ritual da manhã',
  'Preparação para falar em público',
  'Organização de prioridades',
  'Relaxamento',
  'Foco',
  'Visualização de objetivos',
  'Reflexão noturna',
  'Preparação para uma conversa difícil',
  'Gratidão',
  'Planejamento semanal',
]

export const rituals: Ritual[] = [
  {
    id: 'rit-manha', title: 'Cinco minutos para começar o dia', category: 'Ritual da manhã', minutes: 5, cover: images.meditacao, coverTone: 'photo', published: true,
    description: 'Um início de dia com respiração, intenção e uma prioridade clara.',
    steps: [
      { title: 'Chegue', text: 'Sente-se confortavelmente. Apoie os pés no chão e solte os ombros. Perceba o peso do seu corpo na cadeira.', seconds: 45 },
      { title: 'Respire', text: 'Inspire pelo nariz contando até quatro. Solte o ar devagar contando até seis. Repita cinco vezes.', seconds: 75 },
      { title: 'Escolha uma intenção', text: 'Pergunte-se: como eu quero me sentir hoje? Escolha uma palavra, como "presente", "calma" ou "firme".', seconds: 60 },
      { title: 'Defina uma prioridade', text: 'Se apenas uma coisa pudesse ser feita hoje, qual seria? Anote-a em um lugar visível.', seconds: 60 },
      { title: 'Comece', text: 'Agradeça por este momento dedicado a você e dê o primeiro passo em direção à sua prioridade.', seconds: 60 },
    ],
  },
  {
    id: 'rit-voz', title: 'Prepare sua voz', category: 'Preparação para falar em público', minutes: 6, cover: images.microfone, coverTone: 'photo', published: true,
    description: 'Aquecimento vocal e corporal antes de reuniões, aulas ou apresentações.',
    steps: [
      { title: 'Postura', text: 'Fique em pé, pés na largura do quadril, joelhos levemente soltos. Alongue o pescoço para os lados.', seconds: 45 },
      { title: 'Respiração abdominal', text: 'Coloque a mão no abdômen. Inspire sentindo-o expandir e solte o ar em "sss" o mais longo possível.', seconds: 75 },
      { title: 'Lábios e língua', text: 'Faça vibrar os lábios como um motor ("brrr") por alguns segundos. Depois, passe a língua pelos dentes em círculos.', seconds: 60 },
      { title: 'Sirene', text: 'Com a boca fechada, faça um "hum" subindo e descendo a altura da voz, como uma sirene suave.', seconds: 60 },
      { title: 'Frase de abertura', text: 'Diga em voz alta a primeira frase da sua apresentação três vezes, com calma e com pausas.', seconds: 60 },
      { title: 'Intenção', text: 'Lembre-se: você foi chamada porque tem algo a contribuir.', seconds: 30 },
    ],
  },
  {
    id: 'rit-atencao', title: 'Redirecione sua atenção', category: 'Foco', minutes: 4, cover: '', coverTone: 'rubi', published: true,
    description: 'Uma pausa para sair do piloto automático e retomar o foco.',
    steps: [
      { title: 'Pare', text: 'Afaste-se da tela por um instante. Feche os olhos ou olhe para um ponto fixo.', seconds: 30 },
      { title: 'Cinco sentidos', text: 'Observe cinco coisas que vê, quatro que ouve, três que toca, duas que cheira e uma que sente.', seconds: 90 },
      { title: 'Nomeie', text: 'Diga mentalmente o que está sentindo: "Estou ansiosa", "Estou cansada". Nomear ajuda a regular.', seconds: 45 },
      { title: 'Retome', text: 'Escolha a próxima ação concreta, pequena e possível. Comece por ela.', seconds: 45 },
    ],
  },
  {
    id: 'rit-prioridades', title: 'Organize suas prioridades', category: 'Organização de prioridades', minutes: 8, cover: images.diario, coverTone: 'photo', published: true,
    description: 'Separe o importante do urgente em poucos minutos.',
    steps: [
      { title: 'Esvazie a mente', text: 'Anote tudo o que está ocupando sua cabeça, sem ordem.', seconds: 120 },
      { title: 'Classifique', text: 'Marque cada item como importante, urgente, ambos ou nenhum.', seconds: 120 },
      { title: 'Escolha três', text: 'Selecione até três itens importantes para hoje ou para a semana.', seconds: 90 },
      { title: 'Solte o resto', text: 'Para os demais itens, decida: delegar, adiar ou descartar.', seconds: 90 },
    ],
  },
  {
    id: 'rit-conquistas', title: 'Reconheça suas conquistas', category: 'Gratidão', minutes: 5, cover: images.comemoracao, coverTone: 'photo', published: true,
    description: 'Um exercício para olhar o caminho percorrido e não apenas o que falta.',
    steps: [
      { title: 'Olhe para trás', text: 'Pense na última semana. O que você fez, mesmo que pequeno, que merece reconhecimento?', seconds: 60 },
      { title: 'Liste três', text: 'Anote três conquistas. Podem ser conversas, decisões, descansos ou entregas.', seconds: 90 },
      { title: 'Habilidade', text: 'Para cada conquista, identifique uma habilidade sua que a tornou possível.', seconds: 90 },
      { title: 'Celebre', text: 'Diga para si mesma: "Eu reconheço o meu esforço." Respire e sorria, se fizer sentido.', seconds: 60 },
    ],
  },
  {
    id: 'rit-descanso', title: 'Descanse sem culpa', category: 'Relaxamento', minutes: 7, cover: images.yogaPraia, coverTone: 'photo', published: true,
    description: 'Um relaxamento progressivo para dar permissão ao corpo de descansar.',
    steps: [
      { title: 'Permissão', text: 'Diga a si mesma: "Este é um tempo de descanso. Nada mais precisa ser feito agora."', seconds: 30 },
      { title: 'Pés e pernas', text: 'Contraia os músculos dos pés e das pernas por cinco segundos e solte. Perceba a diferença.', seconds: 75 },
      { title: 'Abdômen e mãos', text: 'Feche as mãos e contraia o abdômen por cinco segundos. Solte completamente.', seconds: 75 },
      { title: 'Ombros e rosto', text: 'Leve os ombros às orelhas, franza o rosto e solte. Deixe a mandíbula relaxar.', seconds: 75 },
      { title: 'Respiração lenta', text: 'Respire devagar, alongando a expiração. Permaneça assim pelo tempo que precisar.', seconds: 120 },
    ],
  },
  {
    id: 'rit-visualizacao', title: 'Visualização de objetivos', category: 'Visualização de objetivos', minutes: 8, cover: '', coverTone: 'champagne', published: true,
    description: 'Ensaio mental do resultado e do caminho, com obstáculos e respostas.',
    steps: [
      { title: 'Escolha o objetivo', text: 'Pense em um objetivo concreto para os próximos meses.', seconds: 45 },
      { title: 'Imagine o resultado', text: 'Feche os olhos e imagine o momento em que ele se realiza. Onde você está? Quem está com você?', seconds: 120 },
      { title: 'Imagine o caminho', text: 'Agora imagine os passos que levaram até ali. O que você fez na primeira semana?', seconds: 120 },
      { title: 'Antecipe o obstáculo', text: 'Qual dificuldade pode surgir? Imagine-se respondendo a ela com calma.', seconds: 90 },
      { title: 'Primeiro passo', text: 'Abra os olhos e anote o que você fará nas próximas 48 horas.', seconds: 60 },
    ],
  },
  {
    id: 'rit-noite', title: 'Reflexão noturna', category: 'Reflexão noturna', minutes: 6, cover: images.cidadeNoite, coverTone: 'photo', published: true,
    description: 'Feche o dia com consciência e leveza.',
    steps: [
      { title: 'Desacelere', text: 'Diminua as luzes e afaste o celular. Respire fundo três vezes.', seconds: 45 },
      { title: 'O que deu certo?', text: 'Lembre-se de um momento do dia que foi bom, por menor que seja.', seconds: 75 },
      { title: 'O que aprendi?', text: 'Que situação de hoje trouxe um aprendizado?', seconds: 75 },
      { title: 'O que deixo para amanhã?', text: 'Escreva as pendências em um papel e deixe-as ali. Elas podem esperar.', seconds: 60 },
      { title: 'Descanso', text: 'Agradeça ao seu corpo pelo dia e permita-se descansar.', seconds: 60 },
    ],
  },
  {
    id: 'rit-conversa', title: 'Antes da conversa difícil', category: 'Preparação para uma conversa difícil', minutes: 7, cover: '', coverTone: 'onix', published: true,
    description: 'Organize ideias e emoções antes de uma conversa importante.',
    steps: [
      { title: 'Objetivo', text: 'O que você deseja ao final desta conversa? Escreva em uma frase.', seconds: 60 },
      { title: 'Fatos', text: 'Liste os fatos, separando-os das suas interpretações.', seconds: 90 },
      { title: 'Sentimento e pedido', text: 'Complete: "Quando ___, eu me sinto ___. Preciso que ___."', seconds: 90 },
      { title: 'Respire', text: 'Respire em 4 tempos e solte em 6, cinco vezes. Seu corpo também precisa se preparar.', seconds: 60 },
      { title: 'Segurança', text: 'Avalie se o ambiente é seguro. Se não for, adie e busque apoio.', seconds: 45 },
    ],
  },
  {
    id: 'rit-gratidao', title: 'Três agradecimentos', category: 'Gratidão', minutes: 3, cover: images.oleos, coverTone: 'photo', published: true,
    description: 'Um exercício breve para ampliar a percepção do que vai bem.',
    steps: [
      { title: 'Uma pessoa', text: 'Pense em alguém que contribuiu com seu dia. Como?', seconds: 60 },
      { title: 'Um momento', text: 'Lembre-se de um instante agradável, mesmo que pequeno.', seconds: 60 },
      { title: 'Você', text: 'Agradeça algo que você mesma fez hoje.', seconds: 60 },
    ],
  },
  {
    id: 'rit-semana', title: 'Planejamento semanal', category: 'Planejamento semanal', minutes: 12, cover: images.mesaEscritorio, coverTone: 'photo', published: true,
    description: 'Organize a semana com prioridades, compromissos e descanso.',
    steps: [
      { title: 'Revisão', text: 'O que ficou da semana passada? O que funcionou e o que não funcionou?', seconds: 150 },
      { title: 'Três prioridades', text: 'Defina as três prioridades da semana.', seconds: 120 },
      { title: 'Agenda', text: 'Bloqueie na agenda horários para cada prioridade.', seconds: 180 },
      { title: 'Descanso', text: 'Reserve pelo menos um momento de descanso real.', seconds: 90 },
      { title: 'Compromisso', text: 'Escreva uma frase de compromisso para a semana.', seconds: 90 },
    ],
  },
  {
    id: 'rit-foco', title: 'Bloco de foco profundo', category: 'Foco', minutes: 5, cover: '', coverTone: 'bege', published: true,
    description: 'Prepare-se para 25 minutos de concentração em uma única tarefa.',
    steps: [
      { title: 'Uma tarefa', text: 'Escolha uma única tarefa para os próximos 25 minutos.', seconds: 45 },
      { title: 'Ambiente', text: 'Silencie notificações e feche abas que não serão usadas.', seconds: 60 },
      { title: 'Primeiro passo', text: 'Defina o primeiro passo concreto da tarefa.', seconds: 45 },
      { title: 'Respiração', text: 'Três respirações profundas para marcar o início.', seconds: 45 },
      { title: 'Vá', text: 'Inicie seu bloco. Ao terminar, faça uma pausa de cinco minutos.', seconds: 45 },
    ],
  },
]

// Seção educacional sobre física quântica e metáforas motivacionais
export const quantumEducation = {
  title: 'Física quântica: ciência e metáfora',
  intro: 'Expressões como "energia quântica" e "frequência" aparecem com frequência em conteúdos de desenvolvimento pessoal. Esta seção ajuda a diferenciar conceitos científicos de metáforas inspiradoras.',
  sections: [
    { heading: 'O que é a física quântica', text: 'É o ramo da física que estuda o comportamento da matéria e da energia em escalas muito pequenas, como átomos, elétrons e fótons. Nessas escalas, partículas se comportam de maneiras que não observamos no cotidiano: podem ser descritas por probabilidades, exibir comportamento de onda e partícula e apresentar fenômenos como superposição e emaranhamento.' },
    { heading: 'Onde ela está no dia a dia', text: 'Tecnologias como lasers, ressonância magnética, painéis solares, chips de computador e o GPS dependem de conhecimentos da física quântica. São aplicações reais, testadas e medidas.' },
    { heading: 'O que a ciência não afirma', text: 'Não há evidência científica de que pensamentos alterem a matéria, de que "frequências" atraiam dinheiro ou de que vibrações curem doenças. Esses usos tomam emprestados termos da física, mas não seguem seus métodos nem suas conclusões.' },
    { heading: 'Como usamos a palavra "energia"', text: 'Na Voz de Potência, energia pessoal significa disposição, atenção, foco, esforço e descanso. São aspectos que você pode observar e influenciar com sono, alimentação, pausas, limites e organização.' },
    { heading: 'Metáforas têm valor', text: 'Frases como "mude sua frequência" podem funcionar como lembretes para mudar de atitude, e isso é legítimo. O importante é reconhecê-las como metáforas, e não como descrições de fenômenos físicos comprovados.' },
  ],
}
