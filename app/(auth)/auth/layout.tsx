export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: 'calc(100dvh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      {/* Background decorations — contained within layout */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[rgba(0,245,255,0.04)] blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[rgba(203,166,247,0.05)] blur-3xl animate-float-slow" />
        <div className="absolute top-8 right-12 w-12 h-12 border border-[rgba(0,245,255,0.15)] rounded-2xl rotate-12 animate-float" />
        <div className="absolute bottom-8 left-10 w-8 h-8 border border-[rgba(203,166,247,0.2)] rounded-xl rotate-45 animate-float-slow" />
      </div>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}