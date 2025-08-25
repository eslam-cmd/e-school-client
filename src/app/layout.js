"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/utils/emotionCache";
import Head from 'next/head';
const clientSideEmotionCache = createEmotionCache();
export default function RootLayout({ children }) {
  return (
    <>
     <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Fjalla+One&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lalezar&display=swap" rel="stylesheet"
        />
      </Head>

    <html lang="ar" suppressHydrationWarning >
<body suppressHydrationWarning>{children}</body>
    </html>
    </>
  );
}
