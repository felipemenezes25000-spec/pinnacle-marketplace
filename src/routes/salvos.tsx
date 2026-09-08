import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { products } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/salvos")({
  head: () => ({
    meta: [
      { title: "Equipamentos salvos | JB Odonto" },
      {
        name: "description",
        content:
          "Sua lista de equipamentos odontológicos salvos para decidir depois, com preço e disponibilidade atualizados.",
      },
      { property: "og:title", content: "Equipamentos salvos | JB Odonto" },
      {
        property: "og:description",
        content: "Guarde equipamentos para comparar e decidir com calma.",
      },
    ],
  }),
  component: Salvos,
});

function Salvos() {
  const { saved } = useStore();
  const list = products.filter((p) => saved.includes(p.slug));

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-6 sm:px-5">
      <p className="label text-primary">Sua lista</p>
      <h1 className="headline mt-2 text-3xl sm:text-4xl">Equipamentos salvos</h1>
      <p className="label mt-2 text-muted-foreground">{list.length} item(ns)</p>

      {list.length === 0 ? (
        <div className="plate mt-6 grid place-items-center px-6 py-16 text-center">
          <Heart className="size-7 text-primary" />
          <p className="headline mt-3 text-2xl">Nada salvo ainda</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Toque no coração de qualquer equipamento do catálogo para guardar aqui.
          </p>
          <Link
            to="/loja"
            className="label press mt-5 rounded-sm bg-primary px-4 py-3 font-medium text-primary-foreground"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
