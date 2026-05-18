import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  colorPreset?: "violet" | "fuchsia" | "emerald" | "amber" | "cyan" | "rose";
}

const colorMap = {
  violet: "bg-violet-500/10 text-violet-500",
  fuchsia: "bg-fuchsia-500/10 text-fuchsia-500",
  emerald: "bg-emerald-500/10 text-emerald-500",
  amber: "bg-amber-500/10 text-amber-500",
  cyan: "bg-cyan-500/10 text-cyan-500",
  rose: "bg-rose-500/10 text-rose-500",
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  colorPreset = "violet",
}: MetricCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className={cn("overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={cn("p-2 rounded-xl", colorMap[colorPreset])}>
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          {(description || trend) && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              {trend && (
                <span
                  className={cn(
                    "font-semibold mr-1.5 px-1.5 py-0.5 rounded-md",
                    trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
              )}
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
