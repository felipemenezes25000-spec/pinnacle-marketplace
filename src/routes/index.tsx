import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Armchair,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CreditCard,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Truck,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import { categories, products } from "@/lib/catalog";
import { money, moneyShort, pct } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JB Odonto — marketplace de equipamentos odontológicos" },
      {
        name: "description",
        content:
          "Compre autoclaves, equipos, compressores, ultrassom e seminovos revisados com laudo técnico, 12x sem juros e assistência técnica própria JB.",
      },
      { property: "og:title", content: "JB Odonto — marketplace de equipamentos odontológicos" },
      {
        property: "og:description",
        content:
          "Catálogo com comparação técnica, seminovos revisados e assistência própria em São Paulo.",
      },
    ],
  }),
  component: Home,
});

const icons: Record<string, ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Armchair,
  ScanLine,
};

function Home() {
  const deals = products
    .filter((p) => p.listPrice)
    .sort((a, b) => pct(b.listPrice!, b.price) - pct(a.listPrice!, a.price))
    .slice(0, 4);
  const seminovos = products.filter((p) => p.condition === "seminovo").slice(0, 4);
  const populares = products
    .slice()
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 8);
  const featured = populares[0];
  const cheapest = Math.min(...products.map((p) => p.price));

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="hairgrid-dark relative overflow-hidden bg-chrome text-chrome-foreground">
        <div className="ember-glow pointer-events-none absolute inset-x-0 -top-24 h-[420px]" />
        <div className="relative mx-auto max-w-[1400px] px-4 pb-0 pt-12 sm:px-5 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end">
            <div>
              <p className="label flex items-center gap-2 text-primary-glow">
                <span className="pulse-dot" /> Estoque próprio · São Paulo
              </p>
              <h1 className="headline mt-4 text-[44px] leading-[0.95] text-balance sm:text-[76px]">
                Equipar consultório
                <br />
                sem <span className="text-primary-glow">apostar no escuro.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-[15px]">
                Catálogo de equipamentos novos e seminovos revisados, com ficha técnica completa,
                comparação lado a lado e a mesma equipe que dá assistência depois da venda.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <Link
                  to="/loja"
                  className="press sheen label flex items-center gap-2 rounded-sm bg-primary px-5 py-4 font-medium text-primary-foreground shadow-ember"
                >
                  Ver catálogo completo <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/loja"
                  search={{ cond: "seminovo" as const }}
                  className="press label rounded-sm border border-white/20 px-5 py-4 font-medium text-white/90 transition-colors hover:border-primary-glow hover:text-white"
                >
                  Seminovos revisados
                </Link>
              </div>

              <dl className="mt-9 grid max-w-lg grid-cols-3 gap-px bg-white/10">
                {[
                  { k: `${products.length}`, v: "equipamentos em linha" },
                  { k: "12x", v: "sem juros no cartão" },
                  { k: moneyShort(cheapest), v: "menor preço no catálogo" },
                ].map((s) => (
                  <div key={s.v} className="bg-chrome px-3 py-4">
                    <dt className="numeric text-[22px] leading-none text-primary-glow">{s.k}</dt>
                    <dd className="label mt-1.5 leading-snug text-white/55">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* card de destaque */}
            {featured && (
              <Reveal className="pb-10">
                <p className="label text-white/45">Mais procurado da semana</p>
                <Link
                  to="/produto/$slug"
                  params={{ slug: featured.slug }}
                  className="lift group mt-3 block overflow-hidden rounded-sm border border-white/12 bg-white/[0.03]"
                >
                  <div className="scan-line relative overflow-hidden bg-black/20">
                    <img
                      src={featured.image}
                      alt={featured.name}
                      width={1024}
                      height={1024}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-4">
                    <span className="label text-primary-glow">{featured.brand}</span>
                    <p className="mt-1.5 text-[15px] font-semibold leading-snug">
                      {featured.name}
                    </p>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="numeric text-2xl leading-none">
                        {money(featured.price)}
                      </span>
                      <span className="label text-white/50">{featured.leadTime}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )}
          </div>
        </div>

        {/* faixa de garantias */}
        <div className="relative border-t border-white/10 bg-black/30">
          <div className="mx-auto grid max-w-[1400px] gap-px bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: BadgeCheck, t: "Laudo técnico no seminovo", d: "Nada sai sem revisão de bancada" },
              { Icon: Wrench, t: "Assistência própria", d: "Equipe JB, não terceirizada" },
              { Icon: CreditCard, t: "12x sem juros", d: "Ou PIX com desconto" },
              { Icon: Truck, t: "Entrega agendada", d: "Instalação para equipo e cadeira" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="flex gap-3 bg-chrome/95 px-4 py-4">
                <Icon className="mt-0.5 size-4 shrink-0 text-primary-glow" />
                <div>
                  <p className="text-[13px] font-semibold">{t}</p>
                  <p className="label mt-0.5 text-white/50">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-3 sm:px-5">
        {/* ---------- Categorias ---------- */}
        <section className="py-10">
          <SectionHead
            kicker="Por onde começar"
            title="Escolha pela área do consultório"
            href="/loja"
            cta="Todos os equipamentos"
          />
          <div className="mt-5 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((c, i) => {
              const Icon = icons[c.icon] ?? ShieldCheck;
              const count = products.filter((p) => p.category === c.slug).length;
              return (
                <Reveal key={c.slug} delay={i * 50}>
                  <Link
                    to="/loja"
                    search={{ cat: c.slug }}
                    className="group flex h-full flex-col justify-between bg-surface p-5 transition-colors hover:bg-mist"
                  >
                    <div>
                      <Icon className="size-5 text-primary" />
                      <p className="mt-3 text-[15px] font-semibold leading-snug">{c.name}</p>
                      <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">
                        {c.blurb}
                      </p>
                    </div>
                    <span className="label mt-5 flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {count} itens <ArrowRight className="size-3.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ---------- Ofertas ---------- */}
        <section className="pb-10">
          <SectionHead
            kicker="Preço abaixo do de tabela"
            title="Ofertas com desconto real"
            href="/loja"
            cta="Ver tudo"
          />
          <div className="mt-5 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* ---------- Comparar ---------- */}
        <Reveal className="plate flex flex-col gap-4 bg-chrome p-6 text-chrome-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="label flex items-center gap-2 text-primary-glow">
              <BarChart3 className="size-3.5" /> Ferramenta de comparação
            </p>
            <h2 className="headline mt-2 text-3xl">
              Coloque até 3 equipamentos frente a frente
            </h2>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-white/65">
              Preço, potência, capacidade, garantia, prazo e instalação na mesma tabela — sem abrir
              cinco abas.
            </p>
          </div>
          <Link
            to="/comparar"
            className="press label shrink-0 rounded-sm bg-primary px-5 py-4 text-center font-medium text-primary-foreground shadow-ember"
          >
            Abrir comparação
          </Link>
        </Reveal>

        {/* ---------- Seminovos ---------- */}
        <section className="py-10">
          <SectionHead
            kicker="Revisado na bancada JB"
            title="Seminovos com laudo e garantia"
            href="/loja"
            cta="Ver seminovos"
            search={{ cond: "seminovo" as const }}
          />
          <div
            className={`mt-5 grid gap-px bg-hairline sm:grid-cols-2 ${
              seminovos.length >= 4 ? "lg:grid-cols-4" : seminovos.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            }`}
          >
            {seminovos.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* ---------- Populares ---------- */}
        <section className="pb-10">
          <SectionHead
            kicker="O que as clínicas mais levam"
            title="Mais avaliados pelos dentistas"
            href="/loja"
            cta="Catálogo completo"
          />
          <div className="mt-5 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {populares.map((p) => (
              <ProductCard key={p.slug} product={p} dense />
            ))}
          </div>
        </section>

        {/* ---------- Assistência ---------- */}
        <section className="pb-14">
          <div className="grid gap-px bg-hairline lg:grid-cols-[1fr_1.2fr]">
            <div className="bg-surface p-6 sm:p-8">
              <p className="label flex items-center gap-2 text-primary">
                <Wrench className="size-3.5" /> Depois da compra
              </p>
              <h2 className="headline mt-2 text-3xl">
                A assistência é nossa, não de terceiros
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Autoclave que trava, compressor que perde pressão, equipo com vazamento: o chamado
                entra direto na bancada da JB, com diagnóstico e orçamento antes de qualquer reparo.
              </p>
              <Link
                to="/assistencia"
                className="press label mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-3.5 font-medium text-primary-foreground shadow-ember"
              >
                Abrir chamado técnico <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-px bg-hairline sm:grid-cols-2">
              {[
                { n: "01", t: "Triagem", d: "Sintoma classificado por urgência" },
                { n: "02", t: "Orçamento", d: "Peças e prazo antes do reparo" },
                { n: "03", t: "Reparo", d: "Bancada JB ou visita técnica" },
                { n: "04", t: "Histórico", d: "Registro guardado no equipamento" },
              ].map((s) => (
                <div key={s.n} className="bg-surface p-6">
                  <span className="numeric text-primary">{s.n}</span>
                  <p className="mt-1.5 text-sm font-semibold">{s.t}</p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  href,
  cta,
  search,
}: {
  kicker: string;
  title: string;
  href: "/loja";
  cta: string;
  search?: { cond?: "novo" | "seminovo"; cat?: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="label text-primary">{kicker}</p>
        <h2 className="headline mt-2 text-3xl sm:text-[34px]">{title}</h2>
      </div>
      <Link
        to={href}
        search={search ?? {}}
        className="label underline-sweep flex items-center gap-1.5 pb-1 font-medium hover:text-primary"
      >
        {cta} <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
