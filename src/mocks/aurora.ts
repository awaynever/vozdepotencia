import type { AuroraPersona, AuroraTopic } from '@/types'

// Conversas demonstrativas da Aurora — respostas PREDEFINIDAS (sem IA real nesta versão).

export const auroraSuggestions = [
  'Como pedir um aumento salarial?',
  'Como melhorar minha apresentação?',
  'Como dizer não sem culpa?',
  'Como responder quando alguém me interrompe?',
  'Como negociar meu trabalho?',
  'Como me preparar para uma entrevista?',
]

export const auroraTopics: AuroraTopic[] = [
  {
    id: 'aumento', title: 'Como pedir um aumento salarial?', keywords: ['aumento', 'salário', 'salario', 'reajuste', 'promoção', 'promocao'],
    turns: [
      { aurora: 'Ótima pergunta, Marina. Pedir um aumento é uma conversa de negócios: você apresenta o valor que entrega e propõe um ajuste. Vamos por partes. Você já reuniu suas principais entregas dos últimos meses?', followUps: [{ label: 'Ainda não, por onde começo?', next: 1 }, { label: 'Já tenho, e agora?', next: 2 }] },
      { aurora: 'Comece listando de três a cinco resultados concretos: projetos concluídos, problemas resolvidos, responsabilidades novas, números que melhoraram. Use verbos de ação: "reduzi", "implantei", "liderei". Depois, pesquise faixas salariais da sua função e região.', followUps: [{ label: 'E como abro a conversa?', next: 2 }] },
      { aurora: 'Peça um horário específico para a conversa, em vez de tratar o tema de passagem. Uma abertura possível: "Quero conversar sobre minha remuneração. Preparei um resumo das minhas entregas e das referências de mercado." Depois, diga o número e faça silêncio.', followUps: [{ label: 'E se a resposta for não?', next: 3 }, { label: 'Quero praticar no Laboratório', next: 4 }] },
      { aurora: 'Um "não" agora não precisa ser o fim. Pergunte: "O que seria necessário para chegarmos a esse valor?" e "Podemos retomar essa conversa em uma data definida?". Peça critérios claros e registre por e-mail o que foi combinado.', followUps: [{ label: 'Quero praticar no Laboratório', next: 4 }] },
      { aurora: 'Perfeito. A simulação "Pedir um aumento salarial" está no Laboratório Comportamental. Você também pode gravar sua frase de abertura na Academia da Voz. Quer explorar outro tema?', followUps: [] },
    ],
  },
  {
    id: 'apresentacao', title: 'Como melhorar minha apresentação?', keywords: ['apresentação', 'apresentacao', 'apresentar', 'palestra', 'falar em público', 'publico', 'pitch'],
    turns: [
      { aurora: 'Vamos lá! Uma boa apresentação começa com uma pergunta: se o público lembrar de apenas uma frase, qual deve ser? Você já tem essa mensagem central?', followUps: [{ label: 'Tenho, mas fico nervosa', next: 1 }, { label: 'Não sei como estruturar', next: 2 }] },
      { aurora: 'O nervosismo é comum, até em quem apresenta há anos. Experimente o ritual "Prepare sua voz" antes de começar: respiração abdominal, aquecimento e a primeira frase dita três vezes em voz alta. Ter a abertura memorizada reduz muito a ansiedade inicial.', followUps: [{ label: 'E a estrutura?', next: 2 }] },
      { aurora: 'Use três partes: abertura que conecta (pergunta, dado ou história), desenvolvimento com até três pontos e encerramento com um pedido ou próximo passo. Antes de criar slides, escreva essas partes em tópicos.', followUps: [{ label: 'Como ensaiar?', next: 3 }] },
      { aurora: 'Ensaie em voz alta e grave. Na Academia da Voz, o exercício "Apresente seu negócio" tem dois minutos. Ouça a gravação procurando apenas uma coisa para melhorar por vez: ritmo, pausas ou encerramento.', followUps: [] },
    ],
  },
  {
    id: 'dizer-nao', title: 'Como dizer não sem culpa?', keywords: ['não', 'nao', 'recusar', 'culpa', 'negar', 'dizer não'],
    turns: [
      { aurora: 'A culpa costuma aparecer quando aprendemos que recusar é falta de gentileza. Mas cada "sim" contra a sua vontade é um "não" para algo importante para você. Para quem você tem mais dificuldade de dizer não?', followUps: [{ label: 'Para minha família', next: 1 }, { label: 'No trabalho', next: 2 }, { label: 'Para clientes', next: 3 }] },
      { aurora: 'Com a família, a relação importa tanto quanto o limite. Você pode reconhecer o afeto e manter a recusa: "Eu te amo e, por isso, prefiro ser sincera: desta vez não vou conseguir." Explicar brevemente é opcional, não obrigação.', followUps: [{ label: 'Ver respostas prontas', next: 4 }] },
      { aurora: 'No trabalho, mostrar a sua carga atual ajuda: "Hoje já tenho estas entregas. Para assumir isso, preciso deixar outra. Qual é a prioridade?" Assim, a decisão fica compartilhada e o seu limite, visível.', followUps: [{ label: 'Ver respostas prontas', next: 4 }] },
      { aurora: 'Com clientes, delimitar o escopo protege a qualidade do seu trabalho: "Esse serviço não faz parte do que ofereço, mas posso indicar uma profissional." Ou, para extras: "Posso fazer por R$ X, com entrega em dois dias."', followUps: [{ label: 'Ver respostas prontas', next: 4 }] },
      { aurora: 'No Baralho de Respostas Poderosas, a categoria "Como dizer não" tem cards prontos para copiar, adaptar e favoritar. Lembre-se: um "não" curto é completo.', followUps: [] },
    ],
  },
  {
    id: 'interrupcao', title: 'Como responder quando alguém me interrompe?', keywords: ['interromp', 'interrupção', 'interrupcao', 'cortou', 'fala'],
    turns: [
      { aurora: 'Ser interrompida com frequência desgasta e silencia. A boa notícia: existem frases simples e firmes para retomar a palavra. Isso acontece mais em reuniões presenciais ou on-line?', followUps: [{ label: 'Presenciais', next: 1 }, { label: 'On-line', next: 2 }] },
      { aurora: 'Presencialmente, combine voz e corpo: levante levemente a mão, mantenha o olhar e diga com calma: "Só um momento, vou concluir meu raciocínio." O volume deve ser estável, não mais alto.', followUps: [{ label: 'E se for sempre a mesma pessoa?', next: 3 }] },
      { aurora: 'On-line, nomear a sobreposição tira o peso: "Acho que nos sobrepusemos. Vou concluir em um minuto e passo a palavra." Se a plataforma permitir, use o recurso de levantar a mão antes de falar.', followUps: [{ label: 'E se for sempre a mesma pessoa?', next: 3 }] },
      { aurora: 'Quando o padrão se repete, uma conversa individual costuma resolver melhor que o confronto público: "Percebi que nas reuniões nem sempre consigo terminar minhas falas. Podemos combinar de esperar o fim de cada ponto?" Pratique na simulação "Interromperam sua fala em uma reunião".', followUps: [] },
    ],
  },
  {
    id: 'negociar-trabalho', title: 'Como negociar meu trabalho?', keywords: ['negociar', 'preço', 'preco', 'cobrar', 'desconto', 'orçamento', 'orcamento', 'cliente'],
    turns: [
      { aurora: 'Negociar o valor do seu trabalho começa antes da conversa: com três números definidos. Você sabe qual é o seu valor ideal, o aceitável e o limite abaixo do qual não fecha?', followUps: [{ label: 'Não tenho esses números', next: 1 }, { label: 'Tenho, mas o cliente pede desconto', next: 2 }] },
      { aurora: 'Calcule seus custos (tempo, materiais, impostos, deslocamentos), some a margem que deseja e compare com o mercado. O limite é o valor abaixo do qual o trabalho deixa de valer a pena. Anote os três números antes de qualquer proposta.', followUps: [{ label: 'E quando pedem desconto?', next: 2 }] },
      { aurora: 'Em vez de reduzir o preço, ajuste o escopo, o prazo ou a forma de pagamento: "Esse valor não é possível com o escopo atual. Posso adaptar o escopo para caber no seu orçamento. O que é prioridade para você?"', followUps: [{ label: 'Como apresento o preço?', next: 3 }] },
      { aurora: 'Apresente valor antes de preço: o resultado que o cliente terá, depois o investimento. Diga o número com tom neutro e faça silêncio. A simulação "Cliente pede desconto agressivo" é um bom treino.', followUps: [] },
    ],
  },
  {
    id: 'entrevista', title: 'Como me preparar para uma entrevista?', keywords: ['entrevista', 'emprego', 'vaga', 'seleção', 'selecao', 'recrutador'],
    turns: [
      { aurora: 'Entrevistas ficam mais leves com preparação. Vamos começar pela pergunta mais comum: "fale um pouco sobre você". Você já tem uma resposta de até 60 segundos?', followUps: [{ label: 'Não, como estruturo?', next: 1 }, { label: 'Sim, e as outras perguntas?', next: 2 }] },
      { aurora: 'Use presente, passado relevante e futuro: o que você faz hoje, uma experiência ou conquista que conecte com a vaga e o que você busca agora. Grave no exercício "Simule uma entrevista" da Academia da Voz.', followUps: [{ label: 'E as outras perguntas?', next: 2 }] },
      { aurora: 'Prepare três histórias de conquistas com contexto, desafio, ação e resultado. Elas respondem a muitas perguntas diferentes. Pesquise a faixa salarial e prepare duas perguntas para fazer ao final.', followUps: [{ label: 'E perguntas inadequadas?', next: 3 }] },
      { aurora: 'Você não é obrigada a responder perguntas sobre estado civil, filhos ou planos de gravidez. Pode redirecionar: "Prefiro manter assuntos pessoais fora da entrevista. Posso falar sobre como organizo minhas entregas." Há uma simulação sobre isso no Laboratório.', followUps: [] },
    ],
  },
  {
    id: 'feedback', title: 'Como dar um feedback difícil?', keywords: ['feedback', 'equipe', 'liderar', 'liderança', 'lideranca', 'colaborador'],
    turns: [
      { aurora: 'Feedback é uma forma de cuidado: permite que a pessoa ajuste o rumo. O primeiro passo é ser específica sobre o comportamento. O que você precisa comunicar?', followUps: [{ label: 'Atrasos em entregas', next: 1 }, { label: 'Comportamento em reuniões', next: 2 }] },
      { aurora: 'Traga fatos e abra espaço para escuta: "Percebi que as três últimas entregas atrasaram. Quero entender o que está acontecendo e como posso ajudar a cumprir o próximo prazo." Termine combinando um próximo passo e uma data.', followUps: [{ label: 'Onde fazer essa conversa?', next: 3 }] },
      { aurora: 'Descreva o comportamento e o impacto, sem rótulos: em vez de "você é desrespeitoso", diga "na reunião de ontem, você interrompeu a Ana três vezes, e ela não conseguiu concluir a apresentação".', followUps: [{ label: 'Onde fazer essa conversa?', next: 3 }] },
      { aurora: 'Ajustes em particular, reconhecimentos em público. Escolha um momento sem pressa e um lugar reservado. O Guia do feedback respeitoso, na Biblioteca, traz um roteiro completo.', followUps: [] },
    ],
  },
  {
    id: 'inseguranca', title: 'Como lidar com a insegurança antes de falar?', keywords: ['insegur', 'medo', 'nervos', 'ansiedade', 'ansiosa', 'vergonha', 'timidez', 'tímida'],
    turns: [
      { aurora: 'A insegurança é um sinal de que algo importa para você. O objetivo não é eliminá-la, e sim não deixar que ela tome todas as decisões. Ela aparece mais antes ou durante a fala?', followUps: [{ label: 'Antes', next: 1 }, { label: 'Durante', next: 2 }] },
      { aurora: 'Antes de falar, experimente a respiração 4-6: inspire contando até quatro e solte o ar contando até seis, cinco vezes. Depois, diga a primeira frase em voz baixa para si mesma. Começar bem reduz a ansiedade do restante.', followUps: [{ label: 'E durante?', next: 2 }] },
      { aurora: 'Durante a fala, uma pausa pode ser sua aliada: se perder o fio, respire, olhe para suas anotações e retome. Para quem ouve, uma pausa de dois segundos parece natural.', followUps: [{ label: 'Algo mais?', next: 3 }] },
      { aurora: 'Registre no Diário cada vez que você falar apesar da insegurança. Com o tempo, você terá evidências do que já foi capaz. Se a ansiedade for intensa e frequente, buscar apoio de uma profissional de saúde mental pode ajudar muito.', followUps: [] },
    ],
  },
  {
    id: 'discordar', title: 'Como discordar sem parecer agressiva?', keywords: ['discordar', 'discordância', 'discordancia', 'opinião', 'opiniao', 'agressiva', 'conflito'],
    turns: [
      { aurora: 'Discordar é contribuir. Uma estrutura que ajuda: reconheça o que faz sentido, apresente seu ponto e proponha um caminho. Quer um exemplo?', followUps: [{ label: 'Sim, por favor', next: 1 }] },
      { aurora: '"Entendo a preocupação com o prazo. Vejo um risco na qualidade se cortarmos a revisão. Podemos manter a revisão e reduzir o escopo?" Perceba que você discorda de uma ideia, não da pessoa.', followUps: [{ label: 'E se for com minha liderança?', next: 2 }] },
      { aurora: 'Com quem tem mais poder, mostre intenção de colaborar e avalie o contexto. Às vezes, uma conversa individual depois da reunião é mais segura e eficaz: "Quero contribuir para que isso funcione. Posso compartilhar um ponto de atenção?"', followUps: [] },
    ],
  },
  {
    id: 'cobrar', title: 'Como cobrar um cliente atrasado?', keywords: ['atrasado', 'pagamento', 'fatura', 'devendo', 'inadimpl'],
    turns: [
      { aurora: 'Cobrar é parte do serviço que você prestou. Mensagens claras, com valor, data e um pedido específico, costumam ter mais retorno. É o primeiro lembrete?', followUps: [{ label: 'Sim, o primeiro', next: 1 }, { label: 'Já cobrei e não responderam', next: 2 }] },
      { aurora: 'Exemplo: "Olá, João. A fatura de R$ 2.400, vencida em 28/10, segue em aberto. Consegue me confirmar a data de pagamento?" Inclua o link ou os dados de pagamento na mesma mensagem.', followUps: [{ label: 'E se não responder?', next: 2 }] },
      { aurora: 'No segundo contato, inclua um prazo: "Preciso de um retorno até amanhã para organizar meu fluxo." Mantenha a cobrança em canais privados. Para casos persistentes, considere orientação jurídica. Para os próximos projetos, inclua no contrato regras de multa e juros.', followUps: [] },
    ],
  },
]

