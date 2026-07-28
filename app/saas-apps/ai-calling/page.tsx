import { Metadata } from "next";

import AICallingScreen from "@/screens/saasApps/ai-calling";

export const metadata: Metadata = {
  title: "Conversational Voice Agents for Enterprise | AI Calling",
  description:
    "Automate high-volume phone calls with a hybrid engine that combines rule-based efficiency with LLM intelligence. Deploy human-like neural voice agents that handle complex scenarios instantly.",
  keywords:
    "AI calling, voice AI, conversational AI agents, enterprise voice automation, AI phone agents, LLM voice technology",
  openGraph: {
    title: "Conversational Voice Agents for Enterprise | UI Pirate",
    description:
      "Automate high-volume phone calls with a hybrid engine combining rule-based efficiency with LLM intelligence and human-like neural voices.",
    url: "https://uipirate.com/saas-apps/ai-calling",
    siteName: "UI Pirate by Vishal Anand",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/saas-apps/ai-calling",
  },
};

export default function AICallingPage() {
  return <AICallingScreen />;
}
