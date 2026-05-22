import { useState, useEffect, useRef, useCallback } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0a1628;
    --navy-mid: #132040;
    --navy-light: #1e3060;
    --carolina: #4b9cd3;
    --carolina-light: #7bbde8;
    --red: #cc0000;
    --gold: #c8a84b;
    --white: #f5f2ec;
    --muted: #8fa3b8;
    --border: rgba(75,156,211,0.18);
    --font-display: 'Oswald', sans-serif;
    --font-body: 'Lora', serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  body { background: var(--navy); color: var(--white); font-family: var(--font-body); }
  .app { min-height: 100vh; background: var(--navy); }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 60px;
    background: var(--navy-mid);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-logo { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.08em; color: var(--white); }
  .nav-logo span { color: var(--carolina); }
  .nav-tabs { display: flex; gap: 0; }
  .nav-tab {
    background: none; border: none; color: var(--muted);
    font-family: var(--font-display); font-size: 0.85rem; letter-spacing: 0.1em;
    padding: 0 1.25rem; height: 60px; cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: color 0.2s, border-color 0.2s;
    text-transform: uppercase;
  }
  .nav-tab:hover { color: var(--white); }
  .nav-tab.active { color: var(--carolina); border-bottom-color: var(--carolina); }
  .nav-badge {
    background: var(--carolina); color: var(--navy);
    font-family: var(--font-mono); font-size: 0.6rem;
    padding: 2px 6px; border-radius: 2px; margin-left: 6px; font-weight: 500;
  }

  .hero {
    position: relative; padding: 3rem 2rem 2.5rem;
    border-bottom: 1px solid var(--border); overflow: hidden;
  }
  .hero::before {
    content: 'NC';
    position: absolute; right: -1rem; top: -2rem;
    font-family: var(--font-display); font-size: 18rem; font-weight: 700;
    color: rgba(75,156,211,0.04); line-height: 1; pointer-events: none; letter-spacing: -0.05em;
  }
  .hero-label { font-family: var(--font-mono); font-size: 0.7rem; color: var(--carolina); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.75rem; }
  .hero-title { font-family: var(--font-display); font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 700; letter-spacing: 0.02em; line-height: 1; text-transform: uppercase; margin-bottom: 1rem; }
  .hero-title em { color: var(--carolina); font-style: normal; }
  .hero-sub { font-size: 1rem; color: var(--muted); font-style: italic; max-width: 480px; line-height: 1.6; }
  .hero-stats { display: flex; gap: 2rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border); }
  .hero-stat-val { font-family: var(--font-display); font-size: 1.8rem; color: var(--white); letter-spacing: 0.02em; }
  .hero-stat-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 2px; }

  .main-grid { display: grid; grid-template-columns: 1fr 320px; gap: 0; min-height: calc(100vh - 120px); }
  .main-content { padding: 1.5rem 2rem; border-right: 1px solid var(--border); }
  .sidebar { padding: 1.5rem; }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .section-title { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--white); display: flex; align-items: center; gap: 0.75rem; }
  .section-title::before { content: ''; display: block; width: 3px; height: 16px; background: var(--carolina); border-radius: 1px; }
  .section-more { font-family: var(--font-mono); font-size: 0.65rem; color: var(--carolina); letter-spacing: 0.1em; text-transform: uppercase; background: none; border: none; cursor: pointer; opacity: 0.8; }
  .section-more:hover { opacity: 1; }

  .team-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .team-tab { font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.35rem 1rem; border: 1px solid var(--border); border-radius: 2px; background: none; color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .team-tab:hover { color: var(--white); border-color: rgba(75,156,211,0.4); }
  .team-tab.active { background: var(--carolina); color: var(--navy); border-color: var(--carolina); font-weight: 600; }
  .team-tab.ncstate.active { background: var(--red); border-color: var(--red); }
  .team-tab.duke.active { background: #003087; border-color: #003087; color: white; }
  .team-tab.hornets.active { background: #1d1160; border-color: #00788c; color: #00788c; }
  .team-tab.hurricanes.active { background: var(--red); border-color: var(--red); }
  .team-tab.fc.active { background: #c8102e; border-color: #c8102e; }

  .stories-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  .story-card { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s; animation: fadeUp 0.4s ease both; }
  .story-card:hover { border-color: var(--carolina); transform: translateY(-2px); }
  .story-card.featured { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; }
  .story-img { background: var(--navy-light); height: 140px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .story-card.featured .story-img { height: auto; min-height: 200px; }
  .story-img-text { font-family: var(--font-display); font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.06); letter-spacing: -0.04em; user-select: none; }
  .story-team-badge { position: absolute; top: 10px; left: 10px; font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 2px; text-transform: uppercase; }
  .badge-unc { background: rgba(75,156,211,0.2); color: var(--carolina); }
  .badge-ncstate { background: rgba(204,0,0,0.2); color: #ff6666; }
  .badge-duke { background: rgba(0,48,135,0.3); color: #6699ff; }
  .badge-hornets { background: rgba(0,120,140,0.2); color: #00a8bb; }
  .badge-hurricanes { background: rgba(204,0,0,0.2); color: #ff6666; }
  .badge-fc { background: rgba(200,16,46,0.2); color: #ff6677; }
  .badge-analysis { background: rgba(200,168,75,0.2); color: var(--gold); }
  .story-body { padding: 1rem; }
  .story-type { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .story-headline { font-family: var(--font-display); font-size: 1.05rem; letter-spacing: 0.02em; line-height: 1.25; margin-bottom: 0.5rem; color: var(--white); text-transform: uppercase; }
  .story-card.featured .story-headline { font-size: 1.4rem; }
  .story-preview { font-size: 0.82rem; color: var(--muted); line-height: 1.5; font-style: italic; }
  .story-footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; border-top: 1px solid var(--border); font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); }
  .story-footer button { background: none; border: none; color: var(--carolina); font-family: var(--font-mono); font-size: 0.6rem; cursor: pointer; letter-spacing: 0.05em; }

  .analytics-panel { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; padding: 1.25rem; margin-bottom: 1.5rem; animation: fadeUp 0.5s ease both; }
  .analytics-title { font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; color: var(--carolina); }
  .stat-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
  .stat-row-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; width: 110px; flex-shrink: 0; }
  .stat-bar-wrap { flex: 1; height: 6px; background: var(--navy-light); border-radius: 1px; }
  .stat-bar { height: 100%; border-radius: 1px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
  .bar-carolina { background: var(--carolina); }
  .bar-red { background: var(--red); }
  .bar-duke { background: #4477cc; }
  .bar-gold { background: var(--gold); }
  .stat-val { font-family: var(--font-mono); font-size: 0.7rem; color: var(--white); width: 36px; text-align: right; flex-shrink: 0; }

  .score-card { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; padding: 1rem; margin-bottom: 0.75rem; animation: fadeUp 0.3s ease both; }
  .score-card-header { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between; }
  .score-live { color: var(--red); display: flex; align-items: center; gap: 4px; }
  .score-live::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--red); display: block; animation: pulse 1s infinite; }
  .score-matchup { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center; }
  .score-team { display: flex; flex-direction: column; }
  .score-team.away { align-items: flex-start; }
  .score-team.home { align-items: flex-end; }
  .score-team-name { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.05em; text-transform: uppercase; }
  .score-record { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); }
  .score-center { text-align: center; }
  .score-nums { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 0.04em; color: var(--white); }
  .score-period { font-family: var(--font-mono); font-size: 0.6rem; color: var(--carolina); }

  .round-header { font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.75rem; display: flex; justify-content: space-between; }

  .ai-panel { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; margin-bottom: 1.5rem; }
  .ai-header { background: var(--navy-light); padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border); }
  .ai-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--carolina); animation: pulse 2s infinite; }
  .ai-header-text { font-family: var(--font-display); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--carolina); }
  .ai-messages { padding: 1rem; max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; }
  .ai-msg { font-size: 0.82rem; line-height: 1.55; }
  .ai-msg.assistant { color: var(--white); font-style: italic; padding-left: 0.75rem; border-left: 2px solid var(--carolina); }
  .ai-msg.user { color: var(--muted); font-family: var(--font-mono); font-size: 0.7rem; text-align: right; }
  .ai-loading { display: flex; gap: 4px; padding-left: 0.75rem; border-left: 2px solid var(--carolina); align-items: center; height: 24px; }
  .ai-loading span { width: 5px; height: 5px; border-radius: 50%; background: var(--carolina); animation: bounce 0.9s infinite; }
  .ai-loading span:nth-child(2) { animation-delay: 0.15s; }
  .ai-loading span:nth-child(3) { animation-delay: 0.3s; }
  .ai-input-wrap { display: flex; border-top: 1px solid var(--border); }
  .ai-input { flex: 1; background: none; border: none; outline: none; padding: 0.75rem 1rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--white); }
  .ai-input::placeholder { color: var(--muted); }
  .ai-send { background: var(--carolina); border: none; padding: 0 1rem; color: var(--navy); cursor: pointer; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; transition: background 0.2s; }
  .ai-send:hover { background: var(--carolina-light); }
  .ai-send:disabled { opacity: 0.4; cursor: default; }

  .quick-stat { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
  .quick-stat:last-child { border-bottom: none; }
  .quick-stat-name { font-family: var(--font-body); font-size: 0.8rem; color: var(--white); }
  .quick-stat-sub { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); }
  .quick-stat-num { font-family: var(--font-display); font-size: 1.1rem; color: var(--carolina); letter-spacing: 0.04em; }

  .detail-overlay { position: fixed; inset: 0; background: rgba(10,22,40,0.95); z-index: 200; overflow-y: auto; padding: 2rem; animation: fadeIn 0.2s ease; }
  .detail-inner { max-width: 740px; margin: 0 auto; }
  .detail-back { background: none; border: none; color: var(--carolina); font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.4rem; }
  .detail-kicker { font-family: var(--font-mono); font-size: 0.65rem; color: var(--carolina); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.75rem; }
  .detail-headline { font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; margin-bottom: 1rem; letter-spacing: 0.02em; }
  .detail-meta { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
  .detail-body { font-size: 1rem; line-height: 1.75; color: var(--white); }
  .detail-body p { margin-bottom: 1.25rem; }
  .detail-body strong { color: var(--carolina); font-style: normal; }
  .detail-stat-block { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; padding: 1.25rem; margin: 1.5rem 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .detail-stat-item { text-align: center; }
  .detail-stat-val { font-family: var(--font-display); font-size: 2rem; color: var(--carolina); letter-spacing: 0.02em; }
  .detail-stat-lbl { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--navy-light); border-radius: 2px; }
`;

const TEAMS = [
  { id: "unc", label: "UNC", sport: "CBB", color: "unc" },
  { id: "ncstate", label: "NC State", sport: "CBB", color: "ncstate" },
  { id: "duke", label: "Duke", sport: "CBB", color: "duke" },
  { id: "hornets", label: "Hornets", sport: "NBA", color: "hornets" },
  { id: "hurricanes", label: "Hurricanes", sport: "NHL", color: "hurricanes" },
  { id: "fc", label: "NC FC", sport: "USL", color: "fc" },
];

const PLAYOFF_ROUNDS = [
  {
    name: "First Round", opponent: "Ottawa Senators", resultLabel: "W 4-0", won: true,
    games: [
      { g: 1, away: "OTT", home: "CAR", awayScore: 1, homeScore: 4, period: "FINAL", win: true },
      { g: 2, away: "OTT", home: "CAR", awayScore: 1, homeScore: 3, period: "FINAL", win: true },
      { g: 3, away: "CAR", home: "OTT", awayScore: 4, homeScore: 1, period: "FINAL", win: true },
      { g: 4, away: "CAR", home: "OTT", awayScore: 3, homeScore: 2, period: "FINAL", win: true },
    ],
  },
  {
    name: "Second Round", opponent: "Philadelphia Flyers", resultLabel: "W 4-0", won: true,
    games: [
      { g: 1, away: "PHI", home: "CAR", awayScore: 2, homeScore: 5, period: "FINAL", win: true },
      { g: 2, away: "PHI", home: "CAR", awayScore: 1, homeScore: 4, period: "FINAL", win: true },
      { g: 3, away: "CAR", home: "PHI", awayScore: 3, homeScore: 2, period: "FINAL", win: true },
      { g: 4, away: "CAR", home: "PHI", awayScore: 2, homeScore: 1, period: "FINAL/OT", win: true },
    ],
  },
  {
    name: "Eastern Conference Final", opponent: "Montreal Canadiens", resultLabel: "MTL 1-0", won: null,
    games: [
      { g: 1, away: "MTL", home: "CAR", awayScore: 6, homeScore: 2, period: "FINAL", win: false },
      { g: 2, away: "MTL", home: "CAR", awayScore: null, homeScore: null, period: "SAT MAY 23 · 7PM ET", win: null },
      { g: 3, away: "CAR", home: "MTL", awayScore: null, homeScore: null, period: "SUN MAY 25 · 8PM ET", win: null },
      { g: 4, away: "CAR", home: "MTL", awayScore: null, homeScore: null, period: "TUE MAY 27 · 8PM ET", win: null },
    ],
  },
];

const STORIES = {
  unc: [
    {
      id: 1, featured: true,
      type: "Deep Dive", badge: "badge-unc", team: "UNC",
      headline: "Hubert Davis Rebuilds the Tar Heel Identity",
      preview: "After the heartbreak of the 2022 title game, Davis has quietly constructed one of the ACC's most analytically sound rosters. Shot quality metrics tell the real story.",
      img: "TAR HEELS",
      stats: [{ label: "eFG%", val: ".548", bar: 74, cls: "bar-carolina" }, { label: "3P Rate", val: "38.2%", bar: 60, cls: "bar-carolina" }, { label: "Off Rating", val: "118.4", bar: 82, cls: "bar-gold" }],
      body: `When Hubert Davis took over from Roy Williams in 2021, the skeptics were loud. The analytics community was quieter but more pointed: Chapel Hill was transitioning from an intuition-driven program to something more data-forward.\n\nThe numbers through this season tell a compelling story. UNC ranks in the top 12 nationally in effective field goal percentage, a metric that weights three-pointers appropriately by accounting for their extra value. More telling is their shot distribution — nearly 42% of their attempts come from within the restricted area or from beyond the arc, the two most efficient zones on the floor.\n\n"We talk about shot quality every day in practice," Davis said earlier this season. "Not just makes and misses, but where we're getting our shots from."\n\nThe transition defense numbers are equally striking. Opponents score on just 94 of 100 possessions against UNC — a mark that would have placed them 8th in the country last season. Davis has implemented a defined sprint-back system where guards are assigned to specific lanes to disrupt early transition before the defense can set.\n\nWith two potential lottery picks on the roster and a supporting cast built through analytics-driven recruiting, the Tar Heels appear positioned for a sustained run — not a one-season surge.`,
      statBlock: [{ val: "118.4", lbl: "Off. Rating" }, { val: "#7", lbl: "Nat'l eFG%" }, { val: "94.0", lbl: "Def. Rating" }],
      date: "May 14, 2026",
    },
    {
      id: 2, type: "Analysis", badge: "badge-analysis", team: "UNC",
      headline: "The Point Guard Problem: Who Runs the Show Next Year?",
      preview: "With their starter departing, Davis faces his most critical roster decision. Metrics on three candidates.",
      img: "PG",
      stats: [],
      body: `The departure of UNC's starting point guard opens the most scrutinized roster question heading into the offseason.\n\nCandidate A led the team in assist-to-turnover ratio (3.4:1) but ranked last in pull-up three-point percentage among rotation players.\n\nCandidate B brings superior athleticism metrics — his burst speed measured in the 91st percentile among ACC guards — but his shot selection has drawn concern.\n\nThe portal may ultimately provide the answer, which itself signals how the program has evolved.`,
      statBlock: [{ val: "3.4:1", lbl: "A/TO Ratio" }, { val: "5.2", lbl: "Mid-Range/36" }, { val: "91st", lbl: "Burst Speed %" }],
      date: "May 12, 2026",
    },
  ],
  ncstate: [
    {
      id: 4, featured: true,
      type: "Breakdown", badge: "badge-ncstate", team: "NC State",
      headline: "After the Cinderella Run: Building Sustainably in Raleigh",
      preview: "The 2024 NCAA run changed NC State basketball forever. Two years later, can Kevin Keatts institutionalize the magic?",
      img: "WOLFPACK",
      stats: [{ label: "Transition Pts", val: "19.4", bar: 70, cls: "bar-red" }, { label: "Def. Rebound%", val: "71.8", bar: 68, cls: "bar-red" }, { label: "Bench Min%", val: "41%", bar: 55, cls: "bar-gold" }],
      body: `The 2024 run was the stuff of documentary films. But inside the Wolfpack program, the question has shifted from celebration to construction: how do you make a Cinderella story into a dynasty?\n\nKevin Keatts has leaned hard into transition offense, which powered the tournament run. NC State averaged 19.4 fast-break points per game last season, ranking 4th in the ACC.\n\nThe challenge is roster continuity in the transfer portal era. State has lost three key contributors since May, but Keatts's staff has become adept at identifying portal fits.`,
      statBlock: [{ val: "19.4", lbl: "Trans. Pts/G" }, { val: "2nd", lbl: "Off. Reb. (2024)" }, { val: "4th", lbl: "ACC Fast Break" }],
      date: "May 15, 2026",
    },
  ],
  duke: [
    {
      id: 6, featured: true,
      type: "Portrait", badge: "badge-duke", team: "Duke",
      headline: "Jon Scheyer's Data Lab: Analytics at the Highest Level",
      preview: "Duke's analytics staff rivals any pro team. An inside look at how the Blue Devils quantify the unquantifiable.",
      img: "DUKE",
      stats: [{ label: "Recruit Stars Avg", val: "4.8", bar: 96, cls: "bar-duke" }, { label: "One-and-Done%", val: "62%", bar: 62, cls: "bar-gold" }, { label: "KenPom Rank", val: "#4", bar: 96, cls: "bar-duke" }],
      body: `Jon Scheyer inherited the most enviable analytics infrastructure in college basketball and has pushed it further. Duke's front office-style operation employs seven full-time analysts.\n\nMost notably, Duke has begun publishing a proprietary "NBA readiness" index for recruits — a composite of athleticism, shot mechanics, decision-making speed, and defensive engagement metrics. The internal data shows a 0.71 correlation with eventual draft slot.`,
      statBlock: [{ val: "#4", lbl: "KenPom" }, { val: "7", lbl: "Analytics Staff" }, { val: "0.71", lbl: "Draft Correlation" }],
      date: "May 13, 2026",
    },
  ],
  hornets: [
    {
      id: 7, featured: true,
      type: "Rebuild Report", badge: "badge-hornets", team: "Hornets",
      headline: "LaMelo's Contract Year: Charlotte at the Crossroads",
      preview: "Playoff or rebuild? The analytics of a franchise inflection point.",
      img: "HORNETS",
      stats: [{ label: "LaMelo Usage%", val: "34.1", bar: 80, cls: "bar-carolina" }, { label: "Team ORtg", val: "109.2", bar: 55, cls: "bar-gold" }, { label: "Net Rating", val: "-4.1", bar: 30, cls: "bar-red" }],
      body: `The Charlotte Hornets sit at the most consequential fork in franchise history. LaMelo Ball enters his contract extension negotiations against a backdrop of mixed team performance.\n\nThe analytics paint a picture the box scores sometimes obscure. Ball's on-court numbers are elite: a 34.1% usage rate paired with a positive net rating when healthy suggests a genuinely franchise-caliber player. Charlotte is 19-28 when Ball misses games, 24-21 when he plays 30+ minutes.`,
      statBlock: [{ val: "24-21", lbl: "W/L With LaMelo" }, { val: "34.1%", lbl: "Usage Rate" }, { val: "19-28", lbl: "W/L Without" }],
      date: "May 15, 2026",
    },
  ],
  hurricanes: [
    {
      id: 8, featured: true,
      type: "Playoff Breakdown", badge: "badge-hurricanes", team: "Hurricanes",
      headline: "8-1 and Hunting: The Canes' Path to the Cup",
      preview: "Carolina swept Ottawa and Philly before dropping Game 1 to Montreal. The analytics of a team built to win now.",
      img: "CANES",
      stats: [{ label: "Expected Goals %", val: "54.2", bar: 72, cls: "bar-red" }, { label: "High-Danger CF%", val: "56.1", bar: 75, cls: "bar-red" }, { label: "PP Efficiency", val: "23.8%", bar: 68, cls: "bar-gold" }],
      body: `The Carolina Hurricanes entered the 2026 Stanley Cup Playoffs as the top seed in the Eastern Conference and proceeded to prove it — sweeping Ottawa and Philadelphia in back-to-back series before facing their first real test against the Montreal Canadiens.\n\nGame 1 of the ECF was a 6-2 loss, with Montreal's speed exposing an 11-day layoff that left the Canes flat in the first period. Four goals in the opening frame decided it before Carolina could find their legs.\n\nThe analytics still favor Carolina. Their expected goals percentage over the full playoff run sits above 54%, meaning they're generating higher-quality chances than opponents even when the scoreboard disagrees. The Andersen blip in Game 1 — his first genuinely bad performance of the postseason — is an outlier against a .950 save percentage run.\n\nGame 2 tonight at Lenovo Center is effectively a must-respond moment. Rod Brind'Amour's teams don't rattle easily. The structure will be there. The question is whether the legs come back after the layoff.`,
      statBlock: [{ val: "8-1", lbl: "Playoff Record" }, { val: "54.2%", lbl: "xG%" }, { val: "ECF", lbl: "Current Round" }],
      date: "May 22, 2026",
    },
  ],
  fc: [
    {
      id: 9, featured: true,
      type: "Pitch Report", badge: "badge-fc", team: "NC FC",
      headline: "The Beautiful Game Comes to North Carolina",
      preview: "NC FC's rise through the USL is powered by xG, pressing metrics, and some of the state's best soccer talent.",
      img: "NCFC",
      stats: [{ label: "xG Per Match", val: "1.82", bar: 72, cls: "bar-red" }, { label: "Press Success%", val: "31.4", bar: 58, cls: "bar-gold" }, { label: "PPDA", val: "8.1", bar: 65, cls: "bar-red" }],
      body: `North Carolina FC's return to professional soccer has been accompanied by a genuine commitment to modern football analytics. The technical staff tracks expected goals, pressing intensity, and spatial control metrics.\n\nTheir pressing system — measured by PPDA where lower is more intense — sits at 8.1, placing them among the most aggressive pressing teams in the USL Championship.\n\nThe connection to the state's deep soccer culture gives the club a genuine identity. They are not a franchise dropped into a market. They are a club of this specific place.`,
      statBlock: [{ val: "1.82", lbl: "xG Per Match" }, { val: "8.1", lbl: "PPDA" }, { val: "4-3-3", lbl: "Formation" }],
      date: "May 11, 2026",
    },
  ],
};

