import { Metadata } from "next";
import Link from "next/link";

// Transactional "thank you" page — not meant to rank in search, but needs a
// real URL so it can be used as a Google Ads "page load" conversion trigger.
export const metadata: Metadata = {
  title: "You're All Set | UI Pirate",
  description: "Your project inquiry has been received.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://uipirate.com/contact/success",
  },
};

const ContactSuccessPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 pt-24 max-md:pt-20 pb-16 text-center">
      <div className="mb-8">
        <svg
          fill="none"
          height="96"
          viewBox="0 0 120 120"
          width="96"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="60"
            cy="60"
            fill="#FFF0E8"
            r="56"
            stroke="#FFD9C2"
            strokeDasharray="4 4"
            strokeWidth="2"
          />
          <circle cx="60" cy="60" fill="#FF5B04" r="44" />
          <path
            d="M48 60L56 68L72 52"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </svg>
      </div>

      <h1 className="text-3xl max-md:text-2xl font-black text-gray-900 mb-4">
        You&apos;re All Set!
      </h1>
      <p className="text-gray-600 text-lg max-md:text-base mb-10 max-w-[420px]">
        Your inquiry has been received. A member of our team will get in touch
        with you shortly — typically within 2 hours.
      </p>

      <div className="w-full max-w-[280px]">
        <Link
          className="flex items-center justify-center w-full h-[56px] rounded-full bg-black text-white font-bold hover:bg-gray-900 transition-all shadow-xl"
          href="/"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ContactSuccessPage;
