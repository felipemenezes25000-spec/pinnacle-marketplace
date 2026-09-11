import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  GitCompareArrows,
  Heart,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { categories, searchProducts } from "@/lib/catalog";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ticker = [
  "Assistência técnica própria — equipe JB em São Paulo",
  "12x sem juros em todo o catálogo",
  "Seminovos com laudo técnico item por item",
  "Instalação e treinamento inclusos nos equipamentos de bancada",
  "Nota fiscal e garantia em todo pedido",
  "Em atividade desde 2011",
];

export function SiteHeader() {
  const navigate = useNavigate();
  const { cartCount, compare, saved } = useStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const results = searchProducts(query);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/loja", search: { q: query || undefined } });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-editorial-line bg-editorial/90 text-foreground backdrop-blur-xl">
      {/* ticker do topo */}
      <div className="overflow-hidden bg-primary text-primary-foreground">
        <div className="marquee-track label py-2">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-2.5">
              <Sparkles className="size-3" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* barra utilitária */}
      <div className="hidden border-b border-editorial-line bg-blush/50 lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-2">
          <div className="label flex items-center gap-5 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Truck className="size-3 text-primary" /> Frete calculado para todo o Brasil
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3 text-primary" /> Nota fiscal e garantia em todo pedido
            </span>
          </div>
          <div className="label flex items-center gap-4">
            <a href="tel:+551137156362" className="flex items-center gap-1.5 hover:text-primary">
              <Phone className="size-3" /> (11) 3715-6362
            </a>
            <span className="text-editorial-line">|</span>
            <a
              href="https://wa.me/5511963417994"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              WhatsApp (11) 96341-7994
            </a>
          </div>
        </div>
      </div>

      {/* barra principal */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => setMenu(true)}
          className="pill press grid size-10 shrink-0 place-items-center lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-4" />
        </button>

        <Link to="/" className="group flex shrink-0 items-center gap-2">
          <span className="grid size-10 place-items-center rounded-full bg-primary font-display text-base font-bold leading-none text-primary-foreground shadow-ember transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6">
            JB
          </span>
          <span className="label hidden text-muted-foreground sm:block">Odonto</span>
        </Link>

        {/* busca */}
        <div ref={boxRef} className="relative flex-1">
          <form
            onSubmit={submit}
            className="glow-ring flex items-center gap-2 rounded-full border border-editorial-line bg-surface px-4 py-2.5 shadow-editorial transition-shadow focus-within:border-primary/50"
          >
            <Search className="size-4 shrink-0 text-primary" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Buscar autoclave, ultrassom, equipo, SKU…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Buscar equipamentos"
            />
            <button
              type="submit"
              className="label press sheen hidden rounded-full bg-primary px-3.5 py-2 font-medium text-primary-foreground sm:block"
            >
              Buscar
            </button>
          </form>

          {open && results.length > 0 && (
            <div className="reveal-up absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-editorial-line bg-surface text-foreground shadow-lift">
              <p className="label border-b border-editorial-line bg-blush/60 px-4 py-2.5 text-muted-foreground">
                {results.length} resultado(s)
              </p>
              <ul>
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/produto/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 border-b border-editorial-line px-4 py-2.5 transition-colors last:border-0 hover:bg-blush/60"
                    >
                      <img
                        src={p.image}
                        alt=""
                        width={1024}
                        height={1024}
                        loading="lazy"
                        className="size-10 rounded-full bg-mist object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{p.name}</span>
                        <span className="label text-muted-foreground">
                          {p.brand} · {p.sku}
                        </span>
                      </span>
                      <span className="numeric shrink-0 text-sm">{money(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link to="/comparar" className="pill press relative grid size-10 place-items-center" aria-label="Comparador">
            <GitCompareArrows className="size-4" />
            {compare.length > 0 && <Counter n={compare.length} />}
          </Link>
          <Link
            to="/salvos"
            className="pill press relative hidden size-10 place-items-center sm:grid"
            aria-label="Salvos"
          >
            <Heart className="size-4" />
            {saved.length > 0 && <Counter n={saved.length} />}
          </Link>
          <Link to="/carrinho" className="pill press relative grid size-10 place-items-center" aria-label="Carrinho">
            <ShoppingCart className="size-4" />
            {cartCount > 0 && <Counter n={cartCount} />}
          </Link>
          <Link
            to="/assistencia"
            className="press sheen label ml-1 hidden items-center gap-1.5 rounded-full bg-primary px-4 py-3 font-medium text-primary-foreground shadow-ember lg:flex"
          >
            <Wrench className="size-3.5" /> Assistência
          </Link>
        </div>
      </div>

      {/* categorias */}
      <nav className="border-t border-editorial-line">
        <div className="mx-auto flex max-w-[1400px] items-center gap-1.5 overflow-x-auto px-3 py-2 sm:px-5">
          <Link
            to="/loja"
            className="label pill shrink-0 px-3.5 py-2 text-muted-foreground transition-colors hover:text-primary"
          >
            Todo o catálogo
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/loja"
              search={{ cat: c.slug }}
              className="label pill shrink-0 px-3.5 py-2 text-muted-foreground transition-colors hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
          <Link
            to="/loja"
            search={{ cond: "seminovo" as const }}
            className="label press shrink-0 rounded-full bg-primary/10 px-3.5 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Seminovos revisados
          </Link>
        </div>
      </nav>

      {/* menu mobile */}
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-primary/20 backdrop-blur-md"
            onClick={() => setMenu(false)}
          />
          <div className="reveal-up absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto rounded-r-[32px] border-r border-editorial-line bg-editorial p-5 text-foreground">
            <div className="flex items-center justify-between">
              <span className="headline text-2xl">Navegar</span>
              <button
                type="button"
                onClick={() => setMenu(false)}
                className="pill press grid size-10 place-items-center"
                aria-label="Fechar menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <ul className="mt-5 space-y-2">
              {[
                { to: "/loja" as const, label: "Todo o catálogo" },
                { to: "/comparar" as const, label: "Comparador" },
                { to: "/salvos" as const, label: "Salvos" },
                { to: "/carrinho" as const, label: "Carrinho" },
                { to: "/assistencia" as const, label: "Assistência técnica" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setMenu(false)}
                    className="pill flex items-center justify-between px-4 py-3 text-sm font-semibold"
                  >
                    {l.label}
                    <ChevronRight className="size-4 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="label mt-6 text-primary">Categorias</p>
            <ul className="mt-3 space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/loja"
                    search={{ cat: c.slug }}
                    onClick={() => setMenu(false)}
                    className="flex items-center justify-between rounded-2xl border border-editorial-line bg-surface px-4 py-2.5 text-[13px] text-muted-foreground"
                  >
                    {c.name}
                    <ChevronRight className="size-4 text-primary/60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

function Counter({ n }: { n: number }) {
  return (
    <span className="label absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-primary px-1.5 py-0.5 font-medium text-primary-foreground shadow-ember">
      {n}
    </span>
  );
}
