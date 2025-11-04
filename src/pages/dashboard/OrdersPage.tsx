import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total_cents, currency, created_at, order_items(product:products(name, slug), qty, price_cents)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Carregando pedidos...</p>;
  }

  if (!data?.length) {
    return <p className="text-sm text-zinc-500">Você ainda não possui pedidos.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((order) => (
        <div key={order.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
            <span>#{order.id.slice(0, 8)}</span>
            <span className="uppercase text-xs text-emerald-400">{order.status}</span>
            <span>{new Date(order.created_at).toLocaleDateString("pt-BR")}</span>
            <strong className="text-zinc-100">{formatCurrency(order.total_cents, order.currency)}</strong>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            {order.order_items?.map((item: any, index: number) => (
              <li key={index} className="flex items-center justify-between">
                <span>{item.product?.name ?? "Produto"}</span>
                <span className="text-xs text-zinc-500">{item.qty} x {formatCurrency(item.price_cents, order.currency)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
