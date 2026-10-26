import { rewards } from '../config/mock'
import type { Reward } from '../config/mock'

export const fmt = (n: number) => n.toLocaleString('en-US')

/** The cheapest reward the user cannot afford yet; null when everything is unlocked. */
export function nextCatch(points: number): Reward | null {
  return [...rewards].sort((a, b) => a.cost - b.cost).find((r) => r.cost > points) ?? null
}

export function progressOf(points: number) {
  const next = nextCatch(points)
  if (!next) return { next, target: points, pct: 100, toGo: 0 }
  return { next, target: next.cost, pct: Math.min(100, (points / next.cost) * 100), toGo: next.cost - points }
}
