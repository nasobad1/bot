require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
