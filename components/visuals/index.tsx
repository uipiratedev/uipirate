// --- Soft, 3D-Style Abstract Visuals (Inspired by Reference) ---

export const VisualAudit = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orangeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff5b04" />
        <stop offset="100%" stopColor="#c74400" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="15" stdDeviation="20" floodColor="#c74400" floodOpacity="0.15" />
      </filter>
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#e2e8f0" />
      </pattern>
    </defs>
    
    {/* Background Pattern */}
    <rect width="400" height="250" fill="url(#dots)" opacity="0.5" />

    <g className="animate-float-slow">
      {/* Main Shield Background/Shadow */}
      <path d="M200 40 L280 75 V135 C280 185 200 225 200 225 C200 225 120 185 120 135 V75 Z" fill="white" filter="url(#softShadow)" />

      {/* Inner Decorative Glass Shield Layer */}
      <path d="M200 55 L260 82 V132 C260 172 200 205 200 205 C200 205 140 172 140 132 V82 Z" fill="url(#orangeGrad1)" fillOpacity="0.05" stroke="url(#orangeGrad1)" strokeWidth="3" />

      {/* Floating Checkmark / Tick Orb */}
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <circle cx="200" cy="130" r="35" fill="url(#orangeGrad1)" filter="url(#softShadow)" />
        <circle cx="200" cy="130" r="25" fill="white" />
        <path d="M185 130 L195 140 L215 115" stroke="url(#orangeGrad1)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="200" cy="130" r="12" fill="url(#orangeGrad1)" opacity="0.1" className="animate-pulse" />
      </g>

      {/* Subtle Floating Sparkles */}
      <circle cx="270" cy="60" r="4" fill="#ff5b04" opacity="0.6" className="animate-ping-slow" />
      <circle cx="130" cy="160" r="6" fill="#c74400" opacity="0.3" />
    </g>
  </svg>
);

export const VisualFriction = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orangeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff853f" />
        <stop offset="100%" stopColor="#c74400" />
      </linearGradient>
      <filter id="softShadow2" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="20" stdDeviation="25" floodColor="#c74400" floodOpacity="0.2" />
      </filter>
      <pattern id="dots2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dots2)" opacity="0.5" />

    <g className="animate-float-slow">
      {/* Outer Ring */}
      <circle cx="200" cy="130" r="80" stroke="#f1f5f9" strokeWidth="30" filter="url(#softShadow2)" />
      {/* Inner Gradient Arc representing drop-off */}
      <path d="M120 130A80 80 0 0 1 270 90" stroke="url(#orangeGrad2)" strokeWidth="30" strokeLinecap="round" filter="url(#softShadow2)" strokeDasharray="300" strokeDashoffset="0">
        <animate attributeName="stroke-dashoffset" values="300;0" dur="3s" fill="freeze" />
      </path>
      
      {/* The Needle/Dial */}
      <g className="origin-[200px_130px] rotate-[45deg] transition-transform duration-1000">
        <circle cx="200" cy="130" r="15" fill="white" filter="url(#softShadow2)" />
        <path d="M200 130L200 65" stroke="url(#orangeGrad2)" strokeWidth="8" strokeLinecap="round" filter="url(#softShadow2)" />
      </g>
    </g>
    
    {/* Abstract UI floating elements */}
    <rect x="60" y="60" width="40" height="12" rx="6" fill="#e2e8f0" opacity="0.6" className="animate-float" style={{ animationDelay: '0.5s' }} />
    <rect x="300" y="180" width="60" height="12" rx="6" fill="#cbd5e1" opacity="0.6" className="animate-float" style={{ animationDelay: '1.5s' }} />
  </svg>
);

