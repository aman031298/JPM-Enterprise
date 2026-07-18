export interface NavLink {
  label: string;
  path: string;
  description?: string;
}

export const servicesLinks: NavLink[] = [
  { label: "Compliance Advisory", path: "/#contact", description: "Expert guidance on statutory and regulatory obligations" },
  { label: "Implementation Services", path: "/#contact", description: "Guided rollout across companies and branches" },
  { label: "Managed Compliance", path: "/#contact", description: "Ongoing filing and monitoring support" },
  { label: "Training & Enablement", path: "/#contact", description: "Get your team fluent on the platform fast" }
];

export const productLinks: NavLink[] = [
  { label: "Compliance Management", path: "/#products", description: "Track statutory obligations end to end" },
  { label: "Audit Management", path: "/#products", description: "Checklists, findings, and evidence in one place" },
  { label: "Risk Management", path: "/#products", description: "Score, visualize, and mitigate enterprise risk" },
  { label: "Vendor Compliance", path: "/#products", description: "Monitor third-party licenses and renewals" },
  { label: "Document Management", path: "/#products", description: "Centralized, expiry-aware document repository" },
  { label: "Compliance Calendar", path: "/#products", description: "Never miss a statutory due date again" },
  { label: "Analytics", path: "/#products", description: "Board-ready compliance reporting" },
  { label: "Workflow Engine", path: "/#products", description: "Configurable approvals across every module" }
];

export const resourceLinks: NavLink[] = [
  { label: "Blog", path: "/#resources", description: "Compliance insights and regulatory updates" },
  { label: "Guides", path: "/#resources", description: "Step-by-step implementation guides" },
  { label: "Release Notes", path: "/#resources", description: "What's new on the platform" },
  { label: "FAQs", path: "/#faq", description: "Answers to common questions" }
];

export const footerLinks = {
  company: [
    { label: "About Us", path: "/#about" },
    { label: "Careers", path: "/#careers" },
    { label: "Contact", path: "/#contact" }
  ],
  products: productLinks.slice(0, 6),
  solutions: [
    { label: "Manufacturing", path: "/#solutions" },
    { label: "Healthcare", path: "/#solutions" },
    { label: "Retail", path: "/#solutions" },
    { label: "IT", path: "/#solutions" },
    { label: "Logistics", path: "/#solutions" },
    { label: "Construction", path: "/#solutions" }
  ],
  resources: resourceLinks,
  legal: [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Careers", path: "/#careers" }
  ]
};
