export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");
  const apiKey = process.env.VITE_SPORTS_API_KEY;
  try {
    const today = new Date().toISOString().slice(0,10).replace(/-/g,"");

    const [todayRes, teamRes, scheduleRes] = await Promise.all([
      fetch(`https://tank01-fantasy-stats.p.rapidapi.com/getNBAScoresForDate?gameDate=${today}&topPerformers=false`, {
        headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com" }
      }),
      fetch(`https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams?teamAbv=CHA&teamStats=true&topPerformers=true&rosters=false&schedules=false`, {
        headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com" }
      }),
      fetch(`https://tank01-fantasy-stats.p.rapidapi.com/getNBATeamSchedule?teamAbv=CHA&season=2025`, {
        headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com" }
      }),
    ]);

    const todayData = await todayRes.json();
    const teamData = await teamRes.json();
    const scheduleData = await scheduleRes.json();

    // Live game today
    const todayGames = Object.values(todayData?.body || {});
    const liveGame = todayGames.find(g =>
      g.home === "CHA" || g.away === "CHA" ||
      g.homeLong?.includes("Charlotte") || g.awayLong?.includes("Charlotte")
    );

    // Team stats and leaders
    const team = Object.values(teamData?.body || {})[0];
    const stats = team?.teamStats || {};
    const topPerformers = team?.topPerformers || {};

    // Recent completed games (last 5)
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
        sport: "NBA",
        gameDate: g.gameDate,
        gameID: g.gameID,
        raw: g,
      }));

    res.status(200).json({
      liveGame: liveGame || null,
      recentGames: completedGames,
      leaders: [
        { name: topPerformers?.pts?.name || "LaMelo Ball", sub: "PPG Leader", val: `${topPerformers?.pts?.avg || stats.ppg || "30.1"} PPG` },
        { name: topPerformers?.reb?.name || "Mark Williams", sub: "RPG Leader", val: `${topPerformers?.reb?.avg || stats.rpg || "13.2"} RPG` },
        { name: topPerformers?.ast?.name || "LaMelo Ball", sub: "APG Leader", val: `${topPerformers?.ast?.avg || stats.apg || "7.2"} APG` },
      ],
      stats: {
        offRating: parseFloat(stats.offRating) || null,
        defRating: parseFloat(stats.defRating) || null,
        netRating: parseFloat(stats.netRating) || null,
        efg: parseFloat(stats.eFGPercentage) || null,
        pace: parseFloat(stats.pace) || null,
      },
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}