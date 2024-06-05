import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import ChatProvider from "@/components/Message/ChatContext";
import UserProvider from "@/components/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social media platform",
  description: "we can connect to our friends..",
  icons:{
    icon:'/'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <ChatProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </ChatProvider>
          </ThemeProvider>

      </body>
    </html>
  );
}

