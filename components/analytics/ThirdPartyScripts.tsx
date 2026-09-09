"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Google Analytics (GA4) + Microsoft Clarity, loaded on public pages only.
 *
 * Private surfaces (/admin, /login) are internal team traffic and must never
 * reach GA or Clarity — it pollutes acquisition, engagement and conversion
 * reports. Route-gating here means the tags are simply never injected on those
 * paths. Also add a GA4 "internal traffic" data filter for defence in depth.
 */
const PRIVATE_PREFIXES = ["/admin", "/login"];

export function ThirdPartyScripts() {
  const pathname = usePathname();
  const isPrivate = PRIVATE_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`),
  );

  if (isPrivate) return null;

  return (
    <>
      {/* Google Analytics with Consent Mode - lazy loaded */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'wait_for_update': 500
              });
              gtag('js', new Date());
              gtag('config', 'G-ZS77RQCWYM', {
                'anonymize_ip': true
              });
            `,
        }}
        id="gtag-base"
        strategy="lazyOnload"
      />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-ZS77RQCWYM"
        strategy="lazyOnload"
      />

      {/* Microsoft Clarity - lazy loaded */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "txqkzeahh6");
            `,
        }}
        id="clarity-script"
        strategy="lazyOnload"
      />
    </>
  );
}
