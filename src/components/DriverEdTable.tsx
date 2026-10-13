import { useState, useMemo, useCallback } from 'react';

export type DriverEdLocation = {
  license: string;
  city: string;
  county: string;
  address: string;
  phone: string;
};

export type DriverEdProvider = {
  id: number;
  license: string;
  name: string;
  profession: string;
  delivery: 'online' | 'in-person' | 'hybrid';
  website: string | null;
  price: number | null;
  priceDisplay: string | null;
  courseTypes: string[];
  btwHours: number | null;
  locations: DriverEdLocation[];
  city: string | null;
  county: string | null;
  phone: string | null;
  licenseExpires: string | null;
  alsoDefensiveDriving: string | null;
  lastVerified?: string;
  source?: string;
  verified: { roster: boolean; website: boolean; price: boolean };
};

type SortKey = 'name' | 'price' | 'city';
type SortDir = 'asc' | 'desc';

// Paginated from the first commit: the two directories together head toward a
// thousand rows in one island, and retrofitting this later is painful.
const PAGE_SIZE = 25;

function isValidUrl(url?: string | null): boolean {
  if (!url) return false;
  const t = url.trim().toLowerCase();
  return !!t && t !== 'not found' && t !== 'n/a' && /^https?:\/\//.test(t);
}

function deliveryLabel(d: DriverEdProvider['delivery']): string {
  if (d === 'hybrid') return 'Online / In-Person';
  if (d === 'in-person') return 'In-Person';
  return 'Online';
}

function deliveryPillStyle(d: DriverEdProvider['delivery']): React.CSSProperties {
  if (d === 'hybrid') return { background: 'var(--pill-format-both-bg)', color: 'var(--pill-format-both-text)', border: '1px solid var(--pill-format-both-border)' };
  if (d === 'in-person') return { background: 'var(--pill-format-inperson-bg)', color: 'var(--pill-format-inperson-text)', border: '1px solid var(--pill-format-inperson-border)' };
  return { background: 'var(--pill-format-online-bg)', color: 'var(--pill-format-online-text)', border: '1px solid var(--pill-format-online-border)' };
}

const COURSE_TYPE_LABELS: Record<string, string> = {
  'adult-ade1317': 'Adult (6-hour ADE-1317)',
  'teen-32hr': 'Teen (32-hour)',
  'parent-taught': 'Parent-taught',
  'btw-only': 'Behind-the-wheel only',
};

/** "Dallas, Dallas Co." reads badly — drop the county when it repeats the city. */
function locationLabel(p: DriverEdProvider): string {
  const city = p.city ?? '';
  const county = p.county ?? '';
  if (!county || county === 'OUT OF STATE/UNKNOWN') return city;
  if (county.toUpperCase() === city.toUpperCase()) return city;
  return `${city}, ${county} Co.`;
}

const Dash = () => <span className="text-[13px]" style={{ color: 'var(--proto-text-light)' }}>—</span>;

interface Props {
  providers: DriverEdProvider[];
}

