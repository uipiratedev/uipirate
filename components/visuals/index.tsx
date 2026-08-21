// --- Soft, 3D-Style Abstract Visuals (Inspired by Reference) ---

export const VisualAudit = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="orangeGrad1" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#ff5b04" />
        <stop offset="100%" stopColor="#c74400" />
      </linearGradient>
      <filter height="140%" id="softShadow" width="140%" x="-20%" y="-20%">
        <feDropShadow
          dx="0"
          dy="15"
          floodColor="#c74400"
          floodOpacity="0.15"
          stdDeviation="20"
        />
      </filter>
      <pattern
        height="20"
        id="dots"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1.5" />
      </pattern>
    </defs>

    {/* Background Pattern */}
    <rect fill="url(#dots)" height="250" opacity="0.5" width="400" />

    <g className="animate-float-slow">
      {/* Main Shield Background/Shadow */}
      <path
        d="M200 40 L280 75 V135 C280 185 200 225 200 225 C200 225 120 185 120 135 V75 Z"
        fill="white"
        filter="url(#softShadow)"
      />

      {/* Inner Decorative Glass Shield Layer */}
      <path
        d="M200 55 L260 82 V132 C260 172 200 205 200 205 C200 205 140 172 140 132 V82 Z"
        fill="url(#orangeGrad1)"
        fillOpacity="0.05"
        stroke="url(#orangeGrad1)"
        strokeWidth="3"
      />

      {/* Floating Checkmark / Tick Orb */}
      <g className="animate-float" style={{ animationDelay: "1s" }}>
        <circle
          cx="200"
          cy="130"
          fill="url(#orangeGrad1)"
          filter="url(#softShadow)"
          r="35"
        />
        <circle cx="200" cy="130" fill="white" r="25" />
        <path
          d="M185 130 L195 140 L215 115"
          stroke="url(#orangeGrad1)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <circle
          className="animate-pulse"
          cx="200"
          cy="130"
          fill="url(#orangeGrad1)"
          opacity="0.1"
          r="12"
        />
      </g>

      {/* Subtle Floating Sparkles */}
      <circle
        className="animate-ping-slow"
        cx="270"
        cy="60"
        fill="#ff5b04"
        opacity="0.6"
        r="4"
      />
      <circle cx="130" cy="160" fill="#c74400" opacity="0.3" r="6" />
    </g>
  </svg>
);

export const VisualFriction = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="orangeGrad2" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#ff853f" />
        <stop offset="100%" stopColor="#c74400" />
      </linearGradient>
      <filter height="140%" id="softShadow2" width="140%" x="-20%" y="-20%">
        <feDropShadow
          dx="0"
          dy="20"
          floodColor="#c74400"
          floodOpacity="0.2"
          stdDeviation="25"
        />
      </filter>
      <pattern
        height="20"
        id="dots2"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1.5" />
      </pattern>
    </defs>
    <rect fill="url(#dots2)" height="250" opacity="0.5" width="400" />

    <g className="animate-float-slow">
      {/* Outer Ring */}
      <circle
        cx="200"
        cy="130"
        filter="url(#softShadow2)"
        r="80"
        stroke="#f1f5f9"
        strokeWidth="30"
      />
      {/* Inner Gradient Arc representing drop-off */}
      <path
        d="M120 130A80 80 0 0 1 270 90"
        filter="url(#softShadow2)"
        stroke="url(#orangeGrad2)"
        strokeDasharray="300"
        strokeDashoffset="0"
        strokeLinecap="round"
        strokeWidth="30"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="3s"
          fill="freeze"
          values="300;0"
        />
      </path>

      {/* The Needle/Dial */}
      <g className="origin-[200px_130px] rotate-[45deg] transition-transform duration-1000">
        <circle
          cx="200"
          cy="130"
          fill="white"
          filter="url(#softShadow2)"
          r="15"
        />
        <path
          d="M200 130L200 65"
          filter="url(#softShadow2)"
          stroke="url(#orangeGrad2)"
          strokeLinecap="round"
          strokeWidth="8"
        />
      </g>
    </g>

    {/* Abstract UI floating elements */}
    <rect
      className="animate-float"
      fill="#e2e8f0"
      height="12"
      opacity="0.6"
      rx="6"
      style={{ animationDelay: "0.5s" }}
      width="40"
      x="60"
      y="60"
    />
    <rect
      className="animate-float"
      fill="#cbd5e1"
      height="12"
      opacity="0.6"
      rx="6"
      style={{ animationDelay: "1.5s" }}
      width="60"
      x="300"
      y="180"
    />
  </svg>
);

