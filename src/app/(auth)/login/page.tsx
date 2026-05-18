import { LoginForm } from "@/features/auth/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950 p-4 overflow-hidden">
      {/* Decorative SaaS Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-100/50 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-100/50 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 mb-8 w-full max-w-md flex justify-center">
        <Image 
          src="/full_logo.png" 
          alt="Papiers Express" 
          width={400}
          height={100}
          className="h-20 w-auto object-contain dark:brightness-110 dark:contrast-125 transition-transform hover:scale-105 duration-300" 
          priority
        />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
