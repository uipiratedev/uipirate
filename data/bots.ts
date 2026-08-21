export type BotCategory = "ai-training" | "ai-search" | "search-engine" | "seo-tool" | "social";

export interface BotDetailedInfo {
  id: string;
  name: string;
  company: string;
  userAgent: string;
  description: string;
  fullOverview: string;
  color: string;
  category: BotCategory;
  categoryLabel: string;
  weight: number;
  safetyRating: "Safe & Legitimate" | "Caution" | "Aggressive Scraper";
  seoImpact: "No SEO Impact" | "Critical for SEO" | "Moderate Search Impact";
  officialDocsUrl: string;
  reverseDnsHost: string;
  respectsRobotsTxt: boolean;
  purpose: string;
  faqs: Array<{ question: string; answer: string }>;
}

export const DETAILED_BOTS: BotDetailedInfo[] = [
  {
    id: "gptbot",
    name: "GPTBot",
    company: "OpenAI",
    userAgent: "GPTBot",
    description: "Crawls web pages to train ChatGPT, GPT-4o, and OpenAI foundation models.",
    fullOverview:
      "GPTBot is OpenAI's web crawler used to collect public web data for training foundation AI models, including ChatGPT and GPT-4o. Crawling by GPTBot does not directly power live ChatGPT web search citations (which is handled by ChatGPT-User or OAI-SearchBot), but directly feeds training datasets.",
    color: "#10A37F",
    category: "ai-training",
    categoryLabel: "AI Training",
    weight: 5,
    safetyRating: "Safe & Legitimate",
    seoImpact: "No SEO Impact",
    officialDocsUrl: "https://platform.openai.com/docs/gptbot",
    reverseDnsHost: "crawl-*.openai.com",
    respectsRobotsTxt: true,
    purpose: "Foundation model pre-training & fine-tuning datasets",
    faqs: [
      {
        question: "Will blocking GPTBot hurt my Google SEO rankings?",
        answer:
          "No. GPTBot is operated solely by OpenAI for AI training. Blocking GPTBot has zero impact on Google, Bing, or standard search engine rankings.",
      },
      {
        question: "How do I block GPTBot in robots.txt?",
        answer:
          "Add the following rule to your robots.txt file:\n\nUser-agent: GPTBot\nDisallow: /",
      },
      {
        question: "Does GPTBot respect robots.txt?",
        answer:
          "Yes, GPTBot strictly adheres to standard robots.txt specifications and the Robots Exclusion Protocol (RFC 9309).",
      },
    ],
  },
  {
    id: "chatgpt-user",
    name: "ChatGPT-User",
    company: "OpenAI",
    userAgent: "ChatGPT-User",
    description: "Executes real-time live browsing when a ChatGPT user asks for fresh web info.",
    fullOverview:
      "ChatGPT-User is used by OpenAI to perform live, real-time web browsing on behalf of ChatGPT users. When a user asks ChatGPT a question requiring current data, ChatGPT-User fetches the page and uses it to generate citations and backlinks.",
    color: "#10A37F",
    category: "ai-search",
    categoryLabel: "AI Search",
    weight: 5,
    safetyRating: "Safe & Legitimate",
    seoImpact: "Moderate Search Impact",
    officialDocsUrl: "https://platform.openai.com/docs/plugins/bot",
    reverseDnsHost: "openai.com",
    respectsRobotsTxt: true,
    purpose: "On-demand live browsing & real-time answers for ChatGPT users",
    faqs: [
      {
        question: "What happens if I block ChatGPT-User?",
        answer:
          "If you block ChatGPT-User, ChatGPT will be unable to browse your site in response to live user questions, preventing your links and content from appearing as citations.",
      },
      {
        question: "How do I allow ChatGPT-User?",
        answer:
          "User-agent: ChatGPT-User\nAllow: /",
      },
    ],
  },
  {
    id: "claudebot",
    name: "ClaudeBot",
    company: "Anthropic",
    userAgent: "ClaudeBot",
    description: "Indexes web content to train Claude 3.5 Sonnet, Opus, and Haiku models.",
    fullOverview:
      "ClaudeBot is Anthropic's primary web crawler designed to index public websites for training future iterations of Claude AI models. It strictly honors robots.txt directives and crawls with polite request delays.",
    color: "#CC785C",
    category: "ai-training",
    categoryLabel: "AI Training",
    weight: 5,
    safetyRating: "Safe & Legitimate",
    seoImpact: "No SEO Impact",
    officialDocsUrl: "https://docs.anthropic.com/en/docs/claude-bot",
    reverseDnsHost: "claudebot.anthropic.com",
    respectsRobotsTxt: true,
    purpose: "Anthropic Claude LLM dataset collection",
    faqs: [
      {
        question: "Does ClaudeBot respect robots.txt?",
        answer:
          "Yes, ClaudeBot respects robots.txt Disallow directives immediately upon fetching.",
      },
      {
        question: "How do I block ClaudeBot?",
        answer:
          "User-agent: ClaudeBot\nDisallow: /",
      },
    ],
  },
  {
    id: "google-extended",
    name: "Google-Extended",
    company: "Google",
    userAgent: "Google-Extended",
    description: "Controls training data collection for Gemini, Vertex AI, and Google Search generative AI.",
    fullOverview:
      "Google-Extended is a standalone token introduced by Google that allows webmasters to opt out of having their content used to train Google's Gemini generative AI models and Vertex AI without affecting regular Google Search indexation by Googlebot.",
    color: "#4285F4",
    category: "ai-training",
    categoryLabel: "AI Training",
    weight: 5,
    safetyRating: "Safe & Legitimate",
    seoImpact: "No SEO Impact",
    officialDocsUrl: "https://developers.google.com/search/docs/crawling-indexing/google-extended",
    reverseDnsHost: "google.com",
    respectsRobotsTxt: true,
    purpose: "Google Gemini & generative AI model training opt-out",
    faqs: [
      {
        question: "Does blocking Google-Extended hurt my Google Search rankings?",
        answer:
          "No. Google explicitly designed Google-Extended so that blocking it does NOT impact your rankings in regular Google Search or Discover.",
      },
      {
        question: "How do I block Google-Extended?",
        answer:
          "User-agent: Google-Extended\nDisallow: /",
      },
    ],
  },
  {
    id: "perplexitybot",
    name: "PerplexityBot",
    company: "Perplexity AI",
    userAgent: "PerplexityBot",
    description: "Retrieves live web content to cite sources directly in Perplexity conversational search.",
    fullOverview:
      "PerplexityBot is the crawler for Perplexity AI, the conversational AI search engine. PerplexityBot indexes web pages to synthesize accurate answers and credit publishers with prominent numbered source citation cards.",
    color: "#20808D",
    category: "ai-search",
    categoryLabel: "AI Search",
    weight: 5,
    safetyRating: "Safe & Legitimate",
    seoImpact: "Critical for SEO",
    officialDocsUrl: "https://docs.perplexity.ai/docs/perplexitybot",
    reverseDnsHost: "perplexity.ai",
    respectsRobotsTxt: true,
    purpose: "Live web retrieval & citations in Perplexity AI search",
    faqs: [
      {
        question: "Why should I allow PerplexityBot?",
        answer:
          "Allowing PerplexityBot ensures your brand, products, and articles are cited with direct backlinks when millions of users search on Perplexity AI.",
      },
      {
        question: "How do I allow PerplexityBot?",
        answer:
          "User-agent: PerplexityBot\nAllow: /",
      },
    ],
  },
  {
    id: "meta-externalagent",
    name: "Meta-ExternalAgent",
    company: "Meta AI",
    userAgent: "meta-externalagent",
    description: "Collects training datasets for Meta Llama open-source models and Meta AI.",
    fullOverview:
      "Meta-ExternalAgent is Meta's dedicated crawler for ingesting public web data to train Meta Llama foundation models and improve Meta AI across Instagram, WhatsApp, and Facebook.",
    color: "#0866FF",
    category: "ai-training",
    categoryLabel: "AI Training",
    weight: 4,
    safetyRating: "Safe & Legitimate",
    seoImpact: "No SEO Impact",
    officialDocsUrl: "https://www.meta.com/help/crawler",
    reverseDnsHost: "meta.com",
    respectsRobotsTxt: true,
    purpose: "Meta Llama model training & AI feature enhancement",
    faqs: [
      {
        question: "How do I block Meta AI training crawler?",
        answer:
          "User-agent: meta-externalagent\nDisallow: /",
      },
    ],
  },
  {
    id: "applebot-extended",
    name: "Applebot-Extended",
    company: "Apple",
    userAgent: "Applebot-Extended",
    description: "Trains Apple Intelligence foundation models for Siri and iOS features.",
    fullOverview:
      "Applebot-Extended was introduced with iOS 18 / Apple Intelligence to allow publishers to opt out of having their web content used to train Apple's on-device and server generative models, while keeping standard Applebot indexing for Spotlight search intact.",
    color: "#555555",
    category: "ai-training",
    categoryLabel: "AI Training",
    weight: 4,
    safetyRating: "Safe & Legitimate",
    seoImpact: "No SEO Impact",
    officialDocsUrl: "https://support.apple.com/en-us/119829",
    reverseDnsHost: "applebot.apple.com",
    respectsRobotsTxt: true,
    purpose: "Apple Intelligence generative foundation training",
    faqs: [
      {
        question: "Does blocking Applebot-Extended affect Apple Spotlight search?",
        answer:
          "No. Standard Applebot handles Spotlight and Siri web lookups. Applebot-Extended only governs generative AI model training.",
      },
      {
        question: "How to block Applebot-Extended?",
        answer:
          "User-agent: Applebot-Extended\nDisallow: /",
      },
    ],
  },
  {
    id: "bytespider",
    name: "Bytespider",
    company: "ByteDance (TikTok)",
    userAgent: "Bytespider",
    description: "ByteDance AI crawler collecting data for Doubao and TikTok AI algorithms.",
    fullOverview:
      "Bytespider is operated by ByteDance (the parent company of TikTok). It crawls aggressively to gather training datasets for Doubao and ByteDance multimodal AI models. Many webmasters rate-limit or disallow this bot due to high crawl volume.",
    color: "#EE1D52",
    category: "ai-training",
    categoryLabel: "AI Training",
    weight: 4,
    safetyRating: "Caution",
    seoImpact: "No SEO Impact",
    officialDocsUrl: "https://www.bytedance.com",
    reverseDnsHost: "bytedance.com",
    respectsRobotsTxt: true,
    purpose: "ByteDance AI model training data extraction",
    faqs: [
      {
        question: "Why do many websites block Bytespider?",
        answer:
          "Bytespider is known for aggressive request frequencies that can elevate server load, and it does not provide search traffic back to western websites.",
      },
      {
        question: "How do I block Bytespider?",
        answer:
          "User-agent: Bytespider\nDisallow: /",
      },
    ],
  },
  {
    id: "ccbot",
    name: "CCBot",
    company: "Common Crawl",
    userAgent: "CCBot",
    description: "Massive open web crawl repository that feeds training sets for 80%+ of open LLMs.",
    fullOverview:
      "CCBot is the crawler for Common Crawl, a non-profit foundation providing open web copy archives. Common Crawl datasets are used by virtually every major open-source AI project, university, and AI research lab worldwide.",
    color: "#7C3AED",
    category: "ai-training",
    categoryLabel: "AI Training",
    weight: 4,
    safetyRating: "Safe & Legitimate",
    seoImpact: "No SEO Impact",
    officialDocsUrl: "https://commoncrawl.org/faq",
    reverseDnsHost: "commoncrawl.org",
    respectsRobotsTxt: true,
    purpose: "Public open crawl archives for AI research",
    faqs: [
      {
        question: "How do I block Common Crawl?",
        answer:
          "User-agent: CCBot\nDisallow: /",
      },
    ],
  },
  {
    id: "amazonbot",
    name: "Amazonbot",
    company: "Amazon",
    userAgent: "Amazonbot",
    description: "Crawls web pages for Amazon Bedrock AI, Titan LLMs, and Alexa intelligence.",
    fullOverview:
      "Amazonbot is Amazon's general web crawler that indexes information to improve Alexa knowledge responses, search accuracy on Amazon properties, and AI datasets for AWS Titan and Amazon Bedrock.",
    color: "#FF9900",
    category: "ai-training",
    categoryLabel: "AI Training",
    weight: 4,
    safetyRating: "Safe & Legitimate",
    seoImpact: "No SEO Impact",
    officialDocsUrl: "https://developer.amazon.com/amazonbot",
    reverseDnsHost: "amazon.com",
    respectsRobotsTxt: true,
    purpose: "Alexa question answering & AWS Bedrock model development",
    faqs: [
      {
        question: "How to allow Amazonbot in robots.txt?",
        answer:
          "User-agent: Amazonbot\nAllow: /",
      },
    ],
  },
  {
    id: "googlebot",
    name: "Googlebot",
    company: "Google",
    userAgent: "Googlebot",
    description: "Main Google search crawler. Powers Google Search, Discover, and AI Overviews.",
    fullOverview:
      "Googlebot is Google's flagship search indexing crawler. It crawls billions of web pages daily to populate Google Search indexes and directly drives Google AI Overviews synthesized in search result pages.",
    color: "#4285F4",
    category: "search-engine",
    categoryLabel: "Search Engine",
    weight: 5,
    safetyRating: "Safe & Legitimate",
    seoImpact: "Critical for SEO",
    officialDocsUrl: "https://developers.google.com/search/docs/crawling-indexing/googlebot",
    reverseDnsHost: "googlebot.com",
    respectsRobotsTxt: true,
    purpose: "Google Organic Search, Discover, and AI Overviews indexing",
    faqs: [
      {
        question: "Should I ever block Googlebot?",
        answer:
          "Almost never, unless a staging/private site should be entirely removed from Google search. Blocking Googlebot eliminates 100% of your Google search rankings.",
      },
    ],
  },
  {
    id: "bingbot",
    name: "Bingbot",
    company: "Microsoft",
    userAgent: "bingbot",
    description: "Powers Microsoft Bing and Microsoft Copilot live web answers.",
    fullOverview:
      "Bingbot is Microsoft's web search crawler that discovers, parses, and indexes web content for Bing Search, Yahoo Search (powered by Bing), and Microsoft Copilot AI synthesis.",
    color: "#008373",
    category: "search-engine",
    categoryLabel: "Search Engine",
    weight: 4,
    safetyRating: "Safe & Legitimate",
    seoImpact: "Critical for SEO",
    officialDocsUrl: "https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0",
    reverseDnsHost: "search.msn.com",
    respectsRobotsTxt: true,
    purpose: "Microsoft Bing and Copilot web indexing",
    faqs: [
      {
        question: "Does Bingbot feed Copilot?",
        answer:
          "Yes, Microsoft Copilot relies on Bing's search index to retrieve current web citations.",
      },
    ],
  },
];

export function getBotById(id: string): BotDetailedInfo | undefined {
  return DETAILED_BOTS.find((b) => b.id.toLowerCase() === id.toLowerCase());
}