export const VisualFlow = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="orangeGrad3" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#c74400" />
        <stop offset="100%" stopColor="#ff5b04" />
      </linearGradient>
      <filter height="140%" id="softShadow3" width="140%" x="-20%" y="-20%">
        <feDropShadow
          dx="0"
          dy="15"
          floodColor="#c74400"
          floodOpacity="0.2"
          stdDeviation="20"
        />
      </filter>
      <pattern
        height="20"
        id="dots3"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1.5" />
      </pattern>
    </defs>
    <rect fill="url(#dots3)" height="250" opacity="0.5" width="400" />

    <g className="animate-float-slow">
      {/* Connection Lines */}
      <path
        d="M120 100C160 100 180 160 220 160C250 160 270 120 300 120"
        opacity="0.4"
        stroke="#cbd5e1"
        strokeDasharray="10 10"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        className="animate-flow-dash"
        d="M120 100C160 100 180 160 220 160C250 160 270 120 300 120"
        stroke="url(#orangeGrad3)"
        strokeDasharray="15 30"
        strokeLinecap="round"
        strokeWidth="6"
      />

      {/* Node 1 */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <rect
          fill="white"
          filter="url(#softShadow3)"
          height="60"
          rx="20"
          width="60"
          x="80"
          y="70"
        />
        <circle
          cx="110"
          cy="100"
          fill="url(#orangeGrad3)"
          opacity="0.2"
          r="12"
        />
        <circle cx="110" cy="100" fill="url(#orangeGrad3)" r="6" />
      </g>

      {/* Node 2 */}
      <g className="animate-float" style={{ animationDelay: "1s" }}>
        <rect
          fill="white"
          filter="url(#softShadow3)"
          height="60"
          rx="30"
          width="60"
          x="190"
          y="130"
        />
        <path
          d="M210 160H230M220 150V170"
          stroke="url(#orangeGrad3)"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </g>

      {/* Node 3 */}
      <g className="animate-float" style={{ animationDelay: "2s" }}>
        <rect
          fill="url(#orangeGrad3)"
          filter="url(#softShadow3)"
          height="60"
          rx="20"
          width="70"
          x="270"
          y="90"
        />
        <rect
          fill="white"
          height="10"
          opacity="0.8"
          rx="5"
          width="40"
          x="285"
          y="115"
        />
      </g>
    </g>
  </svg>
);

export const VisualVideo = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="orangeGrad4" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#c74400" />
        <stop offset="100%" stopColor="#ff853f" />
      </linearGradient>
      <filter height="140%" id="softShadow4" width="140%" x="-20%" y="-20%">
        <feDropShadow
          dx="0"
          dy="15"
          floodColor="#c74400"
          floodOpacity="0.2"
          stdDeviation="20"
        />
      </filter>
      <pattern
        height="20"
        id="dots4"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1.5" />
      </pattern>
    </defs>
    <rect fill="url(#dots4)" height="250" opacity="0.5" width="400" />

    <g className="animate-float-slow">
      {/* Abstract Screen Container */}
      <rect
        fill="white"
        filter="url(#softShadow4)"
        height="150"
        rx="24"
        width="260"
        x="70"
        y="50"
      />
      <rect fill="#f8fafc" height="130" rx="16" width="240" x="80" y="60" />

      {/* Decorative UI inside screen */}
      <rect fill="#e2e8f0" height="12" rx="6" width="120" x="100" y="80" />
      <rect
        fill="#cbd5e1"
        height="8"
        opacity="0.5"
        rx="4"
        width="80"
        x="100"
        y="100"
      />

      {/* Play Button Orb */}
      <g className="animate-float" style={{ animationDelay: "1s" }}>
        <circle
          cx="200"
          cy="125"
          fill="url(#orangeGrad4)"
          filter="url(#softShadow4)"
          r="35"
        />
        <circle
          className="animate-ping-slow"
          cx="200"
          cy="125"
          fill="white"
          opacity="0.1"
          r="35"
        />
        <path d="M192 110V140L216 125L192 110Z" fill="white" />
      </g>
    </g>
  </svg>
);

