import { db, logError } from "./db";

export type ActiveSponsor = { id: number; sponsor_name: string; headline: string | null; url: string } | null;

/** The sponsor booked for the current week (Monday start, America/Chicago), if any. */
export async function activeSponsor(): Promise<ActiveSponsor> {
  try {
    const sql = await db();
    if (!sql) return null;
    const [r] = await sql`
      select id, sponsor_name, headline, url from sponsor_weeks
      where status in ('booked','live')
        and week_start <= (now() at time zone 'America/Chicago')::date
        and week_start + 7 > (now() at time zone 'America/Chicago')::date
      order by week_start desc limit 1`;
    return (r as unknown as ActiveSponsor) ?? null;
  } catch (e) {
    await logError("activeSponsor", e);
    return null;
  }
}
