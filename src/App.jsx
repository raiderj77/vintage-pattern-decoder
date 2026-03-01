import { useState, useMemo } from "react";

// ─── VINTAGE TERMINOLOGY DATABASE ─────────────────────────────────
const VINTAGE_TERMS = [
  // Vintage-only terms (not in standard modern UK/US converters)
  { vintage: "yrn", modern_us: "yo (yarn over)", modern_uk: "yrn (yarn round needle)", category: "Stitch", era: "Pre-1970s UK", note: "Wrap yarn around needle from front to back. In vintage UK patterns, this specifically means wrapping between two purl stitches." },
  { vintage: "yfwd", modern_us: "yo (yarn over)", modern_uk: "yfwd (yarn forward)", category: "Stitch", era: "Pre-1970s UK", note: "Bring yarn to front between needles. Used between two knit stitches to create a yarn over." },
  { vintage: "yon", modern_us: "yo (yarn over)", modern_uk: "yon (yarn over needle)", category: "Stitch", era: "Pre-1970s UK", note: "Wrap yarn over needle from front to back. Used after a purl and before a knit stitch." },
  { vintage: "yrh", modern_us: "yo (yarn over hook)", modern_uk: "yrh (yarn round hook)", category: "Stitch", era: "Vintage UK Crochet", note: "The crochet equivalent of yarn over. Wrap yarn around hook." },
  { vintage: "wl fwd", modern_us: "yo (yarn over)", modern_uk: "wool forward", category: "Stitch", era: "1930s–1950s UK", note: "Older term for yarn forward. 'Wool' was used because most yarn was wool." },
  { vintage: "wl rnd ndl", modern_us: "yo (yarn over)", modern_uk: "wool round needle", category: "Stitch", era: "1930s–1950s UK", note: "Full vintage form of yrn. Bring wool around the needle." },
  { vintage: "rf", modern_us: "repeat from *", modern_uk: "repeat from *", category: "Instruction", era: "Pre-1960s", note: "Modern patterns use asterisks (*) to mark repeat points. Vintage patterns used 'rf' or 'rep from'." },
  { vintage: "cm", modern_us: "closed mesh (4 dc block in filet)", modern_uk: "closed mesh (4 tr block in filet)", category: "Filet Crochet", era: "All vintage", note: "In filet crochet, a solid block. The outer 2 stitches form the frame, inner 2 fill it in." },
  { vintage: "om", modern_us: "open mesh (2 dc + 2 ch in filet)", modern_uk: "open mesh (2 tr + 2 ch in filet)", category: "Filet Crochet", era: "All vintage", note: "In filet crochet, an open space. Two chain stitches between double/treble crochets create the gap." },
  { vintage: "p/pc", modern_us: "picot (ch 3, sl st)", modern_uk: "picot (ch 3, ss)", category: "Stitch", era: "All eras", note: "A small decorative loop. Chain 3, then slip stitch into the stitch before the first chain." },
  { vintage: "raised st", modern_us: "FPdc (front post double crochet)", modern_uk: "FPtr (front post treble)", category: "Stitch", era: "Pre-1980s", note: "Work around the post of the stitch below instead of through the top loops. Creates a raised texture." },
  { vintage: "x/x st", modern_us: "cross stitch (crossed dc)", modern_uk: "cross stitch (crossed tr)", category: "Stitch", era: "Vintage UK", note: "Not to be confused with embroidery cross stitch. This is a crossed crochet stitch creating an X pattern." },
  { vintage: "bl", modern_us: "BLO (back loop only)", modern_uk: "BLO (back loop only)", category: "Technique", era: "All eras", note: "In some vintage patterns, 'bl' can also mean 'bobble' — check context. Modern patterns standardized to BLO." },
  { vintage: "fl", modern_us: "FLO (front loop only)", modern_uk: "FLO (front loop only)", category: "Technique", era: "All eras", note: "Work through front loop only of the stitch below." },
  { vintage: "ttr", modern_us: "dtr (double treble crochet)", modern_uk: "ttr (triple treble)", category: "Stitch", era: "Vintage UK", note: "The tallest common stitch. Yarn over 3 times before inserting hook." },
  { vintage: "qtr", modern_us: "trtr (triple treble crochet)", modern_uk: "qtr (quadruple treble)", category: "Stitch", era: "Vintage UK", note: "Extremely tall stitch. Yarn over 4 times before inserting hook." },
  { vintage: "miss", modern_us: "skip (sk)", modern_uk: "miss", category: "Instruction", era: "UK all eras", note: "UK patterns say 'miss a stitch' where US patterns say 'skip a stitch'. Identical action." },
  { vintage: "tension", modern_us: "gauge", modern_uk: "tension", category: "Measurement", era: "UK all eras", note: "The number of stitches and rows per inch/cm. UK says tension, US says gauge. Same concept." },
  { vintage: "cast off", modern_us: "bind off (BO)", modern_uk: "cast off", category: "Instruction", era: "UK all eras", note: "Securing stitches at the end of knitting so they don't unravel." },
  { vintage: "work straight", modern_us: "work even", modern_uk: "work straight", category: "Instruction", era: "UK all eras", note: "Continue in pattern without increasing or decreasing." },
  { vintage: "stocking st", modern_us: "stockinette stitch (St st)", modern_uk: "stocking stitch", category: "Stitch", era: "UK all eras", note: "Knit one row, purl one row. Creates a smooth V-pattern on the right side." },
  { vintage: "K up", modern_us: "pick up and knit (PU)", modern_uk: "knit up", category: "Technique", era: "UK vintage", note: "Pick up stitches along an edge and knit them. Common for neckbands and button bands." },

  // Standard UK/US conversions for completeness
  { vintage: "dc (UK)", modern_us: "sc (single crochet)", modern_uk: "dc (double crochet)", category: "Core Stitch", era: "All eras", note: "THE most confusing conversion. UK double crochet = US single crochet. If a pattern says 'dc' and you see short, tight stitches, it's UK." },
  { vintage: "htr (UK)", modern_us: "hdc (half double crochet)", modern_uk: "htr (half treble)", category: "Core Stitch", era: "All eras", note: "UK half treble = US half double crochet." },
  { vintage: "tr (UK)", modern_us: "dc (double crochet)", modern_uk: "tr (treble)", category: "Core Stitch", era: "All eras", note: "UK treble = US double crochet. This is the second most confusing conversion." },
  { vintage: "dtr (UK)", modern_us: "tr (treble crochet)", modern_uk: "dtr (double treble)", category: "Core Stitch", era: "All eras", note: "UK double treble = US treble crochet." },
  { vintage: "ss (UK)", modern_us: "sl st (slip stitch)", modern_uk: "ss (slip stitch)", category: "Core Stitch", era: "All eras", note: "Same stitch, different abbreviation. Slip stitch is universal." },
];

