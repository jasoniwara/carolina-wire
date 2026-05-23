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

  .nav { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 60px; background: var(--navy-mid); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
  .nav-logo { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.08em; color: var(--white); }
  .nav-logo span { color: var(--carolina); }
  .nav-tabs { display: flex; gap: 0; }
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
  .stat-val { font-family: var(--font-mono); font-size: 0.7rem; color: var(--white); width: 48px; text-align: right; flex-shrink: 0; }

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
  { id: "hornets",    label: "Hornets",    sport: "NBA", color: "hornets" },
  { id: "hurricanes", label: "Hurricanes", sport: "NHL", color: "hurricanes" },
  { id: "panthers",   label: "Panthers",   sport: "NFL", color: "panthers" },
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
  hornets: [
    {
      id: 1, featured: true,
      type: "Season Recap", badge: "badge-hornets", team: "Hornets",
      headline: "From 4-14 to 44-38: Charlotte's Remarkable Turnaround",
      preview: "The Hornets went from lottery bound to play-in contenders. The analytics behind one of the NBA's best second-half stories.",
      img: "HORNETS",
      stats: [
        { label: "Off. Rating", val: "119.4", bar: 78, cls: "bar-hornets" },
        { label: "Net Rating", val: "+5.0", bar: 65, cls: "bar-gold" },
        { label: "Win Streak", val: "9 G", bar: 60, cls: "bar-hornets" },
      ],
      body: `The 2025-26 Charlotte Hornets season will be remembered as the year the rebuild turned the corner. Starting 4-14 through late November, the analytics suggested a lottery pick was coming — again. Then something shifted.\n\nBetween January and February, Charlotte reeled off nine consecutive wins, their longest streak in the franchise's current incarnation. The offensive rating during that stretch was elite — north of 119 — powered by LaMelo Ball's playmaking at peak efficiency and Brandon Miller's emergence as a genuine second option.\n\nThe final record of 44-38 marked their first winning season since 2021-22. More telling: their offensive rating of 119.4 ranked 5th in the entire NBA, and their net rating of +5.0 ranked 8th. This is not a team built on luck — it's a team whose underlying numbers suggest they should have won even more.\n\nThey made the play-in tournament and knocked out Miami in overtime before falling short of the full playoffs. The foundation is real. With LaMelo's extension situation resolved and Miller entering his prime, the question heading into 2026-27 isn't whether Charlotte can compete — it's whether the front office will surround them with enough to make a genuine postseason run.`,
      statBlock: [{ val: "44-38", lbl: "Final Record" }, { val: "119.4", lbl: "Off. Rating (5th)" }, { val: "+5.0", lbl: "Net Rating" }],
      date: "May 22, 2026",
    },
    {
      id: 2, type: "Analysis", badge: "badge-analysis", team: "Hornets",
      headline: "LaMelo Ball: The Case for the Max Contract",
      preview: "His usage rate, on/off splits, and playmaking metrics make the financial argument crystal clear.",
      img: "LAMELO",
      stats: [],
      body: `The numbers around LaMelo Ball's contract situation are straightforward once you strip away the noise. At a 34.1% usage rate — top 8 in the NBA — he posted a positive net rating, meaning Charlotte was better with him on the floor despite running most of their offense through him.\n\nThe on/off splits are even more convincing. Charlotte was 24-21 in games where Ball played 30 or more minutes, and 19-28 when he didn't. That 11-game swing in winning percentage is the kind of impact that commands max money in today's NBA market.\n\nHis assist-to-turnover ratio improved for the third consecutive season, and his pull-up three-point percentage climbed to 36.8% — a number that puts him in elite company among high-usage playmakers. The argument against the max is health. The argument for it is everything else.`,
      statBlock: [{ val: "34.1%", lbl: "Usage Rate" }, { val: "36.8%", lbl: "Pull-Up 3P%" }, { val: "24-21", lbl: "W/L 30+ Min" }],
      date: "May 18, 2026",
    },
  ],
  hurricanes: [
    {
      id: 3, featured: true,
      type: "Playoff Breakdown", badge: "badge-hurricanes", team: "Hurricanes",
      headline: "8-1 and Hunting: The Canes' Path to the Cup",
      preview: "Carolina swept Ottawa and Philly before dropping Game 1 to Montreal. The analytics of a team built to win now.",
      img: "CANES",
      stats: [
        { label: "Expected Goals %", val: "54.2", bar: 72, cls: "bar-red" },
        { label: "High-Danger CF%", val: "56.1", bar: 75, cls: "bar-red" },
        { label: "PP Efficiency", val: "23.8%", bar: 68, cls: "bar-gold" },
      ],
      body: `The Carolina Hurricanes entered the 2026 Stanley Cup Playoffs as the top seed in the Eastern Conference and proceeded to prove it — sweeping Ottawa and Philadelphia in back-to-back series before facing their first real test against the Montreal Canadiens.\n\nGame 1 of the ECF was a 6-2 loss, with Montreal's speed exposing an 11-day layoff that left the Canes flat in the first period. Four goals in the opening frame decided it before Carolina could find their legs.\n\nThe analytics still favor Carolina. Their expected goals percentage over the full playoff run sits above 54%, meaning they're generating higher-quality chances than opponents even when the scoreboard disagrees. The Andersen blip in Game 1 — his first genuinely bad performance of the postseason — is an outlier against a .950 save percentage run.\n\nGame 2 tonight at Lenovo Center is effectively a must-respond moment. Rod Brind'Amour's teams don't rattle easily. The structure will be there. The question is whether the legs come back after the layoff.`,
      statBlock: [{ val: "8-1", lbl: "Playoff Record" }, { val: "54.2%", lbl: "xG%" }, { val: "ECF", lbl: "Current Round" }],
      date: "May 22, 2026",
    },
    {
      id: 4, type: "Analytics", badge: "badge-analysis", team: "Hurricanes",
      headline: "Rod Brind'Amour's Defensive System: A Model for the NHL",
      preview: "Carolina's structure under pressure is the most analytically celebrated in hockey. The numbers explain why.",
      img: "DEF",
      stats: [],
      body: `The Carolina Hurricanes have built the most analytically sound defensive structure in the modern NHL under Rod Brind'Amour. The proof is in the expected goals numbers, which measure shot quality rather than just quantity.\n\nCarolina consistently ranks in the top five in high-danger chance prevention — shots from the inner slot, deflections in front, and back-door plays. Their structure in the defensive zone involves overlapping coverage responsibilities that confuse opposing forecheckers while maintaining numerical advantages near the crease.\n\nThe penalty kill, historically a weakness, has become a strength. At 83.4% efficiency, Carolina shorthanded units are built around active stick positioning and angled pursuit. Brind'Amour's system demands complete player buy-in. It is not a flashy style. It is, however, a winning one.`,
      statBlock: [{ val: "54.2%", lbl: "Expected Goals %" }, { val: "83.4%", lbl: "PK Efficiency" }, { val: "#3", lbl: "HDCA Rank" }],
      date: "May 14, 2026",
    },
  ],
  panthers: [
    {
      id: 5, featured: true,
      type: "Season Preview", badge: "badge-panthers", team: "Panthers",
      headline: "Bryce Young's $240M Question: 2026 Is Put Up or Shut Up",
      preview: "After a career year and a Wild Card appearance, Young enters 2026 with his fifth-year option secured and everything to prove.",
      img: "PANTHERS",
      stats: [
        { label: "Pass Yards", val: "3,011", bar: 62, cls: "bar-panthers" },
        { label: "Touchdowns", val: "23 TD", bar: 68, cls: "bar-panthers" },
        { label: "Game-Winners", val: "12 GWD", bar: 80, cls: "bar-gold" },
      ],
      body: `Bryce Young's redemption arc is one of the better stories in recent NFL history. Benched midway through 2024 after historically poor efficiency numbers, he returned to lead Carolina on a run that included 12 fourth-quarter or overtime game-winning drives — the most of any quarterback in the league since he entered the NFL in 2023.\n\nThe 2025 final line: 3,011 yards, 23 touchdowns, a 63.6 completion percentage and an 87.8 passer rating. Not elite numbers by modern NFL standards, but a genuine leap from a player who looked finished just 18 months earlier. His decision-making under pressure improved dramatically — time-to-throw on third downs dropped, yards-per-attempt on play-action rose, and his turnover-worthy play rate fell to league-average for the first time in his career.\n\nGeneral Manager Dan Morgan spent the offseason building around him. Monroe Freeling arrives as a potential franchise left tackle. John Metchie III adds a burner alongside Tetairoa McMillan. Jaelan Phillips brings genuine pass-rush disruption on defense.\n\nThe schedule is brutal — Philadelphia, Seattle, Green Bay, and Baltimore all appear on the 2026 calendar. The Panthers have decided to watch rather than extend: his fifth-year option is picked up, contract talks tabled until 2027. This is the year the question gets answered.`,
      statBlock: [{ val: "3,011", lbl: "Pass Yards" }, { val: "23", lbl: "Touchdowns" }, { val: "12", lbl: "Game-Winners" }],
      date: "May 23, 2026",
    },
    {
      id: 6, type: "Analytics", badge: "badge-analysis", team: "Panthers",
      headline: "Monroe Freeling and the Offensive Line Rebuild",
      preview: "Carolina drafted a franchise left tackle at 19. The blocking metrics that made him the pick.",
      img: "OL",
      stats: [],
      body: `The Panthers' decision to select Monroe Freeling 19th overall was driven as much by analytics as by need. Freeling's pass-blocking efficiency grade in his final college season ranked in the 94th percentile among draft-eligible tackles — a metric that correlates strongly with early NFL success at the position.\n\nMore telling: his pressure rate allowed on true pass sets was 3.1%, the lowest in the draft class. That matters enormously for a quarterback like Young, whose processing speed is elite but whose mobility under pressure is below average. Freeling gives him clean pockets.\n\nPaired with new center Luke Fortner and returning anchor Taylor Moton on the right side, Carolina's offensive line projects as a top-15 unit heading into 2026 — a dramatic upgrade from the group that ranked 28th in pass-blocking efficiency just two years ago.`,
      statBlock: [{ val: "94th", lbl: "Block Efficiency %" }, { val: "3.1%", lbl: "Pressure Rate" }, { val: "Top 15", lbl: "OL Projection" }],
      date: "May 20, 2026",
    },
  ],
};

