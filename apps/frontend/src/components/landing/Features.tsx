import { motion } from "framer-motion";
import { Users, Workflow, CheckCircle2, CalendarDays, Bell, BarChart3, LayoutDashboard, History, Cloud, Plug } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { platformFeatures } from "@/data/landing-content";

const featureIcons: Record<string, typeof Users> = {
  Users,
  Workflow,
  CheckCircle2,
  CalendarDays,
  Bell,
  BarChart3,
  LayoutDashboard,
  History,
  Cloud,
  Plug
};

export function Features() {
  return (
    <AnimatedSection id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Platform" title="Enterprise-grade platform features." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {platformFeatures.map((feature, index) => {
            const Icon = featureIcons[feature.icon];
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="rounded-xl border border-line bg-white p-5"
              >
                <Icon className="h-5 w-5 text-accent-600" />
                <h3 className="mt-3 text-sm font-semibold text-ink">{feature.name}</h3>
                <p className="mt-1.5 text-xs text-ink/55">{feature.summary}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
