const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Static files (MP3/MP4)
app.use("/uzair", express.static(path.join(__dirname, "uzair")));

app.get("/ytdip", async (req, res) => {
    const { link, format } = req.query;

    if (!link || !format) {
        return res.status(400).json({ error: "Please provide both link and format." });
    }

    try {
        let filename, data;
        const baseUrl = "https://uzair-sehar-api.onrender.com"; // ✅ Full external URL

        const response = await axios.get(`${baseUrl}/dipto/ytDlfuk?link=${link}&format=${format}`);
        data = response.data;

        filename = `${format}_${link}.${format}`;
        const filePath = path.join(__dirname, "uzair", filename);

        const fileDownload = await axios.get(data.downloadLink, {
            responseType: "arraybuffer"
        });

        fs.writeFileSync(filePath, Buffer.from(fileDownload.data));

        const fullLink = `${req.protocol}://${req.get("host")}/uzair/${filename}`;

        res.json({
            title: data.title || "",
            format,
            quality: data.quality || "",
            downloadLink: fullLink,
            size: data.size || "",
            author: "Uzair Rajput"
        });
    } catch (error) {
        console.error("❌ Error downloading:", error.message);
        res.status(500).json({ error: "Failed to fetch or download file.", details: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("✅ YouTube Downloader API is running!");
});

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});
