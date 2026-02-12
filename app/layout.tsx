import "@/style/globals.css";
import Header from "@/component/Header";
import Background from "@/component/Background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen antialiased">
        <Header />
        <Background />

        {/* Your Page Content */}
        <main className="relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}