// ─── VINTAGE HOOK/NEEDLE SIZES ────────────────────────────────────
const HOOK_SIZES = [
  { old_uk: "14", us: "B/1", metric: "2.00", type: "Crochet Hook" },
  { old_uk: "13", us: "C/2", metric: "2.50", type: "Crochet Hook" },
  { old_uk: "12", us: "—", metric: "2.75", type: "Crochet Hook" },
  { old_uk: "11", us: "D/3", metric: "3.00", type: "Crochet Hook" },
  { old_uk: "10", us: "E/4", metric: "3.50", type: "Crochet Hook" },
  { old_uk: "9", us: "F/5", metric: "3.75", type: "Crochet Hook" },
  { old_uk: "8", us: "G/6", metric: "4.00", type: "Crochet Hook" },
  { old_uk: "7", us: "7", metric: "4.50", type: "Crochet Hook" },
  { old_uk: "6", us: "H/8", metric: "5.00", type: "Crochet Hook" },
  { old_uk: "5", us: "I/9", metric: "5.50", type: "Crochet Hook" },
  { old_uk: "4", us: "J/10", metric: "6.00", type: "Crochet Hook" },
  { old_uk: "3", us: "K/10½", metric: "6.50", type: "Crochet Hook" },
  { old_uk: "2", us: "—", metric: "7.00", type: "Crochet Hook" },
  { old_uk: "14", us: "0", metric: "2.00", type: "Knitting Needle" },
  { old_uk: "13", us: "1", metric: "2.25", type: "Knitting Needle" },
  { old_uk: "12", us: "2", metric: "2.75", type: "Knitting Needle" },
  { old_uk: "11", us: "2", metric: "3.00", type: "Knitting Needle" },
  { old_uk: "10", us: "3", metric: "3.25", type: "Knitting Needle" },
  { old_uk: "9", us: "4", metric: "3.50", type: "Knitting Needle" },
  { old_uk: "8", us: "5", metric: "3.75", type: "Knitting Needle" },
  { old_uk: "7", us: "6", metric: "4.00", type: "Knitting Needle" },
  { old_uk: "6", us: "7", metric: "4.50", type: "Knitting Needle" },
  { old_uk: "5", us: "8", metric: "5.00", type: "Knitting Needle" },
  { old_uk: "4", us: "9", metric: "5.50", type: "Knitting Needle" },
  { old_uk: "3", us: "10", metric: "6.00", type: "Knitting Needle" },
  { old_uk: "2", us: "10½", metric: "6.50", type: "Knitting Needle" },
  { old_uk: "1", us: "11", metric: "7.00", type: "Knitting Needle" },
  { old_uk: "0", us: "13", metric: "9.00", type: "Knitting Needle" },
  { old_uk: "00", us: "15", metric: "10.00", type: "Knitting Needle" },
];

