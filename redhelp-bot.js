import { Telegraf, Markup } from 'telegraf';

// Token copied directly from your BotFather setup
const BOT_TOKEN = '8798642467:AAHp8zaIVus8TaDUmIvkEvBfBDndyj-jjw0';
const MINI_APP_URL = 'https://plenty-clouds-expired-completing.trycloudflare.com/Redcloud/'; 

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const welcomeText = 
`👋 **Welcome to RedHelp Operations Platform!**

RedCloud provides centralized real-time monitoring, database telemetry tracking, and AI-powered SRE assistance.

🔒 **Authentication Required**
To start using the bot, run system diagnostics, or chat with the AI assistant, please authenticate via our secure Mini App below.`;

  return ctx.replyWithMarkdown(
    welcomeText,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Launch RedHelp Mini App', MINI_APP_URL)]
    ])
  );
});

bot.launch().then(() => console.log('🤖 RedHelp Bot is live and listening!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
