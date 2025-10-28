"use client";

const footerSocialLinks = [
  {
    name: "Google Maps",
    url: "https://maps.app.goo.gl/tcp9QiMqsUmN7xoY8",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1751630868/maps_icon-s_rgw06n.svg",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/ui-pirate-by-vishal-anand/",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729665622/ri_linkedin-fill_nivdt4.svg",
  },
  {
    name: "Upwork",
    url: "https://www.upwork.com/agencies/1837026757439552424/",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729665602/bxl_upwork_qojqwz.svg",
  },
  {
    name: "Behance",
    url: "https://www.behance.net/vishalanand-UI-UX",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729665601/uil_behance_ky54am.svg",
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/vishalanandUIUX",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730786563/uil_behance_mf89uz.svg",
  },
  {
    name: "Clutch",
    url: "https://clutch.co/profile/ui-pirate-vishal-anand",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729665601/Frame_1000006225_bafxox.svg",
  },
];

const LandingFooter = () => {
  return (
    <footer className="relative overflow-hidden text-white">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1760676342/footer_bg_kcfu7f.svg"
          alt="Footer background"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/95"></div> */}
      </div>
      {/* Main Footer Content */}
      <div className="relative container mx-auto z-50 px-8 lg:px-20 py-16 max-md:py-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-md:gap-8">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729862847/Div_framer-bfl99f_v7cltn.svg"
                alt="UI Pirate logo"
                className="w-10 h-10"
              />
              <p className="text-xl font-semibold">UI Pirate</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Scalable UI/UX design for SaaS, & AI Products
            </p>
          </div>

          <div className=" flex flex-row justify-between w-full max-md:flex-row max-md:gap-y-4">
            {/* Column 2 - Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-base">
                Quick Links
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/ourWorks"
                    className="hover:text-white transition-colors"
                  >
                    Works
                  </a>
                </li>
                {/* <li>
                  <a
                    href="/ourTeam"
                    className="hover:text-white transition-colors"
                  >
                    Our Team
                  </a>
                </li> */}
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-base">
                Resources
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a
                    href="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Blogs
                  </a>
                </li>
                {/* <li>
                  <a
                    href="/tools"
                    className="hover:text-white transition-colors"
                  >
                    Tools
                  </a>
                </li> */}
                <li>
                  <a
                    href="/faqs"
                    className="hover:text-white transition-colors"
                  >
                    FAQ’s
                  </a>
                </li>
                {/* connect sitemap with xml file */}
                <li>
                  <a
                    href="/sitemap"
                    className="hover:text-white transition-colors"
                  >
                    Site Map
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Policies & Legal */}
            {/* <div>
              <h4 className="font-semibold text-white mb-4 text-base">
                Policies & Legal
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a
                    href="/privacy-policy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap"
                    className="hover:text-white transition-colors"
                  >
                    Site Map
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 max-md:mt-8 border-t border-gray-700  max-md:pt-4 flex flex-row justify-between max-md:flex-col">
          {/* Social Icons */}
          <div className="flex flex-wrap items-center gap-3 max-md:gap-2">
            {footerSocialLinks.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity duration-300 hover:bg-gray-100 hover:bg-transparent/15 rounded-lg"
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-12 h-12 max-md:w-10 max-md:h-10"
                />
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-sm text-center md:text-left max-md:pt-4 max-md:mb-8 max-md:pb-8">
            Copyright©2023 UI Pirate. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
