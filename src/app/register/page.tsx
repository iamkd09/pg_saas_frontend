import { RegisterForm } from "@/components/auth/register-form";
import { FloatingOrbs } from "@/components/auth/floating-orbs";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08),_transparent_50%)]" />
        <FloatingOrbs variant="light" />
      </div>
      <div className="relative z-10 w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
