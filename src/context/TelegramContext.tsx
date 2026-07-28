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
    if (window.Telegram?.WebApp && window.Telegram.WebApp.initData) {
      const app = window.Telegram.WebApp;
      app.ready();
      setIsTelegram(true);
      setWebApp(app);
      
      // Optional: Expand to maximum available height
      app.expand();
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ isTelegram, webApp }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
