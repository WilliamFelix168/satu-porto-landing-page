/** Indonesian locale: dot as the thousands separator, comma for decimals. */
export const DISPLAY_LOCALE = "id-ID";
export const DISPLAY_CURRENCY = "IDR";
/** Rupiah amounts are shown without sen. */
export const IDR_FRACTION_DIGITS = 0;
/** Percent changes are shown with one decimal place. */
export const PERCENT_FRACTION_DIGITS = 1;

const idrFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
  style: "currency",
  currency: DISPLAY_CURRENCY,
  maximumFractionDigits: IDR_FRACTION_DIGITS,
  minimumFractionDigits: IDR_FRACTION_DIGITS,
});

const percentFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
  minimumFractionDigits: PERCENT_FRACTION_DIGITS,
  maximumFractionDigits: PERCENT_FRACTION_DIGITS,
  signDisplay: "always",
});

/** Keeps "Rp" and the amount on one line, whatever space the ICU build emits. */
const NO_BREAK_SPACE = "\u00A0";

/** `142380000` becomes `Rp 142.380.000` (with a no-break space). */
export function formatIdr(amount: number): string {
  return idrFormatter.format(amount).replace(/\s/u, NO_BREAK_SPACE);
}

/** `3.2` becomes `+3,2%`; `-0.8` becomes `-0,8%`. */
export function formatPercentChange(percent: number): string {
  return `${percentFormatter.format(percent)}%`;
}
