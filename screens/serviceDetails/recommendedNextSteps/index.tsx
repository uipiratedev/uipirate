import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";
import LetsTalkButton from "@/components/LetsTalkButton";

const SERVICE_IMAGES: Record<string, string> = {
  "saas-ai-development":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789128869/saassteps_g81e1k.svg",
  "ui-ux-design":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789128869/uiuxsteps_iczi8s.svg",
  "ux-ui-design":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789128869/uiuxsteps_iczi8s.svg",
  "landing-pages-business-websites":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789128856/landingsteps_pl8pzf.svg",
  "ux-audits-consultation":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789128850/uxauditsteps_l8xhdm.svg",
};

const RecommendedNextSteps = ({ data }: any) => {
  const featuredImage =
    data.featuredService?.image ||
    (data.featuredService?.slug &&
      SERVICE_IMAGES[data.featuredService.slug.toLowerCase()]) ||
    "/assets/servicesBanner.svg";

  return (
    <section className="section-container pb-16 max-md:pb-12">
      <Reveal variant="up">
        <SectionHeader chip={data.badge}>{data.heading}</SectionHeader>
      </Reveal>

      {/* Content row */}
      <Reveal
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 md:gap-8 items-stretch"
        variant="up"
      >
        {/* Left: Featured service card */}
        <div className="rounded-[20px] max-md:rounded-[12px]  bg-white border border-[#E2E8F0] shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
          <div className="bg-orange-500 text-white rounded-full max-md:rounded-xl w-full flex items-center justify-between px-2 max-md:px-4 py-2">
            {/* Left Circle */}
            <div
              className="w-6 h-6 bg-[#DE5005] rounded-full flex-shrink-0"
              style={{ boxShadow: "0px 0.36px 0.36px 0px #7E7E7E8C inset" }}
            />

            {/* Text */}
            <p
              className="uppercase text-center flex-1 text-[15px] max-md:text-[12px] font-semibold "
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {data.featuredService.title}
            </p>

            {/* Right Circle */}
            <div
              className="w-6 h-6 bg-[#DE5005] rounded-full flex-shrink-0"
              style={{ boxShadow: "0px 0.36px 0.36px 0px #7E7E7E8C inset" }}
            />
          </div>
          <div className=" p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto,minmax(0,1fr)] gap-6 items-center">
            {/* Poster / visual placeholder */}
            <div className="flex justify-center md:justify-start">
              <div className="relative">
                <img
                  alt={data.featuredService.title || "UI Pirate services overview"}
                  className="w-full max-w-[200px] md:max-w-[220px] h-auto object-contain rounded-[14px]"
                  src={featuredImage}
                />
              </div>
            </div>

            {/* Copy + CTA */}
            <div className="flex flex-col justify-between h-full max-md:mb-3">
              <div className="space-y-2">
                <p className="text-lg  max-md:text-base font-semibold ">
                  {data.featuredService.tagline}
                </p>

                <p className="text-sm md:text-[14px] leading-relaxed">
                  {data.featuredService.description}
                </p>
                <p className="text-sm md:text-[14px] leading-relaxed">
                  {data.featuredService.description2}
                </p>
              </div>

              <LetsTalkButton
                href={
                  data.featuredService.slug
                    ? `/services/${data.featuredService.slug}`
                    : undefined
                }
                showArrow={true}
                size="sm"
                variant="dark"
              >
                {data.featuredService.buttonText}
              </LetsTalkButton>
            </div>
          </div>
        </div>

        {/* Right: Other services list card */}
        <div className="rounded-[20px] max-md:rounded-[12px]  bg-white border border-[#E2E8F0] shadow-[0_20px_45px_rgba(15,23,42,0.06)] p-6 md:p-8 flex flex-col gap-5">
          <h3 className="text-lg  max-md:text-base font-bold ">
            Other Services You May Need
          </h3>
          <div className="space-y-3">
            {data.otherServices.map((service: any, index: number) => (
              <LetsTalkButton
                key={service.slug || service.title || index}
                fullWidth
                href={service.slug ? `/services/${service.slug}` : undefined}
                showArrow={true}
                variant="light"
              >
                {service.title}
              </LetsTalkButton>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default RecommendedNextSteps;
