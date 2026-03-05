export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing API key" });

  // Strip any leading assistant messages — Anthropic requires user message first
  const rawMessages = req.body.messages || [];
  const messages = rawMessages.filter((m, i) => !(i === 0 && m.role === "assistant"));

  if (!messages.length) return res.status(400).json({ error: "No messages provided" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system: req.body.system || "You are a helpful assistant.",
        messages,
      }),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { return res.status(500).json({ error: "Bad response from AI", raw: text.slice(0, 200) }); }

    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "API error", details: data });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
