import { useState, useMemo } from 'react';

type Mode = 'ticket' | 'insurance';
type RateLevel = 'low' | 'average' | 'high';
type DiscountLevel = 'low' | 'mid' | 'high';

const COURT_FEE = 144;
const RATE_MAP: Record<RateLevel, number> = { low: 0.13, average: 0.22, high: 0.35 };
const DISCOUNT_RATE_MAP: Record<DiscountLevel, number> = { low: 0.03, mid: 0.05, high: 0.1 };

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

const cardStyle: React.CSSProperties = { borderRadius: 16, border: '1px solid var(--proto-card-border)', background: '#fff', padding: '24px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--proto-text)', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid var(--proto-card-border)', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--proto-text)', background: '#fff' };

export default function TicketCalculator() {
  const [mode, setMode] = useState<Mode>('ticket');

  // Tab A state
  const [premium, setPremium] = useState(2600);
  const [fine, setFine] = useState(200);
  const [rateLevel, setRateLevel] = useState<RateLevel>('average');
  const [courseFee, setCourseFee] = useState(29);
  const [includeDiscount, setIncludeDiscount] = useState(true);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

  // Tab B state
  const [discountLevel, setDiscountLevel] = useState<DiscountLevel>('mid');
  const [renewal, setRenewal] = useState(true);
  const [insuranceCourseFee, setInsuranceCourseFee] = useState(29);

  // Tab A calculations
  const increasePerYear = premium * RATE_MAP[rateLevel];
  const ticketTotal = fine + increasePerYear * 3;
  const dscOutOfPocket = courseFee + COURT_FEE;
  const dscDiscountTotal = includeDiscount ? 3 * premium * 0.05 : 0;
  const dscNetCost = dscOutOfPocket - dscDiscountTotal;
  const savingsDifference = Math.max(0, ticketTotal - dscNetCost);

  // Tab B calculations
  const discountRate = DISCOUNT_RATE_MAP[discountLevel];
  const annualSavings = premium * discountRate;
  const insuranceYears = renewal ? 6 : 3;
  const insuranceTotalSavings = insuranceYears * annualSavings;
  const insuranceCourseCost = renewal ? insuranceCourseFee * 2 : insuranceCourseFee;
  const insuranceNetSavings = insuranceTotalSavings - insuranceCourseCost;
  const paybackWeeks = annualSavings > 0 ? Math.ceil(insuranceCourseFee / (annualSavings / 52)) : 0;
  const paybackLabel = paybackWeeks >= 4 ? `${Math.floor(paybackWeeks / 4)} months` : `${paybackWeeks} weeks`;

  const tabActive: React.CSSProperties = { background: 'var(--proto-header-from)', color: '#fff' };
  const tabInactive: React.CSSProperties = { color: 'var(--proto-text-muted)' };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Mode tabs */}
      <div style={{ marginBottom: 24, display: 'flex', borderRadius: 12, border: '1px solid var(--proto-card-border)', background: '#fff', padding: 4 }}>
        <button type="button" onClick={() => setMode('ticket')} style={{ flex: 1, borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', ...(mode === 'ticket' ? tabActive : tabInactive) }}>
          I got a ticket
        </button>
        <button type="button" onClick={() => setMode('insurance')} style={{ flex: 1, borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', ...(mode === 'insurance' ? tabActive : tabInactive) }}>
          I just want to save on insurance
        </button>
      </div>

      {/* Tab A */}
      {mode === 'ticket' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--proto-text)', marginBottom: 16 }}>Your numbers</h2>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <label style={labelStyle}>My current annual premium</label>
                <input type="number" min={800} max={10000} step={100} value={premium} onChange={e => setPremium(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ticket fine amount</label>
                <input type="number" min={0} max={2000} step={10} value={fine} onChange={e => setFine(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Course fee I'd pay</label>
                <input type="number" min={25} max={100} step={1} value={courseFee} onChange={e => setCourseFee(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Insurance rate increase level</label>
                <select value={rateLevel} onChange={e => setRateLevel(e.target.value as RateLevel)} style={inputStyle}>
                  <option value="low">Low (+13%)</option>
                  <option value="average">Average (+22%)</option>
                  <option value="high">High (+35%)</option>
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 13, color: 'var(--proto-text)', cursor: 'pointer' }}>
              <input type="checkbox" checked={includeDiscount} onChange={e => setIncludeDiscount(e.target.checked)} style={{ width: 16, height: 16 }} />
              Include 5% insurance discount from taking the DSC
            </label>
          </div>

          {/* Results */}
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <div style={{ ...cardStyle, background: '#FEF2F2', borderColor: '#FECACA' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B91C1C', marginBottom: 8 }}>3-Year cost if you just pay the ticket</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#991B1B', marginBottom: 4 }}>${fmt(ticketTotal)}</div>
              <div style={{ fontSize: 12, color: '#B91C1C' }}>Fine ${fmt(fine)} + insurance increases ${fmt(increasePerYear * 3)}</div>
              <div style={{ marginTop: 12, fontSize: 12, color: '#7F1D1D', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Year 0 (fine)</span><span>${fmt(fine)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Year 1 (ins. increase)</span><span>+${fmt(increasePerYear)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Year 2 (ins. increase)</span><span>+${fmt(increasePerYear)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Year 3 (ins. increase)</span><span>+${fmt(increasePerYear)}</span></div>
              </div>
            </div>

            <div style={{ ...cardStyle, background: 'var(--proto-teal-bg)', borderColor: 'var(--proto-teal-border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--proto-teal-dark)', marginBottom: 8 }}>3-Year cost if you take a DSC</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--proto-teal-dark)', marginBottom: 4 }}>${fmt(Math.max(0, dscNetCost))}</div>
              <div style={{ fontSize: 12, color: 'var(--proto-teal-dark)' }}>Out-of-pocket ${fmt(dscOutOfPocket)}{includeDiscount ? ` − discount $${fmt(dscDiscountTotal)}` : ''}</div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--proto-teal-dark)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Course fee</span><span>${fmt(courseFee)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Court admin fee</span><span>${fmt(COURT_FEE)}</span></div>
                {includeDiscount && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Insurance discount (3yr)</span><span>−${fmt(dscDiscountTotal)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--proto-teal-border)', paddingTop: 4 }}><span>Net cost</span><span>${fmt(Math.max(0, dscNetCost))}</span></div>
              </div>
            </div>
          </div>

          {savingsDifference > 0 && (
            <div style={{ textAlign: 'center', padding: '20px', background: 'var(--proto-teal-bg)', borderRadius: 12, border: '1px solid var(--proto-teal-border)' }}>
              <div style={{ fontSize: 13, color: 'var(--proto-teal-dark)', fontWeight: 600, marginBottom: 4 }}>Taking a $25 DSC saves you approximately</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--proto-teal-dark)' }}>${fmt(savingsDifference)}</div>
              <div style={{ fontSize: 12, color: 'var(--proto-text-muted)', marginTop: 4 }}>over 3 years compared to paying the ticket and letting insurance increase</div>
            </div>
          )}

          <div>
            <button type="button" onClick={() => setAssumptionsOpen(o => !o)} style={{ fontSize: 12, color: 'var(--proto-text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              {assumptionsOpen ? 'Hide' : 'Show'} assumptions
            </button>
            {assumptionsOpen && (
              <div style={{ marginTop: 8, padding: 16, background: '#F9FAFB', borderRadius: 8, fontSize: 12, color: 'var(--proto-text-muted)', lineHeight: 1.7 }}>
                <p>• Insurance rate increases are estimates based on industry averages. Your actual increase depends on your carrier, driving history, and state. Low = +13%, Average = +22%, High = +35%.</p>
                <p>• Court admin fee is $144 (typical Houston/Dallas figure — your court may differ).</p>
                <p>• Insurance discount assumes 5% for 3 years from an approved voluntary DSC. Varies by carrier.</p>
                <p>• This calculator does not constitute financial or legal advice.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab B */}
      {mode === 'insurance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--proto-text)', marginBottom: 16 }}>Your numbers</h2>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <label style={labelStyle}>My current annual premium</label>
                <input type="number" min={800} max={10000} step={100} value={premium} onChange={e => setPremium(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Insurance discount level</label>
                <select value={discountLevel} onChange={e => setDiscountLevel(e.target.value as DiscountLevel)} style={inputStyle}>
                  <option value="low">Low (3%) — most carriers</option>
                  <option value="mid">Mid (5%) — common</option>
                  <option value="high">High (10%) — GEICO TX, some others</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Course fee</label>
                <input type="number" min={25} max={100} step={1} value={insuranceCourseFee} onChange={e => setInsuranceCourseFee(Number(e.target.value))} style={inputStyle} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 13, color: 'var(--proto-text)', cursor: 'pointer' }}>
              <input type="checkbox" checked={renewal} onChange={e => setRenewal(e.target.checked)} style={{ width: 16, height: 16 }} />
              I plan to renew the discount (take the course every 3 years)
            </label>
          </div>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div style={{ ...cardStyle, background: 'var(--proto-teal-bg)', borderColor: 'var(--proto-teal-border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--proto-teal-dark)', marginBottom: 8 }}>Annual savings</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--proto-teal-dark)' }}>${fmt(annualSavings)}</div>
              <div style={{ fontSize: 12, color: 'var(--proto-teal-dark)' }}>{(discountRate * 100).toFixed(0)}% of ${fmt(premium)} premium</div>
            </div>
            <div style={{ ...cardStyle }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--proto-text-muted)', marginBottom: 8 }}>{insuranceYears}-year net savings</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--proto-text)' }}>${fmt(insuranceNetSavings)}</div>
              <div style={{ fontSize: 12, color: 'var(--proto-text-muted)' }}>${fmt(insuranceTotalSavings)} savings − ${fmt(insuranceCourseCost)} course cost</div>
            </div>
            <div style={{ ...cardStyle }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--proto-text-muted)', marginBottom: 8 }}>Course pays for itself in</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--proto-text)' }}>{paybackLabel}</div>
              <div style={{ fontSize: 12, color: 'var(--proto-text-muted)' }}>based on ${fmt(annualSavings / 52)}/week savings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