// 1. Custom 3D Assets: Fixed transform logic and enhanced depth
export const VisualAssets = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradAssets" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#ff5b04" />
        <stop offset="100%" stopColor="#c74400" />
      </linearGradient>
      <pattern
        height="20"
        id="dotsAssets"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsAssets)" height="250" width="400" />

    {/* Wrap animation inside a separate group to avoid transform conflicts */}
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Primary 3D Shape (Cube) */}
        <path
          d="M0 -60 L52 -30 V30 L0 60 L-52 30 V-30 Z"
          fill="white"
          stroke="#ff5b04"
          strokeWidth="2.5"
        />
        <path
          d="M0 -60 V60 M0 0 L52 -30 M0 0 L-52 -30"
          opacity="0.2"
          stroke="#ff5b04"
          strokeWidth="1.5"
        />

        {/* Floating Technical Labels */}
        <g className="animate-float" transform="translate(65, -45)">
          <rect
            fill="white"
            height="22"
            rx="11"
            stroke="#f1f5f9"
            strokeWidth="1"
            width="64"
          />
          <text
            fill="#ff5b04"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="800"
            textAnchor="middle"
            x="32"
            y="15"
          >
            OBJ_01
          </text>
        </g>

        <g
          className="animate-float"
          style={{ animationDelay: "1.5s" }}
          transform="translate(-115, 15)"
        >
          <rect
            fill="white"
            height="22"
            rx="11"
            stroke="#f1f5f9"
            strokeWidth="1"
            width="64"
          />
          <text
            fill="#ff5b04"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="800"
            textAnchor="middle"
            x="32"
            y="15"
          >
            HIGH_RES
          </text>
        </g>

        {/* Core Energy Orb */}
        <circle cx="0" cy="0" fill="url(#gradAssets)" r="14" />
        <circle
          className="animate-ping-slow"
          cx="0"
          cy="0"
          opacity="0.2"
          r="24"
          stroke="url(#gradAssets)"
          strokeWidth="1.5"
        />
      </g>
    </g>
  </svg>
);

// 2. Web-Ready 3D Animations: Robust transform structure
export const VisualAnimations = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradAnim" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#ff5b04" />
        <stop offset="100%" stopColor="#c74400" />
      </linearGradient>
      <pattern
        height="20"
        id="dotsAnim"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsAnim)" height="250" width="400" />

    <g transform="translate(200, 125)">
      <g className="animate-float">
        {/* Outer Progress Ring */}
        <circle cx="0" cy="0" r="80" stroke="#f1f5f9" strokeWidth="5" />
        <circle
          className="animate-spin-slow"
          cx="0"
          cy="0"
          r="80"
          stroke="url(#gradAnim)"
          strokeDasharray="502"
          strokeDashoffset="180"
          strokeLinecap="round"
          strokeWidth="5"
          style={{ transformOrigin: "center" }}
        />

        {/* Playback Controls Container */}
        <rect
          fill="white"
          height="56"
          rx="14"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="90"
          x="-45"
          y="-28"
        />
        <path d="M-8 -12 L14 0 L-8 12 V-12Z" fill="url(#gradAnim)" />

        {/* Floating FPS Badge */}
        <g className="animate-float-slow" transform="translate(50, 40)">
          <circle fill="white" r="24" stroke="#ff5b04" strokeWidth="1.5" />
          <text
            fill="#ff5b04"
            fontFamily="sans-serif"
            fontSize="11"
            fontWeight="900"
            textAnchor="middle"
            y="2"
          >
            60
          </text>
          <text
            fill="#94a3b8"
            fontFamily="sans-serif"
            fontSize="6"
            fontWeight="bold"
            textAnchor="middle"
            y="13"
          >
            FPS
          </text>
        </g>
      </g>
    </g>
  </svg>
);

