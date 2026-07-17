'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Sprout, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight,
  Database,
  RefreshCw,
  Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [giderler, setGiderler] = useState<any[]>([]);
  const [uretimSatis, setUretimSatis] = useState<any[]>([]);
  const [disTicaret, setDisTicaret] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  async function fetchData() {
    try {
      setRefreshing(true);
      // Verileri çek
      const [gRes, uRes, dRes] = await Promise.all([
        supabase.from('giderler').select('*').order('tarih', { ascending: false }),
        supabase.from('uretim_satis').select('*').order('tarih', { ascending: false }),
        supabase.from('dis_ticaret').select('*').order('tarih', { ascending: false })
      ]);

      setGiderler(gRes.data || []);
      setUretimSatis(uRes.data || []);
      setDisTicaret(dRes.data || []);
    } catch (error) {
      console.error("Supabase verileri yüklenemedi.", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Hesaplamalar
  const toplamGider = giderler.reduce((acc, curr) => acc + parseFloat(curr.tutar || 0), 0);
  
  const uretimGelir = uretimSatis.reduce((acc, curr) => {
    // toplam_tutar Postgres'te generated column değilse manuel de hesaplanabilir
    const t = curr.toplam_tutar || (parseFloat(curr.miktar_kg || 0) * parseFloat(curr.birim_fiyat || 0));
    return acc + t;
  }, 0);

  const disTicaretKar = disTicaret.reduce((acc, curr) => {
    const k = curr.kar || ((parseFloat(curr.satis_fiyati || 0) - parseFloat(curr.alis_fiyati || 0)) * parseFloat(curr.miktar_kg || 0));
    return acc + k;
  }, 0);

  // Kendi üretimimizde giderleri tarlaya/üretime sayıp satış fiyatını direkt kar hanesine yazıyoruz (ya da net karda satış eksi giderler)
  const netDurum = uretimGelir + disTicaretKar - toplamGider;

  // Gider Kategorisi Dağılımı (Grafik için)
  const giderDagilimMap: { [key: string]: number } = {};
  giderler.forEach(g => {
    const kat = g.kategori || 'diğer';
    giderDagilimMap[kat] = (giderDagilimMap[kat] || 0) + parseFloat(g.tutar || 0);
  });

  const chartData = Object.keys(giderDagilimMap).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: giderDagilimMap[key]
  }));

  // Son İşlemleri Birleştir ve Sırala
  const sonIslemler = [
    ...giderler.map(g => ({ ...g, tip: 'gider', ikon: ArrowDownRight, renk: 'text-rose-600' })),
    ...uretimSatis.map(u => ({ ...u, tip: 'uretim_satis', urun_adi: u.urun, tutar: u.toplam_tutar || (u.miktar_kg * u.birim_fiyat), ikon: ArrowUpRight, renk: 'text-primary-green' })),
    ...disTicaret.map(d => ({ ...d, tip: 'dis_ticaret', tutar: d.kar || ((d.satis_fiyati - d.alis_fiyati) * d.miktar_kg), ikon: ArrowUpRight, renk: 'text-blue-600' }))
  ].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()).slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary-green font-medium animate-pulse-soft">Finansal Veriler Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yenileme Butonu */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">AgriERP Özet</h1>
          <p className="text-xs text-zinc-500">Günlük tarımsal analiz paneli</p>
        </div>
        <button 
          onClick={fetchData} 
          disabled={refreshing}
          className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:bg-zinc-200 transition duration-200 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>


      {/* Ekran 1: Büyük Net Durum Göstergesi */}
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        {/* Dekoratif Arka Plan Işığı */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-green/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="w-5 h-5 text-primary-green" />
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Bu Ayki Net Durum</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className={`text-4xl font-extrabold tracking-tight ${netDurum >= 0 ? 'text-primary-green' : 'text-rose-600'}`}>
            {netDurum >= 0 ? '+' : ''}{netDurum.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
          </span>
          <span className="text-xs text-zinc-500">
            Tüm gelir ve giderlerin net farkı
          </span>
        </div>
      </div>

      {/* Kendi Üretimimiz ve Dış Ticaret Kutu Kartları */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 relative">
          <div className="flex justify-between items-start">
            <Sprout className="w-5 h-5 text-primary-green" />
            <span className="text-[9px] bg-primary-green-light text-primary-green px-1.5 py-0.5 rounded-full border border-primary-green/20 font-semibold">Kendi Üretim</span>
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500">Satış Hasılatı</span>
            <span className="text-lg font-bold text-zinc-900">
              {uretimGelir.toLocaleString('tr-TR')} TL
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 relative">
          <div className="flex justify-between items-start">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-200 font-semibold">Dış Ticaret</span>
          </div>
          <div>
            <span className="block text-[10px] text-zinc-500">Toplam Net Kar</span>
            <span className="text-lg font-bold text-blue-600">
              {disTicaretKar.toLocaleString('tr-TR')} TL
            </span>
          </div>
        </div>
      </div>

      {/* Giderlerin Dağılımı (Pasta Grafik) */}
      <div className="glass-card rounded-3xl p-5">
        <h2 className="text-sm font-semibold text-zinc-800 mb-4 flex items-center gap-2">
          <span>📊 Giderlerin Dağılımı</span>
          {toplamGider > 0 && <span className="text-xs font-normal text-zinc-400">({toplamGider.toLocaleString('tr-TR')} TL)</span>}
        </h2>
        
        {chartData.length > 0 ? (
          <div className="flex items-center justify-between gap-2 h-40">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={52}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontSize: '11px', fontWeight: '500' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Grafik Lejantı */}
            <div className="w-1/2 flex flex-col gap-2 justify-center">
              {chartData.map((data, index) => {
                const percentage = ((data.value / toplamGider) * 100).toFixed(0);
                return (
                  <div key={data.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-zinc-600 font-medium">{data.name}</span>
                    </div>
                    <span className="text-zinc-400 font-semibold">%{percentage}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
            <p className="text-xs text-zinc-400">Kayıtlı gider verisi bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Son İşlemler Listesi */}
      <div className="glass-card rounded-3xl p-5">
        <h2 className="text-sm font-semibold text-zinc-800 mb-3">📋 Son Yapılan İşlemler</h2>
        
        {sonIslemler.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {sonIslemler.map((item: any, index) => {
              const Icon = item.ikon;
              
              let baslik = '';
              let aciklamaDetay = '';
              
              if (item.tip === 'gider') {
                baslik = item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1) + ' Gideri';
                aciklamaDetay = item.aciklama || '';
              } else if (item.tip === 'uretim_satis') {
                baslik = `${item.sera_adi || 'Sera'} - ${item.urun_adi || 'Ürün'}`;
                aciklamaDetay = `${item.miktar_kg} kg satış`;
              } else {
                baslik = `Al-Sat: ${item.urun_adi}`;
                aciklamaDetay = `${item.miktar_kg} kg ticari satış`;
              }

              return (
                <div key={item.id + index} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-zinc-50 border border-zinc-100 ${item.renk}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-zinc-800">{baslik}</span>
                      <span className="block text-[10px] text-zinc-500">{aciklamaDetay}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`block text-xs font-bold ${item.tip === 'gider' ? 'text-rose-600' : 'text-primary-green'}`}>
                      {item.tip === 'gider' ? '-' : '+'}{parseFloat(item.tutar || 0).toLocaleString('tr-TR')} TL
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      {new Date(item.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
            <p className="text-xs text-zinc-400">Henüz hiçbir işlem kaydı yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
