import { motion } from "framer-motion";
import { ClipboardCheck, FileSearch, ShieldAlert, Handshake, FileText, CalendarDays, BarChart3, Workflow, ArrowRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { Card } from "@/components/ui/card";
import { products } from "@/data/landing-content";

const productIcons: Record<string, typeof ClipboardCheck> = {
  ClipboardCheck,
  FileSearch,
  ShieldAlert,
  Handshake,
  FileText,
  CalendarDays,
  BarChart3,
  Workflow
};

export function Products() {
  return (
    <AnimatedSection id="products" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Products" title="Everything compliance touches, one platform." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => {
            const Icon = productIcons[product.icon];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="flex h-full flex-col transition hover:-translate-y-1 hover:shadow-panel-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">{product.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink/60">{product.summary}</p>
                  <a href="#contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
