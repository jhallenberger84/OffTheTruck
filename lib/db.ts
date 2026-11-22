import postgres from "postgres";
import seed from "./seed.json";

type Sql = ReturnType<typeof postgres>;

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

declare global {
  // eslint-disable-next-line no-var
  var __ottSql: Sql | undefined;
  // eslint-disable-next-line no-var
  var __ottReady: Promise<void> | undefined;
}

export const hasDb = Boolean(url);

function client(): Sql {
  if (!globalThis.__ottSql) {
    globalThis.__ottSql = postgres(url, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10 });
  }
  return globalThis.__ottSql;
}

const SCHEMA = `
create table if not exists entries (
  id serial primary key,
  slug text unique not null,
  title text not null,
  brand text not null,
  category text not null,
  retailer text not null,
  url text not null,
  source text,
  sale_price numeric(10,2) not null,
  list_price numeric(10,2) not null,
  list_price_label text default 'List price',
  condition text,
  notes text,
  truck_brand text,
  truck_title text,
  truck_price numeric(10,2),
  truck_url text,
  truck_checked_at timestamptz,
  affiliate_url text,
  featured boolean default false,
  status text not null default 'active',
  checked_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table entries add column if not exists image_url text;
create table if not exists submissions (
  id serial primary key,
  title text not null,
  url text not null,
  price numeric(10,2),
  list_price numeric(10,2),
  brand text,
  category text,
  notes text,
  email text,
  status text not null default 'pending',
  entry_id int,
  ip_hash text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create table if not exists signups (
  id serial primary key,
  email text unique not null,
  source text,
  resend_contact_id text,
  created_at timestamptz not null default now()
);
create table if not exists zero_result_searches (
  id serial primary key,
  q text not null,
  created_at timestamptz not null default now()
);
create table if not exists pageviews (
  path text not null,
  day date not null,
  views int not null default 0,
  primary key (path, day)
);
create table if not exists sponsor_weeks (
  id serial primary key,
  week_start date not null,
  sponsor_name text not null,
  headline text,
  url text not null,
  price_cents int not null default 5000,
  status text not null default 'booked',
  created_at timestamptz not null default now()
);
create table if not exists sponsor_inquiries (
  id serial primary key,
  name text not null,
  company text,
  email text not null,
  website text,
  message text,
  created_at timestamptz not null default now()
);
create table if not exists sponsor_clicks (
  id serial primary key,
  sponsor_week_id int,
  placement text,
  created_at timestamptz not null default now()
);
alter table sponsor_clicks add column if not exists is_bot boolean;
alter table sponsor_clicks alter column is_bot set default false;
alter table sponsor_clicks add column if not exists user_agent text;
create table if not exists outbound_clicks (
  id serial primary key,
  slug text not null,
  entry_id int,
  referrer text,
  created_at timestamptz not null default now()
);
alter table outbound_clicks add column if not exists is_bot boolean;
alter table outbound_clicks alter column is_bot set default false;
alter table outbound_clicks add column if not exists user_agent text;
create table if not exists errors (
  id serial primary key,
  context text not null,
  message text not null,
  created_at timestamptz not null default now()
);
`;

async function init(sql: Sql) {
  await sql.unsafe(SCHEMA);
  const [{ n }] = await sql`select count(*)::int as n from entries`;
  if (n === 0) {
    for (const d of seed as Record<string, unknown>[]) {
      await sql`insert into entries ${sql(
        {
          slug: d.slug, title: d.title, brand: d.brand, category: d.category, retailer: d.retailer,
          url: d.url, source: d.source ?? d.url, sale_price: d.sale_price, list_price: d.list_price,
          list_price_label: d.list_price_label ?? "List price", condition: d.condition ?? null, notes: d.notes ?? null,
          truck_brand: d.truck_brand ?? null, truck_title: d.truck_title ?? null, truck_price: d.truck_price ?? null,
          truck_url: d.truck_url ?? null, truck_checked_at: d.truck_checked_at ?? null, checked_at: d.checked_at, featured: d.featured ?? false,
          image_url: d.image_url ?? null,
        } as never
      )} on conflict (slug) do nothing`;
    }
  }
}

/** Returns a ready SQL client (schema created and seeded once per instance), or null when no database is configured. */
export async function db(): Promise<Sql | null> {
  if (!hasDb) return null;
  const sql = client();
  if (!globalThis.__ottReady) {
    globalThis.__ottReady = init(sql).catch((e) => {
      globalThis.__ottReady = undefined;
      throw e;
    });
  }
  await globalThis.__ottReady;
  return sql;
}

export async function logError(context: string, err: unknown) {
  const message = err instanceof Error ? `${err.message}` : String(err);
  console.error(`[${context}]`, message);
  try {
    const sql = await db();
    if (sql) await sql`insert into errors (context, message) values (${context}, ${message.slice(0, 2000)})`;
  } catch {
    /* never throw from the error logger */
  }
}
