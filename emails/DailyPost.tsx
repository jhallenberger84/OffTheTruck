import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";
import type { DailyPost } from "../lib/daily";

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** unsubscribeUrl: "{{{RESEND_UNSUBSCRIBE_URL}}}" for broadcasts, a signed /unsubscribe link for one-off sends. */
export default function DailyEmail({ post, siteUrl = "https://offthetruckhq.com", unsubscribeUrl = "{{{RESEND_UNSUBSCRIBE_URL}}}" }: { post: DailyPost; siteUrl?: string; unsubscribeUrl?: string }) {
  const label = new Date(`${post.date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const p = { fontSize: 14, lineHeight: "21px", margin: "10px 0", color: "#23272b" } as const;
  return (
    <Html lang="en">
      <Head />
      <Preview>{post.summary}</Preview>
      <Body style={{ background: "#f3f4f5", fontFamily: "-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", margin: 0, padding: "16px 0" }}>
        <Container style={{ background: "#ffffff", maxWidth: 560, borderRadius: 8, overflow: "hidden" }}>
          <Section style={{ background: "#1a1d20", padding: "16px 20px", borderBottom: "4px solid #ff6a13" }}>
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: 900, margin: 0, textTransform: "uppercase" }}>
              Off the <span style={{ color: "#ff6a13" }}>Truck</span>
            </Text>
            <Text style={{ color: "#b9c0c6", fontSize: 13, margin: "2px 0 0" }}>{label}</Text>
          </Section>
          {post.sponsor && (
            <Section style={{ background: "#ff6a13", padding: "8px 20px" }}>
              <Text style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#000" }}>
                Sponsored by <Link href={`${siteUrl}/go/sponsor?p=email`} style={{ color: "#000", textDecoration: "underline" }}>{post.sponsor.headline || post.sponsor.name}</Link>
              </Text>
            </Section>
          )}
          <Section style={{ padding: "8px 20px 0" }}>
            {post.body.map((para, i) => <Text key={i} style={p}>{para}</Text>)}
            {post.deals.map((d) => (
              <Text key={d.slug} style={{ ...p, borderLeft: "3px solid #ff6a13", paddingLeft: 10 }}>
                <Link href={`${siteUrl}/go/${d.slug}?utm_source=newsletter`} style={{ color: "#1a1d20", fontWeight: 700, textDecoration: "underline" }}>{d.title}</Link>
                <br />
                <strong>{usd(d.sale_price)}</strong> at {d.retailer}
                {d.truck_price && d.truck_brand ? <> · {d.truck_brand}: {d.truck_url ? <Link href={d.truck_url} style={{ color: "#6b7280" }}>{usd(d.truck_price)}</Link> : usd(d.truck_price)}</> : null}
              </Text>
            ))}
            <Text style={{ fontSize: 14, margin: "16px 0" }}>
              <Link href={`${siteUrl}/daily/${post.date}?utm_source=newsletter`} style={{ background: "#ff6a13", color: "#000", padding: "10px 16px", borderRadius: 6, fontWeight: 700, textDecoration: "none" }}>
                See all deals on the site
              </Link>
            </Text>
            <Text style={{ ...p, fontSize: 14 }}>
              Know a tech who&apos;s about to buy off the truck? Forward this, or send them{" "}
              <Link href={`${siteUrl}/?utm_source=forward`} style={{ color: "#e0560a" }}>offthetruckhq.com</Link>. That&apos;s how this thing grows.
            </Text>
          </Section>
          <Hr style={{ borderColor: "#e5e7eb", margin: "8px 20px" }} />
          <Section style={{ padding: "0 20px 16px" }}>
            <Text style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0" }}>
              Prices were checked when this email was written and can change fast. Some links may earn us a commission.{" "}
              <Link href={`${siteUrl}/submit`} style={{ color: "#9ca3af" }}>Submit a deal</Link> ·{" "}
              <Link href={unsubscribeUrl} style={{ color: "#9ca3af" }}>Unsubscribe</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
