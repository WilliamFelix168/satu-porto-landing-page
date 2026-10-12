import {
  ChartCandlestick,
  CircleDollarSign,
  ImageUp,
  Lightbulb,
  ReceiptText,
  Scale,
  ScanText,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { WaitlistError } from "@/lib/waitlist";

/* -------------------------------------------------------------------------- */
/* Sections and navigation                                                    */
/* -------------------------------------------------------------------------- */

/** Every in-page anchor target. Nav links may only point at these. */
export enum SectionId {
  Top = "top",
  Features = "features",
  Ai = "ai",
  HowItWorks = "how-it-works",
  Pricing = "pricing",
  Faq = "faq",
  Waitlist = "waitlist",
}

/** Heading ids that sections reference through aria-labelledby. */
export enum HeadingId {
  Hero = "hero-title",
  Marquee = "marquee-title",
  Features = "features-title",
  Ai = "ai-title",
  HowItWorks = "how-it-works-title",
  Pricing = "pricing-title",
  Faq = "faq-title",
  Cta = "cta-title",
}

export type SectionHref = `#${SectionId}`;

export function sectionHref(id: SectionId): SectionHref {
  return `#${id}`;
}

export interface NavLink {
  label: string;
  href: SectionHref;
}

export const brand = {
  name: "SatuPorto",
  domain: "SatuPorto.biz.id",
  tagline: "Portfolio dan pengeluaran, dalam satu tempat.",
} as const;

export const navLinks: readonly NavLink[] = [
  { label: "Fitur", href: sectionHref(SectionId.Features) },
  { label: "AI", href: sectionHref(SectionId.Ai) },
  { label: "Cara Kerja", href: sectionHref(SectionId.HowItWorks) },
  { label: "Harga", href: sectionHref(SectionId.Pricing) },
];

/** The footer also links the FAQ (the navbar has no room for a fifth link). */
export const footerLinks: readonly NavLink[] = [
  ...navLinks,
  { label: "FAQ", href: sectionHref(SectionId.Faq) },
];

export const navbarContent = {
  primaryNavLabel: "Utama",
  homeLabel: "Beranda SatuPorto",
  joinWaitlistLabel: "Gabung Waitlist",
  openMenuLabel: "Buka menu",
  closeMenuLabel: "Tutup menu",
} as const;

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The OJK-safe disclaimer, shown under the AI section and repeated in the
 * investment-advice FAQ answer (and so in the FAQ JSON-LD).
 */
export const FINANCIAL_ADVICE_DISCLAIMER =
  "Insight hanya bersifat informasi, bukan nasihat keuangan.";

export const siteMetadata = {
  /** Search title: at most TITLE_MAX_LENGTH characters (lib/site.ts; tested). */
  title: "SatuPorto: Pantau Portfolio Saham, Kripto & Pengeluaran",
  /** Search snippet: at most DESCRIPTION_MAX_LENGTH characters (lib/site.ts; tested). */
  description:
    "Satu aplikasi untuk pantau saham, kripto, dan catat pengeluaran otomatis. Lihat net worth kamu secara real-time. Gabung waitlist early access gratis.",
  /** Indonesian search terms this page targets (see the README keyword map). */
  keywords: [
    "aplikasi pencatat keuangan",
    "aplikasi catat pengeluaran",
    "tracker portfolio saham dan kripto",
    "aplikasi pantau investasi",
    "cek net worth",
    "kekayaan bersih",
    "aplikasi keuangan pribadi",
    "catat pengeluaran otomatis dari struk",
    // Search phrasing; visible copy uses the KBBI spelling "impor".
    "import portfolio dari screenshot",
    "pantau saham IDX dan kripto",
  ],
  ogImageAlt:
    "SatuPorto: satu dashboard untuk portfolio saham, kripto, dan pengeluaranmu.",
  ogImageTagline: "Pantau saham, kripto & pengeluaran di satu aplikasi",
  /** `<html lang>`: the whole site is in Indonesian. */
  language: "id",
  locale: "id_ID",
  /** Browser UI colour; matches the pure black page background. */
  themeColor: "#000000",
} as const;

/* -------------------------------------------------------------------------- */
/* Waitlist form                                                              */
/* -------------------------------------------------------------------------- */

export const waitlistFormContent = {
  inputLabel: "Alamat email",
  placeholder: "nama@email.com",
  submitLabel: "Dapatkan Early Access",
  submittingLabel: "Mendaftarkan…",
  successTitle: "Kamu sudah masuk daftar!",
  successBody: (email: string) =>
    `Kami akan kabari ${email} begitu early access dibuka.`,
  errors: {
    [WaitlistError.Empty]: "Masukkan alamat emailmu dulu, ya.",
    [WaitlistError.TooLong]: "Alamat email ini terlalu panjang.",
    [WaitlistError.Malformed]:
      "Masukkan alamat email yang valid, contohnya nama@email.com.",
    [WaitlistError.SubmitFailed]:
      "Terjadi kesalahan. Coba lagi dalam beberapa saat, ya.",
  } satisfies Record<WaitlistError, string>,
} as const;

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const heroContent = {
  badge: { emoji: "✨", label: "Early Access SatuPorto segera dibuka" },
  headline: {
    lead: "Satu Dashboard untuk",
    highlight: "Portfolio & Pengeluaranmu",
    trail: ".",
  },
  subheadline:
    "Aplikasi keuangan pribadi untuk pantau saham IDX, kripto, dan pengeluaran harianmu di satu tempat. Pegang kendali penuh atas net worth kamu.",
  formNote: "Gratis selama early access. Tanpa spam, bisa berhenti kapan saja.",
} as const;

/* -------------------------------------------------------------------------- */
/* Dashboard preview (mock data, IDR)                                         */
/* -------------------------------------------------------------------------- */

export enum AssetClass {
  Crypto = "crypto",
  Stock = "stock",
}

/** How each asset class is labelled on the cards. */
export const assetClassLabels: Record<AssetClass, string> = {
  [AssetClass.Crypto]: "Kripto",
  [AssetClass.Stock]: "Saham",
};

export interface MockAsset {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  valueIdr: number;
  changePercent: number;
}

export interface MockExpense {
  label: string;
  category: string;
  amountIdr: number;
}

/**
 * One simulated price move in the hero dashboard: the holding's value moves
 * by `deltaIdr` and its change becomes `changePercent`. Over a full cycle each
 * holding's deltas sum to zero, so the loop returns to the starting values.
 */
export interface PriceTick {
  symbol: string;
  deltaIdr: number;
  changePercent: number;
}

export interface TrendPoint {
  label: string;
  /** Height of the bar relative to the tallest bar, 0 to 100. */
  relativeHeight: number;
}

export const dashboardContent = {
  accessibleLabel:
    "Pratinjau dashboard SatuPorto: total net worth, tren 12 bulan, aset kripto dan saham, serta pengeluaran hari ini.",
  windowTitle: "satuporto.biz.id/dashboard",
  netWorthLabel: "Total net worth",
  netWorthIdr: 487_250_000,
  netWorthChangePercent: 12.4,
  netWorthChangeLabel: "bulan ini",
  trendLabel: "Net worth, 12 bulan terakhir",
  trend: [
    { label: "Nov", relativeHeight: 38 },
    { label: "Des", relativeHeight: 44 },
    { label: "Jan", relativeHeight: 41 },
    { label: "Feb", relativeHeight: 52 },
    { label: "Mar", relativeHeight: 49 },
    { label: "Apr", relativeHeight: 58 },
    { label: "Mei", relativeHeight: 63 },
    { label: "Jun", relativeHeight: 60 },
    { label: "Jul", relativeHeight: 71 },
    { label: "Agu", relativeHeight: 78 },
    { label: "Sep", relativeHeight: 86 },
    { label: "Okt", relativeHeight: 100 },
  ] satisfies TrendPoint[],
  ticks: [
    { symbol: "BTC", deltaIdr: 380_000, changePercent: 3.5 },
    { symbol: "ETH", deltaIdr: -150_000, changePercent: -1.1 },
    { symbol: "GOTO", deltaIdr: 90_000, changePercent: 5.3 },
    { symbol: "BTC", deltaIdr: -380_000, changePercent: 3.2 },
    { symbol: "ETH", deltaIdr: 150_000, changePercent: -0.8 },
    { symbol: "GOTO", deltaIdr: -90_000, changePercent: 4.6 },
  ] satisfies PriceTick[],
  assetsTitle: "Aset",
  assets: [
    {
      symbol: "BTC",
      name: "Bitcoin",
      assetClass: AssetClass.Crypto,
      valueIdr: 142_380_000,
      changePercent: 3.2,
    },
    {
      symbol: "BBCA",
      name: "Bank Central Asia",
      assetClass: AssetClass.Stock,
      valueIdr: 96_750_000,
      changePercent: 1.1,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      assetClass: AssetClass.Crypto,
      valueIdr: 58_920_000,
      changePercent: -0.8,
    },
    {
      symbol: "GOTO",
      name: "GoTo Gojek Tokopedia",
      assetClass: AssetClass.Stock,
      valueIdr: 12_600_000,
      changePercent: 4.6,
    },
  ] satisfies MockAsset[],
  expensesTitle: "Pengeluaran hari ini",
  monthlySpendLabel: "Terpakai bulan ini",
  monthlySpendIdr: 6_840_000,
  expenses: [
    { label: "Belanja dapur", category: "Belanja", amountIdr: 412_500 },
    { label: "Ojek ke kantor", category: "Transportasi", amountIdr: 38_000 },
    { label: "Es kopi susu", category: "Makanan", amountIdr: 32_000 },
  ] satisfies MockExpense[],
} as const;

/* -------------------------------------------------------------------------- */
/* Marquee                                                                    */
/* -------------------------------------------------------------------------- */

export const marqueeContent = {
  label: "Saham & kripto yang didukung",
  assets: [
    "BTC",
    "ETH",
    "AAPL",
    "TSLA",
    "GOTO",
    "SOL",
    "BBCA",
    "NVDA",
    "TLKM",
    "BNB",
    "MSFT",
    "BMRI",
  ],
  more: "dan 10.000+ lainnya",
  pauseLabel: "Jeda ticker",
  playLabel: "Putar ticker",
} as const;

/* -------------------------------------------------------------------------- */
/* Features bento                                                             */
/* -------------------------------------------------------------------------- */

export enum FeatureVisual {
  AssetSync = "asset-sync",
  ExpenseCategories = "expense-categories",
  NetWorthSplit = "net-worth-split",
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  visual: FeatureVisual;
}

export interface ExpenseCategoryShare {
  label: string;
  percent: number;
}

export const featuresContent = {
  eyebrow: "Fitur",
  title: "Satu aplikasi untuk catat keuangan dan pantau investasi.",
  description:
    "Portfolio saham dan kripto, pengeluaran harian, dan kekayaan bersihmu akhirnya ada di satu tempat, jadi setiap rupiah jelas arahnya.",
  features: [
    {
      title: "Pantau Saham & Kripto",
      description:
        "Saham IDX, saham US, dan wallet kripto dalam satu tampilan, dengan harga yang tersinkron real time.",
      icon: ChartCandlestick,
      visual: FeatureVisual.AssetSync,
    },
    {
      title: "Catat Pengeluaran Otomatis",
      description:
        "Catat pengeluaran dalam hitungan detik, kategorinya terisi otomatis.",
      icon: ReceiptText,
      visual: FeatureVisual.ExpenseCategories,
    },
    {
      title: "Cek Net Worth Kamu",
      description:
        "Lihat kekayaan bersihmu: berapa yang kamu miliki dan berapa yang kamu habiskan.",
      icon: Scale,
      visual: FeatureVisual.NetWorthSplit,
    },
  ] satisfies Feature[],
  // Kept in English on purpose: the client approved "Live sync" as a
  // familiar fintech term.
  assetSyncLabel: "Live sync",
  screenshotImportLabel: "Impor screenshot",
  assetSyncValueLabel: "Nilai portfolio",
  assetSyncValueIdr: 310_650_000,
  /** Portfolio value over time, each point 0 to 100 relative to the peak. */
  assetSyncTrend: [
    22, 30, 26, 38, 34, 47, 43, 55, 51, 66, 61, 74, 70, 86, 82, 100,
  ],
  assetSyncSymbols: [
    "BTC",
    "ETH",
    "SOL",
    "BBCA",
    "GOTO",
    "AAPL",
    "TSLA",
    "NVDA",
  ],
  /**
   * Later portfolio values. Each loop of the card slides the chart one point
   * further along `assetSyncTrend` followed by these (raw values; the chart
   * rescales every window to its own peak).
   */
  assetSyncExtension: [97, 112, 108, 121],
  expenseLog: {
    monthLabel: "Bulan ini",
    /** Spending logged earlier this month, before the entries below. */
    monthToDateIdr: 6_257_500,
    /**
     * Oldest first. The card shows the latest three; each loop step pushes
     * the next one in at the top.
     */
    entries: [
      { label: "Belanja dapur", category: "Belanja", amountIdr: 412_500 },
      { label: "Listrik", category: "Tagihan", amountIdr: 385_000 },
      { label: "Makan siang", category: "Makanan", amountIdr: 45_000 },
      { label: "Es kopi susu", category: "Makanan", amountIdr: 32_000 },
      { label: "Ojek ke kantor", category: "Transportasi", amountIdr: 38_000 },
      { label: "Tagihan internet", category: "Tagihan", amountIdr: 512_500 },
    ] satisfies MockExpense[],
  },
  expenseCategories: [
    { label: "Makanan", percent: 42 },
    { label: "Tagihan", percent: 25 },
    { label: "Transportasi", percent: 18 },
  ] satisfies ExpenseCategoryShare[],
  netWorthSplit: {
    figureLabel: "Net worth",
    ownedLabel: "Dimiliki",
    spentLabel: "Terpakai",
    ownedPercent: 86,
    totalAssetsLabel: "Total aset",
    totalAssetsIdr: 523_400_000,
    spentThisMonthLabel: "Terpakai bulan ini",
    /** 0 to 100, relative to the latest value. */
    trend: [52, 58, 55, 66, 63, 74, 80, 77, 88, 100],
    updatedLabel: "Baru saja diperbarui",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* SatuPorto AI                                                                */
/* -------------------------------------------------------------------------- */

export enum AiVisual {
  SnapImport = "snap-import",
  ReceiptScan = "receipt-scan",
  Insights = "insights",
}

export interface AiFeature {
  title: string;
  description: string;
  bullets: readonly string[];
  icon: LucideIcon;
  visual: AiVisual;
}

export interface ScreenshotHolding {
  symbol: string;
  name: string;
  quantity: string;
  valueIdr: number;
}

export interface ReceiptItem {
  name: string;
  priceIdr: number;
}

export enum InsightTone {
  Spending = "spending",
  Savings = "savings",
  Allocation = "allocation",
}

export interface Insight {
  tone: InsightTone;
  text: string;
}

/**
 * Compliance (OJK): this section describes information and savings
 * opportunities only. Never phrase copy as investment advice, buy or sell
 * recommendations, or promised returns.
 */
export const aiContent = {
  badge: "SatuPorto AI",
  title: "Catat lebih sedikit.",
  titleHighlight: "Pahami lebih banyak.",
  description:
    "Impor portfolio dari screenshot dan catat pengeluaran otomatis dari struk. SatuPorto AI mengisi detailnya, lalu menjelaskan angka-angkamu dengan bahasa yang mudah dipahami.",
  disclaimer: FINANCIAL_ADVICE_DISCLAIMER,
  features: [
    {
      title: "Impor portfolio dari screenshot",
      description:
        "Unggah screenshot dari aplikasi exchange atau sekuritasmu, seperti Indodax, Binance, Stockbit, atau Ajaib, dan SatuPorto membaca asetmu secara otomatis.",
      bullets: [
        "Kripto dan saham IDX sekaligus",
        "Ticker, jumlah, dan nilai terdeteksi",
        "Cek semuanya sebelum disimpan",
      ],
      icon: ImageUp,
      visual: AiVisual.SnapImport,
    },
    {
      title: "Scan struk jadi pengeluaran",
      description:
        "Foto invoice atau struk belanjamu. Nominal, merchant, tanggal, dan kategorinya terisi otomatis.",
      bullets: [
        "Bisa untuk struk cetak dan invoice",
        "Kategori otomatis dari nama merchant",
        "Ubah isian apa pun dengan sekali ketuk",
      ],
      icon: ScanText,
      visual: AiVisual.ReceiptScan,
    },
    {
      title: "Insight pintar",
      description:
        "Analisis pengeluaran, peluang hemat, dan tren net worth, dijelaskan dengan bahasa sehari-hari.",
      bullets: [
        "Tahu di mana pengeluaranmu berubah",
        "Lihat dampak menabung lebih banyak ke targetmu",
        "Pahami dari mana net worth kamu berasal",
      ],
      icon: Lightbulb,
      visual: AiVisual.Insights,
    },
  ] satisfies AiFeature[],
  snapImport: {
    screenTitle: "Portfolio",
    screenTotalLabel: "Nilai total",
    holdings: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        quantity: "0,0842",
        valueIdr: 142_380_000,
      },
      {
        symbol: "BBCA",
        name: "Bank Central Asia",
        quantity: "102 lot",
        valueIdr: 96_750_000,
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        quantity: "0,95",
        valueIdr: 58_920_000,
      },
      {
        symbol: "GOTO",
        name: "GoTo",
        quantity: "1.800 lot",
        valueIdr: 12_600_000,
      },
    ] satisfies ScreenshotHolding[],
    detectedLabel: "Aset terdeteksi",
    importing: (done: number, total: number) =>
      `Mengimpor… ${done} dari ${total} aset`,
    imported: "Selesai diimpor",
  },
  receiptScan: {
    merchant: "Fresh Market",
    branch: "Kemang, Jakarta",
    /** Shown on the receipt; `dateIso` is the same day, for the weekday test. */
    date: "Sab, 10 Okt",
    dateIso: "2026-10-10",
    items: [
      { name: "Susu segar 1L", priceIdr: 24_500 },
      { name: "Telur kampung", priceIdr: 38_000 },
      { name: "Beras pandan 5kg", priceIdr: 89_000 },
      { name: "Dada ayam fillet", priceIdr: 72_000 },
    ] satisfies ReceiptItem[],
    totalLabel: "Total",
    parsedTitle: "Pengeluaran baru",
    fieldLabels: {
      merchant: "Merchant",
      date: "Tanggal",
      category: "Kategori",
      amount: "Nominal",
    },
    category: "Belanja",
    toast: "Pengeluaran ditambahkan",
  },
  insightsPanel: {
    assistantName: "SatuPorto AI",
    composerPlaceholder: "Tanya soal pengeluaranmu…",
    insights: [
      {
        tone: InsightTone.Spending,
        text: "Pengeluaran food delivery naik 32% dibanding bulan lalu.",
      },
      {
        tone: InsightTone.Savings,
        // Pre-formatted (id-ID) so no Intl call runs in the client visual.
        text: "Menabung Rp\u00A01.500.000/bulan bisa membuat targetmu tercapai 4 bulan lebih cepat.",
      },
      {
        tone: InsightTone.Allocation,
        text: "Kripto mencakup 41% dari net worth kamu.",
      },
    ] satisfies Insight[],
    allocation: { label: "Kripto", caption: "dari net worth", percent: 41 },
    savings: {
      label: "Target tabungan",
      caption: "4 bulan lebih cepat",
      /** Projected balance, each point 0 to 100 relative to the goal. */
      trend: [8, 16, 22, 31, 38, 49, 57, 68, 79, 100],
    },
  },
} as const;

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

export interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  visual: StepVisual;
}