// 3. 3D Modeling & Animations: Mesh Editor structure
export const VisualModeling = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsModel"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsModel)" height="250" width="400" />

    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Wireframe Mesh Elements */}
        <ellipse
          cx="0"
          cy="0"
          rx="75"
          ry="32"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="32"
          ry="75"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="75"
          stroke="#cbd5e1"
          strokeDasharray="5 5"
          strokeWidth="1"
        />

        {/* Transform Gizmo Overlay */}
        <g className="animate-float">
          <path
            d="M0 0 V-65 M0 0 H65 M0 0 L-45 45"
            stroke="#ff5b04"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <circle cx="0" cy="-65" fill="#ff5b04" r="4.5" />
          <circle cx="65" cy="0" fill="#ff5b04" r="4.5" />
          <circle cx="-45" cy="45" fill="#ff5b04" r="4.5" />
          <circle
            cx="0"
            cy="0"
            fill="white"
            r="7"
            stroke="#ff5b04"
            strokeWidth="2"
          />
        </g>

        {/* Dynamic Vertices */}
        <rect
          className="animate-pulse"
          fill="#ff5b04"
          height="7"
          width="7"
          x="50"
          y="-38"
        />
        <rect fill="#ff5b04" height="7" width="7" x="-60" y="-18" />
        <rect fill="#ff5b04" height="7" width="7" x="25" y="60" />
      </g>
    </g>
  </svg>
);

// 4. Website & Product Integration: Seamless code-to-3D visual
export const VisualIntegration = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsInteg"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsInteg)" height="250" width="400" />

    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Code Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="110" x="-85" y="-35" />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="70" x="-85" y="-18" />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="130" x="-85" y="-1" />

        {/* The Component Asset "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 10)">
          <rect fill="#ff5b04" height="70" rx="18" width="70" x="-35" y="-35" />
          <path
            d="M-12 -12 L12 12 M12 -12 L-12 12"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="4.5"
          />

          {/* Signal Link */}
          <path
            d="M-70 0 H-35"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="0" fill="#ff5b04" r="4.5" />
        </g>

        {/* Tech Labels */}
        <text
          fill="#cbd5e1"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="-85"
          y="48"
        >
          {"<Three />"}
        </text>
        <text
          fill="#ff5b04"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="35"
          y="55"
        >
          .glb
        </text>
      </g>
    </g>
  </svg>
);

// 1. UI Animations: Technical UI Blueprint
export const VisualUI = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsUI"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsUI)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Dashboard Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="60" x="-85" y="-35" />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="110" x="-85" y="-18" />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="90" x="-85" y="-1" />

        {/* Interactive Toggle "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 10)">
          <rect fill="#ff5b04" height="40" rx="20" width="70" x="-35" y="-35" />
          <circle cx="15" cy="-15" fill="white" r="12" />
          {/* Signal Link */}
          <path
            d="M-70 -15 H-35"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="-15" fill="#ff5b04" r="4.5" />
        </g>

        {/* Tech Labels */}
        <text
          fill="#cbd5e1"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="-85"
          y="48"
        >
          {"<Toggle />"}
        </text>
        <text
          fill="#ff5b04"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="35"
          y="55"
        >
          ACTIVE
        </text>
      </g>
    </g>
  </svg>
);

// 2. Lottie: The "Engine" JSON Visual
export const VisualLottie = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsLottie"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsLottie)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* JSON File Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="120" x="-85" y="-35" />
        <rect
          fill="#ff5b04"
          height="9"
          opacity="0.2"
          rx="4.5"
          width="40"
          x="-85"
          y="-18"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="100" x="-85" y="-1" />

        {/* Play Engine "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 10)">
          <circle fill="#ff5b04" r="35" />
          <path d="M-8 -12 L14 0 L-8 12 V-12Z" fill="white" />
          {/* Connection */}
          <path
            d="M-70 0 H-35"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="0" fill="#ff5b04" r="4.5" />
        </g>

        {/* Tech Labels */}
        <text
          fill="#cbd5e1"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="-85"
          y="48"
        >
          "vector":
        </text>
        <text
          fill="#ff5b04"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="25"
          y="55"
        >
          lottie.json
        </text>
      </g>
    </g>
  </svg>
);

