import { useState, useEffect, useRef } from 'react';

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

type Step = 'step1' | 'step1b' | 'step2' | 'step3' | 'step4' | 'step5' | 'resultCard';

const STEP_NUMS: Record<Step, number> = { step1: 1, step1b: 1, step2: 2, step3: 3, step4: 4, step5: 5, resultCard: 5 };

function buildJudgeName(row: CourtRecord): string {
  return [row.prefix, row.firstName, row.middleName, row.lastName, row.suffix]
    .filter(s => s != null && String(s).trim() !== '')
    .map(s => String(s).trim())
    .join(' ').trim();
}

interface Props {
  courts: CourtRecord[];
}

export default function EligibilityChecker({ courts }: Props) {
  const [step, setStep] = useState<Step>('step1');
  const [violation, setViolation] = useState<string | null>(null);
  const [speedOver, setSpeedOver] = useState<number | null>(null);
  const [cdl, setCdl] = useState<boolean | null>(null);
  const [priorDismissal, setPriorDismissal] = useState<boolean | null>(null);
  const [courtApproval, setCourtApproval] = useState<boolean | string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<CourtRecord | null>(null);
  const [speedInput, setSpeedInput] = useState('');

  // Court selector state
  const [county, setCounty] = useState('');
  const [courtType, setCourtType] = useState('');
  const [courtName, setCourtName] = useState('');

  const progressPct = step === 'resultCard' ? 100 : ((STEP_NUMS[step] - 1) / 5) * 100;

  function goTo(s: Step) {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectViolation(type: string) {
    setViolation(type);
    if (type === 'serious') { showResult(type, null, null, null, null, null); return; }
    if (type === 'speeding') { goTo('step1b'); } else { goTo('step2'); }
  }

  function submitSpeed() {
    const val = parseInt(speedInput, 10);
    const spd = Number.isNaN(val) ? 0 : val;
    setSpeedOver(spd);
    goTo('step2');
  }

  function selectCDL(val: boolean) { setCdl(val); goTo('step3'); }
  function selectPrior(val: boolean) { setPriorDismissal(val); goTo('step4'); }

  function selectCourtApproval(val: boolean | string) {
    setCourtApproval(val);
    if (val === 'denied') { showResult(violation, speedOver, cdl, priorDismissal, val, null); return; }
    goTo('step5');
  }

  // Derived court data
  const counties = [...new Set(courts.map(c => c.county))].sort();
  const courtTypes = county
    ? [...new Set(courts.filter(c => c.county === county).map(c => c.courtType))].sort()
    : [];
  const courtNames = county && courtType
    ? [...new Map(
        courts.filter(c => c.county === county && c.courtType === courtType)
          .map(c => [c.court, c])
      ).values()]
    : [];

  function onCountyChange(val: string) { setCounty(val); setCourtType(''); setCourtName(''); setSelectedCourt(null); }
  function onCourtTypeChange(val: string) { setCourtType(val); setCourtName(''); setSelectedCourt(null); }
  function onCourtNameChange(val: string) {
    setCourtName(val);
    const found = courts.find(c => c.county === county && c.courtType === courtType && c.court === val) || null;
    setSelectedCourt(found);
    if (found) showResult(violation, speedOver, cdl, priorDismissal, courtApproval, found);
  }

  function restart() {
    setStep('step1'); setViolation(null); setSpeedOver(null); setCdl(null);
    setPriorDismissal(null); setCourtApproval(null); setSelectedCourt(null);
    setSpeedInput(''); setCounty(''); setCourtType(''); setCourtName('');
  }

  // Result evaluation
  type EvalResult = {
    status: 'eligible' | 'ineligible';
    icon: string;
    title: string;
    reason: string;
    steps: { text: string }[];
    course: { name: string; desc: string } | null;
  };

  const [result, setResult] = useState<EvalResult | null>(null);

  function buildEligibleSteps(isPending: boolean, court: CourtRecord | null): { text: string }[] {
    const steps: { text: string }[] = [];
    if (isPending) steps.push({ text: '<strong>Contact your court first</strong> and request permission to take a defensive driving course. You can usually do this in person, by mail, or sometimes online. Do not take the course before receiving approval.' });
    steps.push({ text: "Pay the court's administrative fee to request dismissal. Some courts require this when you make your request." });
    if (court) {
      const url = court.website?.trim();
      const valid = url && url !== '' && url.toLowerCase() !== 'website not found' && url.toLowerCase() !== 'not found' && url.toLowerCase() !== 'n/a';
      steps.push({ text: valid ? `⚠️ For <strong>${court.court}</strong>, see <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:var(--proto-teal-dark)">court website</a>. Confirm procedures and deadlines with the court.` : `⚠️ For <strong>${court.court}</strong>, confirm procedures and deadlines directly with the court.` });
    }
    steps.push({ text: 'Enroll in and complete a <strong>TDLR-approved Driving Safety Course</strong>. The course is 6 hours and must be completed within the court\'s deadline.' });
    steps.push({ text: 'Obtain your <strong>Type 3A driving record</strong> from <a href="https://www.dps.texas.gov" target="_blank" rel="noopener noreferrer" style="color:var(--proto-teal-dark)">dps.texas.gov</a> for $10 (if your court requires it).' });
    steps.push({ text: 'Submit your <strong>completion certificate</strong> and driving record to the court by the deadline.' });
    return steps;
  }

  function evaluate(v: string | null, spd: number | null, hasCdl: boolean | null, prior: boolean | null, approval: boolean | string | null, court: CourtRecord | null): EvalResult {
    if (v === 'serious') return { status: 'ineligible', icon: '🚫', title: 'Not Eligible for Defensive Driving Dismissal', reason: 'Serious and criminal traffic violations — including reckless driving, DWI, passing a school bus, construction zone violations (with workers present), and hit and run — cannot be dismissed through defensive driving under Texas law.', steps: [{ text: 'Consider consulting a traffic attorney. Many offer free consultations for serious violations.' }, { text: 'You may be able to negotiate a plea to a lesser offense. Contact the court clerk for options.' }], course: null };
    if (approval === 'denied') return { status: 'ineligible', icon: '🚫', title: 'Court Denied Your Request', reason: "If the court has already denied your request to take a defensive driving course, you cannot take the course for dismissal purposes.", steps: [{ text: 'You may be able to appeal the denial or ask again with more context. Contact the court clerk.' }, { text: 'Consider consulting a traffic attorney to understand your remaining options.' }], course: null };
    if (hasCdl) return { status: 'ineligible', icon: '🚛', title: 'CDL Holders Cannot Use Defensive Driving for Dismissal', reason: "Under Texas law, commercial driver's license holders are not eligible to dismiss traffic violations through a defensive driving course — even when driving a personal vehicle.", steps: [{ text: "Consult a traffic attorney experienced with commercial driving violations." }, { text: "Review the FMCSA's regulations on traffic violations for CDL holders." }], course: null };
    if (prior) return { status: 'ineligible', icon: '📅', title: 'Not Yet Eligible — 12-Month Window', reason: 'Texas law permits only one defensive driving dismissal per 12-month period.', steps: [{ text: 'Determine the exact date your last dismissal was granted. Your eligibility resets 12 months from that date.' }, { text: 'Ask the court for a continuance (extension) to delay your deadline until your 12-month window reopens.' }], course: null };
    if (v === 'speeding' && spd !== null && spd >= 25) return { status: 'ineligible', icon: '💨', title: 'Speed Too High for Dismissal', reason: `You were cited for going ${spd} mph over the limit. Texas courts typically will not approve defensive driving dismissal for speeds 25 mph or more over the posted limit.`, steps: [{ text: "You can still ask the court — approval is at the judge's discretion." }, { text: 'Consider consulting a traffic attorney for high-speed violations.' }], course: null };

    const isPending = approval === 'pending';
    return {
      status: 'eligible',
      icon: '✅',
      title: isPending ? 'Likely Eligible — Request Court Approval First' : 'You Appear Eligible for Dismissal',
      reason: isPending ? "Based on your answers, you should qualify to have this ticket dismissed. However, you must get court approval before signing up for the course. Taking the course before approval is a common and costly mistake." : 'Based on your answers, you appear to qualify to dismiss this ticket through a TDLR-approved defensive driving course.',
      steps: buildEligibleSteps(isPending, court),
      course: { name: 'Any TDLR-Approved Driving Safety Course', desc: 'Look for a course at or near the $25 base price. Skip optional add-ons to minimize cost. Order your Type 3A driving record directly from dps.texas.gov for $10.' }
    };
  }

  function showResult(v: string | null, spd: number | null, hasCdl: boolean | null, prior: boolean | null, approval: boolean | string | null, court: CourtRecord | null) {
    setResult(evaluate(v, spd, hasCdl, prior, approval, court));
    goTo('resultCard');
  }

  const certBgStyle = result?.status === 'eligible'
    ? { background: 'var(--pill-cert-free-bg)', border: '2px solid var(--pill-cert-free-border)' }
    : { background: 'var(--pill-cert-paid-bg)', border: '2px solid var(--pill-cert-paid-border)' };

  return (
    <div className="eligibility-checker-page min-h-screen" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: 'var(--proto-page-bg)' }}>
      {/* Hero */}
      <div style={{ padding: '48px 24px 72px', textAlign: 'center', background: 'var(--proto-page-bg)' }}>
        <h1 style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 700, color: 'var(--proto-text)', lineHeight: 1.2, marginBottom: 14 }}>
          Can I Dismiss My<br />Texas Traffic Ticket?
        </h1>
        <p style={{ color: 'var(--proto-text-muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          Answer 5 quick questions. Get your eligibility result and exact next steps in under a minute.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 640, margin: '-28px auto 0', padding: '0 16px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: 'var(--proto-card-border)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 100, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)', width: `${progressPct}%`, background: 'linear-gradient(90deg, var(--proto-teal), #14B8A6)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.72rem', color: 'var(--proto-text-muted)', fontWeight: 500 }}>
          <span>Start</span>
          <span>{step === 'resultCard' ? 'Done!' : `Step ${STEP_NUMS[step]} of 5`}</span>
          <span>Result</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 640, margin: '32px auto 60px', padding: '0 16px' }}>
        {step === 'step1' && (
          <Card>
            <StepNum>Question 1 of 5</StepNum>
            <h2 style={h2Style}>What type of violation are you dealing with?</h2>
            <p style={subStyle}>Select the closest match to the charge on your ticket.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { type: 'speeding', icon: '🚗', label: 'Speeding', sub: 'Going faster than the posted speed limit' },
                { type: 'running_light', icon: '🚦', label: 'Red Light / Stop Sign', sub: 'Failure to stop or yield' },
                { type: 'no_insurance', icon: '📄', label: 'No Proof of Insurance', sub: 'Failure to maintain financial responsibility' },
                { type: 'cell_phone', icon: '📱', label: 'Cell Phone / Texting While Driving' },
                { type: 'other_minor', icon: '⚠️', label: 'Other Minor Traffic Violation', sub: 'Lane change, following too close, seat belt, etc.' },
                { type: 'serious', icon: '🚨', label: 'Serious or Criminal Violation', sub: 'Reckless driving, DWI, passing school bus, construction zone with workers, hit and run' },
              ].map(o => (
                <OptBtn key={o.type} onClick={() => selectViolation(o.type)}>
                  <IconBox>{o.icon}</IconBox>
                  <div style={{ flex: 1 }}>
                    {o.label}
                    {o.sub && <small style={{ display: 'block', fontSize: '0.78rem', color: 'var(--proto-text-muted)', fontWeight: 400, marginTop: 2 }}>{o.sub}</small>}
                  </div>
                  <span style={{ color: 'var(--proto-card-border)', fontSize: '1rem' }}>›</span>
                </OptBtn>
              ))}
            </div>
          </Card>
        )}

        {step === 'step1b' && (
          <Card>
            <StepNum>Question 1b of 5</StepNum>
            <h2 style={h2Style}>How many mph over the speed limit were you cited?</h2>
            <p style={subStyle}>This matters — Texas courts typically deny dismissal for excessive speed. Enter 0 if unknown.</p>
            <div style={{ margin: '8px 0 20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--proto-header-from)', marginBottom: 8 }}>Miles per hour over the posted limit</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  type="number"
                  value={speedInput}
                  onChange={e => setSpeedInput(e.target.value)}
                  min={0} max={100}
                  placeholder="e.g. 12"
                  style={{ width: 120, padding: '12px 16px', border: '2px solid var(--proto-card-border)', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--proto-header-from)', outline: 'none', textAlign: 'center' }}
                />
                <span style={{ color: 'var(--proto-text-muted)', fontSize: '0.9rem' }}>mph over</span>
              </div>
            </div>
            <button type="button" onClick={submitSpeed} style={{ marginTop: 16, padding: '13px 28px', color: '#fff', background: 'var(--proto-header-from)', border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
              Continue →
            </button>
            <p style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--proto-text-muted)' }}>Note: Courts generally will not approve dismissal for speeds 25 mph or more over the limit.</p>
          </Card>
        )}

        {step === 'step2' && (
          <Card>
            <StepNum>Question 2 of 5</StepNum>
            <h2 style={h2Style}>Do you hold a Commercial Driver's License (CDL)?</h2>
            <p style={subStyle}>This includes any Class A, B, or C commercial license — even if you were not driving a commercial vehicle when ticketed.</p>
            <TwoColOptions>
              <OptBtn onClick={() => selectCDL(true)} centered><IconBox>🚛</IconBox><div>Yes, I have a CDL</div></OptBtn>
              <OptBtn onClick={() => selectCDL(false)} centered><IconBox>🚙</IconBox><div>No, standard license</div></OptBtn>
            </TwoColOptions>
          </Card>
        )}

        {step === 'step3' && (
          <Card>
            <StepNum>Question 3 of 5</StepNum>
            <h2 style={h2Style}>Have you used defensive driving to dismiss a Texas ticket in the last 12 months?</h2>
            <p style={subStyle}>Texas law allows only one defensive driving dismissal per 12-month period.</p>
            <TwoColOptions>
              <OptBtn onClick={() => selectPrior(true)} centered><IconBox>✅</IconBox><div>Yes, within the last 12 months</div></OptBtn>
              <OptBtn onClick={() => selectPrior(false)} centered><IconBox>❌</IconBox><div>No / Not sure</div></OptBtn>
            </TwoColOptions>
          </Card>
        )}

        {step === 'step4' && (
          <Card>
            <StepNum>Question 4 of 5</StepNum>
            <h2 style={h2Style}>Have you already requested permission from the court to take defensive driving?</h2>
            <p style={subStyle}>In Texas, you must get court approval <em>before</em> taking the course — the court does not have to grant it.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <OptBtn onClick={() => selectCourtApproval(true)} centered><IconBox>🏛️</IconBox><div>Yes, court approved it</div></OptBtn>
                <OptBtn onClick={() => selectCourtApproval('pending')} centered><IconBox>⏳</IconBox><div>Not yet — haven't asked</div></OptBtn>
              </div>
              <OptBtn onClick={() => selectCourtApproval('denied')} style={{ flexDirection: 'row', textAlign: 'left', gap: 14 }}>
                <IconBox>🚫</IconBox><div>Court denied my request</div>
              </OptBtn>
            </div>
          </Card>
        )}

        {step === 'step5' && (
          <Card>
            <StepNum>Question 5 of 5</StepNum>
            <h2 style={h2Style}>Which court is handling your ticket?</h2>
            <p style={subStyle}>Select your county, then court type, then the specific court.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 8 }}>
              <CourtDropdown label="County" value={county} onChange={onCountyChange} options={counties} placeholder="Select county" />
              {county && <CourtDropdown label="Court Type" value={courtType} onChange={onCourtTypeChange} options={courtTypes} placeholder="Select court type" />}
              {courtType && <CourtDropdown label="Court" value={courtName} onChange={onCourtNameChange} options={courtNames.map(c => c.court)} placeholder="Select court" />}
            </div>
          </Card>
        )}

        {step === 'resultCard' && result && (
          <Card>
            {/* Result banner */}
            <div style={{ ...certBgStyle, borderRadius: 12, padding: '24px 28px', marginBottom: 28, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{result.icon}</div>
              <div>
                <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 700, fontSize: '1.4rem', marginBottom: 4, color: result.status === 'eligible' ? 'var(--color-rui-success-700)' : 'var(--color-rui-error-600)' }}>{result.title}</div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--proto-text)', opacity: 0.85 }}>{result.reason}</div>
              </div>
            </div>

            {/* Steps */}
            <div>
              <h3 style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--proto-header-from)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--proto-card-border)' }}>
                {result.status === 'eligible' ? 'Your Next Steps' : 'What You Can Do'}
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, padding: 0 }}>
                {result.steps.map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: '0.92rem', lineHeight: 1.55 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--proto-header-from)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <div dangerouslySetInnerHTML={{ __html: s.text }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Course recommendation */}
            {result.course && (
              <div style={{ background: 'var(--proto-page-bg)', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--proto-text-muted)', marginBottom: 8 }}>Recommended Course</div>
                <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--proto-header-from)', marginBottom: 4 }}>{result.course.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--proto-text-muted)', lineHeight: 1.5 }}>{result.course.desc}</div>
              </div>
            )}

            <button type="button" onClick={restart} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '12px 22px', background: 'transparent', border: '2px solid var(--proto-card-border)', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 600, color: 'var(--proto-text-muted)', cursor: 'pointer' }}>
              ↩ Start Over
            </button>
          </Card>
        )}
      </div>

      <p style={{ maxWidth: 640, margin: '0 auto 40px', padding: '0 16px', fontSize: '0.78rem', color: 'var(--proto-text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
        This tool provides general guidance only and is not legal advice. Court decisions on dismissal requests are at the judge's discretion. Always confirm requirements directly with your court. Eligibility rules are based on Texas Transportation Code §543.101–543.112 and TDLR regulations.
      </p>
    </div>
  );
}

