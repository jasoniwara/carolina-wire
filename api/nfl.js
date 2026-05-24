export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60");
  const apiKey = process.env.VITE_SPORTS_API_KEY;
  try {
    const today = now.toISOString().slice(0,10).replace(/-/g,"");
    const r = await fetch(
      `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLScoresForDate?gameDate=${today}`,
      { headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com" }}
    );
    const data = await r.json();
    const games = Object.values(data?.body || {});
    const game = games.find(g =>
      g.home === "CAR" || g.away === "CAR" ||
      g.homeLong?.includes("Carolina") || g.awayLong?.includes("Carolina")
    );
    res.status(200).json({ liveGame: game || null });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}