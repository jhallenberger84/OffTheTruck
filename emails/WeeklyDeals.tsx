import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";

export type Pick = { slug: string; title: string; brand: string; sale_price: number; list_price: number; truck_price?: number | null; truck_brand?: string | null; retailer: string };

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const off = (p: Pick) => Math.round((1 - p.sale_price / p.list_price) * 100);

export default function WeeklyDeals({
  picks,
  siteUrl = "https://offthetruckhq.com",
  dateLabel = "Today",
  sponsor = { name: "your brand here", url: "https://offthetruckhq.com/sponsor" },
}: {
  picks: Pick[];
  siteUrl?: string;
  dateLabel?: string;
  sponsor?: { name: string; url: string };
}) {
  const top = picks.slice(0, 5);
  return (
    <Html lang="en">
      <Head />
      <Preview>{`${top.length} tool deals worth a look: ${top.map((p) => p.brand).join(", ")}`}</Preview>
      <Body style={{ background: "#f3f4f5", fontFamily: "-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: "16px 0" }}>
        <Container style={{ background: "#ffffff", maxWidth: 560, borderRadius: 8, overflow: "hidden" }}>
          <Section style={{ background: "#1a1d20", padding: "16px 20px", borderBottom: "4px solid #ff6a13" }}>
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: 900, margin: 0, textTransform: "uppercase" }}>
              Off the <span style={{ color: "#ff6a13" }}>Truck</span>
            </Text>
            <Text style={{ color: "#b9c0c6", fontSize: 13, margin: "2px 0 0" }}>{dateLabel} · the 5 best tool deals</Text>
          </Section>
          <Section style={{ padding: "8px 20px 0" }}>
            <Heading as="h2" style={{ fontSize: 16, margin: "12px 0 4px", color: "#1a1d20" }}>Today&apos;s 5 picks</Heading>
            {top.map((p, i) => (
              <Text key={p.slug} style={{ fontSize: 14, lineHeight: "20px", margin: "10px 0", color: "#23272b" }}>
                <strong style={{ color: "#e0560a" }}>{i + 1}.</strong>{" "}
                <Link href={`${siteUrl}/go/${p.slug}?utm_source=newsletter`} style={{ color: "#1a1d20", fontWeight: 700, textDecoration: "underline" }}>
                  {p.title}
                </Link>{" "}
                <strong>{usd(p.sale_price)}</strong> <span style={{ color: "#6b7280" }}>(was {usd(p.list_price)}, {off(p)}% off at {p.retailer}{p.truck_price && p.truck_brand ? `; ${p.truck_brand} version ${usd(p.truck_price)}` : ""})</span>
              </Text>
            ))}
            <Text style={{ fontSize: 14, margin: "16px 0" }}>
              <Link href={`${siteUrl}/?utm_source=newsletter`} style={{ background: "#ff6a13", color: "#000", padding: "10px 16px", borderRadius: 6, fontWeight: 700, textDecoration: "none" }}>
                See all deals
              </Link>
            </Text>
          </Section>
          <Hr style={{ borderColor: "#e5e7eb", margin: "8px 20px" }} />
          <Section style={{ padding: "0 20px 16px" }}>
            <Text style={{ fontSize: 12, color: "#6b7280", margin: "8px 0" }}>
              Sponsored by <Link href={sponsor.url} style={{ color: "#e0560a" }}>{sponsor.name}</Link>.
            </Text>
            <Text style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0" }}>
              Prices were checked when this email was written and can change fast. Some links may earn us a commission.{" "}
              <Link href={`${siteUrl}/submit`} style={{ color: "#9ca3af" }}>Submit a deal</Link> ·{" "}
              <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={{ color: "#9ca3af" }}>Unsubscribe</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
