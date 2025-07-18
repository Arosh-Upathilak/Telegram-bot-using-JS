﻿# Telegram YouTube Downloader Bot

This is a Telegram bot built with Node.js that allows users to download YouTube videos by sending a YouTube link. It downloads video and audio streams separately, merges them using FFmpeg, and sends the merged video back to the user.

---

## Features

- Download YouTube videos by sending the video link to the bot  
- Downloads highest quality video and audio streams separately  
- Merges video and audio into a single MP4 file  
- Sends the merged video back to the user on Telegram  
- Uses `ffmpeg-static` so no manual FFmpeg installation is required  

---

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Telegram-bot-using-JS.git
   cd Telegram-bot-using-JS
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Telegram bot token:

   ```
   BOT_TOKEN=your_telegram_bot_token_here
   ```
   
4. Use the following commands to install the necessary dependencies:
   ```
   npm install node-telegram-bot-api
   npm install @distube/ytdl-core
   npm install fluent-ffmpeg
   npm install ffmpeg-static
   npm install dotenv
   npm install nodemon 
   ```
   
5. Run the bot:

   ```bash
   node index.js
   ```

---

## Dependencies

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) — Telegram Bot API wrapper  
- [@distube/ytdl-core](https://github.com/distube/ytdl-core) — YouTube video/audio downloader  
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) — FFmpeg wrapper for merging streams  
- [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static) — Static FFmpeg binaries included  
- [dotenv](https://github.com/motdotla/dotenv) — Loads environment variables  

---

## Notes

- The bot merges audio and video streams using FFmpeg under the hood.  
- `ffmpeg-static` is used to avoid requiring a separate FFmpeg installation.  
- Make sure the bot token in `.env` is valid and your bot is started on Telegram.  

---

## License

MIT License

---

Feel free to contribute or raise issues!
