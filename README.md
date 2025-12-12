# Travel Buddy Frontend

Your ultimate travel companion platform. Connect with verified travelers, plan shared adventures, and explore the world together safely.

## 🌍 Overview

Travel Buddy is a comprehensive web application that enables users to:
- **Find Travel Companions** - Discover and match with travelers who share your interests and travel style
- **Plan Together** - Create and manage travel plans with real-time collaboration
- **Join Meetups** - Organize and attend meetups at travel destinations
- **Share Experiences** - Create posts, leave reviews, and build a trusted travel community
- **Secure Payments** - Subscribe to premium plans with verified traveler badges

**Current Status**: ~80% Complete

## 🚀 Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router and Server Components
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Node.js/Bun** - Runtime environment

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization library

### Authentication & State
- **NextAuth.js** - Authentication and session management
- **Next-themes** - Dark mode support
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend Integration
- **Server Actions** - Type-safe server-client communication
- **Fetch API** - HTTP requests
- **Next.js Image Optimization** - Responsive image handling

### Additional Tools
- **Stripe** - Payment processing
- **Sonner** - Toast notifications
- **dnd-kit** - Drag-and-drop functionality
- **TanStack React Table** - Advanced table management
- **date-fns** - Date utilities

## 📋 Prerequisites

Before getting started, ensure you have:
- **Node.js** 18+ or **Bun** package manager
- **Git** for version control
- A backend API server running (TravelBuddy API)
- **Stripe** account for payment processing
- **NextAuth.js** credentials configured

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/sufiansar/TravelBuddyFrontend.git
cd TravelBuddyFrontend
```

### 2. Install Dependencies
Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_BASE_API=http://localhost:5000/api

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# OAuth Providers (if applicable)
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

### 4. Run the Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (public)/                # Public routes (auth, home, explore)
│   │   ├── (auth)/              # Login/Register pages
│   │   ├── contact/             # Contact form page
│   │   ├── explore/             # Discover travelers and plans
│   │   ├── packages/            # Subscription plans page
│   │   ├── post/                # Travel posts
│   │   ├── travel-plans/        # Browse travel plans
│   │   └── page.tsx             # Home page
│   ├── (commonLayout)/          # Shared layout routes
│   │   ├── profile/             # User profiles
│   │   └── users/               # User directory/management
│   ├── (private)/               # Authenticated routes
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── page.tsx         # Admin overview
│   │   │   └── [modules]/       # Admin modules
│   │   └── dashboard/           # User dashboard
│   │       ├── matches/         # Travel companion matches
│   │       ├── meetups/         # Meetup management
│   │       ├── payments/        # Subscription & billing
│   │       ├── reviews/         # User reviews
│   │       ├── travel-plans/    # Travel plan management
│   │       └── page.tsx         # Dashboard overview
│   ├── layout.tsx               # Root layout
│   └── error.tsx                # Error boundary
├── actions/                     # Server actions (data fetching)
│   ├── admin/                   # Admin operations
│   ├── explore/                 # Explore features
│   ├── matches/                 # Matching algorithms
│   ├── meetups/                 # Meetup operations
│   ├── payments/                # Payment operations
│   ├── posts/                   # Post operations
│   ├── reviews/                 # Review operations
│   ├── travelPlans/             # Travel plan operations
│   ├── users/                   # User operations
│   ├── shared/                  # Shared utilities
│   │   ├── apiClient.ts         # API client
│   │   └── types.ts             # Shared types
│   └── index.ts                 # Central exports
├── components/                  # Reusable React components
│   ├── modules/                 # Feature-specific components
│   │   ├── Admin/               # Admin UI components
│   │   ├── Dashboard/           # Dashboard components
│   │   ├── Explore/             # Explore features
│   │   ├── MeetUp/              # Meetup components
│   │   ├── Payment/             # Payment/billing components
│   │   ├── posts/               # Post components
│   │   ├── Review/              # Review components
│   │   ├── TravlePlan/          # Travel plan components
│   │   ├── User/                # User profile components
│   │   └── match/               # Matching components
│   ├── ui/                      # Shadcn/ui components
│   ├── PublicNavbar/            # Navigation bar
│   ├── Footer.tsx               # Footer with contact support
│   ├── login-form.tsx           # Login form
│   ├── RegisterUser.tsx         # Registration form
│   ├── modeToggle.tsx           # Dark mode toggle
│   └── theme-provider.tsx       # Theme context
├── helpers/                     # Utility functions
│   ├── authOptions.ts           # NextAuth configuration
│   └── userSession.ts           # Session helpers
├── hooks/                       # Custom React hooks
│   └── use-mobile.ts            # Mobile detection
├── lib/                         # Library utilities
│   ├── adminNavItem.config.ts   # Admin navigation config
│   ├── auth-utils.ts            # Auth utilities
│   ├── commonNavItems.config.ts # Common nav items
│   ├── navItem.confiq.ts        # Main nav configuration
│   ├── userNavItems.config.ts   # User nav items
│   ├── serverFetch.ts           # Server-side fetch wrapper
│   ├── types.ts                 # Shared types
│   └── utils.ts                 # General utilities
├── providers/                   # React context providers
│   └── AuthProvider.tsx         # Auth context
├── types/                       # TypeScript interfaces
│   ├── admin.interface.ts       # Admin types
│   ├── dashboard.interface.ts   # Dashboard types
│   ├── explore.interface.ts     # Explore types
│   ├── meetup.interface.ts      # Meetup types
│   ├── payment.interface.ts     # Payment types
│   ├── post.interface.ts        # Post types
│   ├── review.types.ts          # Review types
│   ├── travlePlan.interface.ts  # Travel plan types
│   └── user.interface.ts        # User types
├── assets/                      # Static assets
└── proxy.ts                     # API proxy configuration

public/
├── assets/                      # Public images and media
│   ├── Logo.jpg
│   ├── Login.jpg
│   └── Register.jpg
└── favicon.ico
```

