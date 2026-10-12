import {
  aiContent,
  type ReceiptItem,
  type ScreenshotHolding,
} from "@/lib/content";
import { formatIdr } from "@/lib/format";

/**
 * Display-ready values for the AI showcase visuals. Call these from server
 * components only and pass the result down as props, so no `Intl` formatting
 * runs in the client visuals and server and client text always match.
 */

export interface DisplayHolding extends ScreenshotHolding {
  value: string;
}

export interface SnapImportDisplay {
  totalValue: string;
  holdings: DisplayHolding[];
}

export interface DisplayReceiptItem extends ReceiptItem {
  price: string;
}

export interface ReceiptScanDisplay {
  total: string;
  items: DisplayReceiptItem[];
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function getSnapImportDisplay(): SnapImportDisplay {
  const { holdings } = aiContent.snapImport;
  return {
    totalValue: formatIdr(sum(holdings.map((holding) => holding.valueIdr))),
    holdings: holdings.map((holding) => ({
      ...holding,
      value: formatIdr(holding.valueIdr),
    })),
  };
}

export function getReceiptScanDisplay(): ReceiptScanDisplay {
  const { items } = aiContent.receiptScan;
  return {
    total: formatIdr(sum(items.map((item) => item.priceIdr))),
    items: items.map((item) => ({ ...item, price: formatIdr(item.priceIdr) })),
  };
}
