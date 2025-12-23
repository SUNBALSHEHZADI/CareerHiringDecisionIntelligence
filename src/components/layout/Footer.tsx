import { Target } from "lucide-react";
import { Link } from "react-router-dom";
export function Footer() {
  return <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
              <Target className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Career<span className="text-primary">Decide</span>
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/evaluate" className="hover:text-foreground transition-colors">
              Evaluate
            </Link>
            <Link to="/analytics" className="hover:text-foreground transition-colors">
              Analytics
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareerDecide. Decision Intelligence for Students.
          </p>
        </div>
      </div>
    </footer>;
}