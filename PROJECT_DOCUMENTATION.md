# नेपाल Hostel Finder
## Complete Project Documentation

---

**Version:** 1.0  
**Last Updated:** March 9, 2026  
**Project Type:** Full-Stack Web Application  
**Status:** Active Development (MVP Phase)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Features and Modules](#4-features-and-modules)
5. [Database Design](#5-database-design)
6. [API Documentation](#6-api-documentation)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Setup and Installation](#9-setup-and-installation)
10. [Payment Integration](#10-payment-integration)
11. [Future Improvements](#11-future-improvements)
12. [Appendix & References](#12-appendix--references)

---

## 1. Project Overview

### 1.1 Project Name
**नेपाल Hostel Finder** (Nepal Hostel Finder)

### 1.2 Purpose and Goals

Nepal Hostel Finder is a comprehensive hostel booking platform designed to connect students, travelers, and tourists with affordable accommodation options across Nepal. The platform addresses the challenge of finding verified, budget-friendly hostels in major Nepali cities.

**Primary Goals:**
- Simplify hostel discovery and booking for students and travelers
- Provide hostel owners with a free platform to list and manage their properties
- Enable secure online payments through multiple payment gateways
- Build trust through verified listings and authentic user reviews
- Support both short-term (daily) and long-term (monthly) stays

### 1.3 Target Users

The platform serves three distinct user roles:

1. **Regular Users (Students/Travelers)**
   - Students seeking long-term accommodation near educational institutions
   - Domestic and international tourists looking for short-term stays
   - Budget-conscious travelers exploring Nepal

2. **Hostel Hosts (Property Owners)**
   - Hostel owners wanting to list their properties
   - Property managers handling multiple hostels
   - Individual landlords with spare rooms

3. **Administrators**
   - Platform administrators managing content and users
   - Support staff handling disputes and verification

### 1.4 Core Features

- **Smart Search & Filtering:** Search hostels by city, gender category, price range, and amenities
- **Dual Stay Options:** Support for both short-term (per night) and long-term (per month) bookings
- **Role-Based Dashboards:** Customized interfaces for users, hosts, and admins
- **Multi-Payment Support:** Integration with Stripe (international) and eSewa (Nepal)
- **Review System:** Authentic reviews with 1-5 star ratings
- **Geolocation Features:** Find nearby hostels based on user location
- **Responsive Design:** Mobile-first approach for accessibility on all devices
- **Real-Time Availability:** Live bed availability tracking
- **Booking Management:** Complete booking lifecycle from request to completion

---

## 2. Tech Stack

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router for server-side rendering |
| **React** | 19.2.3 | UI library for building interactive components |
| **TypeScript** | 5.x | Type-safe JavaScript for better developer experience |
| **Tailwind CSS** | 4.x | Utility-first CSS framework for rapid UI development |
| **Framer Motion** | 12.34.3 | Animation library for smooth transitions |
| **Lucide React** | 0.575.0 | Icon library for consistent UI elements |

**Key Frontend Libraries:**
- `clsx` - Conditional className utility
- `next/navigation` - Client-side routing
- `next/image` - Optimized image loading

### 2.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Django** | 5.0+ | Python web framework for backend API |
| **Django REST Framework** | 3.15+ | RESTful API toolkit |
| **Simple JWT** | 5.3+ | JWT authentication for DRF |
| **PostgreSQL** | (Production) | Relational database (SQLite for development) |
| **Pillow** | 10.0+ | Image processing library |
| **Python Decouple** | 3.8+ | Environment variable management |

**Key Backend Libraries:**
- `django-cors-headers` - CORS handling for frontend-backend communication
- `psycopg2-binary` - PostgreSQL adapter for Python
- `djangorestframework-simplejwt` - JWT token generation and validation

### 2.3 Database

- **Development:** SQLite 3 (file-based, zero configuration)
- **Production:** PostgreSQL (recommended for scalability and performance)

### 2.4 Payment Gateways

- **Stripe:** International credit/debit card payments
- **eSewa:** Nepal's leading digital wallet and payment gateway

### 2.5 Development Tools

- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization
- **Django Admin** - Built-in admin interface with Jazzmin theme
- **Git** - Version control

### 2.6 Deployment (Planned)

- **Frontend:** Vercel (Next.js optimized hosting)
- **Backend:** Railway / Render (Django hosting with PostgreSQL)
- **Media Storage:** AWS S3 / Cloudinary (for production images)

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  │  (Desktop)   │  │   Browser    │  │   Browser    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 16)                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  App Router Pages (/app)                               │ │
│  │  • Public: /, /hostels, /hostels/[id]                 │ │
│  │  • Auth: /login, /register                            │ │
│  │  • Protected: /account/* (role-based)                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Context Layer                                         │ │
│  │  • AuthContext (JWT + User State)                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Client Layer (lib/api)                           │ │
│  │  • Fetch wrapper with JWT injection                   │ │
│  │  • Error handling & type safety                       │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (JSON)
                            │ http://localhost:8000/api/v1/
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Django REST Framework)                 │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Layer (ViewSets & APIViews)                      │ │
│  │  • Authentication (Register, Login, Profile)          │ │
│  │  • Hostels (CRUD, Search, Filter)                     │ │
│  │  • Bookings (Create, List, Status Management)         │ │
│  │  • Payments (Stripe, eSewa Integration)               │ │
│  │  • Reviews (Create, List)                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Business Logic Layer                                  │ │
│  │  • Serializers (Data validation & transformation)     │ │
│  │  • Permissions (Role-based access control)            │ │
│  │  • Utils (Helper functions)                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Data Layer (Django ORM)                              │ │
│  │  • Models (User, Hostel, Booking, Payment, Review)   │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL / SQLite                                   │ │
│  │  • Users, Hostels, Bookings, Payments, Reviews        │ │
│  │  • Hostel Images, Cities                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Stripe    │  │    eSewa     │  │  Media CDN   │      │
│  │   Payment    │  │   Payment    │  │  (Future)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Communication Flow

**Frontend ↔ Backend Communication:**

1. **Request Flow:**
   ```
   User Action → React Component → API Client → 
   JWT Token Injection → HTTP Request → Django View → 
   Serializer Validation → Business Logic → Database Query
   ```

2. **Response Flow:**
   ```
   Database Result → Django Model → Serializer → 
   JSON Response → API Client → React State Update → UI Render
   ```

### 3.3 Data Flow Diagram

**User Registration & Login:**
```
[User] → [Register Form] → POST /api/v1/auth/register/
                         → [Django: Create User + Generate JWT]
                         → Response: { user, tokens: { access, refresh } }
                         → [Frontend: Store in localStorage]
                         → [AuthContext: Update State]
                         → [Redirect to /account]
```

**Hostel Booking Flow:**
```
[User] → [Hostel Detail Page] → [Booking Sidebar]
       → POST /api/v1/bookings/
       → [Django: Validate dates, Check availability]
       → [Create Booking with "pending" status]
       → [Redirect to Payment Gateway]
       → [Payment Success Webhook]
       → [Update Booking status to "confirmed"]
       → [Update Hostel available_beds]
       → [Send confirmation to User & Host]
```

### 3.4 Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. POST /auth/login { email, password }
       ▼
┌─────────────────────┐
│  Django Backend     │
│  • Validate creds   │
│  • Generate JWT     │
└──────┬──────────────┘
       │ 2. Return { user, tokens: { access, refresh } }
       ▼
┌─────────────┐
│   Client    │
│  • Store in │
│  localStorage│
└──────┬──────┘
       │ 3. Subsequent requests
       │    Authorization: Bearer <access_token>
       ▼
┌─────────────────────┐
│  Django Backend     │
│  • Verify JWT       │
│  • Extract user     │
│  • Check permissions│
└─────────────────────┘
```

---


## 4. Features and Modules

### 4.1 Authentication Module

**Purpose:** Secure user registration, login, and profile management with role-based access control.

**Key Features:**
- Email-based authentication (no username required)
- JWT token-based session management
- Role selection during registration (User, Host, Admin)
- Profile management with avatar upload
- Token refresh mechanism for extended sessions

**User Stories:**

1. **As a new user, I want to register an account**
   - Navigate to `/register`
   - Fill in: Full Name, Email, Phone, Password, Confirm Password
   - Select role: User or Host
   - Submit form → Account created → Auto-login → Redirect to dashboard

2. **As a registered user, I want to log in**
   - Navigate to `/login`
   - Enter email and password
   - Submit → JWT tokens stored → Redirect to `/account`

3. **As a logged-in user, I want to update my profile**
   - Navigate to `/account/profile`
   - Update full name, phone, or avatar
   - Save changes → Profile updated

**Technical Implementation:**
- **Frontend:** `AuthContext` manages authentication state globally
- **Backend:** `RegisterView`, `LoginView`, `ProfileView` handle API requests
- **Storage:** JWT tokens stored in `localStorage` (access + refresh)
- **Security:** Passwords hashed with Django's PBKDF2 algorithm

**API Endpoints:**
```
POST   /api/v1/auth/register/       - Create new account
POST   /api/v1/auth/login/          - Authenticate user
GET    /api/v1/auth/profile/        - Get current user profile
PUT    /api/v1/auth/profile/        - Update profile
POST   /api/v1/auth/token/refresh/  - Refresh access token
POST   /api/v1/auth/logout/         - Logout (client-side token removal)
```

---

### 4.2 Hostel Management Module

**Purpose:** Enable hosts to list, manage, and update their hostel properties while allowing users to discover and explore hostels.

**Key Features:**
- Multi-image upload for hostel galleries
- Rich text descriptions with amenities
- Gender-specific categorization (Boys, Girls, Unisex, Tourist)
- Dual pricing (per night / per month)
- Real-time bed availability tracking
- Featured hostel promotion
- Slug-based and UUID-based URLs

**User Stories:**

1. **As a host, I want to list my hostel**
   - Navigate to `/account/hostels/new`
   - Fill in hostel details:
     - Name, Description, City, Address
     - Gender Category, Pricing (night/month)
     - Total beds, Amenities
   - Upload multiple images (mark one as primary)
   - Submit → Hostel created → Visible in listings

2. **As a host, I want to edit my hostel**
   - Navigate to `/account/hostels`
   - Click "Edit" on a hostel
   - Update any field (name, price, images, etc.)
   - Save → Changes reflected immediately

3. **As a user, I want to search for hostels**
   - Navigate to `/hostels`
   - Apply filters:
     - City (Kathmandu, Pokhara, etc.)
     - Gender Category
     - Price Range
     - Stay Type (Short/Long)
   - View filtered results with sorting options

4. **As a user, I want to view hostel details**
   - Click on a hostel card
   - View full details:
     - Image gallery, Description, Amenities
     - Location on map (if coordinates available)
     - Reviews and ratings
     - Availability and pricing
   - See booking sidebar for instant reservation

**Technical Implementation:**
- **Frontend:** 
  - `HostelCard` component for list view
  - `HostelFilters` for search/filter UI
  - Dynamic routing with `[id]` for detail pages
- **Backend:**
  - `HostelViewSet` with custom actions (list, retrieve, create, update, destroy)
  - `HostelImage` model for multiple images per hostel
  - Computed properties: `rating`, `review_count`
- **Search:** Query parameters for filtering (city, gender_category, min_price, max_price)

**API Endpoints:**
```
GET    /api/v1/hostels/                    - List all hostels (with filters)
POST   /api/v1/hostels/                    - Create new hostel (Host only)
GET    /api/v1/hostels/featured/           - Get featured hostels
GET    /api/v1/hostels/nearby/             - Get nearby hostels (geolocation)
GET    /api/v1/hostels/my-listings/        - Get host's own hostels
GET    /api/v1/hostels/{id}/               - Get hostel details (slug or UUID)
PUT    /api/v1/hostels/{id}/               - Update hostel (Host only)
DELETE /api/v1/hostels/{id}/               - Delete hostel (Host only)
GET    /api/v1/hostels/{id}/reviews/       - Get hostel reviews
POST   /api/v1/hostels/{id}/reviews/       - Add review (User only)
```

**Hostel Workflow:**
```
[Host] → Create Hostel → [Pending/Active] → Visible in Search
                                          → Users can book
                                          → Host manages bookings
                                          → Host updates availability
```

---

### 4.3 Booking Management Module

**Purpose:** Handle the complete booking lifecycle from creation to completion, with status tracking and payment integration.

**Key Features:**
- Dual stay type support (Short-term: daily, Long-term: monthly)
- Date range selection with validation
- Automatic price calculation
- Booking status workflow (Pending → Confirmed → Completed/Cancelled)
- Payment status tracking (Unpaid → Advance Paid → Fully Paid)
- Host approval system for booking requests
- Booking history for users and hosts

**User Stories:**

1. **As a user, I want to book a hostel**
   - View hostel detail page
   - Select stay type (Short/Long)
   - Choose check-in and check-out dates
   - Review total amount
   - Submit booking → Status: Pending
   - Redirect to payment gateway
   - Payment success → Status: Confirmed

2. **As a user, I want to view my bookings**
   - Navigate to `/account/bookings`
   - See all bookings with status badges
   - Filter by: Upcoming, Past, Cancelled
   - View booking details and payment status

3. **As a host, I want to manage booking requests**
   - Navigate to `/account/booking-requests`
   - See pending booking requests
   - Review user details and dates
   - Approve or Reject request
   - Approved → User notified → Payment link sent

4. **As a user, I want to cancel a booking**
   - Go to booking details
   - Click "Cancel Booking"
   - Confirm cancellation
   - Status updated to "Cancelled"
   - Refund processed (if applicable)

**Booking Status Workflow:**
```
[Pending] → User creates booking
    ↓
[Confirmed] → Host approves + Payment received
    ↓
[Completed] → Check-out date passed
    ↓
[Cancelled] → User/Host cancels (with refund logic)
```

**Payment Status Workflow:**
```
[Unpaid] → Booking created
    ↓
[Advance Paid] → Partial payment (Long stay: 30% advance)
    ↓
[Fully Paid] → Complete payment (Short stay: 100% upfront)
```

**Technical Implementation:**
- **Frontend:**
  - `BookingSidebar` component on hostel detail page
  - Date picker with availability checking
  - Real-time price calculation
- **Backend:**
  - `BookingViewSet` with custom actions
  - Date validation (check-out > check-in)
  - Availability checking (available_beds > 0)
  - Automatic bed count updates

**API Endpoints:**
```
GET    /api/v1/bookings/                   - List user's bookings
POST   /api/v1/bookings/                   - Create new booking
GET    /api/v1/bookings/host-requests/     - Get host's booking requests
GET    /api/v1/bookings/{id}/              - Get booking details
POST   /api/v1/bookings/{id}/cancel/       - Cancel booking
PATCH  /api/v1/bookings/{id}/status/       - Update booking status (Host)
```

---

### 4.4 Payment Module

**Purpose:** Secure payment processing with support for multiple payment gateways (Stripe for international, eSewa for Nepal).

**Key Features:**
- Stripe integration for credit/debit cards
- eSewa integration for Nepali digital wallet
- Webhook handling for payment verification
- Payment history tracking
- Refund management
- Advance payment for long stays (30%)
- Full payment for short stays (100%)

**User Stories:**

1. **As a user, I want to pay for my booking**
   - Complete booking form
   - Choose payment method (Stripe/eSewa)
   - Redirect to payment gateway
   - Complete payment
   - Webhook verifies payment
   - Booking status updated to "Confirmed"
   - Confirmation email sent

2. **As a user, I want to view payment history**
   - Navigate to booking details
   - See payment records:
     - Amount paid, Method, Date, Transaction ID
     - Payment status (Completed/Failed/Refunded)

**Payment Flow (Stripe):**
```
[User] → Select Stripe → Create Checkout Session
                       → Redirect to Stripe Checkout
                       → User completes payment
                       → Stripe sends webhook
                       → Backend verifies signature
                       → Update booking & payment status
                       → Redirect user to success page
```

**Payment Flow (eSewa):**
```
[User] → Select eSewa → Generate payment request
                      → Redirect to eSewa portal
                      → User logs in & pays
                      → eSewa callback to backend
                      → Verify transaction
                      → Update booking status
                      → Redirect to success page
```

**Technical Implementation:**
- **Frontend:**
  - Payment method selection UI
  - Redirect handling for external gateways
  - Success/failure pages
- **Backend:**
  - `create_checkout_session` for Stripe
  - `stripe_webhook` for payment verification
  - `esewa_placeholder` for eSewa integration
  - `Payment` model for transaction records

**API Endpoints:**
```
POST   /api/v1/payments/{booking_id}/checkout/  - Create Stripe session
POST   /api/v1/payments/webhook/stripe/         - Stripe webhook handler
POST   /api/v1/payments/{booking_id}/esewa/     - eSewa payment initiation
```

**Payment Security:**
- Stripe webhook signature verification
- HTTPS-only communication
- PCI DSS compliance (handled by Stripe)
- No credit card data stored on server

---

### 4.5 Review & Rating Module

**Purpose:** Enable users to share experiences and help others make informed decisions through authentic reviews.

**Key Features:**
- 1-5 star rating system
- Text reviews with comments
- One review per user per hostel (prevents spam)
- Average rating calculation
- Review count display
- Chronological ordering (newest first)

**User Stories:**

1. **As a user, I want to leave a review**
   - Navigate to hostel detail page
   - Scroll to reviews section
   - Click "Write a Review"
   - Select star rating (1-5)
   - Write comment
   - Submit → Review published

2. **As a user, I want to read reviews**
   - View hostel detail page
   - See average rating and total review count
   - Read individual reviews with:
     - Reviewer name and avatar
     - Star rating
     - Comment text
     - Date posted

**Technical Implementation:**
- **Frontend:**
  - Star rating input component
  - Review list with pagination
  - Average rating display
- **Backend:**
  - `Review` model with unique constraint (hostel + user)
  - Computed property on `Hostel` model for average rating
  - `ReviewListCreateView` for CRUD operations

**API Endpoints:**
```
GET    /api/v1/hostels/{id}/reviews/  - List reviews for hostel
POST   /api/v1/hostels/{id}/reviews/  - Create review (authenticated)
```

---

### 4.6 City & Location Module

**Purpose:** Organize hostels by city and enable location-based discovery.

**Key Features:**
- City master data with images and taglines
- City-based filtering
- Nearby hostel discovery using geolocation
- Distance calculation (if coordinates available)
- City showcase on homepage

**User Stories:**

1. **As a user, I want to browse hostels by city**
   - View homepage city marquee
   - Click on a city (e.g., "Kathmandu")
   - See all hostels in that city
   - Apply additional filters

2. **As a user, I want to find nearby hostels**
   - Allow location access
   - System calculates distance to hostels
   - Display hostels sorted by proximity
   - Show distance in kilometers

**Technical Implementation:**
- **Frontend:**
  - `CityMarquee` component with scrolling animation
  - Geolocation API for user coordinates
- **Backend:**
  - `City` model with ordering field
  - Haversine formula for distance calculation
  - `nearby` action in `HostelViewSet`

**API Endpoints:**
```
GET    /api/v1/cities/                - List all active cities
GET    /api/v1/hostels/cities/        - Get cities with hostel counts
GET    /api/v1/hostels/nearby/        - Get nearby hostels (requires lat/lng)
```

---

### 4.7 Dashboard Module

**Purpose:** Provide role-specific dashboards for users and hosts with relevant information and quick actions.

**User Dashboard Features:**
- Upcoming bookings summary
- Past bookings history
- Quick links to profile and bookings
- Booking statistics

**Host Dashboard Features:**
- Total listings count
- Pending booking requests count
- Total bookings received
- Revenue statistics (future)
- Quick actions: Add Hostel, View Requests
- Recent bookings list

**User Stories:**

1. **As a user, I want to see my dashboard**
   - Login → Redirect to `/account`
   - See `UserDashboard` with:
     - Upcoming bookings (next 7 days)
     - Past bookings
     - Quick navigation

2. **As a host, I want to see my dashboard**
   - Login → Redirect to `/account`
   - See `HostDashboard` with:
     - Statistics cards (listings, requests, bookings)
     - Pending booking requests
     - Quick action buttons

**Technical Implementation:**
- **Frontend:**
  - Conditional rendering based on `user.role`
  - `UserDashboard.tsx` and `HostDashboard.tsx` components
  - Statistics cards with icons
- **Backend:**
  - Aggregation queries for statistics
  - Filtered queries for role-specific data

---

## 5. Database Design

### 5.1 Entity Relationship Diagram (Text Description)

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ 1
       │
       │ *
┌──────┴──────┐         ┌─────────────┐
│   Hostel    │────────▶│    City     │
└──────┬──────┘    *:1  └─────────────┘
       │ 1
       ├─────────────┐
       │ *           │ *
┌──────┴──────┐ ┌───┴────────┐
│ HostelImage │ │   Review   │
└─────────────┘ └────┬───────┘
                     │ *
                     │
                     │ 1
                ┌────┴────┐
                │  User   │
                └────┬────┘
                     │ 1
                     │
                     │ *
                ┌────┴────────┐
                │   Booking   │
                └────┬────────┘
                     │ 1
                     │
                     │ *
                ┌────┴────────┐
                │   Payment   │
                └─────────────┘
```

**Relationships:**
- User → Hostel (1:Many) - A host can own multiple hostels
- Hostel → HostelImage (1:Many) - A hostel can have multiple images
- Hostel → Review (1:Many) - A hostel can have multiple reviews
- User → Review (1:Many) - A user can write multiple reviews
- User → Booking (1:Many) - A user can make multiple bookings
- Hostel → Booking (1:Many) - A hostel can have multiple bookings
- Booking → Payment (1:Many) - A booking can have multiple payment records

### 5.2 Database Tables

#### 5.2.1 User Table

**Table Name:** `core_user`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(254) | UNIQUE, NOT NULL | User email (login) |
| password | VARCHAR(128) | NOT NULL | Hashed password |
| full_name | VARCHAR(255) | NOT NULL | User's full name |
| phone | VARCHAR(20) | | Contact number |
| role | VARCHAR(10) | NOT NULL | user/host/admin |
| avatar | VARCHAR(100) | | Profile picture path |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| is_staff | BOOLEAN | DEFAULT FALSE | Admin access |
| is_superuser | BOOLEAN | DEFAULT FALSE | Superuser status |
| created_at | TIMESTAMP | AUTO | Registration date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- INDEX on `role`

---

#### 5.2.2 City Table

**Table Name:** `core_city`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | City name |
| tagline | VARCHAR(200) | | Marketing tagline |
| image | VARCHAR(100) | | City image path |
| is_active | BOOLEAN | DEFAULT TRUE | Visibility status |
| ordering | INTEGER | DEFAULT 0 | Display order |
| created_at | TIMESTAMP | AUTO | Creation date |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `name`
- INDEX on `ordering`

---

#### 5.2.3 Hostel Table

**Table Name:** `core_hostel`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| host_id | UUID | FOREIGN KEY → User | Hostel owner |
| name | VARCHAR(255) | NOT NULL | Hostel name |
| slug | VARCHAR(300) | UNIQUE | URL-friendly name |
| description | TEXT | NOT NULL | Full description |
| city | VARCHAR(100) | NOT NULL | City name |
| address | VARCHAR(500) | NOT NULL | Full address |
| latitude | DECIMAL(9,6) | | GPS latitude |
| longitude | DECIMAL(9,6) | | GPS longitude |
| gender_category | VARCHAR(10) | NOT NULL | boys/girls/unisex/tourist |
| price_per_night | DECIMAL(10,2) | NOT NULL | Daily rate |
| price_per_month | DECIMAL(10,2) | NOT NULL | Monthly rate |
| total_beds | INTEGER | NOT NULL | Total capacity |
| available_beds | INTEGER | NOT NULL | Current availability |
| amenities | JSON | | List of amenities |
| is_featured | BOOLEAN | DEFAULT FALSE | Featured status |
| is_active | BOOLEAN | DEFAULT TRUE | Listing status |
| created_at | TIMESTAMP | AUTO | Creation date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Computed Fields (not stored):**
- `rating` - Average of all review ratings
- `review_count` - Total number of reviews

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `slug`
- FOREIGN KEY INDEX on `host_id`
- INDEX on `city`
- INDEX on `gender_category`
- INDEX on `is_featured`
- INDEX on `is_active`

---

#### 5.2.4 HostelImage Table

**Table Name:** `core_hostelimage`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| hostel_id | UUID | FOREIGN KEY → Hostel | Parent hostel |
| image | VARCHAR(100) | NOT NULL | Image file path |
| alt_text | VARCHAR(255) | | Accessibility text |
| is_primary | BOOLEAN | DEFAULT FALSE | Primary image flag |
| created_at | TIMESTAMP | AUTO | Upload date |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY INDEX on `hostel_id`
- INDEX on `is_primary`

---

#### 5.2.5 Booking Table

**Table Name:** `core_booking`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| hostel_id | UUID | FOREIGN KEY → Hostel | Booked hostel |
| user_id | UUID | FOREIGN KEY → User | Guest |
| stay_type | VARCHAR(10) | NOT NULL | short/long |
| check_in | DATE | NOT NULL | Start date |
| check_out | DATE | NOT NULL | End date |
| total_amount | DECIMAL(10,2) | NOT NULL | Total cost |
| advance_amount | DECIMAL(10,2) | | Advance payment |
| status | VARCHAR(15) | DEFAULT 'pending' | Booking status |
| payment_status | VARCHAR(15) | DEFAULT 'unpaid' | Payment status |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | AUTO | Booking date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Status Values:**
- `pending` - Awaiting host approval
- `confirmed` - Approved and paid
- `cancelled` - Cancelled by user/host
- `completed` - Stay completed

**Payment Status Values:**
- `unpaid` - No payment received
- `advance_paid` - Partial payment (long stay)
- `fully_paid` - Complete payment

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY INDEX on `hostel_id`
- FOREIGN KEY INDEX on `user_id`
- INDEX on `status`
- INDEX on `check_in`

---

#### 5.2.6 Payment Table

**Table Name:** `core_payment`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| booking_id | UUID | FOREIGN KEY → Booking | Related booking |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| method | VARCHAR(10) | NOT NULL | esewa/stripe/offline |
| status | VARCHAR(15) | DEFAULT 'pending' | Payment status |
| transaction_id | VARCHAR(255) | | Gateway transaction ID |
| paid_at | TIMESTAMP | | Payment completion time |
| created_at | TIMESTAMP | AUTO | Record creation |

**Status Values:**
- `pending` - Payment initiated
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY INDEX on `booking_id`
- INDEX on `status`
- INDEX on `transaction_id`

---

#### 5.2.7 Review Table

**Table Name:** `core_review`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| hostel_id | UUID | FOREIGN KEY → Hostel | Reviewed hostel |
| user_id | UUID | FOREIGN KEY → User | Reviewer |
| rating | INTEGER | 1-5, NOT NULL | Star rating |
| comment | TEXT | NOT NULL | Review text |
| created_at | TIMESTAMP | AUTO | Review date |
| updated_at | TIMESTAMP | AUTO | Last edit |

**Constraints:**
- UNIQUE (hostel_id, user_id) - One review per user per hostel
- CHECK (rating >= 1 AND rating <= 5)

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on (hostel_id, user_id)
- FOREIGN KEY INDEX on `hostel_id`
- FOREIGN KEY INDEX on `user_id`

---

### 5.3 Database Constraints & Business Rules

1. **User Constraints:**
   - Email must be unique across all users
   - Password must be at least 8 characters (enforced by Django)
   - Role must be one of: user, host, admin

2. **Hostel Constraints:**
   - Slug must be unique (auto-generated from name)
   - available_beds <= total_beds
   - price_per_night > 0 and price_per_month > 0
   - Gender category must be: boys, girls, unisex, tourist

3. **Booking Constraints:**
   - check_out > check_in
   - Cannot book if available_beds = 0
   - User cannot book their own hostel
   - Status transitions: pending → confirmed → completed
   - Cannot cancel after check-in date

4. **Review Constraints:**
   - User can only review hostels they've booked
   - One review per user per hostel
   - Rating must be between 1 and 5

5. **Payment Constraints:**
   - Payment amount must match booking amount
   - Cannot have multiple successful payments for same booking
   - Refund amount cannot exceed paid amount

---

## 6. API Documentation

### 6.1 API Base URL

- **Development:** `http://localhost:8000/api/v1/`
- **Production:** `https://api.hostelnepal.com/api/v1/` (example)

### 6.2 Authentication

All protected endpoints require JWT authentication:

```
Authorization: Bearer <access_token>
```

**Token Lifecycle:**
- Access Token: 60 minutes
- Refresh Token: 7 days

### 6.3 API Response Format

**Success Response:**
```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

**Error Response:**
```json
{
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  },
  "status": 400
}
```

### 6.4 Authentication Endpoints

#### Register User
```
POST /api/v1/auth/register/
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "confirmPassword": "securepass123",
  "fullName": "John Doe",
  "phone": "+977-9841234567",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "+977-9841234567",
      "role": "user",
      "avatarUrl": null,
      "createdAt": "2026-03-09T10:30:00Z"
    },
    "tokens": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
  }
}
```

#### Login
```
POST /api/v1/auth/login/
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

#### Get Profile
```
GET /api/v1/auth/profile/
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+977-9841234567",
    "role": "user",
    "avatarUrl": "http://localhost:8000/media/avatars/user.jpg",
    "createdAt": "2026-03-09T10:30:00Z"
  }
}
```


### 6.5 Hostel Endpoints

#### List Hostels (with filters)
```
GET /api/v1/hostels/?city=Kathmandu&gender_category=boys&min_price=5000&max_price=15000
```

**Query Parameters:**
- `city` - Filter by city name
- `gender_category` - boys, girls, unisex, tourist
- `min_price` - Minimum price per month
- `max_price` - Maximum price per month
- `search` - Search in name and description
- `ordering` - Sort by: price_per_month, -price_per_month, rating, -rating
- `page` - Page number (default: 1)

**Response (200 OK):**
```json
{
  "count": 45,
  "next": "http://localhost:8000/api/v1/hostels/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "Kathmandu Student Hostel",
      "slug": "kathmandu-student-hostel",
      "city": "Kathmandu",
      "address": "Thamel, Kathmandu",
      "genderCategory": "boys",
      "pricePerNight": 800,
      "pricePerMonth": 12000,
      "availableBeds": 5,
      "rating": 4.5,
      "reviewCount": 23,
      "primaryImage": "http://localhost:8000/media/hostels/hostel1.jpg",
      "isFeatured": true
    }
  ]
}
```

#### Get Hostel Details
```
GET /api/v1/hostels/{id}/
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Kathmandu Student Hostel",
    "slug": "kathmandu-student-hostel",
    "description": "Comfortable hostel near universities...",
    "city": "Kathmandu",
    "address": "Thamel, Kathmandu",
    "latitude": 27.7172,
    "longitude": 85.3240,
    "genderCategory": "boys",
    "pricePerNight": 800,
    "pricePerMonth": 12000,
    "totalBeds": 20,
    "availableBeds": 5,
    "amenities": [
      {"id": "1", "name": "WiFi", "icon": "wifi"},
      {"id": "2", "name": "Parking", "icon": "car"}
    ],
    "images": [
      {
        "id": "uuid",
        "url": "http://localhost:8000/media/hostels/img1.jpg",
        "altText": "Main entrance",
        "isPrimary": true
      }
    ],
    "rating": 4.5,
    "reviewCount": 23,
    "host": {
      "id": "uuid",
      "fullName": "Ram Sharma",
      "avatarUrl": "http://localhost:8000/media/avatars/host.jpg"
    },
    "isFeatured": true,
    "isActive": true,
    "createdAt": "2026-01-15T08:00:00Z"
  }
}
```

#### Create Hostel (Host only)
```
POST /api/v1/hostels/
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
name: "New Hostel"
description: "Great place to stay"
city: "Pokhara"
address: "Lakeside, Pokhara"
genderCategory: "unisex"
pricePerNight: 1000
pricePerMonth: 15000
totalBeds: 10
amenities: ["WiFi", "Parking", "Laundry"]
images: [File, File, File]
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "uuid",
    "name": "New Hostel",
    "slug": "new-hostel",
    ...
  }
}
```


### 6.6 Booking Endpoints

#### Create Booking
```
POST /api/v1/bookings/
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "hostelId": "uuid",
  "stayType": "short",
  "checkIn": "2026-04-01",
  "checkOut": "2026-04-05"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "uuid",
    "hostel": {
      "id": "uuid",
      "name": "Kathmandu Student Hostel",
      "city": "Kathmandu",
      "pricePerNight": 800,
      "pricePerMonth": 12000
    },
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+977-9841234567"
    },
    "stayType": "short",
    "checkIn": "2026-04-01",
    "checkOut": "2026-04-05",
    "totalAmount": 3200,
    "status": "pending",
    "paymentStatus": "unpaid",
    "createdAt": "2026-03-09T12:00:00Z"
  }
}
```

#### List User Bookings
```
GET /api/v1/bookings/
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "count": 5,
  "results": [
    {
      "id": "uuid",
      "hostel": { ... },
      "stayType": "short",
      "checkIn": "2026-04-01",
      "checkOut": "2026-04-05",
      "totalAmount": 3200,
      "status": "confirmed",
      "paymentStatus": "fully_paid",
      "createdAt": "2026-03-09T12:00:00Z"
    }
  ]
}
```

#### Get Host Booking Requests
```
GET /api/v1/bookings/host-requests/
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "count": 3,
  "results": [
    {
      "id": "uuid",
      "hostel": { ... },
      "user": { ... },
      "status": "pending",
      "checkIn": "2026-04-01",
      "checkOut": "2026-04-05",
      "totalAmount": 3200
    }
  ]
}
```

#### Update Booking Status (Host only)
```
PATCH /api/v1/bookings/{id}/status/
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "uuid",
    "status": "confirmed",
    ...
  }
}
```


### 6.7 Review Endpoints

#### Get Hostel Reviews
```
GET /api/v1/hostels/{hostel_id}/reviews/
```

**Response (200 OK):**
```json
{
  "count": 15,
  "results": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "fullName": "Jane Smith",
        "avatarUrl": "http://localhost:8000/media/avatars/jane.jpg"
      },
      "rating": 5,
      "comment": "Excellent hostel! Clean rooms and friendly staff.",
      "createdAt": "2026-03-05T14:30:00Z"
    }
  ]
}
```

#### Create Review
```
POST /api/v1/hostels/{hostel_id}/reviews/
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great experience!"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Great experience!",
    "createdAt": "2026-03-09T15:00:00Z"
  }
}
```

---

## 7. Frontend Architecture

### 7.1 Project Structure

```
app/                          # Next.js App Router
├── layout.tsx                # Root layout with AuthProvider
├── page.tsx                  # Landing page
├── globals.css               # Global styles
├── login/page.tsx            # Login page
├── register/page.tsx         # Registration page
├── hostels/
│   ├── page.tsx              # Hostel listing
│   ├── HostelListContent.tsx # Client component for filtering
│   └── [id]/
│       ├── page.tsx          # Hostel detail
│       └── BookingSidebar.tsx# Booking form
└── account/
    ├── page.tsx              # Dashboard (role-based)
    ├── UserDashboard.tsx     # User view
    ├── HostDashboard.tsx     # Host view
    ├── profile/page.tsx      # Profile management
    ├── bookings/page.tsx     # User bookings
    ├── booking-requests/page.tsx  # Host requests
    └── hostels/
        ├── page.tsx          # Host listings
        ├── new/page.tsx      # Add hostel
        └── [id]/edit/page.tsx# Edit hostel

components/
├── ui/                       # Design system
│   ├── Button.tsx            # Reusable button
│   ├── Input.tsx             # Form input
│   ├── Select.tsx            # Dropdown
│   ├── Badge.tsx             # Status badges
│   └── Skeleton.tsx          # Loading states
├── hostel/
│   ├── HostelCard.tsx        # Hostel card component
│   ├── HostelGrid.tsx        # Grid layout
│   └── HostelFilters.tsx     # Filter UI
└── auth/
    └── ProtectedRoute.tsx    # Auth guard

contexts/
└── AuthContext.tsx           # Global auth state

lib/
├── api/
│   ├── client.ts             # Fetch wrapper
│   ├── auth.ts               # Auth API calls
│   ├── hostels.ts            # Hostel API calls
│   └── bookings.ts           # Booking API calls
├── types/index.ts            # TypeScript types
├── constants.ts              # App constants
└── utils.ts                  # Helper functions
```

### 7.2 Key Frontend Patterns

#### 7.2.1 API Client Pattern

All API calls go through a centralized client:

```typescript
// lib/api/client.ts
export async function apiClient<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const token = getAccessToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) throw new ApiError(response);
  return response.json();
}
```

#### 7.2.2 Authentication Pattern

```typescript
// contexts/AuthContext.tsx
export function AuthProvider({ children }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored.user && stored.tokens) {
      setState({ ...stored, isLoading: false, isAuthenticated: true });
    }
  }, []);

  const login = async (data: LoginFormData) => {
    const response = await authApi.login(data);
    persistAuth(response.user, response.tokens);
    setState({ ...response, isLoading: false, isAuthenticated: true });
  };

  return <AuthContext.Provider value={{ ...state, login, logout }}>
    {children}
  </AuthContext.Provider>;
}
```

#### 7.2.3 Protected Route Pattern

```typescript
// components/auth/ProtectedRoute.tsx
export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  if (isLoading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <AccessDenied />;
  }

  return children;
}
```


### 7.3 Component Design System

#### 7.3.1 Button Component

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', loading, ...props }: ButtonProps) {
  const baseStyles = 'rounded-xl font-semibold transition-all';
  const variantStyles = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-500',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
    ghost: 'text-zinc-600 hover:bg-zinc-100'
  };
  const sizeStyles = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-12 px-8 text-lg'
  };

  return (
    <button 
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size])}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

#### 7.3.2 Input Component

```typescript
// components/ui/Input.tsx
interface InputProps {
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
      <input
        className={cn(
          'w-full rounded-lg border px-4 py-2.5 text-zinc-900',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500',
          error ? 'border-red-500' : 'border-zinc-300'
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

### 7.4 State Management

Currently using React Context for global state. No external state management library.

**Global State:**
- `AuthContext` - User authentication and profile

**Local State:**
- Component-level `useState` for forms and UI state
- URL search params for filters and pagination

**Future Consideration:**
- TanStack Query for server state caching
- Zustand for complex client state (if needed)

### 7.5 Styling Approach

**Tailwind CSS Utility-First:**
- No CSS modules or styled-components
- Consistent design tokens via Tailwind config
- Custom color palette: Emerald green primary
- Responsive design with mobile-first breakpoints

**Design Tokens:**
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#ecfdf5',
        500: '#10b981',
        600: '#059669',
        700: '#047857'
      }
    }
  }
}
```

---

## 8. Authentication & Authorization

### 8.1 Authentication Strategy

**JWT (JSON Web Tokens)** with access and refresh tokens.

**Flow:**
1. User logs in with email/password
2. Backend validates credentials
3. Backend generates JWT access token (60 min) and refresh token (7 days)
4. Frontend stores tokens in localStorage
5. Frontend includes access token in Authorization header for all API requests
6. When access token expires, frontend uses refresh token to get new access token
7. When refresh token expires, user must log in again

### 8.2 Token Structure

**Access Token Payload:**
```json
{
  "token_type": "access",
  "exp": 1709989200,
  "iat": 1709985600,
  "jti": "unique-token-id",
  "user_id": "uuid"
}
```

**Refresh Token Payload:**
```json
{
  "token_type": "refresh",
  "exp": 1710590400,
  "iat": 1709985600,
  "jti": "unique-token-id",
  "user_id": "uuid"
}
```

### 8.3 Authorization Levels

#### 8.3.1 Public Endpoints (No Auth Required)
- `GET /api/v1/hostels/` - List hostels
- `GET /api/v1/hostels/{id}/` - Hostel details
- `GET /api/v1/hostels/{id}/reviews/` - Hostel reviews
- `GET /api/v1/cities/` - List cities
- `POST /api/v1/auth/register/` - Register
- `POST /api/v1/auth/login/` - Login

#### 8.3.2 Authenticated Endpoints (Any Role)
- `GET /api/v1/auth/profile/` - Get profile
- `PUT /api/v1/auth/profile/` - Update profile
- `POST /api/v1/bookings/` - Create booking (Users only)
- `GET /api/v1/bookings/` - List own bookings

#### 8.3.3 Host-Only Endpoints
- `POST /api/v1/hostels/` - Create hostel
- `PUT /api/v1/hostels/{id}/` - Update own hostel
- `DELETE /api/v1/hostels/{id}/` - Delete own hostel
- `GET /api/v1/bookings/host-requests/` - View booking requests
- `PATCH /api/v1/bookings/{id}/status/` - Update booking status

#### 8.3.4 Admin-Only Endpoints
- Django Admin Panel (`/admin/`)
- All CRUD operations on any resource

### 8.4 Permission Classes (Django)

```python
# backend/core/permissions.py
from rest_framework import permissions

class IsHostOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'host'

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.host == request.user
```

### 8.5 Frontend Route Protection

```typescript
// app/account/layout.tsx
export default function AccountLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

// app/account/hostels/new/page.tsx
export default function NewHostelPage() {
  return (
    <ProtectedRoute requiredRole="host">
      <HostelForm />
    </ProtectedRoute>
  );
}
```

### 8.6 Security Best Practices

1. **Password Security:**
   - Minimum 8 characters enforced
   - Hashed with PBKDF2 (Django default)
   - Never stored in plain text

2. **Token Security:**
   - HTTPS-only in production
   - Short-lived access tokens (60 min)
   - Refresh tokens rotated on use
   - Tokens invalidated on logout

3. **CORS Configuration:**
   - Whitelist specific origins
   - No wildcard (*) in production

4. **Input Validation:**
   - Django serializers validate all inputs
   - SQL injection prevented by ORM
   - XSS prevented by React's auto-escaping

5. **Rate Limiting:**
   - (Future) Implement rate limiting on auth endpoints
   - Prevent brute force attacks

---


## 9. Setup and Installation

### 9.1 Prerequisites

**Required Software:**
- **Node.js:** v18.0.0 or higher
- **Python:** 3.10 or higher
- **pip:** Python package manager
- **Git:** Version control

**Optional:**
- **PostgreSQL:** 14+ (for production)
- **VS Code:** Recommended IDE

### 9.2 Backend Setup (Django)

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd hostel-nepal
```

#### Step 2: Create Virtual Environment
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Environment Variables

Create `.env` file in `backend/` directory:

```env
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here-change-in-production
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite for development)
# No configuration needed for SQLite

# PostgreSQL (Production)
# DB_ENGINE=django.db.backends.postgresql
# DB_NAME=hostel_nepal
# DB_USER=postgres
# DB_PASSWORD=your-password
# DB_HOST=localhost
# DB_PORT=5432

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=10080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Site URL (for media files)
SITE_URL=http://localhost:8000
```

#### Step 5: Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Step 6: Create Superuser
```bash
python manage.py createsuperuser
# Enter email, full name, and password
```

#### Step 7: Load Sample Data (Optional)
```bash
python manage.py shell
>>> from core.seed import seed_data
>>> seed_data()
>>> exit()
```

#### Step 8: Run Development Server
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin/`

---

### 9.3 Frontend Setup (Next.js)

#### Step 1: Navigate to Project Root
```bash
cd ..  # From backend directory
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Environment Variables

Create `.env.local` file in project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Stripe (Public Key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Site Configuration
NEXT_PUBLIC_SITE_NAME=नेपाल Hostel Finder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Step 4: Run Development Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

### 9.4 Full Stack Development Workflow

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1/
- Django Admin: http://localhost:8000/admin/

---

### 9.5 Database Setup

#### 9.5.1 Development (SQLite)

SQLite is used by default. No additional setup required.

**Database file location:** `backend/db.sqlite3`

#### 9.5.2 Production (PostgreSQL)

**Install PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql
```

**Create Database:**
```bash
sudo -u postgres psql
CREATE DATABASE hostel_nepal;
CREATE USER hostel_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hostel_nepal TO hostel_user;
\q
```

**Update settings.py:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'hostel_nepal'),
        'USER': os.environ.get('DB_USER', 'hostel_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'your_password'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

**Run Migrations:**
```bash
python manage.py migrate
```

---

### 9.6 Common Issues & Troubleshooting

#### Issue 1: CORS Errors

**Symptom:** Frontend cannot connect to backend, CORS errors in browser console.

**Solution:**
1. Verify `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py`
2. Ensure frontend URL is included: `http://localhost:3000`
3. Restart Django server

#### Issue 2: JWT Token Expired

**Symptom:** API returns 401 Unauthorized after some time.

**Solution:**
1. Frontend should automatically refresh token
2. If not working, clear localStorage and login again
3. Check token expiry settings in `settings.py`

#### Issue 3: Image Upload Fails

**Symptom:** Hostel images not uploading.

**Solution:**
1. Ensure `MEDIA_ROOT` directory exists: `backend/media/`
2. Check file permissions
3. Verify `MEDIA_URL` in settings
4. Check Django is serving media files in development

#### Issue 4: Database Migration Errors

**Symptom:** Migration fails with integrity errors.

**Solution:**
```bash
# Reset migrations (development only!)
python manage.py migrate core zero
python manage.py migrate
```

#### Issue 5: Port Already in Use

**Symptom:** Cannot start server, port 3000 or 8000 in use.

**Solution:**
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

---

### 9.7 Testing the Setup

#### Backend Health Check:
```bash
curl http://localhost:8000/api/v1/cities/
```

Expected: JSON response with cities list

#### Frontend Health Check:
1. Open http://localhost:3000
2. Should see landing page with hero section
3. Navigate to /hostels
4. Should see hostel listings

#### Authentication Test:
1. Register new account at /register
2. Login at /login
3. Should redirect to /account
4. Check localStorage for auth tokens

---


## 10. Payment Integration

### 10.1 Payment Gateway Overview

The platform supports two payment gateways:

1. **Stripe** - International credit/debit cards
2. **eSewa** - Nepal's leading digital wallet

### 10.2 Payment Flow

```
[User] → Select Hostel → Create Booking → Choose Payment Method
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                              [Stripe]              [eSewa]
                                    ↓                   ↓
                          Stripe Checkout      eSewa Portal
                                    ↓                   ↓
                          User Pays Card       User Pays Wallet
                                    ↓                   ↓
                          Webhook Callback    Callback URL
                                    ↓                   ↓
                          Verify Signature    Verify Transaction
                                    ↓                   ↓
                          Update Booking      Update Booking
                                    ↓                   ↓
                          Send Confirmation   Send Confirmation
                                    ↓                   ↓
                          [Booking Confirmed]
```

### 10.3 Stripe Integration

#### 10.3.1 Setup

**Install Stripe:**
```bash
pip install stripe
```

**Configuration:**
```python
# backend/config/settings.py
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')
```

#### 10.3.2 Create Checkout Session

```python
# backend/core/views.py
import stripe

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request, pk):
    booking = get_object_or_404(Booking, pk=pk, user=request.user)
    
    stripe.api_key = settings.STRIPE_SECRET_KEY
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'npr',
                'product_data': {
                    'name': f'Booking: {booking.hostel.name}',
                    'description': f'{booking.stay_type} stay from {booking.check_in} to {booking.check_out}',
                },
                'unit_amount': int(booking.total_amount * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=f'{settings.FRONTEND_URL}/bookings/{booking.id}/success',
        cancel_url=f'{settings.FRONTEND_URL}/bookings/{booking.id}/cancel',
        metadata={'booking_id': str(booking.id)}
    )
    
    return Response({'sessionId': session.id, 'url': session.url})
```

#### 10.3.3 Webhook Handler

```python
@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return Response({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError:
        return Response({'error': 'Invalid signature'}, status=400)
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        booking_id = session['metadata']['booking_id']
        
        booking = Booking.objects.get(id=booking_id)
        booking.payment_status = 'fully_paid'
        booking.status = 'confirmed'
        booking.save()
        
        # Create payment record
        Payment.objects.create(
            booking=booking,
            amount=booking.total_amount,
            method='stripe',
            status='completed',
            transaction_id=session['payment_intent'],
            paid_at=timezone.now()
        )
    
    return Response({'status': 'success'})
```

#### 10.3.4 Frontend Integration

```typescript
// lib/api/payments.ts
export const paymentsApi = {
  createStripeSession: async (bookingId: string) => {
    const response = await api.post<{ sessionId: string; url: string }>(
      `/payments/${bookingId}/checkout/`
    );
    return response;
  }
};

// Usage in component
const handleStripePayment = async () => {
  const { url } = await paymentsApi.createStripeSession(bookingId);
  window.location.href = url; // Redirect to Stripe Checkout
};
```

### 10.4 eSewa Integration

#### 10.4.1 eSewa Payment Flow

```
1. User selects eSewa payment
2. Backend generates payment signature
3. Frontend redirects to eSewa portal with payment details
4. User logs into eSewa and completes payment
5. eSewa redirects back to success/failure URL
6. Backend verifies transaction with eSewa API
7. Update booking status
```

#### 10.4.2 Configuration

```python
# backend/config/settings.py
ESEWA_MERCHANT_ID = os.environ.get('ESEWA_MERCHANT_ID')
ESEWA_SECRET_KEY = os.environ.get('ESEWA_SECRET_KEY')
ESEWA_SUCCESS_URL = f'{FRONTEND_URL}/payments/esewa/success'
ESEWA_FAILURE_URL = f'{FRONTEND_URL}/payments/esewa/failure'
```

#### 10.4.3 Generate Payment Request

```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def esewa_payment(request, pk):
    booking = get_object_or_404(Booking, pk=pk, user=request.user)
    
    payment_data = {
        'amt': str(booking.total_amount),
        'psc': '0',
        'pdc': '0',
        'txAmt': '0',
        'tAmt': str(booking.total_amount),
        'pid': str(booking.id),
        'scd': settings.ESEWA_MERCHANT_ID,
        'su': settings.ESEWA_SUCCESS_URL,
        'fu': settings.ESEWA_FAILURE_URL
    }
    
    return Response({'data': payment_data, 'url': 'https://uat.esewa.com.np/epay/main'})
```

#### 10.4.4 Verify Payment

```python
@api_view(['GET'])
def esewa_verify(request):
    oid = request.GET.get('oid')
    amt = request.GET.get('amt')
    refId = request.GET.get('refId')
    
    # Verify with eSewa API
    verify_url = f'https://uat.esewa.com.np/epay/transrec'
    params = {
        'amt': amt,
        'rid': refId,
        'pid': oid,
        'scd': settings.ESEWA_MERCHANT_ID
    }
    
    response = requests.get(verify_url, params=params)
    
    if 'Success' in response.text:
        booking = Booking.objects.get(id=oid)
        booking.payment_status = 'fully_paid'
        booking.status = 'confirmed'
        booking.save()
        
        Payment.objects.create(
            booking=booking,
            amount=amt,
            method='esewa',
            status='completed',
            transaction_id=refId,
            paid_at=timezone.now()
        )
        
        return Response({'status': 'success'})
    
    return Response({'status': 'failed'}, status=400)
```

### 10.5 Payment Amount Calculation

#### Short Stay (Per Night):
```python
total_nights = (check_out - check_in).days
total_amount = price_per_night * total_nights
payment_required = total_amount  # 100% upfront
```

#### Long Stay (Per Month):
```python
total_months = calculate_months(check_in, check_out)
total_amount = price_per_month * total_months
advance_amount = total_amount * 0.30  # 30% advance
remaining_amount = total_amount * 0.70  # 70% on check-in
```

### 10.6 Refund Policy

**Short Stay:**
- Cancel 7+ days before: 100% refund
- Cancel 3-6 days before: 50% refund
- Cancel <3 days before: No refund

**Long Stay:**
- Cancel before check-in: Advance refunded minus 10% processing fee
- Cancel after check-in: No refund

### 10.7 Payment Security

1. **PCI DSS Compliance:** Handled by Stripe (no card data stored)
2. **Webhook Signature Verification:** All webhooks verified
3. **HTTPS Only:** All payment communication over HTTPS
4. **Transaction Logging:** All payments logged with timestamps
5. **Idempotency:** Prevent duplicate payments with transaction IDs

---


## 11. Future Improvements

### 11.1 Phase 2 Features (Short-term: 3-6 months)

#### 11.1.1 Enhanced Search & Discovery
- **Advanced Filters:**
  - Distance from specific location (university, bus station)
  - Availability calendar view
  - Room type selection (single, double, dormitory)
  - Verified hostels badge
  
- **Map Integration:**
  - Interactive map view with hostel markers
  - Google Maps / OpenStreetMap integration
  - Directions and nearby places
  
- **Smart Recommendations:**
  - "Similar hostels" based on user preferences
  - "Frequently booked together" suggestions
  - Personalized recommendations based on booking history

#### 11.1.2 Communication Features
- **In-App Messaging:**
  - Direct chat between users and hosts
  - Real-time notifications
  - Message history and attachments
  
- **Notifications System:**
  - Email notifications for booking updates
  - SMS notifications for important events
  - Push notifications (PWA)
  - Notification preferences management

#### 11.1.3 Enhanced Booking Management
- **Booking Modifications:**
  - Change dates (subject to availability)
  - Extend stay
  - Add extra services
  
- **Booking Calendar:**
  - Visual calendar for hosts
  - Block dates for maintenance
  - Bulk availability updates
  
- **Waitlist System:**
  - Join waitlist when hostel is full
  - Auto-notify when beds become available

#### 11.1.4 Review System Enhancements
- **Photo Reviews:**
  - Users can upload photos with reviews
  - Photo gallery from real guests
  
- **Review Verification:**
  - Only verified bookings can review
  - "Verified Stay" badge
  
- **Host Responses:**
  - Hosts can respond to reviews
  - Show host engagement

#### 11.1.5 Payment Enhancements
- **Multiple Payment Options:**
  - Khalti integration (Nepal)
  - IME Pay integration (Nepal)
  - Bank transfer option
  
- **Payment Plans:**
  - Installment payments for long stays
  - Auto-debit for monthly payments
  
- **Digital Receipts:**
  - PDF invoice generation
  - Email receipts automatically
  - Tax invoice for businesses

---

### 11.2 Phase 3 Features (Medium-term: 6-12 months)

#### 11.2.1 Mobile Applications
- **Native Mobile Apps:**
  - iOS app (Swift/SwiftUI)
  - Android app (Kotlin/Jetpack Compose)
  - React Native alternative for faster development
  
- **Mobile-Specific Features:**
  - Offline mode for viewing saved hostels
  - Camera integration for document upload
  - Location-based push notifications
  - QR code check-in

#### 11.2.2 Advanced Analytics
- **User Dashboard Analytics:**
  - Booking history visualization
  - Spending analysis
  - Favorite locations
  
- **Host Dashboard Analytics:**
  - Occupancy rate trends
  - Revenue analytics
  - Booking source tracking
  - Seasonal demand patterns
  - Competitor analysis
  
- **Admin Analytics:**
  - Platform-wide statistics
  - User growth metrics
  - Revenue reports
  - Popular cities and hostels

#### 11.2.3 Loyalty & Rewards Program
- **Points System:**
  - Earn points on bookings
  - Redeem points for discounts
  - Referral bonuses
  
- **Membership Tiers:**
  - Bronze, Silver, Gold, Platinum
  - Tier-based benefits
  - Priority booking for members
  
- **Referral Program:**
  - Refer friends and earn credits
  - Host referral program
  - Affiliate marketing system

#### 11.2.4 Smart Pricing
- **Dynamic Pricing:**
  - Seasonal pricing adjustments
  - Demand-based pricing
  - Last-minute deals
  
- **Pricing Recommendations:**
  - AI-powered price suggestions for hosts
  - Competitor price analysis
  - Occupancy optimization

#### 11.2.5 Verification & Trust
- **Identity Verification:**
  - Government ID verification
  - Phone number verification
  - Email verification
  
- **Hostel Verification:**
  - Physical inspection by team
  - License verification
  - Safety compliance checks
  
- **Background Checks:**
  - Optional background checks for long-term stays
  - Reference system

---

### 11.3 Phase 4 Features (Long-term: 12+ months)

#### 11.3.1 AI & Machine Learning
- **Smart Search:**
  - Natural language search
  - Voice search integration
  - Image-based search (find similar hostels)
  
- **Chatbot Assistant:**
  - 24/7 customer support bot
  - Booking assistance
  - FAQ automation
  
- **Fraud Detection:**
  - AI-powered fraud detection
  - Suspicious activity alerts
  - Automated risk scoring

#### 11.3.2 Marketplace Features
- **Additional Services:**
  - Meal plans
  - Laundry services
  - Airport pickup
  - Tour packages
  
- **Local Experiences:**
  - Partner with local tour operators
  - Cultural experiences
  - Adventure activities
  
- **Co-working Spaces:**
  - Day passes for co-working
  - Meeting room bookings
  - Event space rentals

#### 11.3.3 Social Features
- **User Profiles:**
  - Public user profiles
  - Travel stories and blogs
  - Photo galleries
  
- **Community Forum:**
  - Discussion boards
  - Travel tips and advice
  - Hostel recommendations
  
- **Events & Meetups:**
  - Hostel-organized events
  - Traveler meetups
  - Cultural events calendar

#### 11.3.4 International Expansion
- **Multi-Language Support:**
  - Nepali, English, Hindi, Chinese
  - Auto-translation for reviews
  - Localized content
  
- **Multi-Currency:**
  - Support for USD, EUR, INR, CNY
  - Real-time exchange rates
  - Currency conversion
  
- **Regional Customization:**
  - Country-specific features
  - Local payment gateways
  - Regional regulations compliance

#### 11.3.5 Sustainability Features
- **Eco-Friendly Badge:**
  - Certify eco-friendly hostels
  - Sustainability ratings
  - Green practices showcase
  
- **Carbon Footprint Tracking:**
  - Calculate travel carbon footprint
  - Offset options
  - Eco-friendly travel tips

---

### 11.4 Technical Improvements

#### 11.4.1 Performance Optimization
- **Frontend:**
  - Implement TanStack Query for data caching
  - Image optimization with Next.js Image
  - Code splitting and lazy loading
  - Service Worker for offline support
  
- **Backend:**
  - Database query optimization
  - Redis caching layer
  - CDN for static assets
  - Database indexing improvements
  
- **Infrastructure:**
  - Load balancing
  - Auto-scaling
  - Database replication
  - Monitoring and alerting

#### 11.4.2 Testing & Quality
- **Automated Testing:**
  - Unit tests (Jest, Pytest)
  - Integration tests
  - End-to-end tests (Playwright)
  - API tests (Postman/Newman)
  
- **Code Quality:**
  - ESLint and Prettier enforcement
  - Pre-commit hooks
  - Code review process
  - SonarQube integration

#### 11.4.3 DevOps & CI/CD
- **Continuous Integration:**
  - GitHub Actions / GitLab CI
  - Automated testing on PR
  - Code coverage reports
  
- **Continuous Deployment:**
  - Automated deployments
  - Staging environment
  - Blue-green deployments
  - Rollback capabilities
  
- **Monitoring:**
  - Application monitoring (Sentry)
  - Performance monitoring (New Relic)
  - Log aggregation (ELK Stack)
  - Uptime monitoring

#### 11.4.4 Security Enhancements
- **Advanced Security:**
  - Two-factor authentication (2FA)
  - Rate limiting on all endpoints
  - DDoS protection
  - Regular security audits
  
- **Compliance:**
  - GDPR compliance (if expanding to EU)
  - Data encryption at rest
  - Regular backups
  - Disaster recovery plan

---

### 11.5 Business & Marketing Features

#### 11.5.1 Marketing Tools
- **SEO Optimization:**
  - Dynamic meta tags
  - Structured data (Schema.org)
  - Sitemap generation
  - Blog/content marketing
  
- **Email Marketing:**
  - Newsletter system
  - Promotional campaigns
  - Abandoned booking reminders
  - Personalized recommendations

#### 11.5.2 Business Intelligence
- **Reporting Dashboard:**
  - Custom report builder
  - Export to Excel/PDF
  - Scheduled reports
  
- **A/B Testing:**
  - Feature flag system
  - Experiment tracking
  - Conversion optimization

#### 11.5.3 Partner Program
- **University Partnerships:**
  - Bulk booking discounts
  - Student verification
  - Campus ambassadors
  
- **Corporate Partnerships:**
  - Business travel packages
  - Corporate accounts
  - Invoice billing

---

### 11.6 Priority Roadmap

**Q2 2026 (April - June):**
- Map integration
- In-app messaging
- Email notifications
- Photo reviews

**Q3 2026 (July - September):**
- Mobile app development
- Advanced analytics
- Khalti/IME Pay integration
- Booking modifications

**Q4 2026 (October - December):**
- Loyalty program
- Dynamic pricing
- Identity verification
- Mobile app launch

**2027:**
- AI features
- International expansion
- Marketplace features
- Social features

---


## 12. Appendix & References

### 12.1 Technology Documentation

#### Frontend Technologies
- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion/

#### Backend Technologies
- **Django:** https://docs.djangoproject.com/
- **Django REST Framework:** https://www.django-rest-framework.org/
- **Simple JWT:** https://django-rest-framework-simplejwt.readthedocs.io/
- **PostgreSQL:** https://www.postgresql.org/docs/

#### Payment Gateways
- **Stripe:** https://stripe.com/docs
- **eSewa:** https://developer.esewa.com.np/

### 12.2 API Libraries & Tools

#### Development Tools
- **Postman:** API testing and documentation
- **VS Code:** Recommended IDE
- **Git:** Version control
- **pgAdmin:** PostgreSQL management (optional)

#### Python Packages
```
Django==5.0+
djangorestframework==3.15+
djangorestframework-simplejwt==5.3+
django-cors-headers==4.3+
Pillow==10.0+
python-decouple==3.8+
psycopg2-binary==2.9+
stripe==5.0+
```

#### Node Packages
```
next==16.1.6
react==19.2.3
typescript==5.x
tailwindcss==4.x
framer-motion==12.34.3
lucide-react==0.575.0
clsx==2.1.1
```

### 12.3 Design Resources

#### Color Palette
- **Primary (Emerald):** #10b981, #059669, #047857
- **Secondary (Zinc):** #f4f4f5, #e4e4e7, #d4d4d8
- **Accent (Teal):** #14b8a6
- **Error:** #ef4444
- **Success:** #22c55e
- **Warning:** #f59e0b

#### Typography
- **Font Family:** System fonts (Inter, SF Pro, Segoe UI)
- **Headings:** Bold, 600-800 weight
- **Body:** Regular, 400 weight
- **Small Text:** 14px, 500 weight

#### Spacing Scale
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px

### 12.4 Environment Variables Reference

#### Backend (.env)
```env
# Django Core
DJANGO_SECRET_KEY=<random-secret-key>
DJANGO_DEBUG=True|False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=hostel_nepal
DB_USER=postgres
DB_PASSWORD=<password>
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=10080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# eSewa
ESEWA_MERCHANT_ID=<merchant-id>
ESEWA_SECRET_KEY=<secret-key>

# URLs
FRONTEND_URL=http://localhost:3000
SITE_URL=http://localhost:8000
```

#### Frontend (.env.local)
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Site
NEXT_PUBLIC_SITE_NAME=नेपाल Hostel Finder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 12.5 Database Backup & Restore

#### Backup SQLite (Development)
```bash
# Backup
cp backend/db.sqlite3 backend/db.sqlite3.backup

# Restore
cp backend/db.sqlite3.backup backend/db.sqlite3
```

#### Backup PostgreSQL (Production)
```bash
# Backup
pg_dump -U hostel_user -h localhost hostel_nepal > backup.sql

# Restore
psql -U hostel_user -h localhost hostel_nepal < backup.sql
```

### 12.6 Deployment Checklist

#### Pre-Deployment
- [ ] Update `DJANGO_SECRET_KEY` to production value
- [ ] Set `DJANGO_DEBUG=False`
- [ ] Configure production database (PostgreSQL)
- [ ] Set up media file storage (S3/Cloudinary)
- [ ] Configure CORS for production domain
- [ ] Update `ALLOWED_HOSTS` with production domain
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure environment variables on hosting platform
- [ ] Run database migrations
- [ ] Collect static files (`python manage.py collectstatic`)
- [ ] Create superuser account
- [ ] Test all critical user flows

#### Post-Deployment
- [ ] Monitor error logs (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure automated backups
- [ ] Test payment gateways in production
- [ ] Verify email notifications
- [ ] Check performance metrics
- [ ] Set up analytics (Google Analytics)
- [ ] Configure CDN for static assets
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags

### 12.7 Common Commands Reference

#### Django Commands
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Collect static files
python manage.py collectstatic

# Django shell
python manage.py shell

# Create app
python manage.py startapp <app_name>

# Run tests
python manage.py test
```

#### Next.js Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

#### Git Commands
```bash
# Clone repository
git clone <url>

# Create branch
git checkout -b feature/new-feature

# Stage changes
git add .

# Commit changes
git commit -m "Description"

# Push to remote
git push origin feature/new-feature

# Pull latest changes
git pull origin main

# Merge branch
git merge feature/new-feature
```

### 12.8 Support & Contact

#### Project Repository
- **GitHub:** [Repository URL]
- **Issues:** [Issues URL]
- **Wiki:** [Wiki URL]

#### Documentation
- **API Docs:** http://localhost:8000/api/docs/ (if configured)
- **Project Docs:** This document

#### Team Contacts
- **Project Lead:** [Name] - [Email]
- **Backend Developer:** [Name] - [Email]
- **Frontend Developer:** [Name] - [Email]
- **DevOps:** [Name] - [Email]

### 12.9 License & Legal

#### Software License
This project is proprietary software. All rights reserved.

#### Third-Party Licenses
- Django: BSD License
- React: MIT License
- Next.js: MIT License
- Tailwind CSS: MIT License
- Other dependencies: See package.json and requirements.txt

#### Privacy Policy
Users' personal data is handled according to Nepal's data protection regulations and international best practices.

#### Terms of Service
Users must agree to terms of service before using the platform.

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 9, 2026 | Development Team | Initial comprehensive documentation |

---

## Glossary

**API** - Application Programming Interface  
**CORS** - Cross-Origin Resource Sharing  
**CRUD** - Create, Read, Update, Delete  
**DRF** - Django REST Framework  
**JWT** - JSON Web Token  
**MVP** - Minimum Viable Product  
**ORM** - Object-Relational Mapping  
**REST** - Representational State Transfer  
**SPA** - Single Page Application  
**SSR** - Server-Side Rendering  
**UUID** - Universally Unique Identifier  

---

**End of Documentation**

---

*This documentation is a living document and will be updated as the project evolves. For the latest version, please refer to the project repository.*

