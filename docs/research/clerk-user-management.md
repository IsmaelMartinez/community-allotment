# Research: Clerk User Management Integration

## Status
Research / Under Consideration

## Date
2025-01-18

## Overview

This document explores adding optional user authentication to the Community Allotment application using Clerk's free tier, combined with Supabase as the database for persistent storage. The goal is to enable users to persist garden plans across devices while maintaining the current free-to-use experience for anonymous visitors.

**Related Document**: See `supabase-database.md` for detailed Supabase research and schema design.

---

## Current Architecture

### How Data is Stored Today

| Feature | Storage Method | Key | Persistence |
|---------|---------------|-----|-------------|
| Garden Beds | `localStorage` | `garden-beds-2025` | Until browser data cleared |
| AI Chat History | React state | N/A | Until page refresh |
| API Tokens | `sessionStorage` | `aitor_api_token` | Until tab closed |

**Key Insight**: The application currently has no server-side data persistence. All user data lives in the browser, following the no-database architecture decision (ADR-004). This ADR will need to be superseded.

### Pages and Their Data Needs

| Page | Route | Stores User Data | Type of Data |
|------|-------|------------------|--------------|
| Home | `/` | No | - |
| Garden Planner | `/garden-planner` | Yes | Grid plots, plant cells, bed configurations |
| AI Advisor | `/ai-advisor` | Session only | Chat messages, API token |
| Companion Planting | `/companion-planting` | No | Static educational content |
| Composting | `/composting` | No | Static educational content |
| Crop Rotation | `/crop-rotation` | No | Static educational content |

---

## Proposed Architecture: Clerk + Supabase

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js App)                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐ │
│  │ localStorage│    │   Clerk     │    │     Supabase Client     │ │
│  │  (fallback) │    │  (auth UI)  │    │    (data operations)    │ │
│  └─────────────┘    └──────┬──────┘    └────────────┬────────────┘ │
└────────────────────────────┼───────────────────────┼───────────────┘
                             │                       │
                             ▼                       ▼
                    ┌────────────────┐      ┌────────────────┐
                    │     CLERK      │      │    SUPABASE    │
                    │   (Auth SaaS)  │      │  (PostgreSQL)  │
                    ├────────────────┤      ├────────────────┤
                    │ • User accounts│      │ • Garden beds  │
                    │ • Sessions     │      │ • Plot cells   │
                    │ • Social login │      │ • Chat history │
                    │ • User profile │      │ • User prefs   │
                    └────────────────┘      └────────────────┘
```

### Responsibility Split

| Service | Responsibility | Why |
|---------|---------------|-----|
| **Clerk** | Authentication, user identity, session management | Best-in-class auth UX, pre-built components, social login |
| **Supabase** | Data storage, queries, real-time sync | PostgreSQL power, RLS security, generous free tier |
| **localStorage** | Offline fallback, anonymous users | Maintain current UX for non-authenticated users |

### How They Connect

1. User authenticates via Clerk
2. Clerk provides a unique `user_id` (e.g., `user_2abc123xyz`)
3. Supabase tables use `clerk_user_id` as foreign key
4. Supabase Row Level Security (RLS) ensures users only see their own data
5. Clerk JWT can be verified by Supabase for secure API calls

---

## Clerk Free Tier Analysis

### What's Included

**User Limits**
- 10,000 Monthly Active Users (MAUs)
- Users who sign up but never return don't count toward limit
- MAU = user who authenticates at least once in a 30-day period

**Authentication Features**
- Email/password authentication with breach detection
- Social login: Google, GitHub, Facebook, Apple, Microsoft, and 15+ others
- Email and SMS verification
- Pre-built UI components (SignIn, SignUp, UserProfile, UserButton)
- Customizable appearance (colors, fonts, branding)
- Custom domain support

**Organization Features**
- 100 Monthly Active Organizations
- Up to 5 members per organization
- Basic roles (admin, member)

**Security**
- Bot and abuse protection
- Password breach detection
- Session management

**Developer Experience**
- SDKs for Next.js, React, and many other frameworks
- Webhooks for user events
- User metadata storage (publicMetadata, privateMetadata)

### What's NOT Included (Requires Pro Plan at $25/month)

- Multi-factor authentication (MFA/2FA)
- Custom session duration (free tier fixed at 7 days)
- Remove Clerk branding ("Secured by Clerk" badge)
- Custom roles and permissions
- Device tracking and management
- Advanced organization features (unlimited members)
- SAML/SSO enterprise connections
- Audit logs

### Pricing Considerations

| Tier | Cost | MAUs | Key Differences |
|------|------|------|-----------------|
| Free | $0 | 10,000 | Basic features, Clerk branding, 7-day sessions |
| Pro | $25/mo + $0.02/MAU after 10k | 10,000+ | MFA, custom sessions, no branding, advanced roles |
| Enterprise | Custom | Unlimited | SSO, SAML, dedicated support, SLAs |

---

## Supabase Free Tier Summary

> **Note**: See `supabase-database.md` for complete Supabase research

### Key Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| Database size | 500 MB |
| Storage | 1 GB |
| Bandwidth | 5 GB/month |
| API requests | Unlimited |
| Concurrent connections | 60 |
| Projects | 2 active |

### Why Supabase for Data Storage

- **PostgreSQL**: Full relational database with proper queries
- **Row Level Security**: Users can only access their own data
- **Real-time subscriptions**: Optional live sync across devices
- **Generous free tier**: 500MB is substantial for garden data
- **Open source**: Can self-host if needed in future
- **Supabase Studio**: Visual database management

---

## Technical Integration Points

### Required Packages

```
@clerk/nextjs          # Clerk authentication for Next.js
@supabase/supabase-js  # Supabase client library
```

### Environment Variables Needed

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/garden-planner
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/garden-planner

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx  # Server-side only
```

