"use client";
import React from "react";

export default function VideoBackground({ children }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (optional dark layer for contrast) */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        {children}
      </div>
    </div>
  );
}
