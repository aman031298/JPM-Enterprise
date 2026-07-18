import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";

const jobOpenings = [
  { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Compliance Domain Expert", department: "Product", location: "Bengaluru, IN", type: "Full-time" },
  { title: "Enterprise Account Executive", department: "Sales", location: "Remote", type: "Full-time" },
  { title: "Customer Success Manager", department: "Customer Success", location: "Remote", type: "Full-time" }
];

export function Careers() {
  return (
    <AnimatedSection id="careers" className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading eyebrow="Careers" title="Help us build the future of compliance." align="left" className="mx-0 text-left" />
        <div className="mt-8 divide-y divide-line rounded-2xl border border-line">
          {jobOpenings.map((job) => (
            <div key={job.title} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{job.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-ink/55">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                  <span>{job.type}</span>
                </div>
              </div>
              <a href="mailto:careers@jpm-enterprise.demo">
                <Button variant="outline" size="sm">
                  Apply
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink/55">
          Don't see a fit? Send your resume to{" "}
          <a href="mailto:careers@jpm-enterprise.demo" className="font-semibold text-accent-600 hover:text-accent-700">
            careers@jpm-enterprise.demo
          </a>
          .
        </p>
      </div>
    </AnimatedSection>
  );
}
