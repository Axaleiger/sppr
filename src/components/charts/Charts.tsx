import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const tipStyle = {
  background: 'rgba(2,21,38,0.92)',
  border: '1px solid rgba(50,173,229,0.35)',
  borderRadius: 10,
  fontSize: 12,
}

export function MiniArea({ data, color = '#32ADE5' }: { data: number[]; color?: string }) {
  const chart = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chart}>
        <defs>
          <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          fill={`url(#g-${color.replace('#', '')})`}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function LinePanel({
  data,
  keys = ['a', 'b'],
  colors = ['#32ADE5', '#FF6A00'],
}: {
  data: { x: number; a: number; b?: number; c?: number }[]
  keys?: string[]
  colors?: string[]
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="x" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip contentStyle={tipStyle} />
        {keys.map((k, i) => (
          <Line
            key={k}
            type="monotone"
            dataKey={k}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AreaPanel({
  data,
  colors = ['#32ADE5', '#006CB1'],
}: {
  data: { x: number; a: number; b?: number }[]
  colors?: string[]
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <XAxis dataKey="x" hide />
        <YAxis hide />
        <Tooltip contentStyle={tipStyle} />
        <Area type="monotone" dataKey="a" stroke={colors[0]} fill={colors[0]} fillOpacity={0.25} />
        <Area type="monotone" dataKey="b" stroke={colors[1]} fill={colors[1]} fillOpacity={0.15} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BarPanel({
  data,
  keys = ['a', 'b'],
  colors = ['#006CB1', '#32ADE5'],
  stacked,
}: {
  data: Record<string, string | number>[]
  keys?: string[]
  colors?: string[]
  stacked?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fill: '#8A96A8', fontSize: 10 }} />
        <YAxis hide />
        <Tooltip contentStyle={tipStyle} />
        {keys.map((k, i) => (
          <Bar
            key={k}
            dataKey={k}
            stackId={stacked ? 's' : undefined}
            fill={colors[i % colors.length]}
            radius={stacked ? 0 : [4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DonutPanel({
  data,
  center,
}: {
  data: { name: string; value: number; color: string }[]
  center?: string
}) {
  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius="62%" outerRadius="88%" paddingAngle={2}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip contentStyle={tipStyle} />
        </PieChart>
      </ResponsiveContainer>
      {center && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="font-display text-2xl font-bold text-white">{center}</div>
        </div>
      )}
    </div>
  )
}

export function HBarPanel({
  data,
}: {
  data: { name: string; value: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={70} tick={{ fill: '#8A96A8', fontSize: 10 }} />
        <Tooltip contentStyle={tipStyle} />
        <Bar dataKey="value" fill="#FF6A00" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
