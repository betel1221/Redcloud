import os
import sys
import logging
from dotenv import load_dotenv
from functools import wraps

# Load environment variables from .env
load_dotenv()
from telegram import (
    Update, 
    InlineKeyboardButton, 
    InlineKeyboardMarkup, 
    KeyboardButton,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    WebAppInfo
)
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    filters,
    ContextTypes,
)

# Configure Logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Retrieve configuration
TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
ADMIN_PASSWORD = os.environ.get("BOT_ADMIN_PASSWORD", "admin123")

# Your verified live URL
WEB_APP_URL = "https://betel1221.github.io/redhelp-login/?v=6"

if not TOKEN:
    logger.critical("Error: TELEGRAM_BOT_TOKEN environment variable not set.")
    sys.exit(1)

# In-memory database of authorized user IDs
AUTHORIZED_USERS = set()

# Mock telemetry data
MOCK_DATA = {
    "database": (
        "🛢️ *Database Health:* 98% (Optimal performance)\n"
        "💾 *Storage Used:* 559 GB\n"
        "🔌 *Active Connections:* 136\n"
        "⚠️ *Slow Queries:* 19 / Hr"
    ),
    "server": (
        "🖥️ *Server Health:* 96% (All systems operational)\n"
        "📈 *CPU Usage:* 92% (App Server 01)\n"
        "🧠 *RAM Usage:* 74%\n"
        "🚨 *Status:* Worker Node B is currently Restarting."
    ),
    "security": (
        "🛡️ *Security Score:* 82%\n"
        "⚠️ *Threat Level:* ELEVATED\n"
        "❌ *Failed Logins:* 203 (+14% vs yesterday)\n"
        "🔒 *Blocked IPs:* 68 (Last 24 hours)"
    ),
    "admin": (
        "🤖 *AI Insight:* Database Server Memory Usage Increasing.\n"
        "💡 *Recommendation:* Increase RAM or optimize cache settings to prevent upcoming bottlenecks.\n\n"
        "🔔 *Alerts Summary:* 2 Critical, 5 High, 10 Medium, 18 Low."
    )
}

# -------------------------------------------------------------
# Keyboards & Navigation
# -------------------------------------------------------------

def get_dashboard_keyboard():
    """Generates the grid of action buttons for logged-in users."""
    keyboard = [
        [
            InlineKeyboardButton("🛢️ Database Health", callback_data="btn_database"),
            InlineKeyboardButton("🖥️ Server Health", callback_data="btn_server"),
        ],
        [
            InlineKeyboardButton("🛡️ Security Score", callback_data="btn_security"),
            InlineKeyboardButton("🤖 AI Insights", callback_data="btn_admin"),
        ],
        [
            InlineKeyboardButton("🔒 Log Out", callback_data="btn_logout")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)


def get_login_keyboard():
    """Generates a regular Keyboard Button. 
    Required for window.Telegram.WebApp.sendData() to work."""
    keyboard = [
        [
            KeyboardButton(
                text="🔑 Launch Login Portal", 
                web_app=WebAppInfo(url=WEB_APP_URL)
            )
        ]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=False)

# -------------------------------------------------------------
# Authentication Guard (Decorator)
# -------------------------------------------------------------

def authorized_only(func):
    """Decorator to restrict action button clicks only to verified admins."""
    @wraps(func)
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE, *args, **kwargs):
        user_id = None
        if update.message:
            user_id = update.message.from_user.id
        elif update.callback_query:
            user_id = update.callback_query.from_user.id
            
        if not user_id or user_id not in AUTHORIZED_USERS:
            logger.warning(f"Unauthorized access attempt by user ID: {user_id}")
            return  
        return await func(update, context, *args, **kwargs)
    return wrapper

# -------------------------------------------------------------
# Handlers
# -------------------------------------------------------------

