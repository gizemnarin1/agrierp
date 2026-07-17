import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { logout } from './actions';

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-3xl shadow-sm border-b border-zinc-200">
        <h1 className="text-2xl font-bold text-zinc-900">Profilim</h1>
        <p className="text-sm text-zinc-500">Kullanıcı bilgileri ve ayarlar</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-green-light text-primary-green rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">{profile?.full_name || 'Kullanıcı'}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
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
