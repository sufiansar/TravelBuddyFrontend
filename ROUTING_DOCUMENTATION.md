# Travel Buddy Frontend - Routing & API Documentation

## Project Overview

Complete routing structure with public and private routes for the Travel Buddy & Meetup Platform.

---

## 🏗️ Directory Structure

```
src/
├── app/
│   ├── (public)/                    # Public routes (accessible to all)
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Home landing page /
│   │   ├── explore/
│   │   │   └── page.tsx             # /explore - Search & match travelers
│   │   ├── packages/
│   │   │   └── page.tsx             # /packages - Subscription plans
│   │   ├── destinations/
│   │   │   └── page.tsx             # /destinations - Popular destinations
│   │   ├── blog/
│   │   │   └── page.tsx             # /blog - Travel blog & articles
│   │   ├── contact/
│   │   │   └── page.tsx             # /contact - Contact form
│   │   └── (auth)/
│   │       ├── login/
│   │       │   └── page.tsx         # /login - User login
│   │       └── register/
│   │           └── page.tsx         # /register - User registration
│   ├── (private)/                   # Protected routes (requires auth)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx             # /dashboard - User dashboard
│   │   ├── travel-plans/
│   │   │   ├── page.tsx             # /travel-plans - List user's travel plans
│   │   │   ├── add/
│   │   │   │   └── page.tsx         # /travel-plans/add - Create new plan
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # /travel-plans/[id] - View plan details
│   │   │       └── edit/
│   │   │           └── page.tsx     # /travel-plans/[id]/edit - Edit plan
│   │   └── profile/
│   │       ├── page.tsx             # /profile - View my profile
│   │       ├── edit/
│   │       │   └── page.tsx         # /profile/edit - Edit my profile
│   │       └── [id]/
│   │           └── page.tsx         # /profile/[id] - View other user's profile
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts         # NextAuth API route
│   ├── layout.tsx                   # Root layout
│   └── globals.css
├── actions/
│   └── apiUtils.ts                  # API call utilities (public & private)
├── components/
│   ├── PublicNavbar/
│   │   ├── Navbar.tsx               # Dynamic navbar (auth-aware)
│   │   └── Logout.tsx               # Logout button
│   ├── ui/                          # shadcn/ui components
│   ├── modeToggle.tsx               # Theme toggle
│   ├── theme-provider.tsx           # Theme provider
│   ├── login-form.tsx
│   ├── RegisterUser.tsx
│   └── ...
├── helpers/
│   ├── authOptions.ts               # NextAuth configuration
│   └── userSession.ts               # Session helper
├── providers/
│   └── AuthProvider.tsx             # Auth provider
├── lib/
│   └── utils.ts                     # Utility functions
├── proxy.ts                         # Middleware & API config
└── ...
```

---

## 📌 API Endpoints Configuration

### Base URL

```
NEXT_PUBLIC_BASE_API = http://localhost:5000/api
```

### Public Endpoints (No Auth Required)

```typescript
// Authentication
POST   /auth/login          - User login
POST   /auth/register       - User registration

// Users
GET    /users/public        - Get all public user profiles
GET    /users/public/:id    - Get specific user's public profile

// Travel Plans
GET    /travel-plans/public - Get all public travel plans
```

### Private Endpoints (Auth Required)

```typescript
// Users
GET    /users              - Get all users (admin)
GET    /users/:id          - Get user details
PATCH  /users/:id          - Update user profile
PATCH  /users/upload-profile-image/:id - Upload profile image
DELETE /users/:id          - Delete user

// Travel Plans
GET    /travel-plans       - Get user's travel plans
GET    /travel-plans/:id   - Get travel plan details
POST   /travel-plans       - Create new travel plan
PATCH  /travel-plans/:id   - Update travel plan
DELETE /travel-plans/:id   - Delete travel plan

// Reviews
GET    /reviews            - Get reviews for user
POST   /reviews            - Create review
PATCH  /reviews/:id        - Update review
DELETE /reviews/:id        - Delete review

// Matches
GET    /matches            - Get matched travelers
POST   /matches/:id        - Send match request
```

---

## 🔐 Authentication Flow

### Middleware Protection (proxy.ts)

```typescript
// Public Routes (no auth required)
- /
- /login
- /register
- /packages
- /destinations
- /blog
- /contact
- /explore

// Private Routes (auth required)
- /dashboard
- /travel-plans
- /travel-plans/add
- /travel-plans/[id]
- /travel-plans/[id]/edit
- /profile
- /profile/edit
- /profile/[id]

// Redirects:
- Unauthenticated users trying to access private routes → /login
- Authenticated users accessing /login or /register → /
```

---

## 🚀 API Utilities

### 1. Public API Calls (No Auth)

```typescript
import { makePublicApiCall } from "@/actions/apiUtils";

// Example: Search travelers
const result = await makePublicApiCall("/users/public", {
  method: "GET",
});

if (result.ok) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### 2. Private API Calls (Auth Required)

```typescript
import { makePrivateApiCall } from "@/actions/apiUtils";

// Example: Get user's travel plans
const result = await makePrivateApiCall("/travel-plans", {
  method: "GET",
});

if (result.ok) {
  console.log(result.data);
  console.log(result.session); // User session info
} else {
  console.error(result.error);
}
```

### 3. Upload Image

```typescript
import { uploadImage } from "@/actions/apiUtils";

