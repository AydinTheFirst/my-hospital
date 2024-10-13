import { NextUIProvider } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useNavigate } from "react-router-dom";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate} validationBehavior="native">
      <NextThemesProvider attribute="class" defaultTheme="light">
        <I18nProvider locale="tr-TR">{children}</I18nProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
};
