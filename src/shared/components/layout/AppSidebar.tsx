"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/shared/components/ui/button";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Créateurs", href: "/creators", icon: Users },
  { name: "Leads Sociaux", href: "/social-leads", icon: MessageSquare },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="relative flex flex-col h-screen bg-card/80 backdrop-blur-xl border-r shadow-sm z-20"
    >
      <div className="flex items-center justify-between h-20 px-4 border-b border-border/50">
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
              className="h-10 w-10 object-contain drop-shadow-sm" 
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-[#173083] dark:text-blue-400">Papiers Express</span>
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Creator</span>
            </div>
          </motion.div>
        )}
        {isCollapsed && (
          <Image 
            src="/logo-icone.png" 
            alt="Papiers Express" 
            width={40}
            height={40}
            className="h-10 w-10 mx-auto object-contain drop-shadow-sm" 
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background shadow-md hover:bg-accent", isCollapsed ? "right-[-16px]" : "right-[-16px]")}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "text-white shadow-md"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  isCollapsed ? "justify-center" : "space-x-3"
                )}
              >
                {/* Active Background Gradient */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#173083] to-[#2546b5] opacity-90"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <item.icon
                  size={20}
                  className={cn("relative z-10", isActive ? "text-white" : "group-hover:text-[#173083] dark:group-hover:text-blue-400 transition-colors")}
                />
                
                {!isCollapsed && (
                  <span className="relative z-10 font-medium">{item.name}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors",
            isCollapsed ? "justify-center" : "space-x-3"
          )}
          onClick={() => logout()}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Déconnexion</span>}
        </motion.button>
      </div>
    </motion.div>
  );
}
