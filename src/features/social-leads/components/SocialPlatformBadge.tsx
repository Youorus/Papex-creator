import { Badge } from "@/shared/components/ui/badge";
import { SocialPlatform } from "../types";
import { cn } from "@/lib/utils";
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  Linkedin, 
  Globe,
  Video
} from "lucide-react";

interface SocialPlatformBadgeProps {
  platform: SocialPlatform;
  className?: string;
}

const platformMap: Record<SocialPlatform, { label: string; icon: any; className: string }> = {
  TIKTOK: { label: "TikTok", icon: Video, className: "bg-black text-white border-black" },
  INSTAGRAM: { label: "Instagram", icon: Instagram, className: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  YOUTUBE: { label: "YouTube", icon: Youtube, className: "bg-red-500/10 text-red-500 border-red-500/20" },
  FACEBOOK: { label: "Facebook", icon: Facebook, className: "bg-blue-600/10 text-blue-600 border-blue-600/20" },
  LINKEDIN: { label: "LinkedIn", icon: Linkedin, className: "bg-blue-700/10 text-blue-700 border-blue-700/20" },
  OTHER: { label: "Autre", icon: Globe, className: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
};

export function SocialPlatformBadge({ platform, className }: SocialPlatformBadgeProps) {
  const config = platformMap[platform] || platformMap.OTHER;
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className={cn("font-medium gap-1.5", config.className, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
