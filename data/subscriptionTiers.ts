export type TierNames = keyof typeof subscriptionTiers;
export type PaidTierNames = Exclude<TierNames, 'Free'>;

export const subscriptionTiers = {
  Free: {
    name: 'Free',
    priceInCents: 0,
    priceMonthly: 0,
    priceAnnual: 0,
    maxNumberOfShoppingLists: 1,
    maxNumberOfItemsPerShoppingList: 15,
    canAccessAnalytics: false,
  },
  Pro: {
    name: 'Pro',
    priceInCents: 500,
    priceMonthly: 5,
    priceAnnual: 50,
    maxNumberOfShoppingLists: 10000,
    maxNumberOfItemsPerShoppingList: 1000000,
    canAccessAnalytics: true,
  },
} as const;

export const subscriptionTiersInOrder = [subscriptionTiers.Free, subscriptionTiers.Pro] as const;
