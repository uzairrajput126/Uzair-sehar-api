const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ytdip", async (req, res) => {
    const { link, format } = req.query;

    if (!link || !format) {
        return res.status(400).json({ error: "Please provide both link and format." });
    }

    try {
        let filename, data;
        const apiUrl = `https://uzair-sehar-api.onrender.com/dipto/ytDlfuk?link=${link}&format=${format}`;

        const response = await axios.get(apiUrl);
        data = response.data;

        filename = format === "mp3" ? `audio_${link}.mp3` : `video_${link}.mp4`;

        const filePath = path.join(__dirname, "uzair", filename);
        const fileData = await axios.get(data.downloadLink, { responseType: "arraybuffer" });

        fs.writeFileSync(filePath, Buffer.from(fileData.data));

        const fileUrl = `${req.protocol}://${req.get("host")}/uzair/${filename}`;

        res.json({
            title: data.title || "",
            format,
            quality: data.quality || "",
            size: data.size || "",
            downloadLink: fileUrl,
            author: "Uzair Rajput"
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch/download video.", details: error.message });
    }
});

app.use("/uzair", express.static(path.join(__dirname, "uzair")));

app.get("/", (req, res) => {
    res.send("✅ YouTube Downloader API is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
