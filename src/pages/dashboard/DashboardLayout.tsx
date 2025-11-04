import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tabs = [
  { to: "/dashboard/profile", label: "Perfil do Músico" },
  { to: "/dashboard/orders", label: "Pedidos" },
];

export default function DashboardLayout() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Painel do Músico</h1>
          <p className="text-sm text-zinc-400">
            Atualize sua presença artística, acompanhe pedidos e gerencie sua verificação profissional.
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link to="/store">Acessar e-commerce do artista</Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-300 hover:border-emerald-500/40"
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <Outlet />
      </div>
    </div>
  );
}
