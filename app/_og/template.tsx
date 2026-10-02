export interface OGTemplateProps {
  badge: string;
  /** Black portion of the heading */
  title: string;
  /** Orange-highlighted portion appended after title */
  titleHighlight?: string;
  description: string;
}

export function OGTemplate({
  badge,
  title,
  titleHighlight,
  description,
}: OGTemplateProps) {
  // Match hero font sizes: xl=61px, 2xl=74px — scale by title length
  const fontSize = title.length > 22 ? 64 : title.length > 16 ? 72 : 80;

  return (
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        backgroundColor: "#FFFFFF",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid — copy-paste of the hero: rgba(0,0,0,0.05), 40px, covers entire area uniformly */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Bottom fade — exact two-layer gradient from the hero's "gentle-mist" overlay:
           layer 1: solid white → transparent at 10%
           layer 2: solid white → transparent at 35%
           Combined: strong white at base, gradually revealing the grid above */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(to top, rgba(250,250,250,1), transparent 0%)," +
            "linear-gradient(to top, rgba(250,250,250,1) 0%, transparent 0%)",
        }}
      />

      {/* Brand-orange top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: "#FF5B04",
        }}
      />

      {/* Logo — absolutely pinned to top-left, exactly like the navbar */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "72px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="UI Pirate Logo"
          src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1766234689/logo_lcn2cq.png"
          style={{
            width: "56px",
            height: "56px",
            objectFit: "contain",
            display: "block",
          }}
        />
        <span
          style={{
            color: "#000",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: 1,
            marginTop: "-16px",
          }}
        >
          UI Pirate
        </span>
      </div>

      {/* ── Main content — centred vertically now that logo is out of flow ── */}
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
        {/* spacer so centre block pushes down past the logo */}
        <div style={{ display: "flex", height: "0px" }} />

        {/* Centre block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "22px",
          }}
        >
          {/* Badge — matches the GlassSurface hero badge exactly:
               white solid background, thin border, monospace uppercase */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(0,0,0,0.09)",
              borderRadius: "12px",
              padding: "10px 20px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
            }}
          >
            {/* Orange dot — adds brand color, echoes hero orange accents */}
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#FF5B04",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "#000",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                fontFamily: "monospace",
              }}
            >
              {badge.toUpperCase()}
            </span>
          </div>

          {/* Headline — mirrors the hero exactly:
               Line 1: black text
               Line 2: orange text WITH orange-400/30 background box (the "Convert," treatment) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {/* Line 1 — black, same as "Designing AI-Driven SaaS Products That" */}
            <span style={{ color: "#000", fontSize: `${fontSize}px` }}>
              {title}
            </span>

            {/* Line 2 — orange with highlight bg, same as "Convert, Scale & Ship Faster" */}
            {titleHighlight && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span
                  style={{
                    color: "#FF5B04",
                    fontSize: `${fontSize}px`,
                    backgroundColor: "rgba(251,146,60,0.25)",
                    borderRadius: "8px",
                    padding: "2px 14px",
                  }}
                >
                  {titleHighlight}
                </span>
              </div>
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
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "6px" }}
            >
              <span
                style={{ color: "#FF5B04", fontSize: "19px", fontWeight: 700 }}
              >
                9+
              </span>
              <span style={{ color: "rgba(0,0,0,0.4)", fontSize: "14px" }}>
                Years
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "6px" }}
            >
              <span
                style={{ color: "#FF5B04", fontSize: "19px", fontWeight: 700 }}
              >
                50+
              </span>
              <span style={{ color: "rgba(0,0,0,0.4)", fontSize: "14px" }}>
                Products Shipped
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "6px" }}
            >
              <span
                style={{ color: "#FF5B04", fontSize: "19px", fontWeight: 700 }}
              >
                EST/PST
              </span>
              <span style={{ color: "rgba(0,0,0,0.4)", fontSize: "14px" }}>
                Timezone Friendly
              </span>
            </div>
          </div>
          <span
            style={{
              color: "rgba(0,0,0,0.3)",
              fontSize: "15px",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            uipirate.com
          </span>
        </div>
      </div>
    </div>
  );
}
