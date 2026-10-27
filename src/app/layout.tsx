import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apoorav Malik — Developer & Curious Human",
  description:
    "The personal portfolio of Apoorav Malik. Full-stack development, thoughtful interfaces, and experiments with AI. Explore selected projects and get in touch.",
  openGraph: {
    title: "Apoorav Malik — Developer & Curious Human",
    description:
      "Thoughtful code. Useful things. A selection of full-stack and AI projects by Apoorav Malik.",
    type: "website",
  },
  twitter: { card: "summary", creator: "@iamapoorav" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('portfolio-theme');if(t==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
