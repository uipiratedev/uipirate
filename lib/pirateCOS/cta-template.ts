export type CTATemplate = {
  id: string;
  name: string;
  description: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
};

export const CTA_TEMPLATES: CTATemplate[] = [
  {
    id: "get-started",
    name: "Get Started",
    description: "General-purpose conversion CTA",
    title: "Ready to take the next step?",
    subtitle: "Get started today and see the difference.",
    buttonLabel: "Click Here to Start",
    buttonHref: "#",
  },
  {
    id: "newsletter",
    name: "Newsletter Signup",
    description: "Capture email subscribers",
    title: "Stay in the loop",
    subtitle: "Subscribe to weekly insights, delivered straight to your inbox.",
    buttonLabel: "Subscribe Now",
    buttonHref: "#",
  },
  {
    id: "free-trial",
    name: "Free Trial",
    description: "Push a no-risk trial signup",
    title: "Try it free for 14 days",
    subtitle: "No credit card required. Cancel anytime.",
    buttonLabel: "Start Free Trial",
    buttonHref: "#",
  },
  {
    id: "consultation",
    name: "Book Consultation",
    description: "High-intent service booking",
    title: "Let's talk about your project",
    subtitle: "Schedule a free 15-minute consultation with our team.",
    buttonLabel: "Book a Call",
    buttonHref: "#",
  },
  {
    id: "download",
    name: "Download Resource",
    description: "Lead magnet or gated asset",
    title: "Grab your free guide",
    subtitle: "Download the complete playbook — packed with templates and examples.",
    buttonLabel: "Download Free Guide",
    buttonHref: "#",
  },
];

export function renderCTAHtml(template: CTATemplate): string {
  return `
              <div class="cta-block border-2 border-orange-500 rounded-2xl p-6 my-6 bg-orange-50/50 flex flex-col items-center text-center">
                <h3 class="text-lg font-bold text-gray-900 mb-2">${template.title}</h3>
                <p class="text-sm text-gray-600 mb-4">${template.subtitle}</p>
                <a href="${template.buttonHref}" class="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold shadow hover:bg-orange-600 transition-colors">${template.buttonLabel}</a>
              </div>
            `;
}

export const DEFAULT_CTA_BLOCK_HTML = renderCTAHtml(CTA_TEMPLATES[0]);
