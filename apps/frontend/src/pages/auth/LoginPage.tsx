import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import type { AuthPayload, AuthSession } from "@shared/domain";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const { register, handleSubmit, formState } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "anika.rao@jpm-enterprise.demo",
      password: "demo123"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: AuthPayload) => api.post<AuthSession>("/auth/login", values),
    onSuccess: (session) => {
      setSession(session);
      const redirectTo = searchParams.get("redirect") ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    }
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-mist p-6 dark:bg-[#0b0f19]">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-ink/60 hover:text-ink dark:text-slate-400 dark:hover:text-white sm:self-center"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <Card className="grid w-full max-w-5xl overflow-hidden p-0 shadow-panel-lg md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden bg-ink p-8 text-white md:p-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(94,128,234,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(42,91,215,0.3), transparent 45%)"
            }}
          />
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <ShieldCheck className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/50">Compliance Management Platform</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">JPM Enterprise</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              Enterprise compliance workspace with dashboard analytics, master data modules, document expiry
              tracking, audit evidence, risk management, vendor oversight, and reporting flows.
            </p>
            <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Demo credentials</p>
              <p className="mt-2 font-mono text-sm text-white/90">anika.rao@jpm-enterprise.demo</p>
              <p className="font-mono text-sm text-white/90">demo123</p>
            </div>
          </div>
        </div>
        <div className="bg-panel p-8 dark:bg-transparent md:p-12">
          <h2 className="text-2xl font-bold text-ink dark:text-white">Sign in</h2>
          <p className="mt-1.5 text-sm text-ink/55 dark:text-slate-400">Enter your credentials to access the workspace.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <label className="block">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {formState.errors.email && <span className="mt-1.5 block text-sm text-rose-600">{formState.errors.email.message}</span>}
            </label>
            <label className="block">
              <Label>Password</Label>
              <Input type="password" {...register("password")} />
              {formState.errors.password && <span className="mt-1.5 block text-sm text-rose-600">{formState.errors.password.message}</span>}
            </label>
            {mutation.isError && <p className="text-sm text-rose-600">{mutation.error.message}</p>}
            <Button className="w-full" size="lg" disabled={mutation.isPending} type="submit">
              {mutation.isPending ? "Signing in..." : "Enter workspace"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