const file = e.target.files[0];
const imageUrl = await uploadImage(file);
```

---

## 📄 Page Descriptions

### Public Pages

#### Home (/)

- Hero section with CTA buttons
- How It Works (3-step process)
- Popular Destinations (8 destinations)
- Top-Rated Travelers (3 featured)
- Travel Categories (8 categories)
- Why Choose Us (3 benefits)
- Testimonials (3 success stories)
- Final CTA section

#### Explore Travelers (/explore)

- Search filters (Destination, Travel Type)
- Dynamic traveler list
- Traveler cards with:
  - Profile image
  - Full name & email
  - Bio
  - Travel interests
  - View Profile link

#### Packages (/packages)

- 3 subscription plans:
  - Explorer ($9.99/month)
  - Adventure ($19.99/month) - Most popular
  - Premium ($29.99/month)
- Feature lists for each tier
- Choose plan buttons

#### Destinations (/destinations)

- 12 popular destinations
- Traveler count per destination
- Links to explore by destination
- Flag emoji for each destination

#### Blog (/blog)

- 6 sample blog posts
- Post cards with:
  - Emoji header
  - Title
  - Excerpt
  - Date and author
  - Read More link

#### Contact (/contact)

- Contact information cards (Email, Phone, Location)
- Contact form with:
  - Name, Email, Subject, Message
  - Submit button

### Private Pages

#### Dashboard (/dashboard)

- Stats cards:
  - Active Plans
  - Matched Travelers
  - Messages
  - Profile Rating
- Upcoming Travel Plans section
- Your Matches section

#### Travel Plans (/travel-plans)

- List of user's travel plans
- Create New Plan button
- Plan cards with:
  - Destination
  - Dates
  - Budget & Type
  - View, Edit, Delete buttons

#### Add/Edit Travel Plan (/travel-plans/add & [id]/edit)

- Form fields:
  - Destination
  - Start Date
  - End Date
  - Budget
  - Travel Type (Solo, Friends, Family)
  - Description
  - Interests
- Submit & Cancel buttons

#### View Travel Plan Details (/travel-plans/[id])

- Plan details (destination, dates, budget, type)
- Host profile summary
- Description & interests
- Request to Join, Save Plan, Contact Host buttons

#### My Profile (/profile)

- Profile header with background
- Profile photo
- User name, rating, review count
- Current location
- Bio section
- Travel Interests (badges)
- Visited Countries (badges)
- Quick stats (countries traveled, member since, active plans)
- Recent reviews section

#### Edit Profile (/profile/edit)

- Form fields:
  - Profile Image upload
  - Full Name
  - Bio/About
  - Current Location
  - Travel Interests
  - Visited Countries
- Save Changes & Cancel buttons

#### View User Profile (/profile/[id])

- Public profile view (read-only)
- Same layout as My Profile
- Connect, Message, View Plans buttons
- Recent reviews section

---

## 🔄 Navbar Behavior

### When Logged Out

- Logo (links to home)
- Home
- Packages
- Destinations
- Blog
- Contact
- Theme Toggle
- Login button
- Register button

### When Logged In

- Logo (links to home)
- Home
- Explore Travelers
- My Travel Plans
- Dashboard
- Theme Toggle
- Profile button
- Logout button

### Mobile Menu

- Hamburger menu icon
- All navigation items
- Theme toggle
- Auth buttons (Login/Register or Profile/Logout)

---

## 📡 Data Flow

### User Registration/Login

1. User visits `/register` or `/login`
2. Fills form and submits
3. API call to `/auth/login` or `/auth/register`
4. NextAuth stores JWT token
5. User redirected to dashboard or home

### Search & Match

1. User visits `/explore`
2. Enters search criteria (destination, travel type)
3. API call to `/users/public?destination=...&travelType=...`
4. Results displayed in traveler list
5. Click to view profile or connect

### Create Travel Plan

1. User visits `/travel-plans/add`
2. Fills plan details
3. Submits form (POST to `/travel-plans`)
4. Redirected to `/travel-plans` list
5. New plan visible in list

### View/Edit Profile

1. User visits `/profile`
2. Displays their profile data
3. Click "Edit Profile" → `/profile/edit`
4. Modify profile info
5. Submit to update profile

---

## 🔒 Security Measures

1. **JWT Authentication**: Bearer tokens in Authorization header
2. **Route Protection**: Middleware redirects unauthorized users to login
3. **Session Management**: NextAuth manages session lifecycle
4. **Public/Private API Separation**: Clear separation of authenticated and non-authenticated endpoints
5. **CORS**: Handled by backend API

---

## 📝 Request/Response Format

### Successful Response

```json
{
  "ok": true,
  "status": 200,
  "data": {
    /* response data */
  },
  "error": null
}
```

### Error Response

```json
{
  "ok": false,
  "status": 400,
  "data": null,
  "error": "Error message"
}
```

---

## 🛠️ Development Notes

1. **API Base URL**: Update `NEXT_PUBLIC_BASE_API` in `.env.local`
2. **Session Duration**: Configure in `authOptions.ts`
3. **Image Upload**: Uses Cloudinary/ImgBB integration
4. **Theme Toggle**: Dark/Light mode via Tailwind CSS
5. **Database**: Prisma ORM on backend
6. **Form Validation**: Built-in HTML5 + server-side validation

---

## 📚 Environment Variables

```
NEXT_PUBLIC_BASE_API=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

---

## 🎯 Next Steps

1. Implement actual API calls replacing console.log
2. Add form validation and error handling
3. Implement pagination for lists
4. Add messaging/chat functionality
5. Implement payment integration (Stripe/SSLCommerz)
6. Add admin dashboard for user/plan management
7. Implement review & rating system
8. Add notification system
9. Implement real-time matching algorithm
10. Add email notifications

---

**Last Updated**: December 6, 2025
**Version**: 1.0.0
**Status**: ✅ Basic Routing Complete
