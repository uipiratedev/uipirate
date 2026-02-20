import GlassBadge from "@/components/GlassBadge";
import LetsTalkButton from "@/components/LetsTalkButton";
const RecommendedNextSteps = ({data}:any) => {
  return (
    <section>
      {/* Header */}
      <div className="autoShow text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center mb-6">
          <GlassBadge variant="gradient">{data.badge}</GlassBadge>
        </div>
        <h2 className="heading-center">
          {data.heading}
        </h2>
      </div>

      {/* Content row */}
      <div className=" max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 md:gap-8 items-stretch">
        {/* Left: Motion Graphic feature card */}
        <div className="rounded-[20px] max-md:rounded-[12px]  bg-white border border-[#E2E8F0] shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
          <div className="bg-orange-500 text-white rounded-full max-md:rounded-xl w-full flex items-center justify-between px-2 max-md:px-4 py-2">
                {/* Left Circle */}
                <div className="w-6 h-6 bg-[#DE5005] rounded-full flex-shrink-0" style={{boxShadow: "0px 0.36px 0.36px 0px #7E7E7E8C inset"}} />

                {/* Text */}
                <p 
                  className="uppercase text-center flex-1 text-[15px] max-md:text-[12px] font-mono"
                  style={{
                    fontWeight: 800,
                    // fontSize: '15.54px',
                    lineHeight: '22.51px',
                    letterSpacing: '-0.24px',
                    verticalAlign: 'middle',
                  }}
                >
                  {data.featuredService.title}
                </p>
                
                {/* Right Circle */}
                <div className="w-6 h-6 bg-[#DE5005] rounded-full flex-shrink-0" style={{boxShadow: "0px 0.36px 0.36px 0px #7E7E7E8C inset"}} />
              </div>
          <div className=" p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto,minmax(0,1fr)] gap-6 items-center">
            {/* Poster / visual placeholder */}
            <div className="flex justify-center md:justify-start">
              
              <div className="relative">
                <div className="rounded-[20px] bg-white p-2 shadow-[0_10px_25px_rgba(15,23,42,0.12)]">
                  <img src="/assets/servicesBanner.svg" alt="" className="" />
                </div>
              </div>
            </div>

            {/* Copy + CTA */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#0F172A]">
                {data.featuredService.tagline}
              </p>
             
              <p className="text-sm md:text-[15px] text-[#64748B] leading-relaxed">
                {data.featuredService.description}
              </p>
             
              <LetsTalkButton  variant="dark" children={data.featuredService.buttonText} />
            </div>
          </div>
        </div>

        {/* Right: Other services list card */}
        <div className="rounded-[20px] max-md:rounded-[12px]  bg-white border border-[#E2E8F0] shadow-[0_20px_45px_rgba(15,23,42,0.06)] p-6 md:p-8 flex flex-col gap-5">
          <h3 className="text-[17px] md:text-[19px] font-semibold text-[#0F172A]">
            Other Services You May Need
          </h3>
          <div className="space-y-3">
            {data.otherServices.map((service: any) => (
             <LetsTalkButton fullWidth variant="light" children={service.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedNextSteps;