## 🎯 Key Features

### 1. **Authentication & Authorization**
- Secure login/registration with NextAuth.js
- Role-based access control (User, Admin, Super Admin)
- Session management and JWT tokens
- Profile management and account settings

### 2. **Travel Plan Management**
- Create, edit, and delete travel plans
- Set destination, dates, budget, and travel type
- Visibility controls (private, public, shareable)
- Request system for plan participation
- Real-time updates and notifications

### 3. **Traveler Matching**
- Smart algorithm-based compatibility matching
- Filter by interests, travel style, and destinations
- View traveler profiles with verification badges
- Connection requests and messaging

### 4. **Meetups & Events**
- Organize meetups at travel destinations
- Join meetups with RSVP functionality
- Meetup details, members, and communications
- Activity tracking for meetups attended/hosted

### 5. **Community Features**
- Create and share travel posts
- Comments and social engagement
- Leave and view reviews for other travelers
- Build reputation with verified badges

### 6. **Payment & Subscriptions**
- Stripe integration for secure payments
- Monthly and yearly subscription plans
- Verified traveler badge after subscription
- Payment history and invoice management
- Billing information management

### 7. **Admin Dashboard**
- User management and moderation
- Subscription and payment tracking
- Activity monitoring and analytics
- Content management
- Travel plan and request approvals

### 8. **Public Pages**
- Home page with trending travelers and plans
- Explore page with advanced filtering
- Public profiles with reviews and ratings
- Subscription packages display
- Contact and support page
- Travel plans browsing

## 🔧 Development Guide

### Running the Development Server
```bash
bun dev
```
The app will be available at `http://localhost:3000`.

### Building for Production
```bash
bun run build
bun run start
```

### Linting
```bash
bun run lint
```

### File Naming Conventions
- **Page components**: `page.tsx`
- **Layout components**: `layout.tsx`
- **Client components**: Add `"use client"` directive
- **Server components**: Default (no directive)
- **Components**: PascalCase (e.g., `UserCard.tsx`)
- **Utilities**: camelCase (e.g., `authUtils.ts`)

