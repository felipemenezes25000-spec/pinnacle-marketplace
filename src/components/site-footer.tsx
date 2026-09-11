import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-editorial-line bg-editorial text-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-5">
        <div className="flex flex-col gap-8 border-b border-editorial-line pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label text-primary">JB Soluções Odontológicas</p>
            <h2 className="headline mt-3 max-w-lg text-3xl text-balance sm:text-4xl">
              Equipamento, instalação e assistência na mesma relação.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/loja"
              className="label press sheen rounded-full bg-primary px-5 py-3.5 font-medium text-primary-foreground shadow-ember"
            >
              Explorar catálogo
            </Link>
            <Link to="/assistencia" className="label pill press px-5 py-3.5 font-medium">
              Abrir chamado técnico
            </Link>
          </div>
        </div>

        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label text-primary">Categorias</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-muted-foreground">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/loja"
                    search={{ cat: c.slug }}
                    className="underline-sweep inline-block hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-primary">Marketplace</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-muted-foreground">
              <li>
                <Link to="/loja" className="underline-sweep inline-block hover:text-primary">
                  Todo o catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/loja"
                  search={{ cond: "seminovo" as const }}
                  className="underline-sweep inline-block hover:text-primary"
                >
                  Seminovos revisados
                </Link>
              </li>
              <li>
                <Link to="/comparar" className="underline-sweep inline-block hover:text-primary">
                  Comparador de equipamentos
                </Link>
              </li>
              <li>
                <Link to="/salvos" className="underline-sweep inline-block hover:text-primary">
                  Itens salvos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="label text-primary">Suporte</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-muted-foreground">
              <li>
                <Link to="/assistencia" className="underline-sweep inline-block hover:text-primary">
                  Assistência técnica
                </Link>
              </li>
              <li>
                <a href="tel:+551137156362" className="underline-sweep inline-block hover:text-primary">
                  (11) 3715-6362
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511963417994"
                  target="_blank"
                  rel="noreferrer"
                  className="underline-sweep inline-block hover:text-primary"
                >
                  WhatsApp (11) 96341-7994
                </a>
              </li>
              <li>Segunda a sexta, 8h às 18h30</li>
            </ul>
          </div>
          <div>
            <p className="label text-primary">Compra sem susto</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-muted-foreground">
              <li>Nota fiscal e garantia em todo pedido</li>
              <li>Seminovos com laudo técnico</li>
              <li>Instalação por equipe própria em São Paulo</li>
              <li>12x sem juros no cartão</li>
            </ul>
          </div>
        </div>

        <div className="label flex flex-col gap-2 border-t border-editorial-line pt-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>JB Soluções Odontológicas · São Paulo · desde 2011</span>
          <span>
            Preços e prazos exibidos são de demonstração — confirme com a equipe antes de fechar.
          </span>
        </div>
      </div>
    </footer>
  );
}
