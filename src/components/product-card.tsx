import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, GitCompareArrows, Heart, Plus, Star } from "lucide-react";
import { categoryName, installment, type Product } from "@/lib/catalog";
import { money, moneyShort, pct } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ConditionBadge({ condition }: { condition: Product["condition"] }) {
  return (
    <span
      className={cn(
        "label rounded-full px-2.5 py-1.5 font-medium",
        condition === "novo"
          ? "bg-primary text-primary-foreground shadow-ember"
          : "border border-primary/40 bg-accent text-primary-deep",
      )}
    >
      {condition === "novo" ? "Novo" : "Seminovo"}
    </span>
  );
}

export function StockPill({ stock }: { stock: number }) {
  const low = stock <= 5;
  return (
    <span className="label flex items-center gap-1.5 text-muted-foreground">
      <span
        className={cn(
          "size-1.5 rounded-full",
          low ? "bg-primary pulse-dot" : "bg-chrome",
        )}
      />
      {low ? `Últimas ${stock} un` : `${stock} em estoque`}
    </span>
  );
}

export function ProductCard({ product, dense = false }: { product: Product; dense?: boolean }) {
  const { addToCart, toggleCompare, compare, saved, toggleSaved } = useStore();
  const inCompare = compare.includes(product.slug);
  const isSaved = saved.includes(product.slug);
  const discount = product.listPrice ? pct(product.listPrice, product.price) : 0;

  return (
    <article className="soft-card glow-ring group relative flex h-full flex-col overflow-hidden">
      <Link
        to="/produto/$slug"
        params={{ slug: product.slug }}
        className="scan-line relative block bg-mist"
        aria-label={product.name}
      >
        <img
          src={product.image}
          alt={product.name}
          width={1024}
          height={1024}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5">
          <ConditionBadge condition={product.condition} />
          {discount > 0 && (
            <span className="label rounded-sm bg-primary px-1.5 py-1 font-medium text-primary-foreground">
              -{discount}%
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-chrome/92 px-3 py-2 text-chrome-foreground backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          <span className="label flex items-center justify-between">
            Ver ficha técnica
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </Link>

      <div className={cn("flex flex-1 flex-col p-3", dense && "p-2.5")}>
        <div className="flex items-center justify-between">
          <span className="label text-muted-foreground">{product.brand}</span>
          <span className="label flex items-center gap-1 text-muted-foreground">
            <Star className="size-3 fill-primary text-primary" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <h3 className="mt-1.5 text-[13.5px] font-semibold leading-snug text-balance">
          <Link
            to="/produto/$slug"
            params={{ slug: product.slug }}
            className="underline-sweep inline-block"
          >
            {product.name}
          </Link>
        </h3>
        <p className="label mt-1 text-muted-foreground">{categoryName(product.category)}</p>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between border-t border-hairline pt-2.5">
            <div>
              {product.listPrice && (
                <p className="label text-muted-foreground line-through">
                  {moneyShort(product.listPrice)}
                </p>
              )}
              <p className="numeric text-[22px] leading-none">{money(product.price)}</p>
              <p className="label mt-1 text-muted-foreground">
                12x {money(installment(product.price))}
              </p>
            </div>
          </div>

          <div className="mt-2.5">
            <StockPill stock={product.stock} />
          </div>

          <div className="mt-2.5 flex gap-1.5">
            <button
              type="button"
              onClick={() => addToCart(product.slug)}
              className="press sheen flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-chrome py-2 text-chrome-foreground transition-colors hover:bg-primary"
            >
              <Plus className="size-3.5" />
              <span className="label">Carrinho</span>
            </button>
            <button
              type="button"
              onClick={() => toggleCompare(product.slug)}
              aria-pressed={inCompare}
              title="Comparar"
              className={cn(
                "press grid size-9 place-items-center rounded-sm border transition-colors",
                inCompare
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-hairline text-muted-foreground hover:border-chrome hover:text-foreground",
              )}
            >
              {inCompare ? (
                <Check className="size-4" />
              ) : (
                <GitCompareArrows className="size-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => toggleSaved(product.slug)}
              aria-pressed={isSaved}
              title="Salvar"
              className={cn(
                "press grid size-9 place-items-center rounded-sm border transition-colors",
                isSaved
                  ? "border-primary text-primary"
                  : "border-hairline text-muted-foreground hover:border-chrome hover:text-foreground",
              )}
            >
              <Heart className={cn("size-4", isSaved && "fill-primary")} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