export const VisualFlow = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orangeGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c74400" />
        <stop offset="100%" stopColor="#ff5b04" />
      </linearGradient>
      <filter id="softShadow3" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="15" stdDeviation="20" floodColor="#c74400" floodOpacity="0.2" />
      </filter>
      <pattern id="dots3" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dots3)" opacity="0.5" />

    <g className="animate-float-slow">
      {/* Connection Lines */}
      <path d="M120 100C160 100 180 160 220 160C250 160 270 120 300 120" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 10" opacity="0.4" />
      <path d="M120 100C160 100 180 160 220 160C250 160 270 120 300 120" stroke="url(#orangeGrad3)" strokeWidth="6" strokeLinecap="round" className="animate-flow-dash" strokeDasharray="15 30" />
      
      {/* Node 1 */}
      <g className="animate-float" style={{ animationDelay: '0s' }}>
        <rect x="80" y="70" width="60" height="60" rx="20" fill="white" filter="url(#softShadow3)" />
        <circle cx="110" cy="100" r="12" fill="url(#orangeGrad3)" opacity="0.2" />
        <circle cx="110" cy="100" r="6" fill="url(#orangeGrad3)" />
      </g>

      {/* Node 2 */}
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <rect x="190" y="130" width="60" height="60" rx="30" fill="white" filter="url(#softShadow3)" />
        <path d="M210 160H230M220 150V170" stroke="url(#orangeGrad3)" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Node 3 */}
      <g className="animate-float" style={{ animationDelay: '2s' }}>
        <rect x="270" y="90" width="70" height="60" rx="20" fill="url(#orangeGrad3)" filter="url(#softShadow3)" />
        <rect x="285" y="115" width="40" height="10" rx="5" fill="white" opacity="0.8" />
      </g>
    </g>
  </svg>
);

export const VisualVideo = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orangeGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c74400" />
        <stop offset="100%" stopColor="#ff853f" />
      </linearGradient>
      <filter id="softShadow4" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="15" stdDeviation="20" floodColor="#c74400" floodOpacity="0.2" />
      </filter>
      <pattern id="dots4" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dots4)" opacity="0.5" />

    <g className="animate-float-slow">
      {/* Abstract Screen Container */}
      <rect x="70" y="50" width="260" height="150" rx="24" fill="white" filter="url(#softShadow4)" />
      <rect x="80" y="60" width="240" height="130" rx="16" fill="#f8fafc" />
      
      {/* Decorative UI inside screen */}
      <rect x="100" y="80" width="120" height="12" rx="6" fill="#e2e8f0" />
      <rect x="100" y="100" width="80" height="8" rx="4" fill="#cbd5e1" opacity="0.5" />
      
      {/* Play Button Orb */}
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <circle cx="200" cy="125" r="35" fill="url(#orangeGrad4)" filter="url(#softShadow4)" />
        <circle cx="200" cy="125" r="35" fill="white" opacity="0.1" className="animate-ping-slow" />
        <path d="M192 110V140L216 125L192 110Z" fill="white" />
      </g>
    </g>
  </svg>
);




// 1. Custom 3D Assets: Fixed transform logic and enhanced depth
export const VisualAssets = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradAssets" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff5b04" />
        <stop offset="100%" stopColor="#c74400" />
      </linearGradient>
      <pattern id="dotsAssets" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsAssets)" />
    
    {/* Wrap animation inside a separate group to avoid transform conflicts */}
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Primary 3D Shape (Cube) */}
        <path d="M0 -60 L52 -30 V30 L0 60 L-52 30 V-30 Z" fill="white" stroke="#ff5b04" strokeWidth="2.5" />
        <path d="M0 -60 V60 M0 0 L52 -30 M0 0 L-52 -30" stroke="#ff5b04" strokeWidth="1.5" opacity="0.2" />
        
        {/* Floating Technical Labels */}
        <g transform="translate(65, -45)" className="animate-float">
          <rect width="64" height="22" rx="11" fill="white" stroke="#f1f5f9" strokeWidth="1" />
          <text x="32" y="15" textAnchor="middle" fontSize="9" fontWeight="800" fill="#ff5b04" fontFamily="monospace">OBJ_01</text>
        </g>
        
        <g transform="translate(-115, 15)" className="animate-float" style={{ animationDelay: '1.5s' }}>
          <rect width="64" height="22" rx="11" fill="white" stroke="#f1f5f9" strokeWidth="1" />
          <text x="32" y="15" textAnchor="middle" fontSize="9" fontWeight="800" fill="#ff5b04" fontFamily="monospace">HIGH_RES</text>
        </g>

        {/* Core Energy Orb */}
        <circle cx="0" cy="0" r="14" fill="url(#gradAssets)" />
        <circle cx="0" cy="0" r="24" stroke="url(#gradAssets)" strokeWidth="1.5" opacity="0.2" className="animate-ping-slow" />
      </g>
    </g>
  </svg>
);

