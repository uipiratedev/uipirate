import React from "react";
import MarqueeComp from "./marqueeComp";

const LandingMarquee = ({ items, reverse }: any) => {
  const row1 = [
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513140/image_34_rb6475.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513139/image_3_wjiecn.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513139/image_2_srxkyz.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513139/image_4_htbg0w.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513138/image_5_s1yrux.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_29_fxjqk6.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513138/image_31_sdh5l7.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/Group_1_lj2z8a.svg",
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753848061/logo_xypiee.png",
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753848061/image_40_qrvfhk.png",
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753848061/Layer_1_bpf8dg.png",
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753848061/image_42_iaxa8x.png",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729682151/image_30_oiwlqz.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729682151/Frame_131_xaxhxs.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Frame_1984078729_meav44.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729682149/image_28_lq4jj7.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729682148/Group-2_uduxpp.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1729682148/Frame_3_nfidqo.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/image_37_ujzsav.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/image_38_udzxkk.svg",
    "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
  ];

  return (
    <>
      <div className="mt-12 container mx-auto max-md:mt-0">
        <MarqueeComp items={row1} reverse={undefined} />
        {/* <MarqueeComp items={row2} reverse /> */}
      </div>
    </>
  );
};

export default LandingMarquee;
