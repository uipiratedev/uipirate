import Image from "next/image";
import Link from "next/link";

import LetsTalkButton from "@/components/LetsTalkButton";

type Project = {
  name: string;
  tagline: string;
  industry: string;
  metric: string;
  tech: string[];
  logo: string;
  img: string;
  href: string;
  internal?: boolean;
};

const projects: Project[] = [
  {
    name: "Xperiti",
    tagline: "Enterprise Research Platform",
    industry: "Enterprise SaaS · Market Research",
    metric: "Acquired by Ipsos",
    tech: ["Angular", "Figma", "UI Dev"],
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1731155233/xperiti_psd_file_1_cvfkqh.svg",
    href: "/case-studies/xperiti",
    internal: true,
  },
  {
    name: "ArthAlpha",
    tagline: "AI Quant Trading Platform",
    industry: "Fintech · AI Trading",
    metric: "Real-time charting & strategies",
    tech: ["Angular", "UX Design", "UI Dev"],
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025189/brahma_zbxs7g.svg",
    href: "https://www.arthalpha.in/",
  },
  {
    name: "AI LegalTech SaaS",
    tagline: "Built for Khaitan & Co",
    industry: "LegalTech · AI SaaS",
    metric: "APAC's largest law firm",
    tech: ["Next.js", "AI UX", "Figma"],
    logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753093876/logo_r097ja.png",
    img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771570379/Image_hzwg0d.svg",
    href: "/contact",
    internal: true,
  },
];

function ProjectCard({ project }: { project: Project }) {
  const Wrapper: React.ElementType = project.internal ? Link : "a";
  const wrapperProps = project.internal
    ? { href: project.href }
    : { href: project.href, target: "_blank", rel: "noopener noreferrer" };

  return (
    <Wrapper
      {...wrapperProps}
      className="group block relative rounded-3xl overflow-hidden shadow-lg border border-gray-200/50 hover:shadow-2xl hover:border-gray-300 transition-all duration-500"
    >
      <div className="aspect-[16/6] max-md:aspect-[16/10] w-full bg-white relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.img}
          alt={`${project.name} — ${project.tagline}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        {/* Top-left industry chip */}
        <div className="absolute top-4 left-4 max-md:top-3 max-md:left-3 px-3 py-1.5 bg-white/70 backdrop-blur-xl border border-white/50 rounded-full shadow-sm">
          <p className="text-[10px] max-md:text-[9px] font-jetbrains-mono uppercase tracking-[0.12em] text-gray-700">
            {project.industry}
          </p>
        </div>

        {/* Top-right metric chip */}
        <div className="absolute top-4 right-4 max-md:top-3 max-md:right-3 px-3 py-1.5 bg-[#FF5B04]/95 backdrop-blur-xl rounded-full shadow-sm">
          <p className="text-[10px] max-md:text-[9px] font-jetbrains-mono uppercase tracking-[0.12em] text-white font-semibold">
            {project.metric}
          </p>
        </div>

        {/* Bottom glass bar - name-first hierarchy */}
        <div className="absolute bottom-4 left-4 right-4 max-md:bottom-3 max-md:left-3 max-md:right-3 bg-white/65 backdrop-blur-xl border border-white/40 rounded-2xl px-5 py-4 shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-lg max-md:text-base font-bold text-gray-900 leading-tight truncate">{project.name}</h3>
              <p className="text-xs max-md:text-[11px] text-gray-500 leading-tight truncate">{project.tagline}</p>
            </div>

            {/* Logo watermark - small, secondary */}
            <Image
              src={project.logo}
              alt={project.name}
              width={60}
              height={18}
              className="h-5 w-auto max-md:h-4 object-contain shrink-0 opacity-60"
              priority
            />
          </div>

          {/* Tech stack pills + CTA */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-jetbrains-mono text-gray-600"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-sm max-md:text-xs font-semibold text-gray-800 shrink-0">
              <span className="hidden md:inline">{project.internal ? "Read case study" : "View project"}</span>
              <span className="md:hidden">{project.internal ? "Read" : "Visit"}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                {project.internal ? "→" : "↗"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default function CaseStudyGrid() {
  return (
    <section className="space-y-8 font-sans">

      {/* Closing CTA — full-width, confident, dark */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#212121] to-[#151514] noise-texture px-12 py-20 max-md:px-6 max-md:py-12 text-center">
        <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
          What&apos;s next
        </p>
        <h2 className="text-4xl max-md:text-2xl font-bold text-white mb-4">
          Your product, shipped next
        </h2>
        <p className="text-gray-400 font-medium text-base max-md:text-sm max-w-2xl mx-auto mb-8 max-md:mb-6">
          From idea to shipped product — product thinking, IA, UX/UI, and Angular/React frontend
          carried end-to-end. Typical response under 2 hours.
        </p>

        <div className="flex flex-row max-md:flex-col gap-4 justify-center items-center max-w-md mx-auto">
          <LetsTalkButton variant="color" fullWidth>
            Book a 15-min Strategy Call
          </LetsTalkButton>
          <LetsTalkButton variant="light" href="/contact" fullWidth>
            Get a Project Estimate
          </LetsTalkButton>
        </div>
      </div>
    </section>
  );
}