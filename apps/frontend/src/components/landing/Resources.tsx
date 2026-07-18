import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { Badge } from "@/components/ui/badge";
import { resources } from "@/data/landing-content";

export function Resources() {
  return (
    <AnimatedSection id="resources" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Latest Resources" title="Blogs, news, guides, and release notes." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="flex flex-col rounded-xl border border-line p-5 transition hover:-translate-y-1 hover:border-accent-200 hover:shadow-panel-lg"
            >
              <Badge icon={false}>{item.type}</Badge>
              <h3 className="mt-3 text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 flex-1 text-xs text-ink/55">{item.excerpt}</p>
              <p className="mt-4 text-[11px] font-medium text-ink/40">
                {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
