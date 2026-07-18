import { motion } from "framer-motion";
import { Scale, Factory, Wallet, Leaf, Building2, TreePine, HandCoins, Gavel } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { complianceDomains } from "@/data/landing-content";

const domainIcons: Record<string, typeof Scale> = {
  labour: Scale,
  factory: Factory,
  payroll: Wallet,
  esg: Leaf,
  corporate: Building2,
  environmental: TreePine,
  vendor: HandCoins,
  legal: Gavel
};

export function Domains() {
  return (
    <AnimatedSection id="domains" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Popular Compliance Domains" title="Coverage across every compliance discipline." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {complianceDomains.map((domain, index) => {
            const Icon = domainIcons[domain.id];
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group rounded-xl border border-line bg-mist/40 p-5 transition hover:-translate-y-1 hover:border-accent-200 hover:bg-white hover:shadow-panel-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600 transition group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink">{domain.name}</h3>
                <p className="mt-1.5 text-xs text-ink/55">{domain.summary}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
