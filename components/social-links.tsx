import React from "react";

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  category: "social" | "portfolio" | "business" | "marketplace";
}

const socialLinks: SocialLink[] = [
  // Social Media
  {
    name: "LinkedIn Company",
    url: "https://www.linkedin.com/company/ui-pirate-by-vishal-anand/",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/linkedin_hxpv8e.svg",
    category: "social"
  },
  {
    name: "Twitter/X",
    url: "https://x.com/UI_Pirate",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/twitter_hxpv8e.svg",
    category: "social"
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com/user/UI-Pirate/",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/reddit_hxpv8e.svg",
    category: "social"
  },
  
  // Portfolio Platforms
  {
    name: "Behance",
    url: "https://www.behance.net/vishalanand-UI-UX",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/behance_hxpv8e.svg",
    category: "portfolio"
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/vishalanandUIUX",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/dribbble_hxpv8e.svg",
    category: "portfolio"
  },
  
  // Business Directories
  {
    name: "Clutch",
    url: "https://clutch.co/profile/ui-pirate-vishal-anand",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/clutch_hxpv8e.svg",
    category: "business"
  },
  {
    name: "Google Maps",
    url: "https://maps.app.goo.gl/tcp9QiMqsUmN7xoY8",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/google_hxpv8e.svg",
    category: "business"
  },
  
  // Marketplaces
  {
    name: "Upwork Agency",
    url: "https://www.upwork.com/agencies/1837026757439552424/",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/upwork_hxpv8e.svg",
    category: "marketplace"
  }
];

const teamLinks = [
  {
    name: "Vishal Anand",
    role: "Founder & Lead Designer",
    linkedin: "https://www.linkedin.com/in/vishal-a-51bb49110",
    behance: "https://www.behance.net/vishalanand-UI-UX",
    dribbble: "https://dribbble.com/vishalanandUIUX"
  },
  {
    name: "Kartik Kumar", 
    role: "UI/UX Designer",
    linkedin: "https://www.linkedin.com/in/kartik-kuamr/",
    behance: "https://www.behance.net/kartikkumar58",
    dribbble: "https://dribbble.com/Kartikuidesigns"
  },
  {
    name: "Syed Musaddiq",
    role: "UI/UX Designer", 
    linkedin: "https://www.linkedin.com/in/syedmusaddiq/",
    behance: "https://www.behance.net/syedmusaddiq_uxui",
    medium: "https://medium.com/@syedmusaddiq514"
  }
];

interface SocialLinksProps {
  showTeam?: boolean;
  layout?: "horizontal" | "vertical" | "grid";
  showCategories?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ 
  showTeam = false, 
  layout = "horizontal",
  showCategories = false 
}) => {
  const renderSocialLink = (link: SocialLink) => (
    <a
      key={link.name}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      title={`Visit UI Pirate on ${link.name}`}
    >
      <img 
        src={link.icon} 
        alt={`${link.name} icon`} 
        className="w-5 h-5 grayscale hover:grayscale-0 transition-all duration-200"
      />
      <span className="text-sm text-gray-600 hover:text-gray-900">
        {link.name}
      </span>
    </a>
  );

  const renderByCategory = () => {
    const categories = {
      social: "Social Media",
      portfolio: "Portfolio",
      business: "Business",
      marketplace: "Marketplaces"
    };

    return Object.entries(categories).map(([category, title]) => {
      const categoryLinks = socialLinks.filter(link => link.category === category);
      
      return (
        <div key={category} className="mb-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
          <div className="flex flex-wrap gap-2">
            {categoryLinks.map(renderSocialLink)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="social-links">
      {/* Main Social Links */}
      {showCategories ? (
        renderByCategory()
      ) : (
        <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-wrap'} gap-2`}>
          {socialLinks.map(renderSocialLink)}
        </div>
      )}

      {/* Team Links */}
      {showTeam && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Our Team</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamLinks.map((member) => (
              <div key={member.name} className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900">{member.name}</h5>
                <p className="text-xs text-gray-600 mb-2">{member.role}</p>
                <div className="flex gap-2">
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title={`${member.name} on LinkedIn`}
                    >
                      <span className="text-xs">LinkedIn</span>
                    </a>
                  )}
                  {member.behance && (
                    <a 
                      href={member.behance} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title={`${member.name} on Behance`}
                    >
                      <span className="text-xs">Behance</span>
                    </a>
                  )}
                  {member.dribbble && (
                    <a 
                      href={member.dribbble} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                      title={`${member.name} on Dribbble`}
                    >
                      <span className="text-xs">Dribbble</span>
                    </a>
                  )}
                  {member.medium && (
                    <a 
                      href={member.medium} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800"
                      title={`${member.name} on Medium`}
                    >
                      <span className="text-xs">Medium</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "UI Pirate by Vishal Anand",
            "url": "https://uipirate.com",
            "sameAs": socialLinks.map(link => link.url)
          })
        }}
      />
    </div>
  );
};

export default SocialLinks;
