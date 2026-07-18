import { CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { Card } from "@/components/ui/card";

const highlights = [
  "Purpose-built for statutory and regulatory compliance",
  "Role-based access across 8 enterprise roles",
  "API-ready and cloud-native from day one",
  "Trusted by 120+ enterprise customers"
];

export function About() {
  return (
    <AnimatedSection id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">Why JPM Enterprises</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Built by compliance people, for compliance people.
            </h2>
            <p className="mt-4 text-base text-ink/60">
              We started JPM Enterprises after watching compliance teams manage statutory obligations across
              disconnected spreadsheets, email threads, and shared drives. Our mission is simple: give every
              regulated organization one system of record for compliance, audit, risk, and vendor management — built
              to scale from a single company to a multi-entity enterprise.
            </p>
            <ul className="mt-6 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">Mission</p>
              <p className="mt-2 text-sm text-ink/70">
                Make regulatory compliance a system, not a scramble — for every organization, in every industry.
              </p>
            </Card>
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">Vision</p>
              <p className="mt-2 text-sm text-ink/70">
                A world where no enterprise misses a filing, an audit, or a renewal because information was scattered
                across disconnected tools.
              </p>
            </Card>
            <Card className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">Competitive advantage</p>
              <p className="mt-2 text-sm text-ink/70">
                Unlike generic project or GRC tools, JPM Enterprises models compliance-native concepts directly —
                statutory categories, expiry-aware documents, audit checklists, and risk matrices — out of the box.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