// 3. Web Interaction: Scrolling Blueprint
export const VisualWeb = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsWeb"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsWeb)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Browser Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f8fafc" height="40" rx="8" width="130" x="-85" y="-35" />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="80" x="-85" y="15" />

        {/* Scroll Motion "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 20)">
          <rect fill="#ff5b04" height="80" rx="25" width="50" x="-25" y="-45" />
          <rect
            className="animate-bounce"
            fill="white"
            height="15"
            rx="3"
            width="6"
            x="-3"
            y="-30"
          />
          {/* Signal Link */}
          <path
            d="M-70 -5 H-25"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="-5" fill="#ff5b04" r="4.5" />
        </g>

        {/* Tech Labels */}
        <text
          fill="#cbd5e1"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="-85"
          y="48"
        >
          window.scroll
        </text>
        <text
          fill="#ff5b04"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="35"
          y="55"
        >
          SMOOTH
        </text>
      </g>
    </g>
  </svg>
);

// 4. Developer-Ready: The Delivery Package
export const VisualDev = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsDev"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsDev)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Terminal Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="90" x="-85" y="-35" />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="120" x="-85" y="-18" />
        <rect
          fill="#ff5b04"
          height="9"
          opacity="0.2"
          rx="4.5"
          width="50"
          x="-85"
          y="-1"
        />

        {/* Build Success "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 10)">
          <rect fill="#10b981" height="70" rx="18" width="70" x="-35" y="-35" />
          <path
            d="M-12 0 L-2 10 L15 -10"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
          />
          {/* Signal Link */}
          <path
            d="M-70 0 H-35"
            opacity="0.4"
            stroke="#10b981"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="0" fill="#10b981" r="4.5" />
        </g>

        {/* Tech Labels */}
        <text
          fill="#cbd5e1"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="-85"
          y="48"
        >
          npm install
        </text>
        <text
          fill="#10b981"
          fontFamily="monospace"
          fontSize="13"
          fontWeight="900"
          x="35"
          y="55"
        >
          BUILD:OK
        </text>
      </g>
    </g>
  </svg>
);

// 1. Brand & Marketing: Profile & Social Blueprint
export const VisualBrand = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsBrand"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsBrand)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Social Feed Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <circle cx="-75" cy="-35" fill="#f1f5f9" r="10" />
        <rect fill="#f1f5f9" height="6" rx="3" width="50" x="-60" y="-38" />
        <rect fill="#f8fafc" height="40" rx="8" width="130" x="-85" y="-15" />
        <rect
          fill="#f1f5f9"
          height="6"
          opacity="0.6"
          rx="3"
          width="60"
          x="-85"
          y="32"
        />

        {/* Brand Emblem "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 15)">
          <rect fill="#ff5b04" height="70" rx="18" width="70" x="-35" y="-35" />
          <path
            d="M0 -15 L4.5 -4.5 L15 0 L4.5 4.5 L0 15 L-4.5 4.5 L-15 0 L-4.5 -4.5 Z"
            fill="white"
          />
          {/* Signal Link */}
          <path
            d="M-70 -5 H-35"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="-5" fill="#ff5b04" r="4.5" />
        </g>
      </g>
    </g>
  </svg>
);

// 2. Website & Product Assets: UI/Dashboard Blueprint
export const VisualWebsiteProduct = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsAssets"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsAssets)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Dashboard Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="120" x="-85" y="-35" />
        <rect
          fill="#ff5b04"
          height="9"
          opacity="0.2"
          rx="4.5"
          width="40"
          x="-85"
          y="-18"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="100" x="-85" y="-1" />
        <rect
          fill="#f1f5f9"
          height="9"
          opacity="0.5"
          rx="4.5"
          width="60"
          x="-85"
          y="16"
        />

        {/* UI Component "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 10)">
          <rect fill="#ff5b04" height="70" rx="18" width="70" x="-35" y="-35" />
          <rect
            height="30"
            rx="4"
            stroke="white"
            strokeWidth="4"
            width="30"
            x="-15"
            y="-15"
          />
          <circle cx="0" cy="0" fill="white" r="6" />
          {/* Connection */}
          <path
            d="M-70 0 H-35"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="0" fill="#ff5b04" r="4.5" />
        </g>
      </g>
    </g>
  </svg>
);