// ─── VINTAGE YARN WEIGHTS ─────────────────────────────────────────
const YARN_WEIGHTS = [
  { vintage_name: "1-ply / Cobweb", modern_us: "Lace (0)", modern_uk: "1-ply", wraps_inch: "32+", typical_gauge: "33-40 sts/4in", needle_mm: "1.5-2.25" },
  { vintage_name: "2-ply / Gossamer", modern_us: "Lace (0)", modern_uk: "2-ply", wraps_inch: "30-32", typical_gauge: "32-34 sts/4in", needle_mm: "2.25-3.0" },
  { vintage_name: "3-ply / Baby", modern_us: "Super Fine / Fingering (1)", modern_uk: "3-ply", wraps_inch: "24-30", typical_gauge: "27-32 sts/4in", needle_mm: "2.75-3.25" },
  { vintage_name: "4-ply / Sock", modern_us: "Super Fine / Fingering (1)", modern_uk: "4-ply", wraps_inch: "20-24", typical_gauge: "24-30 sts/4in", needle_mm: "3.0-3.75" },
  { vintage_name: "Sport / 5-ply", modern_us: "Fine / Sport (2)", modern_uk: "5-ply / Sport", wraps_inch: "16-20", typical_gauge: "23-26 sts/4in", needle_mm: "3.5-4.0" },
  { vintage_name: "DK / 8-ply", modern_us: "Light / DK (3)", modern_uk: "DK / 8-ply", wraps_inch: "14-16", typical_gauge: "21-24 sts/4in", needle_mm: "3.75-4.5" },
  { vintage_name: "Worsted / 10-ply", modern_us: "Medium / Worsted (4)", modern_uk: "Aran / 10-ply", wraps_inch: "12-14", typical_gauge: "16-20 sts/4in", needle_mm: "4.5-5.5" },
  { vintage_name: "Chunky / 12-ply", modern_us: "Bulky (5)", modern_uk: "Chunky / 12-ply", wraps_inch: "10-12", typical_gauge: "12-15 sts/4in", needle_mm: "5.5-8.0" },
  { vintage_name: "Super Chunky", modern_us: "Super Bulky (6)", modern_uk: "Super Chunky", wraps_inch: "8-10", typical_gauge: "7-11 sts/4in", needle_mm: "8.0-12.0" },
];

const DISCONTINUED_YARNS = [
  { old: "Patons Doublette", sub: "Patons Diploma Gold DK or any DK wool blend", weight: "DK" },
  { old: "Sirdar Country Style DK", sub: "Sirdar Hayfield Bonus DK or any DK acrylic/wool", weight: "DK" },
  { old: "Lister Lavenda", sub: "Any 4-ply wool or wool blend", weight: "4-ply" },
  { old: "Lister/Lee Target Doubletime", sub: "Any standard DK yarn", weight: "DK" },
  { old: "Hayfield Doubletime DK", sub: "Hayfield Bonus DK or similar acrylic DK", weight: "DK" },
  { old: "Wendy Double Crepe", sub: "Wendy Supreme DK or any DK yarn", weight: "DK" },
  { old: "Robin DK", sub: "Any budget acrylic DK", weight: "DK" },
  { old: "Jaeger Matchmaker", sub: "Rowan Pure Wool DK or similar merino DK", weight: "DK" },
  { old: "Emu Superwash DK", sub: "Any superwash DK wool", weight: "DK" },
  { old: "Patons Purple Heather", sub: "Patons Diploma Gold 4-ply or similar 4-ply", weight: "4-ply" },
  { old: "Twilley's Cortina", sub: "Any chunky wool blend", weight: "Chunky" },
  { old: "J & P Coats Knit-Cro-Sheen", sub: "Aunt Lydia's Classic Crochet Thread Size 10", weight: "Thread" },
  { old: "Lily Sugar'n Cream (old weight)", sub: "Lily Sugar'n Cream (current) — check gauge", weight: "Worsted" },
  { old: "Coats Mercer Crochet Cotton", sub: "DMC Petra or Aunt Lydia's size 10-20", weight: "Thread" },
  { old: "Clark's O.N.T.", sub: "Aunt Lydia's Classic or South Maid", weight: "Thread" },
  { old: "American Thread Star", sub: "Aunt Lydia's Classic Thread", weight: "Thread" },
  { old: "Spool Cotton Company", sub: "Aunt Lydia's or DMC Cébélia", weight: "Thread" },
];

