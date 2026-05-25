import { useState, useEffect, useRef, useCallback } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0a1628; --navy-mid: #132040; --navy-light: #1e3060;
    --carolina: #4b9cd3; --carolina-light: #7bbde8;
    --red: #cc0000; --gold: #c8a84b; --white: #f5f2ec; --muted: #8fa3b8;
    --border: rgba(75,156,211,0.18);
    --font-display: 'Oswald', sans-serif;
    --font-body: 'Lora', serif;
    --font-mono: 'JetBrains Mono', monospace;
  }
  body { background: var(--navy); color: var(--white); font-family: var(--font-body); }
  .app { min-height: 100vh; background: var(--navy); }

  .nav { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 60px; background: var(--navy-mid); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
  .nav-logo { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.08em; color: var(--white); }
  .nav-logo span { color: var(--carolina); }
  .nav-tabs { display: flex; }
  .nav-tab { background: none; border: none; color: var(--muted); font-family: var(--font-display); font-size: 0.85rem; letter-spacing: 0.1em; padding: 0 1.25rem; height: 60px; cursor: pointer; border-bottom: 3px solid transparent; transition: color 0.2s, border-color 0.2s; text-transform: uppercase; }
  .nav-tab:hover { color: var(--white); }
  .nav-tab.active { color: var(--carolina); border-bottom-color: var(--carolina); }
  .nav-badge { background: var(--carolina); color: var(--navy); font-family: var(--font-mono); font-size: 0.6rem; padding: 2px 6px; border-radius: 2px; margin-left: 6px; font-weight: 500; }

  .hero { position: relative; padding: 3rem 2rem 2.5rem; border-bottom: 1px solid var(--border); overflow: hidden; }
  .hero::before { content: 'NC'; position: absolute; right: -1rem; top: -2rem; font-family: var(--font-display); font-size: 18rem; font-weight: 700; color: rgba(75,156,211,0.04); line-height: 1; pointer-events: none; letter-spacing: -0.05em; }
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

  .team-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .team-tab { font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.35rem 1rem; border: 1px solid var(--border); border-radius: 2px; background: none; color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .team-tab:hover { color: var(--white); border-color: rgba(75,156,211,0.4); }
  .team-tab.active { background: var(--carolina); color: var(--navy); border-color: var(--carolina); font-weight: 600; }
  .team-tab.hornets.active { background: #1d1160; border-color: #00788c; color: #00788c; }
  .team-tab.hurricanes.active { background: var(--red); border-color: var(--red); color: white; }
  .team-tab.panthers.active { background: #0085ca; border-color: #0085ca; color: white; }

  .stories-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  .story-card { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s; animation: fadeUp 0.4s ease both; }
  .story-card:hover { border-color: var(--carolina); transform: translateY(-2px); }
  .story-card.featured { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; }
  .story-img { background: var(--navy-light); height: 140px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .story-card.featured .story-img { height: auto; min-height: 200px; }
  .story-img-text { font-family: var(--font-display); font-size: 4rem; font-weight: 700; color: rgba(255,255,255,0.06); letter-spacing: -0.04em; user-select: none; }
  .story-team-badge { position: absolute; top: 10px; left: 10px; font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 2px; text-transform: uppercase; }
  .badge-hornets { background: rgba(0,120,140,0.2); color: #00a8bb; }
  .badge-hurricanes { background: rgba(204,0,0,0.2); color: #ff6666; }
  .badge-panthers { background: rgba(0,133,202,0.2); color: #0085ca; }
  .badge-analysis { background: rgba(200,168,75,0.2); color: var(--gold); }
  .story-body { padding: 1rem; }
  .story-type { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .story-headline { font-family: var(--font-display); font-size: 1.05rem; letter-spacing: 0.02em; line-height: 1.25; margin-bottom: 0.5rem; color: var(--white); text-transform: uppercase; }
  .story-card.featured .story-headline { font-size: 1.4rem; }
  .story-preview { font-size: 0.82rem; color: var(--muted); line-height: 1.5; font-style: italic; }
  .story-footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; border-top: 1px solid var(--border); font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); }
  .story-footer button { background: none; border: none; color: var(--carolina); font-family: var(--font-mono); font-size: 0.6rem; cursor: pointer; }

  .analytics-panel { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; padding: 1.25rem; margin-bottom: 1.5rem; animation: fadeUp 0.5s ease both; }
  .analytics-title { font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; color: var(--carolina); }
  .stat-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
  .stat-row-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; width: 110px; flex-shrink: 0; }
  .stat-bar-wrap { flex: 1; height: 6px; background: var(--navy-light); border-radius: 1px; }
  .stat-bar { height: 100%; border-radius: 1px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
  .bar-red { background: var(--red); }
  .bar-gold { background: var(--gold); }
  .bar-panthers { background: #0085ca; }
  .bar-hornets { background: #00788c; }
  .stat-val { font-family: var(--font-mono); font-size: 0.7rem; color: var(--white); width: 52px; text-align: right; flex-shrink: 0; }

  .score-card { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; padding: 1rem; margin-bottom: 0.75rem; animation: fadeUp 0.3s ease both; }
  .score-card.clickable { cursor: pointer; transition: border-color 0.2s; }
  .score-card.clickable:hover { border-color: var(--carolina); }
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

  /* BOX SCORE */
  .box-overlay { position: fixed; inset: 0; background: rgba(10,22,40,0.97); z-index: 300; overflow-y: auto; padding: 2rem; animation: fadeIn 0.2s ease; }
  .box-inner { max-width: 800px; margin: 0 auto; }
  .box-back { background: none; border: none; color: var(--carolina); font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.4rem; }
  .box-score-header { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
  .box-team { display: flex; flex-direction: column; }
  .box-team.away { align-items: flex-start; }
  .box-team.home { align-items: flex-end; }
  .box-team-name { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 0.04em; text-transform: uppercase; }
  .box-score { font-family: var(--font-display); font-size: 3rem; letter-spacing: 0.04em; color: var(--white); text-align: center; }
  .box-meta { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); text-align: center; }
  .box-table-wrap { margin-bottom: 2rem; }
  .box-table-title { font-family: var(--font-display); font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--carolina); margin-bottom: 0.75rem; }
  .box-table { width: 100%; border-collapse: collapse; }
  .box-table th { font-family: var(--font-mono); font-size: 0.58rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; padding: 0 0.5rem 0.5rem 0; text-align: left; border-bottom: 1px solid var(--border); }
  .box-table th:not(:first-child) { text-align: right; }
  .box-table td { padding: 0.5rem 0.5rem 0.5rem 0; font-size: 0.8rem; border-bottom: 1px solid rgba(75,156,211,0.06); vertical-align: middle; }
  .box-table td:not(:first-child) { font-family: var(--font-mono); font-size: 0.72rem; text-align: right; color: var(--muted); }
  .box-table td:first-child { color: var(--white); }
  .box-player-name { font-family: var(--font-body); font-size: 0.82rem; }
  .box-player-pos { font-family: var(--font-mono); font-size: 0.58rem; color: var(--muted); }
  .box-stat-highlight { color: var(--white) !important; font-weight: 500; }
  .box-period-scores { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .box-period { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 2px; padding: 0.5rem 0.75rem; text-align: center; min-width: 60px; }
  .box-period-label { font-family: var(--font-mono); font-size: 0.55rem; color: var(--muted); text-transform: uppercase; margin-bottom: 4px; }
  .box-period-scores-row { font-family: var(--font-display); font-size: 1rem; color: var(--white); }

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
  .detail-stat-block { background: var(--navy-mid); border: 1px solid var(--border); border-radius: 3px; padding: 1.25rem; margin: 1.5rem 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .detail-stat-item { text-align: center; }
  .detail-stat-val { font-family: var(--font-display); font-size: 2rem; color: var(--carolina); letter-spacing: 0.02em; }
  .detail-stat-lbl { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

  .loading-pulse { opacity: 0.4; animation: pulse 1.5s infinite; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--navy-light); border-radius: 2px; }
`;

const TEAMS = [
  { id: "hornets",    label: "Hornets",    sport: "NBA", color: "hornets" },
  { id: "hurricanes", label: "Hurricanes", sport: "NHL", color: "hurricanes" },
  { id: "panthers",   label: "Panthers",   sport: "NFL", color: "panthers" },
];

// Fallback static data — used when APIs are unavailable
const FALLBACK_STORIES = {
  hornets: [
    {
      id: 1, featured: true,
      type: "Season Recap", badge: "badge-hornets", team: "Hornets",
      headline: "From 4-14 to 44-38: Charlotte's Remarkable Turnaround",
      preview: "The Hornets went from lottery bound to play-in contenders. The analytics behind one of the NBA's best second-half stories.",
      img: "HORNETS",
      body: `The 2025-26 Charlotte Hornets season will be remembered as the year the rebuild turned the corner. Starting 4-14 through late November, the analytics suggested a lottery pick was coming — again. Then something shifted.\n\nBetween January and February, Charlotte reeled off nine consecutive wins, their longest streak in the franchise's current incarnation. The offensive rating during that stretch was elite — north of 119 — powered by LaMelo Ball's playmaking at peak efficiency and Brandon Miller's emergence as a genuine second option.\n\nThe final record of 44-38 marked their first winning season since 2021-22. More telling: their offensive rating of 119.4 ranked 5th in the entire NBA, and their net rating of +5.0 ranked 8th.\n\nThey made the play-in tournament and knocked out Miami in overtime before falling short of the full playoffs. The foundation is real.`,
      statBlock: [{ val: "44-38", lbl: "Final Record" }, { val: "119.4", lbl: "Off. Rating" }, { val: "+5.0", lbl: "Net Rating" }],
      date: "May 22, 2026",
    },
  ],
  hurricanes: [
    {
      id: 2, featured: true,
      type: "Playoff Breakdown", badge: "badge-hurricanes", team: "Hurricanes",
      headline: "8-1 and Hunting: The Canes' Path to the Cup",
      preview: "Carolina swept Ottawa and Philly before dropping Game 1 to Montreal. The analytics of a team built to win now.",
      img: "CANES",
      body: `The Carolina Hurricanes entered the 2026 Stanley Cup Playoffs as the top seed in the Eastern Conference and proceeded to prove it — sweeping Ottawa and Philadelphia in back-to-back series before facing their first real test against the Montreal Canadiens.\n\nGame 1 of the ECF was a 6-2 loss, with Montreal's speed exposing an 11-day layoff that left the Canes flat in the first period. Four goals in the opening frame decided it before Carolina could find their legs.\n\nThe analytics still favor Carolina. Their expected goals percentage over the full playoff run sits above 54%, meaning they're generating higher-quality chances than opponents even when the scoreboard disagrees.\n\nGame 2 was a 3-2 OT win on a Nikolaj Ehlers goal. Series tied 1-1.`,
      statBlock: [{ val: "9-1", lbl: "Playoff Record" }, { val: "54.2%", lbl: "xG%" }, { val: "ECF", lbl: "Current Round" }],
      date: "May 24, 2026",
    },
  ],
  panthers: [
    {
      id: 3, featured: true,
      type: "Season Preview", badge: "badge-panthers", team: "Panthers",
      headline: "Bryce Young's $240M Question: 2026 Is Put Up or Shut Up",
      preview: "After a career year and a Wild Card appearance, Young enters 2026 with his fifth-year option secured and everything to prove.",
      img: "PANTHERS",
      body: `Bryce Young's redemption arc is one of the better stories in recent NFL history. Benched midway through 2024 after historically poor efficiency numbers, he returned to lead Carolina on a run that included 12 fourth-quarter or overtime game-winning drives.\n\nThe 2025 final line: 3,011 yards, 23 touchdowns, a 63.6 completion percentage. Not elite numbers by modern NFL standards, but a genuine leap from a player who looked finished just 18 months earlier.\n\nGeneral Manager Dan Morgan spent the offseason building around him. Monroe Freeling arrives as a potential franchise left tackle. The schedule is brutal — Philadelphia, Seattle, Green Bay, and Baltimore all appear on the 2026 calendar.\n\nThis is the year the question gets answered.`,
      statBlock: [{ val: "3,011", lbl: "Pass Yards" }, { val: "23", lbl: "Touchdowns" }, { val: "12", lbl: "Game-Winners" }],
      date: "May 23, 2026",
    },
  ],
};

const FALLBACK_LEADERS = {
  hornets: [
    { name: "LaMelo Ball", sub: "PG · PPG Leader", val: "30.1 PPG" },
    { name: "Brandon Miller", sub: "SF · Scorer", val: "20.7 PPG" },
    { name: "Mark Williams", sub: "C · Boards", val: "13.2 RPG" },
  ],
  hurricanes: [
    { name: "Sebastian Aho", sub: "C · #20", val: "38 G" },
    { name: "Andrei Svechnikov", sub: "RW · #37", val: "52 A" },
    { name: "Frederik Andersen", sub: "G", val: ".918 SV%" },
  ],
  panthers: [
    { name: "Bryce Young", sub: "QB", val: "23 TD" },
    { name: "Tetairoa McMillan", sub: "WR", val: "1,104 YDS" },
    { name: "Derrick Brown", sub: "DT", val: "9.5 TFL" },
  ],
};

const SYSTEM_PROMPT = `You are an expert North Carolina sports analyst covering the Charlotte Hornets (NBA), Carolina Hurricanes (NHL), and Carolina Panthers (NFL). You provide sharp, analytically-driven insights using advanced metrics naturally (eFG%, xG, net rating, DVOA, expected goals, etc.) and have strong opinions. Keep responses to 2-4 sentences — punchy and authoritative. Current context: The Hurricanes are in the 2026 ECF vs Montreal, series tied 1-1 after Canes won Game 2 in OT. The Hornets finished 44-38 and made the play-in. The Panthers are preparing for the 2026 NFL season with Bryce Young on his fifth-year option.`;

const IDLE_TIMEOUT = 30 * 60 * 1000;
const isGameTime = () => { const h = new Date().getHours(); return h >= 17 && h < 24; };

// ── BOX SCORE COMPONENTS ──

function NHLBoxScore({ game, onClose }) {
  const goals = game.goals || [];
  const periods = [1, 2, 3];
  if (game.period > 3) periods.push(game.period);

  const getPeriodGoals = (team, period) =>
    goals.filter(g => g.teamAbbrev === team && g.period === period).length;

  const awayTotal = game.awayTeam?.score ?? 0;
  const homeTotal = game.homeTeam?.score ?? 0;

  return (
    <div className="box-overlay">
      <div className="box-inner">
        <button className="box-back" onClick={onClose}>← Back to scores</button>
        <div className="box-score-header">
          <div className="box-team away">
            <div className="box-team-name" style={{ color: "#00a8bb" }}>{game.awayTeam?.abbrev}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>{game.awayTeam?.name?.default}</div>
          </div>
          <div>
            <div className="box-score">{awayTotal} — {homeTotal}</div>
            <div className="box-meta">{game.period > 3 ? "FINAL/OT" : "FINAL"} · {game.gameDate}</div>
          </div>
          <div className="box-team home">
            <div className="box-team-name" style={{ color: "var(--red)" }}>{game.homeTeam?.abbrev}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>{game.homeTeam?.name?.default}</div>
          </div>
        </div>

        {/* Period scores */}
        <div className="box-period-scores">
          {periods.map(p => (
            <div className="box-period" key={p}>
              <div className="box-period-label">{p > 3 ? "OT" : `P${p}`}</div>
              <div className="box-period-scores-row">
                {getPeriodGoals(game.awayTeam?.abbrev, p)} — {getPeriodGoals(game.homeTeam?.abbrev, p)}
              </div>
            </div>
          ))}
          <div className="box-period">
            <div className="box-period-label">TOT</div>
            <div className="box-period-scores-row">{awayTotal} — {homeTotal}</div>
          </div>
        </div>

        {/* Goal log */}
        <div className="box-table-wrap">
          <div className="box-table-title">Goal Log</div>
          <table className="box-table">
            <thead>
              <tr>
                <th>Scorer</th>
                <th>Team</th>
                <th>Period</th>
                <th>Time</th>
                <th>Assists</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((g, i) => (
                <tr key={i}>
                  <td><div className="box-player-name">{g.name?.default}</div></td>
                  <td><span style={{ color: g.teamAbbrev === "CAR" ? "var(--red)" : "var(--muted)" }}>{g.teamAbbrev}</span></td>
                  <td>{g.period > 3 ? "OT" : `P${g.period}`}</td>
                  <td>{g.timeInPeriod}</td>
                  <td style={{ fontSize: "0.65rem" }}>{g.assists?.map(a => a.name?.default).join(", ") || "Unassisted"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shots */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="analytics-panel">
            <div className="analytics-title">{game.awayTeam?.abbrev} Stats</div>
            <div className="stat-row"><div className="stat-row-label">Shots</div><div className="stat-val">{game.awayTeam?.sog ?? "—"}</div></div>
          </div>
          <div className="analytics-panel">
            <div className="analytics-title">{game.homeTeam?.abbrev} Stats</div>
            <div className="stat-row"><div className="stat-row-label">Shots</div><div className="stat-val">{game.homeTeam?.sog ?? "—"}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NBABoxScore({ game, onClose }) {
  const awayPlayers = game.playerStats?.away || [];
  const homePlayers = game.playerStats?.home || [];

  const StatTable = ({ players, teamName }) => (
    <div className="box-table-wrap">
      <div className="box-table-title">{teamName}</div>
      <table className="box-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>PTS</th>
            <th>REB</th>
            <th>AST</th>
            <th>STL</th>
            <th>BLK</th>
            <th>FG</th>
            <th>MIN</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i}>
              <td>
                <div className="box-player-name">{p.name}</div>
                <div className="box-player-pos">{p.pos}</div>
              </td>
              <td className={p.pts >= 20 ? "box-stat-highlight" : ""}>{p.pts ?? "—"}</td>
              <td className={p.reb >= 10 ? "box-stat-highlight" : ""}>{p.reb ?? "—"}</td>
              <td className={p.ast >= 8 ? "box-stat-highlight" : ""}>{p.ast ?? "—"}</td>
              <td>{p.stl ?? "—"}</td>
              <td>{p.blk ?? "—"}</td>
              <td>{p.fgm !== undefined ? `${p.fgm}-${p.fga}` : "—"}</td>
              <td>{p.min ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="box-overlay">
      <div className="box-inner">
        <button className="box-back" onClick={onClose}>← Back to scores</button>
        <div className="box-score-header">
          <div className="box-team away">
            <div className="box-team-name">{game.away}</div>
          </div>
          <div>
            <div className="box-score">{game.awayScore} — {game.homeScore}</div>
            <div className="box-meta">FINAL · {game.gameDate}</div>
          </div>
          <div className="box-team home">
            <div className="box-team-name" style={{ color: "#00788c" }}>{game.home}</div>
          </div>
        </div>
        {awayPlayers.length > 0 ? (
          <>
            <StatTable players={awayPlayers} teamName={game.away} />
            <StatTable players={homePlayers} teamName={game.home} />
          </>
        ) : (
          <div style={{ color: "var(--muted)", fontStyle: "italic", padding: "2rem 0" }}>
            Detailed box score not available for this game.
          </div>
        )}
      </div>
    </div>
  );
}

function NFLBoxScore({ game, onClose }) {
  const awayPlayers = game.playerStats?.away || [];
  const homePlayers = game.playerStats?.home || [];

  const PassTable = ({ players, teamName }) => {
    const passers = players.filter(p => p.passYds !== undefined);
    const rushers = players.filter(p => p.rushYds !== undefined);
    const receivers = players.filter(p => p.recYds !== undefined);
    return (
      <div className="box-table-wrap">
        <div className="box-table-title">{teamName}</div>
        {passers.length > 0 && (
          <table className="box-table" style={{ marginBottom: "1rem" }}>
            <thead><tr><th>Passing</th><th>CMP</th><th>ATT</th><th>YDS</th><th>TD</th><th>INT</th></tr></thead>
            <tbody>
              {passers.map((p, i) => (
                <tr key={i}>
                  <td><div className="box-player-name">{p.name}</div></td>
                  <td>{p.passCmp ?? "—"}</td>
                  <td>{p.passAtt ?? "—"}</td>
                  <td className={p.passYds >= 250 ? "box-stat-highlight" : ""}>{p.passYds ?? "—"}</td>
                  <td>{p.passTD ?? "—"}</td>
                  <td>{p.passInt ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {rushers.length > 0 && (
          <table className="box-table" style={{ marginBottom: "1rem" }}>
            <thead><tr><th>Rushing</th><th>CAR</th><th>YDS</th><th>TD</th><th>YPC</th></tr></thead>
            <tbody>
              {rushers.map((p, i) => (
                <tr key={i}>
                  <td><div className="box-player-name">{p.name}</div></td>
                  <td>{p.rushCarries ?? "—"}</td>
                  <td className={p.rushYds >= 100 ? "box-stat-highlight" : ""}>{p.rushYds ?? "—"}</td>
                  <td>{p.rushTD ?? "—"}</td>
                  <td>{p.rushCarries ? (p.rushYds / p.rushCarries).toFixed(1) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {receivers.length > 0 && (
          <table className="box-table">
            <thead><tr><th>Receiving</th><th>REC</th><th>TGT</th><th>YDS</th><th>TD</th></tr></thead>
            <tbody>
              {receivers.map((p, i) => (
                <tr key={i}>
                  <td><div className="box-player-name">{p.name}</div></td>
                  <td>{p.rec ?? "—"}</td>
                  <td>{p.targets ?? "—"}</td>
                  <td className={p.recYds >= 80 ? "box-stat-highlight" : ""}>{p.recYds ?? "—"}</td>
                  <td>{p.recTD ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {passers.length === 0 && rushers.length === 0 && receivers.length === 0 && (
          <div style={{ color: "var(--muted)", fontStyle: "italic", fontSize: "0.82rem" }}>No player stats available.</div>
        )}
      </div>
    );
  };

  return (
    <div className="box-overlay">
      <div className="box-inner">
        <button className="box-back" onClick={onClose}>← Back to scores</button>
        <div className="box-score-header">
          <div className="box-team away">
            <div className="box-team-name" style={{ color: game.away === "CAR" ? "#0085ca" : "var(--white)" }}>{game.away}</div>
          </div>
          <div>
            <div className="box-score">{game.awayScore} — {game.homeScore}</div>
            <div className="box-meta">FINAL · {game.gameDate || ""}</div>
          </div>
          <div className="box-team home">
            <div className="box-team-name" style={{ color: game.home === "CAR" ? "#0085ca" : "var(--white)" }}>{game.home}</div>
          </div>
        </div>
        <PassTable players={awayPlayers} teamName={game.away} />
        <PassTable players={homePlayers} teamName={game.home} />
      </div>
    </div>
  );
}

// ── MAIN APP ──
export default function NCSportsHub() {
  const [activeTeam, setActiveTeam] = useState("hurricanes");
  const [activeTab, setActiveTab] = useState("stories");
  const [openStory, setOpenStory] = useState(null);
  const [boxScore, setBoxScore] = useState(null);
  const [boxScoreType, setBoxScoreType] = useState(null);

  // Live data state
  const [liveScores, setLiveScores] = useState({});
  const [playoffRounds, setPlayoffRounds] = useState([]);
  const [recentGames, setRecentGames] = useState({});
  const [apiLeaders, setApiLeaders] = useState({});
  const [teamStats, setTeamStats] = useState({});
  const [notionStories, setNotionStories] = useState({});
  const [storiesLoaded, setStoriesLoaded] = useState(false);

  // UI state
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ask me anything about the Hornets, Hurricanes, or Panthers — analytics, matchups, predictions. I'm here." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const msgEndRef = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      const [nhl, nba, nfl, stories] = await Promise.all([
        fetch("/api/nhl").then(r => r.json()).catch(() => ({})),
        fetch("/api/nba").then(r => r.json()).catch(() => ({})),
        fetch("/api/nfl").then(r => r.json()).catch(() => ({})),
        fetch("/api/stories").then(r => r.json()).catch(() => ({})),
      ]);

      // NHL
      if (nhl.rounds?.length) setPlayoffRounds(nhl.rounds);
      if (nhl.liveGame) {
        const g = nhl.liveGame;
        setLiveScores(prev => ({ ...prev, hurricanes: {
          away: g.awayTeam?.abbrev, awayScore: g.awayTeam?.score,
          home: g.homeTeam?.abbrev, homeScore: g.homeTeam?.score,
          period: (g.gameState === "FINAL" || g.gameState === "OFF") ?
                  (g.gameOutcome?.lastPeriodType === "OT" ? "FINAL/OT" : "FINAL") :
                  g.gameState === "LIVE" || g.gameState === "CRIT" ? "LIVE" :
                  `P${g.periodDescriptor?.number} ${g.clock?.timeRemaining || ""}`,
          live: g.gameState === "LIVE" || g.gameState === "CRIT",
          raw: g,
        }}));
      }

      // NBA
      if (nba.liveGame) {
        const g = nba.liveGame;
        setLiveScores(prev => ({ ...prev, hornets: {
          away: g.away, awayScore: g.awayPts,
          home: g.home, homeScore: g.homePts,
          period: g.gameStatus || g.gameClock || "LIVE",
          live: g.gameStatus === "Live",
          raw: g,
        }}));
      }
      if (nba.recentGames) setRecentGames(prev => ({ ...prev, hornets: nba.recentGames }));
      if (nba.leaders) setApiLeaders(prev => ({ ...prev, hornets: nba.leaders }));
      if (nba.stats) setTeamStats(prev => ({ ...prev, hornets: nba.stats }));

      // NFL
      if (nfl.liveGame) {
        const g = nfl.liveGame;
        setLiveScores(prev => ({ ...prev, panthers: {
          away: g.away, awayScore: g.awayPts,
          home: g.home, homeScore: g.homePts,
          period: g.gameStatus || g.gameClock || "LIVE",
          live: g.gameStatus === "Live",
          raw: g,
        }}));
      }
      if (nfl.recentGames) setRecentGames(prev => ({ ...prev, panthers: nfl.recentGames }));
      if (nfl.leaders) setApiLeaders(prev => ({ ...prev, panthers: nfl.leaders }));
      if (nfl.stats) setTeamStats(prev => ({ ...prev, panthers: nfl.stats }));

      // Stories from Notion
      if (stories.stories?.length) {
        const grouped = {};
        stories.stories.forEach(s => {
          const team = s.team.toLowerCase();
          if (!grouped[team]) grouped[team] = [];
          grouped[team].push(s);
        });
        setNotionStories(grouped);
        setStoriesLoaded(true);
      }
    } catch(e) { console.error("Fetch error:", e); }
  }, []);

  useEffect(() => {
    let interval = null;
    let idleTimer = null;
    let isIdle = false;
    const resetIdle = () => { isIdle = false; clearTimeout(idleTimer); idleTimer = setTimeout(() => { isIdle = true; }, IDLE_TIMEOUT); };
    const poll = () => { if (document.hidden || isIdle || !isGameTime()) return; fetchAll(); };
    const handleVisibility = () => { if (!document.hidden && !isIdle && isGameTime()) fetchAll(); };
    fetchAll();
    resetIdle();
    interval = setInterval(poll, 30000);
    document.addEventListener("visibilitychange", handleVisibility);
    ["mousemove","keydown","click","scroll"].forEach(e => document.addEventListener(e, resetIdle));
    return () => {
      clearInterval(interval); clearTimeout(idleTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      ["mousemove","keydown","click","scroll"].forEach(e => document.removeEventListener(e, resetIdle));
    };
  }, [fetchAll]);

  useEffect(() => { setBarsVisible(false); setTimeout(() => setBarsVisible(true), 100); }, [activeTeam]);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

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
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Couldn't get a response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection issue." }]);
    }
    setLoading(false);
  };

  const openBoxScore = (game, type) => { setBoxScore(game); setBoxScoreType(type); };
  const closeBoxScore = () => { setBoxScore(null); setBoxScoreType(null); };

  const stories = (storiesLoaded && notionStories[activeTeam]?.length)
    ? notionStories[activeTeam]
    : FALLBACK_STORIES[activeTeam] || [];
  const leaders = apiLeaders[activeTeam] || FALLBACK_LEADERS[activeTeam] || [];
  const liveGame = liveScores[activeTeam];
  const featured = stories.find(s => s.featured);
  const rest = stories.filter(s => !s.featured);

  // Build analytics stats from API data
  const getAnalyticsStats = () => {
    if (activeTeam === "hornets") {
      const s = teamStats.hornets || {};
      return [
        { label: "Off. Rating", val: s.offRating ? s.offRating.toFixed(1) : "119.4", bar: Math.min(95, ((s.offRating || 119.4) - 100) * 2.5), cls: "bar-hornets" },
        { label: "Def. Rating", val: s.defRating ? s.defRating.toFixed(1) : "114.4", bar: Math.min(95, Math.max(10, 95 - ((s.defRating || 114.4) - 100) * 2.5)), cls: "bar-gold" },
        { label: "Net Rating", val: s.netRating ? (s.netRating > 0 ? "+" : "") + s.netRating.toFixed(1) : "+5.0", bar: Math.min(95, 50 + (s.netRating || 5) * 4), cls: "bar-hornets" },
        { label: "eFG%", val: s.efg ? (s.efg * 100).toFixed(1) + "%" : "54.2%", bar: Math.min(95, (s.efg || 0.542) * 150), cls: "bar-gold" },
        { label: "Pace", val: s.pace ? s.pace.toFixed(1) : "100.2", bar: Math.min(95, ((s.pace || 100) - 95) * 8), cls: "bar-hornets" },
      ];
    }
    if (activeTeam === "hurricanes") {
      const s = teamStats.hurricanes || {};
      return [
        { label: "xG%", val: "54.2%", bar: 72, cls: "bar-red" },
        { label: "Power Play%", val: s.pp ? (s.pp * 100).toFixed(1) + "%" : "23.8%", bar: Math.min(95, (s.pp || 0.238) * 350), cls: "bar-red" },
        { label: "Penalty Kill%", val: s.pk ? (s.pk * 100).toFixed(1) + "%" : "83.4%", bar: Math.min(95, (s.pk || 0.834) * 110), cls: "bar-gold" },
        { label: "Goals For/G", val: s.goalsForPerGame ? s.goalsForPerGame.toFixed(2) : "3.41", bar: Math.min(95, (s.goalsForPerGame || 3.41) * 20), cls: "bar-red" },
        { label: "Goals Ag/G", val: s.goalsAgainstPerGame ? s.goalsAgainstPerGame.toFixed(2) : "2.75", bar: Math.min(95, Math.max(5, 95 - (s.goalsAgainstPerGame || 2.75) * 20)), cls: "bar-gold" },
      ];
    }
    if (activeTeam === "panthers") {
      const s = teamStats.panthers || {};
      return [
        { label: "Pts Per Game", val: s.ppg ? s.ppg.toFixed(1) : "22.4", bar: Math.min(95, (s.ppg || 22.4) * 2.8), cls: "bar-panthers" },
        { label: "Pass Yds/G", val: s.passYds ? s.passYds.toFixed(0) : "218", bar: Math.min(95, (s.passYds || 218) / 3.5), cls: "bar-panthers" },
        { label: "Rush Yds/G", val: s.rushYds ? s.rushYds.toFixed(0) : "112", bar: Math.min(95, (s.rushYds || 112) / 1.6), cls: "bar-gold" },
        { label: "Opp Pts/G", val: s.oppPpg ? s.oppPpg.toFixed(1) : "21.1", bar: Math.min(95, Math.max(5, 95 - (s.oppPpg || 21.1) * 2.8)), cls: "bar-panthers" },
        { label: "3rd Down%", val: s.thirdDown ? (s.thirdDown * 100).toFixed(1) + "%" : "38.4%", bar: Math.min(95, (s.thirdDown || 0.384) * 200), cls: "bar-gold" },
      ];
    }
    return [];
  };

  // Score card component
  const ScoreCard = ({ game, type, isLive }) => {
    const isFinished = game.period?.includes("FINAL") || game.period === "OFF";
    const canClick = isFinished && game.raw;
    return (
      <div
        className={`score-card ${canClick ? "clickable" : ""}`}
        style={{ borderColor: isLive ? "var(--red)" : undefined }}
        onClick={() => canClick && openBoxScore(game.raw, type)}
      >
        <div className="score-card-header">
          <span>{type?.toUpperCase()} {isFinished ? "· FINAL" : "· UPCOMING"}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {isLive && <span className="score-live">Live</span>}
            {isFinished && canClick && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--carolina)" }}>tap for box score</span>}
            <span>{game.period}</span>
          </div>
        </div>
        <div className="score-matchup">
          <div className="score-team away">
            <div className="score-team-name">{game.away}</div>
            {game.awayRec && <div className="score-record">{game.awayRec}</div>}
          </div>
          <div className="score-center">
            {game.awayScore != null
              ? <div className="score-nums">{game.awayScore} — {game.homeScore}</div>
              : <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>vs</div>}
            <div className="score-period">{game.period}</div>
          </div>
          <div className="score-team home">
            <div className="score-team-name">{game.home}</div>
            {game.homeRec && <div className="score-record">{game.homeRec}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">

        {/* BOX SCORE OVERLAYS */}
        {boxScore && boxScoreType === "nhl" && <NHLBoxScore game={boxScore} onClose={closeBoxScore} />}
        {boxScore && boxScoreType === "nba" && <NBABoxScore game={boxScore} onClose={closeBoxScore} />}
        {boxScore && boxScoreType === "nfl" && <NFLBoxScore game={boxScore} onClose={closeBoxScore} />}

        <nav className="nav">
          <div className="nav-logo">THE <span>CAROLINA</span> WIRE</div>
          <div className="nav-tabs">
            {["stories","analytics","scores"].map(t => (
              <button key={t} className={`nav-tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>
                {t}{t==="scores"&&<span className="nav-badge">LIVE</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="hero">
          <div className="hero-label">// North Carolina Sports Analytics</div>
          <h1 className="hero-title">Your State.<br /><em>Your Stats.</em><br />Your Story.</h1>
          <p className="hero-sub">Deep analytics, sharp storytelling, and AI-powered breakdowns for every pro team in the Tar Heel State.</p>
          <div className="hero-stats">
            {[["3","Pro Teams"],["2026","Season"],["Real-Time","AI Analysis"],["Advanced","Metrics"]].map(([v,l]) => (
              <div key={l}><div className="hero-stat-val">{v}</div><div className="hero-stat-label">{l}</div></div>
            ))}
          </div>
        </div>

        <div style={{ padding:"1rem 2rem 0", borderBottom:"1px solid var(--border)", background:"var(--navy-mid)" }}>
          <div className="team-tabs">
            {TEAMS.map(t => (
              <button key={t.id} className={`team-tab ${t.color} ${activeTeam===t.id?"active":""}`} onClick={() => setActiveTeam(t.id)}>
                {t.label}<span style={{ fontSize:"0.55rem", marginLeft:"4px", opacity:0.7 }}>{t.sport}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="main-grid">
          <div className="main-content">

            {/* ── STORIES ── */}
            {activeTab==="stories" && (
              <>
                <div className="section-header">
                  <div className="section-title">Latest Stories</div>
                  <button className="section-more">All stories →</button>
                </div>
                <div className="stories-grid">
                  {featured && (
                    <div className="story-card featured" onClick={() => setOpenStory(featured)}>
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
                        <div className="story-footer"><span>{featured.date}</span><button>Read analysis →</button></div>
                      </div>
                    </div>
                  )}
                  {rest.map(s => (
                    <div className="story-card" key={s.id} onClick={() => setOpenStory(s)}>
                      <div className="story-img" style={{ height:"120px" }}>
                        <div className="story-img-text">{s.img}</div>
                        <span className={`story-team-badge ${s.badge}`}>{s.team}</span>
                      </div>
                      <div className="story-body">
                        <div className="story-type">{s.type}</div>
                        <div className="story-headline">{s.headline}</div>
                        <div className="story-preview">{s.preview}</div>
                      </div>
                      <div className="story-footer"><span>{s.date}</span><button>Read →</button></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── ANALYTICS ── */}
            {activeTab==="analytics" && (
              <>
                <div className="section-header"><div className="section-title">Analytics Dashboard</div></div>
                <div className="analytics-panel">
                  <div className="analytics-title">
                    {TEAMS.find(t=>t.id===activeTeam)?.label} — Key Metrics
                    {Object.keys(teamStats).length === 0 && <span className="loading-pulse" style={{ marginLeft: "0.5rem", fontSize: "0.6rem" }}>loading...</span>}
                  </div>
                  {getAnalyticsStats().map((s,i) => (
                    <div className="stat-row" key={i}>
                      <div className="stat-row-label">{s.label}</div>
                      <div className="stat-bar-wrap"><div className={`stat-bar ${s.cls}`} style={{ width:barsVisible?`${s.bar}%`:"0%" }} /></div>
                      <div className="stat-val">{s.val}</div>
                    </div>
                  ))}
                </div>

                {featured && (
                  <div className="analytics-panel" style={{ cursor:"pointer" }} onClick={() => { setOpenStory(featured); setActiveTab("stories"); }}>
                    <div className="analytics-title">Featured Analysis</div>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:"1.1rem", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"0.75rem" }}>{featured.headline}</div>
                    <div style={{ fontSize:"0.85rem", color:"var(--muted)", fontStyle:"italic", lineHeight:1.6, marginBottom:"1rem" }}>{featured.preview}</div>
                    <button style={{ background:"var(--carolina)", border:"none", color:"var(--navy)", padding:"0.5rem 1.25rem", fontFamily:"var(--font-display)", fontSize:"0.8rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Full Breakdown →</button>
                  </div>
                )}
                {rest.map(s => (
                  <div className="analytics-panel" key={s.id} style={{ cursor:"pointer" }} onClick={() => { setOpenStory(s); setActiveTab("stories"); }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"0.4rem" }}>{s.type}</div>
                        <div style={{ fontFamily:"var(--font-display)", fontSize:"0.95rem", textTransform:"uppercase", letterSpacing:"0.04em" }}>{s.headline}</div>
                      </div>
                      <span style={{ color:"var(--carolina)", fontFamily:"var(--font-mono)", fontSize:"0.7rem" }}>→</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── SCORES ── */}
            {activeTab==="scores" && (
              <>
                {activeTeam==="hurricanes" ? (
                  <>
                    <div className="section-header">
                      <div className="section-title">2026 Stanley Cup Playoffs</div>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"var(--carolina)" }}>
                        {playoffRounds.flatMap(r=>r.games).filter(g=>g.win===true).length}-{playoffRounds.flatMap(r=>r.games).filter(g=>g.win===false).length} Overall
                      </span>
                    </div>

                    {/* Live game banner */}
                    {liveGame && liveGame.live && (
                      <ScoreCard game={liveGame} type="nhl" isLive={true} />
                    )}

                    {playoffRounds.map((round, ri) => (
                      <div key={ri} style={{ marginBottom:"1.75rem" }}>
                        <div className="round-header" style={{ color: round.games.filter(g=>g.win===true).length === 4 ? "var(--carolina)" : "var(--gold)" }}>
                          <span>{round.name} · vs {round.opponent}</span>
                          <span style={{ color: round.games.filter(g=>g.win===true).length === 4 ? "#4caf50" : round.games.filter(g=>g.win===false).length === 4 ? "var(--red)" : "var(--gold)" }}>
                            CAR {round.games.filter(g=>g.win===true).length}-{round.games.filter(g=>g.win===false).length}
                          </span>
                        </div>
                        {round.games.map((g,gi) => (
                          <div
                            key={gi}
                            className={`score-card ${g.win !== null ? "clickable" : ""}`}
                            style={{ animationDelay:`${gi*0.06}s`, opacity:g.homeScore===null?0.5:1 }}
                            onClick={() => g.win !== null && openBoxScore(g, "nhl")}
                          >
                            <div className="score-card-header">
                              <span>Game {g.seriesGameNumber || gi+1}</span>
                              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                                {g.win===true&&<span style={{ color:"#4caf50" }}>W</span>}
                                {g.win===false&&<span style={{ color:"var(--red)" }}>L</span>}
                                {g.win===null&&<span style={{ color:"var(--muted)" }}>upcoming</span>}
                                {g.win !== null && <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", color:"var(--carolina)" }}>tap for box score</span>}
                              </div>
                            </div>
                            <div className="score-matchup">
                              <div className="score-team away"><div className="score-team-name">{g.away}</div></div>
                              <div className="score-center">
                                {g.homeScore!==null
                                  ?<div className="score-nums">{g.awayScore} — {g.homeScore}</div>
                                  :<div style={{ fontFamily:"var(--font-mono)", fontSize:"0.7rem", color:"var(--muted)" }}>vs</div>}
                                <div className="score-period">{g.period}</div>
                              </div>
                              <div className="score-team home"><div className="score-team-name">{g.home}</div></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="section-header"><div className="section-title">Scores & Schedule</div></div>

                    {/* Live game */}
                    {liveGame && liveGame.live && (
                      <ScoreCard game={liveGame} type={activeTeam === "hornets" ? "nba" : "nfl"} isLive={true} />
                    )}

                    {/* Recent games from API */}
                    {(recentGames[activeTeam] || []).map((g,i) => (
                      <ScoreCard key={i} game={g} type={activeTeam === "hornets" ? "nba" : "nfl"} isLive={false} />
                    ))}

                    {/* Show message if no games */}
                    {!liveGame && !recentGames[activeTeam]?.length && (
                      <div style={{ color:"var(--muted)", fontStyle:"italic", padding:"2rem 0" }}>No recent games on record.</div>
                    )}
                  </>
                )}

                <div className="section-header" style={{ marginTop:"1.5rem" }}>
                  <div className="section-title">Stat Leaders</div>
                </div>
                {leaders.map((l,i) => (
                  <div className="quick-stat" key={i}>
                    <div><div className="quick-stat-name">{l.name}</div><div className="quick-stat-sub">{l.sub}</div></div>
                    <div className="quick-stat-num">{l.val}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="sidebar">
            <div className="section-header"><div className="section-title">AI Analyst</div></div>
            <div className="ai-panel">
              <div className="ai-header">
                <div className="ai-dot" />
                <div className="ai-header-text">Ask anything about NC sports</div>
              </div>
              <div className="ai-messages">
                {messages.map((m,i) => <div key={i} className={`ai-msg ${m.role}`}>{m.content}</div>)}
                {loading&&<div className="ai-loading"><span/><span/><span/></div>}
                <div ref={msgEndRef} />
              </div>
              <div className="ai-input-wrap">
                <input className="ai-input" value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&sendMessage()}
                  placeholder="Ask about stats, matchups, predictions..." disabled={loading} />
                <button className="ai-send" onClick={sendMessage} disabled={loading||!input.trim()}>Ask</button>
              </div>
            </div>

            <div className="section-header" style={{ marginTop:"1.5rem" }}>
              <div className="section-title">Stat Leaders</div>
            </div>
            <div style={{ background:"var(--navy-mid)", border:"1px solid var(--border)", borderRadius:"3px", padding:"0.75rem 1rem", marginBottom:"1.5rem" }}>
              {leaders.map((l,i) => (
                <div className="quick-stat" key={i}>
                  <div><div className="quick-stat-name" style={{ fontSize:"0.78rem" }}>{l.name}</div><div className="quick-stat-sub">{l.sub}</div></div>
                  <div className="quick-stat-num" style={{ fontSize:"0.95rem" }}>{l.val}</div>
                </div>
              ))}
            </div>

            <div className="section-header"><div className="section-title">Quick Takes</div></div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {[
                `What's ${TEAMS.find(t=>t.id===activeTeam)?.label}'s biggest weakness right now?`,
                `Give me the analytics case for ${TEAMS.find(t=>t.id===activeTeam)?.label} this season`,
                `Predict ${TEAMS.find(t=>t.id===activeTeam)?.label}'s outlook for next season`,
              ].map((q,i) => (
                <button key={i} onClick={()=>setInput(q)}
                  style={{ background:"var(--navy-mid)", border:"1px solid var(--border)", borderRadius:"2px", padding:"0.6rem 0.75rem", textAlign:"left", color:"var(--muted)", fontFamily:"var(--font-body)", fontSize:"0.75rem", fontStyle:"italic", cursor:"pointer", transition:"all 0.15s", lineHeight:1.4 }}
                  onMouseEnter={e=>{e.target.style.borderColor="var(--carolina)";e.target.style.color="var(--white)";}}
                  onMouseLeave={e=>{e.target.style.borderColor="var(--border)";e.target.style.color="var(--muted)";}}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── STORY DETAIL ── */}
        {openStory && (
          <div className="detail-overlay">
            <div className="detail-inner">
              <button className="detail-back" onClick={()=>setOpenStory(null)}>← Back to stories</button>
              <div className="detail-kicker">{openStory.type} · {openStory.team}</div>
              <h1 className="detail-headline">{openStory.headline}</h1>
              <div className="detail-meta">By The Carolina Wire Analytics Desk · {openStory.date}</div>
              {openStory.statBlock && (
                <div className="detail-stat-block">
                  {openStory.statBlock.map((s,i) => (
                    <div className="detail-stat-item" key={i}>
                      <div className="detail-stat-val">{s.val}</div>
                      <div className="detail-stat-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="detail-body">
                {(openStory.body || "").split("\n\n").map((p,i) => <p key={i}>{p}</p>)}
              </div>
              <div style={{ marginTop:"2rem", padding:"1.25rem", background:"var(--navy-mid)", border:"1px solid var(--border)", borderRadius:"3px" }}>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"var(--carolina)", textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"0.5rem" }}>Ask the AI Analyst</div>
                <div style={{ fontSize:"0.82rem", color:"var(--muted)", fontStyle:"italic", marginBottom:"0.75rem" }}>Want a deeper take on this story?</div>
                <button onClick={()=>{setInput(`Tell me more about: ${openStory.headline}`);setOpenStory(null);setActiveTab("stories");}}
                  style={{ background:"var(--carolina)", border:"none", color:"var(--navy)", padding:"0.5rem 1.25rem", fontFamily:"var(--font-display)", fontSize:"0.8rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>
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