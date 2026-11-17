import type { CommunityChallenge, CommunityGroup, CommunityPost, CommunityProfile } from '@/types'
import { images } from './images'
import { daysAgoDateTime } from '@/utils/date'

// TODOS os perfis e publicações abaixo são fictícios, criados para demonstração.
export const communityProfiles: CommunityProfile[] = [
  { id: 'p-1', name: 'Aline Nascimento', avatar: images.profissionalAzul, role: 'Analista de RH', city: 'Recife, PE', bio: 'Aprendendo a liderar reuniões.' },
  { id: 'p-2', name: 'Beatriz Ramos', avatar: images.brancaSorriso, role: 'Estudante de Direito', city: 'Curitiba, PR', bio: 'Treinando oratória para o júri simulado.' },
  { id: 'p-3', name: 'Cida Moura', avatar: images.maduraCachos, role: 'Confeiteira empreendedora', city: 'Belo Horizonte, MG', bio: '52 anos, recomeçando com um negócio próprio.' },
  { id: 'p-4', name: 'Daniela Okabe', avatar: images.asiaticaRiso, role: 'Engenheira de software', city: 'São Paulo, SP', bio: 'Rumo à primeira posição de liderança técnica.' },
  { id: 'p-5', name: 'Eliane Santos', avatar: images.sorrisoAberto, role: 'Professora', city: 'Salvador, BA', bio: 'Ensinando e aprendendo a dizer não.' },
  { id: 'p-6', name: 'Fernanda Lima', avatar: images.latinaRetrato, role: 'Designer gráfica', city: 'Fortaleza, CE', bio: 'Freelancer aprendendo a precificar.' },
  { id: 'p-7', name: 'Gabriela Costa', avatar: images.cachosEstudio, role: 'Advogada', city: 'Rio de Janeiro, RJ', bio: 'Comunicação e liderança no escritório.' },
  { id: 'p-8', name: 'Helena Duarte', avatar: images.maduraEscritorio, role: 'Gerente comercial', city: 'Porto Alegre, RS', bio: 'Mentora de mulheres em vendas.' },
  { id: 'p-9', name: 'Iara Tavares', avatar: images.alegriaCor, role: 'Produtora cultural', city: 'São Luís, MA', bio: 'Ocupando palcos e espaços.' },
  { id: 'p-10', name: 'Joana Ferreira', avatar: images.estudanteJeans, role: 'Estudante de Administração', city: 'Goiânia, GO', bio: 'Primeira entrevista de estágio chegando.' },
  { id: 'p-11', name: 'Kátia Oliveira', avatar: images.blazerRosa, role: 'Consultora financeira', city: 'Brasília, DF', bio: 'Falando de dinheiro sem tabu.' },
  { id: 'p-12', name: 'Lúcia Prado', avatar: images.maduraSorriso, role: 'Aposentada e artesã', city: 'Florianópolis, SC', bio: 'Aos 61, aprendendo a vender meu trabalho.' },
]

export const communityGroups: CommunityGroup[] = [
  { id: 'g-empreendedoras', name: 'Mulheres empreendedoras', description: 'Precificação, vendas e gestão de pequenos negócios.', members: 0, icon: 'Store' },
  { id: 'g-lideranca', name: 'Comunicação e liderança', description: 'Reuniões, feedbacks e apresentações.', members: 0, icon: 'Megaphone' },
  { id: 'g-desenvolvimento', name: 'Desenvolvimento pessoal', description: 'Autoconhecimento, limites e hábitos.', members: 0, icon: 'Sprout' },
  { id: 'g-financeira', name: 'Autonomia financeira', description: 'Organização, negociação e planejamento.', members: 0, icon: 'Wallet' },
  { id: 'g-coragem', name: 'Desafios de coragem', description: 'Missões semanais compartilhadas.', members: 0, icon: 'Flame' },
  { id: 'g-leitura', name: 'Clube de leitura', description: 'Leituras mensais e conversas sobre os temas.', members: 0, icon: 'BookOpen' },
]

