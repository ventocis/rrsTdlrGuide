import { useState, useMemo, useCallback } from 'react';

export type DuplicateBrand = {
  name: string;
  url: string;
  license?: string;
};

export type Provider = {
  id: number;
  name: string;
  license?: string;
  website?: string;
  duplicates: DuplicateBrand[];
  price: number;
  priceDisplay: string;
  stateFee: number;
  stateFeeDisplay: string;
  totalCost: number;
  totalCostDisplay: string;
  online: boolean;
  inPerson: boolean;
  languages: string[];
  instantCert: 'Free' | 'Paid' | 'Mail';
  lastVerified?: string;
  featured?: boolean;
};

type SortKey = 'price' | 'totalCost' | 'name';
type SortDir = 'asc' | 'desc';

const INITIAL_LIMIT = 25;

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  const t = url.trim().toLowerCase();
  return !!t && t !== 'not found' && t !== 'n/a';
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function formatLabel(p: Provider): string {
  if (p.online && p.inPerson) return 'Online / In-Person';
  if (p.inPerson) return 'In-Person';
  return 'Online';
}

function langLabel(langs: string[]): string {
  if (langs.length === 2 && langs.includes('English') && langs.includes('Spanish')) return 'Eng / Español';
  return langs.join(', ');
}

function certPillStyle(cert: string): React.CSSProperties {
  if (cert === 'Free') return { background: 'var(--pill-cert-free-bg)', color: 'var(--pill-cert-free-text)', border: '1px solid var(--pill-cert-free-border)' };
  if (cert === 'Paid') return { background: 'var(--pill-cert-paid-bg)', color: 'var(--pill-cert-paid-text)', border: '1px solid var(--pill-cert-paid-border)' };
  return { background: 'var(--pill-cert-mail-bg)', color: 'var(--pill-cert-mail-text)', border: '1px solid var(--pill-cert-mail-border)' };
}

function formatPillStyle(p: Provider): React.CSSProperties {
  if (p.online && p.inPerson) return { background: 'var(--pill-format-both-bg)', color: 'var(--pill-format-both-text)', border: '1px solid var(--pill-format-both-border)' };
  if (p.inPerson) return { background: 'var(--pill-format-inperson-bg)', color: 'var(--pill-format-inperson-text)', border: '1px solid var(--pill-format-inperson-border)' };
  return { background: 'var(--pill-format-online-bg)', color: 'var(--pill-format-online-text)', border: '1px solid var(--pill-format-online-border)' };
}

function langPillStyle(langs: string[]): React.CSSProperties {
  if (langs.includes('English') && langs.includes('Spanish')) return { background: 'var(--pill-lang-engspanish-bg)', color: 'var(--pill-lang-engspanish-text)', border: '1px solid var(--pill-lang-engspanish-border)' };
  if (langs.includes('Spanish') && langs.length === 1) return { background: 'var(--pill-lang-spanish-bg)', color: 'var(--pill-lang-spanish-text)', border: '1px solid var(--pill-lang-spanish-border)' };
  if (langs.includes('English') && langs.length === 1) return { background: 'var(--pill-lang-english-bg)', color: 'var(--pill-lang-english-text)', border: '1px solid var(--pill-lang-english-border)' };
  return { background: 'var(--pill-lang-other-bg)', color: 'var(--pill-lang-other-text)', border: '1px solid var(--pill-lang-other-border)' };
}

const SHARE_SMS_BODY = encodeURIComponent(
  'If you ever get a ticket in Texas, use this before you buy a course — txcourseguide.com. Shows all 133 approved options with real prices.'
);
const SHARE_REDDIT_TEXT =
  "There's a free comparison tool that shows all 133 TDLR-approved courses with real pricing and certificate delivery — txcourseguide.com. No signup, just the table. Saved me from overpaying.";

interface Props {
  providers: Provider[];
}

