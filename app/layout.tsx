import "@/style/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const backgroundPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.32'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <html lang="en">
      <body className="relative min-h-screen antialiased">
        {/* The Dynamic Background Layer */}
        <div 
          className="fixed inset-0 -z-10 h-full w-full"
          style={{ 
            background: 'linear-gradient(45deg, #f0ab86 0%, #f4d1a6 33%, #f4edb9 66%, #d8e8b6 100%)'
          }}
        >
          <div 
            className="absolute inset-0" 
            style={{ backgroundImage: backgroundPattern }}
          />
        </div>

        {/* Your Page Content */}
        <main className="relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}