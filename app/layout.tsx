import "@/style/globals.css";
import Background from "@/component/Layout/Background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen antialiased">
        <Background />

        {/* Your Page Content */}
        <main className="relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}