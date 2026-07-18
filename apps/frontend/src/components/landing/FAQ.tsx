import { AnimatedSection } from "./AnimatedSection";
import { SectionHeading } from "./SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/data/landing-content";

export function FAQ() {
  return (
    <AnimatedSection id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <Accordion type="single" collapsible className="mt-10 rounded-2xl border border-line bg-white px-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  );
}
