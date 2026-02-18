import GlassBadge from "@/components/GlassBadge";
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";

const TryBeforeCommit = () => {
  return (
    <div>
      <Card className="rounded-[48px] max-md:rounded-[38px] mt-4 max-md:pb-2 bg-[#e9e9e9] shadow-none border-1 border-[#0000000f]">
        <CardBody className="gap-4 max-md:gap-2 max-md:grid-cols-1 p-4 max-md:p-2">
          <div>
            <Card className="rounded-[40px] box-shadow  shadow-none border-1 border-[#0000000f]">
              <CardBody className="p-8 max-md:p-4 max-lg:p-6 grid grid-cols-1 gap-4 max-md:grid-cols-1">
                <div className="autoShow">
                  <div className="mb-6 flex flex-row items-center justify-center">
                    <GlassBadge variant="gradient">Try Before You Commit</GlassBadge>
                  </div>
                  <p className="heading-center">5-Day Pilot Project</p>
                  <p className="text-[#777777]">
                    See real results in just 5 days, before investing in a
                    full-scale project. Test how we work, review our process,
                    and get tangible outcomes you can actually use.
                  </p>

                  <div className="flex flex-row gap-4 border-t-1 pt-3 mt-6 max-md:flex-col">
                    <div>
                      <p className="font-semibold text-xl">
                        🧩 Low-Risk, High-Value
                      </p>
                      <p className="text-[#777777]">
                        Your fee is fully deducted from the final invoice if you
                        move forward with a full project.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-xl">
                        ⚡ Real Deliverables, Real Proof
                      </p>
                      <p className="text-[#777777]">
                        You walk away with a working mini-build or polished
                        design — ready to scale.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 pt-3 mt-6 max-md:flex-col">
                    <div className="flex flex-row item-center justify-between border-1 rounded-lg p-4">
                      <p className=" text-base max-md:text-sm  text-center bg-black text-white rounded-full px-3 py-1">
                        Design
                      </p>
                      <p className=" text-2xl max-md:text-xl font-bold">
                        {" "}
                        <span className="text-lg">$</span>150
                      </p>
                    </div>
                    <div className="flex flex-row item-center justify-between border-1 rounded-lg p-4">
                      <p className=" text-base max-md:text-sm text-center bg-black text-white rounded-full px-3 py-1">
                        Development
                      </p>
                      <p className=" text-2xl max-md:text-xl font-bold">
                        {" "}
                        <span className="text-lg">$</span>250
                      </p>
                    </div>
                    <div className="flex flex-row item-center justify-between border-1 rounded-lg p-4">
                      <p className=" text-base max-md:text-sm text-center bg-black text-white rounded-full px-3 py-1">
                        Design + Development
                      </p>
                      <p className=" text-2xl max-md:text-xl font-bold">
                        {" "}
                        <span className="text-lg">$</span>350
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card className="rounded-[32px] max-md:rounded-[30px] box-shadow bg-white/50 ">
            <CardBody className="py-6 flex flex-row max-md:flex-col gap-3 items-center justify-center">
              <Link
                className="bg-black w-fit text-white rounded-[16px] px-8 py-3 font-bold text-base max-md:text-sm  md:w-auto border-4 border-[#E2E2E2] "
                href="/contact"
              >
                Secure Your Zero-Risk Slot Now
              </Link>
              <p>or</p>
              <Button
                as="a"
                className="bg-white w-fit text-black rounded-[16px] px-8 py-6 font-bold text-base max-md:text-sm  md:w-auto border-3 border-[#E2E2E2] "
                href="/pricing"
                target="_blank"
              >
                See Detailed Pricing
              </Button>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};

export default TryBeforeCommit;
