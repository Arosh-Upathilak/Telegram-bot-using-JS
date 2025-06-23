const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static'); // Import ffmpeg-static
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();
const TOKEN = process.env.BOT_TOKEN;

// Tell fluent-ffmpeg to use the static ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegStatic);

// Create a new Telegram bot instance with polling
const bot = new TelegramBot(TOKEN, { polling: true });

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "👋 Welcome to AAU's YouTube Downloader Bot!\n\nPlease enter a YouTube video link to download."
  );
});

// Listen for all messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Check if message contains a YouTube link
  if (
    typeof messageText === 'string' &&
    (messageText.includes('youtube.com') || messageText.includes('youtu.be'))
  ) {
    try {
      const info = await ytdl.getInfo(messageText);
      const videoId = info.videoDetails.videoId;
      const downloadLink = `https://www.youtube.com/watch?v=${videoId}`;

      // Define file paths safely
      const mp4DownloadPath = path.resolve(__dirname, `video_${videoId}.mp4`);
      const mp3DownloadPath = path.resolve(__dirname, `audio_${videoId}.mp3`);
      const mergedFilePath = path.resolve(__dirname, `merged_${videoId}.mp4`);

      // Download video stream (video-only, mp4)
      const mp4DownloadStream = ytdl(downloadLink, {
        filter: (format) => format.container === 'mp4' && format.hasVideo && !format.hasAudio,
        quality: 'highestvideo',
      });
      const mp4FileStream = fs.createWriteStream(mp4DownloadPath);
      mp4DownloadStream.pipe(mp4FileStream);

      mp4FileStream.on('finish', () => {
        // Download audio stream (audio-only)
        const mp3DownloadStream = ytdl(downloadLink, {
          filter: 'audioonly',
          quality: 'highestaudio',
        });
        const mp3FileStream = fs.createWriteStream(mp3DownloadPath);
        mp3DownloadStream.pipe(mp3FileStream);

        mp3FileStream.on('finish', () => {
          // Merge audio and video using ffmpeg
          ffmpeg()
            .input(mp4DownloadPath)
            .input(mp3DownloadPath)
            .outputOptions('-c:v copy') // copy video codec to avoid re-encoding video
            .outputOptions('-c:a aac') // encode audio to AAC (mp4 compatible)
            .save(mergedFilePath)
            .on('end', () => {
              // Send merged video file to Telegram
              bot.sendVideo(chatId, mergedFilePath, {
                caption: '✅ Your video is ready! Enjoy!',
              }).then(() => {
                // Cleanup temp files
                fs.unlink(mp4DownloadPath, () => {});
                fs.unlink(mp3DownloadPath, () => {});
                fs.unlink(mergedFilePath, () => {});
              });
            })
            .on('error', (error) => {
              console.error('❌ Error while merging:', error);
              bot.sendMessage(chatId, '❌ Error while merging the files.');
              // Cleanup files on error
              [mp4DownloadPath, mp3DownloadPath, mergedFilePath].forEach((file) => {
                if (fs.existsSync(file)) fs.unlink(file, () => {});
              });
            });
        });

        mp3FileStream.on('error', (error) => {
          console.error('❌ Error downloading audio:', error);
          bot.sendMessage(chatId, '❌ Error while downloading audio.');
        });
      });

      mp4FileStream.on('error', (error) => {
        console.error('❌ Error downloading video:', error);
        bot.sendMessage(chatId, '❌ Error while downloading video.');
      });
    } catch (error) {
      console.error('❌ General error:', error);
      bot.sendMessage(chatId, '❌ Invalid or unsupported YouTube link.');
    }
  }
});
