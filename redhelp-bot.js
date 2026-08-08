import { Telegraf, Markup } from 'telegraf';

// Token copied directly from your BotFather setup
const BOT_TOKEN = '8798642467:AAHp8zaIVus8TaDUmIvkEvBfBDndyj-jjw0';
const MINI_APP_URL = 'https://somerset-deutschland-discussions-showtimes.trycloudflare.com/Redcloud/'; 

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const welcomeText = 
`👋 **Welcome to RedHelp Operations Platform!**

RedCloud provides centralized real-time monitoring, database telemetry tracking, and AI-powered SRE assistance.

🔒 **Authentication Required**
To start using the bot, run system diagnostics, or chat with the AI assistant, please authenticate via our secure Mini App below.`;

  const launchUrl = `${MINI_APP_URL}?telegram_chat_id=${ctx.chat.id}`;

  return ctx.replyWithMarkdown(
    welcomeText,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Launch RedHelp Mini App', launchUrl)]
    ])
  );
});

// Automatically update Telegram's bottom menu button with the fresh Cloudflare URL on startup
bot.telegram.setChatMenuButton({
  menuButton: {
    type: 'web_app',
    text: 'Launch RedHelp',
    web_app: { url: MINI_APP_URL }
  }
}).then(() => console.log('✅ Bottom menu button URL updated in Telegram!'))
  .catch(err => console.warn('⚠️ Failed to set chat menu button:', err));

bot.launch().then(() => console.log('🤖 RedHelp Bot is live and listening!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
