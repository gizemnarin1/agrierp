export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Sistem sayesinde çiftlik yönetimini belgeledik ve üretim kalitemizi artırdık.",
      name: "Jordan",
      role: "Şirket Yöneticisi",
      company: "COMPANY"
    },
    {
      quote: "Gelişmiş çiftlik yönetim sistemleri ile operasyonlarımızı tamamen otomatikleştirdik.",
      name: "Robert Alison",
      role: "Satış & Pazarlama",
      company: "Company"
    },
    {
      quote: "Büyük tarım işletmemiz için bu çözümü tercih ettik ve süreçlerimiz çok hızlandı.",
      name: "Marlon",
      role: "Firma Sahibi",
      company: "COMPANY"
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {testimonials.map((t, i) => (
          <div key={i} className="flex flex-col items-center">
            <p className="text-zinc-600 mb-8 italic">"{t.quote}"</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${t.name}`} 
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-bold text-zinc-900">{t.name}</div>
                <div className="text-sm text-zinc-500">{t.role}</div>
              </div>
            </div>
            
            <div className="text-zinc-400 font-bold tracking-widest uppercase text-sm">
              {t.company}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
