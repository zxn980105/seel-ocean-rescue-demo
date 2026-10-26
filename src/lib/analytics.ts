import { campaign } from '../config/mock'

export type EventName =
  | 'rc_page_view'
  | 'ocean_card_impression'
  | 'ocean_card_click'
  | 'ocean_modal_view'
  | 'ocean_modal_close'
  | 'reward_view'
  | 'reward_select'
  | 'reward_redeem'
  | 'partner_product_impression'
  | 'partner_product_click'
  | 'outbound_store_click'
  | 'points_history_view'

export interface TrackedEvent {
  event_id: string
  event: EventName
  event_time: string
  props: Record<string, unknown>
}

type Listener = (events: TrackedEvent[]) => void

const sessionId = `s_${Math.random().toString(36).slice(2, 10)}`
let variant = 'B'
let events: TrackedEvent[] = []
const listeners = new Set<Listener>()

// Only hashed / anonymous identifiers — never plain order numbers, emails or full codes.
const common = () => ({
  merchant_id: 'demo_merchant',
  order_id_hash: 'h_7f3a91',
  anonymous_customer_id: 'anon_42',
  session_id: sessionId,
  experiment_id: 'ocean_rescue_ab_1',
  variant,
  market: 'US',
  locale: 'en-US',
  device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
  campaign_id: campaign.id,
})

export function setVariant(v: string) {
  variant = v
}

export function track(event: EventName, props: Record<string, unknown> = {}) {
  const entry: TrackedEvent = {
    event_id: crypto.randomUUID(),
    event,
    event_time: new Date().toISOString(),
    props: { ...common(), ...props },
  }
  events = [entry, ...events].slice(0, 100)
  console.info('[track]', event, entry.props)
  listeners.forEach((l) => l(events))
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  listener(events)
  return () => {
    listeners.delete(listener)
  }
}

export function clearEvents() {
  events = []
  listeners.forEach((l) => l(events))
}

export function outboundUrl(base: string, params: Record<string, string>) {
  const url = new URL(base)
  url.searchParams.set('utm_source', 'seel')
  url.searchParams.set('utm_medium', 'resolution_center')
  url.searchParams.set('utm_campaign', campaign.id)
  url.searchParams.set('seel_session', sessionId)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return url.toString()
}
