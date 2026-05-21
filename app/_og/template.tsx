export interface OGTemplateProps {
  badge: string;
  /** Black portion of the heading */
  title: string;
  /** Orange-highlighted portion appended after title */
  titleHighlight?: string;
  description: string;
}

export function OGTemplate({ badge, title, titleHighlight, description }: OGTemplateProps) {
  const full = title + (titleHighlight ? " " + titleHighlight : "");
  const fontSize = full.length > 46 ? 52 : full.length > 30 ? 62 : 72;

  return (
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        backgroundColor: "#FAFAFA",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle 40px grid — matches the hero section exactly */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial vignette — fades the grid toward center so text stays clean */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(250,250,250,0.92) 0%, transparent 100%)",
        }}
      />

      {/* Bottom fade — matches hero gradient-to-top overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "180px",
          background: "linear-gradient(to top, rgba(250,250,250,1) 0%, transparent 100%)",
        }}
      />

      {/* Brand-orange top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "3px",
          backgroundColor: "#FF5B04",
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 80px 44px",
          width: "1200px",
          position: "relative",
        }}
      >
        {/* Logo — top-left, matching the navbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: "flex-start" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#FF5B04",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: "17px" }}>⚓</span>
          </div>
          <span style={{ color: "#000", fontSize: "17px", fontWeight: 700, letterSpacing: "0.1em" }}>
            UI PIRATE
          </span>
        </div>

        {/* Centre block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "22px" }}>

          {/* Badge — white glass pill with mono uppercase, matching the hero badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: "8px 18px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <span
              style={{
                color: "#000",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.09em",
                fontFamily: "monospace",
              }}
            >
              {badge.toUpperCase()}
            </span>
          </div>

          {/* Headline — black + orange highlight, matching hero typography */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              fontSize: `${fontSize}px`,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              textAlign: "center",
              maxWidth: "980px",
            }}
          >
            <span style={{ color: "#000" }}>{title}</span>
            {titleHighlight && (
              <span style={{ color: "#FF5B04" }}>&nbsp;{titleHighlight}</span>
            )}
          </div>

          {/* Description */}
          <div
            style={{
              color: "rgba(0,0,0,0.5)",
              fontSize: "20px",
              lineHeight: 1.55,
              textAlign: "center",
              maxWidth: "720px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            paddingTop: "18px",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ color: "#FF5B04", fontSize: "19px", fontWeight: 700 }}>9+</span>
              <span style={{ color: "rgba(0,0,0,0.4)", fontSize: "14px" }}>Years</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ color: "#FF5B04", fontSize: "19px", fontWeight: 700 }}>50+</span>
              <span style={{ color: "rgba(0,0,0,0.4)", fontSize: "14px" }}>Products Shipped</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ color: "#FF5B04", fontSize: "19px", fontWeight: 700 }}>EST/PST</span>
              <span style={{ color: "rgba(0,0,0,0.4)", fontSize: "14px" }}>Timezone Friendly</span>
            </div>
          </div>
          <span style={{ color: "rgba(0,0,0,0.3)", fontSize: "15px", fontWeight: 500, letterSpacing: "0.04em" }}>
            uipirate.com
          </span>
        </div>
      </div>
    </div>
  );
}
