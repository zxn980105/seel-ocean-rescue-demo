import { useEffect, useRef } from 'react'
import { campaign } from '../config/mock'
import { track } from '../lib/analytics'
import { fmt, progressOf } from '../lib/rewards'
import { ChevronRight, GiftIcon, InfoIcon } from './Icons'
import { NextCatchBox, PointsProgress } from './Progress'

interface Props {
  points: number
  slogan: string
  onOpen: (opener: HTMLElement) => void
}

export function OceanCard({ points, slogan, onOpen }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track('ocean_card_impression', { placement: 'after_order_status', points })
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const { next, toGo } = progressOf(points)

  return (
    <section className="ocean-card" ref={ref} aria-labelledby="ocean-card-title">
      <img className="ocean-card-seal" src="assets/card-seal.png" alt="" />
      <img className="ocean-card-island" src="assets/card-island.png" alt="" />
      <div className="ocean-card-content">
        <h2 id="ocean-card-title" className="ocean-title">
          {campaign.title} <em>{campaign.titleAccent}</em>
        </h2>
        <p className="ocean-slogan">{slogan}</p>
        <p className="ocean-partner">
          {campaign.partnerNote}
          <span className="info-tip" tabIndex={0} aria-label={campaign.partnerTooltip} data-tip={campaign.partnerTooltip}>
            <InfoIcon size={12} />
          </span>
        </p>

        <div className="ocean-panel">
          <div className="ocean-panel-top">
            <div className="points">
              <span className="points-icon">
                <GiftIcon size={18} />
              </span>
              <span className="points-value">{fmt(points)}</span>
              <span className="points-label">{campaign.pointsLabel}</span>
            </div>
            <NextCatchBox points={points} />
          </div>
          <div className="ocean-panel-bottom">
            <PointsProgress points={points} compact />
            <button
              className="btn btn-primary"
              onClick={(e) => {
                track('ocean_card_click', {
                  placement: 'after_order_status',
                  points,
                  next_reward_id: next?.id ?? null,
                  points_to_go: toGo,
                })
                onOpen(e.currentTarget)
              }}
            >
              {campaign.cta} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