const SCORES = {
  unc: [
    { away: "UNC", awayRec: "28-9", awayScore: 74, home: "Florida", homeRec: "25-11", homeScore: 68, period: "FINAL", live: false, sport: "CBB" },
  ],
  ncstate: [
    { away: "NC State", awayRec: "24-12", awayScore: 67, home: "Louisville", homeRec: "20-15", homeScore: 63, period: "FINAL", live: false, sport: "CBB" },
  ],
  duke: [
    { away: "Duke", awayRec: "30-7", awayScore: 82, home: "Houston", homeRec: "27-10", homeScore: 79, period: "FINAL", live: false, sport: "CBB" },
  ],
  hornets: [
    { away: "Miami", awayRec: "38-44", awayScore: 108, home: "Charlotte", homeRec: "43-39", homeScore: 114, period: "FINAL", live: false, sport: "NBA" },
  ],
  hurricanes: [],
  fc: [
    { away: "NC FC", awayRec: "8-3-2", awayScore: 2, home: "Charleston", homeRec: "7-5-1", homeScore: 1, period: "FINAL", live: false, sport: "USL" },
  ],
};

const LEADERS = {
  unc: [
    { name: "Elliot Cadeau", sub: "PG · Freshman", val: "14.2 PPG" },
    { name: "Jalen Washington", sub: "PF · Sophomore", val: "9.8 RPG" },
    { name: "Seth Trimble", sub: "SG · Junior", val: "48.3 FG%" },
  ],
  ncstate: [
    { name: "Michael O'Connell", sub: "PG · Senior", val: "16.4 PPG" },
    { name: "Dontrez Styles", sub: "SF · Junior", val: "7.1 RPG" },
  ],
  duke: [
    { name: "Kon Knueppel", sub: "SG · Freshman", val: "17.8 PPG" },
    { name: "Cooper Flagg", sub: "PF · Freshman", val: "11.2 RPG" },
    { name: "Khaman Maluach", sub: "C · Freshman", val: "2.4 BPG" },
  ],
  hornets: [
    { name: "LaMelo Ball", sub: "PG", val: "30.1 PPG" },
    { name: "Brandon Miller", sub: "SF", val: "19.4 PPG" },
    { name: "Mark Williams", sub: "C", val: "13.2 RPG" },
  ],
  hurricanes: [
    { name: "Sebastian Aho", sub: "C · #20", val: "38 G" },
    { name: "Andrei Svechnikov", sub: "RW · #37", val: "52 A" },
    { name: "Frederik Andersen", sub: "G", val: ".918 SV%" },
  ],
  fc: [
    { name: "Carlos Múñoz", sub: "FW", val: "12 Goals" },
    { name: "Hadji Barry", sub: "FW", val: "8 Assists" },
    { name: "D.J. Taylor", sub: "GK", val: ".74 xGA" },
  ],
};

