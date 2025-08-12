require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Bot is running!');
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: "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",  // <-- Thay dòng này bằng project ID của bạn (dạng proj_xxx)
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // Bỏ qua tin nhắn từ bot
  if (message.author.bot) return;

  // ✅ Chỉ cho phép bot hoạt động ở 1 kênh cụ thể
  const allowedChannelId = '1404813031086624868'; // <-- thay bằng ID bạn vừa copy
  if (message.channel.id !== allowedChannelId) return;

  // Nội dung xử lý tiếp
  const prompt = message.content;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là một trợ lý giúp trả lời bằng tiếng Việt." },
        { role: "user", content: prompt }
      ],
    });
    const reply = response.choices[0].message.content;
    await message.reply(reply);
  } catch (error) {
    console.error('Lỗi khi gọi OpenAI API:', error);
    await message.reply('Có lỗi xảy ra khi gọi API OpenAI!');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
