import React, { createContext, useContext, useEffect, useState } from 'react';

// Declare Telegram types on window
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

interface TelegramContextType {
  isTelegram: boolean;
  webApp: any | null;
}

const TelegramContext = createContext<TelegramContextType>({
  isTelegram: false,
  webApp: null,
});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    // Check if the Telegram WebApp object is present and properly initialized.
    // WebApp.initData is only present if opened inside Telegram.
    const hasWebApp = window.Telegram?.WebApp && window.Telegram.WebApp.initData;

    if (hasWebApp) {
      const app = window.Telegram.WebApp;
      app.ready();
      setIsTelegram(true);
      setWebApp(app);
      app.expand();
    } else {
      console.log("🛠️ Running in Local Browser (Telegram Mock Mode Enabled)");
      
      const mockWebApp = {
        ready: () => console.log("[Telegram Mock] WebApp.ready()"),
        expand: () => console.log("[Telegram Mock] WebApp.expand()"),
        close: () => console.log("[Telegram Mock] WebApp.close()"),
        sendData: (data: string) => {
          console.log("[Telegram Mock] WebApp.sendData() payload:", data);
        },
        initData: "user=%7B%22id%22%3A12345678%2C%22first_name%22%3A%22LocalDev%22%2C%22username%22%3A%22local_tester%22%7D",
        initDataUnsafe: {
          user: {
            id: 12345678,
            first_name: "LocalDev",
            username: "local_tester"
          }
        },
        themeParams: {
          bg_color: "#1e1e2e",
          text_color: "#cdd6f4",
          hint_color: "#a6adc8",
          link_color: "#89b4fa",
          button_color: "#89b4fa",
          button_text_color: "#11111b"
        },
        colorScheme: "dark"
      };

      // Expose to window for the rest of the application
      window.Telegram = window.Telegram || {};
      window.Telegram.WebApp = mockWebApp;

      setIsTelegram(false); // Keep standard navigation visible for desktop browser debugging
      setWebApp(mockWebApp);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ isTelegram, webApp }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
