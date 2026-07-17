'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, PlusCircle, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Özet',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'AI Asistan',
      href: '/assistant',
      icon: Sparkles,
    },
    {
      name: 'Manuel Giriş',
      href: '/manual',
      icon: PlusCircle,
    },
    {
      name: 'Profil',
      href: '/profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-lg border-t border-zinc-200 px-6 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] md:max-w-md md:left-1/2 md:-translate-x-1/2 md:rounded-t-2xl md:border-x md:border-zinc-200">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-primary-green bg-primary-green-light scale-105 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 hover:scale-102'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[11px] tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
