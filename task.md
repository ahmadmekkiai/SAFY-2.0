# SAFY Project - Master Implementation Plan (Next.js 14 + Supabase)



**ROLE:** Senior Full Stack Engineer & UI/UX Expert.

**GOAL:** Build a PWA with a specific "Gold Coin" branding, Points System, and Smart Browser.

**RULE:** Execute ONE task at a time. Verify completion before moving to the next.



## Phase 1: Project Setup

- [ ] **Task 1.1: Initialization**

&nbsp;   - Action: Create a Next.js 14+ app with TypeScript, Tailwind, and App Router.

&nbsp;   - PWA: Configure `@ducanh2912/next-pwa`.

&nbsp;   - UI: Init shadcn/ui and install `framer-motion`.



## Phase 2: Branding & Splash Screen

- [x] **Task 2.1: Assets Setup**

&nbsp;   - Action: Organize `logo.png` and `logo-text.png` in `/public`.

- [x] **Task 2.2: Golden Splash Animation**

&nbsp;   - Action: Create `components/SplashScreen.tsx` with toggle-to-coin morph animation.

&nbsp;   - Visual: Blue rounded square icon, SAFY text with glowing F, slogan below.

&nbsp;   - Interactive: Toggles become clickable after animation completes.



## Phase 3: Core UI & Navigation

- [x] **Task 3.1: Bottom Navigation**

&nbsp;   - Tabs: For You, Suggested, Hot Deals, Tasks, Wallet, Profile.



## Phase 4: Authentication & User Management

- [x] **Task 4.1: Database Schema**

&nbsp;   - Tables: profiles (id, email, full_name, interests, points).

- [x] **Task 4.2: Auth Flow**

&nbsp;   - Supabase Auth with custom UI matching SAFY branding.

- [x] **Task 4.3: Profile Tab**

&nbsp;   - Display user info, points balance, interests, account settings, and logout.

- [x] **Task 4.4: Deep Interest Taxonomy**

&nbsp;   - Hierarchical categories (Electronics > Mobiles > Smartphones).

&nbsp;   - Parent selection support with indeterminate states.

&nbsp;   - Search functionality with breadcrumb paths.



## Phase 5: Smart Browser & Rewards

- [x] **Task 5.1: Points System Server Actions**

&nbsp;   - Logic: 1 SAR = 200 Points. Server actions for add/get/deduct points.

- [x] **Task 5.2: Real-time Wallet & Animations**

&nbsp;   - WalletTab fetches actual balance. Gold coin animation on points added.



## Phase 6: Scrapers & Agents

- [x] **Task 6.1: Mock Fetching Engine**

&nbsp;   - 20 realistic products from 5 sources (Clickflyer, Pricena, Jarir, Noon, Amazon KSA).

&nbsp;   - Products mapped to taxonomy categories for interest-based filtering.

- [x] **Task 6.2: Reward Calculation**

&nbsp;   - Formula: 1 SAR discount = 200 Points.

&nbsp;   - Automatic calculation for all deals.

- [x] **Task 6.3: For You Tab with Personalized Ads**

&nbsp;   - Glassmorphism ad cards with product image, prices, discount badges.

&nbsp;   - Reward points display with gold background.

&nbsp;   - "Watch Ad to Earn" button on each card.

&nbsp;   - Interest-based filtering and sorting by reward points.

- [x] **Task 6.4: UI Polish**

&nbsp;   - Source badges (color-coded), featured badges, hover effects.

&nbsp;   - Empty state with "Add Interests" prompt.

&nbsp;   - Responsive grid layout (1 col mobile, 2 col desktop).



## Phase 7: Smart Browser (The Shield)

- [ ] **Task 7.1: Ad Viewing Screen**

&nbsp;   - Full-screen ad display with 30s countdown timer.

&nbsp;   - Pause on blur, verify attention.

- [ ] **Task 7.2: Reward Distribution**

&nbsp;   - Automatic points addition after ad completion.

&nbsp;   - Gold coin animation on reward.



## Phase 8: Production & Deployment

- [ ] **Task 8.1: PWA Configuration**

&nbsp;   - Service worker, manifest, offline support.

- [ ] **Task 8.2: Performance Optimization**

&nbsp;   - Image optimization, code splitting, caching.

- [ ] **Task 8.3: Deployment**

&nbsp;   - Deploy to Vercel with Supabase integration.
