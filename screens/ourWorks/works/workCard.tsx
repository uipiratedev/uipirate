import React from 'react';
import Image from 'next/image';
import LetsTalkButton from '@/components/LetsTalkButton';

const caseStudies = [
  {
    heading: "Xperiti",
    heading1: "Comprehensive Research Platform",
    subtitle: "Enterprise Saas App UI/UX Design on Figma & Development on Angular.js",
    logo:"https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1731155233/xperiti_psd_file_1_cvfkqh.svg",
    url: "https://www.ipsos.com/en/ipsos-acquires-xperiti-strengthen-its-b2b-research-capabilities-global",
  },
  {
    heading: "ArthAlpha",
    heading1: "AI Trading Platform",
    subtitle: "Quant Trading App, Portfolio Website, UX Design, UI Development",
    logo:"https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025189/brahma_zbxs7g.svg",
    url: "https://www.arthalpha.in/",
  },
  {
    heading: "AI LegalTech Saas",
    heading1: "APAC’s largest law firm",
    subtitle: "Designed a future-ready AI SaaS platform for lawyers and legal professionals",
    logo:"https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Frame_1984078729_meav44.svg",
    img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771570379/Image_hzwg0d.svg",
    url: "https://revupai.com/",
  },
];

export default function CaseStudyGrid() {
  return (
    <section className="space-y-6 font-sans">
      {caseStudies.map((study, index) => (
        <a 
          key={index}
          href={study.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative rounded-3xl overflow-hidden shadow-sm transition-all duration-500"
        >
          {/* Image Container */}
          <div className="aspect-[16/6] max-md:aspect-[16/10] w-full bg-gray-100 relative">
            <img 
              src={study.img} 
              alt={study.heading1}
              className="w-full h-full object-cover transition-transform duration-700"
            />
            
            {/* Glassmorphism Overlay Bar */}
            <div className="absolute bottom-4 left-4 right-4 h-16 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-between px-6 shadow-lg">
              <div>
                {/* <h3 className="text-gray-900 font-bold text-lg leading-tight capitalize">
                  {study.heading.toLowerCase()}
                </h3>
                <p className="text-[10px] tracking-widest text-gray-500 font-medium">
                  {study.heading1}
                </p> */}

                <Image
                  src={study.logo}
                  alt={study.heading}
                  width={100}
                  height={30}
                  priority
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                View Project 
                <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  ↗
                </span>
              </div>
            </div>
          </div>
        </a>
      ))}
      <div className="relative rounded-[2.5rem] bg-white border-2  border-gray-200 py-24 max-md:py-6 px-6 text-center overflow-hidden">
  
  {/* The Perfect "Designer Grid" Background */}
  <div 
    className="absolute inset-0 pointer-events-none" 
    style={{ 
      backgroundImage: `
        linear-gradient(45deg, #edededff 25%, transparent 25%), 
        linear-gradient(-45deg, #edededff 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #edededff 75%), 
        linear-gradient(-45deg, transparent 75%, #edededff 75%)
      `,
      backgroundSize: '100px 100px',
      backgroundPosition: '0 0, 0 50px, 50px -50px, -50px 0px' 
    }} 
  />
  
  <div className="relative z-10 flex flex-col items-center">
    <h2 className="text-3xl max-md:text-xl font-bold text-gray-900 mb-2">Your Work Here</h2>
    <p className="text-gray-500 font-medium mb-8">
      This Page Isn't Finished. Because the work isn't.
    </p>
    
    <div className="flex flex-col gap-4 w-full max-w-sm">
      
      <LetsTalkButton fullWidth variant="color" children="Book a 15-min Product Strategy Call"/>

      <LetsTalkButton fullWidth variant="light" children="Let's Talk"/>
    </div>
  </div>
</div>
    </section>
  );
}