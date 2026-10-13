export interface ConceptEntry {
  slug: string;
  number: string;
  title: string;
  industry: string;
  problem: string;
  stack: string[];
  timeline: string;
  tier: "featured" | "more";
  /** Our own product this concept would extend. Products are in development. */
  builtOn?: string;
}

// Slugs here must match the CMS post slug (postType "concept"). A card only
// links through once a published CMS post with the same slug exists.
export const CONCEPTS: ConceptEntry[] = [
  {
    slug: "ai-voice-receptionist-for-clinics",
    number: "01",
    title: "AI Voice Receptionist and Booking Agent",
    industry: "Clinics & Service Businesses",
    problem:
      "Missed calls and after-hours voicemail quietly cost service businesses bookings every week.",
    stack: ["Twilio", "Vapi", "LLM API", "Calendar APIs"],
    timeline: "6 to 10 weeks",
    tier: "featured",
    builtOn: "AI Voice Caller",
  },
  {
    slug: "crm-grounded-sales-inquiry-agent",
    number: "02",
    title: "CRM-Grounded Sales and Inquiry Agent",
    industry: "Sales & Operations",
    problem:
      "High-value inquiries get slow, inconsistent replies that rarely use the business's real pricing and availability.",
    stack: ["Zoho / HubSpot", "RAG", "pgvector", "Function calling"],
    timeline: "8 to 12 weeks",
    tier: "featured",
    builtOn: "Alfred OS",
  },
  {
    slug: "concierge-medicine-scheduling-assistant",
    number: "03",
    title: "Concierge Medicine Scheduling and Coordination",
    industry: "Healthcare",
    problem:
      "Coordinating one patient across several specialists is still phone calls and disconnected calendars.",
    stack: ["FHIR", "EHR APIs", "HIPAA cloud", "Conversational AI"],
    timeline: "10 to 14 weeks",
    tier: "featured",
  },
  {
    slug: "enterprise-multi-agent-assistant-microsoft-365",
    number: "04",
    title: "Multi-Agent Enterprise Assistant on Microsoft 365",
    industry: "Enterprise",
    problem:
      "Teams want AI that acts on company data without sending it to an uncontrolled tool.",
    stack: ["Microsoft Graph", "Azure OpenAI", "Azure AD", "Python"],
    timeline: "12 to 16 weeks",
    tier: "featured",
    builtOn: "Alfred OS",
  },
  {
    slug: "usage-based-billing-ai-saas",
    number: "05",
    title: "Usage-Based Billing for AI SaaS",
    industry: "SaaS & Fintech",
    problem:
      "AI products cost money per use, and first-time metering builds leak revenue through edge cases.",
    stack: ["Stripe Billing", "Metronome", "Postgres", "Queues"],
    timeline: "6 to 10 weeks",
    tier: "featured",
  },
  {
    slug: "hipaa-ready-ai-intake-billing",
    number: "06",
    title: "HIPAA-Ready AI for Intake and Billing",
    industry: "Healthcare",
    problem:
      "Practices want AI for intake and claims but cannot paste patient data into a general chatbot.",
    stack: ["AWS / Azure", "BAA-covered LLM", "OCR", "EHR APIs"],
    timeline: "10 to 14 weeks",
    tier: "more",
  },
  {
    slug: "luxury-real-estate-buyer-matching",
    number: "07",
    title: "Luxury Real Estate Buyer Matching",
    industry: "Real Estate",
    problem:
      "Buyers with unusual preferences wait days for a curated list, then email back and forth to book a viewing.",
    stack: ["MLS feeds", "CRM", "Calendar APIs", "Matching engine"],
    timeline: "10 to 12 weeks",
    tier: "more",
  },
  {
    slug: "elite-membership-club-vetting-engine",
    number: "08",
    title: "Vetting and Experience Engine for Membership Clubs",
    industry: "Hospitality & Membership",
    problem:
      "Application review, events and member matching are manual, which caps how many members a club can serve well.",
    stack: ["CRM", "Event booking", "Payments", "Conversational AI"],
    timeline: "8 to 12 weeks",
    tier: "more",
  },
  {
    slug: "family-office-wealth-aggregation-assistant",
    number: "09",
    title: "Family Office Wealth Aggregation Assistant",
    industry: "Wealth & Finance",
    problem:
      "A simple question about total exposure takes staff hours across spreadsheets and custodian PDFs.",
    stack: ["Plaid", "Custodian APIs", "NL query layer", "Encryption"],
    timeline: "10 to 14 weeks",
    tier: "more",
  },
  {
    slug: "private-jet-charter-booking-platform",
    number: "10",
    title: "Private Jet Charter Booking Platform",
    industry: "Travel & Aviation",
    problem:
      "Charter booking is still quote-on-request, so clients wait on a callback for a price.",
    stack: ["Avinode API", "FL3XX", "FlightAware", "Pricing engine"],
    timeline: "14 to 16 weeks",
    tier: "more",
  },
];
