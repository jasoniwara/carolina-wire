export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=30");
  const apiKey = process.env.VITE_SPORTS_API_KEY;
  try {
    const today = now.toISOString().slice(0,10).replace(/-/g,"");
    const r = await fetch(
      `https://tank01-fantasy-stats.p.rapidapi.com/getNBAScoresForDate?gameDate=${today}&topPerformers=false`,
      { headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com" }}
    );
    const data = await r.json();
    const games = Object.values(data?.body || {});
    const game = games.find(g =>
      g.home === "CHA" || g.away === "CHA" ||
      g.homeLong?.includes("Charlotte") || g.awayLong?.includes("Charlotte")
    );
    res.status(200).json({ liveGame: game || null });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}