export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=30");
  try {
    const [liveRes, seriesRes] = await Promise.all([
      fetch("https://api-web.nhle.com/v1/score/now"),
      fetch("https://api-web.nhle.com/v1/playoff-series/carousel/20252026"),
    ]);
    const liveData = await liveRes.json();
    const seriesData = await seriesRes.json();
    const canesGame = liveData?.games?.find(g =>
      g.homeTeam?.abbrev === "CAR" || g.awayTeam?.abbrev === "CAR"
    );
    const allSeries = seriesData?.rounds?.flatMap(r => r.series || []) || [];
    const canesSeries = allSeries.filter(s =>
      s.topSeedTeam?.abbrev === "CAR" || s.bottomSeedTeam?.abbrev === "CAR"
    );
    res.status(200).json({ liveGame: canesGame || null, series: canesSeries });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}