import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// OpenAI istemcisi
const apiKey = process.env.OPENAI_API_KEY || '';
const isOpenAIConfigured = apiKey && apiKey !== 'sk-proj-your-openai-api-key';

const openai = new OpenAI({
  apiKey: isOpenAIConfigured ? apiKey : 'placeholder_key',
});


export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Metin alanı zorunludur ve string olmalıdır.' },
        { status: 400 }
      );
    }

    let parsedData: {
      giderler: any[];
      uretim_satis: any[];
      dis_ticaret: any[];
    };
    if (!isOpenAIConfigured) {
      return NextResponse.json(
        { error: 'OpenAI API anahtarı yapılandırılmamış. Lütfen sunucu ayarlarını kontrol edin.' },
        { status: 500 }
      );
    }
    
    // OpenAI API'sini çağır
    try {
        const systemPrompt = `Sen tarım ve hal ticareti yapan işletmeler için bir ERP asistanısın. 
Kullanıcının Türkçe olarak girdiği serbest metinden şu üç kategoriye ait finansal işlemleri çıkarmalısın:
1. Giderler (giderler): Gübre, ilaç, işçi yevmiyesi, mazot, fide, elektrik vb. harcamalar.
2. Üretim Satışı (uretim_satis): Kendi serasından veya tarlasından toplanıp satılan ürünler. 'sera_adi', 'urun', 'miktar_kg' ve 'birim_fiyat' içermelidir.
3. Dış Ticaret (dis_ticaret): Dışarıdan veya halden alınıp üzerine kar eklenerek satılan (al-sat) ürünler. 'urun_adi', 'alis_fiyati', 'satis_fiyati' ve 'miktar_kg' içermelidir.

Tarih olarak bugünün tarihini ve saatini baz al.
Metinden çıkarılan tüm değerler sayısal (number) formatta olmalıdır.`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "parse_farming_data",
              schema: {
                type: "object",
                properties: {
                  giderler: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        kategori: { type: "string", description: "Harcama kategorisi: işçi, ilaç, gübre, mazot, fide, diğer" },
                        tutar: { type: "number", description: "Harcama tutarı (TL)" },
                        aciklama: { type: "string", description: "Gider açıklaması" }
                      },
                      required: ["kategori", "tutar"],
                      additionalProperties: false
                    }
                  },
                  uretim_satis: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        sera_adi: { type: "string", description: "Seranın adı veya numarası, örn: 1 Nolu Sera" },
                        urun: { type: "string", description: "Satılan ürünün adı, örn: domates" },
                        miktar_kg: { type: "number", description: "Miktar (kg)" },
                        birim_fiyat: { type: "number", description: "Kilo başına birim fiyat (TL)" }
                      },
                      required: ["sera_adi", "urun", "miktar_kg", "birim_fiyat"],
                      additionalProperties: false
                    }
                  },
                  dis_ticaret: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        urun_adi: { type: "string", description: "Ürünün adı, örn: elma" },
                        alis_fiyati: { type: "number", description: "Alış birim fiyatı (TL)" },
                        satis_fiyati: { type: "number", description: "Satış birim fiyatı (TL)" },
                        miktar_kg: { type: "number", description: "Miktar (kg)" }
                      },
                      required: ["urun_adi", "alis_fiyati", "satis_fiyati", "miktar_kg"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["giderler", "uretim_satis", "dis_ticaret"],
                additionalProperties: false
              },
              strict: true
            }
          }
        });

        const parsedContent = response.choices[0]?.message?.content;
        if (!parsedContent) {
          throw new Error("OpenAI'dan boş yanıt döndü.");
        }
        parsedData = JSON.parse(parsedContent);
      } catch (err: any) {
        console.error("OpenAI API Hatası:", err);
        return NextResponse.json(
          { error: 'OpenAI işleminizi ayrıştıramadı: ' + err.message },
          { status: 500 }
        );
      }

    // Verileri Supabase Veritabanına Kaydet
    const errors: string[] = [];
    const insertedDetails: string[] = [];

    // 1. Giderler
    if (parsedData.giderler && parsedData.giderler.length > 0) {
      const { data, error } = await supabase
        .from('giderler')
        .insert(parsedData.giderler.map(g => ({
          tarih: new Date().toISOString(),
          kategori: g.kategori,
          tutar: g.tutar,
          aciklama: g.aciklama || `${g.kategori} gideri`
        })))
        .select();

      if (error) {
        console.error("Giderler kaydedilirken hata oluştu:", error);
        errors.push(`Giderler: ${error.message}`);
      } else {
        parsedData.giderler.forEach(g => {
          insertedDetails.push(`💵 ${g.tutar} TL ${g.kategori} gideri (${g.aciklama || 'Açıklama yok'})`);
        });
      }
    }

    // 2. Üretim Satışı
    if (parsedData.uretim_satis && parsedData.uretim_satis.length > 0) {
      const { data, error } = await supabase
        .from('uretim_satis')
        .insert(parsedData.uretim_satis.map(u => ({
          tarih: new Date().toISOString(),
          sera_adi: u.sera_adi,
          urun: u.urun,
          miktar_kg: u.miktar_kg,
          birim_fiyat: u.birim_fiyat
          // toplam_tutar Postgres generated column
        })))
        .select();

      if (error) {
        console.error("Üretim satış kaydedilirken hata oluştu:", error);
        errors.push(`Üretim Satış: ${error.message}`);
      } else {
        parsedData.uretim_satis.forEach(u => {
          insertedDetails.push(`🍅 ${u.sera_adi}'ndan ${u.miktar_kg} kg ${u.urun} satışı (kg: ${u.birim_fiyat} TL, Toplam: ${u.miktar_kg * u.birim_fiyat} TL)`);
        });
      }
    }

    // 3. Dış Ticaret
    if (parsedData.dis_ticaret && parsedData.dis_ticaret.length > 0) {
      const { data, error } = await supabase
        .from('dis_ticaret')
        .insert(parsedData.dis_ticaret.map(d => ({
          tarih: new Date().toISOString(),
          urun_adi: d.urun_adi,
          alis_fiyati: d.alis_fiyati,
          satis_fiyati: d.satis_fiyati,
          miktar_kg: d.miktar_kg
          // kar Postgres generated column
        })))
        .select();

      if (error) {
        console.error("Dış ticaret kaydedilirken hata oluştu:", error);
        errors.push(`Dış Ticaret: ${error.message}`);
      } else {
        parsedData.dis_ticaret.forEach(d => {
          insertedDetails.push(`🍏 ${d.miktar_kg} kg ${d.urun_adi} al-sat satışı (Alış: ${d.alis_fiyati} TL, Satış: ${d.satis_fiyati} TL, Kar: ${(d.satis_fiyati - d.alis_fiyati) * d.miktar_kg} TL)`);
        });
      }
    }

    // Başarı mesajı oluşturma
    let summaryMessage = '';
    if (insertedDetails.length > 0) {
      summaryMessage = `✅ İşlemler başarıyla kaydedildi:\n` + insertedDetails.join('\n');
    } else {
      summaryMessage = `🤔 Girilen metinden kaydedilecek anlamlı bir finansal işlem çıkarılamadı. Lütfen miktarları ve tutarları belirterek tekrar deneyin.`;
    }

    if (errors.length > 0) {
      summaryMessage += `\n\n⚠️ Veritabanı Kayıt Sorunları:\n- ${errors.join('\n- ')}`;
    }

    return NextResponse.json({
      success: errors.length === 0,
      parsedData,
      message: summaryMessage,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error("API İşlem Hatası:", error);
    return NextResponse.json(
      { error: 'İşlem gerçekleştirilirken sunucu hatası oluştu: ' + error.message },
      { status: 500 }
    );
  }
}
