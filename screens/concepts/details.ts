export interface ConceptDetail {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subhead: string;
  /** Honest note on the product we'd extend. Products are still in development. */
  foundation?: { name: string; href: string; note: string };
  problem: string[];
  market: string[];
  persona: string;
  phases: { name: string; summary: string }[];
  flow: { label: string; detail: string }[];
  stack: { layer: string; choice: string; why: string }[];
  prototype: string[];
  production: { title: string; why: string }[];
  approach: string[];
  faqs: { q: string; a: string }[];
  /** Slugs from CONCEPTS */
  related: string[];
}

export const CONCEPT_DETAILS: Record<string, ConceptDetail> = {
  "ai-voice-receptionist-for-clinics": {
    slug: "ai-voice-receptionist-for-clinics",
    metaTitle: "AI Voice Receptionist for Clinics: How to Build It | UI Pirate",
    metaDescription:
      "How to build an AI voice receptionist that books into real calendars: architecture, phased plan, tech stack, and what production needs beyond a demo.",
    headline: "AI Voice Receptionist and Booking Agent",
    subhead:
      "An agent that answers every call, books into the real calendar, and hands off to a human when it should. How we'd build it, in what order, and where it breaks.",
    foundation: {
      name: "AI Voice Caller",
      href: "/products",
      note: "Our own AI Voice Caller is in active development and is the starting point we'd extend, not a finished product to resell.",
    },
    problem: [
      "Small clinics, med spas, home-service companies and wellness businesses lose bookings every week to missed calls, after-hours voicemail and front-desk staff who are also doing five other jobs. Most of these businesses cannot say how many calls they missed last month, only that it was too many.",
      "Hiring more reception staff is expensive, hard to schedule around peak call times, and does not scale across locations. The calls that get missed are often the most valuable ones: a new customer with an urgent need, calling at the one moment they were ready to book.",
    ],
    market: [
      "Voice AI platforms such as Vapi, Bland and Retell made the raw technology easy to access, and a wave of wrapper products launched on top of them. Many stop at 'the AI answers the phone'.",
      "In our read, fewer of them handle the operational parts well: real calendar write access with conflict resolution, multi-location routing, and a clean human handoff with context. The gap is no longer the voice technology. It is the reliability around it.",
    ],
    persona:
      "Typically the owner-operator of a one to five location service business (a med spa, a dental practice, a home-services company) who can only guess how many calls were missed, and who may already have tried a generic AI receptionist that mishandled a call or failed to book into the real calendar.",
    phases: [
      {
        name: "Answer and book",
        summary:
          "A voice agent answers inbound calls, handles common questions and books into the business's real calendar.",
      },
      {
        name: "Two-way sync",
        summary:
          "Appointments, reschedules and cancellations stay accurate in both the booking system or CRM and the agent's view.",
      },
      {
        name: "Follow-up",
        summary:
          "SMS or WhatsApp confirmations, reminders and no-show recovery run automatically after the call.",
      },
      {
        name: "Smart handoff",
        summary:
          "Urgent or unusual calls transfer to a human with a full summary, so the caller never repeats themselves.",
      },
      {
        name: "Visibility",
        summary:
          "A dashboard shows call volume, booking conversion, missed-call recovery and transcripts.",
      },
    ],
    flow: [
      {
        label: "Caller dials the business number",
        detail: "Routed through a phone provider (Twilio or a SIP trunk).",
      },
      {
        label: "Streaming voice pipeline",
        detail:
          "Speech-to-text, the language model and text-to-speech run as a stream so replies feel immediate and callers can interrupt.",
      },
      {
        label: "Agent with tools",
        detail:
          "The agent does not guess. It calls tools to check availability, book, reschedule or look up a customer.",
      },
      {
        label: "Booking system of record",
        detail:
          "Google Calendar, Calendly or the business's own booking API, written to with conflict checks.",
      },
      {
        label: "After the call",
        detail:
          "SMS confirmation, CRM update, transcript and summary stored for the dashboard.",
      },
      {
        label: "Handoff path",
        detail:
          "Emergencies and unusual requests transfer to a person with the conversation summary.",
      },
    ],
    stack: [
      {
        layer: "Phone layer",
        choice: "Twilio or a SIP provider",
        why: "Number provisioning and porting, call control and transfer.",
      },
      {
        layer: "Voice orchestration",
        choice: "Vapi or a custom streaming pipeline",
        why: "Controls latency and turn-taking. Buy it first, own it later if cost or control demands.",
      },
      {
        layer: "Reasoning",
        choice: "LLM API with tool calling",
        why: "Structured actions instead of free-text promises the system cannot keep.",
      },
      {
        layer: "Booking and CRM",
        choice: "Google Calendar, Calendly, HighLevel or Zoho",
        why: "The calendar is the source of truth. The agent writes to it, never around it.",
      },
      {
        layer: "Data and jobs",
        choice: "Postgres and a job queue",
        why: "Transcripts, retries and follow-up messages must survive failures.",
      },
      {
        layer: "Observability",
        choice: "Call logs, traces and cost-per-call tracking",
        why: "You need to know a call went wrong before the customer tells you.",
      },
    ],
    prototype: [
      "A scripted greeting and a few FAQ answers on a voice platform such as Vapi",
      "A booking link the agent reads out or texts",
      "Enough to hear what the experience feels like and decide if it is worth doing properly",
    ],
    production: [
      {
        title: "Double-booking prevention",
        why: "Two callers can ask for the same slot at the same moment. Without locking and conflict resolution, the agent books both.",
      },
      {
        title: "Natural turn-taking and interruptions",
        why: "Callers talk over the agent, pause mid-sentence and call from noisy places. Latency and barge-in handling decide whether it feels human or frustrating.",
      },
      {
        title: "Timezone, holiday and multi-location logic",
        why: "A booking that is correct in one city is wrong in another. Locations have different hours, staff and rules.",
      },
      {
        title: "Strict escalation for emergencies",
        why: "Some calls must never be handled by an AI. The rules for detecting and transferring them need review by the business, not just an engineer.",
      },
      {
        title: "Recording and consent rules",
        why: "Call recording laws differ by region and the agent must disclose and respect them.",
      },
      {
        title: "Number porting and carrier setup",
        why: "Moving a live business number is slow and can interrupt service if done carelessly.",
      },
      {
        title: "Failure fallbacks",
        why: "When the AI provider, phone provider or calendar API is down, calls must still reach a human.",
      },
      {
        title: "Cost control",
        why: "Per-minute costs add up across telephony, speech and the model. A long, looping call should be cut off, not billed.",
      },
    ],
    approach: [
      "We would build the booking engine before polishing the voice. A friendly agent that double-books is worse than no agent, so calendar write access and conflict resolution come first, tested against the business's real calendar setup.",
      "In the first week we would confirm the things that cause delays later: how the existing number can be ported or forwarded, which recording-consent rules apply, what permissions the calendar API actually grants, and what counts as an emergency for this business. Handoff rules and multi-location routing are designed in the first phase, not added after launch.",
    ],
    faqs: [
      {
        q: "Can we just build this ourselves with Vapi or a similar platform?",
        a: "For a prototype, yes, and we encourage it. The gap shows up in production: calendar conflicts, handoff, failure fallbacks, consent rules and cost control. Those are the parts that decide whether the business can trust it with real customers.",
      },
      {
        q: "Does this replace the front desk?",
        a: "No. It handles routine calls, after-hours calls and overflow, and passes anything urgent or unusual to a person with a summary. The aim is fewer missed calls, not fewer staff.",
      },
      {
        q: "Is it HIPAA compliant for clinics?",
        a: "It can be built that way, but compliance is not automatic. It needs signed agreements with every vendor that touches patient data, encryption, access controls and audit logs. We would scope this in the first week and tell you honestly what it takes.",
      },
      {
        q: "How long does a first version take?",
        a: "Our planning estimate is 6 to 10 weeks for one location, longer for multi-location with custom integrations. We firm that up once we see your booking system.",
      },
    ],
    related: ["crm-grounded-sales-inquiry-agent", "concierge-medicine-scheduling-assistant"],
  },

  "crm-grounded-sales-inquiry-agent": {
    slug: "crm-grounded-sales-inquiry-agent",
    metaTitle: "CRM-Grounded Sales and Inquiry AI Agent: How to Build It | UI Pirate",
    metaDescription:
      "How to build an AI agent that answers sales inquiries using your real pricing and availability, inside your CRM: architecture, phases, stack and production needs.",
    headline: "CRM-Grounded Sales and Inquiry Agent",
    subhead:
      "An agent that reads each new inquiry and replies using your real pricing, availability and past successful replies, with a person approving until trust is earned.",
    foundation: {
      name: "Alfred OS",
      href: "/products",
      note: "Our own Alfred OS, a multi-agent platform with a policy-check step before actions, is in active development. Its approach is what we'd extend here, not a finished product to resell.",
    },
    problem: [
      "Businesses with high-value inbound inquiries, such as weddings, events, B2B services, real estate and agencies, answer every lead by hand. Replies are slow, inconsistent and rarely use the business's own pricing and service details correctly.",
      "Leads go cold while someone hunts for the right document or quote template. The business is usually losing deals to response time, not to the quality of its service.",
    ],
    market: [
      "AI sales assistant tools are everywhere. Many are chat widgets that answer FAQs but cannot check availability, build a real quote or write into the CRM. The ones that do integrate often rely on rigid, rule-based sequences rather than reading an inquiry and responding like a sharp salesperson.",
      "The real gap is grounding: an agent that is actually right about pricing and availability, not just conversational. A confident wrong quote is worse than a slow right one.",
    ],
    persona:
      "Typically a sales or operations lead at a business with long sales cycles and customized quotes, such as an event venue, a boutique agency or a B2B service provider, with one or two people manually triaging every inbound lead.",
    phases: [
      {
        name: "Knowledge layer",
        summary:
          "Build the agent's knowledge from the service catalog, pricing rules, FAQs and past successful replies.",
      },
      {
        name: "Draft and approve",
        summary:
          "An agent inside the CRM reads each new inquiry and drafts a grounded, on-brand reply for a human to approve.",
      },
      {
        name: "Live checks",
        summary:
          "Function calling into real systems to check availability, generate quotes and create follow-up tasks.",
      },
      {
        name: "Gradual autonomy",
        summary:
          "Routine replies send on their own while anything unusual goes to a person.",
      },
      {
        name: "Reporting",
        summary:
          "Response time, reply quality and lead-to-booking conversion tracked over time.",
      },
    ],
    flow: [
      {
        label: "Inquiry arrives",
        detail: "Form, email or message creates or matches a CRM record.",
      },
      {
        label: "Retrieve what is true",
        detail:
          "The agent pulls the relevant catalog entries, pricing rules and similar past replies.",
      },
      {
        label: "Check live systems",
        detail:
          "Tool calls confirm availability and build a quote from rules, not from the model's memory.",
      },
      {
        label: "Policy check",
        detail:
          "A separate check blocks invented prices, off-limits promises and anything outside the agent's remit.",
      },
      {
        label: "Human approval queue",
        detail:
          "A person reviews, edits or approves the draft. Autonomy is unlocked per reply type as trust grows.",
      },
      {
        label: "Send and write back",
        detail:
          "The reply goes out and the CRM, follow-up tasks and reporting are updated.",
      },
    ],
    stack: [
      {
        layer: "CRM",
        choice: "Zoho, HubSpot or HighLevel APIs",
        why: "The CRM stays the system of record. The agent works inside it.",
      },
      {
        layer: "Reasoning",
        choice: "LLM API with function calling",
        why: "Lets the agent check live availability and build quotes instead of guessing.",
      },
      {
        layer: "Retrieval",
        choice: "Postgres with pgvector, or a vector database",
        why: "Grounds replies in the business's own documents and keeps them current.",
      },
      {
        layer: "Guardrails",
        choice: "Deterministic policy checks before send",
        why: "Rules the model cannot talk its way around, such as price limits and approval requirements.",
      },
      {
        layer: "Messaging",
        choice: "Email and calendar APIs",
        why: "Sends replies and books calls from the same flow.",
      },
      {
        layer: "Evaluation",
        choice: "A test set of real past inquiries",
        why: "Every prompt or document change is checked against known good replies before it ships.",
      },
    ],
    prototype: [
      "A chat window over a handful of uploaded documents",
      "Good for testing tone and the most common questions",
      "A quick way to show the team what is possible",
    ],
    production: [
      {
        title: "Retrieval that stays accurate",
        why: "Pricing sheets and PDFs change. If the agent quotes last year's price, trust is gone after one mistake.",
      },
      {
        title: "No invented prices or promises",
        why: "Models fill gaps with confident guesses. Hard rules and live lookups have to cover anything the business could be held to.",
      },
      {
        title: "Permissions and data scope",
        why: "The agent should only see the records and documents it needs, nothing more.",
      },
      {
        title: "CRM field mapping and deduplication",
        why: "Real CRMs have messy fields and duplicate contacts. Write-back must not make the data worse.",
      },
      {
        title: "Approval workflows",
        why: "Who approves what, and what happens when no one does, determine whether leads still get answered.",
      },
      {
        title: "Versioned prompts and regression tests",
        why: "A small prompt change can quietly break a reply type. Each change is tested against real past inquiries.",
      },
      {
        title: "Attachments and multi-language messages",
        why: "Real inquiries include PDFs, photos and other languages.",
      },
      {
        title: "Full logging",
        why: "When a reply is questioned, you need to see what the agent said, what it read and why.",
      },
    ],
    approach: [
      "We would start with the draft-and-approve flow before touching autonomy. Trust has to be earned on real inquiries, and a person approving every reply for the first weeks produces the evidence for what can safely be automated.",
      "Grounding the agent against messy real-world documents, such as old PDFs and half-updated price sheets, is the slow part, so that comes before any interface work. We would build the evaluation set from the business's own past inquiries in the first phase and use it as the pass mark for every later change.",
    ],
    faqs: [
      {
        q: "Will it send replies without anyone checking?",
        a: "Not at first. It drafts and a person approves. Autonomy is switched on one reply type at a time, only after the drafts for that type have been consistently right.",
      },
      {
        q: "How do you stop it inventing prices?",
        a: "Prices come from rules and live lookups, not from the model's memory, and a separate policy check blocks any reply that states a number the system cannot trace to a source.",
      },
      {
        q: "Does it work with our CRM?",
        a: "We would start with Zoho, HubSpot or HighLevel, which have the APIs this needs. Other CRMs are possible if they expose records, tasks and email through an API.",
      },
      {
        q: "How long does a first version take?",
        a: "Our planning estimate is 8 to 12 weeks for a working draft-and-approve flow inside one CRM. We firm that up after seeing your documents and CRM setup.",
      },
    ],
    related: ["ai-voice-receptionist-for-clinics", "enterprise-multi-agent-assistant-microsoft-365"],
  },

  "enterprise-multi-agent-assistant-microsoft-365": {
    slug: "enterprise-multi-agent-assistant-microsoft-365",
    metaTitle: "Multi-Agent AI Assistant on Microsoft 365 and Azure: How to Build It | UI Pirate",
    metaDescription:
      "How to build permission-aware AI agents on Microsoft 365 and Azure OpenAI: architecture, phases, stack, security review and what production needs.",
    headline: "Multi-Agent Enterprise Assistant on Microsoft 365",
    subhead:
      "Narrow, auditable AI agents that act on the data your organization already has in Microsoft 365, and only ever see what each user is allowed to see.",
    foundation: {
      name: "Alfred OS",
      href: "/products",
      note: "Our own Alfred OS, a multi-agent platform built on FastAPI and Temporal workflows, is in active development. Its architecture is the starting point we'd extend, not a finished product to resell.",
    },
    problem: [
      "Organizations already live inside Microsoft 365: email, Teams, SharePoint and documents. They want AI agents that actually act on that data, finding a document, summarizing a thread, drafting a report or routing a request.",
      "But they cannot send sensitive company information to an uncontrolled tool, and a single general chatbot is not enough for real workflows. Every serious deployment has to get past a security and compliance review first.",
    ],
    market: [
      "Microsoft's own Copilot is the obvious incumbent. It is well integrated but general-purpose, and not tailored to any one organization's own workflows or internal processes.",
      "The opening is the specific, narrow agents a particular organization actually needs, built on the same permission and data infrastructure. A one-size-fits-all product cannot do that for every customer.",
    ],
    persona:
      "Typically an IT or operations leader at a mid-size enterprise already on Microsoft 365, who has tried or evaluated Copilot and found it too generic for their team's repetitive workflows, and who needs any AI tooling to pass a real security and compliance review.",
    phases: [
      {
        name: "Secure data layer",
        summary:
          "Access to Microsoft 365 data through Microsoft Graph, always respecting each user's existing permissions.",
      },
      {
        name: "First agent",
        summary:
          "One agent for one high-value workflow, such as document search and answer, or recurring reporting.",
      },
      {
        name: "Multiple agents",
        summary:
          "Specialized agents coordinated by an orchestrator, each with limited, auditable permissions.",
      },
      {
        name: "Admin and control",
        summary:
          "Admin controls, usage analytics, cost tracking and approval steps for sensitive actions.",
      },
    ],
    flow: [
      {
        label: "User asks in Teams or a web app",
        detail: "The request carries the user's identity from Microsoft Entra ID (Azure AD).",
      },
      {
        label: "Orchestrator selects an agent",
        detail:
          "A coordinating step routes the request to the narrow agent built for that task.",
      },
      {
        label: "Permission-aware retrieval",
        detail:
          "The agent reads data through Microsoft Graph as the user, so it can only see what that user can open.",
      },
      {
        label: "Model inside the tenant",
        detail:
          "Azure OpenAI Service processes the request inside the organization's Azure environment.",
      },
      {
        label: "Approval gate",
        detail:
          "Sensitive actions, such as sending an email or changing a record, wait for a human to confirm.",
      },
      {
        label: "Audit log",
        detail:
          "Every request, source document and action is recorded for the security team.",
      },
    ],
    stack: [
      {
        layer: "Data access",
        choice: "Microsoft Graph API",
        why: "One interface to mail, files, Teams and SharePoint, with permissions intact.",
      },
      {
        layer: "Model",
        choice: "Azure OpenAI Service",
        why: "Keeps data inside the organization's Azure tenant, which is what security teams ask for first.",
      },
      {
        layer: "Identity",
        choice: "Microsoft Entra ID (Azure AD)",
        why: "Acts on behalf of the signed-in user, so access follows existing permissions.",
      },
      {
        layer: "Backend",
        choice: "Python (FastAPI)",
        why: "A good fit for agent orchestration and the AI ecosystem.",
      },
      {
        layer: "Retrieval",
        choice: "Vector store with access-control metadata",
        why: "Search results are filtered by who is asking, not just by relevance.",
      },
      {
        layer: "Workflows",
        choice: "A durable workflow engine such as Temporal",
        why: "Long-running agent tasks survive restarts and can pause for approval.",
      },
    ],
    prototype: [
      "A single agent answering questions over a handful of exported documents",
      "No real permissions involved, so it can only be tried on non-sensitive material",
      "Useful to show the team what an assistant could do",
    ],
    production: [
      {
        title: "Permission-aware retrieval",
        why: "A user must never get an answer drawn from a file they cannot open. A single leak is the failure that ends the engagement.",
      },
      {
        title: "Tenant and identity integration",
        why: "Acting as the signed-in user, handling consent and admin approval in the customer's own tenant.",
      },
      {
        title: "Data residency",
        why: "Many organizations require data to stay in specific regions and never leave their environment.",
      },
      {
        title: "Prompt-injection defenses",
        why: "A document or email can contain instructions aimed at the agent. Content has to be treated as data, never as commands.",
      },
      {
        title: "Action limits and approvals",
        why: "Each agent gets the minimum permissions for its job, and sensitive actions need explicit confirmation.",
      },
      {
        title: "Full audit logging",
        why: "Security teams need to answer who asked what, what was read and what was done.",
      },
      {
        title: "Evaluation at scale",
        why: "Quality must be measured on real tasks before and after every change.",
      },
      {
        title: "Rate limits and cost caps",
        why: "A busy day or a looping agent should not become a surprise bill.",
      },
    ],
    approach: [
      "We would build the permission-aware retrieval layer before any agent logic. If an answer can come from a document the user cannot open, nothing built on top matters, so this is proven first with the organization's own permission model.",
      "We would also bring a security review checklist to the first scoping call. In enterprise AI projects the security and compliance review is usually what stalls things long after the build is otherwise ready, so we would treat it as part of the project plan from the start.",
    ],
    faqs: [
      {
        q: "How is this different from Microsoft Copilot?",
        a: "Copilot is broad and general-purpose. This is about narrow agents built for your specific workflows, on the same permission and data foundations. Many organizations use both.",
      },
      {
        q: "Can the agent see data the user is not allowed to see?",
        a: "It should never be able to. The design acts on behalf of the signed-in user through Microsoft Graph, and retrieval is filtered by that user's permissions. Proving this is the first thing we would build and test.",
      },
      {
        q: "Does our data leave our Azure environment?",
        a: "The intended design keeps processing inside your Azure tenant using Azure OpenAI Service. We would confirm residency and retention requirements with your security team during scoping.",
      },
      {
        q: "How long does a first version take?",
        a: "Our planning estimate is 12 to 16 weeks for a first production agent, with the architecture ready for more. The security review runs alongside, and its timing depends on your organization.",
      },
    ],
    related: ["crm-grounded-sales-inquiry-agent", "hipaa-ready-ai-intake-billing"],
  },
};
