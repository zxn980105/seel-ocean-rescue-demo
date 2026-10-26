import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { campaign, partnerProducts, partnerStoresUrl, pointsHistory, pointsRules, rewards } from '../config/mock'
import type { PartnerProduct, Reward } from '../config/mock'
import { outboundUrl, track } from '../lib/analytics'
import { fmt } from '../lib/rewards'
import { CheckIcon, ChevronRight, CloseIcon, ExternalIcon, GiftIcon, InfoIcon, LockIcon, WaveIcon } from './Icons'
import { NextCatchBox, PointsProgress } from './Progress'

export type ProductPoolState = 'ready' | 'loading' | 'empty'

export interface Redemption {
  rewardId: string
  code: string
  at: string
}

interface Props {
  points: number
  slogan: string
  poolState: ProductPoolState
  redemptions: Redemption[]
  onRedeem: (reward: Reward) => Redemption
  onClose: () => void
  notify: (msg: string) => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

export function RewardsModal({ points, slogan, poolState, redemptions, onRedeem, onClose, notify }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openedAt = useRef(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [justRedeemed, setJustRedeemed] = useState<Redemption | null>(null)

  const tracked = useRef<Set<string>>(new Set())
  const trackOnce = (key: string, fn: () => void) => {
    if (tracked.current.has(key)) return
    tracked.current.add(key)
    fn()
  }

  useEffect(() => {
    openedAt.current = performance.now()
    trackOnce('view', () => {
      track('ocean_modal_view', { points })
      rewards.forEach((r) => track('reward_view', { reward_id: r.id, reward_type: r.kind, affordable: points >= r.cost }))
    })
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    if (poolState !== 'ready') return
    trackOnce('pool', () =>
      partnerProducts.forEach((p, i) =>
        track('partner_product_impression', { product_id: p.id, merchant: p.merchantId, position: i + 1 }),
      ),
    )
  }, [poolState])

  const close = (via: string) => {
    track('ocean_modal_close', { via, dwell_ms: Math.round(performance.now() - openedAt.current) })
    onClose()
  }

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      close('esc')
      return
    }
    if (e.key !== 'Tab' || !dialogRef.current) return
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (!nodes.length) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const selected = rewards.find((r) => r.id === selectedId) ?? null

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && close('overlay')}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
        onKeyDown={onKeyDown}
      >
        <header className="modal-head">
          <h2 id="modal-title" className="modal-title">
            Ocean <em>Rescue</em>
          </h2>
          <button className="icon-btn" ref={closeRef} onClick={() => close('button')} aria-label="Close Ocean Rescue">
            <CloseIcon size={20} />
          </button>
        </header>

        <div className="modal-scroll">
          <section className="modal-points">
            <div className="modal-points-top">
              <div className="points points-lg">
                <span className="points-icon">
                  <GiftIcon size={22} />
                </span>
                <span className="points-value">{fmt(points)}</span>
                <span className="points-label">{campaign.pointsLabel}</span>
              </div>
              <NextCatchBox points={points} />
            </div>
            <PointsProgress points={points} />
            <button
              className="link-btn"
              aria-expanded={showHistory}
              onClick={() => {
                if (!showHistory) track('points_history_view')
                setShowHistory((v) => !v)
              }}
            >
              {showHistory ? 'Hide' : 'View'} points history & rules
            </button>
            {showHistory && <PointsHistory redemptions={redemptions} />}
          </section>

          <section className="modal-hero">
            <img src="assets/modal-hero.png" alt="A cartoon seal fishing a message bottle out of the sea" />
            <div className="modal-hero-text">
              <h3>{slogan}</h3>
              <p>
                {campaign.partnerNote}
                <span className="info-tip" tabIndex={0} aria-label={campaign.partnerTooltip} data-tip={campaign.partnerTooltip}>
                  <InfoIcon size={13} />
                </span>
              </p>
            </div>
          </section>

          <section>
            <div className="section-head">
              <h3>Choose your next catch</h3>
              <span className="muted">Redeem your points for rewards from Seel and our partners.</span>
            </div>
            <div className="reward-grid">
              {rewards.map((r) => (
                <RewardCard
                  key={r.id}
                  reward={r}
                  points={points}
                  selected={selectedId === r.id}
                  onSelect={() => {
                    setSelectedId(r.id)
                    setJustRedeemed(null)
                    track('reward_select', { reward_id: r.id, reward_type: r.kind, affordable: points >= r.cost })
                  }}
                />
              ))}
            </div>
            {selected && (
              <RewardDetail
                reward={selected}
                points={points}
                redeemed={justRedeemed?.rewardId === selected.id ? justRedeemed : null}
                onRedeem={() => {
                  const res = onRedeem(selected)
                  setJustRedeemed(res)
                  notify(`Redeemed ${selected.title} — ${fmt(selected.cost)} points used.`)
                }}
              />
            )}
          </section>

          <section>
            <div className="section-head">
              <h3>
                Ocean Picks{' '}
                <span className="muted small">Use your points on special offers from our partner stores.</span>
              </h3>
              <span className="muted small">Curated for you</span>
            </div>
            <ProductPool state={poolState} />
          </section>

          <footer className="modal-foot">
            <WaveIcon size={16} /> {campaign.footerNote}
            <span className="info-tip" tabIndex={0} aria-label={campaign.partnerTooltip} data-tip={campaign.partnerTooltip}>
              <InfoIcon size={12} />
            </span>
          </footer>
        </div>
      </div>
    </div>
  )
}

