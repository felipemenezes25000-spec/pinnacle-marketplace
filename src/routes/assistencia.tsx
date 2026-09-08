import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, MapPin, Phone, Wrench } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistencia")({
  head: () => ({
    meta: [
      { title: "Assistência técnica odontológica | JB Odonto" },
      {
        name: "description",
        content:
          "Abra um chamado para autoclave, equipo, compressor ou motor de implante. Equipe técnica própria JB em São Paulo, com triagem, orçamento e histórico.",
      },
      { property: "og:title", content: "Assistência técnica odontológica | JB Odonto" },
      {
        property: "og:description",
        content: "Triagem, orçamento e reparo com equipe própria JB em São Paulo.",
      },
    ],
  }),
  component: Assistencia,
});

const steps = [
  { n: "01", title: "Triagem", text: "Descreva o sintoma e a equipe classifica a urgência." },
  { n: "02", title: "Orçamento", text: "Você recebe peças, prazo e valor antes de qualquer reparo." },
  { n: "03", title: "Reparo", text: "Bancada na JB ou visita técnica no consultório." },
  { n: "04", title: "Histórico", text: "O atendimento fica registrado no equipamento." },
];

const equipamentos = [
  "Autoclave",
  "Cadeira / equipo",
  "Compressor",
  "Ultrassom / profilaxia",
  "Motor de implante",
  "Raio-x",
  "Sugador / aspirador",
  "Outro",
];

