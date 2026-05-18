import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { ReactNode } from "react";

interface ResponsiveDataViewProps<T> {
  data: T[];
  renderDesktopTable: () => ReactNode;
  renderMobileCard: (item: T) => ReactNode;
  emptyState?: ReactNode;
}

export function ResponsiveDataView<T>({ 
  data, 
  renderDesktopTable, 
  renderMobileCard,
  emptyState
}: ResponsiveDataViewProps<T>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground bg-card/50 rounded-xl border border-border/50">
        {emptyState || "Aucune donnée trouvée."}
      </div>
    );
  }

  if (isDesktop) {
    return <>{renderDesktopTable()}</>;
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <div key={index}>
          {renderMobileCard(item)}
        </div>
      ))}
    </div>
  );
}
