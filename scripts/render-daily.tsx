// Usage: RESEND_API_KEY=... npx tsx --tsconfig scripts/tsconfig.json scripts/render-daily.tsx <YYYY-MM-DD> <broadcast|test:<email>> [outfile.html]
// Writes <outfile>.html and .txt. "broadcast" keeps Resend's {{{RESEND_UNSUBSCRIBE_URL}}} placeholder; "test:<email>" uses a signed /unsubscribe link.
import { render } from "@react-email/render";
import { readFileSync, writeFileSync } from "node:fs";
import DailyEmail from "../emails/DailyPost";
import { unsubUrl } from "../lib/unsub";
import type { DailyPost } from "../lib/daily";

(async () => {
  const [date, mode = "broadcast", out = `/tmp/daily-${process.argv[2]}.html`] = process.argv.slice(2);
  const post = JSON.parse(readFileSync(`content/daily/${date}.json`, "utf8")) as DailyPost;
  const unsubscribeUrl = mode.startsWith("test:") ? unsubUrl(mode.slice(5)) : undefined;
  const el = DailyEmail({ post, unsubscribeUrl });
  writeFileSync(out, await render(el));
  writeFileSync(out.replace(/\.html$/, ".txt"), await render(el, { plainText: true }));
  console.log(JSON.stringify({ subject: post.subject, html: out, text: out.replace(/\.html$/, ".txt") }));
})();
