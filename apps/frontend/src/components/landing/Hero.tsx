import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SearchBar } from "./SearchBar";
import { customerLogos } from "@/data/landing-content";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink pt-16 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(94,128,234,0.35), transparent 45%), radial-gradient(circle at 85% 75%, rgba(42,91,215,0.3), transparent 45%)"
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70">
            <ShieldCheck className="h-3.5 w-3.5" />
            Enterprise Compliance Platform
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Compliance, audit, and risk — finally in one place.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            JPM Enterprises helps regulated organizations track statutory obligations, run audits, manage risk, and
            monitor vendors — without spreadsheets, missed deadlines, or audit-week panic.
          </p>

          <div className="mt-8 flex justify-center">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#contact">
              <Button size="lg">
                Request Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  <Play className="h-4 w-4" />
                  Watch Demo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>See JPM Enterprises in action</DialogTitle>
                <div className="flex aspect-video items-center justify-center rounded-xl bg-mist text-sm text-ink/50">
                  Product walkthrough video
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-white/40">
            Trusted by compliance teams at
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-white/50">
            {customerLogos.map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
