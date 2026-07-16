'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
    ...giderler.map(g => ({ ...g, tip: 'gider', ikon: ArrowDownRight, renk: 'text-rose-400' })),
    ...uretimSatis.map(u => ({ ...u, tip: 'uretim_satis', urun_adi: u.urun, tutar: u.toplam_tutar || (u.miktar_kg * u.birim_fiyat), ikon: ArrowUpRight, renk: 'text-emerald-400' })),
    ...disTicaret.map(d => ({ ...d, tip: 'dis_ticaret', tutar: d.kar || ((d.satis_fiyati - d.alis_fiyati) * d.miktar_kg), ikon: ArrowUpRight, renk: 'text-sky-400' }))
  ].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()).slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-300 font-medium animate-pulse-soft">Finansal Veriler Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yenileme Butonu */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">AgriERP Özet</h1>
          <p className="text-xs text-emerald-100/50">Günlük tarımsal analiz paneli</p>
        </div>
        <button 
          onClick={fetchData} 
          disabled={refreshing}
          className="p-2 rounded-xl bg-emerald-900/30 border border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/50 transition duration-200 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>


      {/* Ekran 1: Büyük Net Durum Göstergesi */}
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        {/* Dekoratif Arka Plan Işığı */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="w-5 h-5 text-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-100/60 font-semibold">Bu Ayki Net Durum</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className={`text-4xl font-extrabold tracking-tight ${netDurum >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netDurum >= 0 ? '+' : ''}{netDurum.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
          </span>
          <span className="text-xs text-emerald-100/50">
            Tüm gelir ve giderlerin net farkı
          </span>
        </div>
      </div>

      {/* Kendi Üretimimiz ve Dış Ticaret Kutu Kartları */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 relative">
          <div className="flex justify-between items-start">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-800/40 font-semibold">Kendi Üretim</span>
          </div>
          <div>
            <span className="block text-[10px] text-emerald-100/60">Satış Hasılatı</span>
            <span className="text-lg font-bold text-emerald-200">
              {uretimGelir.toLocaleString('tr-TR')} TL
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 relative">
          <div className="flex justify-between items-start">
            <Globe className="w-5 h-5 text-sky-400" />
            <span className="text-[9px] bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded-full border border-sky-800/40 font-semibold">Dış Ticaret</span>
          </div>
          <div>
            <span className="block text-[10px] text-emerald-100/60">Toplam Net Kar</span>
            <span className="text-lg font-bold text-sky-400">
              {disTicaretKar.toLocaleString('tr-TR')} TL
            </span>
          </div>
        </div>
      </div>

      {/* Giderlerin Dağılımı (Pasta Grafik) */}
      <div className="glass-card rounded-3xl p-5">
        <h2 className="text-sm font-semibold text-emerald-100/80 mb-4 flex items-center gap-2">
          <span>📊 Giderlerin Dağılımı</span>
          {toplamGider > 0 && <span className="text-xs font-normal text-emerald-100/40">({toplamGider.toLocaleString('tr-TR')} TL)</span>}
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
                    contentStyle={{ background: '#062013', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}
                    itemStyle={{ color: '#f0f7f3', fontSize: '11px' }}
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
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-emerald-100/70 font-medium">{data.name}</span>
                    </div>
                    <span className="text-emerald-100/40 font-semibold">%{percentage}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center border border-dashed border-emerald-800/30 rounded-2xl">
            <p className="text-xs text-emerald-100/40">Kayıtlı gider verisi bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Son İşlemler Listesi */}
      <div className="glass-card rounded-3xl p-5">
        <h2 className="text-sm font-semibold text-emerald-100/80 mb-3">📋 Son Yapılan İşlemler</h2>
        
        {sonIslemler.length > 0 ? (
          <div className="divide-y divide-emerald-800/20">
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
                    <div className={`p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/30 ${item.renk}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-emerald-100">{baslik}</span>
                      <span className="block text-[10px] text-emerald-100/50">{aciklamaDetay}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`block text-xs font-bold ${item.tip === 'gider' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.tip === 'gider' ? '-' : '+'}{parseFloat(item.tutar || 0).toLocaleString('tr-TR')} TL
                    </span>
                    <span className="text-[9px] text-emerald-100/30">
                      {new Date(item.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center border border-dashed border-emerald-800/30 rounded-2xl">
            <p className="text-xs text-emerald-100/40">Henüz hiçbir işlem kaydı yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
