import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, Rows3, SlidersHorizontal, X } from "lucide-react";
import { z } from "zod";
import { brands, categories, categoryName, products } from "@/lib/catalog";
import { money, moneyShort } from "@/lib/format";
import { ProductCard, ConditionBadge, StockPill } from "@/components/product-card";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
  cond: z.enum(["novo", "seminovo"]).optional(),
  brand: z.string().optional(),
  max: z.coerce.number().optional(),
  sort: z.enum(["relevancia", "menor-preco", "maior-preco", "avaliacao"]).optional(),
});

export const Route = createFileRoute("/loja")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Catálogo de equipamentos odontológicos | JB Odonto" },
      {
        name: "description",
        content:
          "Filtre autoclaves, ultrassom, equipos, compressores e seminovos revisados por categoria, marca, condição e preço. 12x sem juros.",
      },
      { property: "og:title", content: "Catálogo de equipamentos odontológicos | JB Odonto" },
      {
        property: "og:description",
        content: "Compare equipamentos novos e seminovos com laudo técnico e assistência JB.",
      },
    ],
  }),
  component: Loja,
});

const MAX_PRICE = 40000;

function Loja() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [grid, setGrid] = useState<"grid" | "list">("grid");
  const [panel, setPanel] = useState(false);

  const set = (patch: Partial<typeof search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const active = useMemo(() => {
    const chips: { key: keyof typeof search; label: string }[] = [];
    if (search.q) chips.push({ key: "q", label: `“${search.q}”` });
    if (search.cat) chips.push({ key: "cat", label: categoryName(search.cat) });
    if (search.cond)
      chips.push({ key: "cond", label: search.cond === "novo" ? "Novo" : "Seminovo" });
    if (search.brand) chips.push({ key: "brand", label: search.brand });
    if (search.max) chips.push({ key: "max", label: `até ${moneyShort(search.max)}` });
    return chips;
  }, [search]);

  const list = useMemo(() => {
    let out = [...products];
    if (search.q) {
      const q = search.q.toLowerCase();
      out = out.filter((p) =>
        [p.name, p.brand, p.sku, categoryName(p.category), p.short]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (search.cat) out = out.filter((p) => p.category === search.cat);
    if (search.cond) out = out.filter((p) => p.condition === search.cond);
    if (search.brand) out = out.filter((p) => p.brand === search.brand);
    if (search.max) out = out.filter((p) => p.price <= search.max!);

    switch (search.sort) {
      case "menor-preco":
        out.sort((a, b) => a.price - b.price);
        break;
      case "maior-preco":
        out.sort((a, b) => b.price - a.price);
        break;
      case "avaliacao":
        out.sort((a, b) => b.rating - a.rating);
        break;
      default:
        out.sort((a, b) => b.stock - a.stock);
    }
    return out;
  }, [search]);

  const count = (fn: (p: (typeof products)[number]) => boolean) => products.filter(fn).length;

  const Facets = (
    <div className="space-y-5">
      <FacetBlock title="Categoria">
        <FacetRow
          label="Todas"
          n={products.length}
          on={!search.cat}
          onClick={() => set({ cat: undefined })}
        />
        {categories.map((c) => (
          <FacetRow
            key={c.slug}
            label={c.name}
            n={count((p) => p.category === c.slug)}
            on={search.cat === c.slug}
            onClick={() => set({ cat: search.cat === c.slug ? undefined : c.slug })}
          />
        ))}
      </FacetBlock>

      <FacetBlock title="Condição">
        {(["novo", "seminovo"] as const).map((c) => (
          <FacetRow
            key={c}
            label={c === "novo" ? "Novo" : "Seminovo revisado"}
            n={count((p) => p.condition === c)}
            on={search.cond === c}
            onClick={() => set({ cond: search.cond === c ? undefined : c })}
          />
        ))}
      </FacetBlock>

      <FacetBlock title="Marca">
        {brands.map((b) => {
          const n = count((p) => p.brand === b);
          if (n === 0) return null;
          return (
            <FacetRow
              key={b}
              label={b}
              n={n}
              on={search.brand === b}
              onClick={() => set({ brand: search.brand === b ? undefined : b })}
            />
          );
        })}
      </FacetBlock>

      <FacetBlock title="Preço máximo">
        <div className="pt-1">
          <input
            type="range"
            min={1000}
            max={MAX_PRICE}
            step={500}
            value={search.max ?? MAX_PRICE}
            onChange={(e) =>
              set({
                max: Number(e.target.value) >= MAX_PRICE ? undefined : Number(e.target.value),
              })
            }
            className="w-full accent-[oklch(0.577_0.245_27.325)]"
            aria-label="Preço máximo"
          />
          <div className="label mt-2 flex justify-between text-muted-foreground">
            <span>{moneyShort(1000)}</span>
            <span className="text-foreground">{moneyShort(search.max ?? MAX_PRICE)}</span>
          </div>
        </div>
      </FacetBlock>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-5">
      {/* topo */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav className="label flex items-center gap-1.5 text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Início
            </Link>
            <span className="text-hairline">/</span>
            <span className="text-foreground">Catálogo</span>
            {search.cat && (
              <>
                <span className="text-hairline">/</span>
                <span className="text-primary">{categoryName(search.cat)}</span>
              </>
            )}
          </nav>
          <h1 className="headline mt-2 text-3xl sm:text-4xl">
            {search.cat ? categoryName(search.cat) : "Todo o catálogo"}
          </h1>
          <p className="label mt-2 text-muted-foreground">
            {list.length} equipamento(s) · preço com nota fiscal · 12x sem juros
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPanel(true)}
            className="label press flex items-center gap-1.5 rounded-sm border border-hairline bg-surface px-3 py-2.5 lg:hidden"
          >
            <SlidersHorizontal className="size-3.5" /> Filtros
          </button>
          <select
            value={search.sort ?? "relevancia"}
            onChange={(e) => set({ sort: e.target.value as typeof search.sort })}
            className="label rounded-sm border border-hairline bg-surface px-2.5 py-2.5"
            aria-label="Ordenar"
          >
            <option value="relevancia">Relevância</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
            <option value="avaliacao">Melhor avaliado</option>
          </select>
          <div className="hidden rounded-sm border border-hairline bg-surface p-0.5 sm:flex">
            <button
              type="button"
              onClick={() => setGrid("grid")}
              className={cn(
                "press grid size-8 place-items-center rounded-sm",
                grid === "grid" ? "bg-chrome text-chrome-foreground" : "text-muted-foreground",
              )}
              aria-label="Visualizar em grade"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setGrid("list")}
              className={cn(
                "press grid size-8 place-items-center rounded-sm",
                grid === "list" ? "bg-chrome text-chrome-foreground" : "text-muted-foreground",
              )}
              aria-label="Visualizar em lista"
            >
              <Rows3 className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* chips ativos */}
      {active.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {active.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => set({ [chip.key]: undefined } as Partial<typeof search>)}
              className="label press flex items-center gap-1.5 rounded-sm bg-chrome px-2 py-1.5 font-medium text-chrome-foreground"
            >
              {chip.label}
              <X className="size-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate({ search: {} })}
            className="label press px-2 text-primary underline underline-offset-2"
          >
            Limpar tudo
          </button>
        </div>
      )}

      <div className="mt-5 flex items-start gap-5">
        {/* facetas desktop */}
        <aside className="sticky top-[184px] hidden w-[228px] shrink-0 lg:block">
          <div className="plate p-4">
            <p className="label border-b border-hairline pb-3 text-muted-foreground">Filtros</p>
            <div className="pt-4">{Facets}</div>
          </div>
          <div className="plate mt-3 bg-chrome p-4 text-chrome-foreground">
            <p className="label text-primary-glow">Assistência JB</p>
            <p className="mt-2 text-[13px] leading-snug text-white/80">
              Equipamento parado? Abra um chamado e a equipe técnica assume a triagem.
            </p>
            <Link
              to="/assistencia"
              className="label press mt-3 block rounded-sm bg-primary px-3 py-2.5 text-center font-medium text-primary-foreground"
            >
              Abrir chamado
            </Link>
          </div>
        </aside>

        {/* resultados */}
        <div className="min-w-0 flex-1">
          {list.length === 0 ? (
            <div className="plate grid place-items-center px-6 py-16 text-center">
              <p className="headline text-2xl">Nada encontrado com esses filtros</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Tente remover a marca ou aumentar o preço máximo — o catálogo tem{" "}
                {products.length} equipamentos.
              </p>
              <button
                type="button"
                onClick={() => navigate({ search: {} })}
                className="label press mt-5 rounded-sm bg-primary px-4 py-3 font-medium text-primary-foreground"
              >
                Limpar filtros
              </button>
            </div>
          ) : grid === "grid" ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <ul className="space-y-2.5">
              {list.map((p) => (
                <li key={p.slug}>
                  <ListRow slug={p.slug} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* painel de filtros mobile */}
      {panel && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-primary/20" onClick={() => setPanel(false)} />
          <div className="drawer-in absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-surface p-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <span className="headline text-xl">Filtros</span>
              <button
                type="button"
                onClick={() => setPanel(false)}
                className="press grid size-9 place-items-center rounded-sm border border-hairline"
                aria-label="Fechar filtros"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="pt-4">{Facets}</div>
            <button
              type="button"
              onClick={() => setPanel(false)}
              className="label press mt-5 w-full rounded-sm bg-primary py-3.5 font-medium text-primary-foreground"
            >
              Ver {list.length} resultado(s)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FacetBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label text-muted-foreground">{title}</p>
      <div className="mt-2 space-y-0.5">{children}</div>
    </div>
  );
}

function FacetRow({
  label,
  n,
  on,
  onClick,
}: {
  label: string;
  n: number;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-1.5 py-1.5 text-left text-[13px] transition-colors",
        on ? "bg-accent text-primary-deep" : "hover:bg-mist",
      )}
    >
      <span
        className={cn(
          "grid size-3.5 shrink-0 place-items-center rounded-sm border transition-colors",
          on ? "border-primary bg-primary" : "border-border",
        )}
      >
        {on && <span className="size-1.5 rounded-[1px] bg-primary-foreground" />}
      </span>
      <span className="flex-1 truncate">{label}</span>
      <span className="label text-muted-foreground">{n}</span>
    </button>
  );
}

function ListRow({ slug }: { slug: string }) {
  const { addToCart } = useStore();
  const p = products.find((x) => x.slug === slug)!;
  return (
    <div className="plate lift flex gap-3 overflow-hidden p-2.5">
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
          className="size-[110px] object-cover transition-transform duration-500 hover:scale-105 sm:size-[140px]"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <ConditionBadge condition={p.condition} />
          <span className="label text-muted-foreground">
            {p.brand} · {p.sku}
          </span>
        </div>
        <Link
          to="/produto/$slug"
          params={{ slug: p.slug }}
          className="underline-sweep mt-1.5 inline-block self-start text-sm font-semibold"
        >
          {p.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-[12.5px] text-muted-foreground">{p.short}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
          <div>
            <p className="numeric text-xl leading-none">{money(p.price)}</p>
            <StockPill stock={p.stock} />
          </div>
          <button
            type="button"
            onClick={() => addToCart(p.slug)}
            className="label press sheen rounded-sm bg-chrome px-3 py-2.5 font-medium text-chrome-foreground transition-colors hover:bg-primary"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
