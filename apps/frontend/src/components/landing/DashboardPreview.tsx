import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const heatmapCells = [
  "bg-emerald-100", "bg-emerald-100", "bg-amber-100", "bg-amber-200", "bg-rose-200",
  "bg-emerald-100", "bg-amber-100", "bg-amber-200", "bg-rose-200", "bg-rose-300",
  "bg-amber-100", "bg-amber-200", "bg-orange-200", "bg-rose-200", "bg-rose-300",
  "bg-amber-200", "bg-orange-200", "bg-rose-200", "bg-rose-300", "bg-rose-300",
  "bg-orange-200", "bg-rose-200", "bg-rose-300", "bg-rose-300", "bg-rose-300"
];

export function DashboardPreview() {
  return (
    <AnimatedSection id="dashboard-preview" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">Dashboard</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Everything your team needs, at a glance.
            </h2>
            <p className="mt-4 text-base text-ink/60">
              KPI cards, upcoming and overdue compliances, a risk heatmap, charts, notifications, and recent activity
              — one dashboard that opens the moment you sign in.
            </p>
            <ul className="mt-6 space-y-3">
              {["Real-time compliance status", "Upcoming due dates surfaced automatically", "Visual risk heatmap", "Role-aware notifications"].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="#contact" className="mt-6 inline-block">
              <Button>
                See it live
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-3">
              <div className="rounded-xl border border-line bg-mist p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-4 shadow-panel">
                    <p className="text-xs text-ink/50">Compliance Score</p>
                    <p className="mt-1 text-2xl font-bold text-ink">89%</p>
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow-panel">
                    <p className="text-xs text-ink/50">Active Audits</p>
                    <p className="mt-1 text-2xl font-bold text-ink">2</p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-white p-4 shadow-panel">
                  <p className="text-xs text-ink/50">Risk Heatmap</p>
                  <div className="mt-3 grid grid-cols-5 gap-1">
                    {heatmapCells.map((tone, index) => (
                      <div key={index} className={`h-4 rounded-sm ${tone}`} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
