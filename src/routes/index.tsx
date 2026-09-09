import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleGauge,
  CreditCard,
  GitCompareArrows,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";
import { categories, categoryName, installment, products, brands, type Product } from "@/lib/catalog";
import { money, pct } from "@/lib/format";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JB Odonto | Equipamentos odontológicos" },
      {
        name: "description",
        content:
          "Equipamentos odontológicos novos e seminovos revisados, com comparação técnica, instalação e assistência própria JB.",
      },
      { property: "og:title", content: "JB Odonto | Equipamentos odontológicos" },
      {
        property: "og:description",
        content: "Catálogo técnico com equipamentos novos, seminovos revisados e assistência própria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const productFor = (category: string) => products.find((product) => product.category === category);

function Home() {
  const hero = products.find((product) => product.slug === "cadeira-equipo-completo-pro") ?? products[0];
  const offers = products
    .filter((product) => product.listPrice !== undefined)
    .sort((a, b) => {
      const discountA = a.listPrice ? pct(a.listPrice, a.price) : 0;
      const discountB = b.listPrice ? pct(b.listPrice, b.price) : 0;
      return discountB - discountA;
    })
    .slice(0, 4);
  const compareProducts = products.slice(0, 3);
  const used = products.filter((product) => product.condition === "seminovo").slice(0, 3);
  const popular = products.slice().sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  if (!hero) return null;

  return (
    <div className="overflow-hidden bg-editorial text-foreground">
      <Hero product={hero} />

      <main>
        <QuickRail />

        <EditorialSection className="pt-20 sm:pt-28">
          <SectionHeading
            eyebrow="Navegue pelo consultório"
            title="Cada área, uma escolha precisa."
            copy="Encontre o equipamento certo pela rotina clínica, com informação técnica clara desde o primeiro olhar."
            action="Ver catálogo completo"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.45fr_1fr] lg:grid-rows-2">
            {categories.map((category, index) => {
              const product = productFor(category.slug);
              if (!product) return null;
              return (
                <Reveal
                  key={category.slug}
                  delay={index * 60}
                  className={index === 0 ? "lg:row-span-2" : ""}
                >
                  <Link
                    to="/loja"
                    search={{ cat: category.slug }}
                    className={`group relative flex h-full min-h-56 overflow-hidden rounded-[1.75rem] bg-surface shadow-editorial ${
                      index === 0 ? "min-h-[34rem]" : "sm:min-h-64"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      width={1024}
                      height={1024}
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="editorial-image-wash absolute inset-0" />
                    <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 sm:p-8">
                      <div className="min-w-0">
                        <p className="label text-primary">0{index + 1}</p>
                        <h3 className={`mt-2 font-display font-medium leading-none ${index === 0 ? "text-4xl sm:text-5xl" : "text-3xl"}`}>
                          {category.name}
                        </h3>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{category.blurb}</p>
                      </div>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </EditorialSection>

        <section className="mt-20 bg-blush py-20 sm:mt-28 sm:py-28">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <SectionHeading
              eyebrow="Condições especiais"
              title="Ofertas que merecem espaço."
              copy="Uma seleção objetiva de equipamentos com preço reduzido, garantia e suporte técnico da JB."
              action="Explorar todas as ofertas"
            />
            {offers[0] && (
              <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
                <OfferHero product={offers[0]} />
                <div className="flex flex-col divide-y divide-editorial-line">
                  {offers.slice(1).map((product, index) => (
                    <OfferRow key={product.slug} product={product} index={index + 2} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <EditorialSection className="py-20 sm:py-28">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.6fr] lg:gap-16">
            <div className="lg:sticky lg:top-44 lg:self-start">
              <p className="label text-primary">Comparador técnico</p>
              <h2 className="mt-4 max-w-sm font-display text-4xl font-medium leading-[1.02] sm:text-5xl">
                Decida pelos detalhes que importam.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Preço, garantia, instalação e especificações reunidos em uma leitura simples.
              </p>
              <Link
                to="/comparar"
                className="press mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-ember"
              >
                <GitCompareArrows className="size-4" /> Abrir comparador
              </Link>
            </div>
            <div className="grid divide-y divide-editorial-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {compareProducts.map((product, index) => (
                <ComparePreview key={product.slug} product={product} index={index} />
              ))}
            </div>
          </div>
        </EditorialSection>

        <section className="relative bg-surface py-20 sm:py-28">
          <div className="home-halo pointer-events-none absolute -left-48 top-8 size-[32rem] rounded-full" />
          <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
            <SectionHeading
              eyebrow="Revisado na bancada JB"
              title="Seminovos com história transparente."
              copy="Cada equipamento passa por avaliação técnica e chega acompanhado de laudo e garantia JB."
              action="Ver todos os seminovos"
              search={{ cond: "seminovo" }}
            />
            <div className="mt-12 space-y-4">
              {used.map((product, index) => (
                <UsedProduct key={product.slug} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        <EditorialSection className="py-20 sm:py-28">
          <SectionHeading
            eyebrow="Seleção do catálogo"
            title="Os mais procurados, sem ruído."
            copy="Equipamentos para diferentes escalas de consultório, apresentados para uma comparação rápida."
            action="Conhecer o catálogo"
          />
          <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-5 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-5">
            {popular.map((product, index) => (
              <CompactProduct key={product.slug} product={product} index={index} />
            ))}
          </div>
        </EditorialSection>

        <section className="bg-blush py-20 sm:py-28">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <Reveal className="relative min-h-[30rem]">
              <div className="absolute inset-5 rounded-[3rem] bg-primary/10" />
              <img
                src={products.find((product) => product.slug === "autoclave-vertical-18l-classe-b")?.image}
                alt="Autoclave atendida pela assistência técnica JB"
                width={1024}
                height={1024}
                loading="lazy"
                className="relative h-[30rem] w-full rounded-[2.5rem] object-cover shadow-editorial sm:ml-8 sm:w-[calc(100%-2rem)]"
              />
              <div className="absolute bottom-0 left-0 max-w-xs rounded-[1.5rem] bg-surface p-5 shadow-editorial">
                <Wrench className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Diagnóstico antes de qualquer reparo</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Orçamento, peças e prazo apresentados com clareza.</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="label text-primary">Assistência própria</p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-[1.02] sm:text-6xl">
                Quem vende, continua ao seu lado.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                Do primeiro diagnóstico ao histórico do equipamento, seu chamado entra direto na equipe técnica JB.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {[
                  [CircleGauge, "Triagem técnica", "O sintoma é classificado antes do atendimento."],
                  [PackageCheck, "Peças e prazo", "Tudo é apresentado antes do reparo começar."],
                  [Wrench, "Equipe própria", "Atendimento de bancada ou visita técnica."],
                  [Headphones, "Histórico contínuo", "Cada intervenção acompanha o equipamento."],
                ].map(([Icon, title, text]) => {
                  const ItemIcon = Icon as typeof Wrench;
                  return (
                    <div key={String(title)} className="border-t border-editorial-line pt-4">
                      <ItemIcon className="size-4 text-primary" />
                      <p className="mt-3 text-sm font-semibold">{String(title)}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{String(text)}</p>
                    </div>
                  );
                })}
              </div>
              <Link
                to="/assistencia"
                className="press mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-ember"
              >
                Abrir chamado técnico <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-editorial-line bg-editorial py-16">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <p className="label text-center text-muted-foreground">Marcas presentes no catálogo JB</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:justify-between">
              {brands.map((brand) => (
                <span key={brand} className="font-display text-xl font-medium text-foreground/60 sm:text-2xl">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Hero({ product }: { product: Product }) {
  return (
    <section className="relative min-h-[calc(100svh-7rem)] overflow-hidden border-b border-editorial-line bg-editorial">
      <div className="home-halo pointer-events-none absolute -right-36 top-6 size-[42rem] rounded-full" />
      <div className="relative mx-auto grid min-h-[calc(100svh-7rem)] max-w-[1400px] items-center gap-8 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:pb-12 lg:pt-16">
        <Reveal className="relative z-10 max-w-2xl">
          <p className="label flex items-center gap-2 text-primary">
            <span className="size-1.5 rounded-full bg-primary" /> Equipamentos odontológicos · São Paulo
          </p>
          <h1 className="mt-6 font-display text-[3.35rem] font-medium leading-[0.94] text-balance sm:text-7xl lg:text-[5.8rem]">
            Precisão para escolher. <span className="text-primary">Confiança para cuidar.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Equipamentos novos e seminovos revisados, com comparação técnica, instalação e assistência pela mesma equipe.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/loja" className="press sheen inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-ember">
              Explorar catálogo <ArrowRight className="size-4" />
            </Link>
            <Link to="/comparar" className="press inline-flex items-center gap-2 rounded-full border border-editorial-line bg-surface/70 px-6 py-4 text-sm font-semibold hover:border-primary/40">
              Comparar equipamentos
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /> Nota fiscal e garantia</span>
            <span className="flex items-center gap-2"><CreditCard className="size-4 text-primary" /> 12x sem juros</span>
            <span className="flex items-center gap-2"><Wrench className="size-4 text-primary" /> Assistência própria</span>
          </div>
        </Reveal>

        <Reveal delay={100} className="relative min-h-[29rem] lg:min-h-[39rem]">
          <div className="absolute inset-x-[8%] inset-y-[5%] rounded-[50%] bg-primary/10 blur-3xl" />
          <img src={product.image} alt={product.name} width={1024} height={1024} className="relative h-[28rem] w-full object-contain drop-shadow-2xl lg:h-[39rem] lg:scale-110" />
          <Link to="/produto/$slug" params={{ slug: product.slug }} className="absolute bottom-4 right-0 max-w-[18rem] rounded-[1.5rem] bg-surface/90 p-5 shadow-editorial backdrop-blur-md transition-transform hover:-translate-y-1 lg:bottom-10">
            <p className="label text-primary">Em destaque</p>
            <p className="mt-2 text-sm font-semibold leading-snug">{product.name}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="font-display text-2xl font-semibold">{money(product.price)}</span>
              <ArrowRight className="size-4 text-primary" />
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function QuickRail() {
  const items = [
    { Icon: ShieldCheck, title: "Seminovos revisados", text: "Laudo técnico JB", to: "/loja" as const, search: { cond: "seminovo" as const } },
    { Icon: GitCompareArrows, title: "Compare lado a lado", text: "Até três equipamentos", to: "/comparar" as const },
    { Icon: Truck, title: "Entrega e instalação", text: "Planejada com sua clínica", to: "/loja" as const },
    { Icon: Wrench, title: "Assistência técnica", text: "Direto com a equipe JB", to: "/assistencia" as const },
  ];
  return (
    <div className="mx-auto -mt-1 max-w-[1400px] px-4 sm:px-6">
      <div className="flex snap-x gap-3 overflow-x-auto py-5">
        {items.map(({ Icon, title, text, to, search }) => (
          <Link key={title} to={to} search={search} className="group flex min-w-[17rem] flex-1 snap-start items-center gap-4 rounded-full border border-editorial-line bg-surface px-5 py-4 transition-colors hover:border-primary/30 hover:bg-blush">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="size-4" /></span>
            <span className="min-w-0"><span className="block text-sm font-semibold">{title}</span><span className="block text-xs text-muted-foreground">{text}</span></span>
            <ChevronRight className="ml-auto size-4 shrink-0 text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function EditorialSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-[1400px] px-4 sm:px-6 ${className}`}>{children}</section>;
}

function SectionHeading({ eyebrow, title, copy, action, search }: { eyebrow: string; title: string; copy: string; action: string; search?: { cond: "seminovo" } }) {
  return (
    <div className="grid gap-5 border-t border-editorial-line pt-6 md:grid-cols-[1fr_0.7fr] md:items-end">
      <div>
        <p className="label text-primary">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-[1.02] text-balance sm:text-6xl">{title}</h2>
      </div>
      <div className="md:pb-1">
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">{copy}</p>
        <Link to="/loja" search={search ?? {}} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep">
          {action} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function OfferHero({ product }: { product: Product }) {
  const discount = product.listPrice ? pct(product.listPrice, product.price) : 0;
  return (
    <Reveal>
      <Link to="/produto/$slug" params={{ slug: product.slug }} className="group relative block min-h-[34rem] overflow-hidden rounded-[2.5rem] bg-surface shadow-editorial">
        <div className="absolute right-4 top-4 z-10 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">−{discount}%</div>
        <img src={product.image} alt={product.name} width={1024} height={1024} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
        <div className="editorial-image-wash absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
          <p className="label text-primary">Oferta em destaque · {product.brand}</p>
          <h3 className="mt-3 max-w-xl font-display text-4xl font-medium leading-none sm:text-5xl">{product.name}</h3>
          <div className="mt-5 flex items-end justify-between gap-4"><div>{product.listPrice && <p className="text-xs text-muted-foreground line-through">{money(product.listPrice)}</p>}<p className="font-display text-3xl font-semibold">{money(product.price)}</p></div><span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground"><ArrowRight className="size-4" /></span></div>
        </div>
      </Link>
    </Reveal>
  );
}

function OfferRow({ product, index }: { product: Product; index: number }) {
  return (
    <Reveal delay={index * 50} className="flex flex-1">
      <Link to="/produto/$slug" params={{ slug: product.slug }} className="group grid w-full grid-cols-[7.5rem_minmax(0,1fr)_auto] items-center gap-4 py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto]">
        <img src={product.image} alt={product.name} width={1024} height={1024} loading="lazy" className="aspect-[4/3] w-full rounded-[1.25rem] object-cover transition-transform group-hover:scale-[1.03]" />
        <div className="min-w-0"><p className="label text-primary">0{index} · {product.brand}</p><h3 className="mt-2 text-sm font-semibold leading-snug sm:text-base">{product.name}</h3><p className="mt-2 font-display text-xl font-semibold">{money(product.price)}</p></div>
        <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </Link>
    </Reveal>
  );
}

function ComparePreview({ product, index }: { product: Product; index: number }) {
  return (
    <div className="group px-5 py-8 first:pl-0 last:pr-0 sm:py-2 sm:first:pl-0 sm:last:pr-0">
      <p className="label text-primary">0{index + 1}</p>
      <Link to="/produto/$slug" params={{ slug: product.slug }} className="block">
        <img src={product.image} alt={product.name} width={1024} height={1024} loading="lazy" className="mt-3 aspect-square w-full object-contain transition-transform duration-500 group-hover:-translate-y-2" />
        <p className="text-sm font-semibold leading-snug">{product.name}</p>
      </Link>
      <p className="mt-3 font-display text-2xl font-semibold">{money(product.price)}</p>
      <p className="mt-1 text-xs text-muted-foreground">12x de {money(installment(product.price))}</p>
      <dl className="mt-5 space-y-3 border-t border-editorial-line pt-4 text-xs">
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Garantia</dt><dd className="text-right font-medium">{product.warranty}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Condição</dt><dd className="font-medium">{product.condition === "novo" ? "Novo" : "Seminovo"}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Categoria</dt><dd className="text-right font-medium">{categoryName(product.category)}</dd></div>
      </dl>
    </div>
  );
}

function UsedProduct({ product, index }: { product: Product; index: number }) {
  return (
    <Reveal delay={index * 70}>
      <Link to="/produto/$slug" params={{ slug: product.slug }} className="group grid items-center gap-5 rounded-[1.75rem] border border-editorial-line bg-editorial/75 p-4 transition-colors hover:bg-blush sm:grid-cols-[4rem_11rem_minmax(0,1fr)_auto] sm:p-5">
        <span className="hidden font-display text-4xl font-medium text-primary/25 sm:block">0{index + 1}</span>
        <img src={product.image} alt={product.name} width={1024} height={1024} loading="lazy" className="aspect-[4/3] w-full rounded-[1.25rem] object-cover" />
        <div className="min-w-0"><p className="label text-primary">{product.brand} · Laudo JB</p><h3 className="mt-2 text-lg font-semibold">{product.name}</h3><p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">{product.short}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> {product.warranty}</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> {product.installedBy}</span></div></div>
        <div className="flex items-center justify-between gap-4 sm:block sm:text-right"><p className="font-display text-2xl font-semibold">{money(product.price)}</p><ArrowRight className="mt-3 ml-auto size-4 text-primary transition-transform group-hover:translate-x-1" /></div>
      </Link>
    </Reveal>
  );
}

function CompactProduct({ product, index }: { product: Product; index: number }) {
  return (
    <Reveal delay={index * 50} className="w-[72vw] shrink-0 snap-start sm:w-auto">
      <Link to="/produto/$slug" params={{ slug: product.slug }} className="group block h-full border-t border-editorial-line pt-4">
        <div className="overflow-hidden rounded-[1.5rem] bg-surface"><img src={product.image} alt={product.name} width={1024} height={1024} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" /></div>
        <p className="label mt-4 text-primary">{product.brand}</p><h3 className="mt-2 text-sm font-semibold leading-snug">{product.name}</h3><p className="mt-3 font-display text-xl font-semibold">{money(product.price)}</p>
      </Link>
    </Reveal>
  );
}