// Registro centralizado de fotografias (Unsplash — Licença Unsplash).
// Todas as imagens ficam em /public/images para funcionar sem dependência externa.

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}.jpg`

export const images = {
  heroDuo: img('hero-duo'),
  liderReuniao: img('lider-reuniao'),
  mentoriaMesa: img('mentoria-mesa'),
  conversaJanela: img('conversa-janela'),
  retratoEbony: img('retrato-ebony'),
  profissionalTrancas: img('profissional-trancas'),
  profissionalAzul: img('profissional-azul'),
  cidadeNoite: img('cidade-noite'),
  cachosEstudio: img('cachos-estudio'),
  sorrisoAberto: img('sorriso-aberto'),
  alegriaCor: img('alegria-cor'),
  blazerRosa: img('blazer-rosa'),
  duasNegrasReuniao: img('duas-negras-reuniao'),
  laptopSofa: img('laptop-sofa'),
  maduraSorriso: img('madura-sorriso'),
  maduraCachos: img('madura-cachos'),
  maduraEscritorio: img('madura-escritorio'),
  asiaticaRiso: img('asiatica-riso'),
  asiaticaSentada: img('asiatica-sentada'),
  asiaticaOculos: img('asiatica-oculos'),
  brancaBlazer: img('branca-blazer'),
  brancaSorriso: img('branca-sorriso'),
  latinaRetrato: img('latina-retrato'),
  apresentacaoPostits: img('apresentacao-postits'),
  mesaEscritorio: img('mesa-escritorio'),
  comemoracao: img('comemoracao'),
  meditacao: img('meditacao'),
  yogaPraia: img('yoga-praia'),
  diario: img('diario'),
  microfone: img('microfone'),
  palcoMicrofone: img('palco-microfone'),
  oleos: img('oleos'),
  estudanteJeans: img('estudante-jeans'),
  sorrisoFranja: img('sorriso-franja'),
  risoReuniao: img('riso-reuniao'),
  equipeReuniao: img('equipe-reuniao'),
} as const

export type ImageKey = keyof typeof images
