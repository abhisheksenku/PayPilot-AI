/**
 * PayPilot AI Global Configuration
 * 
 * NEXT_PUBLIC_ENABLE_SEED_DATA:
 * - 'true' (default): displays pre-seeded visual blueprint data alongside live records.
 * - 'false': enforces 100% PURE LIVE MODE — zero mock or seed data; only records genuinely
 *            created in MySQL via PayPal Sandbox and Channel3 are displayed.
 */
export const ENABLE_SEED_DATA =
  process.env.NEXT_PUBLIC_ENABLE_SEED_DATA !== 'false';