// 2. Web-Ready 3D Animations: Robust transform structure
export const VisualAnimations = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradAnim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff5b04" />
        <stop offset="100%" stopColor="#c74400" />
      </linearGradient>
      <pattern id="dotsAnim" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsAnim)" />

    <g transform="translate(200, 125)">
      <g className="animate-float">
        {/* Outer Progress Ring */}
        <circle cx="0" cy="0" r="80" stroke="#f1f5f9" strokeWidth="5" />
        <circle cx="0" cy="0" r="80" stroke="url(#gradAnim)" strokeWidth="5" strokeDasharray="502" strokeDashoffset="180" strokeLinecap="round" className="animate-spin-slow" style={{ transformOrigin: 'center' }} />
        
        {/* Playback Controls Container */}
        <rect x="-45" y="-28" width="90" height="56" rx="14" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <path d="M-8 -12 L14 0 L-8 12 V-12Z" fill="url(#gradAnim)" />
        
        {/* Floating FPS Badge */}
        <g transform="translate(50, 40)" className="animate-float-slow">
          <circle r="24" fill="white" stroke="#ff5b04" strokeWidth="1.5" />
          <text y="2" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ff5b04" fontFamily="sans-serif">60</text>
          <text y="13" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#94a3b8" fontFamily="sans-serif">FPS</text>
        </g>
      </g>
    </g>
  </svg>
);

// 3. 3D Modeling & Animations: Mesh Editor structure
export const VisualModeling = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsModel" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsModel)" />

    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Wireframe Mesh Elements */}
        <ellipse cx="0" cy="0" rx="75" ry="32" stroke="#cbd5e1" strokeWidth="1.5" />
        <ellipse cx="0" cy="0" rx="32" ry="75" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="75" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5 5" />
        
        {/* Transform Gizmo Overlay */}
        <g className="animate-float">
          <path d="M0 0 V-65 M0 0 H65 M0 0 L-45 45" stroke="#ff5b04" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="-65" r="4.5" fill="#ff5b04" />
          <circle cx="65" cy="0" r="4.5" fill="#ff5b04" />
          <circle cx="-45" cy="45" r="4.5" fill="#ff5b04" />
          <circle cx="0" cy="0" r="7" fill="white" stroke="#ff5b04" strokeWidth="2" />
        </g>

        {/* Dynamic Vertices */}
        <rect x="50" y="-38" width="7" height="7" fill="#ff5b04" className="animate-pulse" />
        <rect x="-60" y="-18" width="7" height="7" fill="#ff5b04" />
        <rect x="25" y="60" width="7" height="7" fill="#ff5b04" />
      </g>
    </g>
  </svg>
);

// 4. Website & Product Integration: Seamless code-to-3D visual
export const VisualIntegration = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsInteg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsInteg)" />

    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Code Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="110" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-18" width="70" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-1" width="130" height="9" rx="4.5" fill="#f1f5f9" />
        
        {/* The Component Asset "Jumping Out" */}
        <g transform="translate(50, 10)" className="animate-float">
          <rect x="-35" y="-35" width="70" height="70" rx="18" fill="#ff5b04" />
          <path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke="white" strokeWidth="4.5" strokeLinecap="round" />
          
          {/* Signal Link */}
          <path d="M-70 0 H-35" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="0" r="4.5" fill="#ff5b04" />
        </g>
        
        {/* Tech Labels */}
        <text x="-85" y="48" fontSize="13" fontWeight="900" fill="#cbd5e1" fontFamily="monospace">{'<Three />'}</text>
        <text x="35" y="55" fontSize="13" fontWeight="900" fill="#ff5b04" fontFamily="monospace">.glb</text>
      </g>
    </g>
  </svg>
);


