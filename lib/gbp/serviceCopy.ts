/**
 * The wording for every service on the Google listing, in one place.
 *
 * Everything here is drawn from the website itself: the service pages
 * (app/services), the home page service list, and the pricing page and its FAQ.
 * Google allows 300 characters per description; these use most of that so the
 * listing reads as a real offer, not a label. Edit freely, a unit test keeps
 * each one within the limit.
 */

/** The eight services on the home page plus the plans on the pricing page. */
export const SITE_COPY: Record<string, string> = {
  "UX & UI Design":
    "Turn your SaaS or mobile app idea into a shipped product. We start with product thinking, competitive analysis and information architecture, then design flows that reduce friction and move users toward action, delivered as dev-ready screens for Angular, React and Next.js.",
  "Full Stack Development":
    "End-to-end engineering for web products: backend architecture, database design, APIs and production deployment on AWS, GCP or Azure. Built with Node.js and Python by the same team that designs your product, so what ships matches what was designed.",
  "SaaS Development":
    "Full-stack development for SaaS products, from the first architecture decisions through to production. We also take AI-generated code and make it production-ready, with clean structure and reliable deployment so your team can keep shipping.",
  "AI Integrations":
    "Add AI to your product properly: LLM and AI integration, the APIs and backend that power it, and the interface people actually use. We design and build the feature end to end and deploy it to production on Node.js, Python and the major clouds.",
  "Landing Pages":
    "High-converting landing pages built around your positioning and user journey, so visitors become leads and not just page views. Designed and developed by one team in React, Next.js, Framer or Webflow, fast and ready to launch.",
  "Business Websites":
    "Professional business websites that explain what you do and turn visitors into customers. Designed around your positioning and user journey, and built by one team in React, Next.js, Framer or Webflow for speed and easy updates.",
  "UX Audits":
    "A heuristic UX audit of your product with drop-off analysis and a prioritised, actionable roadmap. Find the friction that is blocking growth before you build more. Most audits are delivered in one to two weeks.",
  "UX Consultation":
    "Expert guidance on the UX decisions for your product, from flows and information architecture to what to fix first. We help you find the friction holding back growth and give clear, practical advice your team can act on straight away.",
  "Design Subscription":
    "A monthly design retainer for SaaS teams: a dedicated design team without full-time headcount, covering the full design and development stack. One active request at a time, weekly progress syncs and fast turnaround. Pause anytime with no lock-ins.",
  "5-Day Design Pilot":
    "Test our design work before committing: 5 screens or one full user flow, delivered in 5 days as a polished Figma file that is ready for development. You get real deliverables, not concepts, and the pilot fee is deducted from your invoice if you move forward.",
  "5-Day Development Pilot":
    "Test our engineering before committing: a working component or feature with production-ready code, delivered in 5 days. You get real, usable code, and the pilot fee is deducted from your invoice if you move forward.",
  "5-Day Design + Dev Pilot":
    "Designed and built in 5 days. A small, real piece of your product taken from design to working code, and you own all the files and code. The pilot fee is deducted from your invoice if you move forward, so there is no risk in trying us first.",
  "Custom Project":
    "Fully scoped design and development projects with dedicated project ownership, priority handling and a flexible engagement. We work closely with your stakeholders and cover the full design and development stack, with responses within two hours on weekdays.",
};

/** Google's own standard services, keyed by their service type id. */
export const STANDARD_COPY: Record<string, string> = {
  web_design:
    "Website and landing page design built around your positioning and user journey. We design clear layouts, strong visual hierarchy and conversion-focused flows, then hand over dev-ready files or build the site ourselves in React, Next.js, Framer or Webflow.",
  web_development:
    "Fast, responsive websites and web apps built with React, Next.js and Angular, backed by Node.js and Python where you need a back end. Designed and developed by one team, so the finished site matches the design and is ready to scale.",
  responsive_design:
    "Interfaces designed and built mobile-first so they work properly on phones, tablets and desktops. Layouts, type and components adapt cleanly across screen sizes, so every visitor gets a clear, comfortable experience.",
  mobile_app_development:
    "UX/UI design for mobile apps and the engineering to build them, from product thinking and information architecture through to dev-ready screens and production. Suited to startups and SaaS teams launching a new app or redesigning an existing one.",
  software_development:
    "Full-stack engineering for SaaS and AI products: architecture, database design, APIs, AI and LLM integration and production deployment. Built with Node.js and Python on AWS, GCP or Azure by the team that also designs the product.",
  html: "Clean, semantic HTML and CSS built for fast loading, accessibility and responsive layouts. We turn approved designs into pixel-accurate pages that are easy for your team to maintain and extend.",
  graphic_design:
    "Interface and visual graphics for digital products: UI kits, illustrations and marketing visuals that match your brand. We focus on digital product design for web and mobile, not print.",
};

/** The custom entries already on the listing, matched by normalised name. */
export const EXISTING_COPY: Record<string, string> = {
  "visual design":
    "Brand-aligned visual design for web and mobile products: UI kits, polished screens, consistent components and clear visual hierarchy. We turn product thinking into interfaces that look professional and are easy to use and to build.",
  "next js developer":
    "Next.js development for fast, search-friendly websites and web apps, with server rendering, clean architecture and maintainable code. Ideal for SaaS products, landing pages and business sites that need speed and strong SEO.",
  "website development":
    "Fast, responsive websites built with React and Next.js, from landing pages to full business sites. Designed and developed by one team, with clean code, good performance and a layout that works on every screen.",
  "frontend developer":
    "Production-ready front ends in React, Next.js and Angular, built to match the design exactly. Reusable components, responsive layouts and clean code so your product feels polished and your team can keep building on it.",
  "react js developer":
    "React.js interfaces and web apps built from reusable components, with clean state management and responsive layouts. We turn designs into fast, maintainable front ends for SaaS products and websites.",
  "ui developement":
    "Turning UI designs into pixel-accurate, responsive and accessible front-end code. We build the components, layouts and interactions exactly as designed, so the finished product looks and behaves the way it was meant to.",
  "ui designer":
    "User interface design for SaaS and mobile products: screens, components and design systems with clear hierarchy and consistent styling. Delivered as dev-ready files your engineers can build from straight away.",
  "ux designer":
    "User experience design that reduces friction and moves people toward action: user flows, wireframes, prototypes and information architecture, based on product thinking and competitive analysis, for SaaS and mobile products.",
};
