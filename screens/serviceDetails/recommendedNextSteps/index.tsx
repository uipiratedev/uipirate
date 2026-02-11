import GlassBadge from "@/components/GlassBadge";
import LetsTalkButton from "@/components/LetsTalkButton";

const relatedServices = [
  "UX/UI & Front End Development",
  "Landing Pages & Business Websites",
  "3D Assets & Animation",
  "UX Audits & Consultation",
];

const RecommendedNextSteps = () => {
  return (
    <section className="pt-24 max-md:pt-20 pb-24">
      {/* Header */}
      <div className="autoShow text-center mb-10 md:mb-14">
        <div className="flex items-center justify-center mb-3">
          <GlassBadge variant="gradient">RECOMMENDED NEXT STEPS</GlassBadge>
        </div>
        <h2 className="text-3xl md:text-[34px] font-bold text-black">
          What Most Clients Require Next
        </h2>
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 md:gap-8 items-stretch">
        {/* Left: Motion Graphic feature card */}
        <div className="rounded-[20px] max-md:rounded-[12px]  bg-white border border-[#E2E8F0] shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
          <div className="bg-orange-500 text-white rounded-full max-md:rounded-xl w-full flex items-center justify-between px-6 max-md:px-4 py-2">
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
                  AI Apps, Saas, Websites & More
                </p>
                
                {/* Right Circle */}
                <div className="w-6 h-6 bg-[#DE5005] rounded-full flex-shrink-0" style={{boxShadow: "0px 0.36px 0.36px 0px #7E7E7E8C inset"}} />
              </div>
          <div className=" p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto,minmax(0,1fr)] gap-6 items-center">
            {/* Poster / visual placeholder */}
            <div className="flex justify-center md:justify-start">
              
              <div className="relative">
                <div className="rounded-[20px] bg-white p-2 shadow-[0_10px_25px_rgba(15,23,42,0.12)]">
                  <div className="flex h-44 w-32 md:h-48 md:w-36 items-end justify-center rounded-[22px] bg-[#FF5B04] text-white text-[11px] font-semibold leading-tight text-center px-4 pb-6">
                    ALL THINGS YOU NEED
                    <br />
                    UNDER
                    <br />
                    ONE ROOF
                  </div>
                </div>
              </div>
            </div>

            {/* Copy + CTA */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#0F172A]">
                Motion Graphic
              </p>
              <h3 className="text-lg md:text-xl font-semibold text-[#0F172A]">
                Bring static visuals to life for launches, ads, and
                storytelling.
              </h3>
              <p className="text-sm md:text-[15px] text-[#64748B] leading-relaxed">
                Once visuals are in place, motion helps capture attention
                faster.
              </p>
              <p className="text-sm md:text-[15px] text-[#64748B] leading-relaxed">
                Most teams use motion to explain, promote, and scale reach.
              </p>
              <LetsTalkButton fullWidth variant="color" children="Explore Motion graphic" />
            </div>
          </div>
        </div>

        {/* Right: Other services list card */}
        <div className="rounded-[20px] max-md:rounded-[12px]  bg-white border border-[#E2E8F0] shadow-[0_20px_45px_rgba(15,23,42,0.06)] p-6 md:p-8 flex flex-col gap-5">
          <h3 className="text-[17px] md:text-[19px] font-semibold text-[#0F172A]">
            Other Services You May Need
          </h3>
          <div className="space-y-3">
            {relatedServices.map((service) => (
             <LetsTalkButton fullWidth variant="light" children={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedNextSteps;