// 3. Infographics & Newsletters: Data/Layout Blueprint
export const VisualInfo = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsInfo"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsInfo)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Newsletter Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f8fafc" height="10" rx="5" width="130" x="-85" y="-35" />
        <rect fill="#f1f5f9" height="6" rx="3" width="80" x="-85" y="-15" />
        <rect fill="#f1f5f9" height="6" rx="3" width="110" x="-85" y="-2" />
        <rect
          fill="#f1f5f9"
          height="6"
          opacity="0.4"
          rx="3"
          width="90"
          x="-85"
          y="11"
        />

        {/* Chart Node "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 20)">
          <rect fill="#ff5b04" height="80" rx="25" width="50" x="-25" y="-45" />
          <path
            d="M-10 15 V-5 M0 15 V-15 M10 15 V5"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="4"
          />
          {/* Signal Link */}
          <path
            d="M-70 -5 H-25"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="-5" fill="#ff5b04" r="4.5" />
        </g>
      </g>
    </g>
  </svg>
);

// 4. Multi-Format Graphics: Export/Format Blueprint
export const VisualMulti = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsMulti"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsMulti)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Folder Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="90" x="-85" y="-35" />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="120" x="-85" y="-18" />
        <rect
          fill="#f1f5f9"
          height="9"
          opacity="0.3"
          rx="4.5"
          width="60"
          x="-85"
          y="-1"
        />

        {/* Versatile Stack "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 10)">
          <rect
            fill="#ff5b04"
            height="55"
            opacity="0.4"
            rx="12"
            width="55"
            x="-35"
            y="-35"
          />
          <rect fill="#ff5b04" height="60" rx="12" width="60" x="-25" y="-25" />
          <path
            d="M-5 15 L5 15 M0 10 L0 20"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="4"
          />
          {/* Signal Link */}
          <path
            d="M-70 0 H-25"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="0" fill="#ff5b04" r="4.5" />
        </g>
      </g>
    </g>
  </svg>
);

// 1. Landing Pages & Corporate: High-impact layout blueprint
export const VisualLanding = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsLanding"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsLanding)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Page Structure Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f8fafc" height="40" rx="8" width="170" x="-85" y="-45" />
        <rect
          fill="#f1f5f9"
          height="30"
          opacity="0.6"
          rx="6"
          width="50"
          x="-85"
          y="5"
        />
        <rect
          fill="#f1f5f9"
          height="30"
          opacity="0.6"
          rx="6"
          width="50"
          x="-25"
          y="5"
        />
        <rect
          fill="#f1f5f9"
          height="30"
          opacity="0.6"
          rx="6"
          width="50"
          x="35"
          y="5"
        />

        {/* High Impact Hero Element "Jumping Out" */}
        <g className="animate-float" transform="translate(40, -15)">
          <rect fill="#ff5b04" height="70" rx="18" width="90" x="-45" y="-45" />
          <rect
            fill="white"
            height="6"
            opacity="0.9"
            rx="3"
            width="60"
            x="-30"
            y="-15"
          />
          <rect
            fill="white"
            height="6"
            opacity="0.5"
            rx="3"
            width="40"
            x="-30"
            y="0"
          />
          {/* Signal Link */}
          <path
            d="M-80 0 H-45"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-80" cy="0" fill="#ff5b04" r="4.5" />
        </g>
      </g>
    </g>
  </svg>
);

// 2. Design & Frontend: Technical Component Blueprint
export const VisualFrontend = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsFront"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsFront)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Code Editor Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="120" x="-85" y="-35" />
        <rect
          fill="#ff5b04"
          height="9"
          opacity="0.2"
          rx="4.5"
          width="80"
          x="-85"
          y="-18"
        />
        <rect fill="#f1f5f9" height="9" rx="4.5" width="100" x="-85" y="-1" />

        {/* React/Component Logic "Jumping Out" */}
        <g className="animate-float" transform="translate(50, 10)">
          <rect fill="#ff5b04" height="70" rx="18" width="70" x="-35" y="-35" />
          <path
            d="M-15 -10 L0 5 L15 -10"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M-15 10 L0 -5 L15 10"
            opacity="0.5"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="4"
          />
          {/* Connection */}
          <path
            d="M-70 0 H-35"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-70" cy="0" fill="#ff5b04" r="4.5" />
        </g>
      </g>
    </g>
  </svg>
);

