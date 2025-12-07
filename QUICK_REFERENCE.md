# Travel Buddy Frontend - Quick Reference Guide

## 🚀 Quick Start

### Install Dependencies

```bash
bun install
```

### Run Development Server

```bash
bun run dev
```

### Build for Production

```bash
bun run build
bun start
```

---

## 📂 Key Files to Know

| File                                     | Purpose                           |
| ---------------------------------------- | --------------------------------- |
| `src/proxy.ts`                           | Middleware & API configuration    |
| `src/actions/apiUtils.ts`                | Public/Private API call utilities |
| `src/helpers/authOptions.ts`             | NextAuth configuration            |
| `src/components/PublicNavbar/Navbar.tsx` | Main navigation bar               |
| `src/app/(public)/page.tsx`              | Home landing page                 |
| `src/app/(private)/dashboard/page.tsx`   | User dashboard                    |

---

## 🔑 Core Concepts

### 1. Public Routes

- No authentication required
- Accessible to everyone
- Examples: `/`, `/login`, `/register`, `/explore`

### 2. Private Routes

- Authentication required
- Middleware redirects to `/login` if not authenticated
- Examples: `/dashboard`, `/profile`, `/travel-plans`

### 3. API Calls

#### Public API (No Auth)

```typescript
import { makePublicApiCall } from "@/actions/apiUtils";

const result = await makePublicApiCall("/users/public");
```

#### Private API (With Auth)

```typescript
import { makePrivateApiCall } from "@/actions/apiUtils";

const result = await makePrivateApiCall("/travel-plans");
```

### 4. Session Handling

```typescript
import { getUserSession } from "@/helpers/userSession";

const session = await getUserSession();
if (session?.user?.id) {
  // User is logged in
}
```

---

## 📋 Page Routes

### Public Routes

```
/ ........................ Home
/explore ................. Search travelers
/packages ................ Subscription plans
/destinations ............ Popular destinations
/blog .................... Travel blog
/contact ................. Contact page
/login ................... User login
/register ................ User registration
```

### Private Routes

```
/dashboard ............... User dashboard
/travel-plans ............ View travel plans
/travel-plans/add ........ Create new plan
/travel-plans/[id] ....... View plan details
/travel-plans/[id]/edit .. Edit plan
/profile ................. My profile
/profile/edit ............ Edit profile
/profile/[id] ............ View other user's profile
```

---

## 🔌 API Endpoints

### Authentication

```
POST /auth/login              - Login user
POST /auth/register           - Register new user
```

### Users (Public)

```
GET /users/public             - Get all public profiles
GET /users/public/:id         - Get specific user's public profile
```

### Users (Private)

```
GET /users                    - Get all users
GET /users/:id                - Get user details
PATCH /users/:id              - Update user profile
DELETE /users/:id             - Delete user
PATCH /users/upload-profile-image/:id - Upload profile image
```

### Travel Plans (Private)

```
GET /travel-plans             - Get user's plans
GET /travel-plans/:id         - Get plan details
POST /travel-plans            - Create new plan
PATCH /travel-plans/:id       - Update plan
DELETE /travel-plans/:id      - Delete plan
```

### Reviews (Private)

```
GET /reviews                  - Get reviews
POST /reviews                 - Create review
PATCH /reviews/:id            - Update review
DELETE /reviews/:id           - Delete review
```

---

## 💡 Common Tasks

### Add a New Public Page

1. Create directory: `src/app/(public)/new-page/`
2. Create file: `src/app/(public)/new-page/page.tsx`
3. Add route to navbar in `src/components/PublicNavbar/Navbar.tsx`

### Add a New Private Page

1. Create directory: `src/app/(private)/new-page/`
2. Create file: `src/app/(private)/new-page/page.tsx`
3. Page is automatically protected by middleware

### Make an API Call

```typescript
"use client";

import { makePrivateApiCall } from "@/actions/apiUtils";
import { useEffect } from "react";

export default function MyComponent() {
  useEffect(() => {
    const fetchData = async () => {
      const result = await makePrivateApiCall("/travel-plans");

      if (result.ok) {
        console.log(result.data);
      } else {
        console.error(result.error);
      }
    };

    fetchData();
  }, []);

  return <div>...</div>;
}
```

### Get User Session

```typescript
"use server";

import { getUserSession } from "@/helpers/userSession";

export default async function MyComponent() {
  const session = await getUserSession();
  const userId = session?.user?.id;

  return <div>{userId}</div>;
}
```

---

## 🎨 Styling

Using **Tailwind CSS** with **shadcn/ui** components:

```tsx
<div className="flex items-center justify-center p-8 bg-blue-50">
  <Button className="bg-blue-600 hover:bg-blue-700">Click me</Button>
</div>
```

### Available Components

- `Button` - from `@/components/ui/button`
- `Input` - from `@/components/ui/input`
- `Sheet` - from `@/components/ui/sheet`
- `Separator` - from `@/components/ui/separator`
- And more...

---

## 🧪 Testing

### Test API Calls

```bash
# Use browser DevTools Console
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: '123456' })
}).then(r => r.json()).then(d => console.log(d))
```

---

## 🐛 Debugging

### Check Session

```typescript
const session = await getUserSession();
console.log("Session:", session);
```

### Check API Config

```typescript
// In proxy.ts
console.log("API_CONFIG:", API_CONFIG);
```

### Check Auth Status in Navbar

```typescript
// In Navbar.tsx
console.log("isLoggedIn:", isLoggedIn);
```

---

## 📦 Dependencies

- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **NextAuth 5** - Authentication
- **shadcn/ui** - Component library
- **TypeScript** - Type safety

---

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextAuth Docs](https://next-auth.js.org/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📝 Commit Message Format

```
[FEATURE] Add new travel plans page
[FIX] Fix navbar auth state bug
[REFACTOR] Update API utilities
[DOCS] Update routing documentation
```

---

## ⚙️ Environment Setup

Create `.env.local`:

```
NEXT_PUBLIC_BASE_API=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

---

## 🚨 Common Issues & Solutions

| Issue                         | Solution                                 |
| ----------------------------- | ---------------------------------------- |
| "You must be logged in" error | Check if token is in session             |
| 404 on private routes         | Ensure route is in `(private)` folder    |
| Navbar not updating on login  | Clear browser cache, restart dev server  |
| API calls failing             | Verify `NEXT_PUBLIC_BASE_API` is correct |
| Styles not applying           | Check Tailwind CSS configuration         |

---

## 📞 Support

For questions, refer to:

1. `ROUTING_DOCUMENTATION.md` - Full routing guide
2. Component files in `src/components/`
3. Page files in `src/app/`
4. API utilities in `src/actions/apiUtils.ts`

---

**Last Updated**: December 6, 2025
**Version**: 1.0.0
