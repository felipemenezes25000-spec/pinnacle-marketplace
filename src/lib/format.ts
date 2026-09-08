const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const brlCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export const money = (v: number) => brl.format(v);
export const moneyShort = (v: number) => brlCompact.format(v);
export const pct = (from: number, to: number) => Math.round(((from - to) / from) * 100);
