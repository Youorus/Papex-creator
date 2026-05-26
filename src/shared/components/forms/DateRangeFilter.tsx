"use client";

import React, { useEffect, useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfToday } from "date-fns";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

interface DateRangeFilterProps {
  onRangeChange: (start: string, end: string) => void;
  initialStart?: string;
  initialEnd?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ 
  onRangeChange,
  initialStart = "",
  initialEnd = ""
}) => {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [shortcut, setShortcut] = useState<string>("custom");

  const handleShortcutChange = (value: string) => {
    setShortcut(value);
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = now;

    switch (value) {
      case "today":
        start = startOfToday();
        end = now;
        break;
      case "last7days":
        start = subDays(now, 7);
        break;
      case "thisMonth":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "thisYear":
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        return;
    }

    if (start && end) {
      const startStr = format(start, "yyyy-MM-dd");
      const endStr = format(end, "yyyy-MM-dd");
      setStartDate(startStr);
      setEndDate(endStr);
      onRangeChange(startStr, endStr);
    }
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    setShortcut("custom");
    if (type === "start") {
      setStartDate(value);
      onRangeChange(value, endDate);
    } else {
      setEndDate(value);
      onRangeChange(startDate, value);
    }
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
      <div className="flex-1 space-y-2">
        <Label htmlFor="shortcut">Période rapide</Label>
        <Select value={shortcut} onValueChange={handleShortcutChange}>
          <SelectTrigger id="shortcut">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Personnalisé</SelectItem>
            <SelectItem value="today">Aujourd&apos;hui</SelectItem>
            <SelectItem value="last7days">7 derniers jours</SelectItem>
            <SelectItem value="thisMonth">Ce mois</SelectItem>
            <SelectItem value="thisYear">Année en cours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label htmlFor="startDate">Date de début</Label>
        <Input 
          id="startDate"
          type="date" 
          value={startDate} 
          onChange={(e) => handleDateChange("start", e.target.value)} 
        />
      </div>

      <div className="flex-1 space-y-2">
        <Label htmlFor="endDate">Date de fin</Label>
        <Input 
          id="endDate"
          type="date" 
          value={endDate} 
          onChange={(e) => handleDateChange("end", e.target.value)} 
        />
      </div>
    </div>
  );
};
