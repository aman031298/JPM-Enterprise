import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { Card } from "@/components/ui/card";
import { stats, testimonials, customerLogos, successStories } from "@/data/landing-content";

export function Testimonials() {
  return (
    <AnimatedSection id="customers" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Customer Success" title="Compliance teams trust JPM Enterprises." />

        <div className="mt-12 grid grid-cols-2 gap-8 border-y border-line py-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-ink sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-ink/55">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-ink/45">
          {customerLogos.map((logo) => (
            <span key={logo}>{logo}</span>
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="h-full">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-ink/75">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-5 text-sm font-semibold text-ink">{testimonial.name}</p>
                <p className="text-xs text-ink/50">{testimonial.title}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {successStories.map((story) => (
            <div key={story.company} className="rounded-xl border border-line bg-mist/40 p-6 text-center">
              <TrendingUp className="mx-auto h-5 w-5 text-accent-600" />
              <p className="mt-3 text-2xl font-bold text-ink">{story.metric}</p>
              <p className="mt-1 text-xs text-ink/55">{story.detail}</p>
              <p className="mt-3 text-xs font-semibold text-ink/70">{story.company}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