const SYSTEM_PROMPT = `You are an expert North Carolina sports analyst with deep knowledge of UNC Tar Heels, NC State Wolfpack, Duke Blue Devils, Charlotte Hornets, Carolina Hurricanes, and NC FC. You provide sharp, analytically-driven insights. You use advanced metrics naturally (eFG%, xG, expected goals, PPDA, net rating, etc.) and have strong opinions. Keep responses to 2-4 sentences — punchy and authoritative. You're talking to a passionate NC sports fan. The Hurricanes are currently in the 2026 Eastern Conference Finals vs Montreal, down 1-0 after losing Game 1 6-2. Game 2 is tonight May 23.`;

export default function NCSportsHub() {
  const [activeTeam, setActiveTeam] = useState("unc");
  const [activeTab, setActiveTab] = useState("stories");
  const [openStory, setOpenStory] = useState(null);
  const [liveScores, setLiveScores] = useState({ hornets: null, hurricanes: null });
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ask me anything about NC sports — analytics, matchups, predictions, roster moves. I'm here." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const msgEndRef = useRef(null);

  const fetchCanesPlayoffData = useCallback(async () => {
    try {
      const res = await fetch("/api/nhl");
      const data = await res.json();
      if (data.liveGame) {
        const g = data.liveGame;
        setLiveScores(prev => ({ ...prev, hurricanes: {
          away: g.awayTeam.abbrev,
          awayScore: g.awayTeam.score,
          home: g.homeTeam.abbrev,
          homeScore: g.homeTeam.score,
          period: g.gameState === "FINAL" ? "FINAL" :
                  g.periodDescriptor?.periodType === "OT" ? "OVERTIME" :
                  g.periodDescriptor?.periodType === "SO" ? "SHOOTOUT" :
                  `P${g.periodDescriptor?.number} ${g.clock?.timeRemaining || ""}`,
          live: g.gameState === "LIVE",
        }}));
      }
    } catch(e) {
      console.error("NHL fetch failed:", e);
    }
  }, []);

  useEffect(() => {
    fetchCanesPlayoffData();
    const interval = setInterval(fetchCanesPlayoffData, 30000);
    return () => clearInterval(interval);
  }, [fetchCanesPlayoffData]);

  useEffect(() => {
    setBarsVisible(false);
    setTimeout(() => setBarsVisible(true), 100);
  }, [activeTeam]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const history = [...messages, { role: "user", content: userMsg }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Couldn't get a response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection issue. Check your API access." }]);
    }
    setLoading(false);
  };

  const stories = STORIES[activeTeam] || [];
  const scores = SCORES[activeTeam] || [];
  const leaders = LEADERS[activeTeam] || [];
  const featured = stories.find(s => s.featured);
  const rest = stories.filter(s => !s.featured);
  const openDetail = (story) => { setOpenStory(story); window.scrollTo(0, 0); };

  const liveGame = liveScores[activeTeam];

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">THE <span>CAROLINA</span> WIRE</div>
          <div className="nav-tabs">
            {["stories", "analytics", "scores"].map(t => (
              <button key={t} className={`nav-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                {t}{t === "scores" && <span className="nav-badge">LIVE</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="hero">
          <div className="hero-label">// North Carolina Sports Analytics</div>
          <h1 className="hero-title">Your State.<br /><em>Your Stats.</em><br />Your Story.</h1>
          <p className="hero-sub">Deep analytics, sharp storytelling, and AI-powered breakdowns for every team in the Tar Heel State.</p>
          <div className="hero-stats">
            {[["6", "Teams Covered"], ["2026", "Season"], ["Real-Time", "AI Analysis"], ["Advanced", "Metrics"]].map(([v, l]) => (
              <div key={l}>
                <div className="hero-stat-val">{v}</div>
                <div className="hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "1rem 2rem 0", borderBottom: "1px solid var(--border)", background: "var(--navy-mid)" }}>
          <div className="team-tabs">
            {TEAMS.map(t => (
              <button key={t.id} className={`team-tab ${t.color} ${activeTeam === t.id ? "active" : ""}`} onClick={() => setActiveTeam(t.id)}>
                {t.label}<span style={{ fontSize: "0.55rem", marginLeft: "4px", opacity: 0.7 }}>{t.sport}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="main-grid">
          <div className="main-content">

            {/* STORIES */}
            {activeTab === "stories" && (
              <>
                <div className="section-header">
                  <div className="section-title">Latest Stories</div>
                  <button className="section-more">All stories →</button>
                </div>
                <div className="stories-grid">
                  {featured && (
                    <div className="story-card featured" onClick={() => openDetail(featured)}>
                      <div className="story-img">
                        <div className="story-img-text">{featured.img}</div>
                        <span className={`story-team-badge ${featured.badge}`}>{featured.team}</span>
                      </div>
                      <div>
                        <div className="story-body">
                          <div className="story-type">{featured.type}</div>
                          <div className="story-headline">{featured.headline}</div>
                          <div className="story-preview">{featured.preview}</div>
                        </div>
                        <div className="story-footer">
                          <span>{featured.date}</span>
                          <button>Read analysis →</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {rest.map(s => (
                    <div className="story-card" key={s.id} onClick={() => openDetail(s)}>
                      <div className="story-img" style={{ height: "120px" }}>
                        <div className="story-img-text">{s.img}</div>
                        <span className={`story-team-badge ${s.badge}`}>{s.team}</span>
                      </div>
                      <div className="story-body">
                        <div className="story-type">{s.type}</div>
                        <div className="story-headline">{s.headline}</div>
                        <div className="story-preview">{s.preview}</div>
                      </div>
                      <div className="story-footer">
                        <span>{s.date}</span>
                        <button>Read →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ANALYTICS */}
            {activeTab === "analytics" && featured && (
              <>
                <div className="section-header">
                  <div className="section-title">Analytics Dashboard</div>
                </div>
                <div className="analytics-panel">
                  <div className="analytics-title">Key Metrics — {TEAMS.find(t => t.id === activeTeam)?.label}</div>
                  {featured.stats.map((s, i) => (
                    <div className="stat-row" key={i}>
                      <div className="stat-row-label">{s.label}</div>
                      <div className="stat-bar-wrap">
                        <div className={`stat-bar ${s.cls}`} style={{ width: barsVisible ? `${s.bar}%` : "0%" }} />
                      </div>
                      <div className="stat-val">{s.val}</div>
                    </div>
                  ))}
                </div>
                <div className="analytics-panel">
                  <div className="analytics-title">Featured Analysis</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>{featured.headline}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)", fontStyle: "italic", lineHeight: 1.6, marginBottom: "1rem" }}>{featured.preview}</div>
                  <button onClick={() => { openDetail(featured); setActiveTab("stories"); }}
                    style={{ background: "var(--carolina)", border: "none", color: "var(--navy)", padding: "0.5rem 1.25rem", fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>
                    Full Breakdown →
                  </button>
                </div>
              </>
            )}

            {/* SCORES */}
            {activeTab === "scores" && (
              <>
                {activeTeam === "hurricanes" ? (
                  <>
                    <div className="section-header">
                      <div className="section-title">2026 Stanley Cup Playoffs</div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--carolina)" }}>8-1 Overall</span>
                    </div>

                    {/* Live game banner if active */}
                    {liveGame && (
                      <div className="score-card" style={{ borderColor: "var(--red)", marginBottom: "1.5rem" }}>
                        <div className="score-card-header">
                          <span>NHL · ECF Game 2</span>
                          {liveGame.live ? <span className="score-live">Live</span> : <span>{liveGame.period}</span>}
                        </div>
                        <div className="score-matchup">
                          <div className="score-team away"><div className="score-team-name">{liveGame.away}</div></div>
                          <div className="score-center">
                            <div className="score-nums">{liveGame.awayScore} — {liveGame.homeScore}</div>
                            <div className="score-period">{liveGame.period}</div>
                          </div>
                          <div className="score-team home"><div className="score-team-name">{liveGame.home}</div></div>
                        </div>
                      </div>
                    )}

                    {PLAYOFF_ROUNDS.map((round, ri) => (
                      <div key={ri} style={{ marginBottom: "1.75rem" }}>
                        <div className="round-header" style={{ color: round.won === true ? "var(--carolina)" : round.won === false ? "var(--red)" : "var(--gold)" }}>
                          <span>{round.name} · vs {round.opponent}</span>
                          <span style={{ color: round.won === true ? "#4caf50" : round.won === null ? "var(--gold)" : "var(--red)" }}>{round.resultLabel}</span>
                        </div>
                        {round.games.map((g, gi) => (
                          <div className="score-card" key={gi} style={{ animationDelay: `${gi * 0.06}s`, opacity: g.homeScore === null ? 0.5 : 1 }}>
                            <div className="score-card-header">
                              <span>Game {g.g}</span>
                              {g.win === true && <span style={{ color: "#4caf50" }}>W</span>}
                              {g.win === false && <span style={{ color: "var(--red)" }}>L</span>}
                              {g.win === null && <span style={{ color: "var(--muted)" }}>upcoming</span>}
                            </div>
                            <div className="score-matchup">
                              <div className="score-team away"><div className="score-team-name">{g.away}</div></div>
                              <div className="score-center">
                                {g.homeScore !== null
                                  ? <div className="score-nums">{g.awayScore} — {g.homeScore}</div>
                                  : <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>vs</div>}
                                <div className="score-period">{g.period}</div>
                              </div>
                              <div className="score-team home"><div className="score-team-name">{g.home}</div></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    <div className="section-header" style={{ marginTop: "0.5rem" }}>
                      <div className="section-title">Stat Leaders</div>
                    </div>
                    {leaders.map((l, i) => (
                      <div className="quick-stat" key={i}>
                        <div>
                          <div className="quick-stat-name">{l.name}</div>
                          <div className="quick-stat-sub">{l.sub}</div>
                        </div>
                        <div className="quick-stat-num">{l.val}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="section-header">
                      <div className="section-title">Scores & Schedule</div>
                    </div>
                    {scores.length ? scores.map((g, i) => (
                      <div className="score-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="score-card-header">
                          <span>{TEAMS.find(t => t.id === activeTeam)?.sport} · {g.period === "FINAL" || g.period === "FINAL/OT" ? "Final" : "Upcoming"}</span>
                          {g.live ? <span className="score-live">Live</span> : <span>{g.period}</span>}
                        </div>
                        <div className="score-matchup">
                          <div className="score-team away">
                            <div className="score-team-name">{g.away}</div>
                            <div className="score-record">{g.awayRec}</div>
                          </div>
                          <div className="score-center">
                            {g.awayScore != null
                              ? <div className="score-nums">{g.awayScore} — {g.homeScore}</div>
                              : <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>vs</div>}
                            <div className="score-period">{g.period}</div>
                          </div>
                          <div className="score-team home">
                            <div className="score-team-name">{g.home}</div>
                            <div className="score-record">{g.homeRec}</div>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div style={{ color: "var(--muted)", fontStyle: "italic", padding: "2rem 0" }}>No recent games on record.</div>
                    )}
                    <div className="section-header" style={{ marginTop: "2rem" }}>
                      <div className="section-title">Stat Leaders</div>
                    </div>
                    {leaders.map((l, i) => (
                      <div className="quick-stat" key={i}>
                        <div>
                          <div className="quick-stat-name">{l.name}</div>
                          <div className="quick-stat-sub">{l.sub}</div>
                        </div>
                        <div className="quick-stat-num">{l.val}</div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="sidebar">
            <div className="section-header">
              <div className="section-title">AI Analyst</div>
            </div>
            <div className="ai-panel">
              <div className="ai-header">
                <div className="ai-dot" />
                <div className="ai-header-text">Ask anything about NC sports</div>
              </div>
              <div className="ai-messages">
                {messages.map((m, i) => (
                  <div key={i} className={`ai-msg ${m.role}`}>{m.content}</div>
                ))}
                {loading && (
                  <div className="ai-loading"><span /><span /><span /></div>
                )}
                <div ref={msgEndRef} />
              </div>
              <div className="ai-input-wrap">
                <input
                  className="ai-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about stats, matchups, predictions..."
                  disabled={loading}
                />
                <button className="ai-send" onClick={sendMessage} disabled={loading || !input.trim()}>Ask</button>
              </div>
            </div>

            <div className="section-header" style={{ marginTop: "1.5rem" }}>
              <div className="section-title">Stat Leaders</div>
            </div>
            <div style={{ background: "var(--navy-mid)", border: "1px solid var(--border)", borderRadius: "3px", padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
              {leaders.map((l, i) => (
                <div className="quick-stat" key={i}>
                  <div>
                    <div className="quick-stat-name" style={{ fontSize: "0.78rem" }}>{l.name}</div>
                    <div className="quick-stat-sub">{l.sub}</div>
                  </div>
                  <div className="quick-stat-num" style={{ fontSize: "0.95rem" }}>{l.val}</div>
                </div>
              ))}
            </div>

            <div className="section-header">
              <div className="section-title">Quick Takes</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                `What's ${TEAMS.find(t => t.id === activeTeam)?.label}'s biggest weakness this season?`,
                `Compare ${TEAMS.find(t => t.id === activeTeam)?.label} to their main rival analytically`,
                `Predict ${TEAMS.find(t => t.id === activeTeam)?.label}'s outlook for next season`,
              ].map((q, i) => (
                <button key={i} onClick={() => setInput(q)}
                  style={{ background: "var(--navy-mid)", border: "1px solid var(--border)", borderRadius: "2px", padding: "0.6rem 0.75rem", textAlign: "left", color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "0.75rem", fontStyle: "italic", cursor: "pointer", transition: "all 0.15s", lineHeight: 1.4 }}
                  onMouseEnter={e => { e.target.style.borderColor = "var(--carolina)"; e.target.style.color = "var(--white)"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--muted)"; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {openStory && (
          <div className="detail-overlay">
            <div className="detail-inner">
              <button className="detail-back" onClick={() => setOpenStory(null)}>← Back to stories</button>
              <div className="detail-kicker">{openStory.type} · {openStory.team}</div>
              <h1 className="detail-headline">{openStory.headline}</h1>
              <div className="detail-meta">By The Carolina Wire Analytics Desk · {openStory.date}</div>
              {openStory.statBlock && (
                <div className="detail-stat-block">
                  {openStory.statBlock.map((s, i) => (
                    <div className="detail-stat-item" key={i}>
                      <div className="detail-stat-val">{s.val}</div>
                      <div className="detail-stat-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="detail-body">
                {openStory.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--navy-mid)", border: "1px solid var(--border)", borderRadius: "3px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--carolina)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>Ask the AI Analyst</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)", fontStyle: "italic", marginBottom: "0.75rem" }}>Want a deeper take on this story? Ask below.</div>
                <button onClick={() => { setInput(`Tell me more about: ${openStory.headline}`); setOpenStory(null); setActiveTab("stories"); }}
                  style={{ background: "var(--carolina)", border: "none", color: "var(--navy)", padding: "0.5rem 1.25rem", fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>
                  Ask about this story →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
