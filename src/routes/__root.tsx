import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StoreProvider, useStore } from "../lib/store";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { CompareBar } from "../components/compare-bar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label text-primary">Erro 404</p>
        <h1 className="headline mt-3 text-5xl">Página não encontrada</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          O endereço não existe ou o equipamento saiu do catálogo.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            to="/loja"
            className="label press rounded-sm bg-primary px-4 py-3 font-medium text-primary-foreground shadow-ember"
          >
            Ver catálogo
          </Link>
          <Link
            to="/"
            className="label press rounded-sm border border-hairline px-4 py-3 font-medium"
          >
            Início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="headline text-3xl">Esta página não carregou</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Algo falhou do nosso lado. Tente novamente ou volte ao catálogo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="label press rounded-sm bg-primary px-4 py-3 font-medium text-primary-foreground"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="label press rounded-sm border border-hairline px-4 py-3 font-medium"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JB Odonto — Marketplace de equipamentos odontológicos" },
      {
        name: "description",
        content:
          "Compre autoclaves, ultrassom, equipos e cadeiras com assistência técnica própria JB. Novos e seminovos revisados, 12x sem juros.",
      },
      { name: "author", content: "JB Soluções Odontológicas" },
      { property: "og:title", content: "JB Odonto — Marketplace de equipamentos odontológicos" },
      {
        property: "og:description",
        content:
          "Equipamentos novos e seminovos com laudo técnico, instalação e assistência própria da JB.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#111111" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function FlashToast() {
  const { flash } = useStore();
  if (!flash) return null;
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 px-4">
      <div className="reveal-up flex items-center gap-2 rounded-sm bg-chrome px-4 py-3 text-chrome-foreground shadow-lift">
        <span className="size-1.5 rounded-full bg-primary pulse-dot" />
        <span className="text-[13px] font-medium">{flash}</span>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          <SiteFooter />
          <CompareBar />
          <FlashToast />
          <div className="h-16" />
        </div>
      </StoreProvider>
    </QueryClientProvider>
  );
}
