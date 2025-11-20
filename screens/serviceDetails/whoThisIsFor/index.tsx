import { Card, CardBody } from "@nextui-org/react";

const WhoThisIsFor = ({ data }: any) => {
  return (
    <div className="  pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-4">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            {data.badge}
          </span>
        </div>
        <p className="heading-center"> {data.heading}</p>
      </div>
      <div className="mt-6">
        <div className="space-y-6">
          <Card className="rounded-[32px] max-md:w-full bg-[#e9e9e9] shadow-none border-1 border-[#0000000f]">
            <CardBody className="p-2 max-md:p-2 max-lg:p-3 grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
              {data.card.map((item: any, index: number) => (
                <div
                  key={index}
                  className="w-full p-6  bg-white rounded-[24px] max-md:p-4 box-shadow"
                >
                  <p className="text-2xl max-md:text-base font-[700]">
                    {item.heading}
                  </p>
                  <p className="text-base max-md:text-base font-[500] text-[#777777]  py-2">
                    {item.description}
                  </p>
                  {item.QuickWins && (
                    <div>
                      <p className="mt-3 mb-1 font-medium">Quick Wins:</p>

                      <ul lang="dots">
                        {item.QuickWins.map((items: any, index: number) => (
                          <li
                            key={index}
                            className="text-base max-md:text-base font-[500] text-[#777777]  py-[2px]"
                          >
                            {items}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhoThisIsFor;
