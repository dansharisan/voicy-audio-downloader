const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
const PORT = 3000;

// Middleware to serve static files and parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set up ffmpeg path if running in a custom environment
const ffmpegPath = "/usr/bin/ffmpeg";
const ffprobePath = "/usr/bin/ffprobe";

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

app.post("/download", async (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).send("URL is required");

  const urlPrefix = url.substring(0, url.lastIndexOf("/") + 1);
  const fileName = url.split("/").pop();
  const fileBaseName = fileName.split("audio")[0] + "audio";
  const outputDir = "./temp";
  const files = [];

  // Ensure temp directory exists
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  try {
    let index = 0; // Start from 00000.ts
    while (true) {
      const fileIndex = String(index).padStart(5, "0"); // Ensure 5-digit padding
      const tsUrl = `${urlPrefix}${fileBaseName}${fileIndex}.ts`;
      const tsFilePath = path.join(outputDir, `input${fileIndex}.ts`);

      try {
        const response = await axios.get(tsUrl, { responseType: "stream" });
        const writer = fs.createWriteStream(tsFilePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        files.push(tsFilePath);
        console.log(`Downloaded: ${tsUrl}`);
      } catch (err) {
        console.log(`File not found: ${tsUrl}`);
        break;
      }
      index++; // Increment to the next file index
    }

    if (files.length === 0)
      return res.status(404).send("No files found to download");

    // Concatenate files using fluent-ffmpeg
    const concatOutput = path.join(outputDir, "output.ts");
    const mp3Output = path.join(outputDir, "output.mp3");

    const ffmpegConcat = ffmpeg();
    files.forEach((file) => ffmpegConcat.input(file)); // Add each .ts file as input

    ffmpegConcat
      .on("error", (err) => {
        console.error("FFmpeg Error:", err.message);
        res.status(500).send("Error concatenating files");
      })
      .on("end", () => {
        // Convert concatenated file to mp3
        ffmpeg(concatOutput)
          .audioCodec("libmp3lame")
          .audioQuality(0)
          .save(mp3Output)
          .on("end", () => {
            res.download(mp3Output, "output.mp3", (err) => {
              // Clean up temporary files
              fs.rmSync(outputDir, { recursive: true, force: true });
              if (err) console.error("Error sending file:", err);
            });
          })
          .on("error", (err) =>
            res.status(500).send("Error converting to MP3")
          );
      })
      .mergeToFile(concatOutput, outputDir); // Merge inputs into a single file
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

// HTML interface
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