### Files That Would Need Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/app/layout.tsx` | Modify | Wrap with ClerkProvider |
| `src/components/Navigation.tsx` | Modify | Add UserButton or sign-in link |
| `src/app/garden-planner/page.tsx` | Modify | Use auth-aware storage with Supabase |
| `src/lib/garden-storage.ts` | Major rewrite | Add Supabase operations, keep localStorage fallback |
| `src/lib/supabase.ts` | New | Supabase client initialization |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | New | Clerk sign-in page |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | New | Clerk sign-up page |
| `src/middleware.ts` | New | Clerk middleware for auth state |
| `src/app/api/webhooks/clerk/route.ts` | New (optional) | Sync Clerk users to Supabase |
| `package.json` | Modify | Add dependencies |

### Suggested Supabase Schema

```sql
-- Users table (synced from Clerk via webhook or on-demand)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garden beds
CREATE TABLE garden_beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grid_rows INTEGER DEFAULT 4,
  grid_cols INTEGER DEFAULT 4,
  width NUMERIC DEFAULT 2,
  length NUMERIC DEFAULT 4,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plot cells within beds
CREATE TABLE plot_cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_id UUID REFERENCES garden_beds(id) ON DELETE CASCADE,
  row_index INTEGER NOT NULL,
  col_index INTEGER NOT NULL,
  vegetable_id TEXT,  -- References local vegetable database
  planted_year INTEGER,
  UNIQUE(bed_id, row_index, col_index)
);

-- Row Level Security
ALTER TABLE garden_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE plot_cells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own beds"
  ON garden_beds FOR ALL
  USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.uid()));
```

---

## User Experience Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ANONYMOUS USER                          │
├─────────────────────────────────────────────────────────────────┤
│  • Full access to all features                                  │
│  • Garden data saved in localStorage                            │
│  • Data lost if browser cleared or different device             │
│  • Subtle prompt: "Sign in to save across devices"              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (User chooses to sign up)
┌─────────────────────────────────────────────────────────────────┐
│                      SIGN UP / SIGN IN                          │
├─────────────────────────────────────────────────────────────────┤
│  • Email/password or social login (Google, GitHub, etc.)        │
│  • Clerk handles entire auth flow                               │
│  • User record created/synced to Supabase                       │
│  • If existing localStorage data found:                         │
│    → Prompt: "Import your existing garden?"                     │
│    → Migrate data to Supabase                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATED USER                         │
├─────────────────────────────────────────────────────────────────┤
│  • Garden data stored in Supabase (PostgreSQL)                  │
│  • Accessible from any device                                   │
│  • localStorage used as cache for faster loads                  │
│  • UserButton in navigation for profile/logout                  │
│  • Optional: Real-time sync across browser tabs                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pros and Cons Summary

### Advantages

| Benefit | Impact | Notes |
|---------|--------|-------|
| Cross-device sync | High | Users can access gardens from phone, tablet, desktop |
| Data durability | High | PostgreSQL storage, backed up by Supabase |
| Unlimited data growth | High | 500MB far exceeds any garden plan needs |
| Complex queries | Medium | Can add analytics, search, filtering later |
| Social login | Medium | Reduces friction for sign-up |
| Professional UX | Medium | Pre-built, polished authentication UI |
| Both free tiers generous | High | 10k users (Clerk) + 500MB (Supabase) |
| Security built-in | High | Clerk breach detection + Supabase RLS |
| Future flexibility | High | Can add sharing, collaboration features |
| Open source option | Medium | Supabase can be self-hosted if needed |

### Disadvantages and Risks

