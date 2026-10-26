import { useEffect, useState } from 'react'
import { clearEvents, subscribe } from '../lib/analytics'
import type { TrackedEvent } from '../lib/analytics'
import { fmt } from '../lib/rewards'
import type { ProductPoolState } from './RewardsModal'

export type Variant = 'A' | 'B'
export type SloganMode = 'verified' | 'soft'

interface Props {
  variant: Variant
  setVariant: (v: Variant) => void
  poolState: ProductPoolState
  setPoolState: (s: ProductPoolState) => void
  sloganMode: SloganMode
  setSloganMode: (m: SloganMode) => void
  points: number
  setPoints: (n: number) => void
  onReset: () => void
}

const POINT_PRESETS = [300, 1180, 1250, 2400]

function Seg<T extends string | number>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={String(o.value)} className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function DemoPanel(p: Props) {
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<TrackedEvent[]>([])
  useEffect(() => subscribe(setEvents), [])

  if (!open) {
    return (
      <button className="demo-fab" onClick={() => setOpen(true)}>
        演示控制台 · {events.length} 事件
      </button>
    )
  }

  return (
    <aside className="demo-panel" aria-label="Demo controls">
      <header>
        <strong>演示控制台</strong>
        <span className="muted small">仅原型可见 · 本地 mock 数据</span>
        <button className="icon-btn sm" onClick={() => setOpen(false)} aria-label="收起">
          ×
        </button>
      </header>

      <label>实验分组</label>
      <Seg
        value={p.variant}
        onChange={p.setVariant}
        options={[
          { value: 'A', label: 'A 对照 · 评分卡' },
          { value: 'B', label: 'B 实验 · Ocean Rescue' },
        ]}
      />

      <label>账户积分</label>
      <Seg
        value={POINT_PRESETS.includes(p.points) ? p.points : -1}
        onChange={p.setPoints}
        options={POINT_PRESETS.map((n) => ({ value: n, label: fmt(n) }))}
      />

      <label>合作商品池</label>
      <Seg
        value={p.poolState}
        onChange={p.setPoolState}
        options={[
          { value: 'ready', label: '可用' },
          { value: 'loading', label: '加载中' },
          { value: 'empty', label: '未配置 → fallback' },
        ]}
      />

      <label>公益文案</label>
      <Seg
        value={p.sloganMode}
        onChange={p.setSloganMode}
        options={[
          { value: 'verified', label: '捐赠机制已确认' },
          { value: 'soft', label: '未确认（弱承诺）' },
        ]}
      />

      <button className="btn btn-outline btn-sm reset" onClick={p.onReset}>
        重置演示数据
      </button>

      <div className="event-head">
        <label>埋点事件（最新在上）</label>
        <button className="link-btn" onClick={clearEvents}>
          清空
        </button>
      </div>
      <ol className="event-log">
        {events.length === 0 && <li className="muted small">暂无事件</li>}
        {events.map((e) => (
          <li key={e.event_id} title={JSON.stringify(e.props, null, 2)}>
            <code>{e.event}</code>
            <span className="muted small">{summary(e.props)}</span>
          </li>
        ))}
      </ol>
    </aside>
  )
}

const SUMMARY_KEYS = ['reward_id', 'product_id', 'via', 'placement', 'points', 'variant']

function summary(props: Record<string, unknown>) {
  return SUMMARY_KEYS.filter((k) => props[k] !== undefined && props[k] !== null)
    .slice(0, 2)
    .map((k) => `${k}=${String(props[k])}`)
    .join(' · ')
}
