import type { VoiceAnalysis, VoiceExercise, VoiceModule } from '@/types'

export const voiceModules: VoiceModule[] = [
  { id: 'diccao', name: 'Dicção', icon: 'AudioLines', minutes: 6, description: 'Articulação clara das palavras, sem perder a naturalidade do seu sotaque.', tips: ['Articule as sílabas finais.', 'Aqueça a boca com movimentos amplos antes de falar.', 'Sotaques regionais são parte da sua identidade; o foco é clareza, não padronização.'], practice: 'Leia em voz alta: "O tempo perguntou ao tempo quanto tempo o tempo tem." Repita três vezes, aumentando a velocidade sem perder a clareza.' },
  { id: 'ritmo', name: 'Ritmo', icon: 'Gauge', minutes: 5, description: 'Velocidade adequada para ser compreendida e manter o interesse.', tips: ['Um ritmo confortável costuma ficar entre 120 e 150 palavras por minuto.', 'Desacelere nos pontos importantes.', 'Varie o ritmo para evitar monotonia.'], practice: 'Leia um parágrafo três vezes: devagar, rápido e no seu ritmo ideal. Grave e compare.' },
  { id: 'pausas', name: 'Pausas', icon: 'Pause', minutes: 5, description: 'Silêncios estratégicos que dão peso às ideias.', tips: ['Pause antes e depois da frase principal.', 'Troque palavras de preenchimento por silêncio.', 'Dois segundos de pausa soam naturais para quem ouve.'], practice: 'Marque com "/" as pausas em um texto e leia respeitando as marcações.' },
  { id: 'respiracao', name: 'Respiração', icon: 'Wind', minutes: 4, description: 'Base física da voz e da calma ao falar.', tips: ['Respire pelo abdômen, não pelos ombros.', 'Inspire em 4 tempos e expire em 6.', 'Respire entre as frases, não no meio delas.'], practice: 'Deitada ou sentada, coloque a mão no abdômen e respire sentindo-o expandir. Faça cinco ciclos.' },
  { id: 'clareza', name: 'Clareza', icon: 'Lightbulb', minutes: 6, description: 'Organizar ideias para que sejam entendidas de primeira.', tips: ['Uma ideia por frase.', 'Comece pela conclusão.', 'Evite jargões quando o público não os conhece.'], practice: 'Explique sua profissão para uma criança de dez anos em até 30 segundos.' },
  { id: 'argumentacao', name: 'Argumentação', icon: 'Scale', minutes: 8, description: 'Sustentar pontos de vista com lógica e evidências.', tips: ['Afirmação + motivo + exemplo.', 'Antecipe objeções.', 'Use dados quando possível.'], practice: 'Defenda em um minuto por que seu bairro é um bom lugar para morar, usando a estrutura afirmação, motivo e exemplo.' },
  { id: 'storytelling', name: 'Storytelling', icon: 'BookOpen', minutes: 8, description: 'Contar histórias que conectam e tornam ideias memoráveis.', tips: ['Contexto, desafio, escolha e resultado.', 'Detalhes sensoriais criam imagens.', 'Termine com o aprendizado.'], practice: 'Conte uma história de superação pessoal em até 90 segundos.' },
  { id: 'improvisacao', name: 'Improvisação', icon: 'Shuffle', minutes: 6, description: 'Responder com segurança a perguntas inesperadas.', tips: ['Ganhe tempo repetindo a pergunta.', 'Use a estrutura passado, presente e futuro.', 'Tudo bem dizer "não sei, vou verificar".'], practice: 'Sorteie um tema qualquer e fale sobre ele por 45 segundos sem preparo.' },
  { id: 'assertiva', name: 'Comunicação assertiva', icon: 'MessageSquareQuote', minutes: 7, description: 'Expressar necessidades com firmeza e respeito.', tips: ['Fale em primeira pessoa.', 'Descreva fatos, não julgamentos.', 'Faça pedidos concretos.'], practice: 'Transforme "você nunca me escuta" em uma frase assertiva e grave.' },
  { id: 'apresentacoes', name: 'Apresentações', icon: 'Presentation', minutes: 10, description: 'Estruturar e conduzir apresentações de impacto.', tips: ['Uma mensagem central.', 'Abertura que conecta.', 'Encerramento com pedido.'], practice: 'Prepare uma apresentação de dois minutos sobre um projeto seu.' },
  { id: 'negociacao', name: 'Negociação', icon: 'Handshake', minutes: 8, description: 'Comunicar valor e construir acordos.', tips: ['Valor antes de preço.', 'Silêncio depois do número.', 'Tenha alternativas.'], practice: 'Grave sua frase de valor para um cliente ou para uma conversa salarial.' },
  { id: 'lideranca', name: 'Liderança', icon: 'Users', minutes: 8, description: 'Comunicar direção, dar feedback e inspirar.', tips: ['Explique o porquê.', 'Reconheça em público, ajuste em particular.', 'Seja específica nos pedidos.'], practice: 'Grave um feedback positivo específico para alguém da sua equipe ou convívio.' },
]

