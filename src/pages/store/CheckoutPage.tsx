import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import Seo from "@/components/seo/Seo";

function formatCurrency(amount: number, currency: string | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
  }).format(amount / 100);
}

export default function CheckoutPage() {
  const { items, totalCents, currency, updateQuantity, removeItem, clear } = useCart();
  const { data: profile } = useUserProfile();
  const isProfessional = profile?.role === "professional" || profile?.role === "admin";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleCheckout() {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const payload = items.map((item) => ({ product_id: item.productId, qty: item.quantity }));
      const { data, error } = await supabase.rpc("create_order", { p_items: payload, p_currency: currency ?? "BRL" });
      if (error) throw error;
      clear();
      setFeedback(`Pedido ${data} criado com sucesso. Nossa equipe entrará em contato.`);
    } catch (error) {
      setFeedback((error as Error).message ?? "Erro ao finalizar pedido");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Checkout — Loja SMARTx"
        description="Finalize sua solicitação de compra exclusiva para profissionais da música."
      />
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-semibold text-white">Checkout</h1>
        <p className="text-sm text-zinc-400">Revise os itens e confirme sua solicitação. Pagamento será coordenado com nossa equipe.</p>
      </div>
      {!isProfessional && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Apenas profissionais aprovados podem finalizar pedidos. Solicite verificação no painel do músico.
        </div>
      )}
      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-400">
            Seu carrinho está vazio.
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-500">
                <tr>
                  <th className="p-4 font-medium">Produto</th>
                  <th className="p-4 font-medium">Quantidade</th>
                  <th className="p-4 font-medium">Preço</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-t border-zinc-800">
                    <td className="p-4 text-zinc-200">{item.name}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                        className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-center text-zinc-100"
                      />
                    </td>
                    <td className="p-4 text-zinc-200">
                      {item.priceCents !== null && currency
                        ? formatCurrency(item.priceCents * item.quantity, currency)
                        : "--"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-zinc-500 hover:text-zinc-200"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-4 text-sm text-zinc-200">
              <span>Total</span>
              <strong>{formatCurrency(totalCents, currency ?? "BRL")}</strong>
            </div>
          </div>
        )}
        {feedback && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {feedback}
          </div>
        )}
        <div className="flex gap-3">
          <Button onClick={handleCheckout} disabled={!items.length || !isProfessional || isSubmitting}>
            {isSubmitting ? "Enviando..." : "Confirmar pedido"}
          </Button>
          <Button variant="outline" onClick={clear} className="border-zinc-700 text-zinc-200" disabled={!items.length}>
            Limpar carrinho
          </Button>
        </div>
      </div>
    </>
  );
}
