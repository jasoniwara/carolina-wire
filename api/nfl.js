export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");
  const apiKey = process.env.VITE_SPORTS_API_KEY;
  try {
    const today = new Date().toISOString().slice(0,10).replace(/-/g,"");

    const [todayRes, teamRes, scheduleRes] = await Promise.all([
      fetch(`https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLScoresForDate?gameDate=${today}`, {
        headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com" }
      }),
      fetch(`https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeams?teamAbv=CAR&teamStats=true&topPerformers=true&rosters=false&schedules=false`, {
        headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com" }
      }),
      fetch(`https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeamSchedule?teamAbv=CAR&season=2025`, {
        headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com" }
      }),
    ]);

    const todayData = await todayRes.json();
    const teamData = await teamRes.json();
    const scheduleData = await scheduleRes.json();

    const todayGames = Object.values(todayData?.body || {});
    const liveGame = todayGames.find(g =>
      g.home === "CAR" || g.away === "CAR" ||
      g.homeLong?.includes("Carolina") || g.awayLong?.includes("Carolina")
    );

    const team = Object.values(teamData?.body || {})[0];
    const stats = team?.teamStats || {};
    const topPerformers = team?.topPerformers || {};

    const allGames = Object.values(scheduleData?.body?.schedule || {});
    const completedGames = allGames
      .filter(g => g.gameStatus === "Completed" || (g.homePts && g.awayPts))
      .slice(-5)
      .reverse()
      .map(g => ({
        away: g.away,
        awayScore: g.awayPts,
        awayRec: g.awayRecord,
        home: g.home,
        homeScore: g.homePts,
        homeRec: g.homeRecord,
        period: "FINAL",
        sport: "NFL",
        gameDate: g.gameDate,
        gameID: g.gameID,
        raw: g,
      }));

    res.status(200).json({
      liveGame: liveGame || null,
      recentGames: completedGames,
      leaders: [
        { name: topPerformers?.passYds?.name || "Bryce Young", sub: "Pass Yards Leader", val: `${topPerformers?.passYds?.total || "3,011"} YDS` },
        { name: topPerformers?.rushYds?.name || "Miles Sanders", sub: "Rush Yards Leader", val: `${topPerformers?.rushYds?.total || "892"} YDS` },
        { name: topPerformers?.sacks?.name || "Derrick Brown", sub: "Sacks Leader", val: `${topPerformers?.sacks?.total || "7.5"} SCK` },
      ],
      stats: {
        ppg: parseFloat(stats.ppg) || null,
        oppPpg: parseFloat(stats.oppPpg) || null,
        passYds: parseFloat(stats.passYdsPerGame) || null,
        rushYds: parseFloat(stats.rushYdsPerGame) || null,
        thirdDown: parseFloat(stats.thirdDownConvPct) || null,
      },
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}