import { Button } from "@nextui-org/button";

const HeaderInfo = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-3">
        <img
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1729862847/Div_framer-bfl99f_v7cltn.svg"
          alt="behance Logo"
          className="w-10 h-10"
        />
        <p className="text-base font-semibold">UI Pirates</p>
      </div>
      <div className=" flex flex-row items-center gap-3">
        <p className="text-base font-medium text-[#777777] uppercase">
          20th May, 2023 | 3 days ago
        </p>
        <Button
          as="a"
          href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
          target="_blank"
          className="bg-black text-white rounded-[16px] px-8 py-6 font-bold text-base max-md:text-sm w-full md:w-auto"
          startContent={
            <img
              src="https://res.cloudinary.com/damm9iwho/image/upload/v1761922123/tabler-icon-share-2_qequdd.svg"
              alt="Dribble Logo"
              className="w-6 h-6 start-6"
            />
          }
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default HeaderInfo;
