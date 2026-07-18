import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { api } from "@/lib/api";
import { officeLocations } from "@/data/landing-content";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Enter your company name"),
  message: z.string().min(10, "Tell us a bit more (10+ characters)")
});

type ContactValues = z.infer<typeof contactSchema>;

export function Contact() {
  const { register, handleSubmit, formState, reset } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema)
  });
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: ContactValues) {
    setStatus("pending");
    setError(null);
    try {
      await api.post("/leads", { ...values, type: "Contact" });
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <AnimatedSection id="contact" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Contact" title="Let's talk compliance." align="left" className="mx-0 text-left" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-ink/70">
                <Mail className="h-4 w-4 text-accent-600" />
                sales@jpm-enterprise.demo
              </div>
              <div className="flex items-center gap-3 text-sm text-ink/70">
                <Phone className="h-4 w-4 text-accent-600" />
                +91 80 4567 1200
              </div>
              <div className="flex items-center gap-3 text-sm text-ink/70">
                <Clock className="h-4 w-4 text-accent-600" />
                Mon–Fri, 9:00 AM – 6:00 PM IST
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {officeLocations.map((office) => (
                <Card key={office.city}>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                    <div>
                      <p className="text-sm font-semibold text-ink">{office.city}</p>
                      <p className="mt-1 text-xs text-ink/55">{office.address}</p>
                      <p className="mt-1 text-xs text-ink/55">{office.phone}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-line">
              <div className="flex h-40 items-center justify-center bg-mist text-sm text-ink/40">Map view</div>
            </div>
          </div>

          <Card>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <p className="mt-4 text-lg font-semibold text-ink">Thanks for reaching out</p>
                <p className="mt-2 text-sm text-ink/60">A member of our team will be in touch within one business day.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <label className="block">
                  <Label>Full name</Label>
                  <Input {...register("name")} placeholder="Anika Rao" />
                  {formState.errors.name && <p className="mt-1.5 text-sm text-rose-600">{formState.errors.name.message}</p>}
                </label>
                <label className="block">
                  <Label>Work email</Label>
                  <Input type="email" {...register("email")} placeholder="anika.rao@company.com" />
                  {formState.errors.email && <p className="mt-1.5 text-sm text-rose-600">{formState.errors.email.message}</p>}
                </label>
                <label className="block">
                  <Label>Company</Label>
                  <Input {...register("company")} placeholder="Your company" />
                  {formState.errors.company && <p className="mt-1.5 text-sm text-rose-600">{formState.errors.company.message}</p>}
                </label>
                <label className="block">
                  <Label>Message</Label>
                  <textarea
                    {...register("message")}
                    placeholder="Tell us about your compliance requirements..."
                    className="min-h-32 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-accent focus:ring-4 focus:ring-accent-100"
                  />
                  {formState.errors.message && <p className="mt-1.5 text-sm text-rose-600">{formState.errors.message.message}</p>}
                </label>
                {status === "error" && <p className="text-sm text-rose-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={status === "pending"}>
                  {status === "pending" ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </AnimatedSection>
  );
}
