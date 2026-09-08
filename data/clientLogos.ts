export interface ClientLogo {
  name: string;
  logo: string;
  desc?: string;
  isUS?: boolean;
  invertColor?: boolean;
  link?: string;
  alt?: string;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  {
    name: "Pivot Bits",
    logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788341201/pivotbitslogo_vgkhnp.svg",
    desc: "Enterprise Security Software",
    isUS: true,
    link: "https://pivotbits.com/",
    alt: "Pivot Bits - Enterprise Security Software logo",
  },
  {
    name: "Ipsos",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
    desc: "Global Market Research",
    isUS: false,
    link: "https://www.ipsos.com/en/ipsos-acquires-xperiti-strengthen-its-b2b-research-capabilities-global",
    alt: "Ipsos - Global Market Research firm logo",
  },
  {
    name: "Biotex Medical",
    logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586282/logo_qpyrhf.webp",
    desc: "MedTech",
    isUS: true,
    link: "https://biotexmedical.com/",
    alt: "Biotex Medical - Healthcare technology solutions logo",
  },
  {
    name: "Khaitan & Co",
    logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753093876/logo_r097ja.png",
    desc: "Asia's Largest Law Firm",
    isUS: false,
    link: "https://www.khaitanco.com/",
    alt: "Khaitan & Co - APAC's largest leading law firm logo",
  },
  {
    name: "RevUp AI",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Frame_1984078729_meav44.svg",
    desc: "AI Platform",
    isUS: true,
    link: "https://revupai.com/",
    alt: "RevUp AI - AI-powered business solutions logo",
  },
  {
    name: "Simpleo AI",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682148/Group-2_uduxpp.svg",
    desc: "AI Solutions",
    isUS: true,
    link: "https://www.simpleo.ai/",
    alt: "Simpleo AI - Artificial intelligence platform logo",
  },
  {
    name: "Sarge",
    logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770706789/sarge_hewzwz.svg",
    desc: "AI Police Tech Platform",
    isUS: true,
    link: "https://sarge.com/",
    alt: "Sarge - AI Police Tech Platform logo",
  },
  {
    name: "Awesome Health",
    logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760598018/healt_nvmdpw.svg",
    desc: "HealthTech",
    isUS: true,
    link: "https://awesomehealthclub.com/",
    alt: "Awesome Health Club - Fitness and wellness platform logo",
  },
  {
    name: "Rings & I",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg",
    desc: "E-commerce",
    isUS: true,
    link: "https://ringsandi.com/",
    alt: "Rings and I - Jewelry and lifestyle brand logo",
  },
  {
    name: "Arth Alpha",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
    desc: "Quant Trading Startup",
    isUS: false,
    link: "https://www.arthalpha.in/",
    alt: "Arth Alpha - Financial technology and investment platform logo",
  },
];
