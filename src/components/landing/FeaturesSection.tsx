import { Tractor, BarChart3, Truck, Layers } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Tractor,
      title: "Çiftlik Yönetimi",
      description: "Verimliliği artırın, kaynakları optimize edin ve sürdürülebilir yönetimi sağlayın.",
      highlighted: true
    },
    {
      icon: BarChart3,
      title: "Veri Analitiği",
      description: "Verimliliği artırın, kaynakları optimize edin ve sürdürülebilir büyümeyi destekleyin.",
      highlighted: false
    },
    {
      icon: Truck,
      title: "Tedarik Zinciri",
      description: "Tedarik optimizasyonu sağlayın, kaynakları verimli kullanın.",
      highlighted: false
    },
    {
      icon: Layers,
      title: "Kaynak Optimizasyonu",
      description: "Tüm kaynaklarınızı tek ekrandan analiz edin ve optimize edin.",
      highlighted: false
    }
  ];

  return (
    <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index} 
              className={`p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-2 cursor-default ${
                feature.highlighted 
                  ? 'bg-primary-green text-white shadow-xl shadow-primary-green/25 scale-105 z-10' 
                  : 'bg-white border border-zinc-100 text-zinc-900 shadow-sm hover:shadow-xl hover:shadow-black/5'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                feature.highlighted ? 'bg-white/20' : 'bg-zinc-50 border border-zinc-100'
              }`}>
                <Icon className={`w-7 h-7 ${feature.highlighted ? 'text-white' : 'text-zinc-700'}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className={`leading-relaxed ${feature.highlighted ? 'text-green-50/90' : 'text-zinc-500'}`}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
