import { fmt, progressOf } from '../lib/rewards'
import { GiftIcon } from './Icons'

export function PointsProgress({ points, compact }: { points: number; compact?: boolean }) {
  const { target, pct, next } = progressOf(points)
  return (
    <div className={`progress ${compact ? 'progress-compact' : ''}`}>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={points}
        aria-label={next ? `Progress to ${next.title}` : 'All rewards unlocked'}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
        <span className="progress-knob" style={{ left: `${pct}%` }} />
      </div>
      <span className="progress-text">
        {fmt(points)} / {fmt(target)}
      </span>
    </div>
  )
}

export function NextCatchBox({ points }: { points: number }) {
  const { next, toGo } = progressOf(points)
  return (
    <div className="next-catch">
      <GiftIcon className="next-catch-icon" size={20} />
      <div>
        {next ? (
          <>
            <strong>Next catch: {next.title}</strong>
            <span>{fmt(toGo)} points to go</span>
          </>
        ) : (
          <>
            <strong>All catches unlocked</strong>
            <span>Redeem a reward anytime</span>
          </>
        )}
      </div>
    </div>
  )
}
