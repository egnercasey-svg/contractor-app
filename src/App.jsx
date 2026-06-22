import { useState, useEffect } from "react";

const ANTHROPIC_MODEL = "claude-sonnet-4-6";

const T = {
  navy:    "#0D1B2A",
  navyMid: "#152539",
  navyLt:  "#1E3A52",
  cyan:    "#00C2D1",
  cyanDim: "#007E89",
  steel:   "#8EAFC2",
  chalk:   "#E8F0F5",
  white:   "#FFFFFF",
  warn:    "#F4A261",
  danger:  "#E63946",
  ok:      "#52B788",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.navy}; color: ${T.chalk}; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .app { max-width: 960px; margin: 0 auto; padding: 24px 16px 80px; }
  .app::before {
    content: ''; position: fixed; inset: 0;
    background-image: linear-gradient(rgba(0,194,209,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,209,0.04) 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none; z-index: 0;
  }
  .rel { position: relative; z-index: 1; }
  .header { border-bottom: 1px solid ${T.cyanDim}; padding-bottom: 20px; margin-bottom: 32px; }
  .header-eyebrow { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.15em; color: ${T.cyan}; text-transform: uppercase; margin-bottom: 6px; }
  .header h1 { font-size: clamp(22px, 4vw, 32px); font-weight: 700; color: ${T.white}; line-height: 1.15; }
  .header p { margin-top: 6px; color: ${T.steel}; font-size: 14px; max-width: 520px; }
  .tabs { display: flex; gap: 4px; margin-bottom: 28px; border-bottom: 1px solid ${T.navyLt}; overflow-x: auto; }
  .tab { background: none; border: none; border-bottom: 2px solid transparent; color: ${T.steel}; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 10px 16px; cursor: pointer; transition: color 0.15s, border-color 0.15s; margin-bottom: -1px; white-space: nowrap; }
  .tab:hover { color: ${T.chalk}; }
  .tab.active { color: ${T.cyan}; border-bottom-color: ${T.cyan}; }
  .card { background: ${T.navyMid}; border: 1px solid ${T.navyLt}; border-radius: 8px; padding: 24px; margin-bottom: 20px; }
  .card-title { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: ${T.cyan}; text-transform: uppercase; margin-bottom: 14px; }
  label { display: block; font-size: 12px; color: ${T.steel}; margin-bottom: 6px; font-family: 'DM Mono', monospace; letter-spacing: 0.05em; }
  input, select, textarea { width: 100%; background: ${T.navy}; border: 1px solid ${T.navyLt}; border-radius: 4px; color: ${T.chalk}; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 10px 12px; margin-bottom: 14px; outline: none; transition: border-color 0.15s; }
  input:focus, select:focus, textarea:focus { border-color: ${T.cyan}; }
  select option { background: ${T.navy}; }
  textarea { resize: vertical; min-height: 80px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  @media(max-width:620px) { .grid2, .grid3 { grid-template-columns: 1fr; } }
  .btn { display: inline-flex; align-items: center; gap: 8px; background: ${T.cyan}; color: ${T.navy}; border: none; border-radius: 4px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; padding: 10px 20px; cursor: pointer; transition: opacity 0.15s; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn:not(:disabled):hover { opacity: 0.88; }
  .btn-ghost { background: transparent; border: 1px solid ${T.navyLt}; color: ${T.steel}; font-weight: 500; }
  .btn-ghost:hover { border-color: ${T.steel}; color: ${T.chalk}; }
  .btn-ok { background: ${T.ok}; color: ${T.navy}; }
  .btn-sm { padding: 6px 14px; font-size: 12px; }
  .result { font-size: 14px; line-height: 1.7; color: ${T.chalk}; white-space: pre-wrap; }
  .result h3 { color: ${T.cyan}; font-size: 13px; margin: 14px 0 6px; font-family:'DM Mono',monospace; letter-spacing:0.08em; }
  .result strong { color: ${T.white}; }
  .result ul { padding-left: 18px; }
  .result li { margin-bottom: 4px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 16px; height: 16px; border: 2px solid ${T.cyanDim}; border-top-color: ${T.cyan}; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
  .est-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .est-table th { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: ${T.steel}; text-transform: uppercase; text-align: left; padding: 8px 12px; border-bottom: 1px solid ${T.navyLt}; }
  .est-table td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
  .est-table tr:last-child td { border-bottom: none; }
  .est-table .num { font-family: 'DM Mono', monospace; color: ${T.cyan}; }
  .est-table .low { color: ${T.ok}; font-weight: 700; }
  .est-table .high { color: ${T.warn}; font-weight: 700; }
  .tag { display: inline-block; background: ${T.navyLt}; border-radius: 3px; padding: 2px 8px; font-size: 11px; font-family: 'DM Mono', monospace; color: ${T.steel}; margin-right: 6px; margin-bottom: 4px; }
  .tag.cyan { background: rgba(0,194,209,0.12); color: ${T.cyan}; }
  .tag.ok { background: rgba(82,183,136,0.15); color: ${T.ok}; }
  .tag.warn { background: rgba(244,162,97,0.15); color: ${T.warn}; }
  .alert { border-left: 3px solid ${T.warn}; background: rgba(244,162,97,0.08); padding: 12px 16px; border-radius: 0 4px 4px 0; font-size: 13px; color: ${T.warn}; margin-bottom: 16px; }
  .alert-ok { border-left-color: ${T.ok}; background: rgba(82,183,136,0.08); color: ${T.ok}; }
  .divider { border: none; border-top: 1px solid ${T.navyLt}; margin: 20px 0; }
  .contractor-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .contractor-row input { margin-bottom: 0; flex: 1; }

  /* Community benchmark cards */
  .bench-card {
    background: ${T.navy};
    border: 1px solid ${T.navyLt};
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 12px;
    transition: border-color 0.15s;
  }
  .bench-card:hover { border-color: ${T.cyanDim}; }
  .bench-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 6px; }
  .bench-amount { font-family: 'DM Mono', monospace; font-size: 22px; color: ${T.cyan}; font-weight: 500; }
  .bench-meta { font-size: 12px; color: ${T.steel}; margin-top: 4px; }
  .bench-desc { font-size: 13px; color: ${T.chalk}; margin-top: 8px; line-height: 1.5; }
  .stats-row { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 16px; }
  .stat-box { background: ${T.navy}; border: 1px solid ${T.navyLt}; border-radius: 6px; padding: 12px 16px; flex: 1; min-width: 120px; }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 10px; color: ${T.steel}; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
  .stat-value { font-family: 'DM Mono', monospace; font-size: 20px; color: ${T.cyan}; }
  .filter-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; align-items: flex-end; }
  .filter-row > div { flex: 1; min-width: 140px; }
  .filter-row input, .filter-row select { margin-bottom: 0; }
  .empty-state { text-align: center; padding: 40px 20px; color: ${T.steel}; font-size: 14px; }
  .empty-state .big { font-size: 32px; margin-bottom: 10px; }
  .badge-new { display: inline-block; background: rgba(0,194,209,0.15); color: ${T.cyan}; font-size: 10px; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; padding: 2px 6px; border-radius: 3px; margin-left: 6px; vertical-align: middle; }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
async function askClaude(prompt, useSearch = false) {
  const body = {
    model: ANTHROPIC_MODEL,
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  };
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  const res = await fetch("/.netlify/functions/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
}

function Spinner() { return <span className="spinner" />; }

function formatResult(text) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,3} (.+)$/gm, "<h3>$1</h3>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

const PROJECT_TYPES = [
  "Kitchen Renovation", "Bathroom Renovation", "Deck / Patio", "Roof Replacement",
  "New Build", "Extension / Addition", "Flooring", "Painting (Interior)", "Painting (Exterior)",
  "Landscaping", "Driveway", "Fencing", "HVAC", "Plumbing", "Electrical", "Windows / Doors", "Other",
];

// ── Tab 1: Vetting Checklist ─────────────────────────────────────────────────
function VettingTab() {
  const [form, setForm] = useState({ project: "", state: "", budget: "", concerns: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function generate() {
    setLoading(true); setResult("");
    try {
      const prompt = `You are an expert construction industry advisor helping a homeowner vet contractors.
Project: ${form.project}
Location/State: ${form.state}
Budget: ${form.budget}
Special concerns: ${form.concerns || "none"}

Generate a thorough contractor vetting checklist tailored to this project. Include:
1. **License & Insurance checks** — what exactly to ask for and verify
2. **Questions to ask every contractor** — at least 10 specific questions
3. **Red flags to watch for** — specific warning signs for this type of project
4. **What a good quote should include** — line items they must see
5. **Contract must-haves** — clauses to insist on before signing

Format clearly with headers and bullet points. Be specific and practical.`;
      setResult(await askClaude(prompt));
    } catch { setResult("Error generating checklist. Please try again."); }
    setLoading(false);
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">Project Details</div>
        <label>What are you building or renovating?</label>
        <input placeholder="e.g. kitchen renovation, new deck, bathroom remodel, roof replacement" value={form.project} onChange={e => set("project", e.target.value)} />
        <div className="grid2">
          <div><label>State / Location</label><input placeholder="e.g. Texas, NSW Australia" value={form.state} onChange={e => set("state", e.target.value)} /></div>
          <div><label>Approximate Budget</label><input placeholder="e.g. $25,000" value={form.budget} onChange={e => set("budget", e.target.value)} /></div>
        </div>
        <label>Any specific concerns? (optional)</label>
        <textarea placeholder="e.g. had a bad experience before, tight timeline" value={form.concerns} onChange={e => set("concerns", e.target.value)} />
        <button className="btn" disabled={!form.project || !form.state || loading} onClick={generate}>
          {loading ? <><Spinner /> Generating…</> : "Generate My Checklist →"}
        </button>
      </div>
      {result && (
        <div className="card">
          <div className="card-title">Your Vetting Checklist</div>
          <div className="result" dangerouslySetInnerHTML={{ __html: formatResult(result) }} />
        </div>
      )}
    </div>
  );
}

// ── Tab 2: Estimate Comparison ───────────────────────────────────────────────
function EstimateTab() {
  const [project, setProject] = useState("");
  const [estimates, setEstimates] = useState([{ name: "", total: "", notes: "" }, { name: "", total: "", notes: "" }]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const updateEst = (i, k, v) => setEstimates(e => e.map((est, idx) => idx === i ? { ...est, [k]: v } : est));

  async function compare() {
    setLoading(true); setResult("");
    try {
      const estList = estimates.filter(e => e.name && e.total)
        .map((e, i) => `Contractor ${i + 1}: ${e.name} — $${e.total}${e.notes ? ` (notes: ${e.notes})` : ""}`).join("\n");
      const prompt = `You are a construction industry expert helping a homeowner compare contractor estimates.
Project: ${project}
Estimates received:
${estList}

Provide a detailed comparison analysis:
1. **Price spread analysis** — what the range tells them, which is suspiciously low or high
2. **What might explain the differences** — scope variations, materials, labour rates
3. **Recommended choice** — which estimate looks most reasonable and why
4. **Questions to ask each contractor** — to verify their quote covers the same scope
5. **Negotiation tips** — how to use competing quotes to their advantage
6. **Red flags in the pricing** — anything that stands out

Be direct and practical. Give a concrete recommendation.`;
      setResult(await askClaude(prompt));
    } catch { setResult("Error comparing estimates. Please try again."); }
    setLoading(false);
  }

  const readyEstimates = estimates.filter(e => e.name && e.total);
  const amounts = readyEstimates.map(e => parseFloat(e.total.replace(/[,$]/g, ""))).filter(n => !isNaN(n));
  const minAmt = amounts.length ? Math.min(...amounts) : null;
  const maxAmt = amounts.length ? Math.max(...amounts) : null;

  return (
    <div>
      <div className="card">
        <div className="card-title">Project</div>
        <label>What's the project?</label>
        <input placeholder="e.g. Full bathroom renovation" value={project} onChange={e => setProject(e.target.value)} />
      </div>
      <div className="card">
        <div className="card-title">Enter Estimates</div>
        {estimates.map((est, i) => (
          <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < estimates.length - 1 ? `1px solid ${T.navyLt}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: T.steel, fontFamily: "DM Mono, monospace" }}>CONTRACTOR {i + 1}</span>
              {estimates.length > 2 && <button className="btn btn-ghost btn-sm" onClick={() => setEstimates(e => e.filter((_, idx) => idx !== i))}>Remove</button>}
            </div>
            <div className="grid2">
              <div><label>Company Name</label><input placeholder="e.g. Smith & Sons Building" value={est.name} onChange={e => updateEst(i, "name", e.target.value)} /></div>
              <div><label>Total Quote Amount</label><input placeholder="e.g. 18500" value={est.total} onChange={e => updateEst(i, "total", e.target.value)} /></div>
            </div>
            <label>Notes (what's included/excluded, timeline, etc.)</label>
            <textarea style={{ minHeight: 60 }} placeholder="e.g. Includes tiles, excludes plumbing. 4 week timeline." value={est.notes} onChange={e => updateEst(i, "notes", e.target.value)} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={() => setEstimates(e => [...e, { name: "", total: "", notes: "" }])}>+ Add Another Estimate</button>
          <button className="btn" disabled={readyEstimates.length < 2 || !project || loading} onClick={compare}>
            {loading ? <><Spinner /> Analysing…</> : "Compare Estimates →"}
          </button>
        </div>
      </div>
      {amounts.length >= 2 && (
        <div className="card">
          <div className="card-title">Price Overview</div>
          <table className="est-table">
            <thead><tr><th>Contractor</th><th>Quote</th><th>vs Lowest</th></tr></thead>
            <tbody>
              {readyEstimates.map((est, i) => {
                const amt = parseFloat(est.total.replace(/[,$]/g, ""));
                const diff = isNaN(amt) ? null : ((amt - minAmt) / minAmt * 100).toFixed(0);
                return (
                  <tr key={i}>
                    <td>{est.name || `Contractor ${i + 1}`}</td>
                    <td className={`num ${amt === minAmt ? "low" : amt === maxAmt ? "high" : ""}`}>${isNaN(amt) ? est.total : amt.toLocaleString()}</td>
                    <td className="num">{diff === "0" ? <span style={{ color: T.ok }}>Lowest</span> : diff !== null ? `+${diff}%` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {result && (
        <div className="card">
          <div className="card-title">Expert Analysis</div>
          <div className="result" dangerouslySetInnerHTML={{ __html: formatResult(result) }} />
        </div>
      )}
    </div>
  );
}

// ── Tab 3: Company Profile Lookup ────────────────────────────────────────────
function ProfileTab() {
  const [contractors, setContractors] = useState([{ name: "", location: "" }, { name: "", location: "" }]);
  const [project, setProject] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (i, k, v) => setContractors(c => c.map((ct, idx) => idx === i ? { ...ct, [k]: v } : ct));

  async function lookup() {
    setLoading(true); setResult("");
    try {
      const ctList = contractors.filter(c => c.name).map(c => `${c.name}${c.location ? ` (${c.location})` : ""}`).join(", ");
      const prompt = `You are a construction industry expert helping a homeowner research contractors before hiring them.
Research these contractors for a ${project || "construction"} project: ${ctList}

For each contractor, search for and summarise:
1. Their online reputation (Google reviews, Yelp, Houzz, social media)
2. Years in business and any notable credentials or awards
3. Any complaints, legal issues, or red flags found online
4. Quality of their online presence (website, photos, responsiveness)
5. An overall trust score out of 10

Then provide:
- A side-by-side comparison table
- A clear hiring recommendation with reasoning

Be honest and specific. If you can't find information on one, say so clearly.`;
      setResult(await askClaude(prompt, true));
    } catch { setResult("Error looking up contractors. Please try again."); }
    setLoading(false);
  }

  return (
    <div>
      <div className="alert">This tab uses live web search to find reviews and information about contractors. Results depend on what's publicly available online.</div>
      <div className="card">
        <div className="card-title">Project Type</div>
        <label>What's the project?</label>
        <input placeholder="e.g. Roof replacement, kitchen renovation" value={project} onChange={e => setProject(e.target.value)} />
      </div>
      <div className="card">
        <div className="card-title">Contractors to Research</div>
        {contractors.map((ct, i) => (
          <div key={i} className="contractor-row">
            <div style={{ flex: 2 }}><label>Company Name</label><input placeholder="e.g. Peak Roofing Co." value={ct.name} onChange={e => update(i, "name", e.target.value)} style={{ marginBottom: 0 }} /></div>
            <div style={{ flex: 1 }}><label>City / State</label><input placeholder="e.g. Austin, TX" value={ct.location} onChange={e => update(i, "location", e.target.value)} style={{ marginBottom: 0 }} /></div>
            {contractors.length > 1 && <button className="btn btn-ghost btn-sm" style={{ marginTop: 18, flexShrink: 0 }} onClick={() => setContractors(c => c.filter((_, idx) => idx !== i))}>✕</button>}
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={() => setContractors(c => [...c, { name: "", location: "" }])}>+ Add Contractor</button>
          <button className="btn" disabled={contractors.filter(c => c.name).length < 1 || !project || loading} onClick={lookup}>
            {loading ? <><Spinner /> Searching the web…</> : "Research Contractors →"}
          </button>
        </div>
      </div>
      {result && (
        <div className="card">
          <div className="card-title">Research Results</div>
          <div className="result" dangerouslySetInnerHTML={{ __html: formatResult(result) }} />
        </div>
      )}
    </div>
  );
}

// ── Tab 4: Community Benchmarks ───────────────────────────────────────────────
function BenchmarksTab() {
  const [submissions, setSubmissions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [view, setView] = useState("browse"); // "browse" | "submit"
  const [filterType, setFilterType] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [form, setForm] = useState({
    projectType: "", region: "", amount: "", year: new Date().getFullYear().toString(),
    size: "", outcome: "hired", description: "",
  });
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Load shared community data on mount
  useEffect(() => {
    (async () => {
      setLoadingData(true);
      try {
        const res = await fetch("/.netlify/functions/benchmarks");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSubmissions(data.map(s => ({
            id: s.id,
            projectType: s.project_type,
            region: s.region,
            amount: s.amount,
            year: s.year,
            size: s.size,
            outcome: s.outcome,
            description: s.description,
          })));
        }
      } catch {
        // No data yet — start empty
      }
      setLoadingData(false);
    })();
  }, []);

  async function submitEstimate() {
    if (!form.projectType || !form.region || !form.amount) return;
    const newEntry = {
      id: Date.now().toString(),
      projectType: form.projectType,
      region: form.region,
      amount: parseFloat(form.amount.replace(/[,$]/g, "")),
      year: form.year,
      size: form.size,
      outcome: form.outcome,
      description: form.description,
      submittedAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...submissions];
    try {
      const res = await fetch("/.netlify/functions/benchmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) throw new Error("Save failed");
      setSubmissions(updated);
      setSubmitSuccess(true);
      setForm({ projectType: "", region: "", amount: "", year: new Date().getFullYear().toString(), size: "", outcome: "hired", description: "" });
      setTimeout(() => { setSubmitSuccess(false); setView("browse"); }, 2000);
    } catch {
      alert("Error saving — please try again.");
    }
  }

  // Filtered list
  const filtered = submissions.filter(s => {
    if (filterType && s.projectType !== filterType) return false;
    if (filterRegion && !s.region.toLowerCase().includes(filterRegion.toLowerCase())) return false;
    return true;
  });

  // Stats
  const amounts = filtered.map(s => s.amount).filter(Boolean);
  const avg = amounts.length ? Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length) : null;
  const med = amounts.length ? (() => { const s = [...amounts].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; })() : null;
  const min = amounts.length ? Math.min(...amounts) : null;
  const max = amounts.length ? Math.max(...amounts) : null;

  async function getInsight() {
    if (!filtered.length) return;
    setLoadingInsight(true); setInsight("");
    const summary = filtered.slice(0, 20).map(s =>
      `${s.projectType} in ${s.region}: $${s.amount.toLocaleString()}${s.size ? `, ${s.size}` : ""}${s.description ? ` — ${s.description}` : ""}`
    ).join("\n");
    try {
      const text = await askClaude(`You are a construction cost expert. Analyse these real community-submitted project estimates:

${summary}

Provide:
1. **What the pricing tells us** — are these typical, high, or low for the market?
2. **Key cost drivers** — what's making some projects cheaper or more expensive?
3. **Tips for anyone budgeting a similar project** — how to get a fair price
4. **Watch-outs** — any patterns suggesting people got ripped off or got a bargain

Be concise and practical. Use the actual numbers.`);
      setInsight(text);
    } catch { setInsight("Error getting insights. Please try again."); }
    setLoadingInsight(false);
  }

  if (loadingData) return (
    <div className="card" style={{ textAlign: "center", padding: 40 }}>
      <Spinner /><p style={{ marginTop: 12, color: T.steel, fontSize: 14 }}>Loading community data…</p>
    </div>
  );

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button className={`btn ${view === "browse" ? "" : "btn-ghost"}`} onClick={() => setView("browse")}>Browse Estimates</button>
        <button className={`btn ${view === "submit" ? "btn-ok" : "btn-ghost"}`} onClick={() => setView("submit")}>+ Share Your Estimate</button>
      </div>

      {/* ── Submit Form ── */}
      {view === "submit" && (
        <div className="card">
          <div className="card-title">Share an Anonymous Estimate</div>
          <p style={{ fontSize: 13, color: T.steel, marginBottom: 16, lineHeight: 1.6 }}>
            Help other homeowners know what to expect. No personal info collected — just the numbers and project details.
          </p>
          {submitSuccess && <div className="alert alert-ok" style={{ marginBottom: 16 }}>✓ Thanks! Your estimate has been added to the community database.</div>}
          <div className="grid2">
            <div>
              <label>Project Type</label>
              <select value={form.projectType} onChange={e => setF("projectType", e.target.value)}>
                <option value="">Select project type…</option>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label>Region / State</label>
              <input placeholder="e.g. Austin TX, Sydney NSW, London UK" value={form.region} onChange={e => setF("region", e.target.value)} />
            </div>
          </div>
          <div className="grid3">
            <div>
              <label>Total Amount Quoted ($)</label>
              <input placeholder="e.g. 22000" value={form.amount} onChange={e => setF("amount", e.target.value)} />
            </div>
            <div>
              <label>Year</label>
              <input placeholder="2024" value={form.year} onChange={e => setF("year", e.target.value)} />
            </div>
            <div>
              <label>Outcome</label>
              <select value={form.outcome} onChange={e => setF("outcome", e.target.value)}>
                <option value="hired">Hired this contractor</option>
                <option value="rejected">Didn't hire (too high)</option>
                <option value="benchmark">Just benchmarking</option>
              </select>
            </div>
          </div>
          <label>Project Size / Scope (optional)</label>
          <input placeholder="e.g. 200 sq ft bathroom, 3 bed house, 50m fence" value={form.size} onChange={e => setF("size", e.target.value)} />
          <label>Any context worth sharing? (optional)</label>
          <textarea
            style={{ minHeight: 70 }}
            placeholder="e.g. Included full tile, vanity, and shower. Quote seemed high but contractor had great reviews."
            value={form.description}
            onChange={e => setF("description", e.target.value)}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-ok" disabled={!form.projectType || !form.region || !form.amount} onClick={submitEstimate}>Submit Anonymously →</button>
            <button className="btn btn-ghost" onClick={() => setView("browse")}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Browse ── */}
      {view === "browse" && (
        <>
          {/* Filters */}
          <div className="card" style={{ paddingBottom: 16 }}>
            <div className="card-title">Filter Community Data</div>
            <div className="filter-row">
              <div>
                <label>Project Type</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="">All project types</option>
                  {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label>Region / State</label>
                <input placeholder="e.g. Texas, Sydney…" value={filterRegion} onChange={e => setFilterRegion(e.target.value)} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setFilterType(""); setFilterRegion(""); }}>Clear filters</button>
              </div>
            </div>
          </div>

          {/* Stats */}
          {amounts.length > 0 && (
            <div className="stats-row">
              <div className="stat-box"><div className="stat-label">Submissions</div><div className="stat-value">{filtered.length}</div></div>
              <div className="stat-box"><div className="stat-label">Average</div><div className="stat-value">${avg?.toLocaleString()}</div></div>
              <div className="stat-box"><div className="stat-label">Median</div><div className="stat-value">${med?.toLocaleString()}</div></div>
              <div className="stat-box"><div className="stat-label">Range</div><div className="stat-value" style={{ fontSize: 14 }}>${min?.toLocaleString()} – ${max?.toLocaleString()}</div></div>
            </div>
          )}

          {/* AI Insight button */}
          {filtered.length >= 3 && (
            <div style={{ marginBottom: 16 }}>
              <button className="btn btn-ghost" disabled={loadingInsight} onClick={getInsight}>
                {loadingInsight ? <><Spinner /> Analysing…</> : "✦ Get AI Insight on These Numbers"}
              </button>
            </div>
          )}

          {insight && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-title">AI Cost Analysis</div>
              <div className="result" dangerouslySetInnerHTML={{ __html: formatResult(insight) }} />
            </div>
          )}

          {/* Listings */}
          {filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="big">📋</div>
                <p style={{ color: T.chalk, marginBottom: 8, fontWeight: 600 }}>No estimates yet{filterType || filterRegion ? " matching your filters" : ""}</p>
                <p style={{ color: T.steel, fontSize: 13 }}>Be the first to share — it helps everyone in your area get a fair price.</p>
                <button className="btn btn-ok" style={{ marginTop: 16 }} onClick={() => setView("submit")}>Share an Estimate →</button>
              </div>
            </div>
          ) : (
            filtered.map(s => (
              <div key={s.id} className="bench-card">
                <div className="bench-header">
                  <div>
                    <div className="bench-amount">${s.amount?.toLocaleString()}</div>
                    <div className="bench-meta">{s.projectType} · {s.region} · {s.year}</div>
                  </div>
                  <div>
                    <span className={`tag ${s.outcome === "hired" ? "ok" : s.outcome === "rejected" ? "warn" : "cyan"}`}>
                      {s.outcome === "hired" ? "✓ Hired" : s.outcome === "rejected" ? "Too high" : "Benchmark"}
                    </span>
                  </div>
                </div>
                {s.size && <div style={{ fontSize: 12, color: T.steel, marginTop: 4 }}>Scope: {s.size}</div>}
                {s.description && <div className="bench-desc">{s.description}</div>}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

// ── App Shell ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "vet", label: "Vetting Checklist" },
  { id: "estimate", label: "Compare Estimates" },
  { id: "profile", label: "Research Companies" },
  { id: "benchmarks", label: "Community Benchmarks", badge: "NEW" },
];

export default function App() {
  const [tab, setTab] = useState("vet");
  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="rel">
          <div className="header">
            <div className="header-eyebrow">ContractorCheck — Built for Homeowners</div>
            <h1>Don't Get Burned.<br />Hire the Right Builder.</h1>
            <p>Vet contractors, compare quotes, research companies, and see what real people paid.</p>
          </div>
          <div className="tabs">
            {TABS.map(t => (
              <button key={t.id} className={`tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
                {t.label}{t.badge && <span className="badge-new">{t.badge}</span>}
              </button>
            ))}
          </div>
          {tab === "vet" && <VettingTab />}
          {tab === "estimate" && <EstimateTab />}
          {tab === "profile" && <ProfileTab />}
          {tab === "benchmarks" && <BenchmarksTab />}
        </div>
      </div>
    </>
  );
}
