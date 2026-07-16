'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Sprout, Wallet, Globe, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

type FormTab = 'gider' | 'uretim_satis' | 'dis_ticaret';

export default function ManualEntry() {
  const [activeTab, setActiveTab] = useState<FormTab>('gider');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form States
  // 1. Giderler
  const [giderKategori, setGiderKategori] = useState('gübre');
  const [giderTutar, setGiderTutar] = useState('');
  const [giderAciklama, setGiderAciklama] = useState('');

  // 2. Üretim Satış
  const [uretimSera, setUretimSera] = useState('1 Nolu Sera');
  const [uretimUrun, setUretimUrun] = useState('Domates');
  const [uretimMiktar, setUretimMiktar] = useState('');
  const [uretimFiyat, setUretimFiyat] = useState('');

  // 3. Dış Ticaret
  const [ticaretUrun, setTicaretUrun] = useState('Elma');
  const [ticaretAlis, setTicaretAlis] = useState('');
  const [ticaretSatis, setTicaretSatis] = useState('');
  const [ticaretMiktar, setTicaretMiktar] = useState('');

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => {
      setStatus(null);
    }, 4000);
  };

  const handleGiderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giderTutar) return;
    setLoading(true);

    try {
      const payload = {
        tarih: new Date().toISOString(),
        kategori: giderKategori,
        tutar: parseFloat(giderTutar),
        aciklama: giderAciklama || `${giderKategori} gideri`
      };

      const { error } = await supabase.from('giderler').insert([payload]);

      if (error) throw error;

      showStatus('success', `💵 ${giderTutar} TL tutarındaki ${giderKategori} gideri başarıyla kaydedildi.`);
      setGiderTutar('');
      setGiderAciklama('');
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Veritabanı hatası: Kayıt yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleUretimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uretimMiktar || !uretimFiyat) return;
    setLoading(true);

    try {
      const payload = {
        tarih: new Date().toISOString(),
        sera_adi: uretimSera,
        urun: uretimUrun,
        miktar_kg: parseFloat(uretimMiktar),
        birim_fiyat: parseFloat(uretimFiyat)
      };

      const { error } = await supabase.from('uretim_satis').insert([payload]);

      if (error) throw error;

      const toplam = parseFloat(uretimMiktar) * parseFloat(uretimFiyat);
      showStatus('success', `🍅 ${uretimSera}'ndan ${uretimMiktar} kg ${uretimUrun} satışı (${toplam} TL) başarıyla kaydedildi.`);
      setUretimMiktar('');
      setUretimFiyat('');
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Veritabanı hatası: Kayıt yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleTicaretSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticaretAlis || !ticaretSatis || !ticaretMiktar) return;
    setLoading(true);

    try {
      const payload = {
        tarih: new Date().toISOString(),
        urun_adi: ticaretUrun,
        alis_fiyati: parseFloat(ticaretAlis),
        satis_fiyati: parseFloat(ticaretSatis),
        miktar_kg: parseFloat(ticaretMiktar)
      };

      const { error } = await supabase.from('dis_ticaret').insert([payload]);

      if (error) throw error;

      const kar = (parseFloat(ticaretSatis) - parseFloat(ticaretAlis)) * parseFloat(ticaretMiktar);
      showStatus('success', `🍏 ${ticaretMiktar} kg ${ticaretUrun} al-sat satışı (${kar} TL Kar) başarıyla kaydedildi.`);
      setTicaretAlis('');
      setTicaretSatis('');
      setTicaretMiktar('');
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Veritabanı hatası: Kayıt yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">Manuel Kayıt</h1>
        <p className="text-xs text-emerald-100/50">Formları kullanarak el ile veri girişi yapın</p>
      </div>

      {/* Durum Bildirim Alanı (Toast) */}
      {status && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 border animate-slide-in ${
          status.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' 
            : 'bg-rose-950/80 border-rose-500/30 text-rose-200'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs leading-tight font-medium">{status.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-emerald-950/60 border border-emerald-900/60 p-1.5 rounded-2xl gap-1">
        <button
          onClick={() => setActiveTab('gider')}
          className={`flex-1 py-3 text-center text-xs font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'gider' ? 'bg-emerald-800 text-emerald-50 shadow-md' : 'text-emerald-100/60 hover:text-emerald-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Gider
        </button>
        <button
          onClick={() => setActiveTab('uretim_satis')}
          className={`flex-1 py-3 text-center text-xs font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'uretim_satis' ? 'bg-emerald-800 text-emerald-50 shadow-md' : 'text-emerald-100/60 hover:text-emerald-100'
          }`}
        >
          <Sprout className="w-4 h-4" />
          Kendi Üretim
        </button>
        <button
          onClick={() => setActiveTab('dis_ticaret')}
          className={`flex-1 py-3 text-center text-xs font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'dis_ticaret' ? 'bg-emerald-800 text-emerald-50 shadow-md' : 'text-emerald-100/60 hover:text-emerald-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          Dış Ticaret
        </button>
      </div>

      {/* Form Alanları */}
      <div className="glass-card rounded-3xl p-6">
        {/* Tab 1: Giderler */}
        {activeTab === 'gider' && (
          <form onSubmit={handleGiderSubmit} className="space-y-5">
            <h3 className="text-sm font-bold text-emerald-100 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Gider Girişi
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Kategori</label>
              <select
                value={giderKategori}
                onChange={(e) => setGiderKategori(e.target.value)}
                className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-3 py-3.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="gübre" className="bg-emerald-950 text-emerald-100">Gübre</option>
                <option value="ilaç" className="bg-emerald-950 text-emerald-100">İlaç</option>
                <option value="işçi" className="bg-emerald-950 text-emerald-100">İşçilik</option>
                <option value="mazot" className="bg-emerald-950 text-emerald-100">Mazot</option>
                <option value="fide" className="bg-emerald-950 text-emerald-100">Fide</option>
                <option value="elektrik" className="bg-emerald-950 text-emerald-100">Elektrik / Su</option>
                <option value="diğer" className="bg-emerald-950 text-emerald-100">Diğer Harcama</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Tutar (TL)</label>
              <input
                type="number"
                step="any"
                required
                value={giderTutar}
                onChange={(e) => setGiderTutar(e.target.value)}
                placeholder="Örn: 1500"
                className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-4 py-3.5 text-xs text-emerald-100 placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Açıklama</label>
              <input
                type="text"
                value={giderAciklama}
                onChange={(e) => setGiderAciklama(e.target.value)}
                placeholder="Örn: Seraya gübreleme yapıldı"
                className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-4 py-3.5 text-xs text-emerald-100 placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl transition duration-200 shadow-lg active:scale-97 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Kaydediliyor...' : 'Gider Kaydını Tamamla'}
            </button>
          </form>
        )}

        {/* Tab 2: Üretim Satışı */}
        {activeTab === 'uretim_satis' && (
          <form onSubmit={handleUretimSubmit} className="space-y-5">
            <h3 className="text-sm font-bold text-emerald-100 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Üretim Satış Girişi
            </h3>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Sera Adı / No</label>
              <select
                value={uretimSera}
                onChange={(e) => setUretimSera(e.target.value)}
                className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-3 py-3.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="1 Nolu Sera" className="bg-emerald-950 text-emerald-100">1 Nolu Sera</option>
                <option value="2 Nolu Sera" className="bg-emerald-950 text-emerald-100">2 Nolu Sera</option>
                <option value="3 Nolu Sera" className="bg-emerald-950 text-emerald-100">3 Nolu Sera</option>
                <option value="Açık Tarla" className="bg-emerald-950 text-emerald-100">Açık Tarla / Bahçe</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Satılan Ürün</label>
              <select
                value={uretimUrun}
                onChange={(e) => setUretimUrun(e.target.value)}
                className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-3 py-3.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Domates" className="bg-emerald-950 text-emerald-100">Domates</option>
                <option value="Salatalık" className="bg-emerald-950 text-emerald-100">Salatalık</option>
                <option value="Biber" className="bg-emerald-950 text-emerald-100">Biber</option>
                <option value="Patlıcan" className="bg-emerald-950 text-emerald-100">Patlıcan</option>
                <option value="Diğer" className="bg-emerald-950 text-emerald-100">Diğer Ürün</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Miktar (kg)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={uretimMiktar}
                  onChange={(e) => setUretimMiktar(e.target.value)}
                  placeholder="Örn: 500"
                  className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-4 py-3.5 text-xs text-emerald-100 placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Birim Fiyat (TL)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={uretimFiyat}
                  onChange={(e) => setUretimFiyat(e.target.value)}
                  placeholder="Örn: 20"
                  className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-4 py-3.5 text-xs text-emerald-100 placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {uretimMiktar && uretimFiyat && (
              <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-850 text-center">
                Toplam Satış Tutarı: <span className="font-bold">{(parseFloat(uretimMiktar) * parseFloat(uretimFiyat)).toLocaleString('tr-TR')} TL</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl transition duration-200 shadow-lg active:scale-97 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Kaydediliyor...' : 'Satış Kaydını Tamamla'}
            </button>
          </form>
        )}

        {/* Tab 3: Dış Ticaret (Al-Sat) */}
        {activeTab === 'dis_ticaret' && (
          <form onSubmit={handleTicaretSubmit} className="space-y-5">
            <h3 className="text-sm font-bold text-emerald-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              Dış Ticaret (Al-Sat) Girişi
            </h3>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Ürün Adı</label>
              <select
                value={ticaretUrun}
                onChange={(e) => setTicaretUrun(e.target.value)}
                className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-3 py-3.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Elma" className="bg-emerald-950 text-emerald-100">Elma</option>
                <option value="Limon" className="bg-emerald-950 text-emerald-100">Limon</option>
                <option value="Armut" className="bg-emerald-950 text-emerald-100">Armut</option>
                <option value="Portakal" className="bg-emerald-950 text-emerald-100">Portakal</option>
                <option value="Mandalina" className="bg-emerald-950 text-emerald-100">Mandalina</option>
                <option value="Patates" className="bg-emerald-950 text-emerald-100">Patates</option>
                <option value="Soğan" className="bg-emerald-950 text-emerald-100">Soğan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Miktar (kg)</label>
              <input
                type="number"
                step="any"
                required
                value={ticaretMiktar}
                onChange={(e) => setTicaretMiktar(e.target.value)}
                placeholder="Örn: 1000"
                className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-4 py-3.5 text-xs text-emerald-100 placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Alış Fiyatı (TL/kg)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={ticaretAlis}
                  onChange={(e) => setTicaretAlis(e.target.value)}
                  placeholder="Örn: 12"
                  className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-4 py-3.5 text-xs text-emerald-100 placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-wide">Satış Fiyatı (TL/kg)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={ticaretSatis}
                  onChange={(e) => setTicaretSatis(e.target.value)}
                  placeholder="Örn: 18"
                  className="w-full bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-4 py-3.5 text-xs text-emerald-100 placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {ticaretAlis && ticaretSatis && ticaretMiktar && (
              <div className="text-[11px] text-sky-300 bg-emerald-950/40 p-2.5 rounded-xl border border-sky-950 text-center flex items-center justify-between">
                <span>Alış: {parseFloat(ticaretAlis) * parseFloat(ticaretMiktar)} TL</span>
                <ArrowRight className="w-3 h-3 text-sky-400" />
                <span>Satış: {parseFloat(ticaretSatis) * parseFloat(ticaretMiktar)} TL</span>
                <ArrowRight className="w-3 h-3 text-sky-400" />
                <span className="font-bold text-emerald-400">Net Kar: {((parseFloat(ticaretSatis) - parseFloat(ticaretAlis)) * parseFloat(ticaretMiktar)).toLocaleString('tr-TR')} TL</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl transition duration-200 shadow-lg active:scale-97 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Kaydediliyor...' : 'Ticari Kaydı Tamamla'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
