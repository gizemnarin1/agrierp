import { Sprout } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-zinc-400 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary-green" />
          <span className="text-lg font-bold text-white uppercase tracking-wider">AgriERP</span>
        </div>
        
        <div className="flex gap-6 text-sm">
          <Link href="#services" className="hover:text-white transition-colors">Hizmetler</Link>
          <Link href="#features" className="hover:text-white transition-colors">Özellikler</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Fiyatlandırma</Link>
          <Link href="#contact" className="hover:text-white transition-colors">İletişim</Link>
        </div>
      </div>
    </footer>
  );
}