const SCORES = {
  hornets: [
    { away: "Miami", awayRec: "38-44", awayScore: 108, home: "Charlotte", homeRec: "43-39", homeScore: 114, period: "FINAL · Play-In", live: false, sport: "NBA" },
  ],
  hurricanes: [],
  panthers: [
    { away: "CAR", awayRec: "8-9", awayScore: 13, home: "LA Rams", homeRec: "11-6", homeScore: 27, period: "FINAL · Wild Card", live: false, sport: "NFL" },
  ],
};

const LEADERS = {
  hornets: [
    { name: "LaMelo Ball", sub: "PG · PPG Leader", val: "30.1 PPG" },
    { name: "Brandon Miller", sub: "SF · Breakout Year", val: "20.7 PPG" },
    { name: "Mark Williams", sub: "C · RPG Leader", val: "13.2 RPG" },
  ],
  hurricanes: [
    { name: "Sebastian Aho", sub: "C · #20", val: "38 G" },
    { name: "Andrei Svechnikov", sub: "RW · #37", val: "52 A" },
    { name: "Frederik Andersen", sub: "G", val: ".918 SV%" },
  ],
  panthers: [
    { name: "Bryce Young", sub: "QB · 5th Year Option", val: "23 TD" },
    { name: "Tetairoa McMillan", sub: "WR · 2nd Year", val: "1,104 YDS" },
    { name: "Derrick Brown", sub: "DT · Veteran", val: "9.5 TFL" },
  ],
};

