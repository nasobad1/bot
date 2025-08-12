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

client.on('messageCreate', async message => {
  if (message.author.bot) return; // Bỏ qua tin nhắn của bot

  if (message.content.startsWith('!chat ')) {
    const prompt = message.content.slice(6); // Lấy nội dung sau "!chat "
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      const reply = response.choices[0].message.content;
      await message.reply(reply);
    } catch (error) {
      console.error('Lỗi khi gọi OpenAI API:', error);
      await message.reply('Có lỗi xảy ra khi gọi API OpenAI!');
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
