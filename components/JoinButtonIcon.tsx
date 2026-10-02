import * as React from "react";

import { IconSvgProps } from "@/types";

export type JoinButtonIconProps = IconSvgProps & {
  isActive?: boolean;
  isPressed?: boolean;
  text?: string;
};

export const JoinButtonIcon = ({
  isActive,
  isPressed,
  className,
  text = "lets venture",
  ...props
}: JoinButtonIconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 622 207"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g filter="url(#filter0_i_47_188)">
      <g id="join-btn-base">
        <g
          className="transition-transform duration-300 transform-gpu"
          id="join-btn-base"
        >
          <g clipPath="url(#clip0_47_188)">
            <rect
              fill="#4F4E4C"
              height="206.268"
              rx="31.7335"
              width="621.977"
            />
            <rect
              fill="url(#paint0_linear_47_188)"
              height="206.268"
              rx="31.7335"
              width="621.977"
            />
            <rect
              fill="url(#paint1_linear_47_188)"
              height="206.268"
              rx="31.7335"
              width="621.977"
            />
            <rect
              fill="url(#pattern0_47_188)"
              fillOpacity="0.05"
              height="206.268"
              rx="31.7335"
              width="621.977"
            />
            <g filter="url(#filter1_i_47_188)">
              <rect
                fill="black"
                fillOpacity="0.7"
                height="161.841"
                rx="31.7335"
                width="621.977"
                y="6.10352e-05"
              />
              <rect
                fill="url(#paint2_linear_47_188)"
                height="161.841"
                rx="31.7335"
                width="621.977"
                y="6.10352e-05"
              />
              <rect
                fill="url(#paint3_linear_47_188)"
                height="161.841"
                rx="31.7335"
                width="621.977"
                y="6.10352e-05"
              />
              <rect
                fill="url(#paint4_linear_47_188)"
                height="161.841"
                rx="31.7335"
                width="621.977"
                y="6.10352e-05"
              />
              <rect
                height="161.048"
                rx="31.3368"
                stroke="black"
                strokeOpacity="0.3"
                strokeWidth="0.793338"
                width="621.183"
                x="0.396669"
                y="0.39673"
              />
              <g filter="url(#filter2_dd_47_188)">
                <path
                  d="M9.52002 28.5619C9.52002 15.4175 20.1757 4.76178 33.3201 4.76178H591.83C604.974 4.76178 615.63 15.4175 615.63 28.5619V120.589C615.63 133.734 604.974 144.389 591.83 144.389H33.3201C20.1757 144.389 9.52002 133.734 9.52002 120.589V28.5619Z"
                  fill="url(#paint5_linear_47_188)"
                />
                <path
                  d="M9.52002 28.5619C9.52002 15.4175 20.1757 4.76178 33.3201 4.76178H591.83C604.974 4.76178 615.63 15.4175 615.63 28.5619V120.589C615.63 133.734 604.974 144.389 591.83 144.389H33.3201C20.1757 144.389 9.52002 133.734 9.52002 120.589V28.5619Z"
                  fill="url(#paint6_radial_47_188)"
                />
                <path
                  d="M9.52002 28.5619C9.52002 15.4175 20.1757 4.76178 33.3201 4.76178H591.83C604.974 4.76178 615.63 15.4175 615.63 28.5619V120.589C615.63 133.734 604.974 144.389 591.83 144.389H33.3201C20.1757 144.389 9.52002 133.734 9.52002 120.589V28.5619Z"
                  fill="url(#paint7_radial_47_188)"
                  fillOpacity="0.2"
                />
              </g>
            </g>
            <g filter="url(#filter3_d_47_188)">
              <path
                d="M15.8667 28.5589C15.8667 18.9196 23.6809 11.1055 33.3201 11.1055H592.623C602.262 11.1055 610.077 18.9196 610.077 28.5589V120.586C610.077 130.225 602.262 138.039 592.623 138.039H591.83C590.954 138.039 590.243 138.75 590.243 139.626V201.507H37.2868C36.4105 201.507 35.7001 200.796 35.7001 199.92V139.626C35.7001 138.75 34.9898 138.039 34.1135 138.039H33.3201C23.6809 138.039 15.8667 130.225 15.8667 120.586V28.5589Z"
                fill="#0B0B09"
              />
              <path
                d="M33.3198 11.8984H592.624C601.824 11.8987 609.284 19.3578 609.284 28.5586V120.586C609.284 129.787 601.825 137.246 592.624 137.246H591.83C590.515 137.246 589.45 138.312 589.45 139.626V200.713H37.2866C36.8486 200.713 36.4937 200.358 36.4937 199.92V139.626C36.4936 138.312 35.428 137.246 34.1138 137.246H33.3198C24.1189 137.246 16.6597 129.787 16.6597 120.586V28.5586C16.6598 19.3577 24.1189 11.8986 33.3198 11.8984Z"
                stroke="url(#paint8_linear_47_188)"
                strokeWidth="1.58668"
              />
            </g>
          </g>
        </g>

        <g
          className="btn-face-scale transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) transform-gpu group-hover:drop-shadow-[0_0_20px_rgba(255,100,0,0.4)]"
          id="join-btn-face"
          style={{
            transform: isPressed
              ? "translateY(12px)"
              : isActive
                ? "translateY(-12px) scale(1.02)"
                : "translateY(0px)",
          }}
        >
          <g clipPath="url(#clip1_47_188)">
            <rect
              fill="#1D1607"
              height="166.601"
              width="487.109"
              x="71.4004"
              y="28.5586"
            />
            <path
              d="M30.147 31.7344H563.27V65.0546H30.147V31.7344Z"
              fill="#1D1607"
            />
            <path
              d="M562.476 32.5273V64.2607H30.9399V32.5273H562.476Z"
              stroke="url(#paint9_linear_47_188)"
              strokeOpacity="0.1"
              strokeWidth="1.58668"
            />
            <path
              d="M562.476 32.5273V64.2607H30.9399V32.5273H562.476Z"
              stroke="url(#paint10_radial_47_188)"
              strokeOpacity="0.2"
              strokeWidth="1.58668"
            />
            <g clipPath="url(#clip2_47_188)" filter="url(#filter4_f_47_188)">
              <g filter="url(#filter5_f_47_188)">
                <path
                  d="M623.511 146.01C623.511 201.181 495.087 245.905 336.667 245.905C178.248 245.905 49.8234 201.181 49.8234 146.01C14.3093 38.1866 159.095 46.1146 336.667 46.1147C664.486 46.1147 623.511 90.8394 623.511 146.01Z"
                  fill="#ED5504"
                />
              </g>
              <g filter="url(#filter6_df_47_188)">
                <path
                  d="M653.242 122.654C673.041 159.259 819.489 157.725 726.878 159.711C634.266 161.696 337.665 166.449 317.866 129.845C298.067 93.2401 357.093 61.9566 449.705 59.9711C542.316 57.9855 633.443 86.0497 653.242 122.654Z"
                  fill="#FF5800"
                />
              </g>
              <g filter="url(#filter7_df_47_188)">
                <path
                  d="M537.745 194.664C515.462 159.516 407.961 167.677 475.729 161.516C543.497 155.355 760.871 137.205 783.155 172.352C805.439 207.5 768.566 240.987 700.798 247.148C633.03 253.309 560.029 229.811 537.745 194.664Z"
                  fill="#ED5504"
                />
              </g>
            </g>
            <g clipPath="url(#clip3_47_188)">
              <text
                dominantBaseline="middle"
                fill="black"
                fontSize="clamp(44px, 8vw, 48px)"
                fontWeight="600"
                style={{
                  marginLeft: "-100px",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-jakarta), sans-serif",
                }}
                textAnchor="middle"
                x="45%"
                y="50%"
              >
                {text}
              </text>
              <path
                d="M516.311 80.8125V115.54H511.229V89.7606L485.177 115.812H481.584L481.584 112.219L507.909 85.8945H481.584V80.8125H516.311Z"
                fill="black"
              />
            </g>
            <g clipPath="url(#clip4_47_188)">
              <path
                d="M511.964 140.953V154.524H506.665V144.45L479.501 154.63H475.755L475.755 153.226L503.203 142.939H475.755V140.953H511.964Z"
                fill="#353535"
              />
              <path
                d="M502.534 148.238L484.587 154.634H502.534V148.238Z"
                fill="#353535"
              />
            </g>
            <rect
              fill="white"
              fillOpacity="0.01"
              height="106.307"
              transform="translate(36.4937 47.6016)"
              width="522.016"
            />
            <rect
              fill="white"
              fillOpacity="0.01"
              height="41.2536"
              transform="matrix(1 0 0 -1 36.4937 195.16)"
              width="522.016"
            />
          </g>
          <rect
            height="165.014"
            stroke="url(#paint11_linear_47_188)"
            strokeOpacity="0.1"
            strokeWidth="1.58668"
            width="485.523"
            x="72.1937"
            y="29.3519"
          />
          <rect
            height="165.014"
            stroke="url(#paint12_radial_47_188)"
            strokeOpacity="0.2"
            strokeWidth="1.58668"
            width="485.523"
            x="72.1937"
            y="29.3519"
          />
          <g filter="url(#filter10_f_47_188)">
            <path
              d="M25.3867 30.1458V117.413C25.3867 123.547 30.3594 128.52 36.4935 128.52H601.35V19.0391H36.4934C30.3594 19.0391 25.3867 24.0117 25.3867 30.1458Z"
              fill="url(#paint13_radial_47_188)"
              fillOpacity="0.12"
            />
          </g>
          <mask
            className="mask-type:alpha"
            height="191"
            id="mask0_47_188"
            maskUnits="userSpaceOnUse"
            width="596"
            x="15"
            y="11"
          >
            <path
              d="M33.3198 11.8984H592.624C601.824 11.8987 609.284 19.3578 609.284 28.5586V120.586C609.284 129.787 601.825 137.246 592.624 137.246H591.83C590.515 137.246 589.45 138.312 589.45 139.626V200.713H37.2866C36.8486 200.713 36.4937 200.358 36.4937 199.92V139.626C36.4936 138.312 35.428 137.246 34.1138 137.246H33.3198C24.1189 137.246 16.6597 129.787 16.6597 120.586V28.5586C16.6598 19.3577 24.1189 11.8986 33.3198 11.8984Z"
              fill="#0B0B09"
              stroke="url(#paint14_linear_47_188)"
              strokeWidth="1.58668"
            />
          </mask>
          <g mask="url(#mask0_47_188)">
            <g filter="url(#filter11_f_47_188)">
              <path
                d="M574.127 102.227C586.783 141.5 544.26 137.438 446.548 145.467C327.705 155.232 302.513 152.752 302.513 152.752C289.857 113.479 324.585 48.8136 397.658 35.7431C470.732 22.6725 561.472 62.9542 574.127 102.227Z"
                fill="#FF5800"
                fillOpacity="0.3"
              />
            </g>
            <g filter="url(#filter12_f_47_188)">
              <path
                d="M572.75 184.043C585.405 144.771 562.259 152.298 511.701 152.704C450.211 153.198 436.487 157.728 436.487 157.728C423.832 197.001 432.435 256.994 469.174 263.565C505.912 270.137 560.094 223.316 572.75 184.043Z"
                fill="#FF5800"
                fillOpacity="0.4"
              />
            </g>
            <g
              className="mix-blend-mode:plus-lighter"
              filter="url(#filter13_df_47_188)"
            >
              <path
                d="M541.783 109.028C545.956 121.978 526.953 130.923 454.393 140.786C366.143 152.781 332.604 139.573 332.604 139.573C328.431 126.623 360.311 79.7079 443.848 64.7658C527.385 49.8237 537.61 96.0783 541.783 109.028Z"
                fill="#FF5800"
                fillOpacity="0.1"
                shapeRendering="crispEdges"
              />
            </g>
            <g opacity="0.4">
              <g filter="url(#filter14_f_47_188)">
                <path
                  d="M469.787 184.036C500.643 144.763 444.208 152.29 320.939 152.696C171.015 153.19 137.553 157.721 137.553 157.721C106.696 196.993 127.673 256.986 217.249 263.558C306.824 270.129 438.93 223.308 469.787 184.036Z"
                  fill="#FF5800"
                  fillOpacity="0.4"
                />
              </g>
              <g
                className="mix-blend-mode:plus-lighter"
                filter="url(#filter15_f_47_188)"
              >
                <path
                  d="M378.44 147.304C394.728 168.034 378.17 178.127 294.34 179.289C192.381 180.702 138.56 153.902 138.56 153.902C122.272 133.172 122.982 67.1454 216.451 60.2884C309.921 53.4313 362.152 126.573 378.44 147.304Z"
                  fill="#FF5800"
                  fillOpacity="0.2"
                />
              </g>
            </g>
          </g>
          <g filter="url(#filter16_df_47_188)">
            <rect
              fill="url(#paint15_linear_47_188)"
              fillOpacity="0.5"
              height="4.76003"
              shapeRendering="crispEdges"
              width="542.643"
              x="41.2534"
              y="155.496"
            />
          </g>
          <rect
            fill="url(#paint16_linear_47_188)"
            fillOpacity="0.4"
            height="11.1067"
            rx="1.58668"
            shapeRendering="crispEdges"
            width="542.643"
            x="41.2534"
            y="138.039"
          />
        </g>
      </g>
    </g>
    <defs>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="209.441"
        id="filter0_i_47_188"
        width="621.977"
        x="0"
        y="0"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="3.17335" />
        <feGaussianBlur stdDeviation="3.17335" />
        <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0"
        />
        <feBlend
          in2="shape"
          mode="normal"
          result="effect1_innerShadow_47_188"
        />
      </filter>
      <pattern
        height="7.08923"
        id="pattern0_47_188"
        patternContentUnits="objectBoundingBox"
        width="2.35102"
      >
        <use href="#image0_47_188" transform="scale(0.00229592 0.00692308)" />
      </pattern>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="161.841"
        id="filter1_i_47_188"
        width="621.977"
        x="0"
        y="6.10352e-05"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="1.58668" />
        <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"
        />
        <feBlend
          in2="shape"
          mode="normal"
          result="effect1_innerShadow_47_188"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="153.908"
        id="filter2_dd_47_188"
        width="615.63"
        x="-3.29018e-05"
        y="-3.1716"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="-3.17335" dy="3.17335" />
        <feGaussianBlur stdDeviation="1.58668" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.713726 0 0 0 0 0.721569 0 0 0 0 0.717647 0 0 0 0.35 0"
        />
        <feBlend
          in2="BackgroundImageFix"
          mode="normal"
          result="effect1_dropShadow_47_188"
        />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feMorphology
          in="SourceAlpha"
          operator="erode"
          radius="11.1067"
          result="effect2_dropShadow_47_188"
        />
        <feOffset dx="-14.2801" dy="-12.6934" />
        <feGaussianBlur stdDeviation="3.17335" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.713726 0 0 0 0 0.721569 0 0 0 0 0.717647 0 0 0 0.6 0"
        />
        <feBlend
          in2="effect1_dropShadow_47_188"
          mode="normal"
          result="effect2_dropShadow_47_188"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect2_dropShadow_47_188"
          mode="normal"
          result="shape"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="191.988"
        id="filter3_d_47_188"
        width="594.21"
        x="15.8667"
        y="11.1055"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="1.58668" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"
        />
        <feBlend
          in2="BackgroundImageFix"
          mode="normal"
          result="effect1_dropShadow_47_188"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_47_188"
          mode="normal"
          result="shape"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="160.254"
        id="filter4_f_47_188"
        width="496.629"
        x="66.6404"
        y="41.2517"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_188"
          stdDeviation="2.38001"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="307.815"
        id="filter5_f_47_188"
        width="688.617"
        x="-9.5202"
        y="-7.96259"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_188"
          stdDeviation="26.9735"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="196.39"
        id="filter6_df_47_188"
        width="538.47"
        x="266.441"
        y="12.2716"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="19.0401" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.894118 0 0 0 0 0.763529 0 0 0 0 0.0235294 0 0 0 1 0"
        />
        <feBlend
          in2="BackgroundImageFix"
          mode="normal"
          result="effect1_dropShadow_47_188"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_47_188"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect2_foregroundBlur_47_188"
          stdDeviation="23.8001"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="172.962"
        id="filter7_df_47_188"
        width="412.205"
        x="415.529"
        y="113.247"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="19.0401" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.894118 0 0 0 0 0.763529 0 0 0 0 0.0235294 0 0 0 1 0"
        />
        <feBlend
          in2="BackgroundImageFix"
          mode="normal"
          result="effect1_dropShadow_47_188"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_47_188"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect2_foregroundBlur_47_188"
          stdDeviation="7.93338"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="112.654"
        id="filter10_f_47_188"
        width="579.136"
        x="23.8"
        y="17.4524"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_188"
          stdDeviation="0.793338"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="246.736"
        id="filter11_f_47_188"
        width="403.283"
        x="236.489"
        y="-30.2362"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_188"
          stdDeviation="31.7335"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="239.252"
        id="filter12_f_47_188"
        width="272.08"
        x="367.539"
        y="88.402"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_188"
          stdDeviation="31.7335"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="242.66"
        id="filter13_df_47_188"
        width="368.749"
        x="252.911"
        y="-17.5064"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="19.0401" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.894118 0 0 0 0 0.763529 0 0 0 0 0.0235294 0 0 0 1 0"
        />
        <feBlend
          in2="BackgroundImageFix"
          mode="normal"
          result="effect1_dropShadow_47_188"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_47_188"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect2_foregroundBlur_47_188"
          stdDeviation="39.6669"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="239.252"
        id="filter14_f_47_188"
        width="480.829"
        x="60.722"
        y="88.3942"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_188"
          stdDeviation="31.7335"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="182.973"
        id="filter15_f_47_188"
        width="316.997"
        x="98.7919"
        y="28.103"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_188"
          stdDeviation="15.8668"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="9.52005"
        id="filter16_df_47_188"
        width="547.403"
        x="38.8734"
        y="153.116"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="0.793338" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
        />
        <feBlend
          in2="BackgroundImageFix"
          mode="normal"
          result="effect1_dropShadow_47_188"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_47_188"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect2_foregroundBlur_47_188"
          stdDeviation="1.19001"
        />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="15.8668"
        id="filter17_df_47_188"
        width="547.403"
        x="38.8734"
        y="135.659"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="0.793338" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"
        />
        <feBlend
          in2="BackgroundImageFix"
          mode="normal"
          result="effect1_dropShadow_47_188"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_47_188"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur
          result="effect2_foregroundBlur_47_188"
          stdDeviation="1.19001"
        />
      </filter>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint0_linear_47_188"
        x1="595.476"
        x2="621.977"
        y1="103.134"
        y2="103.134"
      >
        <stop stopOpacity="0" />
        <stop offset="0.5" stopOpacity="0.6" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint1_linear_47_188"
        x1="28.0591"
        x2="5.45593"
        y1="103.134"
        y2="103.134"
      >
        <stop stopOpacity="0" />
        <stop offset="0.5" stopColor="white" stopOpacity="0.2" />
        <stop offset="1" stopColor="white" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint2_linear_47_188"
        x1="311.768"
        x2="310.96"
        y1="6.10629e-05"
        y2="161.841"
      >
        <stop stopColor="#4F4F4F" />
        <stop offset="0.52583" stopColor="#646464" />
        <stop offset="0.892106" stopColor="white" stopOpacity="0.5" />
        <stop offset="0.95013" stopColor="#222224" />
        <stop offset="1" stopColor="#353130" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint3_linear_47_188"
        x1="46.7652"
        x2="233.826"
        y1="80.9205"
        y2="80.9205"
      >
        <stop stopColor="#141414" />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint4_linear_47_188"
        x1="625.15"
        x2="565.65"
        y1="84.8872"
        y2="64.2604"
      >
        <stop stopColor="#141414" />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint5_linear_47_188"
        x1="9.52002"
        x2="615.63"
        y1="74.5755"
        y2="74.5755"
      >
        <stop offset="0.748942" stopColor="#666867" />
        <stop offset="1" stopColor="#87888A" />
      </linearGradient>
      <radialGradient
        cx="0"
        cy="0"
        gradientTransform="matrix(27.3845 -3.96669 17.219 22.4479 33.2532 129.316)"
        gradientUnits="userSpaceOnUse"
        id="paint6_radial_47_188"
        r="1"
      >
        <stop offset="0.437392" stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        cx="0"
        cy="0"
        gradientTransform="translate(607.697 97.5823) rotate(-171.703) scale(38.483 152.605)"
        gradientUnits="userSpaceOnUse"
        id="paint7_radial_47_188"
        r="1"
      >
        <stop stopColor="white" />
        <stop offset="0.481395" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint8_linear_47_188"
        x1="86.4738"
        x2="229.275"
        y1="201.506"
        y2="64.259"
      >
        <stop offset="0.82681" stopColor="#282828" />
        <stop offset="1" stopColor="#525252" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint9_linear_47_188"
        x1="495.928"
        x2="495.545"
        y1="32.6864"
        y2="46.0437"
      >
        <stop stopColor="#FFA600" />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
      <radialGradient
        cx="0"
        cy="0"
        gradientTransform="matrix(50.5064 5.3947 -208.986 6.25642 375.274 31.7344)"
        gradientUnits="userSpaceOnUse"
        id="paint10_radial_47_188"
        r="1"
      >
        <stop stopColor="#FFB700" />
        <stop offset="1" stopColor="#FFB700" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint11_linear_47_188"
        x1="496.98"
        x2="486.736"
        y1="33.3186"
        y2="98.5517"
      >
        <stop stopColor="#FFA600" />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
      <radialGradient
        cx="0"
        cy="0"
        gradientTransform="matrix(46.1472 26.9735 -190.949 31.2821 386.74 28.5586)"
        gradientUnits="userSpaceOnUse"
        id="paint12_radial_47_188"
        r="1"
      >
        <stop stopColor="#FFB700" />
        <stop offset="1" stopColor="#FFB700" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        cx="0"
        cy="0"
        gradientTransform="matrix(55.3077 101.547 -534.227 50.3482 111.209 19.0391)"
        gradientUnits="userSpaceOnUse"
        id="paint13_radial_47_188"
        r="1"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint14_linear_47_188"
        x1="86.4738"
        x2="229.275"
        y1="201.506"
        y2="64.259"
      >
        <stop offset="0.82681" stopColor="#282828" />
        <stop offset="1" stopColor="#525252" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint15_linear_47_188"
        x1="41.2534"
        x2="583.896"
        y1="157.876"
        y2="157.876"
      >
        <stop />
        <stop offset="0.5" stopOpacity="0.2" />
        <stop offset="0.75" stopOpacity="0.2" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint16_linear_47_188"
        x1="41.2534"
        x2="583.896"
        y1="143.592"
        y2="143.592"
      >
        <stop stopColor="white" stopOpacity="0.3" />
        <stop offset="0.5" stopColor="white" stopOpacity="0.2" />
        <stop offset="0.75" stopColor="white" stopOpacity="0" />
        <stop offset="1" stopColor="white" stopOpacity="0.1" />
      </linearGradient>
      <clipPath id="clip0_47_188">
        <rect fill="white" height="206.268" rx="31.7335" width="621.977" />
      </clipPath>
      <clipPath id="clip1_47_188">
        <rect
          fill="white"
          height="166.601"
          width="487.109"
          x="71.4004"
          y="28.5586"
        />
      </clipPath>
      <clipPath id="clip2_47_188">
        <rect
          fill="white"
          height="150.734"
          transform="translate(71.4004 46.0117)"
          width="487.109"
        />
      </clipPath>
      <clipPath id="clip3_47_188">
        <rect
          fill="white"
          height="106.307"
          transform="translate(71.4004 47.6016)"
          width="487.109"
        />
      </clipPath>
      <clipPath id="clip4_47_188">
        <rect
          fill="white"
          height="41.2536"
          transform="translate(71.4004 153.906)"
          width="487.109"
        />
      </clipPath>
      <image
        height="1024"
        href="/assets/join-button-texture.png"
        id="image0_47_188"
        preserveAspectRatio="none"
        width="1024"
      />
    </defs>
  </svg>
);