const SYSTEM_PROMPT = `You are an expert North Carolina sports analyst covering the Charlotte Hornets (NBA), Carolina Hurricanes (NHL), and Carolina Panthers (NFL). You provide sharp, analytically-driven insights using advanced metrics naturally (eFG%, xG, net rating, DVOA, expected goals, etc.) and have strong opinions. Keep responses to 2-4 sentences — punchy and authoritative. Current context: The Hurricanes are in the 2026 ECF vs Montreal, down 1-0 after losing Game 1 6-2. Game 2 is tonight May 23. The Hornets finished 44-38 and made the play-in. The Panthers are preparing for the 2026 NFL season with Bryce Young on his fifth-year option.`;

const IDLE_TIMEOUT = 30 * 60 * 1000;
const isGameTime = () => { const h = new Date().getHours(); return h >= 18 && h < 24; };

export default function NCSportsHub() {
  const [activeTeam, setActiveTeam] = useState("hurricanes");
  const [activeTab, setActiveTab] = useState("stories");
  const [openStory, setOpenStory] = useState(null);
  const [liveScores, setLiveScores] = useState({});
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ask me anything about the Hornets, Hurricanes, or Panthers — analytics, matchups, predictions. I'm here." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const [notionStories, setNotionStories] = useState({});
  const [storiesLoaded, setStoriesLoaded] = useState(false);
  const msgEndRef = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      const [nhl, nba, nfl] = await Promise.all([
        fetch("/api/nhl").then(r => r.json()).catch(() => ({})),
        fetch("/api/nba").then(r => r.json()).catch(() => ({})),
        fetch("/api/nfl").then(r => r.json()).catch(() => ({})),
      ]);
      if (nhl.liveGame) {
        const g = nhl.liveGame;
        setLiveScores(prev => ({ ...prev, hurricanes: {
          away: g.awayTeam.abbrev, awayScore: g.awayTeam.score,
          home: g.homeTeam.abbrev, homeScore: g.homeTeam.score,
          period: g.gameState === "FINAL" ? "FINAL" :
                  g.periodDescriptor?.periodType === "OT" ? "OVERTIME" :
                  g.periodDescriptor?.periodType === "SO" ? "SHOOTOUT" :
                  `P${g.periodDescriptor?.number} ${g.clock?.timeRemaining || ""}`,
          live: g.gameState === "LIVE",
        }}));
      }
      if (nba.liveGame) {
        const g = nba.liveGame;
        setLiveScores(prev => ({ ...prev, hornets: {
          away: g.away, awayScore: g.awayPts,
          home: g.home, homeScore: g.homePts,
          period: g.gameStatus || g.gameClock || "LIVE",
          live: g.gameStatus === "Live",
        }}));
      }
            if (nfl.liveGame) {
        const g = nfl.liveGame;
        setLiveScores(prev => ({ ...prev, panthers: {
          away: g.away, awayScore: g.awayPts,
          home: g.home, homeScore: g.homePts,
          period: g.gameStatus || g.gameClock || "LIVE",
          live: g.gameStatus === "Live",
        }}));
      }

      const storiesRes = await fetch("/api/stories").then(r => r.json()).catch(() => ({}));
      if (storiesRes.stories?.length) {
        const grouped = {};
        storiesRes.stories.forEach(s => {
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

  const stories = (storiesLoaded && notionStories[activeTeam]?.length)
  ? notionStories[activeTeam]
  : STORIES[activeTeam] || [];
  const scores = SCORES[activeTeam] || [];
  const leaders = LEADERS[activeTeam] || [];
  const featured = stories.find(s => s.featured);
  const rest = stories.filter(s => !s.featured);
  const liveGame = liveScores[activeTeam];

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
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

            {activeTab==="analytics" && featured && (
              <>
                <div className="section-header"><div className="section-title">Analytics Dashboard</div></div>
                <div className="analytics-panel">
                  <div className="analytics-title">Key Metrics — {TEAMS.find(t=>t.id===activeTeam)?.label}</div>
                  {featured.stats.map((s,i) => (
                    <div className="stat-row" key={i}>
                      <div className="stat-row-label">{s.label}</div>
                      <div className="stat-bar-wrap"><div className={`stat-bar ${s.cls}`} style={{ width:barsVisible?`${s.bar}%`:"0%" }} /></div>
                      <div className="stat-val">{s.val}</div>
                    </div>
                  ))}
                </div>
                <div className="analytics-panel" style={{ cursor:"pointer" }} onClick={() => { setOpenStory(featured); setActiveTab("stories"); }}>
                  <div className="analytics-title">Featured Analysis</div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:"1.1rem", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"0.75rem" }}>{featured.headline}</div>
                  <div style={{ fontSize:"0.85rem", color:"var(--muted)", fontStyle:"italic", lineHeight:1.6, marginBottom:"1rem" }}>{featured.preview}</div>
                  <button style={{ background:"var(--carolina)", border:"none", color:"var(--navy)", padding:"0.5rem 1.25rem", fontFamily:"var(--font-display)", fontSize:"0.8rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Full Breakdown →</button>
                </div>
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

            {activeTab==="scores" && (
              <>
                {activeTeam==="hurricanes" ? (
                  <>
                    <div className="section-header">
                      <div className="section-title">2026 Stanley Cup Playoffs</div>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", color:"var(--carolina)" }}>8-1 Overall</span>
                    </div>
                    {liveGame && (
                      <div className="score-card" style={{ borderColor:"var(--red)", marginBottom:"1.5rem" }}>
                        <div className="score-card-header">
                          <span>NHL · ECF · LIVE</span>
                          {liveGame.live?<span className="score-live">Live</span>:<span>{liveGame.period}</span>}
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
                    {PLAYOFF_ROUNDS.map((round,ri) => (
                      <div key={ri} style={{ marginBottom:"1.75rem" }}>
                        <div className="round-header" style={{ color:round.won===true?"var(--carolina)":"var(--gold)" }}>
                          <span>{round.name} · vs {round.opponent}</span>
                          <span style={{ color:round.won===true?"#4caf50":round.won===null?"var(--gold)":"var(--red)" }}>{round.resultLabel}</span>
                        </div>
                        {round.games.map((g,gi) => (
                          <div className="score-card" key={gi} style={{ animationDelay:`${gi*0.06}s`, opacity:g.homeScore===null?0.5:1 }}>
                            <div className="score-card-header">
                              <span>Game {g.g}</span>
                              {g.win===true&&<span style={{ color:"#4caf50" }}>W</span>}
                              {g.win===false&&<span style={{ color:"var(--red)" }}>L</span>}
                              {g.win===null&&<span style={{ color:"var(--muted)" }}>upcoming</span>}
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
                    {liveGame && (
                      <div className="score-card" style={{ borderColor:"var(--carolina)", marginBottom:"1rem" }}>
                        <div className="score-card-header">
                          <span>{TEAMS.find(t=>t.id===activeTeam)?.sport} · Live</span>
                          {liveGame.live?<span className="score-live">Live</span>:<span>{liveGame.period}</span>}
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
                    {scores.map((g,i) => (
                      <div className="score-card" key={i} style={{ animationDelay:`${i*0.08}s` }}>
                        <div className="score-card-header">
                          <span>{TEAMS.find(t=>t.id===activeTeam)?.sport} · {g.period.includes("FINAL")?"Final":"Upcoming"}</span>
                          <span>{g.period}</span>
                        </div>
                        <div className="score-matchup">
                          <div className="score-team away">
                            <div className="score-team-name">{g.away}</div>
                            <div className="score-record">{g.awayRec}</div>
                          </div>
                          <div className="score-center">
                            {g.awayScore!=null
                              ?<div className="score-nums">{g.awayScore} — {g.homeScore}</div>
                              :<div style={{ fontFamily:"var(--font-mono)", fontSize:"0.75rem", color:"var(--muted)" }}>vs</div>}
                            <div className="score-period">{g.period}</div>
                          </div>
                          <div className="score-team home">
                            <div className="score-team-name">{g.home}</div>
                            <div className="score-record">{g.homeRec}</div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                {openStory.body.split("\n\n").map((p,i) => <p key={i}>{p}</p>)}
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