function RewardCard({
  reward,
  points,
  selected,
  onSelect,
}: {
  reward: Reward
  points: number
  selected: boolean
  onSelect: () => void
}) {
  const affordable = points >= reward.cost
  return (
    <button className={`reward-card ${selected ? 'is-selected' : ''}`} aria-pressed={selected} onClick={onSelect}>
      <img src={reward.image} alt="" />
      <div className="reward-body">
        <div>
          <strong>{reward.title}</strong>
          <span className="muted small">{reward.subtitle}</span>
        </div>
        <span className="reward-arrow">
          <ChevronRight size={14} />
        </span>
      </div>
      <div className={`reward-status ${affordable ? 'ok' : 'locked'}`}>
        {affordable ? (
          <>
            <CheckIcon size={12} /> {fmt(reward.cost)} pts · Available
          </>
        ) : (
          <>
            <LockIcon size={12} /> {fmt(reward.cost)} pts · {fmt(reward.cost - points)} points to go
          </>
        )}
      </div>
    </button>
  )
}

function RewardDetail({
  reward,
  points,
  redeemed,
  onRedeem,
}: {
  reward: Reward
  points: number
  redeemed: Redemption | null
  onRedeem: () => void
}) {
  const affordable = points >= reward.cost
  return (
    <div className="reward-detail" aria-live="polite">
      <div>
        <strong>{reward.title}</strong>
        <p>{reward.details}</p>
      </div>
      {redeemed ? (
        <div className="redeemed">
          <span className="redeemed-ok">
            <CheckIcon size={14} /> Redeemed
          </span>
          <code>{redeemed.code}</code>
          <span className="muted small">Demo code — not a real discount</span>
        </div>
      ) : affordable ? (
        <button className="btn btn-primary" onClick={onRedeem}>
          Redeem for {fmt(reward.cost)} pts
        </button>
      ) : (
        <div className="locked-note">
          <button className="btn btn-primary" disabled>
            <LockIcon size={14} /> {fmt(reward.cost - points)} points to go
          </button>
          <span className="muted small">Earn points with your next paid order.</span>
        </div>
      )}
    </div>
  )
}

function ProductPool({ state }: { state: ProductPoolState }) {
  if (state === 'loading') {
    return (
      <div className="product-row" aria-busy="true" aria-label="Loading partner offers">
        {[0, 1, 2].map((i) => (
          <div key={i} className="product-card skeleton">
            <div className="sk sk-img" />
            <div className="sk-lines">
              <div className="sk sk-line w60" />
              <div className="sk sk-line w80" />
              <div className="sk sk-line w40" />
              <div className="sk sk-btn" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (state === 'empty') {
    const href = outboundUrl(partnerStoresUrl, { placement: 'ocean_modal_fallback' })
    return (
      <div className="fallback">
        <div>
          <strong>Shop directly with partner stores</strong>
          <p className="muted small">
            Curated picks aren't available right now. You can still use your rewards on participating partner stores.
            You'll leave Seel and open the partner site in a new tab.
          </p>
        </div>
        <a
          className="btn btn-dark"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('outbound_store_click', { placement: 'ocean_modal_fallback', destination: 'partner_stores' })}
        >
          Explore partner stores <ExternalIcon size={14} />
        </a>
      </div>
    )
  }

  return (
    <>
      <p className="leave-note">
        <ExternalIcon size={12} /> Offers open on partner stores in a new tab. You'll leave Seel.
      </p>
      <div className="product-row">
        {partnerProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} position={i + 1} />
        ))}
      </div>
    </>
  )
}

function ProductCard({ product: p, position }: { product: PartnerProduct; position: number }) {
  const href = outboundUrl(p.url, { merchant: p.merchantId, product: p.id, placement: 'ocean_picks' })
  return (
    <article className="product-card">
      <img className="product-img" src={p.image} alt={p.title} />
      <div className="product-info">
        <div className="product-brand">
          <strong>{p.brand}</strong>
          <ExternalIcon size={12} />
        </div>
        <span className="partner-badge">Partner store</span>
        <span className="product-title">{p.title}</span>
        <span className="product-price">{p.price}</span>
        <span className="points-chip">From {fmt(p.pointsFrom)} points</span>
        <a
          className="btn btn-dark btn-sm"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View offer: ${p.title} on ${p.brand} store (opens in a new tab)`}
          onClick={() => {
            track('partner_product_click', { product_id: p.id, merchant: p.merchantId, position })
            track('outbound_store_click', { placement: 'ocean_picks', merchant: p.merchantId, product_id: p.id })
          }}
        >
          View offer <ExternalIcon size={12} />
        </a>
      </div>
    </article>
  )
}

function PointsHistory({ redemptions }: { redemptions: Redemption[] }) {
  return (
    <div className="history">
      <div>
        <h4>Points history</h4>
        <ul>
          {redemptions.map((r) => {
            const reward = rewards.find((x) => x.id === r.rewardId)
            return (
              <li key={r.code}>
                <span>Redeemed {reward?.title}</span>
                <span className="neg">-{fmt(reward?.cost ?? 0)}</span>
              </li>
            )
          })}
          {pointsHistory.map((h) => (
            <li key={h.id}>
              <span>
                {h.label} <span className="muted small">· {h.date}</span>
              </span>
              <span className={h.delta < 0 ? 'neg' : 'pos'}>
                {h.delta > 0 ? '+' : ''}
                {fmt(h.delta)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Rules</h4>
        <ul className="rules">
          {pointsRules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
