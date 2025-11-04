import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statuses = ["pending", "paid", "fulfilled", "canceled"] as const;

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", filter],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("id, user_id, status, total_cents, currency, created_at, user:user_id(full_name, email), order_items(product:products(name, slug), qty, price_cents)")
        .order("created_at", { ascending: false });
      if (filter) query = query.eq("status", filter);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Select onValueChange={(value) => setFilter(value === "all" ? null : value)} defaultValue="all">
          <SelectTrigger className="w-48 border-zinc-700 bg-zinc-900 text-zinc-200">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent className="border-zinc-700 bg-zinc-900 text-zinc-200">
            <SelectItem value="all">Todos</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <p className="text-sm text-zinc-500">Carregando pedidos...</p>
      ) : (
        <div className="space-y-4">
          {data?.map((order) => (
            <div key={order.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
                <div>
                  <p className="text-zinc-200">{order.user?.full_name ?? order.user?.email ?? "Cliente"}</p>
                  <p className="text-xs text-zinc-500">{order.user?.email}</p>
                </div>
                <span className="text-xs uppercase text-emerald-400">{order.status}</span>
                <span className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleString("pt-BR")}</span>
                <strong className="text-zinc-100">{formatCurrency(order.total_cents, order.currency)}</strong>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-zinc-400">
                {order.order_items?.map((item: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.product?.name ?? "Produto"}</span>
                    <span>
                      {item.qty} x {formatCurrency(item.price_cents, order.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
