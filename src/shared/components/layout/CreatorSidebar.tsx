"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/shared/components/ui/button";
import {
  LayoutDashboard,
  TrendingUp,
  Tag,
  Users,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/shared/components/ui/sheet";

export const creatorNavigation = [
  { name: "Tableau de bord", href: "/my-space/dashboard", icon: LayoutDashboard },
  { name: "Performances", href: "/my-space/performance", icon: TrendingUp },
  { name: "Mes Codes Promo", href: "/my-space/promo-codes", icon: Tag },
  { name: "Mes Leads", href: "/my-space/leads", icon: Users },
  { name: "Mes Contrats", href: "/my-space/contracts", icon: FileText },
  { name: "Mon Profil", href: "/my-space/profile", icon: User },
];

export function CreatorSidebar() {
  const pathname = usePathname();
  const { logout, creatorProfile } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="hidden md:flex relative flex-col h-screen bg-slate-900 text-white border-r border-slate-800 shadow-xl z-20"
    >
      <div className="flex items-center justify-between h-20 px-4 border-b border-slate-800">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3 w-full"
          >
            <Image
              src="/logo-icone.png"
              alt="Papiers Express"
              width={40}
              height={40}
              className="h-10 w-10 object-contain brightness-0 invert"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-white">My Space</span>
              <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Creator Pro</span>
            </div>
          </motion.div>
        )}
        {isCollapsed && (
          <Image
            src="/logo-icone.png"
            alt="Papiers Express"
            width={40}
            height={40}
            className="h-10 w-10 mx-auto object-contain brightness-0 invert"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-6 h-8 w-8 rounded-full border border-slate-700 bg-slate-800 shadow-md hover:bg-slate-700 text-white"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {creatorNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                  isCollapsed ? "justify-center" : "space-x-3"
                )}
              >
                <item.icon
                  size={20}
                  className={cn("relative z-10", isActive ? "text-white" : "group-hover:text-primary transition-colors")}
                />
                {!isCollapsed && (
                  <span className="relative z-10 font-medium">{item.name}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        {!isCollapsed && creatorProfile && (
          <div className="mb-4 px-2 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Session</p>
            <p className="text-sm font-bold text-white truncate">{creatorProfile.full_name}</p>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors",
            isCollapsed ? "justify-center" : "space-x-3"
          )}
          onClick={() => logout()}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Quitter l&apos;espace</span>}
        </motion.button>
      </div>
    </motion.div>
  );
}

export function CreatorMobileNav() {
  const pathname = usePathname();
  const { logout, creatorProfile } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-slate-900">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-slate-900 border-slate-800">
        <SheetTitle className="sr-only">Menu Créateur</SheetTitle>
        <div className="flex items-center space-x-3 w-full h-20 px-6 border-b border-slate-800">
          <Image
            src="/logo-icone.png"
            alt="Papiers Express"
            width={32}
            height={32}
            className="h-8 w-8 object-contain brightness-0 invert"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight tracking-tight text-white">My Space</span>
            <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">Creator Pro</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {creatorNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                <div
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all duration-200 space-x-3",
                    isActive
                      ? "bg-primary text-white shadow-md font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          {creatorProfile && (
            <div className="mb-4 px-4 py-3 bg-slate-800 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Connecté en tant que</p>
              <p className="text-sm font-bold text-white">{creatorProfile.full_name}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
            onClick={() => {
              setOpen(false);
              logout();
            }}
          >
            <LogOut size={20} className="mr-3" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