export enum StepVisual {
  Connect = "connect",
  Receipt = "receipt",
  Trend = "trend",
}

export const howItWorksContent = {
  eyebrow: "Cara Kerja",
  title: "Mulai pantau keuanganmu dalam tiga langkah.",
  stepLabel: "Langkah",
  visuals: {
    connect: {
      foundLabel: "4 aset ditemukan",
      /** Widths (percent) of the rows on the mini screenshot. */
      lineWidths: [80, 60, 72, 52],
    },
    receipt: {
      /** Widths (percent) of the item lines on the mini receipt. */
      lineWidths: [70, 86, 58],
      merchant: "Fresh Market",
      category: "Belanja",
      amountIdr: 223_500,
    },
    trend: {
      label: "Net worth",
      /** 0 to 100, relative to the latest value. */
      values: [30, 38, 35, 52, 48, 66, 74, 100],
    },
  },
  steps: [
    {
      title: "Tambahkan portfoliomu",
      description:
        "Hubungkan akunmu atau unggah screenshot dari aplikasi exchange atau sekuritas, dan semua asetmu terkumpul di satu portfolio.",
      icon: ImageUp,
      visual: StepVisual.Connect,
    },
    {
      title: "Catat pengeluaranmu",
      description:
        "Scan struk atau tambahkan pengeluaran dalam hitungan detik. Kategorinya langsung terisi.",
      icon: Wallet,
      visual: StepVisual.Receipt,
    },
    {
      title: "Lihat gambaran utuhnya",
      description:
        "Pantau net worth dan insight yang mudah dipahami, diperbarui setiap hari.",
      icon: CircleDollarSign,
      visual: StepVisual.Trend,
    },
  ] satisfies Step[],
} as const;

