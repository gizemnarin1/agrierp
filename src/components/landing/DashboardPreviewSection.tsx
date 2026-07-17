import { TrendingUp, Leaf, Droplets } from 'lucide-react';

export default function DashboardPreviewSection() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
          Gerçek Zamanlı Performans Paneli
        </h2>
        <p className="text-zinc-500 mb-16 max-w-xl mx-auto">
          Büyük ölçekli tarım işletmeleri için basit, modern analitik paneli ve veri görselleştirme.
        </p>

        {/* Dashboard Mockup */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl shadow-zinc-200/50 border border-zinc-100 mx-auto text-left relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Metric Card */}
            <div className="col-span-1 md:col-span-2 bg-zinc-50/50 border border-zinc-100 rounded-2xl p-6">
              <h4 className="text-sm font-medium text-zinc-500 mb-2">Verim Artışı</h4>
              <div className="text-5xl font-bold text-zinc-900 mb-6">%20</div>
              
              {/* Mock Chart SVG */}
              <div className="w-full h-32 relative">
                <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                  <path 
                    d="M0,80 Q50,90 100,60 T200,40 T300,50 T400,20 L400,100 L0,100 Z" 
                    fill="url(#gradientGreen)" 
                    opacity="0.2"
                  />
                  <path 
                    d="M0,80 Q50,90 100,60 T200,40 T300,50 T400,20" 
                    fill="none" 
                    stroke="#3c6e47" 
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3c6e47" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-4 text-xs text-zinc-400">
                  <span>Oca</span>
                  <span>Şub</span>
                  <span>Mar</span>
                  <span>Nis</span>
                  <span>May</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary-green bg-primary-green/10 px-2 py-1 rounded-md">
                  <TrendingUp className="w-3 h-3" /> Artış
                </div>
              </div>
            </div>

            {/* Smaller Metric Cards */}
            <div className="flex flex-col gap-6">
              <div className="bg-zinc-50/50 border border-zinc-100 rounded-2xl p-6 flex-1">
                <h4 className="text-sm font-medium text-zinc-500 mb-2">Kaynak Tasarrufu</h4>
                <div className="text-3xl font-bold text-zinc-900 mb-4">15%</div>
                <div className="w-full h-12">
                  <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M0,30 Q50,10 100,20 T200,5" fill="none" stroke="#6b7280" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div className="bg-zinc-50/50 border border-zinc-100 rounded-2xl p-6 flex-1">
                <h4 className="text-sm font-medium text-zinc-500 mb-2">Su Tasarrufu</h4>
                <div className="text-3xl font-bold text-zinc-900 mb-4">3%</div>
                <div className="w-full h-12">
                  <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M0,20 Q50,30 100,10 T200,25" fill="none" stroke="#6b7280" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
