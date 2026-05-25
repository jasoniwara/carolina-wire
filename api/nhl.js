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

    // Filter playoff games only
    const playoffGames = (scheduleData?.games || []).filter(g => g.gameType === 3);

    // For completed games, fetch box score data (goals)
    const completedGames = playoffGames.filter(g => g.gameState === "OFF" || g.gameState === "FINAL");
    const boxScorePromises = completedGames.map(g =>
      fetch(`https://api-web.nhle.com/v1/gamecenter/${g.id}/play-by-play`)
        .then(r => r.json())
        .catch(() => null)
    );
    const boxScores = await Promise.all(boxScorePromises);
    const boxScoreMap = {};
    completedGames.forEach((g, i) => {
      if (boxScores[i]) boxScoreMap[g.id] = boxScores[i];
    });

    const parseGame = (g) => {
      const box = boxScoreMap[g.id];
      const goals = box?.goals || [];
      return {
        id: g.id,
        gameDate: g.gameDate,
        away: g.awayTeam?.abbrev,
        home: g.homeTeam?.abbrev,
        awayScore: g.awayTeam?.score ?? null,
        homeScore: g.homeTeam?.score ?? null,
        awayTeam: g.awayTeam,
        homeTeam: g.homeTeam,
        gameState: g.gameState,
        seriesGameNumber: g.seriesStatus?.seriesGameNumber,
        opponent: g.homeTeam?.abbrev === "CAR" ? g.awayTeam?.abbrev : g.homeTeam?.abbrev,
        period: (g.gameState === "OFF" || g.gameState === "FINAL") ?
                (g.gameOutcome?.lastPeriodType === "OT" ? "FINAL/OT" : "FINAL") :
                (g.gameState === "FUT" || g.gameState === "PRE") ?
                new Date(g.startTimeUTC).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) :
                (g.gameState === "LIVE" || g.gameState === "CRIT") ? "LIVE" : g.gameState,
        win: (g.gameState === "OFF" || g.gameState === "FINAL") ?
             (g.homeTeam?.abbrev === "CAR" ? g.homeTeam.score > g.awayTeam.score : g.awayTeam.score > g.homeTeam.score) : null,
        gameOutcome: g.gameOutcome,
        goals,
        periodDescriptor: g.periodDescriptor,
        clock: g.clock,
      };
    };

    const parsedGames = playoffGames.map(parseGame);

    // Group by opponent into rounds
    const opponentOrder = [...new Set(parsedGames.map(g => g.opponent))];
    const opponentNames = {
      "OTT": "Ottawa Senators",
      "PHI": "Philadelphia Flyers",
      "MTL": "Montreal Canadiens",
      "TBL": "Tampa Bay Lightning",
      "BOS": "Boston Bruins",
      "FLA": "Florida Panthers",
      "NYR": "New York Rangers",
      "NJD": "New Jersey Devils",
    };
    const roundNames = ["First Round", "Second Round", "Eastern Conference Final", "Stanley Cup Final"];

    const rounds = opponentOrder.map((opp, idx) => {
      let games = parsedGames.filter(g => g.opponent === opp);
      const wins = games.filter(g => g.win === true).length;
      const losses = games.filter(g => g.win === false).length;
      const seriesOver = wins === 4 || losses === 4;
      if (!seriesOver) {
        const played = games.filter(g => g.win !== null);
        const upcoming = games.filter(g => g.win === null).slice(0, 1);
        games = [...played, ...upcoming];
      }
      return {
        name: roundNames[idx] || `Round ${idx + 1}`,
        opponent: opponentNames[opp] || opp,
        games,
      };
    });

    res.status(200).json({ liveGame: canesGame || null, rounds });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}