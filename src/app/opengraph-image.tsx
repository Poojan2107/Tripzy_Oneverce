import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Travebie — #1 AI Travel Companion & Itinerary Planner for India";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0A1118 0%, #152230 50%, #0A1118 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow ambient background highlights */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,182,61,0.25) 0%, rgba(244,182,61,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(24,182,201,0.2) 0%, rgba(24,182,201,0) 70%)",
          }}
        />

        {/* Top Header Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              background: "rgba(244,182,61,0.15)",
              border: "1px solid rgba(244,182,61,0.4)",
              color: "#F4B63D",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Atlas Vivant · India
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            12 Living Chapters · AI Planner
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "950px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Explore India Chapter by Chapter with AI
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "rgba(255, 255, 255, 0.75)",
              lineHeight: 1.4,
              fontWeight: 400,
            }}
          >
            Bespoke day-wise itineraries, local secrets, photography spots, and real-time INR budgets.
          </div>
        </div>

        {/* Footer Brand bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "28px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              travebie<span style={{ color: "#F4B63D" }}>.com</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "32px",
              fontSize: "18px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 600,
            }}
          >
            <span>Varanasi</span>
            <span>·</span>
            <span>Kerala</span>
            <span>·</span>
            <span>Ladakh</span>
            <span>·</span>
            <span>Rajasthan</span>
            <span>·</span>
            <span>Goa</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
