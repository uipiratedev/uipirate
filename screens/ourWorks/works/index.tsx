import RecentWorkCard from "@/screens/landing/works/workCard";

const Works = () => {
  return (
    <div className="pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="mb-6 flex flex-row items-center justify-center">
          <span className="rounded-xl border-2 border-cyan-400 bg-[#8EF1F1] px-4 py-2 font-semibold uppercase">
            works
          </span>
        </div>
        <p className="heading-center">Recent Works</p>
      </div>
      <div className="px-32 max-md:px-4 overflow-x-hidden overflow-y-auto pb-12 pt-48 max-md:pt-12">
        <RecentWorkCard />
      </div>
    </div>
  );
};

export default Works;