// 1. UI Animations: Technical UI Blueprint
export const VisualUI = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsUI" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsUI)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Dashboard Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="60" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-18" width="110" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-1" width="90" height="9" rx="4.5" fill="#f1f5f9" />
        
        {/* Interactive Toggle "Jumping Out" */}
        <g transform="translate(50, 10)" className="animate-float">
          <rect x="-35" y="-35" width="70" height="40" rx="20" fill="#ff5b04" />
          <circle cx="15" cy="-15" r="12" fill="white" />
          {/* Signal Link */}
          <path d="M-70 -15 H-35" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="-15" r="4.5" fill="#ff5b04" />
        </g>
        
        {/* Tech Labels */}
        <text x="-85" y="48" fontSize="13" fontWeight="900" fill="#cbd5e1" fontFamily="monospace">{'<Toggle />'}</text>
        <text x="35" y="55" fontSize="13" fontWeight="900" fill="#ff5b04" fontFamily="monospace">ACTIVE</text>
      </g>
    </g>
  </svg>
);

// 2. Lottie: The "Engine" JSON Visual
export const VisualLottie = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsLottie" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsLottie)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* JSON File Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="120" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-18" width="40" height="9" rx="4.5" fill="#ff5b04" opacity="0.2" />
        <rect x="-85" y="-1" width="100" height="9" rx="4.5" fill="#f1f5f9" />
        
        {/* Play Engine "Jumping Out" */}
        <g transform="translate(50, 10)" className="animate-float">
          <circle r="35" fill="#ff5b04" />
          <path d="M-8 -12 L14 0 L-8 12 V-12Z" fill="white" />
          {/* Connection */}
          <path d="M-70 0 H-35" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="0" r="4.5" fill="#ff5b04" />
        </g>
        
        {/* Tech Labels */}
        <text x="-85" y="48" fontSize="13" fontWeight="900" fill="#cbd5e1" fontFamily="monospace">"vector":</text>
        <text x="25" y="55" fontSize="13" fontWeight="900" fill="#ff5b04" fontFamily="monospace">lottie.json</text>
      </g>
    </g>
  </svg>
);

// 3. Web Interaction: Scrolling Blueprint
export const VisualWeb = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsWeb" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsWeb)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Browser Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="130" height="40" rx="8" fill="#f8fafc" />
        <rect x="-85" y="15" width="80" height="9" rx="4.5" fill="#f1f5f9" />
        
        {/* Scroll Motion "Jumping Out" */}
        <g transform="translate(50, 20)" className="animate-float">
          <rect x="-25" y="-45" width="50" height="80" rx="25" fill="#ff5b04" />
          <rect x="-3" y="-30" width="6" height="15" rx="3" fill="white" className="animate-bounce" />
          {/* Signal Link */}
          <path d="M-70 -5 H-25" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="-5" r="4.5" fill="#ff5b04" />
        </g>
        
        {/* Tech Labels */}
        <text x="-85" y="48" fontSize="13" fontWeight="900" fill="#cbd5e1" fontFamily="monospace">window.scroll</text>
        <text x="35" y="55" fontSize="13" fontWeight="900" fill="#ff5b04" fontFamily="monospace">SMOOTH</text>
      </g>
    </g>
  </svg>
);

// 4. Developer-Ready: The Delivery Package
export const VisualDev = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsDev" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsDev)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Terminal Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="90" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-18" width="120" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-1" width="50" height="9" rx="4.5" fill="#ff5b04" opacity="0.2" />
        
        {/* Build Success "Jumping Out" */}
        <g transform="translate(50, 10)" className="animate-float">
          <rect x="-35" y="-35" width="70" height="70" rx="18" fill="#10b981" />
          <path d="M-12 0 L-2 10 L15 -10" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Signal Link */}
          <path d="M-70 0 H-35" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="0" r="4.5" fill="#10b981" />
        </g>
        
        {/* Tech Labels */}
        <text x="-85" y="48" fontSize="13" fontWeight="900" fill="#cbd5e1" fontFamily="monospace">npm install</text>
        <text x="35" y="55" fontSize="13" fontWeight="900" fill="#10b981" fontFamily="monospace">BUILD:OK</text>
      </g>
    </g>
  </svg>
);


