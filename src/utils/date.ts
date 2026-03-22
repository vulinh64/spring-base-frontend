function formatUtcOffset(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset();
  if (offsetMinutes === 0) return "UTC";
  const sign = offsetMinutes > 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return minutes === 0 ? `UTC${sign}${hours}` : `UTC${sign}${hours}:${pad(minutes)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} ${formatUtcOffset(d)}`;
}