export default function ProviderTable({ providers: allProviders }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>('price');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<string[]>([]);
  const [certFilter, setCertFilter] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [shareBanner, setShareBanner] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  function openProviderWebsite(p: Provider) {
    if (!p.website) return;
    let u = p.website.trim();
    if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'provider_click',
        provider_name: p.name,
        provider_slug: slugify(p.name),
        destination_url: u,
      });
      if (p.featured) {
        (window as any).dataLayer.push({
          event: 'rrs_provider_click',
          provider_name: p.name,
          destination_url: u,
          event_category: 'outbound_click',
        });
      }
    }
    window.open(u, '_blank', 'noopener,noreferrer');
    if (p.featured) setShareToast(true);
  }

  function dismissToast() { setShareToast(false); setShareBanner(true); }
  function dismissBanner() { setShareBanner(false); }

  function handleCopyReddit() {
    navigator.clipboard.writeText(SHARE_REDDIT_TEXT).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  }

  async function handleShareLink() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'TX Course Guide', text: 'Free tool to compare all TDLR-approved Texas defensive driving courses — real prices, no signup.', url: 'https://txcourseguide.com' });
      } catch {}
    } else {
      navigator.clipboard.writeText('https://txcourseguide.com');
    }
  }

  const filtered = useMemo(() => {
    return allProviders.filter((p) => {
      if (formatFilter.length > 0) {
        const match =
          (formatFilter.includes('online') && p.online) ||
          (formatFilter.includes('in-person') && p.inPerson) ||
          (formatFilter.includes('both') && p.online && p.inPerson);
        if (!match) return false;
      }
      if (certFilter.length > 0) {
        if (!certFilter.includes(p.instantCert.toLowerCase())) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (p.name.toLowerCase().includes(q)) return true;
        if (p.license && p.license.toLowerCase().includes(q)) return true;
        if (p.duplicates?.some((d) => d.name.toLowerCase().includes(q))) return true;
        return false;
      }
      return true;
    });
  }, [allProviders, formatFilter, certFilter, searchQuery]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (sortBy === 'price') {
        // Push providers with no listed price to the bottom in all cases
        const aNoPrice = a.price === 0;
        const bNoPrice = b.price === 0;
        if (aNoPrice && bNoPrice) return 0;
        if (aNoPrice) return 1;
        if (bNoPrice) return -1;
        return (a.price - b.price) * dir;
      }
      if (sortBy === 'totalCost') return (a.totalCost - b.totalCost) * dir;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_LIMIT);
  const resultCount = sorted.length;
  const hasActiveFilters = formatFilter.length > 0 || certFilter.length > 0;

  function toggleSort(col: SortKey) {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir(col === 'name' ? 'asc' : 'desc');
    }
    setShowAll(false);
  }

  function toggleExpand(id: number) {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleFormat(key: string) {
    if (key === 'all') { setFormatFilter([]); return; }
    setFormatFilter(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    setShowAll(false);
  }

  function toggleCert(key: string) {
    if (key === 'all') { setCertFilter([]); return; }
    const k = key.toLowerCase();
    setCertFilter(prev => prev.includes(k) ? prev.filter(c => c !== k) : [...prev, k]);
    setShowAll(false);
  }

  function clearFilters() {
    setFormatFilter([]); setCertFilter([]); setShowAll(false);
  }

  function sortArrow(col: string) {
    return sortBy === col ? (sortDir === 'asc' ? '▲' : '▼') : '▼';
  }

  const formatOptions = [
    { key: 'all', label: 'All' },
    { key: 'online', label: 'Online' },
    { key: 'in-person', label: 'In-Person' },
    { key: 'both', label: 'Online / In-Person' },
  ];

  const certOptions = [
    { key: 'all', label: 'All' },
    { key: 'free', label: 'Free' },
    { key: 'paid', label: 'Paid' },
    { key: 'mail', label: 'Mail' },
  ];

  const sortOptions = [
    { value: 'totalCost-desc', label: 'Total cost: High → Low' },
    { value: 'totalCost-asc', label: 'Total cost: Low → High' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'name-asc', label: 'Name: A–Z' },
  ];

  function isFormatActive(key: string) {
    return key === 'all' ? formatFilter.length === 0 : formatFilter.includes(key);
  }
  function isCertActive(key: string) {
    return key === 'all' ? certFilter.length === 0 : certFilter.includes(key.toLowerCase());
  }

  const currentSort = `${sortBy}-${sortDir}`;
  function setSort(val: string) {
    const [col, dir] = val.split('-') as [SortKey, SortDir];
    setSortBy(col); setSortDir(dir); setShowAll(false);
  }

  const thBase = 'sticky top-0 z-10 border-b-2 bg-white px-3 py-3 text-[11px] font-bold uppercase tracking-[0.05em] whitespace-nowrap select-none cursor-pointer border-[var(--proto-card-border)] text-[var(--proto-label)]';

  return (
    <div className="w-full">
      {/* Desktop filter bar */}
      <div className="hidden sm:block mx-auto w-full max-w-[1600px] px-2 pt-3.5 sm:px-5" style={{ backgroundColor: 'var(--proto-page-bg)' }}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-2 py-0 sm:px-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold" style={{ color: 'var(--proto-label)' }}>Format</span>
              <div className="inline-flex gap-1">
                {formatOptions.map(f => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => toggleFormat(f.key)}
                    className="rounded-md border px-2.5 py-1 text-[12px] font-semibold transition-colors"
                    style={isFormatActive(f.key)
                      ? { borderColor: 'var(--proto-teal)', background: 'var(--proto-teal-bg)', color: 'var(--proto-teal)' }
                      : { borderColor: 'var(--proto-card-border)', background: 'white', color: 'var(--proto-text-muted)' }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold" style={{ color: 'var(--proto-label)' }}>Certificate</span>
              <div className="inline-flex gap-1">
                {certOptions.map(f => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => toggleCert(f.key)}
                    className="rounded-md border px-2.5 py-1 text-[12px] font-semibold transition-colors"
                    style={isCertActive(f.key)
                      ? { borderColor: 'var(--proto-teal)', background: 'var(--proto-teal-bg)', color: 'var(--proto-teal)' }
                      : { borderColor: 'var(--proto-card-border)', background: 'white', color: 'var(--proto-text-muted)' }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="relative min-w-[200px] flex-1 sm:max-w-[280px] sm:flex-none">
            <input
              type="search"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowAll(false); }}
              placeholder="Search providers or brands..."
              className="w-full rounded-lg border py-2 px-3 text-[13px] outline-none transition-colors"
              style={{ borderColor: 'var(--proto-card-border)', background: 'white', color: 'var(--proto-text)' }}
              aria-label="Search providers or brands"
            />
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="ml-auto px-2.5 py-1 text-[12px] font-semibold text-[#EF4444] transition-colors hover:opacity-80">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile filter bar */}
      <div className="sm:hidden sticky top-0 z-30 w-full" style={{ backgroundColor: 'var(--proto-page-bg)', boxShadow: '0 1px 0 var(--proto-card-border)' }}>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <input
            type="search"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowAll(false); }}
            placeholder="Search..."
            className="flex-1 rounded-lg border py-2 px-3 text-[13px] outline-none"
            style={{ borderColor: 'var(--proto-card-border)', background: 'white', color: 'var(--proto-text)' }}
          />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-semibold"
            style={hasActiveFilters
              ? { borderColor: 'var(--proto-teal)', background: 'var(--proto-teal-bg)', color: 'var(--proto-teal)' }
              : { borderColor: 'var(--proto-card-border)', background: 'white', color: 'var(--proto-text)' }}
          >
            Filter & Sort
          </button>
        </div>
        <div className="px-3 pb-2 text-[11px]" style={{ color: 'var(--proto-text-light)' }}>
          {resultCount} providers
        </div>
      </div>

      {/* Mobile bottom sheet drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl bg-white sm:hidden"
            style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.15)' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full" style={{ background: 'var(--proto-card-border)' }} />
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-[15px] font-bold" style={{ color: 'var(--proto-text)' }}>Filter &amp; Sort</span>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button type="button" onClick={() => { clearFilters(); setSortBy('totalCost'); setSortDir('desc'); }} className="text-[13px] font-semibold" style={{ color: '#EF4444' }}>Clear all</button>
                )}
                <button type="button" onClick={() => setDrawerOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: 'var(--proto-page-bg)' }} aria-label="Close">✕</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-2">
              <div className="mb-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--proto-text-muted)' }}>Sort by</p>
                <div className="flex flex-col gap-0">
                  {sortOptions.map(opt => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3" style={currentSort === opt.value ? { background: 'var(--proto-teal-bg)' } : {}}>
                      <input type="radio" value={opt.value} checked={currentSort === opt.value} onChange={() => setSort(opt.value)} className="h-4 w-4 shrink-0" />
                      <span className="text-[14px]" style={currentSort === opt.value ? { color: 'var(--proto-teal-dark)', fontWeight: 600 } : { color: 'var(--proto-text)' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--proto-text-muted)' }}>Format</p>
                <div className="flex flex-wrap gap-2">
                  {formatOptions.map(f => (
                    <button key={f.key} type="button" onClick={() => toggleFormat(f.key)} className="rounded-full border px-3 py-1.5 text-[13px] font-semibold"
                      style={isFormatActive(f.key) ? { borderColor: 'var(--proto-teal)', background: 'var(--proto-teal-bg)', color: 'var(--proto-teal)' } : { borderColor: 'var(--proto-card-border)', background: 'white', color: 'var(--proto-text-muted)' }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--proto-text-muted)' }}>Certificate delivery</p>
                <div className="flex flex-wrap gap-2">
                  {certOptions.map(f => (
                    <button key={f.key} type="button" onClick={() => toggleCert(f.key)} className="rounded-full border px-3 py-1.5 text-[13px] font-semibold"
                      style={isCertActive(f.key) ? { borderColor: 'var(--proto-teal)', background: 'var(--proto-teal-bg)', color: 'var(--proto-teal)' } : { borderColor: 'var(--proto-card-border)', background: 'white', color: 'var(--proto-text-muted)' }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 pb-6 pt-3" style={{ borderTop: '1px solid var(--proto-card-border)' }}>
              <button type="button" onClick={() => setDrawerOpen(false)} className="w-full rounded-xl py-3.5 text-[15px] font-bold text-white" style={{ background: 'var(--proto-header-from)' }}>
                Show {resultCount} results
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="mx-auto mb-16 mt-3.5 w-full max-w-[1600px] px-2 sm:px-5">
        {/* Desktop table */}
        <div className="hidden sm:block w-full overflow-x-auto rounded-xl border bg-white shadow-sm" style={{ borderColor: 'var(--proto-card-border)' }}>
          <div style={{ display: 'block', width: '100%', minWidth: 880 }}>
            <table className="w-full border-collapse" style={{ minWidth: 880 }}>
              <thead>
                <tr>
                  {[
                    { col: 'name', label: 'Provider', cls: 'text-left min-w-[220px]' },
                    { col: 'license', label: 'License', cls: 'text-center' },
                    { col: 'price', label: 'Price', cls: 'text-center' },
                    { col: 'fee', label: 'Fee', cls: 'text-center' },
                    { col: 'totalCost', label: 'Total Cost', cls: 'text-center' },
                    { col: 'cert', label: 'Instant Cert', cls: 'text-center' },
                    { col: 'format', label: 'Format', cls: 'text-center' },
                    { col: 'lang', label: 'Language', cls: 'text-center' },
                  ].map(({ col, label, cls }) => (
                    <th
                      key={col}
                      className={`${thBase} ${cls}`}
                      onClick={() => ['name', 'price', 'totalCost'].includes(col) ? toggleSort(col as SortKey) : undefined}
                      style={['name', 'price', 'totalCost'].includes(col) ? { cursor: 'pointer' } : { cursor: 'default' }}
                    >
                      <span className="inline-flex items-center justify-center">
                        {label}
                        {['name', 'price', 'totalCost'].includes(col) && (
                          <span className="ml-1 text-[10px]" style={{ opacity: sortBy === col ? 1 : 0.25 }}>
                            {sortArrow(col)}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map(p => (
                  <>
                    <tr
                      key={p.id}
                      className="border-b transition-colors"
                      style={{ borderColor: 'var(--proto-row-border)', background: 'white' }}
                    >
                      <td className="px-3 py-2.5 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          {p.duplicates?.length > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(p.id)}
                              className="text-[11px] font-semibold w-4 h-4 flex items-center justify-center rounded"
                              style={{ color: 'var(--proto-teal)', background: 'var(--proto-teal-bg)' }}
                              title="Expand duplicate brands"
                            >
                              {expandedRows[p.id] ? '−' : '+'}
                            </button>
                          )}
                          {isValidUrl(p.website) ? (
                            <a
                              href={p.website!.startsWith('http') ? p.website : `https://${p.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[13px] font-semibold hover:underline"
                              style={{ color: 'var(--proto-teal)' }}
                              onClick={e => { e.preventDefault(); openProviderWebsite(p); }}
                            >
                              {p.name}
                            </a>
                          ) : (
                            <span className="text-[13px] font-semibold" style={{ color: 'var(--proto-text)' }}>{p.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center text-[12px]" style={{ color: 'var(--proto-text-light)' }}>{p.license || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-[13px] font-semibold" style={{ color: 'var(--proto-text)' }}>
                        {p.priceDisplay && p.priceDisplay.toString().toLowerCase() !== 'not found' ? `$${p.price.toFixed(0)}` : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-center text-[13px]" style={{ color: 'var(--proto-text-muted)' }}>
                        {p.stateFeeDisplay && p.stateFeeDisplay.toString().toLowerCase() !== 'not found' ? `$${p.stateFee.toFixed(0)}` : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-center text-[13px] font-bold" style={{ color: 'var(--proto-text)' }}>
                        {p.totalCostDisplay && p.totalCostDisplay.toString().toLowerCase() !== 'not found' ? `$${p.totalCost.toFixed(0)}` : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={certPillStyle(p.instantCert)}>{p.instantCert}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {(p.online || p.inPerson) && (
                          <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={formatPillStyle(p)}>{formatLabel(p)}</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {p.languages?.length > 0 && (
                          <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={langPillStyle(p.languages)}>{langLabel(p.languages)}</span>
                        )}
                      </td>
                    </tr>
                    {expandedRows[p.id] && p.duplicates?.map((d, i) => (
                      <tr key={`${p.id}-${i}`} className="border-b" style={{ borderColor: 'var(--proto-row-border)', background: 'var(--proto-teal-bg)' }}>
                        <td className="px-3 py-2 pl-9 min-w-[220px]">
                          <div className="flex items-center gap-2">
                            {isValidUrl(d.url) ? (
                              <a href={d.url.startsWith('http') ? d.url : `https://${d.url}`} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium hover:underline" style={{ color: 'var(--proto-teal)' }}>
                                {d.name}
                              </a>
                            ) : (
                              <span className="text-[12px] font-medium" style={{ color: 'var(--proto-text)' }}>{d.name}</span>
                            )}
                            <span className="text-[10px]" style={{ color: 'var(--proto-text-light)' }}>same company</span>
                          </div>
                          {d.license && <div className="text-[11px]" style={{ color: 'var(--proto-text-light)' }}>{d.license}</div>}
                        </td>
                        <td colSpan={7} className="px-3 py-2 text-[11px]" style={{ color: 'var(--proto-text-muted)' }}>Alternative brand name under same parent company</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile card stack */}
        <div className="flex flex-col gap-3 sm:hidden">
          {visible.map(p => (
            <div
              key={p.id}
              className="rounded-xl border bg-white shadow-sm overflow-hidden"
              style={{ borderColor: expandedRows[p.id] && p.duplicates?.length ? 'var(--proto-teal)' : 'var(--proto-card-border)' }}
            >
              <div
                className={`px-4 py-3.5 ${isValidUrl(p.website) ? 'cursor-pointer active:opacity-80' : ''}`}
                onClick={() => isValidUrl(p.website) && openProviderWebsite(p)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold leading-tight" style={{ color: 'var(--proto-text)' }}>{p.name}</p>
                    {p.license && <p className="mt-0.5 text-[11px]" style={{ color: 'var(--proto-text-light)' }}>{p.license}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    {p.totalCostDisplay && p.totalCostDisplay.toString().toLowerCase() !== 'not found' ? (
                      <>
                        <p className="text-[20px] font-extrabold leading-tight" style={{ color: 'var(--proto-text)' }}>${p.totalCost.toFixed(0)}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--proto-text-light)' }}>total</p>
                      </>
                    ) : (
                      <p className="text-[18px] font-bold leading-tight" style={{ color: 'var(--proto-text-light)' }}>—</p>
                    )}
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={certPillStyle(p.instantCert)}>
                    {(p.instantCert === 'Free' || p.instantCert === 'Paid') ? 'Instant Cert' : 'Cert'}: {p.instantCert}
                  </span>
                  {(p.online || p.inPerson) && (
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={formatPillStyle(p)}>{formatLabel(p)}</span>
                  )}
                  {p.languages?.length > 0 && (
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={langPillStyle(p.languages)}>{langLabel(p.languages)}</span>
                  )}
                </div>
                {p.priceDisplay && p.priceDisplay.toString().toLowerCase() !== 'not found' && (
                  <p className="mt-2 text-[11px]" style={{ color: 'var(--proto-text-light)' }}>
                    Course ${p.price.toFixed(0)}
                    {p.stateFeeDisplay && p.stateFeeDisplay.toString().toLowerCase() !== 'not found' && ` · Cert $${p.stateFee.toFixed(0)}`}
                  </p>
                )}
                {isValidUrl(p.website) && (
                  <div className="mt-2.5 flex items-center justify-end">
                    <span className="text-[11px]" style={{ color: 'var(--proto-text-light)' }}>Tap to visit ↗</span>
                  </div>
                )}
              </div>
              {p.duplicates?.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleExpand(p.id)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left"
                    style={expandedRows[p.id]
                      ? { background: 'var(--proto-teal-bg)', borderTop: '1px solid var(--proto-teal)' }
                      : { background: 'var(--proto-page-bg)', borderTop: '1px solid var(--proto-card-border)' }}
                  >
                    <span className="text-[11px] font-semibold" style={{ color: expandedRows[p.id] ? 'var(--proto-teal-dark)' : 'var(--proto-text-muted)' }}>
                      Same company · {p.duplicates.length} more brand{p.duplicates.length === 1 ? '' : 's'}
                    </span>
                    <span className="text-[12px]" style={{ color: expandedRows[p.id] ? 'var(--proto-teal)' : 'var(--proto-text-light)' }}>
                      {expandedRows[p.id] ? 'Hide ↑' : 'Show ↓'}
                    </span>
                  </button>
                  {expandedRows[p.id] && (
                    <div style={{ background: 'var(--proto-teal-bg)' }}>
                      {p.duplicates.map((d, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-2.5" style={i < p.duplicates.length - 1 ? { borderBottom: '1px solid var(--proto-teal-border)' } : {}}>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium" style={{ color: 'var(--proto-text)' }}>{d.name}</p>
                            {d.license && <p className="text-[10px]" style={{ color: 'var(--proto-text-light)' }}>{d.license} · Same brand as parent</p>}
                          </div>
                          {isValidUrl(d.url) && (
                            <a href={d.url.startsWith('http') ? d.url : `https://${d.url}`} target="_blank" rel="noopener noreferrer" className="ml-3 shrink-0 text-[11px] font-semibold" style={{ color: 'var(--proto-teal)' }} onClick={e => e.stopPropagation()}>
                              Visit ↗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="py-12 text-center text-[15px] font-semibold" style={{ color: 'var(--proto-text-muted)' }}>
            <div className="mb-2 text-3xl">🔍</div>
            <p>No providers match your filters</p>
          </div>
        )}

        {sorted.length > INITIAL_LIMIT && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(s => !s)}
              className="rounded-xl border px-6 py-2.5 text-[13px] font-semibold transition-colors hover:opacity-80"
              style={{ borderColor: 'var(--proto-card-border)', background: 'white', color: 'var(--proto-text)' }}
            >
              {showAll ? 'Show fewer ↑' : `Show all ${resultCount} providers ↓`}
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px]" style={{ color: 'var(--proto-text-light)' }}>
          <span>Showing {visible.length} of {resultCount} providers · Duplicate brands grouped under parent company</span>
          <span>
            Data sourced from TDLR public records ·{' '}
            <a href="mailto:info@txcourseguide.com" className="font-semibold hover:opacity-90" style={{ color: 'var(--proto-teal)' }}>
              Submit a correction → info@txcourseguide.com
            </a>
          </span>
        </div>
      </div>

      {/* ── Share toast — fires when RRS link is clicked ── */}
      {shareToast && (
        <div
          className="fixed bottom-5 left-1/2 z-[100] w-[calc(100vw-32px)] max-w-md -translate-x-1/2 rounded-2xl px-4 py-3.5 shadow-2xl"
          style={{ background: 'var(--proto-header-from)', border: '1px solid rgba(255,255,255,0.12)' }}
          role="dialog"
          aria-label="Share TX Course Guide"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug text-white">Saved you some research? Return the favor →</p>
              <p className="mt-0.5 text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Someone you know will get a ticket this year. Now you know where to send them.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissToast}
              className="shrink-0 rounded-full p-1 text-white/60 hover:text-white"
              aria-label="Dismiss"
            >✕</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`sms:?&body=${SHARE_SMS_BODY}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              📱 Text a Friend
            </a>
            <button
              type="button"
              onClick={handleCopyReddit}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {copyDone ? '✓ Copied!' : '📋 Copy Reddit Reply'}
            </button>
            <button
              type="button"
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              🔗 Share Link
            </button>
          </div>
        </div>
      )}

      {/* ── Share banner — shown after toast is dismissed ── */}
      {shareBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[90] px-4 py-2.5"
          style={{ background: 'var(--proto-header-from)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
          role="banner"
        >
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-[12px] font-medium text-white/80">
              Someone you know will get a ticket this year. Now you know where to send them.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`sms:?&body=${SHARE_SMS_BODY}`}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                📱 Text a Friend
              </a>
              <button
                type="button"
                onClick={handleCopyReddit}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                {copyDone ? '✓ Copied!' : '📋 Copy Reddit Reply'}
              </button>
              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                🔗 Share
              </button>
              <button
                type="button"
                onClick={dismissBanner}
                className="ml-1 text-white/40 hover:text-white/70 text-[13px]"
                aria-label="Dismiss"
              >✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
