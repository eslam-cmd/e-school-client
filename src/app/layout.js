
import createEmotionCache from "@/utils/emotionCache";
import Head from 'next/head';
const clientSideEmotionCache = createEmotionCache();


export const metadata = {
  title: "The main interface",
  description: "An integrated educational platform for managing students and lessons.",
  openGraph: {
    title: "E-School | Control Panel",
    description: "An integrated educational platform for managing students and lessons.",
    url: "https://e-school-client.vercel.app",
    siteName: "E-School",
    images: [
      {
        url: "logo2.jpg",
        width: 1200,
        height: 630,
        alt: "E-School Dashboard"
      }
    ],
    locale: "ar_AR",
    type: "website"
  }
};

export default function RootLayout({ children }) {


  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Monoton:wght@500&display=swap"
          rel="stylesheet"
        />
      </head >
      <body dir="ltr" suppressHydrationWarning>{children}</body>
    </html>
  );
}
