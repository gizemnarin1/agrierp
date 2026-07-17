import Link from 'next/link';
import LoginForm from './LoginForm';
import { Sprout } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-green rounded-xl flex items-center justify-center shadow-lg mb-4">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">AgriERP'ye Hoş Geldiniz</h1>
          <p className="text-sm text-zinc-500 mt-1">Devam etmek için giriş yapın</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
          <LoginForm />
        </div>
        
        <p className="text-center text-sm text-zinc-500 mt-6">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="text-primary-green font-semibold hover:underline">
            Hemen Kayıt Olun
          </Link>
        </p>
      </div>
    </div>
  );
}
