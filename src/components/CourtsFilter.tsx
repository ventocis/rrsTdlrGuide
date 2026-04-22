import { useState, useMemo } from 'react';

type CourtRecord = {
  county: string;
  courtType: string;
  court: string;
  website: string;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  title: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
};

function buildJudgeName(row: CourtRecord): string {
  return [row.prefix, row.firstName, row.middleName, row.lastName, row.suffix]
    .filter(s => s != null && String(s).trim() !== '')
    .map(s => String(s).trim())
    .join(' ').trim();
}

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  const t = url.trim();
  if (!t || t.toLowerCase() === 'website not found' || t.toLowerCase() === 'not found' || t.toLowerCase() === 'n/a') return false;
  return t.startsWith('http://') || t.startsWith('https://');
}

function formatPhone(phone: string): string {
  const raw = String(phone || '').trim();
  if (!raw) return '';
  return raw.replace(/[^\d+]/g, '') || raw;
}

interface Props {
  courts: CourtRecord[];
}

export default function CourtsFilter({ courts }: Props) {
  const [county, setCounty] = useState('');
  const [courtType, setCourtType] = useState('');
  const [courtName, setCourtName] = useState('');
  const [selectedCourt, setSelectedCourt] = useState<CourtRecord | null>(null);

  const counties = useMemo(() => [...new Set(courts.map(c => c.county))].sort(), [courts]);

  const courtTypes = useMemo(() =>
    county ? [...new Set(courts.filter(c => c.county === county).map(c => c.courtType))].sort() : [],
    [courts, county]
  );

  const courtNames = useMemo(() =>
    county && courtType
      ? [...new Map(courts.filter(c => c.county === county && c.courtType === courtType).map(c => [c.court, c])).values()]
      : [],
    [courts, county, courtType]
  );

  function onCountyChange(val: string) {
    setCounty(val); setCourtType(''); setCourtName(''); setSelectedCourt(null);
  }
  function onCourtTypeChange(val: string) {
    setCourtType(val); setCourtName(''); setSelectedCourt(null);
  }
  function onCourtNameChange(val: string) {
    setCourtName(val);
    const found = courts.find(c => c.county === county && c.courtType === courtType && c.court === val) || null;
    setSelectedCourt(found);
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--proto-text)', marginBottom: 6 };
  const selectStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '2px solid var(--proto-card-border)', borderRadius: 10, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '0.95rem', color: 'var(--proto-text)', background: '#fff', cursor: 'pointer' };

  return (
    <section
      className="mb-6 rounded-2xl border bg-white p-4 sm:p-6"
      style={{ borderColor: 'var(--proto-card-border)' }}
      aria-labelledby="court-finder-heading"
    >
      <h2 id="court-finder-heading" className="mb-2 text-lg font-semibold" style={{ color: 'var(--proto-text)' }}>
        Court Finder
      </h2>
      <p className="mb-4 text-[13px]" style={{ color: 'var(--proto-text-muted)' }}>
        Start by selecting your county, then court type, then the specific court handling your ticket.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label htmlFor="county-select" style={labelStyle}>County</label>
          <select id="county-select" value={county} onChange={e => onCountyChange(e.target.value)} style={selectStyle}>
            <option value="">Select county</option>
            {counties.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {county && (
          <div>
            <label htmlFor="type-select" style={labelStyle}>Court Type</label>
            <select id="type-select" value={courtType} onChange={e => onCourtTypeChange(e.target.value)} style={selectStyle}>
              <option value="">Select court type</option>
              {courtTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}
        {courtType && (
          <div>
            <label htmlFor="court-select" style={labelStyle}>Court</label>
            <select id="court-select" value={courtName} onChange={e => onCourtNameChange(e.target.value)} style={selectStyle}>
              <option value="">Select court</option>
              {courtNames.map(c => <option key={c.court} value={c.court}>{c.court}</option>)}
            </select>
          </div>
        )}
      </div>

      {selectedCourt && (
        <div
          className="mt-5 rounded-xl border p-4 sm:p-5"
          style={{ borderColor: 'var(--proto-card-border)', background: 'var(--proto-hover-bg)' }}
        >
          <h3 className="mb-1 text-base font-semibold" style={{ color: 'var(--proto-text)' }}>
            {selectedCourt.court} — {selectedCourt.courtType}
          </h3>
          <p className="mb-3 text-[13px]" style={{ color: 'var(--proto-text-muted)' }}>{selectedCourt.county} County</p>

          <div className="grid gap-3 text-[13px] sm:grid-cols-2">
            <div>
              <h4 className="mb-1 font-semibold" style={{ color: 'var(--proto-text)' }}>Judge</h4>
              <p className="m-0" style={{ color: 'var(--proto-text)' }}>{buildJudgeName(selectedCourt) || 'Not listed'}</p>
              {selectedCourt.title && <p className="m-0 text-[12px]" style={{ color: 'var(--proto-text-muted)' }}>{selectedCourt.title}</p>}
            </div>
            <div>
              <h4 className="mb-1 font-semibold" style={{ color: 'var(--proto-text)' }}>Address</h4>
              <p className="m-0" style={{ color: 'var(--proto-text)' }}>{selectedCourt.address || 'Not on file'}</p>
              {(selectedCourt.city || selectedCourt.zipCode) && (
                <p className="m-0 text-[13px]" style={{ color: 'var(--proto-text)' }}>
                  {[selectedCourt.city, selectedCourt.zipCode].filter(s => s && String(s).trim()).join(', ')}
                </p>
              )}
            </div>
            <div>
              <h4 className="mb-1 font-semibold" style={{ color: 'var(--proto-text)' }}>Phone</h4>
              {selectedCourt.phone ? (
                <a href={`tel:${formatPhone(selectedCourt.phone)}`} className="font-medium hover:underline" style={{ color: 'var(--proto-teal)' }}>{selectedCourt.phone}</a>
              ) : <span style={{ color: 'var(--proto-text)' }}>Not on file</span>}
            </div>
            <div>
              <h4 className="mb-1 font-semibold" style={{ color: 'var(--proto-text)' }}>Email</h4>
              {selectedCourt.email ? (
                <a href={`mailto:${selectedCourt.email}`} className="font-medium hover:underline break-all" style={{ color: 'var(--proto-teal)' }}>{selectedCourt.email}</a>
              ) : <span style={{ color: 'var(--proto-text)' }}>Not on file</span>}
            </div>
            <div>
              <h4 className="mb-1 font-semibold" style={{ color: 'var(--proto-text)' }}>Website</h4>
              {isValidUrl(selectedCourt.website) ? (
                <a href={selectedCourt.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: 'var(--proto-teal)' }}>Visit court website</a>
              ) : <span style={{ color: 'var(--proto-text)' }}>Not on file</span>}
            </div>
          </div>

          <p className="mt-4 text-[12px]" style={{ color: 'var(--proto-text-muted)' }}>
            Information sourced from public court directory records. Verify details with the court before submitting documents.
          </p>
        </div>
      )}
    </section>
  );
}