export const communityChallenges: CommunityChallenge[] = [
  { id: 'ch-1', title: '7 dias falando primeiro', description: 'Seja a primeira a se posicionar em uma conversa por dia.', days: 7, participants: 0 },
  { id: 'ch-2', title: 'Semana sem "desculpa, mas"', description: 'Troque atenuadores por afirmações diretas.', days: 7, participants: 0 },
  { id: 'ch-3', title: '5 conversas de oportunidade', description: 'Envie cinco mensagens de networking em duas semanas.', days: 14, participants: 0 },
]

export const communityReactions = [
  { id: 'apoio', label: 'Apoio', icon: 'HeartHandshake' },
  { id: 'inspirou', label: 'Me inspirou', icon: 'Sparkles' },
  { id: 'forca', label: 'Força', icon: 'Flame' },
]

export const communityPosts: CommunityPost[] = [
  { id: 'post-1', authorId: 'p-1', groupId: 'g-lideranca', type: 'conquista', date: daysAgoDateTime(0, '08:20:00'), reactions: { apoio: 12, inspirou: 8, forca: 3 },
    text: 'Usei a frase "gostaria de concluir meu raciocínio" pela primeira vez hoje. Ninguém se ofendeu, e eu terminei minha apresentação. Parece pequeno, mas para mim foi enorme.',
    comments: [{ id: 'c-1', authorId: 'p-7', text: 'Não é pequeno! Parabéns pela coragem.', date: daysAgoDateTime(0, '09:00:00') }] },
  { id: 'post-2', authorId: 'p-6', groupId: 'g-empreendedoras', type: 'pergunta', date: daysAgoDateTime(1, '21:40:00'), reactions: { apoio: 5, inspirou: 1, forca: 2 },
    text: 'Como vocês comunicaram o primeiro reajuste de preço para clientes antigas? Tenho medo de perder todas.',
    comments: [{ id: 'c-2', authorId: 'p-3', text: 'Avisei com 30 dias e mantive o preço antigo para quem fechasse no mês. Só uma cliente saiu.', date: daysAgoDateTime(1, '22:10:00') }, { id: 'c-3', authorId: 'p-11', text: 'Vale mostrar o que mudou no serviço desde o último preço.', date: daysAgoDateTime(0, '07:30:00') }] },
  { id: 'post-3', authorId: 'p-3', groupId: 'g-empreendedoras', type: 'conquista', date: daysAgoDateTime(1, '15:00:00'), reactions: { apoio: 20, inspirou: 15, forca: 9 }, image: images.comemoracao,
    text: 'Fechei minha primeira encomenda corporativa! Apresentei meu trabalho usando a estrutura problema, solução, resultado e convite. Aos 52, aprendendo que nunca é tarde.',
    comments: [{ id: 'c-4', authorId: 'p-12', text: 'Que lindo, Cida! Me deu ânimo.', date: daysAgoDateTime(1, '16:00:00') }] },
  { id: 'post-4', authorId: 'p-5', groupId: 'g-desenvolvimento', type: 'reflexao', date: daysAgoDateTime(1, '10:12:00'), reactions: { apoio: 9, inspirou: 6, forca: 1 },
    text: 'Percebi que digo "sim" para tudo na escola porque tenho medo de parecer pouco comprometida. Hoje recusei participar de mais uma comissão. Senti culpa, mas também alívio.',
    comments: [] },
  { id: 'post-5', authorId: 'p-4', groupId: 'g-lideranca', type: 'pergunta', date: daysAgoDateTime(2, '19:30:00'), reactions: { apoio: 4, inspirou: 2, forca: 0 },
    text: 'Alguém tem dicas para dar feedback para um colega mais experiente que eu? Vou assumir a liderança técnica e estou insegura.',
    comments: [{ id: 'c-5', authorId: 'p-8', text: 'Comece perguntando como ele vê a situação. Respeitar a experiência dele não te impede de liderar.', date: daysAgoDateTime(2, '20:15:00') }] },
  { id: 'post-6', authorId: 'p-11', groupId: 'g-financeira', type: 'reflexao', date: daysAgoDateTime(2, '12:00:00'), reactions: { apoio: 7, inspirou: 11, forca: 2 },
    text: 'Lembrete gentil: olhar o extrato não é para se culpar, é para decidir melhor. Dez minutos por semana já mudam muita coisa.',
    comments: [] },
  { id: 'post-7', authorId: 'p-10', groupId: 'g-desenvolvimento', type: 'conquista', date: daysAgoDateTime(3, '18:45:00'), reactions: { apoio: 14, inspirou: 4, forca: 6 },
    text: 'Treinei a resposta "fale sobre você" cinco vezes na Academia da Voz. Na entrevista real, saiu natural. Passei para a próxima etapa!',
    comments: [{ id: 'c-6', authorId: 'p-2', text: 'Vou fazer o mesmo antes do júri simulado!', date: daysAgoDateTime(3, '19:00:00') }] },
  { id: 'post-8', authorId: 'p-9', groupId: 'g-coragem', type: 'desafio', date: daysAgoDateTime(3, '09:00:00'), reactions: { apoio: 6, inspirou: 3, forca: 10 },
    text: 'Dia 3 do desafio "7 dias falando primeiro": abri a reunião de produção. Quem mais está participando?',
    comments: [] },
  { id: 'post-9', authorId: 'p-12', groupId: 'g-empreendedoras', type: 'pergunta', date: daysAgoDateTime(4, '16:20:00'), reactions: { apoio: 8, inspirou: 2, forca: 1 },
    text: 'Vendo minhas peças em feiras, mas fico sem graça de dizer o preço. Alguém mais sente isso?',
    comments: [{ id: 'c-7', authorId: 'p-6', text: 'Sinto muito isso! Treinar a frase em voz alta antes ajudou.', date: daysAgoDateTime(4, '17:00:00') }] },
  { id: 'post-10', authorId: 'p-7', groupId: 'g-lideranca', type: 'reflexao', date: daysAgoDateTime(4, '08:10:00'), reactions: { apoio: 5, inspirou: 9, forca: 2 },
    text: 'Feedback em particular, reconhecimento em público. Essa regra simples mudou o clima da minha equipe.',
    comments: [] },
  { id: 'post-11', authorId: 'p-2', groupId: 'g-leitura', type: 'reflexao', date: daysAgoDateTime(5, '22:00:00'), reactions: { apoio: 3, inspirou: 4, forca: 0 },
    text: 'Terminei o e-book "Construindo limites saudáveis". A parte sobre limites digitais me fez silenciar dois grupos que só me deixavam ansiosa.',
    comments: [] },
  { id: 'post-12', authorId: 'p-8', groupId: 'g-financeira', type: 'conquista', date: daysAgoDateTime(5, '14:30:00'), reactions: { apoio: 11, inspirou: 7, forca: 5 },
    text: 'Negociei meu bônus usando dados de resultado em vez de pedir "se fosse possível". Primeira vez que não pedi desculpas antes de falar de dinheiro.',
    comments: [] },
  { id: 'post-13', authorId: 'p-5', groupId: 'g-coragem', type: 'desafio', date: daysAgoDateTime(6, '07:50:00'), reactions: { apoio: 4, inspirou: 1, forca: 7 },
    text: 'Desafio da semana: sem "desculpa, mas". Já me peguei três vezes hoje e ainda são 8h!',
    comments: [{ id: 'c-8', authorId: 'p-9', text: 'Perceber já é metade do caminho.', date: daysAgoDateTime(6, '08:30:00') }] },
  { id: 'post-14', authorId: 'p-4', groupId: 'g-desenvolvimento', type: 'reflexao', date: daysAgoDateTime(7, '20:00:00'), reactions: { apoio: 6, inspirou: 5, forca: 0 },
    text: 'O ritual "Descanse sem culpa" virou parte da minha noite. Estou dormindo melhor e chegando menos irritada ao trabalho.',
    comments: [] },
  { id: 'post-15', authorId: 'p-1', groupId: 'g-leitura', type: 'pergunta', date: daysAgoDateTime(8, '13:00:00'), reactions: { apoio: 2, inspirou: 1, forca: 0 },
    text: 'Qual será a leitura de dezembro? Sugiro o "Guia de negociação feminina" para fecharmos o ano conversando sobre dinheiro.',
    comments: [] },
]