// ─── PATTERN TRANSLATOR ───────────────────────────────────────────
function translatePattern(text) {
  const replacements = [
    [/\bdc\b(?!\d)/gi, { from: "dc", to: "sc (US) — single crochet", note: "UK dc = US sc" }],
    [/\bhtr\b/gi, { from: "htr", to: "hdc (US) — half double crochet", note: "UK htr = US hdc" }],
    [/\btr\b(?!eble)/gi, { from: "tr", to: "dc (US) — double crochet", note: "UK tr = US dc" }],
    [/\bdtr\b/gi, { from: "dtr", to: "tr (US) — treble crochet", note: "UK dtr = US tr" }],
    [/\bttr\b/gi, { from: "ttr", to: "dtr (US) — double treble", note: "UK ttr = US dtr" }],
    [/\bss\b/gi, { from: "ss", to: "sl st — slip stitch", note: "Same stitch" }],
    [/\byrn\b/gi, { from: "yrn", to: "yo — yarn over", note: "Vintage UK yarn round needle" }],
    [/\byfwd\b/gi, { from: "yfwd", to: "yo — yarn over", note: "Yarn forward" }],
    [/\byon\b/gi, { from: "yon", to: "yo — yarn over", note: "Yarn over needle" }],
    [/\byrh\b/gi, { from: "yrh", to: "yo — yarn over hook", note: "Crochet yarn over" }],
    [/\bmiss\b/gi, { from: "miss", to: "skip (sk)", note: "UK miss = US skip" }],
    [/\btension\b/gi, { from: "tension", to: "gauge", note: "UK tension = US gauge" }],
    [/\bcast off\b/gi, { from: "cast off", to: "bind off (BO)", note: "Same technique" }],
    [/\bwork straight\b/gi, { from: "work straight", to: "work even", note: "No inc or dec" }],
    [/\bstocking st\b/gi, { from: "stocking st", to: "stockinette stitch (St st)", note: "Knit RS, purl WS" }],
  ];

  let found = [];
  replacements.forEach(([regex, info]) => {
    if (regex.test(text)) {
      found.push(info);
    }
  });
  return found;
}

