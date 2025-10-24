import { Card, CardBody } from "@nextui-org/react";

const data = {
  heading: "Simple. Strategic. Results-Driven. ",
  badge: "Our Process",
  card: [
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
      heading: "Deliver & Refine",
      discription:
        "We launch the pilot or live build, gather insights, and polish every detail to ensure it performs beautifully in production.",
      gradient: "linear-gradient(180deg, #FFE6F4 20.66%, #FFFAFD 100%)",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
      heading: "Discover & Understand",
      discription:
        "We dive into your product goals, audience, & user needs, focusing on clarity, intent, and measurable outcomes.",
      gradient: "linear-gradient(180deg, #F5FFD9 29.57%, #FDFFF7 100%)",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
      heading: "Plan & Structure",
      discription:
        "We define the IA, visual direction, & tech stack, aligning design & development from day one for smoother execution.",
      gradient: "linear-gradient(180deg, #78E6F4 20.66%, #F5FEFF 100%)",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
      heading: "Build & Iterate",
      discription:
        "We design, develop, and test in quick, focused sprints, showing progress early and adapting fast to real feedback.",
      gradient: "linear-gradient(180deg, #FFE6F4 20.66%, #FFFAFD 100%)",
    },
  ],
};

const ProgressCard = () => {
  return (
    <div className="pt-0 max-md:pt-0">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            {data.badge}
          </span>
        </div>
        <p className="heading-center">{data.heading}</p>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-1 max-lg:grid-cols-2 gap-6 max-md:gap-0 mt-12">
        {data.card.map((item: any, index: number) => (
          <Card
            key={index}
            className="rounded-[48px] max-md:rounded-[38px] mt-6 bg-white group shadow-none border border-[#0000000f]"
            style={{
              boxShadow: "0px 3px 7px 3px rgba(0, 0, 0, 0.09)",
            }}
          >
            <CardBody className="p-1.5 max-md:p-1.5 max-md:gap-2">
              <Card
                className="rounded-[40px] max-md:rounded-[30px] h-full"
                style={{
                  background: item.gradient,
                }}
              >
                <CardBody className="p-6 max-md:p-5 max-lg:p-6 flex flex-col justify-between">
                  <div>
                    <div className="border border-[#00000014] bg-white rounded-xl p-2 w-fit">
                      <img
                        src={item.icon}
                        alt={item.heading}
                        className="w-[40px] grayscale"
                      />
                    </div>
                    <p className="text-xl max-md:text-base font-bold mt-3">
                      {item.heading}
                    </p>
                    {item.discription && (
                      <p className="text-base max-md:text-sm font-medium py-2">
                        {item.discription}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgressCard;
