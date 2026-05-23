export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60");

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;

  try {
    const r = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "Published", checkbox: { equals: true } },
        sorts: [{ property: "Date", direction: "descending" }],
      }),
    });

    const data = await r.json();

    const stories = data.results.map((page, i) => {
      const p = page.properties;
      return {
        id: page.id,
        featured: p.Featured?.checkbox || false,
        type: p.Type?.select?.[0]?.name || "Story",
        team: p.Team?.select?.name || "",
        badge: `badge-${p.Team?.select?.name?.toLowerCase() || "analysis"}`,
        headline: p.Title?.title?.[0]?.plain_text || "",
        preview: p.Preview?.rich_text?.[0]?.plain_text || "",
        img: p.Img?.rich_text?.[0]?.plain_text || p.Team?.select?.name?.toUpperCase() || "",
        body: p.Body?.rich_text?.[0]?.plain_text || "",
        statBlock: [],
        date: p.Date?.date?.start || "",
      };
    });

    res.status(200).json({ stories });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}