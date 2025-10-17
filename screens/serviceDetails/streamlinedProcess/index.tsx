import { Card, CardBody } from "@nextui-org/react";
const StreamlinedProcess = ({ data }: any) => {
  return (
    <div className="  pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            {data.badge}
          </span>
        </div>
        <p className="heading-center"> {data.heading}</p>
      </div>
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-6 max-md:gap-4 mt-12">
        {data.card.map((item: any, index: number) => (
          <Card
            key={index}
            className="rounded-[48px] max-md:rounded-[38px] mt-6   bg-white  group shadow-none border-1 border-[#0000000f]"
            style={{
              boxShadow: "0px 3px 7px 3px rgba(0, 0, 0, 0.09)",
            }}
          >
            <CardBody className="p-1.5 max-md:p-1.5 max-md:gap-2">
              <Card
                className="rounded-[40px] max-md:rounded-[30px] box-shadow"
                style={{
                  background: item.gradiendt,
                }}
              >
                <CardBody className="p-7 max-md:p-5 max-lg:p-6 flex flex-col justify-between ">
                  <div className="">
                    <div key={index}>
                      <div className="border border-[#00000014] bg-white rounded-xl p-2 w-fit ">
                        <img
                          src={item.icon}
                          alt="behance Logo"
                          className="w-[40px] grayscale "
                        />
                      </div>
                      <p className="text-xl max-md:text-base font-[700]">
                        {item.heading}
                      </p>
                      <p className="text-base max-md:text-base font-[500]  py-2">
                        {item.description}
                      </p>
                    </div>
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

export default StreamlinedProcess;