// 1. Brand & Marketing: Profile & Social Blueprint
export const VisualBrand = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsBrand" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsBrand)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Social Feed Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <circle cx="-75" cy="-35" r="10" fill="#f1f5f9" />
        <rect x="-60" y="-38" width="50" height="6" rx="3" fill="#f1f5f9" />
        <rect x="-85" y="-15" width="130" height="40" rx="8" fill="#f8fafc" />
        <rect x="-85" y="32" width="60" height="6" rx="3" fill="#f1f5f9" opacity="0.6" />
        
        {/* Brand Emblem "Jumping Out" */}
        <g transform="translate(50, 15)" className="animate-float">
          <rect x="-35" y="-35" width="70" height="70" rx="18" fill="#ff5b04" />
          <path d="M0 -15 L4.5 -4.5 L15 0 L4.5 4.5 L0 15 L-4.5 4.5 L-15 0 L-4.5 -4.5 Z" fill="white" />
          {/* Signal Link */}
          <path d="M-70 -5 H-35" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="-5" r="4.5" fill="#ff5b04" />
        </g>
      </g>
    </g>
  </svg>
);

// 2. Website & Product Assets: UI/Dashboard Blueprint
export const VisualWebsiteProduct = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsAssets" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsAssets)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Dashboard Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="120" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-18" width="40" height="9" rx="4.5" fill="#ff5b04" opacity="0.2" />
        <rect x="-85" y="-1" width="100" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="16" width="60" height="9" rx="4.5" fill="#f1f5f9" opacity="0.5" />
        
        {/* UI Component "Jumping Out" */}
        <g transform="translate(50, 10)" className="animate-float">
          <rect x="-35" y="-35" width="70" height="70" rx="18" fill="#ff5b04" />
          <rect x="-15" y="-15" width="30" height="30" rx="4" stroke="white" strokeWidth="4" />
          <circle cx="0" cy="0" r="6" fill="white" />
          {/* Connection */}
          <path d="M-70 0 H-35" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="0" r="4.5" fill="#ff5b04" />
        </g>
      </g>
    </g>
  </svg>
);

// 3. Infographics & Newsletters: Data/Layout Blueprint
export const VisualInfo = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsInfo" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsInfo)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Newsletter Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="130" height="10" rx="5" fill="#f8fafc" />
        <rect x="-85" y="-15" width="80" height="6" rx="3" fill="#f1f5f9" />
        <rect x="-85" y="-2" width="110" height="6" rx="3" fill="#f1f5f9" />
        <rect x="-85" y="11" width="90" height="6" rx="3" fill="#f1f5f9" opacity="0.4" />
        
        {/* Chart Node "Jumping Out" */}
        <g transform="translate(50, 20)" className="animate-float">
          <rect x="-25" y="-45" width="50" height="80" rx="25" fill="#ff5b04" />
          <path d="M-10 15 V-5 M0 15 V-15 M10 15 V5" stroke="white" strokeWidth="4" strokeLinecap="round" />
          {/* Signal Link */}
          <path d="M-70 -5 H-25" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="-5" r="4.5" fill="#ff5b04" />
        </g>
      </g>
    </g>
  </svg>
);

// 4. Multi-Format Graphics: Export/Format Blueprint
export const VisualMulti = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsMulti" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsMulti)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Folder Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="90" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-18" width="120" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-1" width="60" height="9" rx="4.5" fill="#f1f5f9" opacity="0.3" />
        
        {/* Versatile Stack "Jumping Out" */}
        <g transform="translate(50, 10)" className="animate-float">
          <rect x="-35" y="-35" width="55" height="55" rx="12" fill="#ff5b04" opacity="0.4" />
          <rect x="-25" y="-25" width="60" height="60" rx="12" fill="#ff5b04" />
          <path d="M-5 15 L5 15 M0 10 L0 20" stroke="white" strokeWidth="4" strokeLinecap="round" />
          {/* Signal Link */}
          <path d="M-70 0 H-25" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="0" r="4.5" fill="#ff5b04" />
        </g>
      </g>
    </g>
  </svg>
);


