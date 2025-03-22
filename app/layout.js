import Navbar from "@/components/Navbar";
import { AuthProvider } from "./Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import ThemeProvider from "@/theme/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FRONTEND FRAMEWORK",
  description: "CE KMITL PROJECT",
  icons: {
    icon: "/favicon.png", // Path to your favicon in the public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" /> {/* Fallback for the PNG icon */}
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            {/* Place your Navbar here so it has access to the session */}
            {children} {/* This is where your page content will be rendered */}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