| Concern | Severity | Mitigation |
|---------|----------|------------|
| Two external services | Medium | Both have strong uptime; localStorage offline fallback |
| Vendor lock-in (Clerk) | Medium | Keep localStorage fallback; Clerk is auth-only |
| 7-day session expiry | Low | Acceptable UX for free tier; upgrade path exists |
| Clerk branding | Low | Small badge; acceptable for free tier |
| Supabase connection limits | Low | 60 concurrent is plenty for this app |
| No MFA | Low | Acceptable for gardening app; not handling sensitive data |
| Added complexity | Medium | Clean abstraction layers for auth and storage |
| ADR-004 violation | Low | Document decision to supersede no-database ADR |
| Privacy concerns | Medium | Document clearly; make auth optional; GDPR considerations |
| Sync complexity | Medium | Design clear conflict resolution strategy |

---

## Clerk-Supabase Integration Patterns

### Pattern 1: Clerk Webhook to Sync Users

```
User signs up in Clerk
        │
        ▼
Clerk sends webhook to /api/webhooks/clerk
        │
        ▼
API route creates/updates user in Supabase
        │
        ▼
User record ready with clerk_user_id
```

**Pros**: Automatic sync, reliable
**Cons**: Requires webhook endpoint, slight delay

### Pattern 2: On-Demand User Creation

```
User signs in via Clerk
        │
        ▼
App checks if user exists in Supabase
        │
        ▼
If not, create user record
        │
        ▼
Proceed with data operations
```

**Pros**: Simpler, no webhook needed
**Cons**: Requires check on every authenticated request

### Pattern 3: Clerk JWT in Supabase RLS

```
Clerk issues JWT with user_id
        │
        ▼
Supabase client sends JWT with requests
        │
        ▼
Supabase RLS policies use JWT claims
        │
        ▼
Data automatically scoped to user
```

**Pros**: Most secure, database-level enforcement
**Cons**: More complex setup, requires JWT verification

**Recommendation**: Start with Pattern 2 (simpler), consider Pattern 1 or 3 as needed.

---

## Questions to Resolve Before Implementation

1. **Privacy Policy**: Do we need to update privacy policy for user data collection?

2. **Data Ownership**: How do users export their data? (Supabase can generate exports)

3. **Existing Users**: How do we communicate the new feature to existing localStorage users?

4. **AI Chat History**: Should chat history also be persisted in Supabase?

5. **API Token Storage**: Should user's OpenAI tokens be stored securely in Supabase?

6. **Offline Experience**: How should the app behave when signed in but offline?

7. **Account Deletion**: What's the flow when a user deletes their account? (GDPR)

8. **Sync Conflicts**: What happens if user edits garden on two devices simultaneously?

9. **Webhook Security**: How do we verify Clerk webhooks are authentic?

10. **Migration Testing**: How do we test localStorage → Supabase migration thoroughly?

---

## Estimated Effort

| Task | Effort | Dependencies |
|------|--------|--------------|
| Clerk account setup and configuration | 1 hour | None |
| Supabase project and schema setup | 2 hours | None |
| Basic Clerk integration (ClerkProvider, sign-in pages) | 2-3 hours | Clerk account |
| Navigation integration (UserButton) | 1 hour | Clerk integration |
| Supabase client setup and types | 2 hours | Supabase project |
| Storage abstraction layer (auth-aware) | 4-5 hours | Clerk + Supabase |
| Garden planner Supabase integration | 3-4 hours | Storage layer |
| Migration flow (localStorage → Supabase) | 3-4 hours | Planner integration |
| Offline fallback and sync logic | 3-4 hours | All storage work |
| User-to-Supabase sync (webhook or on-demand) | 2-3 hours | Both services |
| Testing both user flows | 3-4 hours | All above |
| Documentation and ADR updates | 2 hours | All above |

**Total Estimate**: 28-38 hours of development work

---

## ADR Impact

This implementation would require:

1. **Supersede ADR-004** (No Database Architecture)
   - New ADR: "Supabase Database for User Data"
   - Rationale: User demand for cross-device sync, data durability

2. **Update ADR-002** (Data Persistence Strategy)
   - Add Supabase as primary storage for authenticated users
   - Keep localStorage as fallback/cache strategy

---

## References

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Pricing](https://clerk.com/pricing)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Pricing](https://supabase.com/pricing)
- [Clerk + Supabase Integration Guide](https://clerk.com/docs/integrations/databases/supabase)
- [ADR-004: No Database Architecture](../adrs/004-no-database-architecture.md)
- [ADR-002: Data Persistence Strategy](../adrs/002-data-persistence-strategy.md)

---

## Decision

**Pending** - This document is for research and discussion purposes. A decision to proceed should consider:

1. User demand for cross-device sync
2. Available development time (~30-40 hours)
3. Willingness to add two external dependencies
4. Privacy and data handling implications (GDPR)
5. Ongoing maintenance of integration

**Recommendation**: Proceed with Clerk + Supabase architecture. Both services offer generous free tiers that align with the community project nature of this application. The separation of concerns (Clerk for auth, Supabase for data) provides flexibility and best-in-class solutions for each domain.
