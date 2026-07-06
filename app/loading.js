export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0D0D0D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      aria-label="Loading..."
      role="status"
    >
      {/* Pulsing dot cluster */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: i === 0 ? "#FF3B00" : "rgba(239,239,233,0.25)",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
