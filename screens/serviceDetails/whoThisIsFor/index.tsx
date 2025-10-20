const WhoThisIsFor = ({ data }: any) => {
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
      <div className="px-32 mt-6 max-md:px-0 max-lg:px-12">
        {data.card.map((item: any, index: number) => (
          <div key={index} className="space-y-6">
            <p className="text-xl font-[500] mb-3">{item.heading}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhoThisIsFor;
