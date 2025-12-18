# Research: Clerk User Management Integration

## Status
Research / Under Consideration

## Date
2025-01-18

## Overview

This document explores adding optional user authentication to the Community Allotment application using Clerk's free tier. The goal is to enable users to persist garden plans across devices while maintaining the current free-to-use experience for anonymous visitors.

---

## Current Architecture

### How Data is Stored Today

| Feature | Storage Method | Key | Persistence |
|---------|---------------|-----|-------------|
| Garden Beds | `localStorage` | `garden-beds-2025` | Until browser data cleared |
| AI Chat History | React state | N/A | Until page refresh |
| API Tokens | `sessionStorage` | `aitor_api_token` | Until tab closed |

**Key Insight**: The application currently has no server-side data persistence. All user data lives in the browser, following the no-database architecture decision (ADR-004).

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

## Data Storage Strategy Options

### Option A: Clerk User Metadata

**How it works**: Clerk provides `publicMetadata` and `privateMetadata` fields on each user object that can store arbitrary JSON data.

```
User Object
├── id: "user_xxx"
├── emailAddresses: [...]
├── publicMetadata: { } ← Visible to client
└── privateMetadata: { } ← Server-only access
```

**Considerations**:
- Size limit: ~1MB per user (unofficial but practical limit)
- Current garden data estimate: ~10-50KB per user (well within limits)
- Access: `privateMetadata` only modifiable server-side
- No complex queries possible (just key-value storage)

**Pros**:
- No additional database infrastructure
- Included in free tier
- Simple to implement
- Aligns with existing no-database philosophy

**Cons**:
- Size limits may become issue with large gardens
- No relational queries
- Data tied to Clerk (migration effort if switching providers)

### Option B: External Database with Clerk Auth

**How it works**: Use Clerk solely for authentication, store garden data in a separate database (Supabase, PlanetScale, Neon, etc.) linked by Clerk user ID.

**Pros**:
- Unlimited storage capacity
- Complex queries possible
- Can add features like sharing, analytics
- Data portable (just change auth provider)

**Cons**:
- Additional service to manage and potentially pay for
- More complex architecture
- Violates current ADR-004 (no-database)
- Overkill for current data sizes

### Option C: Hybrid Approach

**How it works**: Start with Clerk metadata (Option A), design abstraction layer that can migrate to external database (Option B) if needed.

**Pros**:
- Simple start
- Future flexibility
- Minimal initial investment

**Cons**:
- May need migration later
- Abstraction adds some complexity

**Recommendation**: Option C - Start simple with Clerk metadata, design for future flexibility.

---

## Technical Integration Points

### Required Package

```
@clerk/nextjs
```

This single package provides:
- React components (SignIn, SignUp, UserButton, UserProfile)
- Next.js middleware for route protection
- Server-side helpers for API routes
- Client-side hooks (useUser, useAuth, useClerk)

### Environment Variables Needed

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/garden-planner
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/garden-planner
```

### Files That Would Need Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/app/layout.tsx` | Modify | Wrap with ClerkProvider |
| `src/components/Navigation.tsx` | Modify | Add UserButton or sign-in link |
| `src/app/garden-planner/page.tsx` | Modify | Use auth-aware storage |
| `src/lib/garden-storage.ts` | Modify or extend | Add user-scoped storage functions |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | New | Clerk sign-in page |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | New | Clerk sign-up page |
| `src/middleware.ts` | New (optional) | Route protection if needed |
| `package.json` | Modify | Add @clerk/nextjs dependency |

### User Experience Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ANONYMOUS USER                          │
├─────────────────────────────────────────────────────────────────┤
│  • Full access to all features                                  │
│  • Garden data saved in localStorage                            │
│  • Data lost if browser cleared or different device             │
│  • Prompted (not required) to sign up to save across devices    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (User chooses to sign up)
┌─────────────────────────────────────────────────────────────────┐
│                      SIGN UP / SIGN IN                          │
├─────────────────────────────────────────────────────────────────┤
│  • Email/password or social login (Google, GitHub, etc.)        │
│  • If existing localStorage data found:                         │
│    → Prompt: "Import your existing garden?"                     │
│    → Merge into cloud storage                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATED USER                         │
├─────────────────────────────────────────────────────────────────┤
│  • Garden data synced to Clerk metadata                         │
│  • Accessible from any device                                   │
│  • localStorage used as cache/offline fallback                  │
│  • UserButton in navigation for profile/logout                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pros and Cons Summary

