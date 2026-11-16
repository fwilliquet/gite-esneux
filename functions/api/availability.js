// Cloudflare Pages Function. Keep the Airbnb iCal URL in the encrypted AIRBNB_ICAL_URL binding.
export async function onRequestGet({ env }) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300' };
  if (!env.AIRBNB_ICAL_URL) return new Response(JSON.stringify({ error: 'Calendrier non configuré' }), { status: 503, headers });
  try {
    const url = new URL(env.AIRBNB_ICAL_URL);
    if (!['fr.airbnb.be','www.airbnb.com','www.airbnb.fr','airbnb.com','airbnb.fr','airbnb.be'].includes(url.hostname) || !/^\/calendar\/ical\/[0-9]+\.ics$/.test(url.pathname) || url.protocol !== 'https:') throw Error('Invalid calendar source');
    const response = await fetch(url.toString(), { redirect: 'error', headers: { Accept: 'text/calendar' }, cf: { cacheTtl: 900, cacheEverything: true } });
    if (!response.ok) throw Error('Airbnb fetch failed');
    const ical = await response.text();
    if (ical.length > 2_000_000 || !ical.includes('BEGIN:VCALENDAR')) throw Error('Invalid iCal');
    const lines = ical.replace(/\r\n/g, '\n').split('\n').reduce((a, line) => { if (/^[ \t]/.test(line) && a.length) a[a.length - 1] += line.slice(1); else a.push(line); return a; }, []);
    const periods = [];
    let event = null;
    const dateValue = value => {
      const match = /^(\d{4})(\d{2})(\d{2})/.exec(value || '');
      return match ? match[1] + '-' + match[2] + '-' + match[3] : null;
    };
    for (const line of lines) {
      if (line === 'BEGIN:VEVENT') { event = {}; continue; }
      if (line === 'END:VEVENT') {
        if (event && event.start && event.end && event.end > event.start && event.status !== 'CANCELLED') periods.push({ start: event.start, end: event.end });
        event = null; continue;
      }
      if (!event) continue;
      const sep = line.indexOf(':');
      if (sep < 0) continue;
      const key = line.slice(0, sep).split(';')[0];
      const value = line.slice(sep + 1);
      if (key === 'DTSTART') event.start = dateValue(value);
      if (key === 'DTEND') event.end = dateValue(value);
      if (key === 'STATUS') event.status = value;
    }
    return new Response(JSON.stringify({ blocked: periods, updatedAt: new Date().toISOString(), source: 'Airbnb iCal' }), { headers });
  } catch {
    return new Response(JSON.stringify({ error: 'Disponibilités temporairement indisponibles' }), { status: 502, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
}
