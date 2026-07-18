import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-lg text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300">
          <CompassIcon className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-ink dark:text-white">Page not found</h1>
        <p className="mt-2 text-sm text-ink/55 dark:text-slate-400">The requested module route is not available.</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Return to dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
