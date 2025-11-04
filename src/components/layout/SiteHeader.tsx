import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/blog", label: "Blog" },
  { to: "/store", label: "Loja" },
  { to: "/dashboard", label: "Painel" },
];

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const { data: profile } = useUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = profile?.role === "admin";

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-white">
          SMARTx
        </Link>
        <nav className="hidden gap-8 text-sm font-medium text-zinc-300 md:flex">
          {navItems
            .filter((item) => (item.to === "/dashboard" ? !!user : true))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "transition-colors hover:text-white",
                    isActive ? "text-white" : "text-zinc-400"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "transition-colors hover:text-white",
                  isActive ? "text-white" : "text-zinc-400"
                )
              }
            >
              Admin
            </NavLink>
          )}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-zinc-400">
                {profile?.full_name ?? user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sair
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-zinc-800 p-2 text-zinc-300 md:hidden"
          onClick={() => setMobileOpen((state) => !state)}
          aria-label="Abrir navegação"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4 text-sm font-medium text-zinc-300">
            {navItems
              .filter((item) => (item.to === "/dashboard" ? !!user : true))
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-2 py-2 transition-colors hover:bg-zinc-900",
                      isActive ? "bg-zinc-900 text-white" : "text-zinc-300"
                    )
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-2 py-2 transition-colors hover:bg-zinc-900",
                    isActive ? "bg-zinc-900 text-white" : "text-zinc-300"
                  )
                }
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </NavLink>
            )}
            {user ? (
              <button
                type="button"
                className="rounded-lg px-2 py-2 text-left text-zinc-300 transition-colors hover:bg-zinc-900"
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
              >
                Sair
              </button>
            ) : (
              <Link
                to="/auth"
                className="rounded-lg px-2 py-2 text-zinc-300 transition-colors hover:bg-zinc-900"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default SiteHeader;