// 3. SEO & AI: Optimization Spotlight Blueprint
export const VisualSEO = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsSEO"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsSEO)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Indexing Viewport */}
        <rect
          fill="white"
          height="130"
          rx="18"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="200"
          x="-100"
          y="-65"
        />
        <circle cx="-60" cy="-25" r="15" stroke="#f1f5f9" strokeWidth="2" />
        <circle cx="0" cy="-25" r="15" stroke="#f1f5f9" strokeWidth="2" />
        <circle cx="60" cy="-25" r="15" stroke="#f1f5f9" strokeWidth="2" />
        <rect fill="#f8fafc" height="8" rx="4" width="160" x="-80" y="15" />

        {/* Discovery "Jumping Out" */}
        <g className="animate-float" transform="translate(0, -25)">
          <circle fill="#ff5b04" r="35" />
          <circle opacity="0.4" r="15" stroke="white" strokeWidth="3" />
          <path
            d="M12 12 L22 22"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="4"
          />
          {/* Signal Pulse */}
          <circle
            className="animate-ping-slow"
            opacity="0.2"
            r="45"
            stroke="#ff5b04"
            strokeWidth="1"
          />
        </g>
      </g>
    </g>
  </svg>
);

// 4. Responsive Experience: Multi-Device Blueprint
export const VisualResponsive = () => (
  <svg
    className="w-full h-full object-cover"
    fill="none"
    viewBox="0 0 400 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        height="20"
        id="dotsResp"
        patternUnits="userSpaceOnUse"
        width="20"
        x="0"
        y="0"
      >
        <circle cx="2" cy="2" fill="#e2e8f0" r="1" />
      </pattern>
    </defs>
    <rect fill="url(#dotsResp)" height="250" width="400" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Desktop Viewport Base */}
        <rect
          fill="white"
          height="100"
          rx="12"
          stroke="#f1f5f9"
          strokeWidth="1.5"
          width="160"
          x="-100"
          y="-60"
        />
        <rect fill="#f8fafc" height="10" rx="5" width="130" x="-85" y="-45" />
        <rect
          fill="#f1f5f9"
          height="40"
          opacity="0.4"
          rx="6"
          width="60"
          x="-85"
          y="-25"
        />

        {/* Mobile Device "Jumping Out" */}
        <g className="animate-float" transform="translate(60, 15)">
          <rect fill="#ff5b04" height="90" rx="14" width="50" x="-25" y="-45" />
          <rect
            fill="white"
            height="60"
            opacity="0.2"
            rx="4"
            width="30"
            x="-15"
            y="-30"
          />
          <circle cx="0" cy="35" fill="white" opacity="0.5" r="3" />
          {/* Connection */}
          <path
            d="M-60 -10 H-25"
            opacity="0.4"
            stroke="#ff5b04"
            strokeDasharray="5 5"
            strokeWidth="2.5"
          />
          <circle cx="-60" cy="-10" fill="#ff5b04" r="4.5" />
        </g>
      </g>
    </g>
  </svg>
);

// 1. UX/UI: Overlapping Prisms of Design
export const VisualUX = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 400 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className="animate-float-slow">
      <circle cx="200" cy="150" fill="#ff5b04" fillOpacity="0.03" r="80" />
      {/* Translucent Glass Layers */}
      <rect
        className="backdrop-blur-md"
        fill="white"
        fillOpacity="0.6"
        height="120"
        rx="24"
        stroke="#f1f5f9"
        strokeWidth="1"
        width="120"
        x="140"
        y="100"
      />
      <rect
        className="backdrop-blur-sm"
        fill="white"
        fillOpacity="0.4"
        height="120"
        rx="24"
        stroke="#f1f5f9"
        strokeWidth="1"
        width="120"
        x="110"
        y="70"
      />
      {/* Floating Interface "Seeds" */}
      <circle
        className="animate-pulse"
        cx="200"
        cy="130"
        fill="#ff5b04"
        r="30"
      />
      <rect fill="#e2e8f0" height="8" rx="4" width="60" x="150" y="160" />
      <rect
        fill="#ff5b04"
        fillOpacity="0.2"
        height="8"
        rx="4"
        width="40"
        x="150"
        y="175"
      />
    </g>
  </svg>
);

