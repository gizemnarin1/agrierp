'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="pt-20 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
      <div className="flex flex-col items-start gap-6">
        <h1 className="text-5xl lg:text-[5rem] font-black tracking-tight text-zinc-900 leading-[1.05]">
          TARIMIN GELECEĞİNİ YÖNETİN
        </h1>
        <p className="text-lg text-zinc-600 max-w-md mt-2">
          Verimliliği artırın, kaynakları optimize edin ve sürdürülebilir büyümeyi destekleyin.
        </p>
        <div className="flex flex-wrap items-center gap-6 mt-6">
          <Link 
            href="/dashboard"
            className="px-8 py-4 rounded-xl bg-primary-green text-white font-medium text-lg hover:bg-primary-green-hover transition-colors shadow-md"
          >
            Ücretsiz Demo İste
          </Link>
          <Link href="#features" className="text-zinc-600 font-medium hover:text-primary-green flex items-center gap-2 group">
            Daha fazla bilgi <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
      
      <div className="relative w-full aspect-square md:aspect-auto md:h-[550px] flex items-center justify-center">
        {/* Placeholder for the isometric image */}
        <img 
          src="/hero-image.png" 
          alt="Akıllı Tarım İzometrik Görseli" 
          className="w-full h-full object-contain drop-shadow-2xl"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/800x600/e8f0eb/3c6e47?text=Tarim+Gorseli';
          }}
        />
      </div>
    </section>
  );
}
