-- AgriERP Gelişmiş Veritabanı Şeması (Oturum ve Çoklu Kullanıcı Destekli)
-- Supabase SQL Editor içine kopyalayıp çalıştırabilirsiniz.
-- ÖNEMLİ: Bu scripti çalıştırmadan önce mevcut tablolarınızın yedeğini almayı unutmayın,
-- çünkü bu script tabloları yeniden oluşturabilir veya yapılarını değiştirebilir.

-- ==========================================
-- 1. PROFILES TABLOSU (Kullanıcı Profilleri)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    farm_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profil Tablosu İçin RLS Politikaları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi profillerini görebilir" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Yeni kullanıcı kaydolduğunda otomatik profil oluşturacak Trigger fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı auth.users tablosuna bağlama (Eğer daha önce eklendiyse hata vermemesi için DROP IF EXISTS)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. GİDERLER TABLOSU
-- ==========================================
CREATE TABLE IF NOT EXISTS public.giderler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    tarih TIMESTAMPTZ NOT NULL DEFAULT now(),
    kategori TEXT NOT NULL, -- ilaç, gübre, işçi, mazot, fide, elektrik, diğer vb.
    tutar NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    aciklama TEXT
);

-- Kolay sorgulama için indeksler
CREATE INDEX IF NOT EXISTS idx_giderler_tarih ON public.giderler(tarih);
CREATE INDEX IF NOT EXISTS idx_giderler_user_id ON public.giderler(user_id);

-- RLS Politikaları
ALTER TABLE public.giderler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi giderlerini görebilir" ON public.giderler
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar gider ekleyebilir" ON public.giderler
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi giderlerini güncelleyebilir" ON public.giderler
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi giderlerini silebilir" ON public.giderler
    FOR DELETE USING (auth.uid() = user_id);


-- ==========================================
-- 3. ÜRETİM SATIŞ TABLOSU (Kendi Üretimimiz)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.uretim_satis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    tarih TIMESTAMPTZ NOT NULL DEFAULT now(),
    sera_adi TEXT NOT NULL,
    urun TEXT NOT NULL,
    miktar_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    birim_fiyat NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    toplam_tutar NUMERIC(12, 2) GENERATED ALWAYS AS (miktar_kg * birim_fiyat) STORED
);

CREATE INDEX IF NOT EXISTS idx_uretim_satis_tarih ON public.uretim_satis(tarih);
CREATE INDEX IF NOT EXISTS idx_uretim_satis_user_id ON public.uretim_satis(user_id);

ALTER TABLE public.uretim_satis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi üretim satışlarını görebilir" ON public.uretim_satis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar üretim satışı ekleyebilir" ON public.uretim_satis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi üretim satışlarını güncelleyebilir" ON public.uretim_satis
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi üretim satışlarını silebilir" ON public.uretim_satis
    FOR DELETE USING (auth.uid() = user_id);


-- ==========================================
-- 4. DIŞ TİCARET TABLOSU (Al-Sat)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.dis_ticaret (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    tarih TIMESTAMPTZ NOT NULL DEFAULT now(),
    urun_adi TEXT NOT NULL,
    alis_fiyati NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    satis_fiyati NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    miktar_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    kar NUMERIC(12, 2) GENERATED ALWAYS AS ((satis_fiyati - alis_fiyati) * miktar_kg) STORED
);

CREATE INDEX IF NOT EXISTS idx_dis_ticaret_tarih ON public.dis_ticaret(tarih);
CREATE INDEX IF NOT EXISTS idx_dis_ticaret_user_id ON public.dis_ticaret(user_id);

ALTER TABLE public.dis_ticaret ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi dış ticaret kayıtlarını görebilir" ON public.dis_ticaret
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar dış ticaret ekleyebilir" ON public.dis_ticaret
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi dış ticaret kayıtlarını güncelleyebilir" ON public.dis_ticaret
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi dış ticaret kayıtlarını silebilir" ON public.dis_ticaret
    FOR DELETE USING (auth.uid() = user_id);
