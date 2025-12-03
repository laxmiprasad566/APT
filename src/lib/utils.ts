import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number | null, prefix = "₹") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return `${prefix}${Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export function formatDuration(minutes?: number | null) {
  if (!minutes && minutes !== 0) {
    return "—";
  }

  const hrs = Math.floor(minutes / 60);
  const mins = Math.abs(Math.round(minutes % 60));

  if (hrs <= 0) {
    return `${mins}m`;
  }

  return `${hrs}h ${mins}m`;
}