export const auroraPersonas: AuroraPersona[] = [
  {
    id: 'gestor', name: 'Ricardo', role: 'Gestor', description: 'Pratique pedir um aumento ou negociar prazos.',
    scenario: 'Você pediu uma reunião com seu gestor para conversar sobre reajuste salarial.',
    opening: 'Oi, Marina. Você pediu essa conversa. Sobre o que gostaria de falar?',
    replies: [
      { aurora: 'Oi, Marina. Você pediu essa conversa. Sobre o que gostaria de falar?', options: [
        { label: 'Quero conversar sobre minha remuneração. Preparei um resumo das minhas entregas.', next: 1, tip: 'Ótima abertura: direta e com preparo.' },
        { label: 'Desculpa tomar seu tempo, é só uma coisinha sobre salário...', next: 2, tip: 'Retire o pedido de desculpas e o diminutivo.' },
      ] },
      { aurora: 'Entendo. Pode me mostrar o que você preparou? O orçamento deste ano está apertado.', options: [
        { label: 'Nos últimos 12 meses, assumi a gestão de fornecedores e reduzi custos em 12%. Proponho um reajuste para R$ 7.800.', next: 3, tip: 'Valor antes de número. Agora, faça silêncio.' },
        { label: 'Entendo que está apertado, então pode ser o que for possível.', next: 2, tip: 'Você não precisa argumentar contra si mesma.' },
      ] },
      { aurora: 'Certo... vou ver o que dá para fazer. Talvez no ano que vem.', options: [
        { label: 'Vamos recomeçar: posso apresentar minhas entregas e um valor concreto?', next: 1, tip: 'Retomar a conversa é sempre possível.' },
      ] },
      { aurora: 'É um bom argumento. Não consigo chegar nesse valor agora, mas posso propor R$ 7.200 e revisar em seis meses.', options: [
        { label: 'Aceito R$ 7.200 com revisão em seis meses, desde que registremos os critérios por e-mail.', next: 4, tip: 'Excelente: você fechou com um acordo verificável.' },
        { label: 'O que seria necessário para chegarmos a R$ 7.800 ainda este ano?', next: 4, tip: 'Pergunta poderosa: transforma o não em critério.' },
      ] },
      { aurora: 'Combinado. Vou formalizar por e-mail ainda hoje. Obrigado pela preparação, Marina.', options: [] },
    ],
  },
  {
    id: 'cliente', name: 'Sônia', role: 'Cliente', description: 'Pratique sustentar seu preço diante de pedidos de desconto.',
    scenario: 'Uma cliente gostou do seu projeto de interiores, mas quer pagar menos.',
    opening: 'Adorei a proposta, mas está acima do que eu imaginava. Você faz por 40% a menos?',
    replies: [
      { aurora: 'Adorei a proposta, mas está acima do que eu imaginava. Você faz por 40% a menos?', options: [
        { label: 'Com esse valor não consigo manter o escopo. O que é mais importante para você no projeto?', next: 1, tip: 'Você protege o valor e abre caminho para ajustar o escopo.' },
        { label: 'Tudo bem, faço por 40% a menos.', next: 2, tip: 'Desconto sem contrapartida reduz sua margem.' },
      ] },
      { aurora: 'O mais importante é a sala e a cozinha. Os quartos podem esperar.', options: [
        { label: 'Perfeito. Posso fazer sala e cozinha agora por R$ 6.500 e os quartos em uma segunda etapa.', next: 3, tip: 'Ajuste de escopo com preço coerente.' },
      ] },
      { aurora: 'Ótimo! Então fechamos assim.', options: [
        { label: 'Na verdade, quero rever: posso ajustar o escopo para caber no seu orçamento?', next: 1, tip: 'Sempre é possível recalibrar antes de assinar.' },
      ] },
      { aurora: 'Faz sentido. Pode me mandar a proposta revisada?', options: [] },
    ],
  },
  {
    id: 'entrevistador', name: 'Paula', role: 'Entrevistadora', description: 'Pratique respostas para uma entrevista de emprego.',
    scenario: 'Entrevista para coordenadora de projetos em uma empresa de arquitetura.',
    opening: 'Bem-vinda, Marina. Para começar, fale um pouco sobre você.',
    replies: [
      { aurora: 'Bem-vinda, Marina. Para começar, fale um pouco sobre você.', options: [
        { label: 'Sou designer com oito anos de experiência em projetos comerciais e lidero meu próprio ateliê. Busco coordenar projetos maiores.', next: 1, tip: 'Presente, passado relevante e futuro: excelente.' },
        { label: 'Bom... nasci em Salvador, estudei em escola pública, depois...', next: 2, tip: 'Selecione o que tem relação com a vaga.' },
      ] },
      { aurora: 'Interessante. Qual foi o maior desafio que você enfrentou liderando projetos?', options: [
        { label: 'Um cliente mudou o escopo no meio da obra. Renegociei prazos, reorganizei a equipe e entregamos com 5 dias de atraso, mas dentro do orçamento.', next: 3, tip: 'Contexto, ação e resultado concretos.' },
      ] },
      { aurora: 'Entendi. Pode ser mais objetiva sobre sua experiência profissional?', options: [
        { label: 'Claro. Sou designer com oito anos de experiência e lidero meu próprio ateliê.', next: 1, tip: 'Boa recuperação.' },
      ] },
      { aurora: 'Ótimo exemplo. Qual é a sua pretensão salarial?', options: [
        { label: 'Com base no mercado e na minha experiência, busco entre R$ 9.000 e R$ 10.500, considerando o pacote total.', next: 4, tip: 'Faixa fundamentada e tom neutro.' },
        { label: 'O que vocês acharem justo.', next: 4, tip: 'Você perde a chance de ancorar a negociação.' },
      ] },
      { aurora: 'Obrigada, Marina. Retornaremos até sexta-feira com os próximos passos.', options: [] },
    ],
  },
  {
    id: 'colega', name: 'Bruno', role: 'Colega de trabalho', description: 'Pratique lidar com interrupções e crédito por ideias.',
    scenario: 'Um colega apresentou uma ideia sua como se fosse dele na reunião de ontem.',
    opening: 'E aí, Marina, viu como a diretoria gostou da ideia do novo fluxo?',
    replies: [
      { aurora: 'E aí, Marina, viu como a diretoria gostou da ideia do novo fluxo?', options: [
        { label: 'Vi sim. Quero conversar sobre isso: essa ideia eu compartilhei com você semana passada, e senti falta de ser citada.', next: 1, tip: 'Fato e sentimento, sem acusação.' },
        { label: 'Vi... que bom.', next: 2, tip: 'O incômodo fica sem ser dito.' },
      ] },
      { aurora: 'Puxa, não percebi. Achei que tínhamos pensado juntos.', options: [
        { label: 'Entendo. Daqui para frente, quando apresentarmos ideias, vamos dizer de quem partiu cada parte?', next: 3, tip: 'Pedido concreto para o futuro.' },
      ] },
      { aurora: 'Pois é! Vou apresentar a próxima fase também.', options: [
        { label: 'Na verdade, quero apresentar a próxima fase, já que a ideia original foi minha.', next: 3, tip: 'Você recupera seu espaço com firmeza.' },
      ] },
      { aurora: 'Justo. Combinado, você apresenta a próxima fase.', options: [] },
    ],
  },
  {
    id: 'familiar', name: 'Dona Lúcia', role: 'Familiar', description: 'Pratique defender suas escolhas com afeto.',
    scenario: 'Sua mãe questiona sua decisão de empreender.',
    opening: 'Filha, você não acha que estava melhor com carteira assinada?',
    replies: [
      { aurora: 'Filha, você não acha que estava melhor com carteira assinada?', options: [
        { label: 'Sei que você se preocupa comigo. Estou segura da minha escolha e o ateliê está crescendo. Quer que eu te mostre?', next: 1, tip: 'Reconhece o cuidado e afirma a escolha.' },
        { label: 'Você nunca me apoiou em nada!', next: 2, tip: 'A conversa tende a virar discussão sobre o passado.' },
      ] },
      { aurora: 'Quero sim. Só fico com medo de você passar dificuldade.', options: [
        { label: 'Entendo. Tenho uma reserva de emergência e um plano. Vou te contar como funciona.', next: 3, tip: 'Informação concreta reduz o medo.' },
      ] },
      { aurora: 'Não é isso, filha... só me preocupo.', options: [
        { label: 'Desculpa, mãe. Sei que é cuidado. Posso te mostrar como está o ateliê?', next: 1, tip: 'Reparar é um gesto de força.' },
      ] },
      { aurora: 'Fico mais tranquila. Tenho orgulho de você.', options: [] },
    ],
  },
  {
    id: 'parceiro', name: 'Tiago', role: 'Parceiro comercial', description: 'Pratique alinhar responsabilidades em uma parceria.',
    scenario: 'Um parceiro comercial não cumpriu a parte dele em um projeto conjunto.',
    opening: 'Oi, Marina! Tudo certo para a entrega de sexta?',
    replies: [
      { aurora: 'Oi, Marina! Tudo certo para a entrega de sexta?', options: [
        { label: 'Quero alinhar isso. As medições que você ficou de enviar na segunda ainda não chegaram, e sem elas não consigo finalizar.', next: 1, tip: 'Fato e impacto claros.' },
        { label: 'Tudo certo, pode deixar.', next: 2, tip: 'Você assume um risco que não é só seu.' },
      ] },
      { aurora: 'Verdade, atrasou aqui. Consigo mandar amanhã cedo.', options: [
        { label: 'Combinado: até as 10h. Se chegar depois, a entrega passa para segunda e eu aviso o cliente.', next: 3, tip: 'Limite com consequência clara.' },
      ] },
      { aurora: 'Ótimo, então nos vemos na sexta.', options: [
        { label: 'Antes, preciso das medições que estão pendentes. Consegue enviar amanhã?', next: 1, tip: 'Retomar a pendência evita surpresas.' },
      ] },
      { aurora: 'Justo. Às 10h estará no seu e-mail.', options: [] },
    ],
  },
]

export const auroraFallback =
  'Esta é uma versão demonstrativa e eu ainda conheço apenas algumas situações. Por enquanto, posso conversar sobre os temas abaixo ou simular uma conversa com um personagem.'

export const auroraSafety =
  'Eu sou uma assistente de prática de comunicação e não ofereço atendimento psicológico, diagnóstico ou orientação jurídica. Se você estiver em sofrimento ou em risco, procure apoio: CVV pelo 188 (24h) ou Central de Atendimento à Mulher pelo 180.'

export const auroraSafetyKeywords = ['suicid', 'me matar', 'morrer', 'depress', 'violência', 'violencia', 'agredid', 'apanh', 'abuso', 'diagnóstico', 'diagnostico', 'remédio', 'remedio']
