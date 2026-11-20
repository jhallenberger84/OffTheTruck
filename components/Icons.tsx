import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...p });

export const SocketIcon = (p: P) => (
  <svg {...base(p)}><path d="M8 3h8v5l-1 1v9a3 3 0 0 1-6 0V9L8 8z" /><path d="M10.5 6h3" /><circle cx="12" cy="17" r="1.2" /></svg>
);
export const WrenchIcon = (p: P) => (
  <svg {...base(p)}><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-3 3-1.3-1.3a4 4 0 0 0-5-5L6 15.4a2 2 0 1 1-2.8-2.8L9 6.9a4 4 0 0 0 5-5L15.3 3.2 12.6 6l1.4 1.4" /></svg>
);
export const ImpactIcon = (p: P) => (
  <svg {...base(p)}><path d="M3 7h11l2 2v3l-2 2H9" /><path d="M16 10h3l2 1" /><path d="M7 14v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5" /><path d="M6 7V5h5v2" /></svg>
);
export const DiagIcon = (p: P) => (
  <svg {...base(p)}><rect x="5" y="2.5" width="14" height="19" rx="2.5" /><rect x="8" y="5.5" width="8" height="5" rx="1" /><path d="M9 8h1.5l1-1.5 1.5 3 1-1.5H15" /><circle cx="9.5" cy="15" r="1" /><circle cx="14.5" cy="15" r="1" /><path d="M10 19h4" /></svg>
);
export const PliersIcon = (p: P) => (
  <svg {...base(p)}><path d="M9 3c1.5 2 2 4.5 1.5 7L9 13" /><path d="M15 3c-1.5 2-2 4.5-1.5 7L15 13" /><circle cx="12" cy="12.5" r="1.5" /><path d="M10.5 14 7 21" /><path d="M13.5 14 17 21" /></svg>
);
export const BoxIcon = (p: P) => (
  <svg {...base(p)}><rect x="3" y="8" width="18" height="12" rx="1.5" /><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" /><path d="M3 13h18" /><path d="M10.5 13v2h3v-2" /></svg>
);
export const TruckIcon = (p: P) => (
  <svg {...base(p)}><path d="M2 6h11v10H2z" /><path d="M13 9h4l3 3.5V16h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></svg>
);
export const MailIcon = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></svg>
);
export const TagIcon = (p: P) => (
  <svg {...base(p)}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
);
export const ArrowIcon = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);

export const CATEGORY_ICONS: Record<string, (p: P) => React.ReactElement> = {
  "sockets-ratchets": SocketIcon,
  wrenches: WrenchIcon,
  "impacts-power": ImpactIcon,
  diagnostic: DiagIcon,
  specialty: PliersIcon,
  storage: BoxIcon,
};

export function CategoryIcon({ slug, ...p }: P & { slug: string }) {
  const I = CATEGORY_ICONS[slug] ?? TagIcon;
  return <I {...p} />;
}
