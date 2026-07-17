import Link from 'next/link';
import RegisterForm from './RegisterForm';
import { Sprout } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-green rounded-xl flex items-center justify-center shadow-lg mb-4">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Hesap Oluştur</h1>
          <p className="text-sm text-zinc-500 mt-1">AgriERP'ye katılın</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
          <RegisterForm />
        </div>
        
        <p className="text-center text-sm text-zinc-500 mt-6">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-primary-green font-semibold hover:underline">
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
