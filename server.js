const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = __dirname;

app.disable("x-powered-by");
app.use(express.static(PUBLIC_DIR, {
  extensions: ["html"],
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
  }
}));

app.get("/api/search", async (req, res) => {
  const term = String(req.query.term || "").trim();
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 30, 1), 50);

  if (!term) {
    return res.status(400).json({ error: "Please provide a search term." });
  }
  if (term.length > 120) {
    return res.status(400).json({ error: "Search term is too long." });
  }

  try {
    const url = new URL("https://itunes.apple.com/search");
    url.searchParams.set("term", term);
    url.searchParams.set("media", "music");
    url.searchParams.set("entity", "song");
    url.searchParams.set("limit", String(limit));

    const upstream = await fetch(url, {
      headers: { "User-Agent": "QueraOnlineMusicLibrary/1.0" },
      signal: AbortSignal.timeout(12000)
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: `Music catalog returned status ${upstream.status}.` });
    }

    const data = await upstream.json();
    res.set("Cache-Control", "public, max-age=60");
    return res.json({
      resultCount: data.resultCount || 0,
      results: (data.results || []).map(track => ({
        trackId: track.trackId,
        trackName: track.trackName,
        artistName: track.artistName,
        collectionName: track.collectionName,
        artworkUrl100: track.artworkUrl100,
        previewUrl: track.previewUrl || null,
        trackViewUrl: track.trackViewUrl,
        primaryGenreName: track.primaryGenreName,
        releaseDate: track.releaseDate,
        kind: track.kind
      }))
    });
  } catch (error) {
    console.error("iTunes Search API error:", error.message);
    return res.status(502).json({ error: "Unable to contact the music catalog right now. Please try again." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Quera Online Music Library" });
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "API route not found." });
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Quera Online Music Library running at http://localhost:${PORT}`);
});
