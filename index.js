const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/uzair", express.static(path.join(__dirname, "uzair")));

app.get("/", (req, res) => {
  res.send("✅ YouTube Downloader API is running!");
});

app.get("/ytDl3", async (req, res) => {
  const { link, format } = req.query;

  if (!link || !format) {
    return res.status(400).json({ error: "Missing link or format" });
  }

  try {
    const response = await axios.get(`https://yt-api-fork.onrender.com/dipto/ytDlfuk?link=${link}&format=${format}`);
    const dat = response.data;
    const filename = `${format}_${link}.${format}`;
    const filePath = path.join(__dirname, "uzair", filename);

    const rr = await axios.get(dat.downloadLink, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, Buffer.from(rr.data));

    res.json({
      title: dat.title,
      format,
      quality: dat.quality,
      size: dat.size,
      downloadLink: `${req.protocol}://${req.get("host")}/uzair/${filename}`
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "Download failed", detail: e.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
