import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCompareArrows, X } from "lucide-react";
import { categoryName } from "@/lib/catalog";
import { installment, money } from "@/lib/format";
import { useStore } from "@/lib/store";
import { ConditionBadge } from "@/components/product-card";

export const Route = createFileRoute("/comparar")({
  head: () => ({
    meta: [
      { title: "Comparar equipamentos lado a lado | JB Odonto" },
      {
        name: "description",
        content:
          "Coloque até três equipamentos odontológicos lado a lado e compare preço, especificações, garantia e prazo de entrega.",
      },
      { property: "og:title", content: "Comparar equipamentos lado a lado | JB Odonto" },
      {
        property: "og:description",
        content: "Compare especificações técnicas, garantia e prazo antes de decidir.",
      },
    ],
  }),
  component: Comparar,
});

function Comparar() {
  const { compareItems, toggleCompare, clearCompare, addToCart } = useStore();

  if (compareItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <GitCompareArrows className="mx-auto size-8 text-primary" />
        <h1 className="headline mt-4 text-3xl">Comparador vazio</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          No catálogo, toque no ícone de comparação em até três equipamentos. As especificações
          aparecem aqui lado a lado.
        </p>
        <Link
          to="/loja"
          className="label press mt-6 inline-block rounded-sm bg-primary px-4 py-3 font-medium text-primary-foreground shadow-ember"
        >
          Escolher equipamentos
        </Link>
      </div>
    );
  }

  const rows: { label: string; get: (i: number) => string }[] = [
    { label: "Condição", get: (i) => (compareItems[i].condition === "novo" ? "Novo" : "Seminovo") },
    { label: "Marca", get: (i) => compareItems[i].brand },
    { label: "Categoria", get: (i) => categoryName(compareItems[i].category) },
    { label: "SKU", get: (i) => compareItems[i].sku },
    { label: "Preço", get: (i) => money(compareItems[i].price) },
    { label: "Parcelado", get: (i) => `12x ${money(installment(compareItems[i].price))}` },
    { label: "Estoque", get: (i) => `${compareItems[i].stock} un` },
    { label: "Prazo", get: (i) => compareItems[i].leadTime },
    { label: "Garantia", get: (i) => compareItems[i].warranty },
    { label: "Instalação", get: (i) => compareItems[i].installedBy },
    { label: "Avaliação", get: (i) => `${compareItems[i].rating.toFixed(1)} / 5` },
  ];

  const specLabels = Array.from(
    new Set(compareItems.flatMap((p) => p.specs.map((s) => s.label))),
  );

  const cheapest = Math.min(...compareItems.map((p) => p.price));

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-6 sm:px-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label text-primary">Comparador</p>
          <h1 className="headline mt-2 text-3xl sm:text-4xl">
            {compareItems.length} equipamentos lado a lado
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCompare}
          className="label press rounded-sm border border-hairline bg-surface px-3 py-2.5"
        >
          Limpar comparação
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="label w-[150px] border-b border-hairline p-3 text-left align-bottom text-muted-foreground">
                Especificação
              </th>
              {compareItems.map((p) => (
                <th key={p.slug} className="border-b border-hairline p-3 align-bottom">
                  <div className="plate relative overflow-hidden p-2.5 text-left">
                    <button
                      type="button"
                      onClick={() => toggleCompare(p.slug)}
                      className="press absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-sm border border-hairline bg-surface text-muted-foreground hover:text-primary"
                      aria-label={`Remover ${p.name}`}
                    >
                      <X className="size-3.5" />
                    </button>
                    <img
                      src={p.image}
                      alt={p.name}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="aspect-square w-full rounded-sm bg-mist object-cover"
                    />
                    <div className="mt-2 flex items-center gap-1.5">
                      <ConditionBadge condition={p.condition} />
                      {p.price === cheapest && compareItems.length > 1 && (
                        <span className="label rounded-sm bg-primary px-1.5 py-1 font-medium text-primary-foreground">
                          Menor preço
                        </span>
                      )}
                    </div>
                    <Link
                      to="/produto/$slug"
                      params={{ slug: p.slug }}
                      className="underline-sweep mt-1.5 inline-block text-[13px] font-semibold leading-snug"
                    >
                      {p.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => addToCart(p.slug)}
                      className="label press sheen mt-2 w-full rounded-sm bg-chrome py-2.5 font-medium text-chrome-foreground transition-colors hover:bg-primary"
                    >
                      Adicionar
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="even:bg-mist">
                <th className="label border-b border-hairline p-3 text-left align-top text-muted-foreground">
                  {r.label}
                </th>
                {compareItems.map((p, i) => (
                  <td
                    key={p.slug}
                    className="border-b border-hairline p-3 align-top text-[13px] font-medium"
                  >
                    {r.get(i)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th
                colSpan={compareItems.length + 1}
                className="label bg-chrome p-3 text-left text-chrome-foreground"
              >
                Ficha técnica
              </th>
            </tr>
            {specLabels.map((label) => (
              <tr key={label} className="even:bg-mist">
                <th className="label border-b border-hairline p-3 text-left align-top text-muted-foreground">
                  {label}
                </th>
                {compareItems.map((p) => {
                  const spec = p.specs.find((s) => s.label === label);
                  return (
                    <td
                      key={p.slug}
                      className="border-b border-hairline p-3 align-top text-[13px]"
                    >
                      {spec ? (
                        <span className="font-medium">{spec.value}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