// 1. Landing Pages & Corporate: High-impact layout blueprint
export const VisualLanding = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsLanding" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsLanding)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Page Structure Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-45" width="170" height="40" rx="8" fill="#f8fafc" />
        <rect x="-85" y="5" width="50" height="30" rx="6" fill="#f1f5f9" opacity="0.6" />
        <rect x="-25" y="5" width="50" height="30" rx="6" fill="#f1f5f9" opacity="0.6" />
        <rect x="35" y="5" width="50" height="30" rx="6" fill="#f1f5f9" opacity="0.6" />
        
        {/* High Impact Hero Element "Jumping Out" */}
        <g transform="translate(40, -15)" className="animate-float">
          <rect x="-45" y="-45" width="90" height="70" rx="18" fill="#ff5b04" />
          <rect x="-30" y="-15" width="60" height="6" rx="3" fill="white" opacity="0.9" />
          <rect x="-30" y="0" width="40" height="6" rx="3" fill="white" opacity="0.5" />
          {/* Signal Link */}
          <path d="M-80 0 H-45" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-80" cy="0" r="4.5" fill="#ff5b04" />
        </g>
      </g>
    </g>
  </svg>
);

// 2. Design & Frontend: Technical Component Blueprint
export const VisualFrontend = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsFront" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsFront)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Code Editor Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-35" width="120" height="9" rx="4.5" fill="#f1f5f9" />
        <rect x="-85" y="-18" width="80" height="9" rx="4.5" fill="#ff5b04" opacity="0.2" />
        <rect x="-85" y="-1" width="100" height="9" rx="4.5" fill="#f1f5f9" />
        
        {/* React/Component Logic "Jumping Out" */}
        <g transform="translate(50, 10)" className="animate-float">
          <rect x="-35" y="-35" width="70" height="70" rx="18" fill="#ff5b04" />
          <path d="M-15 -10 L0 5 L15 -10" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M-15 10 L0 -5 L15 10" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          {/* Connection */}
          <path d="M-70 0 H-35" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-70" cy="0" r="4.5" fill="#ff5b04" />
        </g>
      </g>
    </g>
  </svg>
);

// 3. SEO & AI: Optimization Spotlight Blueprint
export const VisualSEO = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsSEO" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsSEO)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Indexing Viewport */}
        <rect x="-100" y="-65" width="200" height="130" rx="18" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <circle cx="-60" cy="-25" r="15" stroke="#f1f5f9" strokeWidth="2" />
        <circle cx="0" cy="-25" r="15" stroke="#f1f5f9" strokeWidth="2" />
        <circle cx="60" cy="-25" r="15" stroke="#f1f5f9" strokeWidth="2" />
        <rect x="-80" y="15" width="160" height="8" rx="4" fill="#f8fafc" />
        
        {/* Discovery "Jumping Out" */}
        <g transform="translate(0, -25)" className="animate-float">
          <circle r="35" fill="#ff5b04" />
          <circle r="15" stroke="white" strokeWidth="3" opacity="0.4" />
          <path d="M12 12 L22 22" stroke="white" strokeWidth="4" strokeLinecap="round" />
          {/* Signal Pulse */}
          <circle r="45" stroke="#ff5b04" strokeWidth="1" opacity="0.2" className="animate-ping-slow" />
        </g>
      </g>
    </g>
  </svg>
);

// 4. Responsive Experience: Multi-Device Blueprint
export const VisualResponsive = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dotsResp" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
    <rect width="400" height="250" fill="url(#dotsResp)" />
    <g transform="translate(200, 125)">
      <g className="animate-float-slow">
        {/* Desktop Viewport Base */}
        <rect x="-100" y="-60" width="160" height="100" rx="12" fill="white" stroke="#f1f5f9" strokeWidth="1.5" />
        <rect x="-85" y="-45" width="130" height="10" rx="5" fill="#f8fafc" />
        <rect x="-85" y="-25" width="60" height="40" rx="6" fill="#f1f5f9" opacity="0.4" />
        
        {/* Mobile Device "Jumping Out" */}
        <g transform="translate(60, 15)" className="animate-float">
          <rect x="-25" y="-45" width="50" height="90" rx="14" fill="#ff5b04" />
          <rect x="-15" y="-30" width="30" height="60" rx="4" fill="white" opacity="0.2" />
          <circle cx="0" cy="35" r="3" fill="white" opacity="0.5" />
          {/* Connection */}
          <path d="M-60 -10 H-25" stroke="#ff5b04" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />
          <circle cx="-60" cy="-10" r="4.5" fill="#ff5b04" />
        </g>
      </g>
    </g>
  </svg>
);



