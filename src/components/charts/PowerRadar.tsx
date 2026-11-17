import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { DimensionScores } from '@/types'
import { dimensions } from '@/mocks/assessments'

interface Props {
  current: DimensionScores
  initial?: DimensionScores
  height?: number
  currentLabel?: string
  initialLabel?: string
  light?: boolean
}

export function PowerRadar({ current, initial, height = 340, currentLabel = 'Atual', initialLabel = 'Avaliação inicial', light }: Props) {
  const data = dimensions.map((d) => ({ dim: d.short, atual: current[d.id], inicial: initial?.[d.id] }))
  const tick = light ? '#FAF7F0' : '#26191C'
  return (
    <div style={{ width: '100%', height }} role="img" aria-label={`Gráfico radar de autopercepção: ${dimensions.map((d) => `${d.name} ${current[d.id]}`).join(', ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke={light ? 'rgba(250,247,240,0.18)' : '#E6DDD0'} />
          <PolarAngleAxis dataKey="dim" tick={{ fill: tick, fontSize: 11.5, fontFamily: 'Montserrat', fontWeight: 600 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          {initial && <Radar name={initialLabel} dataKey="inicial" stroke="#C5A572" strokeDasharray="4 3" fill="#C5A572" fillOpacity={0.12} strokeWidth={1.5} />}
          <Radar name={currentLabel} dataKey="atual" stroke={light ? '#C5A572' : '#650F1D'} fill={light ? '#C5A572' : '#650F1D'} fillOpacity={0.22} strokeWidth={2} dot={{ r: 3 }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #E6DDD0', fontFamily: 'Montserrat', fontSize: 12 }}
            formatter={(v) => [`${v} / 100`]}
          />
          {initial && <Legend wrapperStyle={{ fontFamily: 'Montserrat', fontSize: 12 }} iconType="circle" formatter={(v) => <span style={{ color: tick }}>{v}</span>} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
