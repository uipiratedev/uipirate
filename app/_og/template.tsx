export interface OGTemplateProps {
  badge: string;
  title: string;
  description: string;
}

export function OGTemplate({ badge, title, description }: OGTemplateProps) {
  const fontSize = title.length > 45 ? 48 : title.length > 28 ? 58 : 68;

  return (
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        backgroundColor: "#090910",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orange top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "#FF5B04",
        }}
      />

      {/* Decorative orange radial glow — top right */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,91,4,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Decorative subtle glow — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,91,4,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Main content column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 80px 48px 80px",
          width: "1200px",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              backgroundColor: "#FF5B04",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: "22px" }}>⚓</span>
          </div>
          <span
            style={{
              color: "white",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            UI PIRATE
          </span>
        </div>

        {/* Middle: badge + title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Badge pill */}
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              alignItems: "center",
              backgroundColor: "rgba(255,91,4,0.12)",
              border: "1px solid rgba(255,91,4,0.35)",
              borderRadius: "100px",
              padding: "8px 22px",
            }}
          >
            <span style={{ color: "#FF5B04", fontSize: "15px", fontWeight: 600 }}>
              {badge}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              color: "white",
              fontSize: `${fontSize}px`,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "960px",
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "20px",
              lineHeight: 1.55,
              maxWidth: "820px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom stats strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "36px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "7px" }}>
              <span style={{ color: "#FF5B04", fontSize: "20px", fontWeight: 700 }}>9+</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Years</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "7px" }}>
              <span style={{ color: "#FF5B04", fontSize: "20px", fontWeight: 700 }}>50+</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Products Shipped</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "7px" }}>
              <span style={{ color: "#FF5B04", fontSize: "20px", fontWeight: 700 }}>EST/PST</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Timezone Friendly</span>
            </div>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>
            uipirate.com
          </span>
        </div>
      </div>
    </div>
  );
}
