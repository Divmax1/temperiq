export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing API key" });

  const rawMessages = req.body.messages || [];
  const messages = rawMessages.filter((m, i) => !(i === 0 && m.role === "assistant"));
  if (!messages.length) return res.status(400).json({ error: "No messages" });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        max_tokens: 800,
        messages: [
          { role: "system", content: req.body.system || "You are a helpful assistant." },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "API error" });

    const reply = data.choices?.[0]?.message?.content || "I'm having trouble responding.";
    return res.status(200).json({ content: [{ type: "text", text: reply }] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const apiKey = process.env.GROQ_API_KEY;
console.log("FULL KEY:", apiKey);
