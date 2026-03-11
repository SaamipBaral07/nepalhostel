# नेपाल Hostel Finder — Architecture Overview

## 1. Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│         Next.js 16 (App Router) + TS             │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Public   │ │ Auth     │ │ Protected        │  │
│  │ Pages    │ │ Pages    │ │ (/account/*)     │  │
│  │ /, /list │ │ /login   │ │ role-based UI    │  │
│  │ /[id]    │ │ /register│ │ user vs host     │  │
│  └──────────┘ └──────────┘ └──────────────────┘  │
│         │              │              │           │
│  ┌──────────────────────────────────────────┐    │
│  │  AuthContext (JWT tokens + role state)    │    │
│  └──────────────────────────────────────────┘    │
│         │              │              │           │
│  ┌──────────────────────────────────────────┐    │
│  │  API Layer (lib/api/ — fetch wrapper)     │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────┘
                       │ REST API (JSON)
                       ▼
┌─────────────────────────────────────────────────┐
│                   BACKEND                        │
│           Django REST Framework                  │
│                                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Auth   │ │ Hostel │ │Booking │ │Payment │   │
│  │ Module │ │ Module │ │ Module │ │ Module │   │
│  └────────┘ └────────┘ └────────┘ └────────┘   │
│         │              │              │          │
│  ┌──────────────────────────────────────────┐   │
│  │         PostgreSQL Database               │   │
│  │  users | hostels | bookings | payments    │   │
│  │  hostel_images | reviews                  │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## 2. Folder Structure

```
hostel-nepal/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (AuthProvider + Navbar + Footer)
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles
│   ├── login/page.tsx            # Login form
│   ├── register/page.tsx         # Register form with role selection
│   ├── hostels/
│   │   ├── page.tsx              # Listing page with filters
│   │   ├── HostelListContent.tsx # Client-side filtered list
│   │   └── [id]/page.tsx         # Hostel detail + booking sidebar
│   └── account/
│       ├── page.tsx              # Dashboard (role-based: User vs Host)
│       ├── UserDashboard.tsx     # User: upcoming/past bookings
│       ├── HostDashboard.tsx     # Host: stats, listings, requests
│       ├── profile/page.tsx      # Profile management
│       ├── bookings/page.tsx     # All user bookings
│       ├── hostels/
│       │   ├── page.tsx          # Host: manage listings
│       │   └── new/page.tsx      # Host: add hostel form
│       └── booking-requests/
│           └── page.tsx          # Host: incoming booking requests
│
├── components/
│   ├── ui/                       # Reusable design system
│   │   ├── Button.tsx            # Variant + size + loading
│   │   ├── Input.tsx             # With label + error state
│   │   ├── Select.tsx            # With label
│   │   ├── Badge.tsx             # Status badges
│   │   ├── Skeleton.tsx          # Loading skeletons
│   │   └── index.ts              # Barrel export
│   ├── layout/
│   │   ├── Navbar.tsx            # Conditional rendering by role
│   │   └── Footer.tsx            # Site footer
│   ├── hostel/
│   │   ├── HostelCard.tsx        # Hostel listing card
│   │   ├── HostelGrid.tsx        # Grid with loading/empty states
│   │   └── HostelFilters.tsx     # Search + city + category filters
│   └── auth/
│       └── ProtectedRoute.tsx    # Auth gate with role checking
│
├── contexts/
│   └── AuthContext.tsx           # JWT auth state + login/register/logout
│
├── lib/
│   ├── types/index.ts            # All TypeScript interfaces
│   ├── constants.ts              # App constants (cities, categories, etc.)
│   ├── utils.ts                  # Helpers (formatPrice, cn, etc.)
│   └── api/
│       ├── client.ts             # fetch() wrapper with JWT injection
│       ├── auth.ts               # Auth endpoints
│       ├── hostels.ts            # Hostel CRUD endpoints
│       └── bookings.ts           # Booking endpoints
│
├── backend/
│   └── models.py                 # Django model definitions
│
└── public/                       # Static assets
```

## 3. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **No state library** | AuthContext is sufficient for MVP. Add Zustand/TanStack Query in Phase 2 only if needed. |
| **fetch() not axios** | Zero dependency. The API client (`lib/api/client.ts`) wraps fetch with JWT injection, error handling, and typed responses. |
| **Client-side auth gate** | `ProtectedRoute` component + localStorage JWT. Middleware scaffold is ready for server-side validation. |
| **Role-based rendering** | Single `/account` page renders `UserDashboard` or `HostDashboard` based on `user.role`. Avoids route duplication. |
| **Static demo data** | All pages work with hardcoded data now. Each component has a clear swap point for API integration. |
| **UUIDs everywhere** | Both frontend types and Django models use UUID primary keys. No integer ID leakage. |
| **JSONField for amenities** | Simple list storage instead of M2M table. Good enough for MVP, easy to migrate later. |
| **Tailwind only** | No component library. The `components/ui/` folder is a lightweight design system with consistent emerald-green branding. |

## 4. Auth Flow

```
Register/Login → Backend returns { user, tokens: { access, refresh } }
                 → Stored in localStorage
                 → AuthContext reads on mount
                 → Navbar renders conditionally
                 → ProtectedRoute guards /account/*
                 → API client auto-attaches Bearer token
```

## 5. Roles & Permissions

| Feature | User | Host | Admin |
|---------|------|------|-------|
| Browse hostels | ✅ | ✅ | ✅ |
| Book hostel | ✅ | ❌ | ❌ |
| View bookings | ✅ | ❌ | ✅ |
| Add/edit hostel | ❌ | ✅ | ✅ |
| View booking requests | ❌ | ✅ | ✅ |
| Django Admin panel | ❌ | ❌ | ✅ |

## 6. Database Schema (Django Models)

- **User** — Custom auth model (email login, role field)
- **Hostel** — Listing with city, gender category, pricing, amenities
- **HostelImage** — Multiple images per hostel
- **Booking** — Links user ↔ hostel with stay type and payment tracking
- **Payment** — Tracks eSewa/Stripe/offline payments per booking
- **Review** — One review per user per hostel (1–5 stars)

## 7. Next Steps (Prompt 2 of 2)

### Backend Integration
- [ ] Set up Django project with DRF + JWT (`djangorestframework-simplejwt`)
- [ ] Create serializers for all models
- [ ] Create ViewSets with permission classes
- [ ] Configure CORS for Next.js origin
- [ ] Set `NEXT_PUBLIC_API_URL` environment variable

### Frontend Enhancements
- [ ] Replace demo data with real API calls in each page
- [ ] Add TanStack Query for data fetching + caching
- [ ] Implement image upload in hostel creation form
- [ ] Add booking creation flow with date picker
- [ ] Add search page with URL-driven filters
- [ ] Add error boundaries and toast notifications

### Payment Integration
- [ ] eSewa payment gateway (short stay: full, long stay: advance)
- [ ] Payment verification webhook
- [ ] Payment history page

### Production
- [ ] Add `.env.local` with API URL
- [ ] Configure Next.js `images.remotePatterns` for backend media
- [ ] Set up Vercel deployment for frontend
- [ ] Set up Railway/Render for Django backend