async def start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Greets the user and opens the bottom Keyboard login."""
    user_id = update.message.from_user.id
    
    if user_id in AUTHORIZED_USERS:
        await update.message.reply_text(
            "💻 *Redhelp Infrastructure Dashboard*\nSelect a department below to view real-time mock data:",
            reply_markup=get_dashboard_keyboard(),
            parse_mode="Markdown"
        )
        return

    welcome_text = (
        "👋 *Welcome to Redhelp System Monitor.*\n\n"
        "To view protected system statistics, you must authorize your identity.\n"
        "Tap the keyboard button below to launch the secure login interface:"
    )
    await update.message.reply_text(
        welcome_text, 
        reply_markup=get_login_keyboard(), 
        parse_mode="Markdown"
    )


async def web_app_data_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Processes JSON data transmitted back from the Mini App."""
    user_id = update.message.from_user.id
    raw_data = update.message.web_app_data.data.strip()
    
    import json
    try:
        data = json.loads(raw_data)
        
        if data.get("type") == "system_alert":
            action = data.get("action")
            await update.message.reply_text(f"🚨 *System Alert Received!*\nAction executed: `{action}`", parse_mode="Markdown")
            
        elif data.get("type") == "ai_query":
            query = data.get("query")
            await update.message.reply_text(f"🤖 *AI Intelligence Module*\nI am analyzing your query:\n_{query}_", parse_mode="Markdown")
            
        elif data.get("action") == "login":
            if data.get("status") == "success":
                AUTHORIZED_USERS.add(user_id)
                await update.message.reply_text("✅ Logged in successfully via Mini App.")
                
    except json.JSONDecodeError:
        # Fallback if it's just a raw password (old behavior)
        if raw_data == ADMIN_PASSWORD:
            AUTHORIZED_USERS.add(user_id)
            logger.info(f"User {user_id} successfully logged in via Mini App.")
            await update.message.reply_text(
                "🔓 *Access Granted!*\nWelcome back, Administrator:",
                reply_markup=ReplyKeyboardRemove(),
                parse_mode="Markdown"
            )
            await update.message.reply_text(
                "Use the control center below to monitor systems:",
                reply_markup=get_dashboard_keyboard()
            )
        else:
            logger.warning(f"Failed login attempt via Mini App by user {user_id}.")
            await update.message.reply_text(
                "❌ *Incorrect Password.*\nAccess remains locked.",
                reply_markup=get_login_keyboard(),
                parse_mode="Markdown"
            )


async def restrict_unauthorized_messages(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Ignores or redirects any plain text sent by unauthorized users."""
    user_id = update.message.from_user.id
    
    if user_id not in AUTHORIZED_USERS:
        await update.message.reply_text(
            "🔒 *Locked:* Unauthorized inputs are ignored.\nUse the login button at the bottom or type `/start`.",
            parse_mode="Markdown"
        )


@authorized_only
async def button_callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handles click events from our dashboard buttons."""
    query = update.callback_query
    await query.answer()
    
    data_key = query.data.replace("btn_", "")
    
    if data_key == "logout":
        AUTHORIZED_USERS.discard(query.from_user.id)
        await query.message.reply_text(
            text="🔒 *You have logged out.*\nUse `/start` to log in again.",
            reply_markup=get_login_keyboard(),
            parse_mode="Markdown"
        )
        return

    # Serve the correct metrics
    metrics_text = MOCK_DATA.get(data_key, "Unknown metric.")
    
    # Update current text if different
    current_text = query.message.text
    new_text = f"💻 Redhelp Infrastructure Monitor\n\n{metrics_text}".replace('*', '') 
    
    if new_text not in current_text:
        await query.edit_message_text(
            text=f"💻 *Redhelp Infrastructure Monitor*\n\n{metrics_text}",
            reply_markup=get_dashboard_keyboard(),
            parse_mode="Markdown"
        )

# -------------------------------------------------------------
# Main Loop
# -------------------------------------------------------------

def main():
    logger.info("Initializing Redhelp Telegram Bot...")
    
    # We increase the read and connect timeouts to prevent network "TimedOut" errors
    app = (
        Application.builder()
        .token(TOKEN)
        .connect_timeout(30.0)
        .read_timeout(30.0)
        .build()
    )

    # Core commands
    app.add_handler(CommandHandler("start", start_handler))
    
    # Mini App callback handler
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data_handler))
    
    # Inline keyboard action handler
    app.add_handler(CallbackQueryHandler(button_callback_handler))
    
    # Block & restrict all non-command text from unauthorized users
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, restrict_unauthorized_messages))

    logger.info("Bot is polling. Press Ctrl+C to stop.")
    app.run_polling()


if __name__ == "__main__":
    main()