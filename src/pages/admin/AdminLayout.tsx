import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin/verifications", label: "Verificações" },
  { to: "/admin/products", label: "Produtos" },
  { to: "/admin/orders", label: "Pedidos" },
  { to: "/admin/blog", label: "Blog" },
];

export default function AdminLayout() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Administração SMARTx</h1>
        <p className="text-sm text-zinc-400">Gerencie verificações, catálogo, pedidos e conteúdo editorial.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 text-zinc-300 hover:border-emerald-500/40"
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <Outlet />
      </div>
    </div>
  );
}
