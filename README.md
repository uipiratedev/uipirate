# UI Pirate - Enterprise UI/UX Design Agency Platform

<div align="center">

![UI Pirate](https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png)

**A modern, full-stack web application for a global UI/UX design agency**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.3-38B2AC)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)](https://mongoosejs.com/)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**UI Pirate** is a comprehensive web platform for a global UI/UX design agency serving enterprise clients across USA, UK, Singapore, India, and Australia. The platform features:

- **Portfolio showcase** for design work
- **Blog system** with rich text editing
- **Admin dashboard** for content management
- **Service pages** highlighting agency capabilities
- **SEO-optimized** for global reach
- **Performance-focused** with modern web technologies

---

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX** with smooth animations (Framer Motion + GSAP)
- **Responsive design** optimized for all devices
- **Dark mode support** with theme switching
- **Smooth scrolling** using Locomotive Scroll
- **NextUI components** for consistent design system
- **Custom animations** and micro-interactions

### 📝 Blog System
- **Rich text editor** powered by TipTap
- **Draft/Publish workflow** for content management
- **Featured images** and banner support
- **Tag-based categorization**
- **Read time calculation**
- **View tracking**
- **SEO-friendly slugs**

### 🔐 Admin Dashboard
- **Secure authentication** with JWT
- **Role-based access control** (admin, super-admin)
- **Blog post management** (create, edit, delete, publish)
- **Image upload** integration with Cloudinary
- **User management**

### 🚀 Performance & SEO
- **Image optimization** (WebP, AVIF formats)
- **Code splitting** with dynamic imports
- **Sitemap generation**
- **Structured data** for search engines
- **International targeting** (hreflang tags)
- **Security headers** (CSP, X-Frame-Options, etc.)
- **Analytics integration** (Google Analytics, Microsoft Clarity)

### 🌍 Global Reach
- **Multi-region targeting** (US, UK, Singapore, India, Australia)
- **GDPR-compliant** cookie consent
- **Optimized meta tags** for social sharing
- **AI crawler optimization**

---

## 🛠 Tech Stack

### Core
- **[Next.js 14.2.4](https://nextjs.org/)** - React framework with App Router
- **[React 18.3.1](https://reactjs.org/)** - UI library
- **[TypeScript 5.0.4](https://www.typescriptlang.org/)** - Type safety

### Styling & UI
- **[TailwindCSS 3.4.3](https://tailwindcss.com/)** - Utility-first CSS
- **[NextUI 2.x](https://nextui.org/)** - React component library
- **[Framer Motion 11.1.1](https://www.framer.com/motion/)** - Animation library
- **[GSAP 3.12.5](https://greensock.com/gsap/)** - Advanced animations
- **[Locomotive Scroll 5.0](https://locomotivemtl.github.io/locomotive-scroll/)** - Smooth scrolling

### Database & Backend
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose 8.19.3](https://mongoosejs.com/)** - MongoDB ODM
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - JWT authentication

### Content Management
- **[TipTap 3.10.1](https://tiptap.dev/)** - Headless WYSIWYG editor
- **Multiple TipTap extensions** - Rich text features

### Additional Tools
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** - Performance monitoring
- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library
- **[React Slick](https://react-slick.neostack.com/)** - Carousel component
- **[next-seo](https://github.com/garmeeh/next-seo)** - SEO management

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **Yarn** (v1.22.x or higher) - [Installation](https://classic.yarnpkg.com/en/docs/install)
- **MongoDB** (v6.x or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/uipirate.git
   cd uipirate
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

### Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   
   Edit `.env` and add your configuration:

   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/uipirate
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uipirate?retryWrites=true&w=majority

   # JWT Configuration
   # Generate a secure secret: openssl rand -base64 32
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **Create admin user** (First-time setup)
   ```bash
   yarn create-admin
   ```
   
   Default admin credentials:
   - **Email**: `admin@uipirate.com`
   - **Password**: `uipir@te04`
   
   ⚠️ **Important**: Change these credentials immediately after first login!

### Running the Application

#### Development Mode
```bash
yarn dev
```
The application will be available at:
- **Local**: `http://localhost:3000`
- **Network**: `http://0.0.0.0:3000` (accessible from other devices on your network)

#### Production Build
```bash
# Build the application
yarn build

# Start production server
yarn start
```

#### Linting
```bash
yarn lint
```

---

## 📁 Project Structure

```
uipirate/
├── app/                      # Next.js App Router (Pages & Layouts)
│   ├── [slug]/              # Dynamic blog post routes
│   ├── admin/               # Admin dashboard
│   │   ├── dashboard/       # Admin dashboard pages
│   │   └── login/           # Admin login page
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── blogs/           # Blog CRUD endpoints
│   │   └── sitemap/         # Sitemap generation
│   ├── blogs/               # Blog listing page
│   ├── contact/             # Contact page
│   ├── faqs/                # FAQs page
│   ├── ourTeam/             # Team page
│   ├── ourWorks/            # Portfolio page
│   ├── pricing/             # Pricing page
│   ├── privacy-policy/      # Privacy policy
│   ├── resources/           # Resources section
│   ├── services/            # Services pages
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Homepage
│
├── components/              # Reusable React components
│   ├── admin/               # Admin-specific components
│   ├── navbar.tsx           # Main navigation
│   ├── seo.tsx              # SEO component
│   ├── CookieConsent.tsx    # GDPR cookie consent
│   ├── loader.tsx           # Loading animation
│   └── ...                  # Other UI components
│
├── screens/                 # Page-level screen components
│   ├── landing/             # Landing page sections (30 components)
│   ├── blogs/               # Blog page components
│   ├── blogsDetails/        # Blog detail components
│   ├── faqs/                # FAQ components
│   ├── ourTeam/             # Team page components
│   ├── ourWorks/            # Portfolio components
│   ├── pricing/             # Pricing components
│   ├── service/             # Service page components
│   └── serviceDetails/      # Service detail components
│
├── models/                  # MongoDB/Mongoose models
│   ├── Admin.ts             # Admin user schema
│   └── Blog.ts              # Blog post schema
│
├── config/                  # Configuration files
│   ├── fonts.ts             # Font configuration
│   └── site.ts              # Site-wide configuration
│
├── data/                    # Static JSON data
│   ├── faqs.json            # FAQ data
│   ├── sericesDetailsList.json
│   ├── servicesTopList.json
│   └── testimonials.json
│
├── hooks/                   # Custom React hooks
│   └── useAuth.ts           # Authentication hook
│
├── lib/                     # Utility libraries
├── public/                  # Static assets (images, fonts, etc.)
├── styles/                  # Global styles
│   └── globals.css          # Global CSS
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
│
├── .env.example             # Environment variables template
├── .eslintrc.json           # ESLint configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

---

## 📚 Documentation

For detailed documentation, please refer to:

- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Complete technical documentation (architecture, API, deployment, best practices)
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server on `0.0.0.0:3000` |
| `yarn build` | Build production bundle |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint with auto-fix |
| `yarn create-admin` | Create admin user (first-time setup) |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🌟 Acknowledgments

- **UI Pirate** by Vishal Anand
- Built with ❤️ using Next.js and modern web technologies
- Serving enterprise clients globally

---

## 📞 Support

For support, email **support@uipirate.com** or visit our website at [uipirate.com](https://uipirate.com)

---

<div align="center">

**[Website](https://uipirate.com)** • **[LinkedIn](https://www.linkedin.com/company/ui-pirate-by-vishal-anand/)** • **[Behance](https://www.behance.net/vishalanand-UI-UX)** • **[Dribbble](https://dribbble.com/vishalanandUIUX)** • **[Twitter](https://x.com/UI_Pirate)**

</div>
