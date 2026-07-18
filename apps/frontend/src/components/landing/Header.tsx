import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Globe, LayoutGrid, Menu, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicesLinks, productLinks, resourceLinks } from "@/data/landing-navigation";
import { countries } from "@/data/landing-content";
import { cn } from "@/lib/utils";

const megaMenus = {
  Services: servicesLinks,
  Products: productLinks,
  Resources: resourceLinks
};

function MegaMenuPanel({ items, onNavigate }: { items: typeof servicesLinks; onNavigate: () => void }) {
  return (
    <ul className="grid w-[560px] grid-cols-2 gap-1 p-4">
      {items.map((item) => (
        <li key={item.label}>
          <Link to={item.path} onClick={onNavigate} className="block rounded-lg px-3 py-2.5 transition hover:bg-mist">
            <p className="text-sm font-semibold text-ink">{item.label}</p>
            {item.description && <p className="mt-0.5 text-xs text-ink/55">{item.description}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState(countries[0]);
  const [openMenu, setOpenMenu] = useState<keyof typeof megaMenus | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function openMenuNow(key: keyof typeof megaMenus) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors",
        scrolled ? "border-line bg-white/95 shadow-panel backdrop-blur" : "border-transparent bg-white/80 backdrop-blur"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          onClick={(event) => {
            if (window.location.pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-ink">JPM Enterprises</p>
            <p className="text-[11px] text-ink/50">Compliance Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={scheduleClose}>
          {(Object.keys(megaMenus) as Array<keyof typeof megaMenus>).map((key) => (
            <div key={key} className="relative" onMouseEnter={() => openMenuNow(key)}>
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === key ? null : key)}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink/75 transition hover:bg-mist hover:text-ink",
                  openMenu === key && "bg-mist text-ink"
                )}
                aria-expanded={openMenu === key}
              >
                {key}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", openMenu === key && "rotate-180")} />
              </button>
              {openMenu === key && (
                <div
                  className="absolute left-0 top-full pt-2"
                  onMouseEnter={() => openMenuNow(key)}
                  onMouseLeave={scheduleClose}
                >
                  <div className="rounded-xl border border-line bg-white shadow-panel-lg">
                    <MegaMenuPanel items={megaMenus[key]} onNavigate={() => setOpenMenu(null)} />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link to="/#about" className="rounded-lg px-3 py-2 text-sm font-medium text-ink/75 transition hover:bg-mist hover:text-ink">
            About Us
          </Link>
          <Link to="/#careers" className="rounded-lg px-3 py-2 text-sm font-medium text-ink/75 transition hover:bg-mist hover:text-ink">
            Careers
          </Link>
          <Link
            to="/#products"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/75 transition hover:bg-mist hover:text-ink"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Apps
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCountryOpen((v) => !v)}
              className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-ink/70 transition hover:bg-mist"
              aria-label="Select country"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden xl:inline">{country}</span>
            </button>
            {countryOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-line bg-white p-1.5 shadow-panel-lg">
                {countries.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setCountry(item);
                      setCountryOpen(false);
                    }}
                    className={cn(
                      "block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-mist",
                      item === country ? "font-semibold text-accent-600" : "text-ink/75"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Login
            </Button>
          </Link>
          <Link to="/#contact">
            <Button size="sm">Request Demo</Button>
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink/60 hover:bg-mist lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-white px-4 py-4 lg:hidden">
          <div className="space-y-1">
            {Object.entries(megaMenus).map(([key, items]) => (
              <details key={key} className="group">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-ink">
                  {key}
                </summary>
                <div className="ml-2 space-y-0.5 border-l border-line pl-3">
                  {items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-ink/70 hover:bg-mist"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
            <Link to="/#about" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink">
              About Us
            </Link>
            <Link to="/#careers" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink">
              Careers
            </Link>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink">
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
