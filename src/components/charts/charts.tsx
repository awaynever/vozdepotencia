import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { palette } from './palette'

const tooltipStyle = { borderRadius: 12, border: '1px solid #E6DDD0', fontFamily: 'Montserrat', fontSize: 12, boxShadow: '0 8px 24px rgba(38,25,28,0.08)' }
const axisTick = { fill: '#6F6265', fontSize: 11, fontFamily: 'Montserrat' }


export function SimpleBars({ data, dataKey, xKey, height = 200, unit, highlightLast }: { data: Record<string, string | number>[]; dataKey: string; xKey: string; height?: number; unit?: string; highlightLast?: boolean }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EDE5D8" />
          <XAxis dataKey={xKey} tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(197,165,114,0.12)' }} contentStyle={tooltipStyle} formatter={(v) => [`${v}${unit ? ` ${unit}` : ''}`]} />
          <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} maxBarSize={36}>
            {data.map((_, i) => (
              <Cell key={i} fill={highlightLast && i === data.length - 1 ? '#C5A572' : '#650F1D'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StackedBars({ data, keys, xKey, height = 240 }: { data: Record<string, string | number>[]; keys: { key: string; label: string }[]; xKey: string; height?: number }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EDE5D8" />
          <XAxis dataKey={xKey} tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(197,165,114,0.12)' }} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontFamily: 'Montserrat', fontSize: 11.5 }} iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#26191C' }}>{v}</span>} />
          {keys.map((k, i) => (
            <Bar key={k.key} dataKey={k.key} name={k.label} stackId="a" fill={palette[i % palette.length]} maxBarSize={36} radius={i === keys.length - 1 ? [5, 5, 0, 0] : 0} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function Lines({ data, keys, xKey, height = 260, domain }: { data: Record<string, string | number>[]; keys: { key: string; label: string }[]; xKey: string; height?: number; domain?: [number, number] }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EDE5D8" />
          <XAxis dataKey={xKey} tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={domain} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontFamily: 'Montserrat', fontSize: 11.5 }} iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#26191C' }}>{v}</span>} />
          {keys.map((k, i) => (
            <Line key={k.key} type="monotone" dataKey={k.key} name={k.label} stroke={palette[i % palette.length]} strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function Donut({ data, height = 240 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none">
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
