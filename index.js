const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.get("/ytdip", async (req, res) => {
    const { link, format } = req.query;

    if (!link || !format) {
        return res.status(400).json({ error: "Please provide both link and format." });
    }

    try {
        let music;
        let p;
        let dat;

        if (format === "mp3") {
            const response = await axios.get(`https://www.noobs-api.000.pe/dipto/ytDlfuk?link=${link}&format=mp3`);
            dat = response.data;
            p = `audio_${link}.mp3`;
        } else if (format === "mp4") {
            const response = await axios.get(`https://www.noobs-api.000.pe/dipto/ytDlfuk?link=${link}&format=mp4`);
            dat = response.data;
            p = `video_${link}.mp4`;
        } else {
            return res.status(400).json({ error: "Invalid format specified. Use 'mp3' or 'mp4'." });
        }

        const filePath = path.join(__dirname, "d", p);
        const rr = await axios.get(dat.downloadLink, {
            responseType: "arraybuffer"
        });
        fs.writeFileSync(filePath, Buffer.from(rr.data));

        music = `${req.protocol}://${req.get("host")}/d/${p}`;

        res.json({
            title: dat.title || "",
            format,
            quality: dat.quality || "",
            downloadLink: music,
            size: dat.size || "",
            author: "亗ㅤƊᎥᎮㅤƬᴏㅤ亗"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to fetch data from the external API.", details: error.message });
    }
});

app.use("/d", express.static(path.join(__dirname, "d")));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
