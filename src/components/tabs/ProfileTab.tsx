'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User as UserIcon, LogOut } from 'lucide-react';
import { logout } from '@/app/actions';

export default function ProfileTab() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    }
    loadProfile();
  }, [supabase]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Profilim</h1>
          <p className="text-xs text-zinc-500">Kullanıcı bilgileri ve ayarlar</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-green-light text-primary-green rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">{profile?.full_name || 'Yükleniyor...'}</h2>
            <p className="text-sm text-zinc-500">{user?.email}</p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">Hesap İşlemleri</h3>
          
          <form action={logout}>
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl transition duration-200"
            >
              <LogOut className="w-5 h-5" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
