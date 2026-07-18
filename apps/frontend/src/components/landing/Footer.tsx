import { useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Youtube, ShieldCheck, ArrowRight } from "lucide-react";
import { footerLinks } from "@/data/landing-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; path: string }> }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.path} className="text-sm text-white/70 transition hover:text-white">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <span className="text-sm font-bold">JPM Enterprises</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Enterprise-grade compliance, audit, risk, and vendor management for regulated organizations worldwide.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/15 hover:text-white">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/15 hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/15 hover:text-white">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Products" links={footerLinks.products} />
          <FooterColumn title="Solutions" links={footerLinks.solutions} />
          <FooterColumn title="Resources" links={footerLinks.resources} />
        </div>

        <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Subscribe to our newsletter</p>
            <p className="mt-1 text-sm text-white/55">Compliance updates, product news, and regulatory alerts.</p>
          </div>
          <form
            className="flex w-full max-w-sm gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (email.trim()) setSubscribed(true);
            }}
          >
            {subscribed ? (
              <p className="text-sm font-medium text-emerald-400">Thanks — you're subscribed.</p>
            ) : (
              <>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Work email"
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:ring-accent-900/40"
                />
                <Button type="submit" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </form>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} JPM Enterprises. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {footerLinks.legal.map((link) => (
              <a key={link.label} href={link.path} className="hover:text-white/80">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
