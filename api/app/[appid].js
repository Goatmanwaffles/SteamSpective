const fetch = require("node-fetch");

export default async function handler(req, res) {
  const { appid } = req.query;
  const apiUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
  console.log("API URL:", apiUrl);

  try {
    const response = await fetch(apiUrl, { method: "HEAD" });
    const contentType = response.headers.get("content-type") || "";
    return res.json(response.ok && contentType.startsWith("image/") ? 1 : 0);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
