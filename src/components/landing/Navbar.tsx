import Link from 'next/link';
import { Sprout } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-24 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Sprout className="w-7 h-7 text-primary-green" />
        <span className="text-xl font-extrabold tracking-tight text-zinc-900 uppercase">AgriERP</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
        <Link href="#services" className="hover:text-primary-green transition-colors">Hizmetler</Link>
        <Link href="#features" className="hover:text-primary-green transition-colors">Özellikler</Link>
        <Link href="#pricing" className="hover:text-primary-green transition-colors">Fiyatlandırma</Link>
        <Link href="#about" className="hover:text-primary-green transition-colors">Hakkımızda</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="hidden md:flex items-center justify-center px-6 py-3 rounded-xl bg-primary-green text-white font-medium text-sm hover:bg-primary-green-hover transition-colors shadow-sm"
        >
          Ücretsiz Demo İste
        </Link>
        <button className="md:hidden p-2 text-zinc-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </nav>
  );
}