### Advantages of Adding Clerk

| Benefit | Impact | Notes |
|---------|--------|-------|
| Cross-device sync | High | Users can access gardens from phone, tablet, desktop |
| Data durability | High | No more losing data when clearing browser |
| No database needed | High | Clerk metadata avoids infrastructure complexity |
| Social login | Medium | Reduces friction for sign-up |
| Professional UX | Medium | Pre-built, polished authentication UI |
| 10k MAU free | High | Generous limit for community project |
| Security built-in | High | Breach detection, bot protection included |
| Fast implementation | Medium | ~1-2 days of development work |

### Disadvantages and Risks

| Concern | Severity | Mitigation |
|---------|----------|------------|
| Vendor lock-in | Medium | Keep localStorage fallback; design abstraction layer |
| 7-day session expiry | Low | Acceptable UX for free tier; upgrade path exists |
| Clerk branding | Low | Small badge; acceptable for free tier |
| 1MB metadata limit | Low | Monitor usage; migrate to DB if needed |
| No MFA | Low | Acceptable for gardening app; not handling sensitive data |
| Service dependency | Medium | Offline fallback with localStorage |
| Added complexity | Medium | Clean abstraction keeps codebase manageable |
| Privacy concerns | Medium | Document clearly; make auth optional |

---

## Alternatives Considered

### Firebase Authentication + Firestore
- **Why considered**: Google ecosystem, generous free tier
- **Why not chosen**: More complex setup, two services, similar vendor lock-in

### Supabase
- **Why considered**: PostgreSQL included, open source
- **Why not chosen**: Overkill for current needs, adds database complexity

### Auth.js (NextAuth.js)
- **Why considered**: Open source, no vendor lock-in
- **Why not chosen**: Requires building UI, managing security, more development time

### Continue Without Auth (Status Quo)
- **Why considered**: Simplicity
- **Why not chosen**: Users requesting cross-device sync, data loss complaints

### Clerk Evaluation
- **Why chosen**: Best balance of simplicity, features, free tier, and Next.js integration

---

## Questions to Resolve Before Implementation

1. **Privacy Policy**: Do we need to update privacy policy for user data collection?

2. **Data Ownership**: How do users export their data if they leave?

3. **Existing Users**: How do we communicate the new feature to existing localStorage users?

4. **AI Chat History**: Should chat history also be persisted? (Currently session-only)

5. **API Token Storage**: Should user's OpenAI tokens be stored in Clerk privateMetadata?

6. **Offline Experience**: How should the app behave when signed in but offline?

7. **Account Deletion**: What's the flow when a user deletes their account?

---

## Estimated Effort

| Task | Effort | Dependencies |
|------|--------|--------------|
| Clerk account setup and configuration | 1 hour | None |
| Basic integration (ClerkProvider, sign-in pages) | 2-3 hours | Account setup |
| Navigation integration (UserButton) | 1 hour | Basic integration |
| Storage abstraction layer | 3-4 hours | Basic integration |
| Garden planner integration | 2-3 hours | Storage layer |
| Migration flow (localStorage → Clerk) | 2-3 hours | Planner integration |
| Testing both user flows | 2-3 hours | All above |
| Documentation updates | 1-2 hours | All above |

**Total Estimate**: 14-20 hours of development work

---

## References

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Pricing](https://clerk.com/pricing)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [ADR-004: No Database Architecture](../adrs/004-no-database-architecture.md)
- [ADR-002: Data Persistence Strategy](../adrs/002-data-persistence-strategy.md)

---

## Decision

**Pending** - This document is for research and discussion purposes. A decision to proceed should consider:

1. User demand for cross-device sync
2. Available development time
3. Willingness to add external dependency
4. Privacy and data handling implications

