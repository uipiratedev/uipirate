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
