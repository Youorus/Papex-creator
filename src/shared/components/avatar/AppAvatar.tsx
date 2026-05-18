import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AppAvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function AppAvatar({ src, name, email, className, fallbackClassName }: AppAvatarProps) {
  const getInitials = () => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email && email.trim().length > 0) {
      return email.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  return (
    <Avatar className={cn("h-10 w-10 border border-border/50", className)}>
      <AvatarImage src={src || undefined} alt={name || email || "Avatar"} />
      <AvatarFallback className={cn("bg-primary/10 text-primary font-semibold text-sm", fallbackClassName)}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
