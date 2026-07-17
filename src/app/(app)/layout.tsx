import BottomNav from "@/components/BottomNav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-app-background text-app-foreground min-h-screen flex flex-col pb-24">
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-2 animate-slide-in">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
