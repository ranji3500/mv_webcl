import { format, parseISO, isToday } from "date-fns";

export const formatDateCustom = (dateString: string): string => {
  const date = parseISO(new Date(dateString).toISOString());

  if (isToday(date)) {
    return `Today, ${format(date, "dd MMM yyyy")}`;
  }

  return format(date, "EEE, dd MMM yyyy");
};