// 1. UX/UI: Overlapping Prisms of Design
export const VisualUX = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="animate-float-slow">
      <circle cx="200" cy="150" r="80" fill="#ff5b04" fillOpacity="0.03" />
      {/* Translucent Glass Layers */}
      <rect x="140" y="100" width="120" height="120" rx="24" fill="white" fillOpacity="0.6" stroke="#f1f5f9" strokeWidth="1" className="backdrop-blur-md" />
      <rect x="110" y="70" width="120" height="120" rx="24" fill="white" fillOpacity="0.4" stroke="#f1f5f9" strokeWidth="1" className="backdrop-blur-sm" />
      {/* Floating Interface "Seeds" */}
      <circle cx="200" cy="130" r="30" fill="#ff5b04" className="animate-pulse" />
      <rect x="150" y="160" width="60" height="8" rx="4" fill="#e2e8f0" />
      <rect x="150" y="175" width="40" height="8" rx="4" fill="#ff5b04" fillOpacity="0.2" />
    </g>
  </svg>
);

// 2. UI Development: The Geometric Nexus
export const VisualCode = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="animate-float">
      {/* Central Connector Lines */}
      <path d="M120 150 H280" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="8 8" />
      <path d="M200 70 V230" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="8 8" />
      
      {/* Floating Logic Nodes */}
      <rect x="175" y="125" width="50" height="50" rx="12" fill="#ff5b04" className="animate-pulse" />
      <rect x="250" y="140" width="20" height="20" rx="6" fill="white" stroke="#ff5b04" strokeWidth="2" />
      <rect x="130" y="140" width="20" height="20" rx="6" fill="white" stroke="#ff5b04" strokeWidth="2" />
      <rect x="190" y="80" width="20" height="20" rx="6" fill="white" stroke="#ff5b04" strokeWidth="2" />
      <rect x="190" y="200" width="20" height="20" rx="6" fill="white" stroke="#ff5b04" strokeWidth="2" />
    </g>
  </svg>
);

// 3. Idea to MVP: Orbital Growth
export const VisualMVP = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="animate-float-slow">
      {/* Orbital Path */}
      <ellipse cx="200" cy="150" rx="100" ry="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" style={{ transformOrigin: '200px 150px' }} />
      <ellipse cx="200" cy="150" rx="40" ry="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" style={{ transformOrigin: '200px 150px', animationDirection: 'reverse' }} />
      
      {/* The "Idea" Core */}
      <circle cx="200" cy="150" r="45" fill="white" stroke="#f1f5f9" strokeWidth="1" />
      <path d="M200 130 L212 145 L227 150 L212 155 L200 170 L188 155 L173 150 L188 145 Z" fill="#ff5b04" />
      <circle cx="200" cy="150" r="60" stroke="#ff5b04" strokeWidth="1" opacity="0.1" className="animate-ping-slow" />
    </g>
  </svg>
);

// 4. Mobile: Liquid Glass Stack
export const VisualMobile = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="animate-float">
      {/* Vertical Responsive Planes */}
      <rect x="160" y="60" width="80" height="180" rx="20" fill="white" stroke="#f1f5f9" strokeWidth="1" className="backdrop-blur-md" />
      <rect x="180" y="80" width="80" height="180" rx="20" fill="white" fillOpacity="0.4" stroke="#f1f5f9" strokeWidth="1" className="backdrop-blur-sm" />
      
      {/* Interactive Detail */}
      <rect x="175" y="100" width="50" height="4" rx="2" fill="#ff5b04" opacity="0.4" />
      <circle cx="200" cy="210" r="10" fill="#ff5b04" />
      <circle cx="200" cy="210" r="18" stroke="#ff5b04" strokeWidth="1" opacity="0.2" className="animate-pulse" />
    </g>
  </svg>
);