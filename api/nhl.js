export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60");
  try {
    const [liveRes, scheduleRes] = await Promise.all([
      fetch("https://api-web.nhle.com/v1/score/now"),
      fetch("https://api-web.nhle.com/v1/club-schedule-season/CAR/20252026"),
    ]);

    const liveData = await liveRes.json();
    const scheduleData = await scheduleRes.json();

    const canesGame = liveData?.games?.find(g =>
      g.homeTeam?.abbrev === "CAR" || g.awayTeam?.abbrev === "CAR"
    );

    // Filter to only playoff games (gameType 3)
    const playoffGames = (scheduleData?.games || [])
      .filter(g => g.gameType === 3)
      .map(g => ({
        id: g.id,
        gameDate: g.gameDate,
        away: g.awayTeam?.abbrev,
        home: g.homeTeam?.abbrev,
        awayScore: g.awayTeam?.score ?? null,
        homeScore: g.homeTeam?.score ?? null,
        gameState: g.gameState,
        seriesGameNumber: g.seriesStatus?.seriesGameNumber,
        seriesAbbrev: g.seriesStatus?.seriesAbbrev,
        opponent: g.homeTeam?.abbrev === "CAR" ? g.awayTeam?.abbrev : g.homeTeam?.abbrev,
        period: (g.gameState === "OFF" || g.gameState === "FINAL") ?
                (g.gameOutcome?.lastPeriodType === "OT" ? "FINAL/OT" : "FINAL") :
                (g.gameState === "FUT" || g.gameState === "PRE") ?
                new Date(g.startTimeUTC).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) :
                (g.gameState === "LIVE" || g.gameState === "CRIT") ? "LIVE" : g.gameState,
        win: (g.gameState === "OFF" || g.gameState === "FINAL") ?
             (g.homeTeam?.abbrev === "CAR" ? g.homeTeam.score > g.awayTeam.score : g.awayTeam.score > g.homeTeam.score) : null,
      }));

    // Group by opponent into rounds
    const rounds = [];
    const opponentOrder = [...new Set(playoffGames.map(g => g.opponent))];
    const opponentNames = { "OTT": "Ottawa Senators", "PHI": "Philadelphia Flyers", "MTL": "Montreal Canadiens" };

    opponentOrder.forEach(opp => {
      const games = playoffGames.filter(g => g.opponent === opp);
      rounds.push({
        name: rounds.length === 0 ? "First Round" : rounds.length === 1 ? "Second Round" : "Eastern Conference Final",
        opponent: opponentNames[opp] || opp,
        games,
      });
    });

    res.status(200).json({ liveGame: canesGame || null, rounds });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}