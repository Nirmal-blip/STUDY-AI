const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const TEMP_DIR = path.join(__dirname, "../../temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const run = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });

exports.getTranscript = async (videoId) => {
  try {
    const audioPath = path.join(TEMP_DIR, `${videoId}.webm`);

    // 1️⃣ Download audio (NO mp3 conversion)
    await run(
      `yt-dlp -f bestaudio -o "${audioPath}" https://www.youtube.com/watch?v=${videoId}`
    );

    // 2️⃣ Whisper (ffmpeg will decode webm automatically)
    const transcript = await run(
      `python3 whisper/transcribe.py "${audioPath}"`
    );

    return {
      transcript: transcript.trim(),
      metadata: {}, // duration optional later
    };
  } catch (err) {
    console.error("Whisper transcript failed:", err.message);
    return { transcript: null, metadata: {} };
  }
};
