export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-yellow rounded-lg flex items-center justify-center">
              <span className="text-brand-black font-bold text-lg">H</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Handyman<span className="text-brand-yellow">Pro</span>
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
