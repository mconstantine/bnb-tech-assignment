export function formatDateTime(date: Date): string {
  return (
    date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US")
  );
}
