# Travel Buddy Frontend

Your ultimate travel companion platform. Connect with verified travelers, plan shared adventures, and explore the world together safely.

## 🌍 Overview

Travel Buddy enables users to:

- **Find Travel Companions** - Discover and match with travelers
- **Plan Together** - Create and manage travel plans
- **Join Meetups** - Organize meetups at destinations
- **Share Experiences** - Create posts, leave reviews, and build community
- **Secure Payments** - Subscribe to premium plans with Stripe

**Current Status**: Production Ready - Full Admin Dashboard with Reviews Management

## 🚀 Tech Stack

- **Next.js 16.0.7** - React framework with App Router, Server Components, Turbopack
- **React 19.2** - UI library with concurrent features
- **TypeScript** - Type-safe development with strict mode
- **Bun** - Fast runtime and package manager
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React component library
- **NextAuth.js 4.24** - Authentication and session management
- **Stripe 14.14** - Payment processing
- **Recharts** - Data visualization
- **React Hook Form** - Form state management
- **Zod** - Schema validation

## 📋 Prerequisites

- **Node.js** 18+ or **Bun** package manager
- **Git** for version control
- Backend API server running (TravelBuddy API)
- **Stripe** account for payments
- **NextAuth.js** credentials configured

## 🛠️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/sufiansar/TravelBuddyFrontend.git
cd TravelBuddyFrontend
```

### 2. Install Dependencies

```bash
bun install
# or npm install
```

### 3. Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with: openssl-rand-hex-32>
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

### 4. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (public)/                # Public routes (auth, home, explore)
│   ├── (commonLayout)/          # Shared layout (profiles, users)
│   ├── (private)/               # Authenticated routes
│   │   ├── admin/               # Admin Dashboard (COMPLETE)
│   │   │   ├── users/           # User management
│   │   │   ├── travel-plans/    # Travel plan management
│   │   │   ├── reviews/         # Review management (NEW)
│   │   │   ├── activity/        # Activity logs
│   │   │   ├── payments/        # Payments
│   │   │   ├── subscriptions/   # Subscriptions
│   │   │   ├── meetups/         # Meetups
│   │   │   ├── roles/           # Roles
│   │   │   └── settings/        # Settings
│   │   └── dashboard/           # User Dashboard
│   │       ├── matches/         # Travel companions
│   │       ├── meetups/         # Meetup management
│   │       ├── payments/        # Billing
│   │       ├── reviews/         # User reviews
│   │       ├── travel-plans/    # Travel plans
│   │       └── post/            # Posts
│   ├── api/                      # API routes
│   └── layout.tsx               # Root layout
├── actions/                     # Server Actions
│   ├── admin/                   # Admin operations
│   ├── explore/                 # Explore features
│   ├── matches/                 # Matching
│   ├── meetups/                 # Meetups
│   ├── payments/                # Payments
│   ├── posts/                   # Posts
│   ├── reviews/                 # Reviews
│   ├── travelPlans/             # Travel plans
│   ├── users/                   # Users
│   └── shared/                  # Shared utilities
├── components/                  # Reusable Components
│   ├── modules/
│   │   ├── Admin/               # Admin components
│   │   ├── Dashboard/           # Dashboard components
│   │   ├── Explore/             # Explore components
│   │   └── ...
│   ├── ui/                      # Shadcn/ui components
│   └── ...
├── helpers/                     # Helper functions
├── hooks/                       # Custom hooks
├── lib/                         # Utilities & config
├── providers/                   # React contexts
├── types/                       # TypeScript interfaces
└── proxy.ts                     # API proxy
```

## 🎯 Key Features

### 1. Authentication & Authorization ✅

- Secure JWT-based login/registration with NextAuth.js
- Role-based access control (User, Admin, Super Admin)
- Session management with automatic token refresh
- Protected routes based on user roles

### 2. Travel Plan Management ✅

- Create, edit, delete travel plans
- Set destination, dates, budget, travel type
- Visibility controls (private, public, shareable)
- Travel plan matching based on filters

### 3. Traveler Matching ✅

- Smart algorithm-based compatibility matching
- Filter by interests, travel style, destinations
- View traveler profiles with verification badges

### 4. Meetups & Events ✅

- Organize meetups at travel destinations
- Join with RSVP functionality
- Activity tracking and calendar view

### 5. Community Features ✅

- Create and share travel posts
- Comments and social engagement
- Leave and view reviews
- Build reputation with verified badges

### 6. Payment & Subscriptions ✅

- Stripe integration for secure payments
- Monthly and yearly subscription plans
- Verified traveler badge after subscription
- Payment history and invoice management

### 7. Admin Dashboard ⭐ COMPLETE

- **Dashboard Overview**: Real-time statistics, revenue charts, activity feed
- **User Management**: View, filter, edit, delete users with advanced options
- **Travel Plans**: Manage plans with filters and detailed views
- **Reviews (NEW)**: Search, filter, sort, export reviews with detail pages
- **Activity Logs**: Timeline with filtering and export
- **Payments**: Transaction tracking and history
- **Subscriptions**: Subscription management and billing
- **Settings**: Platform configuration and security
- **Admin Features**: RBAC, responsive design, CSV export, real-time updates

### 8. Public Pages ✅

- Home page with trending travelers
- Explore page with filtering
- Public profiles with reviews
- Subscription packages display
- Contact form & support

