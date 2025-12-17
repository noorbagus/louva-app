export const SERVICE_CATEGORIES = {
  HAIR: 'Hair',
  TREATMENT: 'Treatment',
  NAIL: 'Nail Care'
} as const

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Tunai', icon: '💵' },
  { id: 'debit', name: 'Debit/Kredit', icon: '💳' },
  { id: 'gopay', name: 'GoPay', icon: '📱' },
  { id: 'ovo', name: 'OVO', icon: '📱' },
  { id: 'dana', name: 'Dana', icon: '📱' },
  { id: 'shopeepay', name: 'ShopeePay', icon: '📱' },
  { id: 'transfer', name: 'Transfer Bank', icon: '🏦' },
  { id: 'voucher', name: 'Voucher', icon: '🎫' }
] as const

export const MEMBERSHIP_LEVELS = {
  BRONZE: {
    name: 'Bronze',
    minPoints: 0,
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/20',
    borderColor: 'border-amber-600/30',
    benefits: ['1 poin per Rp 1.000', 'Birthday reward', 'Member pricing']
  },
  SILVER: {
    name: 'Silver',
    minPoints: 500,
    color: 'text-gray-300',
    bgColor: 'bg-gray-300/20',
    borderColor: 'border-gray-300/30',
    benefits: ['1.2 poin per Rp 1.000', 'Birthday reward', 'Member pricing', 'Free consultation']
  },
  GOLD: {
    name: 'Gold',
    minPoints: 1000,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400/30',
    benefits: ['1.5 poin per Rp 1.000', 'Birthday reward', 'Member pricing', 'Free consultation', 'Priority booking']
  }
} as const

export const DEFAULT_SERVICES = [
  {
    name: 'Haircut',
    category: SERVICE_CATEGORIES.HAIR,
    price: 50000,
    pointMultiplier: 1,
    description: 'Potongan rambut basic dengan styling'
  },
  {
    name: 'Hair Color',
    category: SERVICE_CATEGORIES.HAIR,
    price: 150000,
    pointMultiplier: 1.2,
    description: 'Pewarnaan rambut dengan produk premium'
  },
  {
    name: 'Hair Treatment',
    category: SERVICE_CATEGORIES.HAIR,
    price: 100000,
    pointMultiplier: 1.1,
    description: 'Perawatan rambut deep conditioning'
  },
  {
    name: 'Facial',
    category: SERVICE_CATEGORIES.TREATMENT,
    price: 80000,
    pointMultiplier: 1,
    description: 'Perawatan wajah dasar'
  },
  {
    name: 'Massage',
    category: SERVICE_CATEGORIES.TREATMENT,
    price: 120000,
    pointMultiplier: 1.1,
    description: 'Pijat relaksasi full body'
  },
  {
    name: 'Manicure',
    category: SERVICE_CATEGORIES.NAIL,
    price: 60000,
    pointMultiplier: 1,
    description: 'Perawatan kuku tangan basic'
  },
  {
    name: 'Pedicure',
    category: SERVICE_CATEGORIES.NAIL,
    price: 60000,
    pointMultiplier: 1,
    description: 'Perawatan kaki kaki basic'
  },
  {
    name: 'Nail Art',
    category: SERVICE_CATEGORIES.NAIL,
    price: 100000,
    pointMultiplier: 1.2,
    description: 'Seni kuku dengan desain custom'
  }
] as const

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
} as const