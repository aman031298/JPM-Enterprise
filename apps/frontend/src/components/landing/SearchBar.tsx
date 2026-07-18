import { useState } from "react";
import { Mic, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [listening, setListening] = useState(false);
  const [value, setValue] = useState("");

  function handleVoiceSearch() {
    setListening(true);
    window.setTimeout(() => setListening(false), 1600);
  }

  return (
    <form
      className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-line bg-white p-2 shadow-panel-lg"
      onSubmit={(event) => event.preventDefault()}
    >
      <Search className="ml-2 h-4 w-4 shrink-0 text-ink/40" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search compliance domains, products, or resources..."
        className="w-full bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink/40"
      />
      <button
        type="button"
        onClick={handleVoiceSearch}
        aria-label="Voice search"
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
          listening ? "bg-accent-100 text-accent-700" : "text-ink/40 hover:bg-mist hover:text-ink"
        )}
      >
        <Mic className={cn("h-4 w-4", listening && "animate-pulse")} />
      </button>
    </form>
  );
}
