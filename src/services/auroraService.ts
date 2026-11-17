import type { AuroraTopic } from '@/types'
import { auroraFallback, auroraSafety, auroraSafetyKeywords, auroraTopics } from '@/mocks/aurora'

// Interface preparada para integração futura com uma API real de IA.
// Para integrar: implemente AuroraProvider (ex.: RemoteAuroraProvider chamando seu backend)
// e troque a exportação `auroraProvider` abaixo. Nenhum componente precisa mudar.

export interface AuroraReply {
  text: string
  topicId?: string
  turnIndex?: number
  kind: 'topic' | 'fallback' | 'safety'
}

export interface AuroraProvider {
  readonly isDemo: boolean
  reply(message: string): Promise<AuroraReply>
  continueTopic(topicId: string, turnIndex: number): Promise<AuroraReply>
}

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const findTopic = (message: string): AuroraTopic | undefined => {
  const text = normalize(message)
  return auroraTopics.find((t) => normalize(t.title) === text || t.keywords.some((k) => text.includes(normalize(k))))
}

class MockAuroraProvider implements AuroraProvider {
  readonly isDemo = true

  async reply(message: string): Promise<AuroraReply> {
    await wait(900 + Math.random() * 700)
    const text = normalize(message)
    if (auroraSafetyKeywords.some((k) => text.includes(normalize(k)))) {
      return { text: auroraSafety, kind: 'safety' }
    }
    const topic = findTopic(message)
    if (!topic) return { text: auroraFallback, kind: 'fallback' }
    return { text: topic.turns[0].aurora, topicId: topic.id, turnIndex: 0, kind: 'topic' }
  }

  async continueTopic(topicId: string, turnIndex: number): Promise<AuroraReply> {
    await wait(800 + Math.random() * 600)
    const topic = auroraTopics.find((t) => t.id === topicId)
    const turn = topic?.turns[turnIndex]
    if (!topic || !turn) return { text: auroraFallback, kind: 'fallback' }
    return { text: turn.aurora, topicId, turnIndex, kind: 'topic' }
  }
}

export const auroraProvider: AuroraProvider = new MockAuroraProvider()
