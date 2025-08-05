import { ThemeProvider as BaseThemeProvider } from "@/hooks/use-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseThemeProvider defaultTheme="system" storageKey="devbytes-ui-theme">
      {children}
    </BaseThemeProvider>
  );
}
