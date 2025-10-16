const ServiceDetailsHero = ({ data }: any) => {
  return (
    <div>
      <section className="relative pt-16 md:pt-20 flex flex-col items-center text-center ">
        {/* Badge Text */}

        <div
          className="p-2 px-4 rounded-xl bg-[#8EF1F1] border-cyan-400 border-2 mb-6"
          style={{
            animation: "trustBadgeUp 0.5s ease-out forwards",
            animationDelay: "0.1s",
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
          }}
        >
          <p className="text-center uppercase text-xs max-md:text-[10px] font-medium">
            {data.badge}
          </p>
        </div>
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          {data.heading}
        </h1>
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          {data.heading1}
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-base text-gray-600 max-w-3xl reveal-text-anim ">
          {data.description}
        </p>

        <a
          href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
          target="blank"
          className="relative z-10 mt-6"
        >
          <div className=" hover:border-back/50 hover:border-4 border-4 bg-black text-white rounded-[20px] h-auto group transform transition-all duration-[600ms] ease-in-out max-md:px-4 px-6 py-4 buttonHero md:hover:pl-12 hover:bg-black flex flow-row items-center gap-3 relative">
            {/* Star Confetti Container - Behind button */}
            <div className="star-confetti-container">
              <div className="star-confetti-revolve">
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
                <div className="star-confetti">
                  <img
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                    alt="star"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-2 items-center md:mr-11">
              <img
                src="https://res.cloudinary.com/damm9iwho/image/upload/v1730289917/Frame_1984078767_sjyim4.svg"
                alt="Dribble Logo"
                id="image"
                className="w-auto h-[30px] md:absolute  transform translate-x-0 transition-all duration-[580ms] ease-in-out  md:group-hover:translate-x-4 max-md:order-3  md:order-1 md:group-hover:order-3"
              />
              <p
                id="plus"
                className="text-[#5B5B5B] text-xl font-bold md:absolute order-2 -mt-1"
              >
                +
              </p>
              <img
                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729761707/vishal_profile_d2fbyt.svg"
                alt="Dribble Logo"
                id="client"
                className="w-auto h-[30px] md:absolute  transform translate-x-0 transition-all duration-500 ease-in-out  md:group-hover:-translate-x-[2.1rem] max-md:order-1  md:order-3 md:group-hover:order-1"
              />
            </div>
            <p className="text-lg font-bold"> Book a 15-min call</p>
            <div>
              <img
                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                alt="Dribble Logo"
                className="w-auto h-[30px]"
              />
            </div>
          </div>
        </a>
      </section>
    </div>
  );
};

export default ServiceDetailsHero;
