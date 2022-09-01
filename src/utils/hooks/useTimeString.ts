import dayjs from 'dayjs';

export default function useTimeInstance(hours: number, minutes: number) {
  const newMinutes = minutes % 60;
  const newHours = (hours + Math.floor(minutes / 60)) % 24;
  return dayjs(`${newHours}:${newMinutes} `, `HH:mm`);
}
