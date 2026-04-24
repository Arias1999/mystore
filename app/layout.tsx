
import "./globals.css";

export const metadata = {
  title: "Store System",
  description: "Simple Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

