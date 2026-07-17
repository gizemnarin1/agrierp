
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-app-background text-app-foreground min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
