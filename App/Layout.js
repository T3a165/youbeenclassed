export const metadata = {
  title: "You Been Classed™ — The Verdict Engine",
  description:
    "Enter anything. We'll class it. AI-powered classification engine that delivers structured verdicts.",
  openGraph: {
    title: "You Been Classed™",
    description: "Enter anything. We'll class it.",
    url: "https://youbeenclassed.org",
    siteName: "You Been Classed™",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;700&family=Archivo+Black&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