// Sub-components
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(15,31,56,0.1), 0 1px 4px rgba(15,31,56,0.06)', padding: '36px 40px' }}>
      {children}
    </div>
  );
}

function StepNum({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--proto-text-muted)', marginBottom: 8 }}>{children}</div>;
}

const h2Style: React.CSSProperties = { fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--proto-header-from)', lineHeight: 1.3, marginBottom: 6 };
const subStyle: React.CSSProperties = { color: 'var(--proto-text-muted)', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.5 };

function TwoColOptions({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>;
}

function OptBtn({ children, onClick, centered, style }: { children: React.ReactNode; onClick: () => void; centered?: boolean; style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: centered ? 'center' : 'center',
        flexDirection: centered ? 'column' : 'row',
        gap: centered ? 8 : 14,
        padding: centered ? '20px 16px' : '16px 20px',
        border: '2px solid var(--proto-card-border)',
        borderRadius: 10,
        background: '#fff',
        cursor: 'pointer',
        textAlign: centered ? 'center' : 'left',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.95rem',
        fontWeight: 500,
        color: 'var(--proto-text)',
        transition: 'all 0.18s ease',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--proto-page-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
      {children}
    </div>
  );
}

function CourtDropdown({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--proto-header-from)' }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--proto-card-border)', borderRadius: 10, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '0.95rem', fontWeight: 500, color: value ? 'var(--proto-text)' : 'var(--proto-text-muted)', background: '#fff', cursor: 'pointer' }}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
