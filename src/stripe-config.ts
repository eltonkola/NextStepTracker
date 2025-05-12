export const STRIPE_PRODUCTS = {
  DONATION_5: {
    priceId: 'price_1RNl2O7869GA2BKcRdVcpieo',
    name: 'Small Thanks',
    description: 'A token of appreciation for the app. Every bit helps!',
    mode: 'payment' as const,
  },
  DONATION_10: {
    priceId: 'price_1RNl2j7869GA2BKctfOJhzn6',
    name: 'Big Thanks',
    description: 'Thanks for making job tracking easier and helping with ongoing development.',
    mode: 'payment' as const,
  },
  DONATION_25: {
    priceId: 'price_1RNl307869GA2BKcBlQAxuOZ',
    name: 'Huge Thanks',
    description: 'Wow! Your generosity helps fund new features and improvements.',
    mode: 'payment' as const,
  },
} as const;