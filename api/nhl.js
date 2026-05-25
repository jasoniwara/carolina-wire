export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60");
  try {
    const [liveRes, r1Res, r2Res, ecfRes] = await Promise.all([
      fetch("https://api-web.nhle.com/v1/score/now"),
      fetch("https://api-web.nhle.com/v1/schedule/playoff-series/2026/series-f/hurricanes-vs-senators"),
      fetch("https://api-web.nhle.com/v1/schedule/playoff-series/2026/series-j/hurricanes-vs-flyers"),
      fetch("https://api-web.nhle.com/v1/schedule/playoff-series/2026/series-m/hurricanes-vs-canadiens"),
    ]);

    const liveData = await liveRes.json();
    const r1Data = await r1Res.json();
    const r2Data = await r2Res.json();
    const ecfData = await ecfRes.json();

    const canesGame = liveData?.games?.find(g =>
      g.homeTeam?.abbrev === "CAR" || g.awayTeam?.abbrev === "CAR"
    );

    const parseGames = (data) => {
      return (data?.games || []).map(g => ({
        id: g.id,
        gameDate: g.gameDate,
        away: g.awayTeam?.abbrev,
        home: g.homeTeam?.abbrev,
        awayScore: g.awayTeam?.score ?? null,
        homeScore: g.homeTeam?.score ?? null,
        gameState: g.gameState,
        period: g.gameState === "FUT" || g.gameState === "PRE" ? 
                new Date(g.startTimeUTC).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) :
                (g.gameState === "OFF" || g.gameState === "FINAL") ?
                (g.gameOutcome?.lastPeriodType === "OT" ? "FINAL/OT" : "FINAL") :
                g.gameState === "LIVE" || g.gameState === "CRIT" ? "LIVE" : g.gameState,
        win: g.gameState === "OFF" || g.gameState === "FINAL" ?
             (g.homeTeam?.abbrev === "CAR" ? g.homeTeam.score > g.awayTeam.score : g.awayTeam.score > g.homeTeam.score) : null,
        seriesGameNumber: g.seriesStatus?.seriesGameNumber,
      }));
    };

    res.status(200).json({
      liveGame: canesGame || null,
      rounds: [
        { name: "First Round", opponent: "Ottawa Senators", games: parseGames(r1Data) },
        { name: "Second Round", opponent: "Philadelphia Flyers", games: parseGames(r2Data) },
        { name: "Eastern Conference Final", opponent: "Montreal Canadiens", games: parseGames(ecfData) },
      ],
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}