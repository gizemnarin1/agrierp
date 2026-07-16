-- AgriERP Veritabanı Şeması
-- Supabase SQL Editor içine kopyalayıp çalıştırabilirsiniz.

-- 1. Giderler Tablosu
CREATE TABLE IF NOT EXISTS giderler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarih TIMESTAMPTZ NOT NULL DEFAULT now(),
    kategori TEXT NOT NULL, -- ilaç, gübre, işçi, mazot, fide, diğer
    tutar NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    aciklama TEXT
);

-- 2. Uretim Satis Tablosu (Kendi Üretimimiz Satış)
CREATE TABLE IF NOT EXISTS uretim_satis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarih TIMESTAMPTZ NOT NULL DEFAULT now(),
    sera_adi TEXT NOT NULL,
    urun TEXT NOT NULL,
    miktar_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    birim_fiyat NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    toplam_tutar NUMERIC(12, 2) GENERATED ALWAYS AS (miktar_kg * birim_fiyat) STORED
);

-- 3. Dis Ticaret Tablosu (Al-Sat Ticaret)
CREATE TABLE IF NOT EXISTS dis_ticaret (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarih TIMESTAMPTZ NOT NULL DEFAULT now(),
    urun_adi TEXT NOT NULL,
    alis_fiyati NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    satis_fiyati NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    miktar_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    kar NUMERIC(12, 2) GENERATED ALWAYS AS ((satis_fiyati - alis_fiyati) * miktar_kg) STORED
);

-- Kolay sorgulama için indeksler
CREATE INDEX IF NOT EXISTS idx_giderler_tarih ON giderler(tarih);
CREATE INDEX IF NOT EXISTS idx_uretim_satis_tarih ON uretim_satis(tarih);
CREATE INDEX IF NOT EXISTS idx_dis_ticaret_tarih ON dis_ticaret(tarih);