// ─── STYLES ───────────────────────────────────────────────────────
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`;

// ─── APP COMPONENT ────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [patternText, setPatternText] = useState("");
  const [hookFilter, setHookFilter] = useState("all");
  const [yarnSearch, setYarnSearch] = useState("");

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return VINTAGE_TERMS;
    const q = searchTerm.toLowerCase();
    return VINTAGE_TERMS.filter(t =>
      t.vintage.toLowerCase().includes(q) ||
      t.modern_us.toLowerCase().includes(q) ||
      t.modern_uk.toLowerCase().includes(q) ||
      t.note.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const translations = useMemo(() => translatePattern(patternText), [patternText]);

  const filteredHooks = useMemo(() => {
    if (hookFilter === "all") return HOOK_SIZES;
    return HOOK_SIZES.filter(h => h.type === (hookFilter === "hooks" ? "Crochet Hook" : "Knitting Needle"));
  }, [hookFilter]);

  const filteredYarns = useMemo(() => {
    if (!yarnSearch) return DISCONTINUED_YARNS;
    const q = yarnSearch.toLowerCase();
    return DISCONTINUED_YARNS.filter(y => y.old.toLowerCase().includes(q) || y.sub.toLowerCase().includes(q));
  }, [yarnSearch]);

  const tabs = [
    { id: "home", label: "Home" },
    { id: "translator", label: "Pattern Translator" },
    { id: "glossary", label: "Vintage Glossary" },
    { id: "hooks", label: "Hook & Needle Sizes" },
    { id: "yarn", label: "Yarn Substitution" },
  ];

  const accentColor = "#a0522d";
  const accentLight = "#f5ebe0";
  const darkBg = "#2c1810";

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#3d2b1f", minHeight: "100vh", background: "#faf8f5" }}>
      <style>{fontImport}</style>

      {/* ─── HEADER ─── */}
      <div style={{
        background: `linear-gradient(135deg, ${darkBg} 0%, #4a2c2a 100%)`,
        borderBottom: `3px solid ${accentColor}`,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0" }}>
            <div onClick={() => setActiveTab("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8,
                background: `linear-gradient(135deg, ${accentColor}, #c4956a)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: "#fff",
              }}>🧶</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#f5ebe0", letterSpacing: "-0.01em" }}>
                  Vintage Pattern Decoder
                </div>
                <div style={{ fontSize: 10, color: "#c4956a", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  by FiberTools.app
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {tabs.slice(1).map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  padding: "7px 12px", borderRadius: 6, border: "none",
                  background: activeTab === t.id ? "rgba(160,82,45,0.2)" : "transparent",
                  color: activeTab === t.id ? "#c4956a" : "#a09080",
                  fontSize: 12, fontWeight: activeTab === t.id ? 600 : 400,
                  cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
                  transition: "all 0.15s",
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── HOME ─── */}
      {activeTab === "home" && (
        <div>
          <div style={{ background: `linear-gradient(180deg, ${accentLight} 0%, #faf8f5 100%)`, padding: "56px 20px 44px", textAlign: "center" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              <div style={{
                display: "inline-block", padding: "5px 14px", borderRadius: 16,
                background: "#fff", border: `1px solid ${accentColor}40`, color: accentColor,
                fontSize: 12, fontWeight: 600, marginBottom: 18,
              }}>
                30+ Years of Fiber Arts Expertise
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 800,
                lineHeight: 1.15, color: darkBg, margin: "0 0 14px", letterSpacing: "-0.02em",
              }}>
                Decode Any Vintage<br />
                <span style={{ color: accentColor }}>Knitting or Crochet Pattern</span>
              </h1>
              <p style={{ fontSize: 16, color: "#6d5c4e", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 28px" }}>
                Translate old British terminology, convert discontinued yarn weights,
                decode vintage hook sizes, and make any pattern from the 1920s–1980s
                usable with modern materials.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setActiveTab("translator")} style={{
                  padding: "13px 28px", borderRadius: 10, border: "none",
                  background: `linear-gradient(135deg, ${accentColor}, #c4956a)`,
                  color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  boxShadow: `0 4px 12px ${accentColor}40`,
                }}>
                  Paste a Pattern to Translate
                </button>
                <button onClick={() => setActiveTab("glossary")} style={{
                  padding: "13px 28px", borderRadius: 10, border: `1px solid ${accentColor}40`,
                  background: "#fff", color: accentColor, fontSize: 15, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
                }}>
                  Browse Vintage Terms
                </button>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 20px 48px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: -16 }}>
              {[
                { icon: "📜", title: "Pattern Translator", desc: "Paste any vintage pattern and instantly see every vintage term translated to modern US or UK terminology.", tab: "translator" },
                { icon: "📖", title: "Vintage Glossary", desc: `${VINTAGE_TERMS.length}+ vintage abbreviations with era context, usage notes, and modern equivalents.`, tab: "glossary" },
                { icon: "🪡", title: "Hook & Needle Sizes", desc: "Convert old UK numbered sizes to modern US letter sizes and metric millimeters.", tab: "hooks" },
                { icon: "🧶", title: "Yarn Substitution", desc: `${DISCONTINUED_YARNS.length}+ discontinued yarn brands with modern substitute recommendations.`, tab: "yarn" },
              ].map(f => (
                <div key={f.title} onClick={() => setActiveTab(f.tab)} style={{
                  background: "#fff", borderRadius: 14, padding: 24,
                  border: "1px solid #e8ddd0", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(44,24,16,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "0 0 6px", color: darkBg }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: "#7d6b5d", lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Integration with FiberTools */}
            <div style={{
              marginTop: 32, padding: 28, borderRadius: 14,
              background: "#fff", border: "1px solid #e8ddd0",
              display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center",
            }}>
              <div style={{ flex: "1 1 280px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "0 0 6px", color: darkBg }}>
                  Part of the FiberTools Suite
                </h3>
                <p style={{ fontSize: 13, color: "#7d6b5d", lineHeight: 1.55, margin: 0 }}>
                  Use alongside our free Yarn Calculator, Gauge Calculator, UK/US Converter, and 18 more tools at fibertools.app. The Vintage Decoder goes deeper — handling pre-1980s terminology, discontinued yarns, and historical sizing that modern converters miss.
                </p>
              </div>
              <a href="https://fibertools.app" target="_blank" rel="noopener noreferrer" style={{
                padding: "11px 22px", borderRadius: 8,
                background: accentLight, color: accentColor, border: `1px solid ${accentColor}30`,
                fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
                Visit FiberTools.app →
              </a>
            </div>

            {/* Premium CTA */}
            <div style={{
              marginTop: 24, padding: "28px 32px", borderRadius: 14,
              background: `linear-gradient(135deg, ${darkBg}, #4a2c2a)`,
              color: "#fff", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center",
            }}>
              <div style={{ flex: "1 1 280px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#c4956a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  Coming Soon — Pro Edition
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "0 0 6px", color: "#f5ebe0" }}>
                  Vintage Pattern Decoder Pro
                </h3>
                <p style={{ fontSize: 13, color: "#a09080", lineHeight: 1.55, margin: 0 }}>
                  Unlimited pattern translations. Full vintage term database. Printable conversion charts. Yarn substitution engine. New features added monthly — era-specific pattern guides, AI-powered full pattern rewriting, and more.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(196,149,106,0.15)", border: "1px solid rgba(196,149,106,0.3)" }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: "#f5ebe0" }}>$3.99</span>
                    <span style={{ fontSize: 12, color: "#a09080" }}>/month</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#7d6b5d" }}>or</span>
                  <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(196,149,106,0.15)", border: "1px solid rgba(196,149,106,0.3)" }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: "#f5ebe0" }}>$29.99</span>
                    <span style={{ fontSize: 12, color: "#a09080" }}>/year</span>
                    <span style={{ fontSize: 11, color: "#4ade80", marginLeft: 6 }}>Save 37%</span>
                  </div>
                </div>
              </div>
              <button style={{
                padding: "12px 24px", borderRadius: 8,
                background: `linear-gradient(135deg, ${accentColor}, #c4956a)`,
                border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
                whiteSpace: "nowrap",
              }}>
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PATTERN TRANSLATOR ─── */}
      {activeTab === "translator" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px" }}>
          <button onClick={() => setActiveTab("home")} style={{ background: "none", border: "none", color: "#7d6b5d", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, margin: "0 0 6px", color: darkBg }}>
            Pattern Translator
          </h2>
          <p style={{ fontSize: 14, color: "#7d6b5d", margin: "0 0 20px" }}>
            Paste any vintage pattern text below. We'll detect and translate vintage terminology to modern US equivalents.
          </p>

          <textarea
            value={patternText}
            onChange={e => setPatternText(e.target.value)}
            placeholder="Paste your vintage pattern here...&#10;&#10;Example: 'Row 1: 3 ch, 1 tr in 4th ch from hook, 1 tr in each ch to end, turn.&#10;Row 2: 3 ch, miss first tr, yrn, *1 dc in next tr, 1 tr in next tr, rep from * to end.'"
            style={{
              width: "100%", minHeight: 180, padding: 18, borderRadius: 12,
              border: "1px solid #d4c4b0", background: "#fff", fontSize: 14,
              fontFamily: "monospace", lineHeight: 1.7, resize: "vertical",
              color: "#3d2b1f", boxSizing: "border-box",
            }}
          />

          {translations.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "0 0 14px", color: darkBg }}>
                {translations.length} vintage term{translations.length !== 1 ? "s" : ""} detected
              </h3>
              {translations.map((t, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 10, padding: "14px 18px",
                  border: "1px solid #e8ddd0", marginBottom: 10,
                  display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap",
                }}>
                  <div style={{
                    padding: "4px 10px", borderRadius: 6,
                    background: accentLight, color: accentColor,
                    fontSize: 14, fontWeight: 700, fontFamily: "monospace",
                    whiteSpace: "nowrap", minWidth: 60, textAlign: "center",
                  }}>{t.from}</div>
                  <div style={{ fontSize: 18, color: "#c4956a", lineHeight: 1.4 }}>→</div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: darkBg }}>{t.to}</div>
                    <div style={{ fontSize: 12, color: "#7d6b5d", marginTop: 2 }}>{t.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {patternText && translations.length === 0 && (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <p style={{ fontSize: 14, color: "#166534", margin: 0 }}>
                No vintage-specific terms detected. This pattern may already use modern terminology, or the terms used aren't in our database yet. Try the Vintage Glossary to search manually.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── VINTAGE GLOSSARY ─── */}
      {activeTab === "glossary" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px" }}>
          <button onClick={() => setActiveTab("home")} style={{ background: "none", border: "none", color: "#7d6b5d", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, margin: "0 0 6px", color: darkBg }}>
            Vintage Term Glossary
          </h2>
          <p style={{ fontSize: 14, color: "#7d6b5d", margin: "0 0 16px" }}>
            Search {VINTAGE_TERMS.length} vintage abbreviations and terms with modern equivalents.
          </p>

          <input
            type="text" value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search terms... (e.g., yrn, treble, yarn over)"
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 10,
              border: "1px solid #d4c4b0", background: "#fff", fontSize: 14,
              fontFamily: "'IBM Plex Sans', sans-serif", color: "#3d2b1f",
              marginBottom: 16, boxSizing: "border-box",
            }}
          />

          <div style={{ fontSize: 12, color: "#7d6b5d", marginBottom: 12 }}>
            Showing {filteredTerms.length} of {VINTAGE_TERMS.length} terms
          </div>

          {filteredTerms.map((t, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 10, padding: "16px 18px",
              border: "1px solid #e8ddd0", marginBottom: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 6, background: accentLight,
                  color: accentColor, fontSize: 15, fontWeight: 700, fontFamily: "monospace",
                }}>{t.vintage}</span>
                <span style={{ fontSize: 16, color: "#c4956a" }}>→</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: darkBg }}>{t.modern_us}</span>
                <span style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "#f0f0e8", color: "#6d5c4e", fontSize: 11 }}>{t.category}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "#e8f0e8", color: "#4a6b4a", fontSize: 11 }}>{t.era}</span>
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#7d6b5d", lineHeight: 1.5, margin: 0 }}>{t.note}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── HOOK & NEEDLE SIZES ─── */}
      {activeTab === "hooks" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px" }}>
          <button onClick={() => setActiveTab("home")} style={{ background: "none", border: "none", color: "#7d6b5d", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, margin: "0 0 6px", color: darkBg }}>
            Vintage Hook & Needle Size Converter
          </h2>
          <p style={{ fontSize: 14, color: "#7d6b5d", margin: "0 0 16px" }}>
            Old UK numbered sizes run <strong>backwards</strong> — smaller numbers = larger sizes. This chart maps them to modern equivalents.
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[["all", "All"], ["hooks", "Crochet Hooks"], ["needles", "Knitting Needles"]].map(([val, label]) => (
              <button key={val} onClick={() => setHookFilter(val)} style={{
                padding: "8px 16px", borderRadius: 8,
                border: hookFilter === val ? `2px solid ${accentColor}` : "1px solid #d4c4b0",
                background: hookFilter === val ? accentLight : "#fff",
                color: hookFilter === val ? accentColor : "#7d6b5d",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ddd0", overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
              padding: "10px 16px", background: darkBg, color: "#c4956a",
              fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
            }}>
              <div>Old UK Size</div>
              <div>US Size</div>
              <div>Metric (mm)</div>
              <div>Type</div>
            </div>
            {filteredHooks.map((h, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                padding: "10px 16px", borderBottom: "1px solid #f0e8dc",
                fontSize: 14, background: i % 2 === 0 ? "#fff" : "#faf8f5",
              }}>
                <div style={{ fontWeight: 600, color: accentColor }}>{h.old_uk}</div>
                <div>{h.us}</div>
                <div>{h.metric} mm</div>
                <div style={{ fontSize: 12, color: "#7d6b5d" }}>{h.type}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: accentLight, border: `1px solid ${accentColor}20`, fontSize: 13, color: "#6d5c4e", lineHeight: 1.5 }}>
            <strong>Tip:</strong> Old UK sizes count DOWN as the needle/hook gets BIGGER. A UK size 14 is tiny (2mm), while a UK size 0 is large (9mm). This is the opposite of US sizing. When in doubt, match by metric (mm) measurement.
          </div>
        </div>
      )}

      {/* ─── YARN SUBSTITUTION ─── */}
      {activeTab === "yarn" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px" }}>
          <button onClick={() => setActiveTab("home")} style={{ background: "none", border: "none", color: "#7d6b5d", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, margin: "0 0 6px", color: darkBg }}>
            Yarn Substitution Guide
          </h2>
          <p style={{ fontSize: 14, color: "#7d6b5d", margin: "0 0 8px" }}>
            Find modern replacements for discontinued vintage yarns.
          </p>

          {/* Yarn Weight Reference */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "24px 0 12px", color: darkBg }}>
            Vintage → Modern Yarn Weight Chart
          </h3>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ddd0", overflow: "auto", marginBottom: 28 }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1.5fr 1.3fr 1fr 1fr 1fr 0.8fr",
              padding: "10px 14px", background: darkBg, color: "#c4956a",
              fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
              minWidth: 620,
            }}>
              <div>Vintage Name</div>
              <div>Modern US</div>
              <div>Modern UK</div>
              <div>Gauge (4in)</div>
              <div>Wraps/in</div>
              <div>Needle</div>
            </div>
            {YARN_WEIGHTS.map((y, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1.5fr 1.3fr 1fr 1fr 1fr 0.8fr",
                padding: "10px 14px", borderBottom: "1px solid #f0e8dc",
                fontSize: 13, background: i % 2 === 0 ? "#fff" : "#faf8f5",
                minWidth: 620,
              }}>
                <div style={{ fontWeight: 600, color: accentColor }}>{y.vintage_name}</div>
                <div>{y.modern_us}</div>
                <div>{y.modern_uk}</div>
                <div style={{ fontSize: 12, color: "#7d6b5d" }}>{y.typical_gauge}</div>
                <div style={{ fontSize: 12, color: "#7d6b5d" }}>{y.wraps_inch}</div>
                <div style={{ fontSize: 12, color: "#7d6b5d" }}>{y.needle_mm}mm</div>
              </div>
            ))}
          </div>

          {/* Discontinued Yarns */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: "0 0 12px", color: darkBg }}>
            Discontinued Yarn Substitutions
          </h3>
          <input
            type="text" value={yarnSearch}
            onChange={e => setYarnSearch(e.target.value)}
            placeholder="Search by yarn name..."
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 10,
              border: "1px solid #d4c4b0", background: "#fff", fontSize: 14,
              fontFamily: "'IBM Plex Sans', sans-serif", color: "#3d2b1f",
              marginBottom: 12, boxSizing: "border-box",
            }}
          />

          {filteredYarns.map((y, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 10, padding: "14px 18px",
              border: "1px solid #e8ddd0", marginBottom: 8,
              display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
            }}>
              <div style={{ flex: "1 1 200px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: darkBg }}>{y.old}</div>
                <div style={{ fontSize: 12, color: "#7d6b5d" }}>Weight: {y.weight}</div>
              </div>
              <div style={{ fontSize: 16, color: "#c4956a" }}>→</div>
              <div style={{ flex: "1 1 200px", fontSize: 13, color: "#4a6b4a", fontWeight: 500 }}>
                {y.sub}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: accentLight, border: `1px solid ${accentColor}20`, fontSize: 13, color: "#6d5c4e", lineHeight: 1.5 }}>
            <strong>Always swatch first!</strong> Even when a modern yarn is the same weight category, fiber content and twist can affect gauge and drape. Knit or crochet a gauge swatch and compare to the pattern's stated tension before starting your project.
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <div style={{ background: darkBg, padding: "28px 20px", borderTop: `1px solid ${accentColor}30` }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#f5ebe0", marginBottom: 4 }}>
              Vintage Pattern Decoder
            </div>
            <div style={{ fontSize: 12, color: "#a09080" }}>
              A <a href="https://fibertools.app" style={{ color: "#c4956a", textDecoration: "none" }}>FiberTools.app</a> product — 30+ years of fiber arts expertise
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#7d6b5d", textAlign: "right" }}>
            <div>&copy; {new Date().getFullYear()} FiberTools. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