/* -------------------------------------------------------------------------- */
/* Pricing                                                                    */
/* -------------------------------------------------------------------------- */

export const pricingContent = {
  eyebrow: "Harga",
  title: "Gratis selama early access.",
  plan: {
    name: "Early Access",
    priceIdr: 0,
    period: "/ bulan",
    summary: "Semua fitur, tanpa biaya, selama masa early access.",
    badge: "Anggota perdana",
    icon: Sparkles,
    perks: [
      "Aset kripto dan saham tanpa batas",
      "Catatan pengeluaran tanpa batas",
      "Dashboard net worth terpadu",
      "Harga khusus anggota perdana saat peluncuran",
    ],
    ctaLabel: "Gabung Waitlist",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Rendered as the FAQ section and as `FAQPage` structured data, so the two
 * always match.
 */
export const faqContent = {
  eyebrow: "FAQ",
  title: "Pertanyaan umum seputar SatuPorto",
  items: [
    {
      question: "Apa itu SatuPorto?",
      answer:
        "SatuPorto adalah aplikasi keuangan pribadi untuk memantau portfolio saham dan kripto sekaligus mencatat pengeluaran harian. Semua angkamu terkumpul di satu dashboard, jadi kamu bisa cek net worth kapan saja.",
    },
    {
      question: "Apakah SatuPorto gratis?",
      answer:
        "Ya. Selama masa early access, semua fitur SatuPorto bisa kamu pakai gratis. Anggota waitlist juga akan mendapat harga khusus anggota perdana saat peluncuran.",
    },
    {
      question: "Aset apa saja yang bisa dipantau?",
      answer:
        "Kamu bisa memantau saham IDX, saham US, dan aset kripto dalam satu tempat, lengkap dengan nilai dan perubahan harganya.",
    },
    {
      question: "Bagaimana cara impor portfolio dari screenshot?",
      answer:
        "Unggah screenshot dari aplikasi exchange atau sekuritasmu. SatuPorto AI membaca ticker, jumlah, dan nilainya, lalu kamu cek dan simpan hasilnya.",
    },
    {
      question: "Apakah datamu aman?",
      // Deliberately non-committal: states plans, with no certification or
      // compliance claims (approved by the client 2026-10-12). Any security or
      // compliance claim added later must be one the product can back up.
      answer:
        "Kami merancang SatuPorto dengan keamanan data sebagai prioritas, termasuk rencana enkripsi data dan kebijakan untuk tidak memperjualbelikan data pribadimu. Detail lengkapnya akan kami bagikan sebelum peluncuran.",
    },
    {
      question: "Apakah SatuPorto memberikan saran investasi?",
      answer: `Tidak. SatuPorto hanya menyajikan insight, seperti analisis pengeluaran dan peluang hemat. ${FINANCIAL_ADVICE_DISCLAIMER}`,
    },
  ] satisfies FaqItem[],
} as const;

/* -------------------------------------------------------------------------- */
/* Call to action and footer                                                  */
/* -------------------------------------------------------------------------- */

export const ctaContent = {
  eyebrow: "Early access",
  title: "Siap pegang kendali atas keuangan dan net worth kamu?",
  description:
    "Gabung waitlist dan jadi yang pertama mencoba saat SatuPorto resmi dibuka.",
} as const;

export const footerContent = {
  copyright: "© SatuPorto.biz.id. Hak cipta dilindungi undang-undang.",
  madeIn: "Dibuat di Indonesia.",
  credit: {
    // Kept in English on purpose: the client chose this exact wording for
    // the agency credit.
    label: "Powered by Nusa Techno Jaya",
    href: "https://www.nuteja.biz.id",
    newTabHint: "(membuka tab baru)",
  },
} as const;
