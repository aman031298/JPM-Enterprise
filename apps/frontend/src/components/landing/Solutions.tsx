import { motion } from "framer-motion";
import { Factory, HeartPulse, ShoppingBag, Laptop, Truck, HardHat, GraduationCap, Landmark } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { solutions } from "@/data/landing-content";

const solutionIcons: Record<string, typeof Factory> = {
  manufacturing: Factory,
  healthcare: HeartPulse,
  retail: ShoppingBag,
  it: Laptop,
  logistics: Truck,
  construction: HardHat,
  education: GraduationCap,
  government: Landmark
};

export function Solutions() {
  return (
    <AnimatedSection id="solutions" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Solutions" title="Industry-specific compliance solutions." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, index) => {
            const Icon = solutionIcons[solution.id];
            return (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-xl border border-line p-5 transition hover:-translate-y-1 hover:border-accent-200 hover:shadow-panel-lg"
              >
                <Icon className="h-6 w-6 text-accent-600" />
                <h3 className="mt-3 text-sm font-semibold text-ink">{solution.name}</h3>
                <p className="mt-1.5 text-xs text-ink/55">{solution.summary}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
