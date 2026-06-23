import { BrandPanel } from "@/components/auth/brand-panel";
import { FloatingOrbs } from "@/components/auth/floating-orbs";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 lg:left-[52%] xl:left-[55%]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.06),_transparent_50%)]" />
        <FloatingOrbs variant="light" />
      </div>

      <BrandPanel />

      <main className="relative z-10 flex flex-1 items-center justify-center">
        <LoginForm />
      </main>
    </div>
  );
}
