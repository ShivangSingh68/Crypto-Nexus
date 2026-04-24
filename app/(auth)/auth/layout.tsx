import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[rgba(0,245,255,0.04)] blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[rgba(203,166,247,0.05)] blur-3xl animate-float-slow" />
        <div className="absolute top-10 right-10 w-16 h-16 border border-[rgba(0,245,255,0.15)] rounded-2xl rotate-12 animate-float" />
        <div className="absolute bottom-10 left-10 w-10 h-10 border border-[rgba(203,166,247,0.2)] rounded-xl rotate-45 animate-float-slow" />
      </div>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}