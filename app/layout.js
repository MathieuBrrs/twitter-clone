import "./globals.css";
export const metadata = {
  title: "Twitter Clone",
  description: "A simple Twitter clone built with Next.js",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
