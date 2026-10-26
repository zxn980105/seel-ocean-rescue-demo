// All copy, points, rewards and partner products for the prototype live here.
// Nothing in this file talks to Shopify, payments, donations or discount APIs.

export const campaign = {
  id: 'ocean_rescue_mvp_v0',
  title: 'Seel',
  titleAccent: 'Ocean Rescue',
  slogan: 'Every order supports ocean protection.',
  // Fallback copy when per-order donation cannot be verified yet (see MVP doc §3.4).
  softSlogan: 'Join Seel in protecting our oceans.',
  partnerNote: 'With our nonprofit partners.',
  partnerTooltip:
    'Seel works with nonprofit ocean partners. Partner names, donation method and campaign period are published in the campaign rules before launch.',
  cta: 'Cast your net',
  footerNote: 'Virtual rewards. Order donations support ocean protection.',
  pointsLabel: 'Ocean Points',
}

export const account = {
  initialPoints: 1180,
}

export const pointsHistory = [
  { id: 'h1', label: 'Order #1098 · paid', delta: 180, date: 'Aug 22, 2024' },
  { id: 'h2', label: 'Order #1061 · paid', delta: 420, date: 'Jun 03, 2024' },
  { id: 'h3', label: 'Order #1024 · paid', delta: 640, date: 'Feb 17, 2024' },
  {
    id: 'h4',
    label: 'Order #1024 · partial refund (1 item)',
    delta: -60,
    date: 'Mar 02, 2024',
  },
]

export const pointsRules = [
  'Points are earned after an order is paid. The server ledger is the source of truth.',
  'Cancelled or refunded items adjust the points earned from that order (partial refunds pro-rata).',
  'Starting or submitting a claim never deducts points. Repairs, replacements and delivery protection do not affect points.',
  'Rewards are fixed and disclosed up front. There is no random draw.',
]

export type RewardKind = 'coupon' | 'fixed_box' | 'partner_deal'

export interface Reward {
  id: string
  kind: RewardKind
  title: string
  subtitle: string
  image: string
  cost: number
  /** What the user actually receives — always disclosed before redeeming. */
  details: string
  codePrefix: string
}

export const rewards: Reward[] = [
  {
    id: 'bottle_5_off',
    kind: 'coupon',
    title: '$5 off',
    subtitle: 'Use on your next purchase',
    image: 'assets/reward-bottle.png',
    cost: 1200,
    details: '$5 off your next order of $30+ at this store. Valid for 30 days.',
    codePrefix: 'OCEAN5',
  },
  {
    id: 'mystery_box',
    kind: 'fixed_box',
    title: 'Mystery reward',
    subtitle: 'Surprise reward from Seel',
    image: 'assets/reward-mystery.png',
    cost: 2000,
    details:
      'Fixed reward, same for everyone: free express shipping + $8 off your next order. No random draw.',
    codePrefix: 'SEELBOX',
  },
  {
    id: 'partner_deal',
    kind: 'partner_deal',
    title: 'Partner deal',
    subtitle: 'Exclusive offers from brands',
    image: 'assets/reward-partner.png',
    cost: 800,
    details: '15% off one item at a participating partner store. Valid for 14 days.',
    codePrefix: 'PARTNER15',
  },
]

export interface PartnerProduct {
  id: string
  merchantId: string
  brand: string
  title: string
  price: string
  pointsFrom: number
  image: string
  url: string
}

export const partnerProducts: PartnerProduct[] = [
  {
    id: 'coach_tabby_26',
    merchantId: 'coach',
    brand: 'Coach',
    title: 'Tabby Shoulder Bag 26',
    price: '$395.00 USD',
    pointsFrom: 800,
    image: 'assets/product-bag.png',
    url: 'https://example.com/partners/coach/tabby-shoulder-bag-26',
  },
  {
    id: 'nb_530',
    merchantId: 'new_balance',
    brand: 'New Balance',
    title: '530 Sneakers',
    price: '$100.00 USD',
    pointsFrom: 800,
    image: 'assets/product-sneakers.png',
    url: 'https://example.com/partners/new-balance/530',
  },
  {
    id: 'apple_airpods_max',
    merchantId: 'apple',
    brand: 'Apple',
    title: 'AirPods Max',
    price: '$549.00 USD',
    pointsFrom: 800,
    image: 'assets/product-headphones.png',
    url: 'https://example.com/partners/apple/airpods-max',
  },
]

export const partnerStoresUrl = 'https://example.com/partners/ocean-rescue'

export const order = {
  id: '1098',
  date: 'Aug 22, 2024',
  pointsEarned: 180,
  steps: [
    { label: 'Purchased', date: 'May 28, 2023', state: 'done' as const },
    { label: 'On the way', date: '', state: 'current' as const },
    { label: 'Delivered', date: 'Today', state: 'todo' as const },
  ],
  returns: [
    {
      id: 'RMA#12345678',
      items: 1,
      submitted: 'Nov 28, 2022 11:30',
      status: 'Starting',
      tone: 'yellow' as const,
      avatar: 'assets/avatar-1.png',
    },
    {
      id: 'RMA#89234875',
      items: 1,
      submitted: 'Nov 28, 2022 11:30',
      status: 'Requested',
      tone: 'blue' as const,
      avatar: 'assets/avatar-2.png',
    },
  ],
  items: [
    {
      id: 'shirt',
      name: 'Love Long-Sleeve Shirt',
      price: '$58.00 USD',
      variant: 'M / Ivory',
      image: 'assets/item-shirt.png',
    },
    {
      id: 'bag',
      name: 'Luna Shoulder Bag',
      price: '$128.00 USD',
      variant: 'Black',
      image: 'assets/item-bag.png',
    },
    {
      id: 'headphones',
      name: 'Noise Canceling Headphones',
      price: '$199.00 USD',
      variant: 'Sand',
      image: 'assets/item-headphones.png',
    },
  ],
}

export const supportTopics = [
  'Where is my order?',
  'How do I return this item?',
  'My item arrived damaged',
  'How do I request a refund?',
  'I have a different question',
]

export const supportReplies: Record<string, string> = {
  'Where is my order?':
    'Your order #1098 is on the way. You can open "Tracking details" for the latest carrier scan.',
  'How do I return this item?':
    'Use the "Return / Refund" button next to the item. You can choose return or refund in the next step.',
  'My item arrived damaged':
    'Sorry about that! Choose "Return / Refund" → "Damaged item" and attach a photo. Filing a claim never affects your Ocean Points.',
  'How do I request a refund?':
    'Open "Return / Refund" next to the item and pick "Refund". Refunds go back to your original payment method.',
  'I have a different question': 'Sure — type your question below and a support agent will help.',
}
