import { useCallback, useEffect, useRef, useState } from 'react'
import { account, campaign } from './config/mock'
import type { Reward } from './config/mock'
import { DemoPanel } from './components/DemoPanel'
import type { SloganMode, Variant } from './components/DemoPanel'
import { LiveSupport } from './components/LiveSupport'
import { OceanCard } from './components/OceanCard'
import { ItemsSection, OrderHeader, OrderStatus, RatingCard, ReturnsSection, TopBar } from './components/OrderSections'
import { RewardsModal } from './components/RewardsModal'
import type { ProductPoolState, Redemption } from './components/RewardsModal'
import { setVariant as setTrackingVariant, track } from './lib/analytics'
import { clearPersistentState, usePersistentState } from './lib/usePersistentState'

export default function App() {
  const [points, setPoints] = usePersistentState('points', account.initialPoints)
  const [redemptions, setRedemptions] = usePersistentState<Redemption[]>('redemptions', [])
  const [variant, setVariant] = usePersistentState<Variant>('variant', 'B')
  const [poolState, setPoolState] = usePersistentState<ProductPoolState>('pool', 'ready')
  const [sloganMode, setSloganMode] = usePersistentState<SloganMode>('slogan', 'verified')
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  const pageViewTracked = useRef(false)

  setTrackingVariant(variant)

  useEffect(() => {
    if (pageViewTracked.current) return
    pageViewTracked.current = true
    track('rc_page_view', { placement: 'resolution_center' })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const notify = useCallback((msg: string) => setToast(msg), [])

  const slogan = sloganMode === 'verified' ? campaign.slogan : campaign.softSlogan

  const redeem = (reward: Reward): Redemption => {
    if (points < reward.cost) throw new Error('Insufficient points')
    const res: Redemption = {
      rewardId: reward.id,
      code: `${reward.codePrefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      at: new Date().toISOString(),
    }
    setPoints(points - reward.cost)
    setRedemptions([res, ...redemptions])
    track('reward_redeem', { reward_id: reward.id, reward_type: reward.kind, cost: reward.cost, points_after: points - reward.cost })
    return res
  }

  const closeModal = () => {
    setModalOpen(false)
    opener.current?.focus()
  }

  const reset = () => {
    clearPersistentState()
    setPoints(account.initialPoints)
    setRedemptions([])
    setVariant('B')
    setPoolState('ready')
    setSloganMode('verified')
    notify('Demo data reset.')
  }

  return (
    <div className="app">
      <TopBar />
      <div className="layout">
        <main className="main">
          <OrderHeader notify={notify} />
          <OrderStatus />
          {variant === 'B' ? (
            <OceanCard
              points={points}
              slogan={slogan}
              onOpen={(el) => {
                opener.current = el
                setModalOpen(true)
              }}
            />
          ) : (
            <RatingCard notify={notify} />
          )}
          <ReturnsSection notify={notify} />
          <ItemsSection notify={notify} />
        </main>
        <LiveSupport />
      </div>

      {modalOpen && (
        <RewardsModal
          points={points}
          slogan={slogan}
          poolState={poolState}
          redemptions={redemptions}
          onRedeem={redeem}
          onClose={closeModal}
          notify={notify}
        />
      )}

      <DemoPanel
        variant={variant}
        setVariant={setVariant}
        poolState={poolState}
        setPoolState={setPoolState}
        sloganMode={sloganMode}
        setSloganMode={setSloganMode}
        points={points}
        setPoints={setPoints}
        onReset={reset}
      />

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}
