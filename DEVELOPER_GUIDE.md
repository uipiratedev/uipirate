# Developer Guide - UI Pirate

Complete technical documentation for developers working on the UI Pirate project.

---

## 📚 Table of Contents

1. [Development Environment Setup](#1-development-environment-setup)
2. [Architecture Overview](#2-architecture-overview)
3. [Database Schema](#3-database-schema)
4. [Authentication System](#4-authentication-system)
5. [API Reference](#5-api-reference)
6. [Component Structure](#6-component-structure)
7. [Styling Guide](#7-styling-guide)
8. [State Management](#8-state-management)
9. [Common Development Tasks](#9-common-development-tasks)
10. [Deployment](#10-deployment)
11. [Best Practices](#11-best-practices)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Development Environment Setup

### System Requirements

- **Node.js**: v18.x or higher
- **Yarn**: v1.22.x or higher
- **MongoDB**: v6.x or higher (local or Atlas)
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "mongodb.mongodb-vscode"
  ]
}
```

### Initial Setup

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd uipirate
   yarn install
   ```

2. **Environment configuration**
   ```bash
   cp .env.example .env
   ```

3. **Configure MongoDB**
   
   **Option A: Local MongoDB**
   ```env
   MONGODB_URI=mongodb://localhost:27017/uipirate
   ```

   **Option B: MongoDB Atlas**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uipirate?retryWrites=true&w=majority
   ```

4. **Generate JWT Secret**
   ```bash
   # On Linux/Mac
   openssl rand -base64 32

   # On Windows (PowerShell)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

5. **Create admin user**
   ```bash
   yarn create-admin
   ```

6. **Start development server**
   ```bash
   yarn dev
   ```

---

## 2. Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  Browser (Chrome, Firefox, Safari, Edge)                    │
│  - React Components                                          │
│  - Client-side State Management                             │
│  - TipTap Rich Text Editor (Admin)                          │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  App Router (Next.js 14)                             │  │
│  │  - Server Components (Default)                        │  │
│  │  - Client Components ('use client')                   │  │
│  │  - API Routes (/app/api/*)                           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Middleware & Authentication                          │  │
│  │  - JWT Verification                                   │  │
│  │  - Route Protection                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  MongoDB (Atlas or Self-hosted)                             │
│  - Mongoose ODM                                              │
│  - Collections: admins, blogs                                │
│  - Indexes for Performance                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  - Cloudinary (Image Hosting)                               │
│  - Google Analytics (Analytics)                              │
│  - Microsoft Clarity (User Insights)                         │
│  - Vercel Speed Insights (Performance)                       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.4 | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 5.0.4 | Type safety |
| TailwindCSS | 3.4.3 | Styling |
| NextUI | 2.x | Component library |
| Framer Motion | 11.1.1 | Animations |
| GSAP | 3.12.5 | Advanced animations |
| Locomotive Scroll | 5.0 | Smooth scrolling |
| TipTap | 3.10.1 | Rich text editor |
| MongoDB | 6.x | Database |
| Mongoose | 8.19.3 | ODM |
| bcryptjs | Latest | Password hashing |
| jsonwebtoken | Latest | JWT authentication |

### Application Layers

1. **Presentation Layer** (`app/`, `components/`, `screens/`) - UI rendering
2. **API Layer** (`app/api/`) - HTTP request handling
3. **Business Logic Layer** (`models/`, `lib/`, `utils/`) - Data validation & business rules
4. **Data Layer** (MongoDB) - Data persistence

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js pages, layouts, and API routes |
| `components/` | Reusable React components |
| `screens/` | Page-level screen components |
| `models/` | Mongoose database models |
| `hooks/` | Custom React hooks |
| `config/` | Configuration files |
| `data/` | Static JSON data |
| `lib/` | Utility libraries |
| `utils/` | Helper functions |
| `types/` | TypeScript type definitions |
| `public/` | Static assets |
| `styles/` | Global CSS |

---

## 3. Database Schema

### Admin Model

**File**: `models/Admin.ts`

```typescript
interface IAdmin {
  name: string;
  email: string;           // Unique, lowercase
  password: string;        // Hashed with bcrypt
  role: "admin" | "super-admin";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Features**:
- Password auto-hashing on save
- `comparePassword()` method for authentication
- Email validation with regex
- Timestamps auto-managed

**Usage Example**:
```typescript
import Admin from '@/models/Admin';

// Create admin
const admin = await Admin.create({
  name: "John Doe",
  email: "john@example.com",
  password: "securepassword",
  role: "admin"
});

// Compare password
const isMatch = await admin.comparePassword("securepassword");
```

### Blog Model

**File**: `models/Blog.ts`

```typescript
interface IBlog {
  title: string;           // Max 200 chars
  slug: string;            // Unique, lowercase, URL-friendly
  content: string;         // HTML from TipTap editor
  excerpt?: string;        // Max 500 chars
  featuredImage?: string;  // Cloudinary URL
  bannerImage?: string;    // Cloudinary URL
  author: {
    name: string;
    email: string;
  };
  tags?: string[];
  published: boolean;
  publishedAt?: Date;
  views?: number;
  readTime?: number;       // In minutes
  createdAt: Date;
  updatedAt: Date;
}
```

**Features**:
- Auto-sets `publishedAt` when published
- `calculateReadTime()` method (200 words/min)
- Indexed fields for performance
- Static `findPublished()` method

**Usage Example**:
```typescript
import Blog from '@/models/Blog';

// Create blog post
const blog = await Blog.create({
  title: "My First Post",
  slug: "my-first-post",
  content: "<p>Hello world!</p>",
  author: {
    name: "Admin",
    email: "admin@uipirate.com"
  },
  published: false
});

// Calculate read time
blog.calculateReadTime();
await blog.save();

// Find published blogs
const publishedBlogs = await Blog.findPublished();
```

### Database Indexes

**Admin Collection**:
- `email` (unique)

**Blog Collection**:
- `slug` (unique)
- `published` (for filtering)
- `tags` (for tag-based queries)
- Compound: `{ published: 1, publishedAt: -1 }` (for published blogs sorted by date)

---

## 4. Authentication System

### JWT-Based Authentication

**Flow**:
```
1. User submits credentials → /api/auth/login
2. Server validates credentials
3. Server generates JWT token
4. Client stores token (localStorage)
5. Client sends token in Authorization header
6. Server validates token on protected routes
```

### Implementation

**Login API** (`app/api/auth/login/route.ts`):
```typescript
import jwt from 'jsonwebtoken';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Find admin with password field
  const admin = await Admin.findOne({ email }).select('+password');
  
  if (!admin || !(await admin.comparePassword(password))) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Generate JWT
  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  return Response.json({ token, admin: { name: admin.name, email: admin.email } });
}
```

**Auth Hook** (`hooks/useAuth.ts`):
```typescript
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser(data.admin);
    }
    return data;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return { user, loading, login, logout };
}
```

### Protected Routes

**Middleware Pattern**:
```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
}

// In API route
export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Continue with authenticated request
}
```

---

## 5. API Reference

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://uipirate.com/api`

### Authentication

Most admin endpoints require JWT authentication via the `Authorization` header:
```http
Authorization: Bearer <your-jwt-token>
```

### Error Response Format

```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)"
}
```

### Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Successful GET, PUT, DELETE |
| 201 | Created - Successful POST |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

### Authentication Endpoints

#### POST `/api/auth/login`

Login with email and password.

**Request**:
```json
{
  "email": "admin@uipirate.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "name": "Admin User",
    "email": "admin@uipirate.com"
  }
}
```

**Example**:
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@uipirate.com',
    password: 'password123'
  })
});

const data = await response.json();
if (data.token) {
  localStorage.setItem('token', data.token);
}
```

---

### Blog Endpoints

#### GET `/api/blogs`

Get all blogs (published only for public, all for admin).

**Query Parameters**:
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `published` | boolean | Filter by published status | `true` (public), `all` (admin) |
| `limit` | number | Number of results per page | 10 |
| `skip` | number | Number of results to skip | 0 |
| `tags` | string | Filter by tags (comma-separated) | - |
| `search` | string | Search in title and excerpt | - |

**Response** (200):
```json
{
  "blogs": [
    {
      "_id": "...",
      "title": "Blog Title",
      "slug": "blog-title",
      "excerpt": "Short description...",
      "featuredImage": "https://...",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "readTime": 5,
      "views": 100
    }
  ],
  "total": 10
}
```

#### GET `/api/blogs/[slug]`

Get single blog by slug.

**Response** (200):
```json
{
  "blog": {
    "_id": "...",
    "title": "Blog Title",
    "slug": "blog-title",
    "content": "<p>Full HTML content...</p>",
    "author": {
      "name": "Author Name",
      "email": "author@example.com"
    },
    "tags": ["design", "ui"],
    "publishedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/blogs`

Create new blog post (admin only).

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "content": "<p>Content here...</p>",
  "excerpt": "Short description",
  "featuredImage": "https://...",
  "tags": ["design", "ui"],
  "published": false
}
```

**Required Fields**:
- `title` (string, max 200 chars)
- `slug` (string, unique, lowercase)
- `content` (string, HTML)

#### PUT `/api/blogs/[id]`

Update blog post (admin only).

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request** (partial update):
```json
{
  "published": true
}
```

#### DELETE `/api/blogs/[id]`

Delete blog post (admin only).

**Headers**:
```http
Authorization: Bearer <token>
```

---

### Sitemap Endpoint

#### GET `/api/sitemap`

Generate XML sitemap for SEO. Automatically mapped to `/sitemap.xml`.

---

## 6. Component Structure

### Component Organization

```
components/
├── admin/              # Admin-specific components
│   └── BlogEditor.tsx  # TipTap rich text editor
├── navbar.tsx          # Main navigation
├── seo.tsx             # SEO meta tags
├── CookieConsent.tsx   # GDPR cookie banner
├── loader.tsx          # Loading animation
├── theme-switch.tsx    # Dark mode toggle
└── ...
```

### Screen Components

```
screens/
├── landing/            # Landing page sections (30 components)
├── blogs/              # Blog listing components
├── blogsDetails/       # Blog detail components
├── faqs/               # FAQ components
├── ourTeam/            # Team page components
├── ourWorks/           # Portfolio components
├── pricing/            # Pricing components
├── service/            # Service page components
└── serviceDetails/     # Service detail components
```

### Component Patterns

#### Server Components (Default)

```typescript
// app/page.tsx
export default function HomePage() {
  // Server-side rendering by default
  return <div>Content</div>;
}
```

**Benefits**: SEO-friendly, faster initial load, reduced JavaScript bundle

#### Client Components

```typescript
// components/InteractiveButton.tsx
'use client';

import { useState } from 'react';

export default function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Use Cases**: User interactions, animations, browser APIs, state management

#### Dynamic Imports

```typescript
// app/page.tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});
```

---

## 7. Styling Guide

### TailwindCSS

**Configuration** (`tailwind.config.js`):
```javascript
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./screens/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
```

### Custom Font

**Plus Jakarta Sans** is loaded via Google Fonts:
```html
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```

**Usage**:
```tsx
<div className="font-jakarta">Text with custom font</div>
```

### NextUI Components

```tsx
import { Button, Input, Card } from '@nextui-org/react';

export default function Example() {
  return (
    <Card>
      <Input label="Email" />
      <Button color="primary">Submit</Button>
    </Card>
  );
}
```

### Animations

#### Framer Motion
```tsx
'use client';
import { motion } from 'framer-motion';

export default function AnimatedBox() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

#### GSAP
```tsx
'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GSAPAnimation() {
  const boxRef = useRef(null);
  
  useEffect(() => {
    gsap.to(boxRef.current, { x: 100, duration: 1 });
  }, []);
  
  return <div ref={boxRef}>Animated Box</div>;
}
```

---

## 8. State Management

### Local State (useState)

```tsx
const [isOpen, setIsOpen] = useState(false);
```

### Custom Hooks

```tsx
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null);
  // ... auth logic
  return { user, login, logout };
}
```

### Server State

```tsx
// Server Component (app/blogs/page.tsx)
async function getBlogs() {
  const res = await fetch('http://localhost:3000/api/blogs', {
    cache: 'no-store' // or 'force-cache'
  });
  return res.json();
}

export default async function BlogsPage() {
  const { blogs } = await getBlogs();
  return <BlogList blogs={blogs} />;
}
```

---

## 9. Common Development Tasks

### Adding a New Page

1. **Create page file**
   ```bash
   mkdir app/new-page
   touch app/new-page/page.tsx
   ```

2. **Add page content**
   ```tsx
   // app/new-page/page.tsx
   export default function NewPage() {
     return <div>New Page Content</div>;
   }
   ```

3. **Add to navigation** (if needed)
   ```typescript
   // config/site.ts
   export const siteConfig = {
     navItems: [
       // ... existing items
       {
         label: "New Page",
         href: "/new-page",
       },
     ],
   };
   ```

### Creating a New API Endpoint

1. **Create route handler**
   ```bash
   mkdir app/api/my-endpoint
   touch app/api/my-endpoint/route.ts
   ```

2. **Implement handler**
   ```typescript
   // app/api/my-endpoint/route.ts
   export async function GET(request: Request) {
     return Response.json({ message: 'Hello' });
   }
   
   export async function POST(request: Request) {
     const body = await request.json();
     return Response.json({ received: body });
   }
   ```

### Adding a New Database Model

1. **Create model file**
   ```bash
   touch models/MyModel.ts
   ```

2. **Define schema**
   ```typescript
   // models/MyModel.ts
   import mongoose, { Schema, Document, Model } from 'mongoose';
   
   export interface IMyModel extends Document {
     name: string;
     createdAt: Date;
   }
   
   const MyModelSchema: Schema = new Schema({
     name: { type: String, required: true },
   }, { timestamps: true });
   
   const MyModel: Model<IMyModel> = 
     mongoose.models.MyModel || mongoose.model<IMyModel>('MyModel', MyModelSchema);
   
   export default MyModel;
   ```

### Working with TipTap Editor

**Basic Setup**:
```tsx
'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  });
  
  return <EditorContent editor={editor} />;
}
```

**Getting HTML Content**:
```typescript
const htmlContent = editor?.getHTML();
```

**Setting Content**:
```typescript
editor?.commands.setContent('<p>New content</p>');
```

---

## 10. Deployment

### Vercel (Recommended)

#### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

#### Automatic Deployments

- **Production**: Push to `main` branch
- **Preview**: Create pull request

---

### Docker

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**Build and Run**:
```bash
docker build -t uipirate .
docker run -p 3000:3000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  uipirate
```

---

### Traditional VPS

#### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn & PM2
npm install -g yarn pm2

# Install Nginx
sudo apt install -y nginx
```

#### Deploy Application

```bash
# Clone repository
git clone <repository-url>
cd uipirate

# Install dependencies
yarn install

# Build
yarn build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Configure Nginx

```nginx
server {
    listen 80;
    server_name uipirate.com www.uipirate.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d uipirate.com -d www.uipirate.com
```

---

### Database Setup

#### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Configure network access: `0.0.0.0/0`
4. Create database user
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/uipirate?retryWrites=true&w=majority
   ```

#### Self-Hosted MongoDB

```bash
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

---

### Post-Deployment

1. **Create admin user**: `yarn create-admin`
2. **Verify deployment**: Test site, admin login, API endpoints
3. **Monitor**: Check analytics, performance metrics

---

## 11. Best Practices

### TypeScript

✅ **Do**:
- Define interfaces for all data structures
- Use strict type checking
- Avoid `any` type

❌ **Don't**:
- Use `any` unless absolutely necessary
- Ignore TypeScript errors

### Component Design

✅ **Do**:
- Keep components small and focused
- Use composition over inheritance
- Extract reusable logic into hooks
- Use Server Components by default

❌ **Don't**:
- Create large, monolithic components
- Mix business logic with presentation
- Overuse client components

### Performance

✅ **Do**:
- Use dynamic imports for heavy components
- Optimize images (WebP, AVIF)
- Implement proper caching strategies
- Use React Server Components for data fetching

❌ **Don't**:
- Load all components on initial page load
- Fetch data on client when server-side is possible
- Ignore bundle size

### Security

✅ **Do**:
- Validate all user inputs
- Use environment variables for secrets
- Implement proper authentication
- Sanitize HTML content from TipTap

❌ **Don't**:
- Store secrets in code
- Trust user input
- Expose sensitive data in client-side code

### Database

✅ **Do**:
- Use indexes for frequently queried fields
- Validate data with Mongoose schemas
- Handle errors properly

❌ **Don't**:
- Store passwords in plain text
- Skip data validation
- Ignore database errors

---

## 12. Troubleshooting

### MongoDB Connection Errors

**Problem**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
1. Ensure MongoDB is running
2. Verify `MONGODB_URI` in `.env`
3. Check network connectivity

### JWT Errors

**Problem**: `JsonWebTokenError: invalid signature`

**Solution**:
1. Ensure `JWT_SECRET` is set in `.env`
2. Verify token is being sent correctly
3. Check token hasn't expired

### Build Errors

**Problem**: `Module not found` or TypeScript errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install

# Rebuild
yarn build
```

### Hydration Errors

**Problem**: `Hydration failed because the initial UI does not match`

**Solution**:
1. Ensure server and client render the same content
2. Use `suppressHydrationWarning` for dynamic content
3. Check for browser extensions affecting DOM

### Debugging Tips

**Enable verbose logging**:
```typescript
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
```

**Debug API routes**:
```typescript
console.log('Request:', request.method, request.url);
console.log('Body:', await request.json());
```

**Check database queries**:
```typescript
mongoose.set('debug', true); // Log all queries
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [TipTap Documentation](https://tiptap.dev)

---

**Need help?** Check the [README](./README.md) or [Contributing Guidelines](./CONTRIBUTING.md).

**Last Updated**: 2024-11-25
