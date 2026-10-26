import { useEffect, useRef, useState } from 'react'
import { order } from '../config/mock'
import {
  CheckIcon,
  ChevronDown,
  GlobeIcon,
  PinIcon,
  RefreshIcon,
  SeelLogo,
  StarIcon,
  TruckIcon,
  UserIcon,
} from './Icons'

type Notify = (msg: string) => void

export function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <SeelLogo />
        <span>seel</span>
      </div>
      <nav className="topnav">
        <button className="lang">
          <GlobeIcon /> EN <ChevronDown size={14} />
        </button>
        <a href="#orders">Orders</a>
        <a href="#help">Help</a>
        <span className="avatar" aria-label="Account">
          <UserIcon size={16} />
        </span>
      </nav>
    </header>
  )
}

export function OrderHeader({ notify }: { notify: Notify }) {
  return (
    <div className="order-header">
      <div>
        <h1>Order: #{order.id}</h1>
        <p className="muted">Order date: {order.date}</p>
      </div>
      <button className="btn btn-outline" onClick={() => notify('Receipt download is simulated in this demo.')}>
        Receipt <ChevronDown size={14} />
      </button>
    </div>
  )
}

export function OrderStatus() {
  const [showTracking, setShowTracking] = useState(false)
  return (
    <section className="panel">
      <h2>Order Status</h2>
      <ol className="stepper">
        {order.steps.map((s, i) => (
          <li key={s.label} className={`step step-${s.state}`}>
            <span className="step-dot">
              {s.state === 'done' && <CheckIcon size={14} />}
              {s.state === 'current' && <TruckIcon size={13} />}
            </span>
            {i < order.steps.length - 1 && <span className={`step-line line-${s.state}`} />}
            <span className="step-label">{s.label}</span>
            {s.date && <span className="step-date">{s.date}</span>}
          </li>
        ))}
      </ol>
      <button className="btn btn-soft btn-sm" onClick={() => setShowTracking((v) => !v)} aria-expanded={showTracking}>
        <PinIcon size={14} /> Tracking details
      </button>
      {showTracking && (
        <ul className="tracking-list">
          <li>
            <strong>Today 08:12</strong> Out for delivery · Los Angeles, CA
          </li>
          <li>
            <strong>Yesterday 21:40</strong> Arrived at local facility
          </li>
          <li>
            <strong>May 29 10:05</strong> Shipped from warehouse
          </li>
        </ul>
      )}
    </section>
  )
}

export function RatingCard({ notify }: { notify: Notify }) {
  const [rating, setRating] = useState(0)
  return (
    <section className="panel rating-card">
      <h2>How was your order?</h2>
      <div className="stars" role="radiogroup" aria-label="Rate your order">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star`}
            onClick={() => {
              setRating(n)
              notify('Thanks for your feedback!')
            }}
          >
            <StarIcon size={28} filled={n <= rating} />
          </button>
        ))}
      </div>
    </section>
  )
}

export function ReturnsSection({ notify }: { notify: Notify }) {
  return (
    <section className="panel">
      <h2>Return/Refunds</h2>
      <ul className="rows">
        {order.returns.map((r) => (
          <li key={r.id} className="row">
            <img className="thumb" src={r.avatar} alt="" />
            <div className="row-main">
              <strong>
                {r.id} ({r.items} item)
              </strong>
              <span className="muted">Submitted at {r.submitted}</span>
            </div>
            <span className={`badge badge-${r.tone}`}>{r.status}</span>
            <button className="btn btn-outline" onClick={() => notify(`Opening ${r.id} details…`)}>
              Details
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ReturnMenu({ itemName, notify }: { itemName: string; notify: Notify }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const go = (flow: string) => {
    setOpen(false)
    notify(`${flow} flow opened for "${itemName}" (simulated). Ocean Points are not affected.`)
  }

  return (
    <div className="menu-wrap" ref={ref}>
      <button className="btn btn-outline" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Return / Refund <ChevronDown size={14} />
      </button>
      {open && (
        <div className="menu" role="menu">
          <button role="menuitem" onClick={() => go('Return')}>
            Return item
          </button>
          <button role="menuitem" onClick={() => go('Refund')}>
            Request refund
          </button>
          <button role="menuitem" onClick={() => go('Claim')}>
            Item damaged / file a claim
          </button>
        </div>
      )}
    </div>
  )
}

export function ItemsSection({ notify }: { notify: Notify }) {
  return (
    <section className="panel">
      <h2>Items</h2>
      <ul className="rows">
        {order.items.map((it) => (
          <li key={it.id} className="row">
            <img className="thumb" src={it.image} alt="" />
            <div className="row-main">
              <strong>{it.name}</strong>
              <span className="muted">{it.price}</span>
              <span className="muted">{it.variant}</span>
            </div>
            <div className="row-actions">
              <button className="btn btn-soft" onClick={() => notify(`"${it.name}" added to cart (simulated).`)}>
                <RefreshIcon size={14} /> Buy It Again
              </button>
              <ReturnMenu itemName={it.name} notify={notify} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