### Component Pattern
```tsx
// Server Component (default)
import { getUser } from "@/actions";

export default async function Page() {
  const user = await getUser();
  return <div>{user.name}</div>;
}

// Client Component
"use client";

import { useState } from "react";

export function UserForm() {
  const [name, setName] = useState("");
  return <form>{/* ... */}</form>;
}
```

### Server Actions Pattern
```typescript
// src/actions/users/actions.ts
"use server";

import { makeApiCall } from "@/actions/apiUtils";

export async function getUser(userId: string) {
  return makeApiCall(`/users/${userId}`, { method: "GET" });
}
```

### API Integration
```typescript
// Using server actions
import { getUser } from "@/actions";

const user = await getUser("123");

// Direct fetch
const response = await fetch(
  `${process.env.NEXT_PUBLIC_BASE_API}/users/123`
);
const data = await response.json();
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Using Tailwind's responsive classes:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Single column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## 🎨 Theming

Dark mode support via `next-themes`:
```tsx
// In components
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // ...
}
```

## 📊 State Management

### Client State
- **React hooks**: `useState`, `useEffect`, `useTransition`
- **React Hook Form**: For complex form states
- **URL Search Params**: For pagination, filtering

### Server State
- **Server Actions**: Primary data fetching mechanism
- **Revalidation**: `revalidatePath()` for cache invalidation

## 🔐 Security

- **Authentication**: NextAuth.js with secure session handling
- **Authorization**: Role-based access control on routes
- **Input Validation**: Zod schema validation
- **API Protection**: CORS and request validation
- **HTTPS**: All production requests over HTTPS
- **Environment Variables**: Sensitive data in `.env.local`

## 🚨 Error Handling

```typescript
// Server actions with error handling
export async function getUser(id: string) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) throw new Error("User not found");
    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// In components
const result = await getUser("123");
if (!result.success) {
  toast.error(result.error);
}
```

## 🧪 Testing

Currently, the project uses manual testing. Consider adding:
- **Jest**: Unit testing
- **Playwright**: E2E testing
- **React Testing Library**: Component testing

## 📈 Performance Optimization

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with App Router
- **Streaming**: React Server Components streaming
- **Caching**: Server-side data caching with revalidation
- **Bundle Analysis**: Monitor with `@next/bundle-analyzer`

## 🐛 Common Issues & Solutions

### Issue: "NEXTAUTH_SECRET is required"
**Solution**: Add `NEXTAUTH_SECRET` to `.env.local`

### Issue: API requests failing
**Solution**: Check `NEXT_PUBLIC_BASE_API` is correctly set

### Issue: Images not loading
**Solution**: Ensure images are in `public/assets/` directory

### Issue: "event handlers cannot be passed to Client Component"
**Solution**: Add `"use client"` directive to components with event handlers

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [NextAuth.js Guide](https://next-auth.js.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🗺️ Roadmap & Remaining Work

### In Progress (20-22% Remaining)
- [ ] **Payment Integration** - Complete Stripe/SSLCommerz flow
- [ ] **Admin Dashboard** - Full CRUD for users, plans, activity
- [ ] **Public Profiles** - User profiles with reviews and history
- [ ] **Navbar Refinement** - Role-based navigation items
- [ ] **Home Personalization** - Recommended matches for logged-in users

### Completed Features (78-80%)
- ✅ Authentication & Authorization
- ✅ Travel plan management
- ✅ Traveler matching
- ✅ Meetup organization
- ✅ Posts & community
- ✅ Reviews system
- ✅ Basic admin dashboard
- ✅ Subscription plans display
- ✅ Contact form & support
- ✅ Footer with embedded contact

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a pull request

## 📝 License

This project is proprietary and confidential.

## 👥 Team

- **Developer**: Sufian Sar
- **Project**: Travel Buddy Platform

## 📞 Support

For support, please use the contact form on the platform or email support@travelbuddy.com

## 🎉 Acknowledgments

- [Vercel](https://vercel.com) for Next.js
- [Shadcn](https://shadcn.com) for UI components
- [Stripe](https://stripe.com) for payment processing

---

**Last Updated**: December 2025
**Version**: 0.1.0
