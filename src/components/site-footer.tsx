import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="hairgrid-dark mt-16 bg-chrome text-chrome-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-5">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label text-primary-glow">JB Soluções Odontológicas</p>
            <h2 className="headline mt-2 max-w-lg text-3xl text-balance sm:text-4xl">
              Equipamento, instalação e assistência na mesma relação.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/loja"
              className="label press rounded-sm bg-primary px-4 py-3 font-medium text-primary-foreground shadow-ember"
            >
              Explorar catálogo
            </Link>
            <Link
              to="/assistencia"
              className="label press rounded-sm border border-white/20 px-4 py-3 font-medium hover:border-primary"
            >
              Abrir chamado técnico
            </Link>
          </div>
        </div>

        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label text-white/40">Categorias</p>
            <ul className="mt-3 space-y-2 text-[13px] text-white/75">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/loja"
                    search={{ cat: c.slug }}
                    className="underline-sweep inline-block hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-white/40">Marketplace</p>
            <ul className="mt-3 space-y-2 text-[13px] text-white/75">
              <li>
                <Link to="/loja" className="underline-sweep inline-block hover:text-white">
                  Todo o catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/loja"
                  search={{ cond: "seminovo" as const }}
                  className="underline-sweep inline-block hover:text-white"
                >
                  Seminovos revisados
                </Link>
              </li>
              <li>
                <Link to="/comparar" className="underline-sweep inline-block hover:text-white">
                  Comparador de equipamentos
                </Link>
              </li>
              <li>
                <Link to="/salvos" className="underline-sweep inline-block hover:text-white">
                  Itens salvos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="label text-white/40">Suporte</p>
            <ul className="mt-3 space-y-2 text-[13px] text-white/75">
              <li>
                <Link to="/assistencia" className="underline-sweep inline-block hover:text-white">
                  Assistência técnica
                </Link>
              </li>
              <li>
                <a href="tel:+551137156362" className="underline-sweep inline-block hover:text-white">
                  (11) 3715-6362
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511963417994"
                  target="_blank"
                  rel="noreferrer"
                  className="underline-sweep inline-block hover:text-white"
                >
                  WhatsApp (11) 96341-7994
                </a>
              </li>
              <li className="text-white/50">Segunda a sexta, 8h às 18h30</li>
            </ul>
          </div>
          <div>
            <p className="label text-white/40">Compra sem susto</p>
            <ul className="mt-3 space-y-2 text-[13px] text-white/75">
              <li>Nota fiscal e garantia em todo pedido</li>
              <li>Seminovos com laudo técnico</li>
              <li>Instalação por equipe própria em São Paulo</li>
              <li>12x sem juros no cartão</li>
            </ul>
          </div>
        </div>

        <div className="label flex flex-col gap-2 border-t border-white/10 pt-6 text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>JB Soluções Odontológicas · São Paulo · desde 2011</span>
          <span>
            Preços e prazos exibidos são de demonstração — confirme com a equipe antes de fechar.
          </span>
        </div>
      </div>
    </footer>
  );
}
