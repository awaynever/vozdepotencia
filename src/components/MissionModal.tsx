import { useState } from 'react'
import { Check, Clock } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/primitives'
import { useAppStore } from '@/store/useAppStore'
import { today } from '@/utils/date'
import type { DailyMission } from '@/types'

export function MissionModal({ mission, open, onOpenChange }: { mission: DailyMission; open: boolean; onOpenChange: (v: boolean) => void }) {
  const completeMission = useAppStore((s) => s.completeMission)
  const done = useAppStore((s) => s.missionsDone.some((m) => m.id === mission.id && m.date === today()))
  const [checked, setChecked] = useState<number[]>([])

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mission.title}
      description={mission.description}
      footer={
        done ? (
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            <Check className="h-4 w-4" aria-hidden="true" /> Missão concluída hoje
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Fazer depois</Button>
            <Button
              onClick={() => {
                completeMission(mission.id, mission.title)
                onOpenChange(false)
              }}
            >
              Concluí a missão
            </Button>
          </>
        )
      }
    >
      <p className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted">
        <Clock className="h-4 w-4" aria-hidden="true" /> Tempo estimado: {mission.minutes} minutos
      </p>
      <ol className="space-y-2">
        {mission.steps.map((s, i) => {
          const on = checked.includes(i)
          return (
            <li key={i}>
              <button
                onClick={() => setChecked((c) => (on ? c.filter((x) => x !== i) : [...c, i]))}
                aria-pressed={on}
                className="flex w-full items-start gap-3 rounded-xl border border-line bg-white p-3.5 text-left text-[14px] transition-colors hover:border-champagne"
              >
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${on ? 'border-rubi bg-rubi text-white' : 'border-line'}`}>
                  {on && <Check className="h-3 w-3" aria-hidden="true" />}
                </span>
                <span className={on ? 'text-muted line-through' : ''}>{s}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-[12.5px] text-muted">Ao concluir, você ganha 30 pontos de evolução. Missões podem ser repetidas em outros dias.</p>
    </Modal>
  )
}
