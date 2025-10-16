import Head from "next/head";

const Seo = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UI Pirate by Vishal Anand",
    url: "https://uipirate.com",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg",
    description:
      "Global enterprise UI/UX design agency serving Fortune 500 companies across USA, UK, Singapore, India, and Australia. Specializing in UI development, graphic design, motion graphics, design systems, AI/SaaS applications, and mobile app design.",
    sameAs: [
      "https://www.linkedin.com/in/vishal-a-51bb49110",
      "https://www.behance.net/vishalanand-UI-UX",
      "https://dribbble.com/vishalanandUIUX",
      "https://maps.app.goo.gl/GV82USvoBF7YGsZm7",
    ],
    founder: {
      "@type": "Person",
      name: "Vishal Anand",
      jobTitle: "Founder & Lead UI/UX Designer",
      url: "https://www.linkedin.com/company/ui-pirate-by-vishal-anand",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+919708636151",
      contactType: "customer service",
      email: "vishalanand072@gmail.com",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    serviceArea: [
      {
        "@type": "Country",
        name: "United States",
      },
      {
        "@type": "Country",
        name: "United Kingdom",
      },
      {
        "@type": "Country",
        name: "Singapore",
      },
      {
        "@type": "Country",
        name: "India",
      },
      {
        "@type": "Country",
        name: "Australia",
      },
    ],
    knowsAbout: [
      "UI Design",
      "UX Design",
      "UI Development",
      "Graphic Design",
      "Motion Graphics",
      "SaaS Design",
      "AI Application Design",
      "Enterprise Software Design",
      "Mobile App Design",
      "Web Design",
      "Design Systems",
      "Enterprise Clients",
      "Fortune 500 Design",
      "Startup Design",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Enterprise UI/UX Design & Development Services",
    provider: {
      "@type": "Organization",
      name: "UI Pirate by Vishal Anand",
      url: "https://uipirate.com",
    },
    description:
      "Comprehensive UI/UX design and development services for enterprise clients, including UI development, graphic design, motion graphics, design systems, AI/SaaS applications, and mobile app design",
    serviceType: [
      "UI Design",
      "UX Design",
      "UI Development",
      "Graphic Design",
      "Motion Graphics",
      "Design Systems",
      "SaaS Design",
      "AI Application Design",
      "Mobile App Design",
      "Enterprise Design",
      "Web Development",
    ],
    areaServed: [
      "United States",
      "United Kingdom",
      "Singapore",
      "India",
      "Australia",
    ],
    audience: {
      "@type": "Audience",
      audienceType:
        "Enterprise clients, Fortune 500 companies, SaaS companies, Tech startups, Mobile app companies",
    },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vishal Anand",
    jobTitle: "UI/UX Designer",
    worksFor: {
      "@type": "Organization",
      name: "UI Pirate",
    },
    url: "https://uipirate.com",
    sameAs: [
      "https://www.linkedin.com/in/vishal-a-51bb49110",
      "https://www.linkedin.com/company/ui-pirate-by-vishal-anand/",
      "https://www.behance.net/vishalanand-UI-UX",
      "https://www.behance.net/UI-Pirate",
      "https://dribbble.com/vishalanandUIUX",
      "https://www.upwork.com/agencies/1837026757439552424/",
      "https://www.upwork.com/freelancers/~011edd6b2713748d24",
      "https://upwork.com/freelancers/vishalanand",
      "https://clutch.co/profile/ui-pirate-vishal-anand",
      "https://x.com/UI_Pirate",
      "https://www.reddit.com/user/UI-Pirate/",
      "https://maps.app.goo.gl/tcp9QiMqsUmN7xoY8",
    ],
    knowsAbout: [
      "UI Design",
      "UX Design",
      "SaaS Design",
      "AI Application Design",
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
    </Head>
  );
};

export default Seo;
