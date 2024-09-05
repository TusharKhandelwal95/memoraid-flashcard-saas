import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import "./globals.css";
import theme from "@/lib/mui-theme";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Flashcards",
  description: "AI-powered flashcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <AppRouterCacheProvider>
              <MuiThemeProvider theme={theme}>
                {children}
                <Toaster />
              </MuiThemeProvider>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
