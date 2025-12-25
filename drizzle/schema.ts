import { pgTable, text, timestamp, boolean, integer, jsonb, real, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),

  subscriptionTier: text('subscription_tier', { enum: ['Pro'] }),
  subscriptionStatus: text('subscription_status', { enum: ['active', 'canceled', 'expired', 'past_due'] }),
  lemonSqueezyCustomerId: text('lemon_squeezy_customer_id'),
  lemonSqueezySubscriptionId: text('lemon_squeezy_subscription_id'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  creditsRemaining: integer('credits_remaining'),

  homeBase: text('home_base'),
  preferences: jsonb('preferences'),
  hasCompletedOnboarding: boolean('has_completed_onboarding').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  deletedAt: timestamp('deleted_at'),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  deletedAt: timestamp('deleted_at'),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  deletedAt: timestamp('deleted_at'),
});

export const location = pgTable('location', {
  id: serial('id').primaryKey(),

  name: text('name').notNull(),
  type: text('type', { enum: ['standard', 'hidden_gem'] }).notNull(),
  category: text('category').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  typicalVisitDuration: integer('typical_visit_duration').notNull(),
  description: text('description'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const plan = pgTable('plan', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  destination: text('destination').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  maxDailyHours: integer('max_daily_hours').notNull(),
  breakfastDuration: integer('breakfast_duration').default(60).notNull(),
  lunchDuration: integer('lunch_duration').default(90).notNull(),
  dinnerDuration: integer('dinner_duration').default(120).notNull(),
  status: text('status', { enum: ['draft', 'upcoming', 'active', 'completed'] }).default('draft').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const planActivity = pgTable('plan_activity', {
  id: serial('id').primaryKey(),
  planId: integer('plan_id')
    .notNull()
    .references(() => plan.id, { onDelete: 'cascade' }),
  locationId: integer('location_id')
    .references(() => location.id, { onDelete: 'set null' }),

  dayNumber: integer('day_number').notNull(),
  orderInDay: integer('order_in_day').notNull(),
  locationName: text('location_name').notNull(),
  visitDuration: integer('visit_duration').notNull(),
  transitDuration: integer('transit_duration').default(0).notNull(),
  category: text('category').notNull(),
  notes: text('notes'),
  priority: integer('priority').default(5).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const userRelations = relations(user, ({ many }) => ({
  plans: many(plan),
}));

export const planRelations = relations(plan, ({ one, many }) => ({
  user: one(user, {
    fields: [plan.userId],
    references: [user.id],
  }),
  activities: many(planActivity),
}));

export const planActivityRelations = relations(planActivity, ({ one }) => ({
  plan: one(plan, {
    fields: [planActivity.planId],
    references: [plan.id],
  }),
  location: one(location, {
    fields: [planActivity.locationId],
    references: [location.id],
  }),
}));
