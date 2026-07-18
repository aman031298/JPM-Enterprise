import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedSection({
  children,
  className,
  id,
  delay = 0
}: PropsWithChildren<{ className?: string; id?: string; delay?: number }>) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn("scroll-mt-16", className)}
    >
      {children}
    </motion.section>
  );
}
