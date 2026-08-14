"use client";

export default function ThreeRingPlaceholder() {
  return (
    <div 
      className="w-full h-full flex items-center justify-center pointer-events-none"
      style={{ minHeight: "inherit" }}
    >
      {/* Sleek, minimal loading spinner matching the Indigo theme */}
      <div 
        className="w-16 h-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500/80 animate-spin"
        style={{ animationDuration: "0.8s" }}
      />
    </div>
  );
}
