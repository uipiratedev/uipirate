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
              {/* <path
                d="M126.509 116.597C124.19 116.597 122.148 116.074 120.384 115.028C118.653 113.95 117.314 112.48 116.366 110.618C115.419 108.724 114.929 106.551 114.896 104.101L120.286 103.807C120.319 106.421 120.874 108.397 121.952 109.736C123.03 111.076 124.549 111.745 126.509 111.745C128.567 111.745 130.135 111.043 131.213 109.638C132.324 108.234 132.879 106.208 132.879 103.562V81.0225H138.171V103.562C138.171 106.208 137.681 108.511 136.701 110.471C135.754 112.431 134.415 113.95 132.683 115.028C130.952 116.074 128.894 116.597 126.509 116.597ZM160.046 116.597C156.681 116.597 153.79 115.878 151.373 114.44C148.956 112.97 147.094 110.88 145.787 108.168C144.48 105.457 143.827 102.223 143.827 98.4665C143.827 94.7098 144.48 91.4758 145.787 88.7645C147.094 86.0205 148.956 83.9135 151.373 82.4435C153.79 80.9735 156.681 80.2385 160.046 80.2385C163.443 80.2385 166.351 80.9735 168.768 82.4435C171.218 83.9135 173.08 86.0205 174.354 88.7645C175.661 91.4758 176.314 94.7098 176.314 98.4665C176.314 102.223 175.661 105.457 174.354 108.168C173.08 110.88 171.218 112.97 168.768 114.44C166.351 115.878 163.443 116.597 160.046 116.597ZM160.046 111.745C162.3 111.745 164.227 111.223 165.828 110.177C167.461 109.132 168.703 107.629 169.552 105.669C170.401 103.677 170.826 101.276 170.826 98.4665C170.826 95.6572 170.401 93.2562 169.552 91.2635C168.703 89.2708 167.461 87.7518 165.828 86.7065C164.227 85.6285 162.3 85.0895 160.046 85.0895C157.825 85.0895 155.914 85.6285 154.313 86.7065C152.712 87.7518 151.471 89.2708 150.589 91.2635C149.74 93.2562 149.315 95.6572 149.315 98.4665C149.315 101.276 149.74 103.677 150.589 105.669C151.471 107.629 152.712 109.132 154.313 110.177C155.914 111.223 157.825 111.745 160.046 111.745ZM181.965 115.812V81.0225H187.257V115.812H181.965ZM194.837 115.812V81.0225H201.55L217.622 109.393V81.0225H222.914V115.812H215.956L200.129 88.0785V115.812H194.837ZM250.123 115.812L240.911 81.0225H246.546L253.308 108.511L260.07 81.0225H265.46L272.222 108.511L278.935 81.0225H284.668L275.407 115.812H269.233L262.765 90.4305L256.297 115.812H250.123ZM282.09 115.812L294.634 81.0225H301.347L313.891 115.812H308.256L305.071 106.747H290.861L287.725 115.812H282.09ZM292.527 101.945H303.454L297.966 86.0695L292.527 101.945ZM318.055 115.812V81.0225H323.347V115.812H318.055ZM337.074 115.812V85.8735H326.392V81.0225H353.048V85.8735H342.366V115.812H337.074ZM356.097 115.812V81.0225H361.389V113.852L358.596 110.961H378.343V115.812H356.097ZM382.511 115.812V81.0225H387.803V115.812H382.511ZM408.071 116.597C405.294 116.597 402.877 116.09 400.819 115.077C398.793 114.065 397.192 112.66 396.017 110.863C394.841 109.067 394.155 106.976 393.959 104.591L399.398 104.248C399.626 105.882 400.1 107.27 400.819 108.413C401.537 109.524 402.501 110.373 403.71 110.961C404.951 111.517 406.437 111.794 408.169 111.794C409.671 111.794 410.945 111.615 411.991 111.255C413.069 110.863 413.885 110.292 414.441 109.54C414.996 108.789 415.274 107.874 415.274 106.796C415.274 105.816 415.029 104.951 414.539 104.199C414.081 103.415 413.183 102.713 411.844 102.092C410.537 101.439 408.61 100.802 406.062 100.181C403.285 99.4955 401.064 98.7442 399.398 97.9275C397.732 97.1108 396.523 96.0982 395.772 94.8895C395.053 93.6482 394.694 92.1292 394.694 90.3325C394.694 88.3398 395.167 86.5922 396.115 85.0895C397.095 83.5542 398.483 82.3618 400.28 81.5125C402.076 80.6632 404.232 80.2385 406.748 80.2385C409.394 80.2385 411.648 80.7285 413.51 81.7085C415.404 82.6885 416.891 84.0278 417.969 85.7265C419.079 87.4252 419.765 89.3688 420.027 91.5575L414.588 91.8515C414.424 90.5122 414.016 89.3362 413.363 88.3235C412.709 87.2782 411.827 86.4778 410.717 85.9225C409.606 85.3345 408.25 85.0405 406.65 85.0405C404.624 85.0405 403.024 85.5142 401.848 86.4615C400.704 87.3762 400.133 88.6012 400.133 90.1365C400.133 91.1165 400.361 91.9495 400.819 92.6355C401.309 93.2888 402.158 93.8605 403.367 94.3505C404.608 94.8405 406.356 95.3632 408.61 95.9185C411.615 96.6045 414 97.4538 415.764 98.4665C417.56 99.4465 418.834 100.606 419.586 101.945C420.337 103.285 420.713 104.804 420.713 106.502C420.713 108.56 420.174 110.357 419.096 111.892C418.05 113.395 416.58 114.555 414.686 115.371C412.791 116.188 410.586 116.597 408.071 116.597ZM432.681 115.812V85.8735H421.999V81.0225H448.655V85.8735H437.973V115.812H432.681Z"
                fill="black"
              /> */}
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
