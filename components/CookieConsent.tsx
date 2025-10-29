"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    clarity?: (...args: any[]) => void;
  }
}

// Countries/regions that require cookie consent (EU/EEA/UK)
const GDPR_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "GB",
  "UK",
  "IS",
  "LI",
  "NO",
  "CH",
];

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(true);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
  });

  // Check if user is in a GDPR country
  const checkUserLocation = async () => {
    try {
      // Check if consent was already given
      const consent = localStorage.getItem("cookie-consent");
      if (consent) {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        initializeAnalytics(savedPreferences);
        setIsCheckingLocation(false);
        return;
      }

      // Use a free geolocation API to detect country
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const userCountry = data.country_code;

      if (GDPR_COUNTRIES.includes(userCountry)) {
        // User is in GDPR country - show banner
        setShowBanner(true);
      } else {
        // User is NOT in GDPR country - auto-accept all cookies
        const autoAcceptPreferences = {
          necessary: true,
          analytics: true,
        };
        setPreferences(autoAcceptPreferences);
        localStorage.setItem(
          "cookie-consent",
          JSON.stringify(autoAcceptPreferences)
        );
        initializeAnalytics(autoAcceptPreferences);
      }
    } catch (error) {
      // If geolocation fails, show banner to be safe (GDPR-compliant by default)
      console.error("Geolocation check failed:", error);
      setShowBanner(true);
    } finally {
      setIsCheckingLocation(false);
    }
  };

  useEffect(() => {
    checkUserLocation();
  }, []);

  const initializeAnalytics = (prefs: typeof preferences) => {
    if (prefs.analytics) {
      // Initialize Google Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }

      // Initialize Microsoft Clarity
      if (typeof window !== "undefined" && window.clarity) {
        window.clarity("consent");
      }
    } else {
      // Deny analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
        });
      }
    }
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
    };
    setPreferences(newPreferences);
    localStorage.setItem("cookie-consent", JSON.stringify(newPreferences));
    initializeAnalytics(newPreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
    };
    setPreferences(newPreferences);
    localStorage.setItem("cookie-consent", JSON.stringify(newPreferences));
    initializeAnalytics(newPreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    initializeAnalytics(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleToggleAnalytics = () => {
    setPreferences((prev) => ({
      ...prev,
      analytics: !prev.analytics,
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999999998]" />
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-[999999999] max-md:bottom-0">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {!showSettings ? (
            // Main Banner
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  🍪 We Value Your Privacy
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze
                  site traffic, and understand where our visitors are coming
                  from. By clicking "Accept All", you consent to our use of
                  cookies for analytics purposes (Google Analytics & Microsoft
                  Clarity).{" "}
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Learn more in our Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                  Customize
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        Necessary Cookies
                      </h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        Always Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Essential for the website to function properly. These
                      cannot be disabled.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Analytics Cookies
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Help us understand how visitors interact with our website
                      (Google Analytics, Microsoft Clarity). Data is anonymized.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={handleToggleAnalytics}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-300"
                >
                  Reject All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
