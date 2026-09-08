import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Revela o conteúdo quando ele entra na viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Já visível no primeiro quadro (conteúdo acima da dobra).
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      setShown(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0 },
    );
    io.observe(el);
    // Rede de segurança: nunca deixar conteúdo invisível.
    const t = setTimeout(() => setShown(true), 1200);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
