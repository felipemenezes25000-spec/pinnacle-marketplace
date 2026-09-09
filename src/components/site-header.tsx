import { Link, useLocation, useNavigate } from "@tanstack/react-router";
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
  "Em atividade desde 2011",
];

export function SiteHeader() {
  const isHome = useLocation().pathname === "/";
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
    <header className={cn("sticky top-0 z-40", isHome ? "border-b border-editorial-line bg-editorial/95 text-foreground backdrop-blur-xl" : "bg-chrome text-chrome-foreground")}>
      {/* faixa de avisos */}
      <div className={cn("overflow-hidden border-b", isHome ? "border-editorial-line bg-blush" : "border-white/10 bg-chrome")}>
        <div className={cn("marquee-track label py-1.5", isHome ? "text-muted-foreground" : "text-white/55")}>
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-2.5">
              <span className="size-1 rounded-full bg-primary" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* barra utilitária */}
      <div className={cn("hidden border-b lg:block", isHome ? "border-editorial-line" : "border-white/10")}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-1.5">
          <div className={cn("label flex items-center gap-5", isHome ? "text-muted-foreground" : "text-white/50")}>
            <span className="flex items-center gap-1.5">
              <Truck className="size-3" /> Frete calculado para todo o Brasil
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3" /> Nota fiscal e garantia em todo pedido
            </span>
          </div>
          <div className="label flex items-center gap-4">
            <a href="tel:+551137156362" className="flex items-center gap-1.5 hover:text-primary-glow">
              <Phone className="size-3" /> (11) 3715-6362
            </a>
            <span className={isHome ? "text-editorial-line" : "text-white/20"}>|</span>
            <a
              href="https://wa.me/5511963417994"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary-glow"
            >
              WhatsApp (11) 96341-7994
            </a>
          </div>
        </div>
      </div>

      {/* barra principal */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2.5 sm:px-5">
        <button
          type="button"
          onClick={() => setMenu(true)}
          className={cn("press grid size-9 shrink-0 place-items-center rounded-full border lg:hidden", isHome ? "border-editorial-line" : "border-white/15")}
          aria-label="Abrir menu"
        >
          <Menu className="size-4" />
        </button>

        <Link to="/" className="group flex shrink-0 items-baseline gap-1.5">
          <span className="grid size-9 place-items-center rounded-sm bg-primary font-display text-lg font-bold leading-none text-primary-foreground shadow-ember transition-transform duration-200 group-hover:-rotate-3">
            JB
          </span>
          <span className={cn("label hidden sm:block", isHome ? "text-muted-foreground" : "text-white/45")}>Odonto</span>
        </Link>

        {/* busca */}
        <div ref={boxRef} className="relative flex-1">
          <form onSubmit={submit} className={cn("flex items-center gap-2 px-3 py-2", isHome ? "rounded-full border border-editorial-line bg-surface" : "rounded-sm bg-surface")}>
            <Search className="size-4 shrink-0 text-muted-foreground" />
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
              className={cn("label press hidden px-2.5 py-1.5 sm:block", isHome ? "rounded-full bg-primary text-primary-foreground" : "rounded-sm bg-chrome text-chrome-foreground")}
            >
              Buscar
            </button>
          </form>

          {open && results.length > 0 && (
            <div className="reveal-up absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-sm border border-hairline bg-surface text-foreground shadow-lift">
              <p className="label border-b border-hairline px-3 py-2 text-muted-foreground">
                {results.length} resultado(s)
              </p>
              <ul>
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/produto/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 border-b border-hairline px-3 py-2 last:border-0 hover:bg-mist"
                    >
                      <img
                        src={p.image}
                        alt=""
                        width={1024}
                        height={1024}
                        loading="lazy"
                        className="size-9 rounded-sm bg-mist object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">{p.name}</span>
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

        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/comparar"
            className={cn("press relative grid size-9 place-items-center border hover:border-primary", isHome ? "rounded-full border-editorial-line" : "rounded-sm border-white/15")}
            aria-label="Comparador"
          >
            <GitCompareArrows className="size-4" />
            {compare.length > 0 && <Counter n={compare.length} />}
          </Link>
          <Link
            to="/salvos"
            className={cn("press relative hidden size-9 place-items-center border hover:border-primary sm:grid", isHome ? "rounded-full border-editorial-line" : "rounded-sm border-white/15")}
            aria-label="Salvos"
          >
            <Heart className="size-4" />
            {saved.length > 0 && <Counter n={saved.length} />}
          </Link>
          <Link
            to="/carrinho"
            className={cn("press relative grid size-9 place-items-center border hover:border-primary", isHome ? "rounded-full border-editorial-line" : "rounded-sm border-white/15")}
            aria-label="Carrinho"
          >
            <ShoppingCart className="size-4" />
            {cartCount > 0 && <Counter n={cartCount} />}
          </Link>
          <Link
            to="/assistencia"
            className={cn("press sheen label ml-1 hidden items-center gap-1.5 bg-primary px-3 py-2.5 font-medium text-primary-foreground shadow-ember lg:flex", isHome ? "rounded-full" : "rounded-sm")}
          >
            <Wrench className="size-3.5" /> Assistência
          </Link>
        </div>
      </div>

      {/* categorias */}
      <nav className={cn("border-t", isHome ? "border-editorial-line" : "border-white/10")}>
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 overflow-x-auto px-3 sm:px-5">
          <Link
            to="/loja"
            className={cn("label shrink-0 border-b-2 border-transparent px-2.5 py-2.5 transition-colors hover:border-primary", isHome ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white")}
          >
            Todo o catálogo
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/loja"
              search={{ cat: c.slug }}
              className={cn("label shrink-0 border-b-2 border-transparent px-2.5 py-2.5 transition-colors hover:border-primary", isHome ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white")}
            >
              {c.name}
            </Link>
          ))}
          <Link
            to="/loja"
            search={{ cond: "seminovo" as const }}
            className="label shrink-0 border-b-2 border-transparent px-2.5 py-2.5 text-primary-glow transition-colors hover:border-primary"
          >
            Seminovos revisados
          </Link>
        </div>
      </nav>

      {/* menu mobile */}
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenu(false)}
          />
          <div className="reveal-up absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-chrome p-4 text-chrome-foreground">
            <div className="flex items-center justify-between">
              <span className="headline text-xl">Navegar</span>
              <button
                type="button"
                onClick={() => setMenu(false)}
                className="press grid size-9 place-items-center rounded-sm border border-white/15"
                aria-label="Fechar menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <ul className="mt-4 space-y-1">
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
                    className="flex items-center justify-between border-b border-white/10 py-3 text-sm font-medium"
                  >
                    {l.label}
                    <ChevronRight className="size-4 text-white/40" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="label mt-5 text-white/40">Categorias</p>
            <ul className="mt-2 space-y-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/loja"
                    search={{ cat: c.slug }}
                    onClick={() => setMenu(false)}
                    className="flex items-center justify-between border-b border-white/10 py-2.5 text-[13px] text-white/80"
                  >
                    {c.name}
                    <ChevronRight className="size-4 text-white/30" />
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
    <span
      className={cn(
        "label absolute -right-1.5 -top-1.5 grid min-w-4 place-items-center rounded-sm bg-primary px-1 py-0.5 font-medium text-primary-foreground",
      )}
    >
      {n}
    </span>
  );
}
