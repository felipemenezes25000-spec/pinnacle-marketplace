import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck } from "lucide-react";
import { installment } from "@/lib/catalog";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Seu carrinho | JB Odonto" },
      {
        name: "description",
        content:
          "Revise os equipamentos escolhidos, veja o parcelamento em 12x e envie o pedido para a equipe JB fechar com nota fiscal.",
      },
      { property: "og:title", content: "Seu carrinho | JB Odonto" },
      {
        property: "og:description",
        content: "Revise os equipamentos e envie o pedido para a equipe JB.",
      },
    ],
  }),
  component: Carrinho,
});

function Carrinho() {
  const { cartItems, cartTotal, setQty, removeFromCart, clearCart } = useStore();
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingCart className="mx-auto size-8 text-primary" />
        <h1 className="headline mt-4 text-3xl">Seu carrinho está vazio</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Escolha equipamentos no catálogo — dá para juntar bancada, cadeira e biossegurança num só
          pedido.
        </p>
        <Link
          to="/loja"
          className="label press mt-6 inline-block rounded-sm bg-primary px-4 py-3 font-medium text-primary-foreground shadow-ember"
        >
          Ir ao catálogo
        </Link>
      </div>
    );
  }

  const total = cartTotal + (frete ?? 0);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-6 sm:px-5">
      <p className="label text-primary">Pedido</p>
      <h1 className="headline mt-2 text-3xl sm:text-4xl">Seu carrinho</h1>
      <p className="label mt-2 text-muted-foreground">{cartItems.length} equipamento(s)</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <ul className="space-y-2.5">
          {cartItems.map(({ product: p, qty }) => (
            <li key={p.slug} className="plate flex gap-3 p-2.5">
              <Link
                to="/produto/$slug"
                params={{ slug: p.slug }}
                className="shrink-0 overflow-hidden rounded-sm bg-mist"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="size-24 object-cover sm:size-28"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="label text-muted-foreground">
                      {p.brand} · {p.sku}
                    </span>
                    <Link
                      to="/produto/$slug"
                      params={{ slug: p.slug }}
                      className="underline-sweep mt-1 block text-sm font-semibold"
                    >
                      {p.name}
                    </Link>
                    <p className="label mt-1 text-muted-foreground">{p.leadTime}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(p.slug)}
                    className="press grid size-8 shrink-0 place-items-center rounded-sm border border-hairline text-muted-foreground hover:border-primary hover:text-primary"
                    aria-label={`Remover ${p.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                  <div className="flex items-center rounded-sm border border-hairline">
                    <button
                      type="button"
                      onClick={() => setQty(p.slug, qty - 1)}
                      className="press grid size-8 place-items-center text-muted-foreground hover:text-primary"
                      aria-label="Diminuir"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="numeric w-8 text-center text-sm">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(p.slug, Math.min(qty + 1, p.stock))}
                      className="press grid size-8 place-items-center text-muted-foreground hover:text-primary"
                      aria-label="Aumentar"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="numeric text-lg leading-none">{money(p.price * qty)}</p>
                    <p className="label mt-1 text-muted-foreground">
                      12x {money(installment(p.price * qty))}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={clearCart}
              className="label press text-muted-foreground underline underline-offset-2 hover:text-primary"
            >
              Esvaziar carrinho
            </button>
          </li>
        </ul>

        <div className="space-y-3 lg:sticky lg:top-[184px]">
          <div className="plate p-5">
            <p className="label text-muted-foreground">Resumo</p>
            <dl className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Equipamentos</dt>
                <dd className="numeric">{money(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Frete</dt>
                <dd className="numeric">
                  {frete === null ? "—" : frete === 0 ? "Grátis" : money(frete)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-hairline pt-4">
              <div className="flex items-end justify-between">
                <span className="label text-muted-foreground">Total</span>
                <span className="numeric text-[26px] leading-none">{money(total)}</span>
              </div>
              <p className="label mt-1.5 text-right text-muted-foreground">
                ou 12x {money(installment(total))} sem juros
              </p>
            </div>

            <button
              type="button"
              className="press sheen label mt-4 w-full rounded-sm bg-primary py-4 font-medium text-primary-foreground shadow-ember"
            >
              Enviar pedido para a JB
            </button>
            <p className="label mt-2 text-center text-muted-foreground">
              A equipe confirma estoque, frete e prazo antes do pagamento.
            </p>
          </div>

          <div className="plate p-5">
            <p className="label text-muted-foreground">Calcular frete</p>
            <form
              className="mt-2 flex gap-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                const digits = cep.replace(/\D/g, "");
                setFrete(digits.startsWith("0") ? 0 : 320);
              }}
            >
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                inputMode="numeric"
                placeholder="CEP"
                className="min-w-0 flex-1 rounded-sm border border-hairline px-3 py-2.5 text-[13px] outline-none focus:border-primary"
                aria-label="CEP"
              />
              <button
                type="submit"
                className="label press rounded-sm bg-chrome px-3 py-2.5 font-medium text-chrome-foreground"
              >
                Calcular
              </button>
            </form>
            {frete !== null && (
              <p className="label mt-2 text-muted-foreground">
                {frete === 0
                  ? "Capital de São Paulo: entrega própria sem custo."
                  : "Estimativa transportadora: 5 a 9 dias úteis."}
              </p>
            )}
          </div>

          <div className="plate p-5">
            <ul className="space-y-2.5 text-[13px]">
              <li className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                Nota fiscal, garantia e histórico no seu cadastro
              </li>
              <li className="flex gap-2">
                <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
                Equipamento grande sai com agendamento de entrega
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
