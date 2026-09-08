import { Link } from "@tanstack/react-router";
import { GitCompareArrows, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";

export function CompareBar() {
  const { compareItems, toggleCompare, clearCompare } = useStore();
  if (compareItems.length === 0) return null;

  return (
    <div className="drawer-in fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-chrome/95 text-chrome-foreground backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2.5 sm:px-5">
        <span className="label hidden shrink-0 items-center gap-2 text-white/50 sm:flex">
          <GitCompareArrows className="size-3.5" />
          Comparador
        </span>

        <div className="flex flex-1 gap-2 overflow-x-auto">
          {compareItems.map((p) => (
            <div
              key={p.slug}
              className="flex shrink-0 items-center gap-2 rounded-sm border border-white/10 bg-white/5 py-1 pl-1 pr-2"
            >
              <img
                src={p.image}
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                className="size-8 rounded-sm bg-white object-cover"
              />
              <div className="min-w-0">
                <p className="max-w-[130px] truncate text-[11px] font-medium leading-tight">
                  {p.name}
                </p>
                <p className="label text-white/45">{money(p.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleCompare(p.slug)}
                className="press grid size-5 place-items-center rounded-sm text-white/50 hover:text-primary-glow"
                aria-label={`Remover ${p.name} do comparador`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 3 - compareItems.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="label grid h-[42px] w-[110px] shrink-0 place-items-center rounded-sm border border-dashed border-white/15 text-white/30"
            >
              vazio
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={clearCompare}
          className="label press hidden shrink-0 px-2 text-white/45 hover:text-white sm:block"
        >
          Limpar
        </button>
        <Link
          to="/comparar"
          className="press sheen label shrink-0 rounded-sm bg-primary px-3 py-2.5 font-medium text-primary-foreground shadow-ember"
        >
          Comparar {compareItems.length}
        </Link>
      </div>
    </div>
  );
}
