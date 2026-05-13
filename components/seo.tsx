import Head from "next/head";

const Seo = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UI Pirate by Vishal Anand",
    url: "https://uipirate.com",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg",
    description:
      "Product design and frontend development agency that turns ideas into shipped products. Specializing in product thinking, competitive analysis, information architecture, UX/UI design, and complex enterprise frontend development in Angular, React, and Next.js. Serving Fortune 500 companies across USA, UK, Singapore, India, and Australia.",
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
      email: "vishal@uipirate.com",
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
      "Product Design",
      "Product Thinking",
      "Competitive Analysis",
      "Information Architecture",
      "UI Design",
      "UX Design",
      "Angular Development",
      "React Development",
      "Complex Enterprise Applications",
      "Frontend Engineering",
      "SaaS Design",
      "AI Application Design",
      "Enterprise Software Design",
      "Mobile App Design",
      "Design Systems",
      "Fortune 500 Design",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Product Design & Frontend Development Services",
    provider: {
      "@type": "Organization",
      name: "UI Pirate by Vishal Anand",
      url: "https://uipirate.com",
    },
    description:
      "Full-service product design and frontend development — from idea to shipped product. Includes product thinking, competitive analysis, information architecture, UX/UI design, complex enterprise Angular/React development, design systems, SaaS applications, and mobile apps.",
    serviceType: [
      "Product Design",
      "Product Thinking",
      "Competitive Analysis",
      "Information Architecture",
      "UI Design",
      "UX Design",
      "Angular Development",
      "React Development",
      "Complex Enterprise Applications",
      "Frontend Engineering",
      "Design Systems",
      "SaaS Design",
      "AI Application Design",
      "Mobile App Design",
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
      "Product Design",
      "Product Thinking",
      "Competitive Analysis",
      "Information Architecture",
      "UI Design",
      "UX Design",
      "Angular Development",
      "React Development",
      "Complex Enterprise Applications",
      "SaaS Design",
      "AI Application Design",
    ],
  };

  return (
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
        type="application/ld+json"
      />
    </Head>
  );
};

export default Seo;
