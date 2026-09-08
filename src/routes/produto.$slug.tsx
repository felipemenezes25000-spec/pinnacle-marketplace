import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Check,
  ChevronRight,
  Heart,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { bySlug, categoryName, installment, products } from "@/lib/catalog";
import { money, pct } from "@/lib/format";
import { ConditionBadge, ProductCard, StockPill } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = bySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Equipamento não encontrado | JB Odonto" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} | JB Odonto`;
    const description = `${p.short} ${money(p.price)} ou 12x sem juros. ${p.warranty}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Produto,
});

function Produto() {
  const { product: p } = Route.useLoaderData();
  const { addToCart, toggleCompare, compare, toggleSaved, saved, pushRecent, recentItems } =
    useStore();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"specs" | "assistencia" | "entrega">("specs");

  useEffect(() => {
    pushRecent(p.slug);
    setQty(1);
  }, [p.slug, pushRecent]);

  const inCompare = compare.includes(p.slug);
  const isSaved = saved.includes(p.slug);
  const related = products
    .filter((r) => r.slug !== p.slug && r.category === p.category)
    .concat(products.filter((r) => r.slug !== p.slug && r.category !== p.category))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-5">
      <nav className="label flex flex-wrap items-center gap-1 text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Início
        </Link>
        <ChevronRight className="size-3" />
        <Link to="/loja" className="hover:text-primary">
          Catálogo
        </Link>
        <ChevronRight className="size-3" />
        <Link to="/loja" search={{ cat: p.category }} className="hover:text-primary">
          {categoryName(p.category)}
        </Link>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        {/* imagem */}
        <div className="plate scan-line relative overflow-hidden bg-mist">
          <img
            src={p.image}
            alt={p.name}
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover"
          />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            <ConditionBadge condition={p.condition} />
            {p.listPrice && (
              <span className="label rounded-sm bg-primary px-2 py-1 text-primary-foreground">
                −{pct(p.listPrice, p.price)}%
              </span>
            )}
          </div>
        </div>

        {/* compra */}
        <div className="lg:sticky lg:top-[184px]">
          <span className="label text-muted-foreground">
            {p.brand} · SKU {p.sku}
          </span>
          <h1 className="headline mt-2 text-3xl text-balance sm:text-[40px] sm:leading-[1.05]">
            {p.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.short}</p>

          <div className="label mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1 text-primary">
              <Star className="size-3.5 fill-current" />
              <span className="numeric">{p.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({p.reviews} avaliações)</span>
            </span>
            <StockPill stock={p.stock} />
          </div>

          <div className="plate mt-4 p-4">
            {p.listPrice && (
              <span className="numeric text-[13px] text-muted-foreground line-through">
                {money(p.listPrice)}
              </span>
            )}
            <p className="numeric text-[34px] leading-none">{money(p.price)}</p>
            <p className="label mt-1.5 text-muted-foreground">
              12x {money(installment(p.price))} sem juros · à vista com desconto no PIX
            </p>

            <div className="mt-4 flex gap-1.5">
              <div className="flex items-center rounded-sm border border-hairline">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="press size-11 text-muted-foreground hover:text-primary"
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="numeric w-8 text-center text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(p.stock, q + 1))}
                  className="press size-11 text-muted-foreground hover:text-primary"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => addToCart(p.slug, qty)}
                className="press sheen label flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary py-4 font-medium text-primary-foreground shadow-ember"
              >
                <ShoppingCart className="size-4" /> Adicionar ao carrinho
              </button>
            </div>

            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => toggleCompare(p.slug)}
                className={cn(
                  "press label flex items-center justify-center gap-1.5 rounded-sm border py-3 font-medium transition-colors",
                  inCompare ? "border-primary bg-accent text-primary-deep" : "border-hairline hover:border-chrome",
                )}
              >
                <BarChart3 className="size-3.5" /> {inCompare ? "Comparando" : "Comparar"}
              </button>
              <button
                type="button"
                onClick={() => toggleSaved(p.slug)}
                className={cn(
                  "press label flex items-center justify-center gap-1.5 rounded-sm border py-3 font-medium transition-colors",
                  isSaved ? "border-primary bg-accent text-primary-deep" : "border-hairline hover:border-chrome",
                )}
              >
                <Heart className={cn("size-3.5", isSaved && "fill-current")} />{" "}
                {isSaved ? "Salvo" : "Salvar"}
              </button>
            </div>

            <ul className="mt-4 space-y-2 border-t border-hairline pt-4 text-[13px]">
              <li className="flex gap-2">
                <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
                {p.leadTime}
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                {p.warranty}
              </li>
              <li className="flex gap-2">
                <Wrench className="mt-0.5 size-4 shrink-0 text-primary" />
                {p.installedBy}
              </li>
            </ul>
          </div>

          <div className="plate mt-3 bg-chrome p-4 text-chrome-foreground">
            <p className="label text-primary-glow">Dúvida técnica antes de comprar?</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">
              A equipe confere tensão, espaço e compatibilidade com o que você já tem no consultório.
            </p>
            <a
              href={`https://wa.me/5511963417994?text=${encodeURIComponent(`Olá! Tenho dúvida sobre ${p.name} (${p.sku}).`)}`}
              target="_blank"
              rel="noreferrer"
              className="label press mt-3 block rounded-sm bg-primary px-3 py-3 text-center font-medium text-primary-foreground"
            >
              Falar com um técnico
            </a>
          </div>
        </div>
      </div>

      {/* destaques */}
      <Reveal className="mt-8 grid gap-px bg-hairline sm:grid-cols-3">
        {p.highlights.map((h) => (
          <div key={h} className="bg-surface p-5">
            <Check className="size-4 text-primary" />
            <p className="mt-2 text-[13px] leading-snug">{h}</p>
          </div>
        ))}
      </Reveal>

      {/* abas */}
      <div className="plate mt-6">
        <div className="flex overflow-x-auto border-b border-hairline">
          {(
            [
              { k: "specs", t: "Ficha técnica" },
              { k: "assistencia", t: "Assistência e garantia" },
              { k: "entrega", t: "Entrega e instalação" },
            ] as const
          ).map((o) => (
            <button
              key={o.k}
              type="button"
              onClick={() => setTab(o.k)}
              className={cn(
                "label press shrink-0 border-b-2 px-4 py-4 font-medium transition-colors",
                tab === o.k
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {o.t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "specs" && (
            <dl className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
              {p.specs.map((s) => (
                <div key={s.label} className="bg-surface p-3.5">
                  <dt className="label text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 text-[13px] font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === "assistencia" && (
            <div className="max-w-2xl space-y-3 text-[13px] leading-relaxed">
              <p>
                {p.warranty}. A JB mantém equipe técnica própria em São Paulo para os mesmos
                equipamentos que vende, então o chamado não passa por terceiros.
              </p>
              <p className="text-muted-foreground">
                Fora da garantia, o reparo segue com diagnóstico e orçamento aprovado antes de
                qualquer troca de peça.
              </p>
              <Link
                to="/assistencia"
                className="label press inline-block rounded-sm border border-hairline px-3 py-2.5 font-medium hover:border-primary"
              >
                Abrir um chamado técnico
              </Link>
            </div>
          )}
          {tab === "entrega" && (
            <div className="max-w-2xl space-y-3 text-[13px] leading-relaxed">
              <p>
                {p.leadTime}. {p.installedBy}.
              </p>
              <p className="text-muted-foreground">
                Equipamentos grandes (cadeira, compressor, raio-x) saem com agendamento de entrega
                para garantir que alguém receba no consultório.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* relacionados */}
      <section className="mt-10">
        <h2 className="headline text-2xl">Quem viu este também levou</h2>
        <div className="mt-4 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <ProductCard key={r.slug} product={r} dense />
          ))}
        </div>
      </section>

      {recentItems.length > 1 && (
        <section className="mt-10">
          <h2 className="headline text-2xl">Vistos recentemente</h2>
          <div className="mt-4 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {recentItems
              .filter((r) => r.slug !== p.slug)
              .slice(0, 4)
              .map((r) => (
                <ProductCard key={r.slug} product={r} dense />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