## 🔧 Development Guide

### Running Development Server

```bash
bun dev
```

Available at `http://localhost:3000`

### Building for Production

```bash
bun run build
bun run start
```

### File Naming Conventions

- **Page components**: `page.tsx` (Next.js App Router)
- **Layout components**: `layout.tsx`
- **Client components**: Add `"use client"` directive
- **Server components**: Default (no directive)
- **Components**: PascalCase (e.g., `UserCard.tsx`)
- **Utilities**: camelCase (e.g., `authUtils.ts`)

### Component Patterns

**Server Component (Default)**

```tsx
import { getUser } from "@/actions";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return <div>{user?.name}</div>;
}
```

**Client Component**

```tsx
"use client";
import { useState } from "react";

export function UserForm() {
  const [name, setName] = useState("");
  return <form>{/* ... */}</form>;
}
```

**Server Action**

```typescript
"use server";
import { makeApiCall } from "@/actions/apiUtils";

export async function getUser(userId: string) {
  try {
    return await makeApiCall(`/users/${userId}`, { method: "GET" });
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### API Integration

```typescript
// Using server actions
import { getUser } from "@/actions";
const user = await getUser("123");

// Direct fetch
const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/123`);
const data = await response.json();

// API Client
import { apiClient } from "@/actions/shared/apiClient";
const result = await apiClient("/users/123", { method: "GET" });
```

## 📱 Responsive Design

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## 🎨 Theming

Dark mode via `next-themes`:

```tsx
"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  );
}
```

## 📊 State Management

**Client State**: React hooks, React Hook Form, URL search params, React Context
**Server State**: Server Actions, revalidatePath(), ISR

## 🔐 Security

- NextAuth.js with secure session handling
- Role-based access control (RBAC)
- Zod schema validation
- CORS and request validation
- HTTPS for production
- Secure cookie-based session storage
- React's XSS protection
- NextAuth.js CSRF tokens

## 🚨 Error Handling

```typescript
export async function getUser(id: string) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) throw new Error(`User not found`);
    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const result = await getUser("123");
if (!result.success) {
  toast.error(result.error);
}
```

## 📈 Performance Optimization

- Next.js Image component with optimization
- Automatic code splitting
- React Server Components streaming
- Server-side data caching
- Turbopack for 5x faster builds
- Dynamic imports for large components

## 🐛 Common Issues & Solutions

**Issue**: NEXTAUTH_SECRET is required

```bash
openssl rand -hex 32
```

**Issue**: API requests failing with 401

- Check NEXTAUTH_URL matches production domain
- Verify token is being sent
- Check token hasn't expired

**Issue**: Images not loading

- Ensure images are in `public/assets/`
- Configure remote image domains in `next.config.ts`

**Issue**: Event handlers error

```tsx
"use client";
export function MyComponent() {
  const handleClick = () => console.log("Clicked!");
  return <button onClick={handleClick}>Click me</button>;
}
```

**Issue**: Cannot use async in client component

```tsx
"use server";
export async function fetchData() {
  /* async code */
}

("use client");
import { fetchData } from "@/actions";
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [NextAuth.js Guide](https://next-auth.js.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Bun Documentation](https://bun.sh/docs)

## 🚀 Deployment to Vercel

1. **Push to GitHub**:

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Connect to Vercel**: Visit [vercel.com](https://vercel.com) and connect your GitHub repository

3. **Set Environment Variables**:

```env
NEXT_PUBLIC_BASE_API=https://your-api-domain.com/api
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
```

4. **Deploy**: Click "Deploy" button in Vercel dashboard

**Important**: `NEXTAUTH_URL` must match your production domain exactly.

## 🗺️ Roadmap

### Completed ✅

- Authentication & Authorization (JWT + NextAuth.js)
- Travel plan management (full CRUD)
- Traveler matching (algorithm-based)
- Meetup organization (events & calendar)
- Posts & community (social features)
- Reviews system (ratings & comments)
- **Admin Dashboard** (full CRUD operations)
  - User management
  - Travel plan management
  - Review management (view, filter, export)
  - Activity logs
  - Payment management
  - Subscription tracking
  - Platform statistics & charts
  - Settings & configuration
- Public profiles with reviews
- Subscription plans display
- Dark/Light mode
- Responsive design
- CSV export functionality

### Remaining

- [ ] Advanced notifications system
- [ ] Real-time messaging/chat
- [ ] Payment webhook handling
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] API rate limiting
- [ ] Advanced search with Elasticsearch
- [ ] Content moderation

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a pull request

## 📝 License

This project is proprietary and confidential.

## 👥 Team

- **Developer**: Sufian Sar
- **Project**: Travel Buddy Platform - Social Travel Companion App

## 📞 Support & Contact

For support:

- Use the contact form on the platform
- Email: support@travelbuddy.com
- GitHub Issues: [Report an issue](https://github.com/sufiansar/TravelBuddyFrontend/issues)

## 🎉 Acknowledgments

- [Vercel](https://vercel.com) for Next.js and hosting
- [Shadcn](https://shadcn.com) for beautiful UI components
- [Stripe](https://stripe.com) for payment processing
- [Radix UI](https://radix-ui.com) for accessible component primitives
- [Tailwind Labs](https://tailwindlabs.com) for Tailwind CSS

---

**Last Updated**: December 2025  
**Version**: 0.1.0  
**Status**: Production Ready
