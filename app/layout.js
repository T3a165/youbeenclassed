export const metadata = {
title: “YouBeenClassed — The Human Leverage Engine”,
description: “AI-powered platform that helps everyday people gain advantages through automation and intelligent systems.”,
openGraph: {
title: “YouBeenClassed — The Human Leverage Engine”,
description: “Make money. Fix things. Learn anything. Build something. Improve yourself. Save time.”,
url: “https://youbeenclassed.org”,
siteName: “YouBeenClassed”,
type: “website”,
},
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
</head>
<body style={{ margin: 0, padding: 0, backgroundColor: “#0a0a0a” }}>{children}</body>
</html>
);
}