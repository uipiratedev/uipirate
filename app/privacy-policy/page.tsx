import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            UI Pirate ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website
            uipirate.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            2. Information We Collect
          </h2>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            2.1 Information You Provide
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may collect personal information that you voluntarily provide to
            us when you:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Contact us through our contact forms</li>
            <li>Subscribe to our newsletter</li>
            <li>Request a consultation or quote</li>
            <li>Engage with our services</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800">
            2.2 Automatically Collected Information
          </h3>
          <p className="text-gray-700 leading-relaxed">
            When you visit our website, we automatically collect certain
            information about your device and browsing behavior through cookies
            and similar technologies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            3. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to track activity on
            our website and store certain information. You can control cookies
            through our cookie consent banner and your browser settings.
          </p>

          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            3.1 Types of Cookies We Use
          </h3>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Necessary Cookies
            </h4>
            <p className="text-gray-700 text-sm">
              Essential for the website to function properly. These cookies
              enable basic functions like page navigation and access to secure
              areas of the website.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              Analytics Cookies
            </h4>
            <p className="text-gray-700 text-sm mb-2">
              Help us understand how visitors interact with our website by
              collecting and reporting information anonymously. We use:
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
              <li>
                <strong>Google Analytics:</strong> Tracks website usage,
                visitor behavior, and traffic sources. Data is stored on Google
                servers. Learn more at{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong>Microsoft Clarity:</strong> Records user sessions,
                heatmaps, and interaction patterns to improve user experience.
                Learn more at{" "}
                <a
                  href="https://privacy.microsoft.com/en-us/privacystatement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Microsoft Privacy Statement
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            4. How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>
              Communicate with you for customer service, updates, and marketing
            </li>
            <li>Process your transactions and manage your requests</li>
            <li>Find and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            5. Your Rights (GDPR & Privacy Laws)
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you are a resident of the European Economic Area (EEA), United
            Kingdom, or other jurisdictions with applicable privacy laws, you
            have certain data protection rights:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Right to Access:</strong> Request copies of your personal
              data
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of
              inaccurate data
            </li>
            <li>
              <strong>Right to Erasure:</strong> Request deletion of your
              personal data
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> Request limitation
              of processing
            </li>
            <li>
              <strong>Right to Data Portability:</strong> Request transfer of
              your data
            </li>
            <li>
              <strong>Right to Object:</strong> Object to processing of your
              data
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Withdraw consent at
              any time
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            6. Cookie Consent Management
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You can manage your cookie preferences at any time by:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Clearing your browser cookies and revisiting our website</li>
            <li>Adjusting your browser settings to block or delete cookies</li>
            <li>
              Using our cookie consent banner when it appears on your first
              visit
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Please note that disabling cookies may affect the functionality of
            our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            7. Data Retention
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            8. Third-Party Services
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our website uses third-party services that may collect information:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Google Analytics (Analytics)</li>
            <li>Microsoft Clarity (Analytics & Session Recording)</li>
            <li>Vercel Speed Insights (Performance Monitoring)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            These services have their own privacy policies and we encourage you
            to review them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            9. International Data Transfers
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and maintained on computers
            located outside of your state, province, country, or other
            governmental jurisdiction where data protection laws may differ. We
            ensure appropriate safeguards are in place for such transfers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            10. Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or wish to
            exercise your rights, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>UI Pirate</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:privacy@uipirate.com"
                className="text-blue-600 hover:underline"
              >
                privacy@uipirate.com
              </a>
              <br />
              Website:{" "}
              <a
                href="https://uipirate.com"
                className="text-blue-600 hover:underline"
              >
                https://uipirate.com
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            11. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