export default function DriverEdTable({ providers }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleSort = useCallback((key: SortKey) => {
    setPage(0);
    setSortBy((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.license.toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        p.locations.some((l) => l.city.toLowerCase().includes(q))
    );
  }, [providers, searchQuery]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') {
        // Unpriced rows sort last either way — a dash is not "cheapest".
        if (a.price == null && b.price == null) return a.name.localeCompare(b.name);
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return (a.price - b.price) * dir;
      }
      if (sortBy === 'city') return (a.city || '').localeCompare(b.city || '') * dir;
      return a.name.localeCompare(b.name) * dir;
    });
  }, [filtered, sortBy, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = sorted.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const pricedCount = providers.filter((p) => p.price != null).length;

  const arrow = (key: SortKey) => (sortBy === key ? (sortDir === 'asc' ? '↑' : '↓') : '↕');
  const th = 'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide';

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-6 sm:px-5">
      <header className="mb-5">
        <h1 className="text-[22px] font-extrabold sm:text-[28px]" style={{ color: 'var(--proto-text)' }}>
          Texas Online Driver Education Providers
        </h1>
        <p className="mt-2 max-w-[760px] text-[14px] leading-relaxed" style={{ color: 'var(--proto-text-muted)' }}>
          Every provider licensed by TDLR to deliver driver education entirely online — {providers.length} of
          them. This is first-licence driver ed, for a teen or an adult getting a Texas licence. It is a
          different course from the defensive driving you take to dismiss a ticket.
        </p>
        {pricedCount < providers.length && (
          <p
            className="mt-3 rounded-md px-3 py-2 text-[13px]"
            style={{ background: 'var(--pill-cert-mail-bg)', color: 'var(--pill-cert-mail-text)', border: '1px solid var(--pill-cert-mail-border)' }}
          >
            <strong>Prices are still being verified.</strong> Licence numbers, cities and phone numbers come
            straight from TDLR's licence file and are current. We show a dash rather than a price we have not
            confirmed at checkout — {pricedCount} of {providers.length} priced so far.
          </p>
        )}
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="de-search">Search providers</label>
        <input
          id="de-search"
          type="search"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          placeholder="Search by name, licence, or city"
          className="w-full rounded-md border px-3 py-2 text-[14px] sm:w-[320px]"
          style={{ borderColor: 'var(--proto-border)', color: 'var(--proto-text)' }}
        />
        <span className="text-[12px]" style={{ color: 'var(--proto-text-muted)' }}>
          {sorted.length === providers.length
            ? `${providers.length} providers`
            : `${sorted.length} of ${providers.length} providers`}
        </span>
      </div>

      <div className="hidden sm:block overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--proto-border)' }}>
        <table className="w-full border-collapse">
          <caption className="sr-only">
            TDLR-licensed online driver education providers in Texas, sortable by name, price, and city
          </caption>
          <thead>
            <tr style={{ background: 'var(--proto-table-head-bg)' }}>
              <th scope="col" className={th} style={{ color: 'var(--proto-text-muted)' }}>
                <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1">
                  Provider <span className="text-[10px] opacity-60">{arrow('name')}</span>
                </button>
              </th>
              <th scope="col" className={th} style={{ color: 'var(--proto-text-muted)' }}>Licence</th>
              <th scope="col" className={th} style={{ color: 'var(--proto-text-muted)' }}>
                <button type="button" onClick={() => toggleSort('price')} className="inline-flex items-center gap-1">
                  Price <span className="text-[10px] opacity-60">{arrow('price')}</span>
                </button>
              </th>
              <th scope="col" className={th} style={{ color: 'var(--proto-text-muted)' }}>Delivery</th>
              <th scope="col" className={th} style={{ color: 'var(--proto-text-muted)' }}>
                <button type="button" onClick={() => toggleSort('city')} className="inline-flex items-center gap-1">
                  Based in <span className="text-[10px] opacity-60">{arrow('city')}</span>
                </button>
              </th>
              <th scope="col" className={th} style={{ color: 'var(--proto-text-muted)' }}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: 'var(--proto-border)' }}>
                <td className="px-3 py-2.5">
                  {isValidUrl(p.website) ? (
                    <a
                      href={p.website as string}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="text-[14px] font-semibold hover:underline"
                      style={{ color: 'var(--proto-teal)' }}
                    >
                      {p.name}
                    </a>
                  ) : (
                    <span className="text-[14px] font-semibold" style={{ color: 'var(--proto-text)' }}>{p.name}</span>
                  )}
                  {p.alsoDefensiveDriving && (
                    <a
                      href="/"
                      className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: 'var(--pill-cert-free-bg)', color: 'var(--pill-cert-free-text)', border: '1px solid var(--pill-cert-free-border)' }}
                      title={`Also holds defensive driving licence ${p.alsoDefensiveDriving}`}
                    >
                      also defensive driving
                    </a>
                  )}
                  {p.courseTypes.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.courseTypes.map((c) => (
                        <span
                          key={c}
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ background: 'var(--pill-lang-english-bg)', color: 'var(--pill-lang-english-text)', border: '1px solid var(--pill-lang-english-border)' }}
                        >
                          {COURSE_TYPE_LABELS[c] ?? c}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.locations.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((e) => ({ ...e, [p.id]: !e[p.id] }))}
                      className="ml-2 text-[11px] font-medium underline"
                      style={{ color: 'var(--proto-text-light)' }}
                      aria-expanded={!!expanded[p.id]}
                    >
                      {p.locations.length} location{p.locations.length > 1 ? 's' : ''}
                    </button>
                  )}
                  {expanded[p.id] && p.locations.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {p.locations.map((l) => (
                        <li key={l.license} className="text-[12px]" style={{ color: 'var(--proto-text-muted)' }}>
                          {l.address}, {l.city} — <span style={{ color: 'var(--proto-text-light)' }}>{l.license}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-[13px]" style={{ color: 'var(--proto-text-muted)' }}>{p.license}</span>
                </td>
                <td className="px-3 py-2.5">
                  {p.price != null ? (
                    <span className="text-[14px] font-bold" style={{ color: 'var(--proto-text)' }}>
                      ${p.price.toFixed(2)}
                    </span>
                  ) : (
                    <Dash />
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={deliveryPillStyle(p.delivery)}>
                    {deliveryLabel(p.delivery)}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-[13px]" style={{ color: 'var(--proto-text-muted)' }}>
                    {p.city ? locationLabel(p) : <Dash />}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  {p.phone ? (
                    <a href={`tel:${p.phone.replace(/\D/g, '')}`} className="text-[13px] hover:underline" style={{ color: 'var(--proto-teal)' }}>
                      {p.phone}
                    </a>
                  ) : (
                    <Dash />
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-[14px]" style={{ color: 'var(--proto-text-muted)' }}>
                  No providers match “{searchQuery}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards rather than a sideways-scrolling table, matching the
          defensive-driving directory's pattern. */}
      <div className="flex flex-col gap-2.5 sm:hidden">
        {rows.map((p) => (
          <div key={p.id} className="rounded-lg border p-3" style={{ borderColor: 'var(--proto-border)', background: '#fff' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {isValidUrl(p.website) ? (
                  <a
                    href={p.website as string}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-[15px] font-bold leading-snug hover:underline"
                    style={{ color: 'var(--proto-teal)' }}
                  >
                    {p.name}
                  </a>
                ) : (
                  <span className="text-[15px] font-bold leading-snug" style={{ color: 'var(--proto-text)' }}>{p.name}</span>
                )}
                <p className="mt-0.5 text-[11px] uppercase tracking-wide" style={{ color: 'var(--proto-text-light)' }}>
                  Licence {p.license}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {p.price != null ? (
                  <span className="text-[16px] font-extrabold" style={{ color: 'var(--proto-text)' }}>${p.price.toFixed(2)}</span>
                ) : (
                  <span className="text-[11px]" style={{ color: 'var(--proto-text-light)' }}>price not<br />yet verified</span>
                )}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={deliveryPillStyle(p.delivery)}>
                {deliveryLabel(p.delivery)}
              </span>
              {p.courseTypes.map((c) => (
                <span
                  key={c}
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'var(--pill-lang-english-bg)', color: 'var(--pill-lang-english-text)', border: '1px solid var(--pill-lang-english-border)' }}
                >
                  {COURSE_TYPE_LABELS[c] ?? c}
                </span>
              ))}
              {p.alsoDefensiveDriving && (
                <a
                  href="/"
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'var(--pill-cert-free-bg)', color: 'var(--pill-cert-free-text)', border: '1px solid var(--pill-cert-free-border)' }}
                >
                  also defensive driving
                </a>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]" style={{ color: 'var(--proto-text-muted)' }}>
              {p.city && <span>{locationLabel(p)}</span>}
              {p.phone && (
                <a href={`tel:${p.phone.replace(/\D/g, '')}`} className="font-medium hover:underline" style={{ color: 'var(--proto-teal)' }}>
                  {p.phone}
                </a>
              )}
            </div>

            {p.locations.length > 0 && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setExpanded((e) => ({ ...e, [p.id]: !e[p.id] }))}
                  className="text-[12px] font-medium underline"
                  style={{ color: 'var(--proto-text-light)' }}
                  aria-expanded={!!expanded[p.id]}
                >
                  {p.locations.length} location{p.locations.length > 1 ? 's' : ''}
                </button>
                {expanded[p.id] && (
                  <ul className="mt-1.5 space-y-1">
                    {p.locations.map((l) => (
                      <li key={l.license} className="text-[12px]" style={{ color: 'var(--proto-text-muted)' }}>
                        {l.address}, {l.city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
        {rows.length === 0 && (
          <p className="py-8 text-center text-[14px]" style={{ color: 'var(--proto-text-muted)' }}>
            No providers match “{searchQuery}”.
          </p>
        )}
      </div>

      {pageCount > 1 && (
        <nav className="mt-4 flex items-center justify-between" aria-label="Pagination">
          <button
            type="button"
            onClick={() => setPage(current - 1)}
            disabled={current === 0}
            className="rounded-md border px-3 py-1.5 text-[13px] font-medium disabled:opacity-40"
            style={{ borderColor: 'var(--proto-border)', color: 'var(--proto-text)' }}
          >
            Previous
          </button>
          <span className="text-[13px]" style={{ color: 'var(--proto-text-muted)' }}>
            Page {current + 1} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(current + 1)}
            disabled={current >= pageCount - 1}
            className="rounded-md border px-3 py-1.5 text-[13px] font-medium disabled:opacity-40"
            style={{ borderColor: 'var(--proto-border)', color: 'var(--proto-text)' }}
          >
            Next
          </button>
        </nav>
      )}

      <p className="mt-5 text-[12px] leading-relaxed" style={{ color: 'var(--proto-text-light)' }}>
        Source: TDLR's public licence file, pulled {providers[0]?.lastVerified ?? 'recently'}. A provider is
        listed here because the state licenses it, not because it asked to be. Something wrong?{' '}
        <a href="mailto:info@txcourseguide.com" className="font-semibold hover:underline" style={{ color: 'var(--proto-teal)' }}>
          info@txcourseguide.com
        </a>
      </p>
    </div>
  );
}