export const voiceExercises: VoiceExercise[] = [
  { id: 've-30s', title: 'Apresente-se em 30 segundos', description: 'Quem você é, o que faz e o que busca.', seconds: 30, prompt: 'Apresente-se como se estivesse em um evento de networking.', guide: ['Nome e atuação', 'Um resultado ou diferencial', 'O que você busca agora'], moduleIds: ['clareza', 'apresentacoes'] },
  { id: 've-60s', title: 'Explique uma ideia em 60 segundos', description: 'Organize uma ideia com começo, meio e fim.', seconds: 60, prompt: 'Explique uma ideia que você gostaria de colocar em prática.', guide: ['O problema', 'A ideia', 'Por que funciona', 'Próximo passo'], moduleIds: ['clareza', 'argumentacao'] },
  { id: 've-historia', title: 'Conte uma história', description: 'Use a estrutura de quatro tempos.', seconds: 90, prompt: 'Conte um momento em que você superou um desafio.', guide: ['Contexto', 'Desafio', 'Escolha', 'Resultado'], moduleIds: ['storytelling'] },
  { id: 've-entrevista', title: 'Simule uma entrevista', description: 'Responda a perguntas clássicas.', seconds: 90, prompt: '"Fale sobre você" e "Qual foi seu maior desafio profissional?"', guide: ['Presente', 'Passado relevante', 'Futuro desejado'], moduleIds: ['improvisacao', 'clareza'] },
  { id: 've-negocio', title: 'Apresente seu negócio', description: 'Um pitch breve e memorável.', seconds: 120, prompt: 'Apresente seu negócio ou projeto para uma potencial cliente.', guide: ['Problema', 'Solução', 'Resultado', 'Convite'], moduleIds: ['apresentacoes', 'negociacao'] },
  { id: 've-ponto-vista', title: 'Defenda um ponto de vista', description: 'Afirmação, motivo e exemplo.', seconds: 60, prompt: 'Defenda por que todas as pessoas deveriam aprender a negociar.', guide: ['Afirmação', 'Motivo', 'Exemplo', 'Conclusão'], moduleIds: ['argumentacao', 'assertiva'] },
  { id: 've-resposta-dificil', title: 'Pratique uma resposta difícil', description: 'Ensaie uma resposta para uma conversa que você está adiando.', seconds: 60, prompt: 'Diga em voz alta aquilo que você precisa comunicar a alguém.', guide: ['Fato', 'Sentimento ou impacto', 'Pedido'], moduleIds: ['assertiva', 'respiracao'] },
]

// Análise demonstrativa (dados de exemplo — não há processamento real de áudio nesta versão)
export const sampleVoiceAnalysis: VoiceAnalysis = {
  duration: '1min12s',
  wpm: 128,
  fillerWords: 4,
  pauses: 6,
  structure: ['Introdução', 'Desenvolvimento', 'Conclusão'],
  highlights: [
    'Ritmo confortável, dentro da faixa de 120 a 150 palavras por minuto.',
    'Estrutura clara: a abertura apresenta o tema e o encerramento traz um convite.',
    'Boas pausas antes da frase principal.',
  ],
  suggestions: [
    'Substitua parte das 4 palavras de preenchimento ("né", "tipo") por pausas silenciosas.',
    'Desacelere levemente ao apresentar números ou resultados.',
    'Experimente terminar com um pedido mais específico ("Podemos marcar um café na quinta?").',
  ],
}

export const demoVoiceExercisesDone = ['ve-30s', 've-60s', 've-historia', 've-entrevista', 've-ponto-vista']