// 2. UI Development: The Geometric Nexus
export const VisualCode = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 400 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className="animate-float">
      {/* Central Connector Lines */}
      <path
        d="M120 150 H280"
        stroke="#f1f5f9"
        strokeDasharray="8 8"
        strokeWidth="2"
      />
      <path
        d="M200 70 V230"
        stroke="#f1f5f9"
        strokeDasharray="8 8"
        strokeWidth="2"
      />

      {/* Floating Logic Nodes */}
      <rect
        className="animate-pulse"
        fill="#ff5b04"
        height="50"
        rx="12"
        width="50"
        x="175"
        y="125"
      />
      <rect
        fill="white"
        height="20"
        rx="6"
        stroke="#ff5b04"
        strokeWidth="2"
        width="20"
        x="250"
        y="140"
      />
      <rect
        fill="white"
        height="20"
        rx="6"
        stroke="#ff5b04"
        strokeWidth="2"
        width="20"
        x="130"
        y="140"
      />
      <rect
        fill="white"
        height="20"
        rx="6"
        stroke="#ff5b04"
        strokeWidth="2"
        width="20"
        x="190"
        y="80"
      />
      <rect
        fill="white"
        height="20"
        rx="6"
        stroke="#ff5b04"
        strokeWidth="2"
        width="20"
        x="190"
        y="200"
      />
    </g>
  </svg>
);

// 3. Idea to MVP: Orbital Growth
export const VisualMVP = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 400 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className="animate-float-slow">
      {/* Orbital Path */}
      <ellipse
        className="animate-spin-slow"
        cx="200"
        cy="150"
        rx="100"
        ry="40"
        stroke="#f1f5f9"
        strokeDasharray="4 4"
        strokeWidth="1"
        style={{ transformOrigin: "200px 150px" }}
      />
      <ellipse
        className="animate-spin-slow"
        cx="200"
        cy="150"
        rx="40"
        ry="100"
        stroke="#f1f5f9"
        strokeDasharray="4 4"
        strokeWidth="1"
        style={{
          transformOrigin: "200px 150px",
          animationDirection: "reverse",
        }}
      />

      {/* The "Idea" Core */}
      <circle
        cx="200"
        cy="150"
        fill="white"
        r="45"
        stroke="#f1f5f9"
        strokeWidth="1"
      />
      <path
        d="M200 130 L212 145 L227 150 L212 155 L200 170 L188 155 L173 150 L188 145 Z"
        fill="#ff5b04"
      />
      <circle
        className="animate-ping-slow"
        cx="200"
        cy="150"
        opacity="0.1"
        r="60"
        stroke="#ff5b04"
        strokeWidth="1"
      />
    </g>
  </svg>
);

// 4. Mobile: Liquid Glass Stack
export const VisualMobile = () => (
  <svg
    className="w-full h-full"
    fill="none"
    viewBox="0 0 400 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className="animate-float">
      {/* Vertical Responsive Planes */}
      <rect
        className="backdrop-blur-md"
        fill="white"
        height="180"
        rx="20"
        stroke="#f1f5f9"
        strokeWidth="1"
        width="80"
        x="160"
        y="60"
      />
      <rect
        className="backdrop-blur-sm"
        fill="white"
        fillOpacity="0.4"
        height="180"
        rx="20"
        stroke="#f1f5f9"
        strokeWidth="1"
        width="80"
        x="180"
        y="80"
      />

      {/* Interactive Detail */}
      <rect
        fill="#ff5b04"
        height="4"
        opacity="0.4"
        rx="2"
        width="50"
        x="175"
        y="100"
      />
      <circle cx="200" cy="210" fill="#ff5b04" r="10" />
      <circle
        className="animate-pulse"
        cx="200"
        cy="210"
        opacity="0.2"
        r="18"
        stroke="#ff5b04"
        strokeWidth="1"
      />
    </g>
  </svg>
);