function Assistencia() {
  const [tipo, setTipo] = useState(equipamentos[0]);
  const [urgencia, setUrgencia] = useState<"parado" | "intermitente" | "preventiva">("parado");
  const [sent, setSent] = useState(false);

  return (
    <div>
      {/* faixa */}
      <section className="hairgrid-dark relative overflow-hidden bg-chrome text-chrome-foreground">
        <div className="ember-glow pointer-events-none absolute inset-x-0 top-0 h-64" />
        <div className="relative mx-auto max-w-[1400px] px-4 py-12 sm:px-5 sm:py-16">
          <p className="label flex items-center gap-2 text-primary-glow">
            <Wrench className="size-3.5" /> Assistência técnica própria
          </p>
          <h1 className="headline mt-3 max-w-3xl text-4xl text-balance sm:text-6xl">
            Equipamento parado tem fila própria.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
            Nossa equipe fica em São Paulo e atende os mesmos equipamentos que vende. Abra o chamado
            aqui e a triagem começa no próximo dia útil.
          </p>
          <div className="label mt-6 flex flex-wrap gap-x-6 gap-y-2 text-white/60">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" /> Segunda a sexta, 8h às 18h30
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> Bancada própria em São Paulo
            </span>
            <a
              href="tel:+551137156362"
              className="flex items-center gap-1.5 hover:text-primary-glow"
            >
              <Phone className="size-3.5" /> (11) 3715-6362
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-3 py-8 sm:px-5">
        {/* etapas */}
        <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 60} className="bg-surface p-5">
              <span className="numeric text-primary">{s.n}</span>
              <p className="mt-1.5 text-sm font-semibold">{s.title}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{s.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* formulário */}
          <div className="plate p-5">
            <p className="label text-muted-foreground">Abrir chamado</p>
            <h2 className="headline mt-2 text-2xl">Conte o que está acontecendo</h2>

            {sent ? (
              <div className="mt-6 flex flex-col items-start gap-3 rounded-sm border border-primary bg-accent p-5">
                <CheckCircle2 className="size-6 text-primary" />
                <p className="text-sm font-semibold text-primary-deep">
                  Chamado registrado nesta demonstração.
                </p>
                <p className="text-[13px] leading-snug text-primary-deep/80">
                  Para um atendimento real agora, chame no WhatsApp (11) 96341-7994 — o formulário
                  ainda não envia e-mail porque a plataforma não está ligada a um servidor.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="label press mt-1 rounded-sm bg-chrome px-3 py-2.5 font-medium text-chrome-foreground"
                >
                  Abrir outro
                </button>
              </div>
            ) : (
              <form
                className="mt-5 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <p className="label text-muted-foreground">Equipamento</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {equipamentos.map((eq) => (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => setTipo(eq)}
                        className={cn(
                          "press rounded-sm border px-2.5 py-2 text-[12.5px] transition-colors",
                          tipo === eq
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-hairline hover:border-chrome",
                        )}
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="label text-muted-foreground">Situação</p>
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
                    {(
                      [
                        { k: "parado", t: "Parado agora", d: "Não liga ou não completa o ciclo" },
                        { k: "intermitente", t: "Falha às vezes", d: "Funciona, mas com erro" },
                        { k: "preventiva", t: "Preventiva", d: "Revisão programada" },
                      ] as const
                    ).map((o) => (
                      <button
                        key={o.k}
                        type="button"
                        onClick={() => setUrgencia(o.k)}
                        className={cn(
                          "press rounded-sm border p-3 text-left transition-colors",
                          urgencia === o.k
                            ? "border-primary bg-accent"
                            : "border-hairline hover:border-chrome",
                        )}
                      >
                        <span className="block text-[13px] font-semibold">{o.t}</span>
                        <span className="mt-0.5 block text-[11.5px] text-muted-foreground">
                          {o.d}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Clínica ou responsável" placeholder="Clínica Sorriso / Dra. Ana" />
                  <Field label="Telefone com WhatsApp" placeholder="(11) 90000-0000" type="tel" />
                  <Field label="E-mail" placeholder="contato@clinica.com.br" type="email" />
                  <Field label="Cidade" placeholder="São Paulo — SP" />
                </div>

                <div>
                  <p className="label text-muted-foreground">Descreva o sintoma</p>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ex.: autoclave interrompe o ciclo em 40% e mostra erro E2."
                    className="mt-2 w-full rounded-sm border border-hairline bg-surface p-3 text-[13px] outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="press sheen label w-full rounded-sm bg-primary py-4 font-medium text-primary-foreground shadow-ember"
                >
                  Enviar chamado
                </button>
              </form>
            )}
          </div>

          {/* lateral */}
          <div className="space-y-3">
            <div className="plate bg-chrome p-5 text-chrome-foreground">
              <p className="label text-primary-glow">Precisa de resposta hoje</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/80">
                Equipamento parado com paciente agendado? Chame direto no WhatsApp que a triagem é
                imediata no horário comercial.
              </p>
              <a
                href="https://wa.me/5511963417994?text=Ol%C3%A1!%20Preciso%20de%20assist%C3%AAncia%20t%C3%A9cnica."
                target="_blank"
                rel="noreferrer"
                className="label press mt-4 block rounded-sm bg-primary px-3 py-3 text-center font-medium text-primary-foreground"
              >
                WhatsApp (11) 96341-7994
              </a>
            </div>

            <div className="plate p-5">
              <p className="label text-muted-foreground">O que já vem incluso</p>
              <ul className="mt-3 space-y-2.5 text-[13px]">
                {[
                  "Diagnóstico com laudo antes do orçamento",
                  "Peças originais e nota fiscal",
                  "90 dias de garantia sobre o serviço",
                  "Histórico do equipamento guardado com a JB",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="plate p-5">
              <p className="label text-muted-foreground">Precisa trocar em vez de consertar?</p>
              <p className="mt-2 text-[13px] leading-snug">
                Às vezes o reparo não compensa. Compare o custo com um seminovo revisado com
                garantia JB.
              </p>
              <Link
                to="/loja"
                search={{ cond: "seminovo" as const }}
                className="label press mt-3 inline-block rounded-sm border border-hairline px-3 py-2.5 font-medium hover:border-primary"
              >
                Ver seminovos revisados
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="label text-muted-foreground">{label}</span>
      <input
        required
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-hairline bg-surface px-3 py-2.5 text-[13px] outline-none focus:border-primary"
      />
    </label>
  );
}
